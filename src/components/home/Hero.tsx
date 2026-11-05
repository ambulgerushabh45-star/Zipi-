import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Shield,
  Sprout,
  Radio,
  Crosshair,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

const HERO_BG =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1920';

// Choreographed 5-Step Animation Variants
const backgroundVariants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

const headlineLineVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.45 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const droneEntranceVariants = {
  hidden: {
    opacity: 0,
    x: 90,
    scale: 0.72,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const iconStaggerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 1.1 + i * 0.1, ease: 'easeOut' },
  }),
};

export default function Hero({ onOpenShowcase }: { onOpenShowcase?: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 140]);
  const contentY = useTransform(scrollY, [0, 600], [0, 60]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.2]);

  // Interactive 3D Parallax & Tilt on Drone
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-14, 14]), { stiffness: 120, damping: 18 });
  const droneFloatY = useSpring(useTransform(mouseY, [0, 1], [-8, 8]), { stiffness: 100, damping: 16 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-black text-white pt-24 pb-12 flex flex-col justify-center select-none"
    >
      {/* ==============================================================
          STEP 1 – BACKGROUND REVEAL:
          Atmospheric background with subtle cyan lighting & tactical grid
          ============================================================== */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        style={{ y: bgY }}
        className="absolute inset-0 -z-30 h-[120%]"
      >
        <img
          src={HERO_BG}
          alt="ZIPI Mission Drone Platform"
          className="h-full w-full object-cover object-center opacity-25 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black" />
        {/* Subtle cyan ambient lighting glow in the centre-right */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(0,229,255,0.18)_0,rgba(0,180,216,0.06)_40%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(0,229,255,0.08)_0,transparent_50%)]" />
      </motion.div>

      {/* Cybernetic Flight HUD Overlays (Reference 2 DRN·OS Technical details) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-35">
        <div className="absolute left-6 sm:left-12 top-28 flex flex-col font-mono text-[10px] tracking-widest text-cyan-400/80">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SYS.VER // DRN-OS 4.8.2
          </span>
          <span>LAT: 37°48&apos;N // LON: 122°24&apos;W</span>
          <span>RADAR: ACTIVE (360° SPHERICAL)</span>
        </div>
        <div className="absolute right-6 sm:right-12 top-28 hidden sm:flex flex-col text-right font-mono text-[10px] tracking-widest text-cyan-400/80">
          <span>C2 LINK: AES-256 SECURED</span>
          <span>TELEMETRY: OPTIMAL // 0.02ms</span>
          <span>AIRSPACE CLEARANCE: AUTHORIZED</span>
        </div>
      </div>

      {/* ==============================================================
          MAIN HERO CONTAINER: SPLIT SCREEN LAYOUT
          LEFT SIDE: ZIPI Branding, Headline, Description, Buttons
          RIGHT SIDE: Large realistic 3D drone image, never hidden
          ============================================================== */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 py-6 flex-1 flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ==========================================================
              LEFT SIDE: BRANDING, HEADLINE, DESCRIPTION, PROMINENT BUTTONS
              ========================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-20">
            {/* STEP 2 – LOGO / BRAND REVEAL */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.15)]"
            >
              <img
                src="/images/zipi-crest.png"
                alt="ZIPI Crest"
                className="h-4 w-4 object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
              />
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                ZIPI AEROSPACE // DEFENCE &amp; AGRI
              </span>
            </motion.div>

            {/* STEP 4 – HEADLINE REVEAL (Sequential staggered line animation) */}
            <div className="mt-5 sm:mt-6">
              <h1 className="font-display font-black tracking-tight leading-[1.02] text-4xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-[5rem]">
                <motion.span
                  custom={0}
                  variants={headlineLineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block text-white"
                >
                  ENGINEERED
                </motion.span>
                <motion.span
                  custom={1}
                  variants={headlineLineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block text-white"
                >
                  FOR THE FUTURE.
                </motion.span>
                <motion.span
                  custom={2}
                  variants={headlineLineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(0,229,255,0.35)]"
                >
                  BUILT FOR
                </motion.span>
                <motion.span
                  custom={3}
                  variants={headlineLineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block bg-gradient-to-r from-cyan-400 via-cyan-300 to-white bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]"
                >
                  THE MISSION.
                </motion.span>
              </h1>
            </div>

            {/* STEP 5 – DESCRIPTION AND PROMINENT BUTTONS */}
            <motion.p
              custom={0.9}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300 font-light"
            >
              Advanced aerial technology transforming defence, agriculture and industries.
            </motion.p>

            {/* TWO PROMINENT BUTTONS: EXPLORE DRONES & DISCOVER MORE */}
            <motion.div
              custom={1.05}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mt-7 sm:mt-8 flex flex-wrap items-center gap-4"
            >
              {/* BUTTON 1: EXPLORE DRONES (Reference 2 bracketed cyan aesthetic) */}
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-cyan-400/80 bg-cyan-500/15 px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_35px_rgba(0,229,255,0.7)]"
              >
                {/* Reference 2 corner brackets */}
                <span className="absolute top-1 left-1 text-[9px] font-mono text-cyan-400 group-hover:text-black transition-colors">
                  ┌
                </span>
                <span className="absolute top-1 right-1 text-[9px] font-mono text-cyan-400 group-hover:text-black transition-colors">
                  ┐
                </span>
                <span className="absolute bottom-1 left-1 text-[9px] font-mono text-cyan-400 group-hover:text-black transition-colors">
                  └
                </span>
                <span className="absolute bottom-1 right-1 text-[9px] font-mono text-cyan-400 group-hover:text-black transition-colors">
                  ┘
                </span>
                <span>EXPLORE DRONES</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* BUTTON 2: DISCOVER MORE */}
              <a
                href="#sectors"
                className="group relative inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur transition-all duration-300 hover:border-white/50 hover:bg-white/15 hover:text-white"
              >
                <Crosshair className="h-4 w-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
                <span>DISCOVER MORE</span>
              </a>

              {/* Quick Launch Showcase Pill */}
              <button
                onClick={() => onOpenShowcase && onOpenShowcase('aegis-mk4')}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-neutral-900/80 px-4 py-3 text-xs font-mono uppercase tracking-wider text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/50 transition-colors"
                title="Launch Fullscreen Showcase"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">3D SHOWCASE</span>
              </button>
            </motion.div>

            {/* FEATURE ICONS REVEALED ONE BY ONE (Step 5) */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl border-t border-white/10 pt-5">
              {[
                { label: 'Tactical ISR', sub: 'Non-Weaponized', icon: Shield, col: 'text-cyan-400' },
                { label: 'Precision Agri', sub: '40L Variable Rate', icon: Sprout, col: 'text-emerald-400' },
                { label: 'Encrypted C2', sub: 'AES-256 Link', icon: Radio, col: 'text-cyan-400' },
                { label: 'Autonomous', sub: 'DRN·OS 4.8', icon: Layers, col: 'text-cyan-400' },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    custom={idx}
                    variants={iconStaggerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col border-l border-white/10 pl-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <IconComp className={`h-3.5 w-3.5 ${item.col}`} />
                      <span className="font-mono text-xs font-bold text-white">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.sub}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Reference 2 Tactical Flight Interface Mini Widget */}
            <motion.div
              custom={1.3}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 hidden md:flex items-center gap-4 rounded-xl border border-white/10 bg-neutral-950/70 p-3 backdrop-blur max-w-lg"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="text-left font-mono text-[11px] leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase tracking-wider">Tactical Ground Interface</span>
                  <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] text-cyan-300">ONLINE</span>
                </div>
                <p className="text-zinc-400 text-[10px] mt-1 font-sans">
                  Real-time encrypted flight telemetry, thermal fusion &amp; autonomous waypoint patrol.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ==========================================================
              RIGHT SIDE: LARGE REALISTIC 3D-STYLE DRONE (CENTERPIECE)
              Complete drone clearly visible, cyan rim lighting, parallax
              ========================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] z-10">
            {/* STEP 3 – DRONE ENTRANCE:
                Starts smaller/farther, glides in smoothly from right, scales up into final position */}
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
              {/* Tactical Orbital Crosshair HUD (From Reference 2 DRN·OS) */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
                {/* Large HUD outer circle with crosshairs */}
                <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-cyan-500/20 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 font-mono text-[9px]">
                    ▲ N 000°
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-cyan-400 font-mono text-[9px]">
                    ▼ S 180°
                  </div>
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-cyan-400 font-mono text-[9px]">
                    ◀ W 270°
                  </div>
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-cyan-400 font-mono text-[9px]">
                    ▶ E 090°
                  </div>
                </div>

                {/* Inner reticle target */}
                <div className="absolute h-48 w-48 sm:h-64 sm:w-64 rounded-full border border-dashed border-cyan-400/25" />
                <div className="absolute flex items-center justify-center text-cyan-400/40">
                  <Crosshair className="h-20 w-20 stroke-[1]" />
                </div>
              </div>

              {/* Cyan Rim Lighting Halo & Specular Underglow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.28)_0,rgba(0,229,255,0.08)_45%,transparent_75%)] blur-2xl -z-10" />

              {/* THE LARGE REALISTIC DRONE IMAGE */}
              <div className="relative w-full flex items-center justify-center animate-float">
                <img
                  src="/images/drones/hero-flagship.png"
                  alt="ZIPI Aegis Sentinel MK-IV Flagship Drone"
                  className="w-full max-w-[620px] lg:max-w-[700px] xl:max-w-[780px] object-contain select-none filter drop-shadow-[0_25px_60px_rgba(0,229,255,0.45)] drop-shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />

                {/* Subtle Interactive Callout Tags on Drone (Reference 2 style) */}
                <div className="absolute -top-2 right-4 hidden sm:flex items-center gap-2 rounded-full border border-cyan-400/40 bg-neutral-950/80 px-3 py-1 font-mono text-[10px] text-cyan-300 backdrop-blur shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>[+] TARGET LOCK // ACTIVE</span>
                </div>

                <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-neutral-950/80 px-3 py-1 font-mono text-[10px] text-zinc-300 backdrop-blur">
                  <Activity className="h-3 w-3 text-cyan-400" />
                  <span>3-AXIS GIMBAL // ±0.005°</span>
                </div>
              </div>

              {/* Ground Shadow & Specular Reflection */}
              <div className="pointer-events-none -mt-6 sm:-mt-8 h-8 w-3/4 max-w-[500px] rounded-full bg-cyan-500/20 blur-xl" />
              <div className="pointer-events-none -mt-4 h-4 w-1/2 max-w-[360px] rounded-full bg-black/80 blur-md" />

              {/* Launch Showcase Prompt Indicator */}
              <div className="mt-4 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1 text-[10px] font-mono tracking-widest text-cyan-300 opacity-80 group-hover:opacity-100 group-hover:border-cyan-400 transition-all">
                <Crosshair className="h-3 w-3 text-cyan-400 animate-spin-slow" />
                <span>CLICK TO LAUNCH CINEMATIC SHOWCASE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Downward Scroll Indicator to Exploration Sections */}
      <a
        href="#sectors"
        className="mx-auto mt-4 sm:mt-6 flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-white/50 transition hover:text-cyan-400 z-20"
        aria-label="Scroll to exploration sections"
      >
        <span>EXPLORE SECTORS</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-cyan-400" />
      </a>
    </section>
  );
}
