import { useEffect, useRef, useState, useCallback } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Activity,
  ChevronDown,
  Crosshair,
  Layers,
  Play,
  Radio,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Target,
  Maximize2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Magnetic } from '@/components/motion';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';

const HERO_BG =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=2560';

const HERO_MODES = {
  defence: {
    id: 'defence',
    tag: '01 // ISR DEFENCE',
    productName: 'AEGIS SENTINEL MK-IV',
    productId: 'aegis-mk4',
    image: '/images/drones/hero-flagship.png',
    badge: 'DEFENCE & SECURITY // NON-WEAPONIZED ISR',
    headlineAction: 'Serve.',
    accentColor: '#22d3ee',
    ringBorder: 'border-cyan-400/30',
    glowBg: 'rgba(34, 211, 238, 0.35)',
    telemetry: [
      { label: 'ALTITUDE', value: '2,400 M ASL' },
      { label: 'LOITER', value: '55 MIN' },
      { label: 'OPTICAL', value: '40x EO/IR + FLIR' },
      { label: 'C2 LINK', value: '25 KM AES-256' },
    ],
    statusText: 'TACTICAL PERSISTENT SURVEILLANCE AIRSPACE',
  },
  agriculture: {
    id: 'agriculture',
    tag: '02 // PRECISION AGRI',
    productName: 'TERRA SPRAY X-40',
    productId: 'terra-spray-x40',
    image: '/images/drones/heavy-hex.png',
    badge: 'PRECISION AGRICULTURE // ATOMIZING SPRAY',
    headlineAction: 'Nourish.',
    accentColor: '#4ade80',
    ringBorder: 'border-emerald-400/30',
    glowBg: 'rgba(74, 222, 128, 0.35)',
    telemetry: [
      { label: 'PAYLOAD', value: '40-LITER TANK' },
      { label: 'PACE', value: '45 ACRES / HR' },
      { label: 'DROPLET', value: '50–500 MICRONS' },
      { label: 'ACCURACY', value: '±1.5 CM RTK' },
    ],
    statusText: 'CENTRIFUGAL SPRAY & 5-BAND NDVI ACTIVE',
  },
  c2: {
    id: 'c2',
    tag: '03 // TACTICAL C2',
    productName: 'RC PRO TACTICAL CONSOLE',
    productId: 'rc-pro-tactical',
    image: '/images/drones/mavic-tactical.png',
    badge: 'COMMAND & CONTROL // DAYLIGHT CONSOLE',
    headlineAction: 'Command.',
    accentColor: '#fbbf24',
    ringBorder: 'border-amber-400/30',
    glowBg: 'rgba(251, 191, 36, 0.35)',
    telemetry: [
      { label: 'DISPLAY', value: '2,000 NITS ULTRA-BRIGHT' },
      { label: 'RUNTIME', value: '8.5 HOURS' },
      { label: 'RF BAND', value: '2.4 / 5.8 GHz HOP' },
      { label: 'SECURITY', value: 'AES-256 HARDWARE' },
    ],
    statusText: 'MULTI-UAV HANDOFF & FIELD ENCRYPTION',
  },
};

export default function Hero({ onOpenShowcase }) {
  const containerRef = useRef(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [mode, setMode] = useState('defence');
  const [isHovered, setIsHovered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const currentMode = HERO_MODES[mode] || HERO_MODES.defence;

  // Web Audio subtle UI synthesizer
  const playHudTone = useCallback((freq = 580) => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [soundOn]);

  const switchMode = (newMode) => {
    setMode(newMode);
    playHudTone(640);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], shouldReduceMotion ? [0, 0] : [0, 120]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-9, 9]), { stiffness: 120, damping: 20 });
  const droneShiftX = useSpring(useTransform(mouseX, [0, 1], [-14, 14]), { stiffness: 110, damping: 20 });
  const droneShiftY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), { stiffness: 110, damping: 20 });

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || isTouch || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate min-h-[94svh] w-full overflow-hidden bg-[#050b14] text-[#f1f5f9] pt-24 pb-10 flex flex-col justify-center select-none"
    >
      {/* Background Imagery + Parallax */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: bgY }}
        className="pointer-events-none absolute inset-0 -z-30 h-[120%]"
      >
        <img
          src={HERO_BG}
          alt="ZIPI Drones & Controls flight airfield"
          className="h-full w-full object-cover object-center opacity-20 brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14] via-[#050b14]/85 to-[#050b14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(34,211,238,0.16)_0,rgba(11,26,44,0.6)_45%,transparent_75%)]" />
      </motion.div>

      {/* Faint 48px Mission Grid Overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 hero-grid-overlay" />

      {/* Looping SVG Flight Path */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 500"
        fill="none"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M-40 380 C 220 260, 440 440, 720 220 C 900 80, 1080 180, 1240 90"
          stroke="url(#flightGrad)"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.25 }}
          animate={
            shouldReduceMotion
              ? { pathLength: 1, opacity: 0.45 }
              : { pathLength: [0, 1, 1], opacity: [0.25, 0.85, 0.25] }
          }
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="flightGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Container */}
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
            {/* Mode Switcher Tabs */}
            <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-[#08121f]/90 p-1 backdrop-blur-md">
              {Object.values(HERO_MODES).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => switchMode(m.id)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                    mode === m.id
                      ? 'bg-cyan-400 text-[#031018] shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.tag}
                </button>
              ))}
            </div>

            <motion.div
              key={currentMode.id + '-badge'}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/35 bg-[#0b1a2c]/90 px-3.5 py-1.5 backdrop-blur-md"
            >
              <img
                src="/images/zipi-crest.png"
                alt="ZIPI Crest"
                className="h-4 w-4 object-contain"
              />
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                {currentMode.badge}
              </span>
            </motion.div>

            {/* Brand Eyebrow Heading */}
            <span className="mt-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00C8E8] block">
              ZIPI — DRONES &amp; CONTROLLERS
            </span>

            {/* Headline with progressive slide-up reveal */}
            <h1 className="mt-2 font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05]">
              <span className="block text-[#F5F8FC]">
                ENGINEERED TO
              </span>
              <span className="block bg-gradient-to-r from-[#00C8E8] via-[#55A8FF] to-[#00C8E8] bg-clip-text text-transparent">
                FLY BEYOND.
              </span>
            </h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#AAB7C6]"
            >
              Discover next-generation UAV drones and intelligent remote control systems designed for precision, performance and reliability.
            </motion.p>

            {/* Primary Magnetic & Reusable Animated CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <PrimaryButton to="/products?category=uav-drones" showArrow shimmer magnetic>
                Explore Drones
              </PrimaryButton>

              <SecondaryButton to="/controllers" magnetic>
                Discover Controllers
              </SecondaryButton>

              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/10 bg-[#101B2B]/80 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#00C8E8] hover:border-[#00C8E8]/50 transition outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Flight Reel</span>
              </button>

              {/* Optional HUD Audio Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSoundOn(!soundOn);
                  if (!soundOn) playHudTone(880);
                }}
                className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl border border-white/10 bg-[#080D14]/80 px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 hover:text-[#00C9E8] transition"
                title={soundOn ? 'Mute HUD Audio' : 'Enable HUD Audio Synthesizer'}
              >
                {soundOn ? <Volume2 className="h-4 w-4 text-[#00C9E8]" /> : <VolumeX className="h-4 w-4" />}
                <span className="hidden sm:inline">{soundOn ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
              </button>
            </div>

            {/* Dynamic Telemetry Matrix */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl border-t border-white/10 pt-5">
              {currentMode.telemetry.map((item) => (
                <div key={item.label} className="border-l border-cyan-400/30 pl-3">
                  <span className="font-mono text-[10px] text-cyan-400/80 block uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#f1f5f9] mt-0.5 block">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Parallax Drone + Dynamic HUD Reticle + Technical Annotations */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[420px] sm:min-h-[520px] z-10"
          >
            {/* Top-Right Telemetry Card */}
            <div className="pointer-events-none absolute top-0 right-2 sm:right-6 z-20 hidden sm:flex flex-col items-end gap-1.5">
              <div className="telemetry-chip">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C9E8] animate-pulse" />
                <span>LINK: AES-256 // 100% SIGNAL</span>
              </div>
              <div className="font-mono text-[9px] text-slate-400">
                LAT 28°36'12"N • LON 77°12'45"E
              </div>
            </div>

            <motion.div
              style={
                shouldReduceMotion || isTouch
                  ? undefined
                  : { rotateX, rotateY, x: droneShiftX, y: droneShiftY, transformStyle: 'preserve-3d' }
              }
              onMouseEnter={() => {
                setIsHovered(true);
                playHudTone(720);
              }}
              onMouseLeave={() => setIsHovered(false)}
              className="hud-bracket relative w-full flex flex-col items-center justify-center cursor-pointer group p-6 rounded-3xl border border-white/10 bg-[#080D14]/70 backdrop-blur-xl"
              onClick={() => onOpenShowcase?.(currentMode.productId)}
            >
              {/* Four Technical Specification Annotations around the drone */}
              <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
                {/* 1. Camera Payload */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-xl border border-white/15 bg-[#080D14]/90 px-3 py-1.5 backdrop-blur-md shadow-lg transition hover:border-[#00C9E8]">
                  <span className="h-2 w-2 rounded-full bg-[#00C9E8] animate-pulse" />
                  <div className="text-left font-mono">
                    <p className="text-[9px] text-[#00C9E8] font-bold uppercase tracking-wider">Camera Payload</p>
                    <p className="text-[11px] font-bold text-white">40x EO/IR + FLIR Core</p>
                  </div>
                </div>

                {/* 2. Flight Intelligence */}
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-xl border border-white/15 bg-[#080D14]/90 px-3 py-1.5 backdrop-blur-md shadow-lg transition hover:border-[#55A8FF]">
                  <span className="h-2 w-2 rounded-full bg-[#55A8FF] animate-pulse" />
                  <div className="text-right font-mono">
                    <p className="text-[9px] text-[#55A8FF] font-bold uppercase tracking-wider">Flight Intelligence</p>
                    <p className="text-[11px] font-bold text-white">Triple-Sensor IMU Fusion</p>
                  </div>
                </div>

                {/* 3. Secure Connectivity */}
                <div className="absolute bottom-16 left-4 flex items-center gap-2 rounded-xl border border-white/15 bg-[#080D14]/90 px-3 py-1.5 backdrop-blur-md shadow-lg transition hover:border-[#00C9E8]">
                  <span className="h-2 w-2 rounded-full bg-[#00C9E8] animate-pulse" />
                  <div className="text-left font-mono">
                    <p className="text-[9px] text-[#00C9E8] font-bold uppercase tracking-wider">Secure Connectivity</p>
                    <p className="text-[11px] font-bold text-white">AES-256 Frequency-Hop</p>
                  </div>
                </div>

                {/* 4. Precision Control */}
                <div className="absolute bottom-16 right-4 flex items-center gap-2 rounded-xl border border-white/15 bg-[#080D14]/90 px-3 py-1.5 backdrop-blur-md shadow-lg transition hover:border-[#55A8FF]">
                  <span className="h-2 w-2 rounded-full bg-[#55A8FF] animate-pulse" />
                  <div className="text-right font-mono">
                    <p className="text-[9px] text-[#55A8FF] font-bold uppercase tracking-wider">Precision Control</p>
                    <p className="text-[11px] font-bold text-white">Sub-Cm RTK Autonomous</p>
                  </div>
                </div>
              </div>

              {/* Glowing Radar Rings */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
                <div
                  className={`relative h-72 w-72 sm:h-[440px] sm:w-[440px] rounded-full border ${currentMode.ringBorder} ${
                    shouldReduceMotion ? '' : 'animate-spin-slow'
                  }`}
                >
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00C9E8] font-mono text-[9px]">
                    000° N
                  </span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[#00C9E8] font-mono text-[9px]">
                    180° S
                  </span>
                  <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00C9E8] font-mono text-[9px]">
                    270° W
                  </span>
                  <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-[#00C9E8] font-mono text-[9px]">
                    090° E
                  </span>
                </div>
                <div className="absolute h-52 w-52 sm:h-72 sm:w-72 rounded-full border border-dashed border-[#00C9E8]/25" />
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{ scale: [0.6, 1.15], opacity: [0.45, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute h-64 w-64 sm:h-[400px] sm:w-[400px] rounded-full border border-[#00C9E8]/40"
                  />
                )}
              </div>

              {/* Dynamic Atmospheric Spotlight */}
              <div
                className="pointer-events-none absolute inset-0 blur-3xl -z-10 transition-colors duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${currentMode.glowBg} 0%, transparent 70%)`,
                }}
              />

              {/* Targeting Reticle on Hover */}
              <div
                className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="h-44 w-44 sm:h-64 sm:w-64 rounded-full border border-[#00C9E8]/40 flex items-center justify-center">
                  <Crosshair className="h-10 w-10 text-[#00C9E8] animate-spin-slow" />
                </div>
                <div className="absolute top-14 left-6 telemetry-chip">
                  <Target className="h-3 w-3 text-[#00C9E8] animate-pulse" />
                  <span>TARGET ACQUIRED // 40x OPTICAL</span>
                </div>
              </div>

              {/* Drone Floating Image with smooth entrance and continuous subtle hover physics */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMode.id}
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, scale: 1, y: 0 }
                      : {
                          opacity: 1,
                          scale: 1,
                          y: [-5, 6, -5],
                        }
                  }
                  exit={{ opacity: 0, scale: 0.9, y: -15 }}
                  transition={{
                    opacity: { duration: 0.6, ease: 'easeOut' },
                    scale: { duration: 0.6, ease: 'easeOut' },
                    y: shouldReduceMotion
                      ? { duration: 0.6 }
                      : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="relative w-full flex items-center justify-center py-6"
                >
                  <img
                    src={currentMode.image}
                    alt={currentMode.productName}
                    className="w-full max-w-[500px] lg:max-w-[620px] max-h-[340px] sm:max-h-[400px] object-contain filter drop-shadow-[0_24px_60px_rgba(0,201,232,0.42)] transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Hardware Class & 3D Showcase CTA Pill */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShowcase?.(currentMode.productId);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#00C9E8]/40 bg-[#080D14]/95 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[#00C9E8] hover:border-[#00C9E8] hover:bg-[#00C9E8] hover:text-[#031018] transition-all shadow-[0_0_20px_rgba(0,201,232,0.35)]"
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>Inspect 3D Blueprint</span>
                </button>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  <span>MODEL:</span>
                  <strong className="text-white">{currentMode.productName}</strong>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Cue at Bottom */}
        <div className="mt-8 flex justify-center">
          <a
            href="#categories"
            className="inline-flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#94a3b8] hover:text-cyan-300 transition py-2 px-4 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
          >
            <span>Scroll to explore</span>
            <ChevronDown
              className={`h-4 w-4 text-cyan-300 ${shouldReduceMotion ? '' : 'animate-bob'}`}
            />
          </a>
        </div>
      </div>

      {/* Flight Demo Modal */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="ZIPI Flight Demonstration Reel"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-400/40 bg-[#0b1a2c] text-[#f1f5f9] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5 bg-[#050b14]">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">
                    ZIPI DRONES &amp; CONTROLS // FLIGHT DEMONSTRATION REEL
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(false)}
                  aria-label="Close demonstration"
                  className="rounded-full bg-white/10 p-2 text-[#94a3b8] hover:bg-white/20 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1920"
                  alt="UAV Flight Demonstration"
                  className="h-full w-full object-cover brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-black/40" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between font-mono text-xs text-cyan-300">
                    <span>RADAR: 360° CONTINUOUS SWEEP</span>
                    <span>4K EO/IR STABILIZED GIMBAL</span>
                  </div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/60 bg-[#050b14]/70 backdrop-blur">
                    <Sparkles className="h-7 w-7 text-cyan-300" />
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-[#94a3b8]">
                    <span>AEGIS MK-IV // NON-WEAPONIZED ISR</span>
                    <span>ENCRYPTION: AES-256 LOCKED</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#050b14] border-t border-white/10">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#f1f5f9]">
                    Autonomous Flight Envelope Demonstration
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    Field-ready telemetry across coastal winds and GPS-denied observation corridors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDemoModalOpen(false);
                    onOpenShowcase?.('aegis-mk4');
                  }}
                  className="btn-mission-primary min-h-[44px]"
                >
                  Open 3D Showcase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
