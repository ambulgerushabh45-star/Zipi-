import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Crosshair, Sparkles, X, Shield, Radio, Layers, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

// High-resolution cinematic aerospace airfield backdrop
const HERO_BG =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=2560';

// Choreographed 7-Step Opening Sequence Variants
const backgroundVariants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

const droneEntranceVariants = {
  hidden: {
    opacity: 0,
    x: 140,
    scale: 0.65,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.4,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const headlineLineVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.55 + i * 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const techBadgeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 1.1 + i * 0.1, ease: 'easeOut' },
  }),
};

export default function Hero({ onOpenShowcase }) {
  const containerRef = useRef(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 160]);
  const contentY = useTransform(scrollY, [0, 600], [0, 60]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.15]);

  // Pointer-based 3D Parallax & Depth Tilt on Drone
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), { stiffness: 120, damping: 20 });
  const droneFloatY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), { stiffness: 100, damping: 18 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
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
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#07111F] text-[#F5F8FC] pt-24 pb-12 flex flex-col justify-center select-none"
    >
      {/* ==============================================================
          STEP 1 – DARK ATMOSPHERIC BACKGROUND FADES IN
          ============================================================== */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        style={{ y: bgY }}
        className="absolute inset-0 -z-30 h-[125%]"
      >
        <img
          src={HERO_BG}
          alt="ZIPI Aerospace Airfield"
          className="h-full w-full object-cover object-center opacity-30 filter brightness-70 contrast-125"
        />
        {/* Layered Midnight Navy to Deep Graphite Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] via-[#07111F]/80 to-[#07111F]" />
        {/* Subtle Cyan and Warm Ambient Lighting Reflections */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(0,200,255,0.18)_0,rgba(16,27,42,0.6)_45%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(0,200,255,0.08)_0,transparent_55%)]" />
      </motion.div>

      {/* Subtle Aerospace Flight HUD Details */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
        <div className="absolute left-6 sm:left-12 top-28 flex flex-col font-mono text-[10px] tracking-widest text-[#00C8FF]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
            SYS.STATUS // AIRSPACE CLEARED
          </span>
          <span>LAT: 37°48&apos;N // LON: 122°24&apos;W</span>
          <span>360° SPHERICAL RADAR: ACTIVE</span>
        </div>
        <div className="absolute right-6 sm:right-12 top-28 hidden sm:flex flex-col text-right font-mono text-[10px] tracking-widest text-[#00C8FF]">
          <span>C2 LINK: AES-256 ENCRYPTED</span>
          <span>ALTITUDE: 2,400M ASL</span>
          <span>TELEMETRY: OPTIMAL // 0.02ms</span>
        </div>
      </div>

      {/* ==============================================================
          MAIN CONTAINER: SPLIT-SCREEN LAYOUT
          LEFT: Headline, supporting text, sequential buttons
          RIGHT: Prominently positioned large realistic drone (never hidden)
          ============================================================== */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 py-8 flex-1 flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ==========================================================
              LEFT SIDE: BRANDING, HEADLINE, SUPPORTING TEXT, BUTTONS
              ========================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-20">
            {/* STEP 2 – ZIPI LOGO REVEALS SMOOTHLY */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#00C8FF]/40 bg-[#101B2A]/80 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,200,255,0.15)]"
            >
              <img
                src="/images/zipi-crest.png"
                alt="ZIPI Crest"
                className="h-4 w-4 object-contain filter drop-shadow-[0_0_6px_rgba(0,200,255,0.8)]"
              />
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#00C8FF]">
                ZIPI AEROSPACE // AUTONOMOUS UAV
              </span>
            </motion.div>

            {/* STEP 5 – HEADLINE REVEALS LINE BY LINE */}
            <div className="mt-5 sm:mt-6">
              <h1 className="font-display font-black tracking-tight leading-[1.0] text-5xl sm:text-7xl md:text-7xl lg:text-7xl xl:text-[5.25rem]">
                <motion.span
                  custom={0}
                  variants={headlineLineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block text-[#F5F8FC]"
                >
                  FLY BEYOND
                </motion.span>
                <motion.span
                  custom={1}
                  variants={headlineLineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00C8FF] via-cyan-200 to-[#F5F8FC] filter drop-shadow-[0_0_35px_rgba(0,200,255,0.4)]"
                >
                  LIMITS.
                </motion.span>
              </h1>
            </div>

            {/* STEP 6 – SUPPORTING TEXT AND BUTTONS APPEAR SEQUENTIALLY */}
            <motion.p
              custom={0.9}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mt-5 sm:mt-6 max-w-xl text-lg sm:text-xl font-normal leading-relaxed text-[#AAB7C7]"
            >
              Advanced Drones. Intelligent Systems.
              <span className="block text-[#F5F8FC] font-medium mt-1">A Smarter Tomorrow.</span>
            </motion.p>

            {/* TWO PROMINENT BUTTONS: EXPLORE PRODUCTS & WATCH DEMO */}
            <motion.div
              custom={1.05}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              {/* BUTTON 1: EXPLORE PRODUCTS */}
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-2.5 rounded-xl bg-[#00C8FF] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#07111F] shadow-[0_0_28px_rgba(0,200,255,0.5)] transition-all duration-300 hover:bg-cyan-300 hover:scale-105"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* BUTTON 2: WATCH DEMO */}
              <button
                onClick={() => setDemoModalOpen(true)}
                className="group inline-flex items-center gap-2.5 rounded-xl border border-[#AAB7C7]/30 bg-[#101B2A]/80 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F5F8FC] backdrop-blur transition-all duration-300 hover:border-[#00C8FF] hover:bg-[#101B2A] hover:text-[#00C8FF]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00C8FF]/20 text-[#00C8FF] group-hover:bg-[#00C8FF] group-hover:text-[#07111F] transition-colors">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>

              {/* Showcase Shortcut */}
              <button
                onClick={() => onOpenShowcase && onOpenShowcase('aegis-mk4')}
                className="inline-flex items-center gap-2 rounded-xl border border-[#00C8FF]/30 bg-[#101B2A]/50 px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-[#00C8FF] hover:bg-[#101B2A] hover:border-[#00C8FF] transition-all"
                title="Launch 3D Cinematic Showcase"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#00C8FF]" />
                <span className="hidden sm:inline">3D Showcase</span>
              </button>
            </motion.div>

            {/* STEP 7 – SMALL TECHNICAL ELEMENTS REVEAL WITH SUBTLE DELAYS */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl border-t border-[#101B2A] pt-5">
              {[
                { label: 'Tactical ISR', sub: 'Non-Weaponized', icon: Shield, col: 'text-[#00C8FF]' },
                { label: 'Precision Agri', sub: '40L Variable Rate', icon: Activity, col: 'text-[#67B56B]' },
                { label: 'Encrypted C2', sub: 'AES-256 Link', icon: Radio, col: 'text-[#00C8FF]' },
                { label: 'Autonomous', sub: 'Sub-Cm RTK', icon: Layers, col: 'text-[#FF9B42]' },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    custom={idx}
                    variants={techBadgeVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col border-l border-[#101B2A] pl-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <IconComp className={`h-3.5 w-3.5 ${item.col}`} />
                      <span className="font-mono text-xs font-bold text-[#F5F8FC]">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-[#AAB7C7] font-mono mt-0.5">{item.sub}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ==========================================================
              RIGHT SIDE: LARGE REALISTIC DRONE (CENTERPIECE)
              Complete drone clearly visible, realistic lighting, shadows & depth
              ========================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] z-10">
            {/* STEP 3 & 4 – DRONE ENTRANCE:
                Enters from right, initially farther away, scales into final position */}
            <motion.div
              variants={droneEntranceVariants}
              initial="hidden"
              animate="visible"
              style={{
                rotateX,
                rotateY,
                y: droneFloatY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => onOpenShowcase && onOpenShowcase('aegis-mk4')}
            >
              {/* Subtle Cyan Technical HUD Elements around drone */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
                {/* Rotating range circle with compass bearings */}
                <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-[#00C8FF]/20 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00C8FF] font-mono text-[9px]">
                    ▲ N 000°
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[#00C8FF] font-mono text-[9px]">
                    ▼ S 180°
                  </div>
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[#00C8FF] font-mono text-[9px]">
                    ◀ W 270°
                  </div>
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-[#00C8FF] font-mono text-[9px]">
                    ▶ E 090°
                  </div>
                </div>

                {/* Inner reticle target */}
                <div className="absolute h-48 w-48 sm:h-64 sm:w-64 rounded-full border border-dashed border-[#00C8FF]/20" />
                <div className="absolute flex items-center justify-center text-[#00C8FF]/30">
                  <Crosshair className="h-20 w-20 stroke-[1]" />
                </div>
              </div>

              {/* Cyan Rim Lighting Halo & Atmospheric Glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.25)_0,rgba(0,200,255,0.06)_45%,transparent_75%)] blur-2xl -z-10" />

              {/* THE LARGE REALISTIC DRONE IMAGE */}
              <div className="relative w-full flex items-center justify-center animate-float">
                <img
                  src="/images/drones/hero-flagship.png"
                  alt="ZIPI Aegis Sentinel MK-IV Flagship Drone"
                  className="w-full max-w-[620px] lg:max-w-[700px] xl:max-w-[760px] object-contain select-none filter drop-shadow-[0_30px_60px_rgba(0,200,255,0.4)] drop-shadow-[0_0_25px_rgba(0,200,255,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                {/* Subtle Interactive Telemetry Badges */}
                <div className="absolute -top-2 right-4 hidden sm:flex items-center gap-2 rounded-full border border-[#00C8FF]/40 bg-[#07111F]/90 px-3 py-1 font-mono text-[10px] text-[#00C8FF] backdrop-blur shadow-[0_0_15px_rgba(0,200,255,0.3)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00C8FF] animate-ping" />
                  <span>TARGET LOCK // ACTIVE</span>
                </div>

                <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-[#07111F]/90 px-3 py-1 font-mono text-[10px] text-[#AAB7C7] backdrop-blur">
                  <Activity className="h-3 w-3 text-[#00C8FF]" />
                  <span>3-AXIS GIMBAL // ±0.005°</span>
                </div>
              </div>

              {/* Ground Shadow & Specular Reflection */}
              <div className="pointer-events-none -mt-6 sm:-mt-8 h-8 w-3/4 max-w-[500px] rounded-full bg-[#00C8FF]/20 blur-xl" />
              <div className="pointer-events-none -mt-4 h-4 w-1/2 max-w-[360px] rounded-full bg-black/80 blur-md" />

              {/* Prompt Indicator */}
              <div className="mt-4 flex items-center gap-2 rounded-full border border-[#00C8FF]/30 bg-[#101B2A]/80 px-4 py-1 text-[10px] font-mono tracking-widest text-[#00C8FF] opacity-80 group-hover:opacity-100 group-hover:border-[#00C8FF] transition-all">
                <Crosshair className="h-3 w-3 text-[#00C8FF] animate-spin-slow" />
                <span>CLICK FOR 3D CINEMATIC SHOWCASE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ==============================================================
          CINEMATIC DEMO MODAL (Watch Demo Trigger)
          ============================================================== */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="absolute inset-0 bg-[#07111F]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-[#00C8FF]/40 bg-[#101B2A] text-[#F5F8FC] shadow-2xl z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6 bg-[#07111F]">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#00C8FF] animate-ping" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00C8FF]">
                    ZIPI AEROSPACE // FLIGHT DEMONSTRATION REEL
                  </span>
                </div>
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="rounded-full bg-white/10 p-2 text-[#AAB7C7] hover:bg-white/20 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Player Reel */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1920"
                  alt="UAV Flight Demonstration"
                  className="h-full w-full object-cover filter brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-black/40" />

                {/* Tactical HUD Overlay Over Demo */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between font-mono text-xs text-[#00C8FF]">
                    <span>RADAR: 360° CONTINUOUS SWEEP</span>
                    <span>4K EO/IR STABILIZED GIMBAL</span>
                  </div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#00C8FF]/60 bg-[#07111F]/60 backdrop-blur">
                    <Play className="h-8 w-8 text-[#00C8FF] fill-current ml-1" />
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-[#AAB7C7]">
                    <span>AEGIS MK-IV // FLIGHT ENVELOPE: 65 MIN</span>
                    <span>ENCRYPTION: AES-256 LOCKED</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-[#07111F] border-t border-white/10">
                <div>
                  <h4 className="font-display font-bold text-lg text-[#F5F8FC]">
                    Autonomous Flight Envelope Demonstration
                  </h4>
                  <p className="text-xs text-[#AAB7C7] mt-0.5">
                    Field-proven in adverse atmospheric conditions, mountain gales, and GPS-denied environments.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setDemoModalOpen(false);
                      if (onOpenShowcase) onOpenShowcase('aegis-mk4');
                    }}
                    className="rounded-full bg-[#00C8FF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#07111F] hover:bg-cyan-300 transition"
                  >
                    Open 3D Showcase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
