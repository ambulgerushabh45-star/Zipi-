import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Compass, Radar, ScanEye, FileCheck2 } from 'lucide-react';
import { MISSION_WORKFLOW_STEPS } from '@/data/siteContent';
import { Reveal } from '@/components/motion';

const STEP_ICONS = [Compass, Radar, ScanEye, FileCheck2];

export default function MissionStory() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (val) => {
      const idx = Math.min(
        MISSION_WORKFLOW_STEPS.length - 1,
        Math.max(0, Math.floor(val * MISSION_WORKFLOW_STEPS.length))
      );
      setActiveIndex(idx);
    });
  }, [scrollYProgress]);

  const activeStep = MISSION_WORKFLOW_STEPS[activeIndex] || MISSION_WORKFLOW_STEPS[0];
  const ActiveIcon = STEP_ICONS[activeIndex] || Compass;

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-b border-[#CBD5E1] bg-[#E9EEF4] py-24 px-5 sm:px-8 text-[#080D14]"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-14 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C9E8]/40 bg-[#00C9E8]/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#0092ab]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C9E8] animate-pulse" />
            <span>MISSION EXECUTION TIMELINE</span>
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#080D14] tracking-tight">
            From Mission Plan to Mission Done
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#475569] leading-relaxed">
            Every ZIPI flight follows an orchestrated 4-stage operational sequence: mission definition, telemetry uplink, multi-spectral capture, and post-flight analytical reporting.
          </p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Desktop Sticky Telemetry Card */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-[#CBD5E1] bg-white p-7 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00C9E8] animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#080D14]">
                    PHASE {activeStep.step} // ACTIVE
                  </span>
                </div>
                <span className="rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-3 py-1 font-mono text-[11px] font-bold text-[#080D14]">
                  {activeStep.metric}
                </span>
              </div>

              {/* Waypoint Flight Simulator Grid - Tactical dark screen embedded in light console */}
              <div className="relative rounded-2xl border border-[#00C9E8]/30 bg-[#080D14] p-4 overflow-hidden shadow-inner">
                <div className="absolute inset-0 hero-grid-overlay opacity-30 pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-[#00C9E8] uppercase tracking-widest font-bold">
                    WAYPOINT SIMULATOR // RTK MESH
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    WP {activeIndex + 1} OF 4
                  </span>
                </div>

                {/* Interactive Waypoint Nodes */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {MISSION_WORKFLOW_STEPS.map((step, idx) => {
                    const isPassed = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    return (
                      <button
                        key={step.step}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                          isCurrent
                            ? 'border-[#00C9E8] bg-[#00C9E8]/20 text-[#00C9E8] shadow-[0_0_12px_rgba(0,201,232,0.5)]'
                            : isPassed
                              ? 'border-[#00C9E8]/40 bg-white/5 text-slate-300'
                              : 'border-white/10 bg-transparent text-slate-500 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-[11px] font-bold">WP-0{idx + 1}</span>
                        <span className="text-[9px] font-mono mt-0.5 truncate max-w-full">
                          {step.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.div
                key={activeStep.step}
                initial={shouldReduceMotion ? false : { x: 16 }}
                animate={{ x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#080D14] text-[#00C9E8] shadow-[0_0_15px_rgba(0,201,232,0.3)]">
                  <ActiveIcon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-[#080D14]">
                  {activeStep.title}
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider text-[#0092ab] font-bold">
                  {activeStep.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-[#475569]">
                  {activeStep.description}
                </p>
              </motion.div>

              {/* Progress Line */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                <div className="flex justify-between font-mono text-[10px] text-[#64748b]">
                  {MISSION_WORKFLOW_STEPS.map((st, idx) => (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`uppercase transition ${
                        idx === activeIndex ? 'text-[#0092ab] font-bold' : 'hover:text-[#080D14]'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <motion.div
                    animate={{ width: `${((activeIndex + 1) / MISSION_WORKFLOW_STEPS.length) * 100}%` }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00C9E8] to-[#55A8FF] shadow-[0_0_8px_#00C9E8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step List (Scroll-driven on desktop, clean stacked cards on mobile) */}
          <div className="lg:col-span-7 space-y-6">
            {MISSION_WORKFLOW_STEPS.map((item, idx) => {
              const Icon = STEP_ICONS[idx] || Compass;
              const isCurrent = idx === activeIndex;
              return (
                <Reveal key={item.step} direction={idx % 2 === 0 ? 'right' : 'left'}>
                  <div
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded-3xl border p-6 sm:p-8 transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'border-[#00C9E8] bg-white shadow-[0_12px_32px_rgba(0,201,232,0.15)] ring-2 ring-[#00C9E8]/30'
                        : 'border-[#CBD5E1] bg-white/70 hover:bg-white hover:border-[#94a3b8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#080D14] font-mono text-xs font-bold text-[#00C9E8]">
                          {item.step}
                        </span>
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#080D14]">
                            {item.title}
                          </h3>
                          <p className="font-mono text-[11px] uppercase tracking-wider text-[#0092ab] font-bold">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <Icon className="h-6 w-6 text-[#0092ab] shrink-0" />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

