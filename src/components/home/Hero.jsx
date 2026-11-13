import { useEffect, useRef, useState } from 'react';
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
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Magnetic } from '@/components/motion';

const HERO_BG =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=2560';

const HEADLINE_WORDS = [
  { text: 'Engineered', accent: false },
  { text: 'to', accent: false },
  { text: 'Fly.', accent: true },
  { text: 'Built', accent: false },
  { text: 'to', accent: false },
  { text: 'Serve.', accent: true },
];

export default function Hero({ onOpenShowcase }) {
  const containerRef = useRef(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
            <motion.div
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
                ZIPI DRONES &amp; CONTROLS // MISSION READY
              </span>
            </motion.div>

            {/* Word-by-word slide-up headline */}
            <h1 className="mt-6 font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.06]">
              <span className="flex flex-wrap gap-x-3.5 gap-y-1">
                {HEADLINE_WORDS.slice(0, 3).map((word, i) => (
                  <span key={word.text} className="inline-block overflow-hidden">
                    <motion.span
                      initial={shouldReduceMotion ? false : { y: 36, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.36,
                        delay: shouldReduceMotion ? 0 : i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`inline-block ${
                        word.accent
                          ? 'bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] bg-clip-text text-transparent'
                          : 'text-[#f1f5f9]'
                      }`}
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="mt-1 flex flex-wrap gap-x-3.5 gap-y-1">
                {HEADLINE_WORDS.slice(3).map((word, i) => (
                  <span key={word.text} className="inline-block overflow-hidden">
                    <motion.span
                      initial={shouldReduceMotion ? false : { y: 36, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.36,
                        delay: shouldReduceMotion ? 0 : (i + 3) * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`inline-block ${
                        word.accent
                          ? 'bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] bg-clip-text text-transparent'
                          : 'text-[#f1f5f9]'
                      }`}
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#94a3b8]"
            >
              Autonomous UAV platforms, daylight remote controllers, and IP67 ground control stations engineered exclusively for non-weaponized ISR, search-and-rescue, and precision agriculture.
            </motion.p>

            {/* Primary Magnetic CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Magnetic>
                <Link to="/products" className="btn-mission-primary min-h-[48px]">
                  <span>Shop hardware</span>
                </Link>
              </Magnetic>

              <Magnetic strength={5}>
                <Link to="/contact" className="btn-mission-ghost min-h-[48px]">
                  <span>Talk to our team</span>
                </Link>
              </Magnetic>

              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/10 bg-[#08121f]/80 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-cyan-300 hover:border-cyan-400/50 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Flight Reel</span>
              </button>
            </div>

            {/* Key Architecture Highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl border-t border-white/10 pt-5">
              {[
                { label: 'Defence ISR', sub: 'Non-Weaponized', icon: Shield, col: 'text-[#60a5fa]' },
                { label: 'Precision Ag', sub: 'NDVI & 40L Spray', icon: Activity, col: 'text-[#4ade80]' },
                { label: 'Encrypted C2', sub: 'AES-256 Links', icon: Radio, col: 'text-cyan-300' },
                { label: 'Autonomous', sub: 'Sub-Cm RTK', icon: Layers, col: 'text-[#fbbf24]' },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <div key={item.label} className="border-l border-white/10 pl-3">
                    <div className="flex items-center gap-1.5">
                      <IconComp className={`h-3.5 w-3.5 ${item.col}`} />
                      <span className="font-mono text-xs font-bold text-[#f1f5f9]">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] font-mono mt-0.5 block">
                      {item.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Parallax Drone + Radar Rings */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[340px] sm:min-h-[460px] z-10">
            <motion.div
              style={
                shouldReduceMotion || isTouch
                  ? undefined
                  : { rotateX, rotateY, x: droneShiftX, y: droneShiftY, transformStyle: 'preserve-3d' }
              }
              className="relative w-full flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => onOpenShowcase?.('aegis-mk4')}
            >
              {/* Glowing Radar Rings */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
                <div
                  className={`relative h-72 w-72 sm:h-[420px] sm:w-[420px] rounded-full border border-cyan-400/20 ${
                    shouldReduceMotion ? '' : 'animate-spin-slow'
                  }`}
                >
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-300 font-mono text-[9px]">
                    N 000°
                  </span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-cyan-300 font-mono text-[9px]">
                    S 180°
                  </span>
                </div>
                <div className="absolute h-52 w-52 sm:h-72 sm:w-72 rounded-full border border-dashed border-cyan-400/25" />
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{ scale: [0.6, 1.05], opacity: [0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute h-64 w-64 sm:h-96 sm:w-96 rounded-full border border-cyan-400/40"
                  />
                )}
              </div>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.22)_0,transparent_70%)] blur-2xl -z-10" />

              {/* Gentle float on touch devices (and subtle hover zoom on desktop) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : isTouch
                      ? { y: [0, -10, 0] }
                      : undefined
                }
                transition={
                  isTouch
                    ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
                    : undefined
                }
                className="relative w-full flex items-center justify-center"
              >
                <img
                  src="/images/drones/hero-flagship.png"
                  alt="ZIPI Aegis Sentinel MK-IV Flagship Drone"
                  className="w-full max-w-[540px] lg:max-w-[660px] object-contain filter drop-shadow-[0_24px_60px_rgba(34,211,238,0.38)] transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </motion.div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShowcase?.('aegis-mk4');
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-[#0b1a2c]/90 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:border-cyan-400 transition"
              >
                <Crosshair className="h-3 w-3" />
                <span>Inspect 3D Showcase</span>
              </button>
            </motion.div>
          </div>
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
