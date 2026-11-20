import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Compass,
  Move,
  Crosshair,
  Layers,
  Sparkles,
} from 'lucide-react';

// Multi-angle turntable frames for drones
const DRONE_TURNTABLE_FRAMES = [
  '/images/drones/drone_0.png', // 0° Front
  '/images/drones/drone_1.png', // 60° Front-Right
  '/images/drones/drone_2.png', // 120° Rear-Right
  '/images/drones/drone_3.png', // 180° Rear
  '/images/drones/drone_4.png', // 240° Rear-Left
  '/images/drones/drone_5.png', // 300° Front-Left
];

export default function Interactive3DViewer({
  product,
  initialAngle = 35,
  className = '',
  onMaximizeChange,
}) {
  const [angle, setAngle] = useState(initialAngle); // 0 to 360 degrees
  const [elevation, setElevation] = useState(8); // -25 to +28 degrees
  const [zoom, setZoom] = useState(1.0); // 0.75 to 2.4
  const [autoRotate, setAutoRotate] = useState(true); // Default to automatic slow rotation
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, startAngle: 0, startElevation: 0 });
  const touchDistanceRef = useRef(null);
  const autoRotateReqRef = useRef(null);
  const idleResumeTimerRef = useRef(null);
  const autoRotateEnabledUserRef = useRef(true);

  const isDrone = !product?.hardwareType || product?.hardwareType === 'drone';

  // Determine frame sequence
  const frames = isDrone
    ? DRONE_TURNTABLE_FRAMES
    : [product?.image, ...(product?.gallery || [])].filter(Boolean);

  const totalFrames = frames.length > 0 ? frames.length : 1;

  // Calculate active frame based on continuous horizontal angle
  const normalizedAngle = ((angle % 360) + 360) % 360;
  const frameIndex = Math.floor((normalizedAngle / 360) * totalFrames) % totalFrames;
  
  // For drones at extreme top view (> 22°), use top blueprint angle if available
  const currentFrameUrl =
    isDrone && elevation > 22
      ? '/images/drones/ref1_drone_top.png'
      : frames[frameIndex] || product?.image;

  // Micro-perspective tilt interpolation between frames for ultra-smooth 3D depth
  const degreesPerFrame = 360 / totalFrames;
  const subAngle = ((normalizedAngle % degreesPerFrame) - degreesPerFrame / 2) * 0.45;

  // Preload images into memory
  useEffect(() => {
    frames.forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, [frames]);

  // Continuous Auto-Rotation loop: pauses while dragging
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    let lastTime = performance.now();
    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      setAngle((prev) => (prev + delta * 0.032) % 360);
      autoRotateReqRef.current = requestAnimationFrame(animate);
    };

    autoRotateReqRef.current = requestAnimationFrame(animate);
    return () => {
      if (autoRotateReqRef.current) cancelAnimationFrame(autoRotateReqRef.current);
    };
  }, [autoRotate, isDragging]);

  // Pointer drag events (Mouse & Touch single finger)
  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    
    // Clear any pending auto-resume timer
    if (idleResumeTimerRef.current) {
      clearTimeout(idleResumeTimerRef.current);
      idleResumeTimerRef.current = null;
    }

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startAngle: angle,
      startElevation: elevation,
    };

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newAngle = ((dragStartRef.current.startAngle + deltaX * 0.65) % 360 + 360) % 360;
    const newElevation = Math.max(-25, Math.min(28, dragStartRef.current.startElevation - deltaY * 0.35));

    setAngle(newAngle);
    setElevation(newElevation);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }

    // Auto-resume slow rotation after 2 seconds of inactivity (if user didn't explicitly pause it)
    if (autoRotateEnabledUserRef.current) {
      idleResumeTimerRef.current = setTimeout(() => {
        setAutoRotate(true);
      }, 2000);
    }
  };

  // Touch Pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = (newDist - touchDistanceRef.current) * 0.005;
      setZoom((prev) => Math.max(0.75, Math.min(2.4, prev + scaleDelta)));
      touchDistanceRef.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomStep = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom((prev) => Math.max(0.75, Math.min(2.4, prev + zoomStep)));
  };

  // Preset Views: Front, Side, Rear, Top
  const setPresetAngle = (deg, elev = 8) => {
    setAngle(deg);
    setElevation(elev);
  };

  // Reset View
  const resetView = () => {
    setAngle(initialAngle);
    setElevation(8);
    setZoom(1.0);
    setAutoRotate(true);
    autoRotateEnabledUserRef.current = true;
  };

  // Toggle Auto Rotate manually
  const toggleAutoRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    autoRotateEnabledUserRef.current = next;
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (onMaximizeChange) onMaximizeChange(next);
  };

  // Keyboard controls for fullscreen & presets
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (onMaximizeChange) onMaximizeChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onMaximizeChange]);

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-[120] bg-[#050b14]/98 backdrop-blur-2xl p-4 sm:p-8 flex flex-col justify-between'
    : `relative w-full rounded-3xl border border-white/10 bg-[#08121f] overflow-hidden select-none ${className}`;

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{ touchAction: 'none' }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Cybernetic Radar Ring & Grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden -z-10 opacity-35">
        <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-[#00C8E8]/20 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00C8E8]">
            000° FRONT
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 font-mono text-[9px] text-[#00C8E8]">
            180° REAR
          </div>
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00C8E8]">
            270° LEFT
          </div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00C8E8]">
            090° RIGHT
          </div>
        </div>
        <div className="absolute h-52 w-52 sm:h-64 sm:w-64 rounded-full border border-dashed border-[#00C8E8]/20" />
        <div className="absolute flex items-center justify-center text-[#00C8E8]/20">
          <Crosshair className="h-32 w-32 stroke-[1]" />
        </div>
      </div>

      {/* Atmospheric Rim Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,232,0.22)_0,rgba(16,27,42,0.4)_45%,transparent_75%)] blur-2xl -z-10" />

      {/* TOP HUD BAR */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#101B2A] bg-[#07111F]/75 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#00C8E8] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00C8E8]">
            360° INTERACTIVE VIEW
          </span>
          <span className="rounded border border-[#00C8E8]/30 bg-[#00C8E8]/10 px-2 py-0.5 font-mono text-[10px] text-[#00C8E8]">
            AZIMUTH: {Math.round(normalizedAngle)}° // ELEV: {Math.round(elevation)}°
          </span>
        </div>

        {/* Blueprint Mode Toggle & Fullscreen Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBlueprintMode(!blueprintMode)}
            className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider border transition ${
              blueprintMode
                ? 'bg-cyan-400 text-[#031018] border-cyan-300 shadow-[0_0_12px_rgba(0,200,232,0.6)]'
                : 'border-white/10 bg-[#101B2A] text-slate-300 hover:text-white'
            }`}
          >
            {blueprintMode ? 'Blueprint: Active' : 'Blueprint Grid'}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-lg p-2 text-[#00C8E8] hover:bg-[#101B2A] hover:text-white border border-[#101B2A] transition"
            title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Fullscreen 360° View'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic HUD Compass Heading Strip */}
      <div className="relative z-15 flex items-center justify-center border-b border-white/5 bg-[#050b14]/90 py-1 px-4 overflow-hidden pointer-events-none">
        <div className="flex items-center gap-6 font-mono text-[9px] text-cyan-400/70 tracking-widest">
          {[-60, -30, 0, 30, 60].map((offset) => {
            const heading = ((Math.round(normalizedAngle) + offset) % 360 + 360) % 360;
            const isCenter = offset === 0;
            return (
              <span
                key={offset}
                className={isCenter ? 'text-cyan-300 font-bold text-[11px] border-b-2 border-cyan-400 pb-0.5' : 'opacity-40'}
              >
                {String(heading).padStart(3, '0')}°
              </span>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE 3D CANVAS STAGE */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative flex flex-1 items-center justify-center p-6 sm:p-10 cursor-grab active:cursor-grabbing ${
          blueprintMode ? 'blueprint-grid' : ''
        } ${
          isFullscreen ? 'min-h-[65vh]' : 'min-h-[380px] sm:min-h-[460px]'
        }`}
      >
        {/* Floating 3D Product Image with Multi-Angle & 3D Perspective Interpolation */}
        <div
          style={{
            transform: `perspective(1200px) rotateX(${elevation}deg) rotateY(${subAngle}deg) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.22s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className="relative flex items-center justify-center max-w-full"
        >
          <img
            src={currentFrameUrl}
            alt={product?.name || '3D Product Model'}
            draggable={false}
            className={`max-h-[36vh] sm:max-h-[44vh] max-w-[85%] object-contain select-none filter drop-shadow-[0_25px_50px_rgba(0,200,232,0.35)] drop-shadow-[0_0_20px_rgba(0,200,232,0.2)] transition-all ${
              blueprintMode ? 'hue-rotate-180 brightness-125 contrast-150' : ''
            }`}
          />

          {/* Dynamic Ground Shadow that scales and fades with elevation */}
          <div
            style={{
              transform: `scale(${zoom * (1 + elevation * 0.005)})`,
              opacity: Math.max(0.3, 0.8 - elevation * 0.015),
            }}
            className="pointer-events-none absolute -bottom-6 h-6 w-3/4 max-w-[420px] rounded-full bg-[#00C8E8]/20 blur-xl -z-10"
          />

          {/* Interactive Hotspot Pins on Drones */}
          {isDrone && !isDragging && (
            <>
              {[
                {
                  id: 'gimbal',
                  title: '40x Optical EO/IR Gimbal',
                  tag: 'OPTICAL SENSOR',
                  desc: 'Continuous optical magnification paired with a 640x512 radiometric thermal FLIR sensor.',
                  top: '68%',
                  left: '42%',
                },
                {
                  id: 'rotor',
                  title: 'Carbon-Fiber Quick-Lock Blades',
                  tag: 'PROPULSION',
                  desc: 'High-thrust low-acoustic composite rotors with IP55 sealed brushless motors.',
                  top: '28%',
                  left: '74%',
                },
                {
                  id: 'rtk',
                  title: 'Dual RTK GNSS Mast',
                  tag: 'NAVIGATION',
                  desc: 'Multi-constellation GPS/GLONASS/Galileo receiver with sub-centimeter ±1.5cm accuracy.',
                  top: '22%',
                  left: '32%',
                },
              ].map((hp) => (
                <div
                  key={hp.id}
                  style={{ top: hp.top, left: hp.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(activeHotspot === hp.id ? null : hp.id);
                    }}
                    onMouseEnter={() => setActiveHotspot(hp.id)}
                    className="group relative flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300 bg-[#050b14]/90 text-cyan-300 shadow-[0_0_12px_rgba(0,200,232,0.8)] transition-transform hover:scale-125"
                    aria-label={hp.title}
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping absolute" />
                    <Crosshair className="h-3.5 w-3.5" />
                  </button>

                  {/* Hotspot Telemetry Popover */}
                  {activeHotspot === hp.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-9 left-1/2 -translate-x-1/2 w-56 rounded-2xl border border-cyan-400/50 bg-[#050b14]/95 p-3 text-left shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl z-50 pointer-events-auto"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                          {hp.tag}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </div>
                      <h4 className="font-display text-xs font-bold text-white">{hp.title}</h4>
                      <p className="mt-1 text-[10px] text-slate-300 leading-relaxed">{hp.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drag Instruction Overlay (Fades out while actively dragging) */}
        <div
          className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-[#00C8E8]/50 bg-[#080F1B]/90 px-4 py-1.5 font-mono text-xs font-bold text-[#00C8E8] shadow-[0_0_20px_rgba(0,200,232,0.4)] backdrop-blur-md transition-opacity duration-300 ${
            isDragging ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Move className="h-3.5 w-3.5 text-[#00C8E8] animate-pulse" />
          <span>DRAG TO ROTATE 360°</span>
          <span className="text-[10px] text-slate-400">◄ ►</span>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 border-t border-[#101B2A] bg-[#07111F]/80 backdrop-blur-md">
        {/* Quick Angle Presets: Front, Side, Rear, Top */}
        <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px]">
          <span className="hidden md:inline text-[#AAB7C6] mr-1 uppercase">Views:</span>
          {[
            { label: 'Front', deg: 0, elev: 8 },
            { label: 'Side', deg: 90, elev: 8 },
            { label: 'Rear', deg: 180, elev: 8 },
            { label: 'Top', deg: 0, elev: 28 },
          ].map((preset) => {
            const isActive =
              Math.abs(normalizedAngle - preset.deg) < 18 && Math.abs(elevation - preset.elev) < 12;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPresetAngle(preset.deg, preset.elev)}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  isActive
                    ? 'bg-[#00C8E8] text-[#080F1B] font-bold shadow-[0_0_12px_rgba(0,200,232,0.6)]'
                    : 'bg-[#101B2B] text-[#AAB7C6] hover:text-[#F5F8FC]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Main Controls: Auto-Rotate, Zoom In/Out, Reset View */}
        <div className="flex items-center gap-2">
          {/* Zoom Level Readout */}
          <span className="font-mono text-[10px] text-[#00C8E8] bg-[#101B2A] px-2.5 py-1 rounded-lg border border-[#101B2A]">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom Out (-) */}
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(0.75, prev - 0.15))}
            className="rounded-lg p-2 text-[#AAB7C6] hover:bg-[#101B2A] hover:text-[#F5F8FC] border border-[#101B2A] transition active:scale-95"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          {/* Zoom In (+) */}
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(2.4, prev + 0.15))}
            className="rounded-lg p-2 text-[#AAB7C6] hover:bg-[#101B2A] hover:text-[#F5F8FC] border border-[#101B2A] transition active:scale-95"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={toggleAutoRotate}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
              autoRotate
                ? 'bg-[#00C8E8] text-[#080F1B] shadow-[0_0_15px_rgba(0,200,232,0.6)] font-bold'
                : 'bg-[#101B2A] text-[#F5F8FC] hover:text-[#00C8E8] border border-[#101B2A]'
            }`}
            title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'Pause' : 'Auto Rotate'}</span>
          </button>

          {/* Reset View (↺) */}
          <button
            type="button"
            onClick={resetView}
            className="flex items-center gap-1 rounded-lg p-2 text-[#AAB7C6] hover:bg-[#101B2A] hover:text-[#00C8E8] border border-[#101B2A] transition active:scale-95"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden lg:inline text-[10px] font-mono uppercase">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
