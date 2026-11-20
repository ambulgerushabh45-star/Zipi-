import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, Crosshair, Shield, Activity } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  // Stages:
  // 0: Initial brand logo & loader (0 - 650ms)
  // 1: Cyan streak & UAV drone cinematic entrance (650 - 1300ms)
  // 2: Headline "ENGINEERED TO FLY BEYOND." & HUD telemetry (1300 - 1950ms)
  // 3: Dissolve exit into live page (1950 - 2450ms)
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const completedRef = useRef(false);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 450);
  };

  useEffect(() => {
    // Sequence progression
    const t1 = setTimeout(() => setStage(1), 650);
    const t2 = setTimeout(() => setStage(2), 1300);
    const t3 = setTimeout(() => setStage(3), 1950);
    const t4 = setTimeout(() => handleFinish(), 2450);

    // Hard safety timer: guarantees overlay unmounts even if timers are throttled
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 2800);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro-fullscreen"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage >= 3 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080D14] text-white select-none overflow-hidden"
      >
        {/* Atmospheric Cyan Deep Space Radial Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,232,0.22)_0,rgba(16,27,42,0.85)_50%,#080D14_100%)]" />

        {/* Ambient Radar Rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 opacity-30">
          <div className="h-[480px] w-[480px] rounded-full border border-cyan-400/20 animate-spin-slow" />
          <div className="absolute h-72 w-72 rounded-full border border-dashed border-cyan-400/30" />
          <div className="absolute flex items-center justify-center text-cyan-400/20">
            <Crosshair className="h-44 w-44 stroke-[1]" />
          </div>
        </div>

        {/* Top Telemetry Header & Skip Control */}
        <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest text-[#00C8E8]">
            <span className="h-2 w-2 rounded-full bg-[#00C8E8] animate-pulse shadow-[0_0_8px_#00C8E8]" />
            <span className="font-bold">SYSTEM INITIALIZATION // ZIPI FLEET OS</span>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-slate-300 backdrop-blur-md transition hover:border-[#00C8E8] hover:bg-white/10 hover:text-[#00C8E8] active:scale-95"
            title="Skip Intro (ESC)"
          >
            <span>Skip</span>
            <span className="text-[10px] text-[#00C8E8]">[ESC]</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#00C8E8]" />
          </button>
        </div>

        {/* ==============================================================
            MAIN STAGE: LOGO -> UAV DRONE ENTRANCE -> HEADLINE & HUD
            ============================================================== */}
        <div className="relative flex flex-col items-center justify-center max-w-3xl px-6 text-center z-10 w-full">
          {/* STEP 1: Brand Logo & Exact Name (ZIPI — DRONES & CONTROLLERS) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex flex-col items-center"
          >
            {/* ZIPI Wing Crest SVG */}
            <svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 sm:h-24 sm:w-24 filter drop-shadow-[0_0_35px_rgba(0,200,232,0.7)]"
            >
              <motion.path
                d="M80 12 L142 48 L142 112 L80 148 L18 112 L18 48 Z"
                stroke="#00C8E8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M48 54 L112 54 L48 106 L112 106"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="80"
                cy="80"
                r="4.5"
                fill="#00C8E8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.45, duration: 0.2 }}
              />
            </svg>

            {/* Brand Title */}
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.25em] text-[#F8FAFC]">
              ZIPI
            </h1>
            <span className="mt-1 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00C8E8]">
              DRONES &amp; CONTROLLERS
            </span>
          </motion.div>

          {/* STEP 2: Cyan Streak & UAV Drone Entrance */}
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center justify-center my-4"
            >
              {/* Cyan light streak sweeping across */}
              <motion.div
                initial={{ x: '-100vw', opacity: 0 }}
                animate={{ x: '100vw', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute -top-4 h-[2px] w-64 bg-gradient-to-r from-transparent via-[#00C8E8] to-transparent shadow-[0_0_20px_#00C8E8]"
              />

              {/* Realistic Industrial UAV Drone Render */}
              <div className="relative flex items-center justify-center">
                <img
                  src="/images/drones/hero-flagship.png"
                  alt="ZIPI Flagship UAV Drone"
                  className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_15px_35px_rgba(0,200,232,0.5)]"
                />

                {/* Subtle Floating Ground Glow */}
                <div className="pointer-events-none absolute -bottom-4 h-5 w-48 rounded-full bg-[#00C8E8]/30 blur-xl -z-10" />
              </div>
            </motion.div>
          )}

          {/* STEP 3: Headline "ENGINEERED TO FLY BEYOND." & HUD Telemetry */}
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight leading-tight">
                <span className="text-[#F5F8FC]">ENGINEERED TO </span>
                <span className="bg-gradient-to-r from-[#00C8E8] via-[#55A8FF] to-[#00C8E8] bg-clip-text text-transparent">
                  FLY BEYOND.
                </span>
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-[#AAB7C6] max-w-lg leading-relaxed">
                Discover next-generation UAV drones and intelligent remote control systems designed for precision, performance and reliability.
              </p>

              {/* Staggered Technical HUD Elements */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
                <span className="rounded border border-[#00C8E8]/30 bg-[#00C8E8]/10 px-2.5 py-1 text-[#00C8E8] font-bold">
                  ALT: 2,400 M ASL
                </span>
                <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                  C2 LINK: AES-256
                </span>
                <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                  LOITER: 55 MIN
                </span>
                <span className="rounded border border-[#55A8FF]/30 bg-[#55A8FF]/10 px-2.5 py-1 text-[#55A8FF] font-bold">
                  RTK: ±1.5 CM
                </span>
              </div>
            </motion.div>
          )}

          {/* Technical Progress Loading Bar */}
          <div className="mt-6 w-48 sm:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{
                width: stage === 0 ? '30%' : stage === 1 ? '65%' : '100%',
              }}
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-[#00C8E8] via-[#55A8FF] to-[#00C8E8] shadow-[0_0_12px_#00C8E8]"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
