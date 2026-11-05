import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  Move,
  Layers,
  Crosshair,
  Maximize,
  Minimize,
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
  const [elevation, setElevation] = useState(8); // -30 to +30 degrees
  const [zoom, setZoom] = useState(1.0); // 0.75 to 2.4
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'minimized' | 'maximized'
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, startAngle: 0, startElevation: 0 });
  const touchDistanceRef = useRef(null);
  const autoRotateReqRef = useRef(null);

  const isDrone = !product?.hardwareType || product?.hardwareType === 'drone';

  // Determine frame sequence
  const frames = isDrone
    ? DRONE_TURNTABLE_FRAMES
    : [product?.image, ...(product?.gallery || [])].filter(Boolean);

  const totalFrames = frames.length > 0 ? frames.length : 1;

  // Calculate active frame based on continuous horizontal angle
  const normalizedAngle = ((angle % 360) + 360) % 360;
  const frameIndex = Math.floor((normalizedAngle / 360) * totalFrames) % totalFrames;
  const currentFrameUrl = frames[frameIndex] || product?.image;

  // Calculate micro-perspective tilt between frames for ultra-smooth 3D depth
  const degreesPerFrame = 360 / totalFrames;
  const subAngle = ((normalizedAngle % degreesPerFrame) - degreesPerFrame / 2) * 0.45;

  // Auto-rotation animation loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    let lastTime = performance.now();
    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      setAngle((prev) => (prev + (delta * 0.035)) % 360);
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
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startAngle: angle,
      startElevation: elevation,
    };
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newAngle = ((dragStartRef.current.startAngle + deltaX * 0.65) % 360 + 360) % 360;
    const newElevation = Math.max(-28, Math.min(28, dragStartRef.current.startElevation - deltaY * 0.35));

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

  // Quick View Preset Angles
  const setPresetAngle = (deg, elev = 8) => {
    setAngle(deg);
    setElevation(elev);
  };

  const resetView = () => {
    setAngle(initialAngle);
    setElevation(8);
    setZoom(1.0);
    setAutoRotate(false);
  };

  const toggleMaximize = () => {
    const nextState = viewState === 'maximized' ? 'normal' : 'maximized';
    setViewState(nextState);
    if (onMaximizeChange) onMaximizeChange(nextState === 'maximized');
  };

  const toggleMinimize = () => {
    setViewState((prev) => (prev === 'minimized' ? 'normal' : 'minimized'));
  };

  // ==========================================================
  // 1. MINIMIZED FLOATING PREVIEW WIDGET
  // ==========================================================
  if (viewState === 'minimized') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#00C8FF]/50 bg-[#07111F]/95 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl text-[#F5F8FC]"
      >
        <div className="relative h-14 w-14 rounded-xl bg-[#101B2A] flex items-center justify-center overflow-hidden border border-[#101B2A]">
          <img
            src={currentFrameUrl}
            alt={product?.name}
            className="h-12 w-12 object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/60 to-transparent pointer-events-none" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#00C8FF] uppercase tracking-wider font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
            3D Turntable: {Math.round(normalizedAngle)}°
          </div>
          <p className="text-xs font-bold text-[#F5F8FC] truncate max-w-[140px]">
            {product?.name || 'Interactive Model'}
          </p>
        </div>
        <button
          onClick={toggleMinimize}
          className="ml-2 flex items-center gap-1 rounded-xl bg-[#00C8FF] px-3 py-1.5 text-[11px] font-bold text-[#07111F] hover:bg-cyan-300 transition"
          title="Restore 3D Product Viewer"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Restore</span>
        </button>
      </motion.div>
    );
  }

  // ==========================================================
  // 2. NORMAL & MAXIMIZED IMMERSIVE TURNTABLE VIEWPORT
  // ==========================================================
  const containerClasses =
    viewState === 'maximized'
      ? 'fixed inset-0 z-[110] bg-[#07111F]/98 backdrop-blur-2xl p-4 sm:p-8 flex flex-col justify-between'
      : `relative w-full rounded-3xl border border-[#101B2A] bg-[#07111F] overflow-hidden select-none ${className}`;

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
        <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-[#00C8FF]/20 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00C8FF]">
            000° N
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 font-mono text-[9px] text-[#00C8FF]">
            180° S
          </div>
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00C8FF]">
            270° W
          </div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00C8FF]">
            090° E
          </div>
        </div>
        <div className="absolute h-52 w-52 sm:h-64 sm:w-64 rounded-full border border-dashed border-[#00C8FF]/20" />
        <div className="absolute flex items-center justify-center text-[#00C8FF]/20">
          <Crosshair className="h-32 w-32 stroke-[1]" />
        </div>
      </div>

      {/* Atmospheric Rim Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.22)_0,rgba(16,27,42,0.4)_45%,transparent_75%)] blur-2xl -z-10" />

      {/* TOP HUD BAR */}
      <div className="relative z-20 flex items-center justify-between gap-3 p-4 border-b border-[#101B2A] bg-[#07111F]/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#00C8FF] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00C8FF]">
            360° Real-Time Turntable
          </span>
          <span className="hidden sm:inline-block rounded border border-[#00C8FF]/30 bg-[#00C8FF]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#00C8FF]">
            AZIMUTH: {Math.round(normalizedAngle)}° // ELEV: {Math.round(elevation)}°
          </span>
        </div>

        {/* Top Action Icons (Minimize, Maximize / Fullscreen) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMinimize}
            className="rounded-lg p-2 text-[#AAB7C7] hover:bg-[#101B2A] hover:text-[#F5F8FC] transition"
            title="Minimize to floating preview"
          >
            <Minimize className="h-4 w-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="rounded-lg p-2 text-[#00C8FF] hover:bg-[#101B2A] hover:text-[#F5F8FC] transition"
            title={viewState === 'maximized' ? 'Exit Fullscreen' : 'Maximize Fullscreen'}
          >
            {viewState === 'maximized' ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* INTERACTIVE 3D CANVAS STAGE */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative flex flex-1 items-center justify-center p-6 sm:p-10 cursor-grab active:cursor-grabbing ${
          viewState === 'maximized' ? 'min-h-[60vh]' : 'min-h-[380px] sm:min-h-[460px]'
        }`}
      >
        {/* Floating 3D Product Image with Multi-Angle Interpolation */}
        <div
          style={{
            transform: `perspective(1200px) rotateX(${elevation}deg) rotateY(${subAngle}deg) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className="relative flex items-center justify-center max-w-full"
        >
          <img
            src={currentFrameUrl}
            alt={product?.name || '3D Product'}
            draggable={false}
            className="max-h-[36vh] sm:max-h-[44vh] max-w-[85%] object-contain select-none filter drop-shadow-[0_25px_50px_rgba(0,200,255,0.35)] drop-shadow-[0_0_20px_rgba(0,200,255,0.2)]"
          />

          {/* Dynamic Ground Shadow */}
          <div
            style={{
              transform: `scale(${zoom * (1 + elevation * 0.005)})`,
              opacity: Math.max(0.3, 0.8 - elevation * 0.015),
            }}
            className="pointer-events-none absolute -bottom-6 h-6 w-3/4 max-w-[420px] rounded-full bg-[#00C8FF]/20 blur-xl -z-10"
          />
        </div>

        {/* Drag Hint Overlay */}
        {!isDragging && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#07111F]/80 px-3 py-1 font-mono text-[10px] text-[#AAB7C7] backdrop-blur">
            <Move className="h-3 w-3 text-[#00C8FF]" />
            <span>DRAG TO ROTATE 360° // SCROLL TO ZOOM</span>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL PANEL HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 border-t border-[#101B2A] bg-[#07111F]/80 backdrop-blur-md">
        {/* Quick Angle Presets */}
        <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px]">
          <span className="hidden md:inline text-[#AAB7C7] mr-1">PRESETS:</span>
          {[
            { label: '0° Front', deg: 0 },
            { label: '90° Right', deg: 90 },
            { label: '180° Rear', deg: 180 },
            { label: '270° Left', deg: 270 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPresetAngle(preset.deg)}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                Math.abs(normalizedAngle - preset.deg) < 15
                  ? 'bg-[#00C8FF] text-[#07111F] font-bold shadow-[0_0_12px_rgba(0,200,255,0.6)]'
                  : 'bg-[#101B2A] text-[#AAB7C7] hover:text-[#F5F8FC]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Main Controls: Auto-Rotate, Zoom In/Out, Reset */}
        <div className="flex items-center gap-2">
          {/* Zoom Level Readout */}
          <span className="font-mono text-[10px] text-[#00C8FF] bg-[#101B2A] px-2 py-1 rounded-lg border border-[#101B2A]">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom Out */}
          <button
            onClick={() => setZoom((prev) => Math.max(0.75, prev - 0.15))}
            className="rounded-lg p-2 text-[#AAB7C7] hover:bg-[#101B2A] hover:text-[#F5F8FC] border border-[#101B2A] transition"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => setZoom((prev) => Math.min(2.4, prev + 0.15))}
            className="rounded-lg p-2 text-[#AAB7C7] hover:bg-[#101B2A] hover:text-[#F5F8FC] border border-[#101B2A] transition"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              autoRotate
                ? 'bg-[#00C8FF] text-[#07111F] shadow-[0_0_15px_rgba(0,200,255,0.6)]'
                : 'bg-[#101B2A] text-[#F5F8FC] hover:text-[#00C8FF] border border-[#101B2A]'
            }`}
            title="Auto Rotate 360°"
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Auto Rotate</span>
          </button>

          {/* Reset View */}
          <button
            onClick={resetView}
            className="rounded-lg p-2 text-[#AAB7C7] hover:bg-[#101B2A] hover:text-[#F5F8FC] border border-[#101B2A] transition"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
