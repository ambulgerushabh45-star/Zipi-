import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Compass, Plane, ScanEye, FileCheck2 } from 'lucide-react';
import { MISSION_WORKFLOW_STEPS } from '@/data/siteContent';
import { Reveal } from '@/components/motion';

const STEP_ICONS = [Compass, Plane, ScanEye, FileCheck2];

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
      className="relative border-t border-white/10 bg-[#08121f] py-20 px-5 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-12 text-center lg:text-left">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
            END-TO-END WORKFLOW
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#f1f5f9]">
            From mission plan to mission done
          </h2>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Desktop Sticky Telemetry Card */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-cyan-400/30 bg-[#0b1a2c] p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">
                  PHASE {activeStep.step} // ACTIVE
                </span>
                <span className="rounded-full border border-cyan-400/35 bg-[#050b14] px-3 py-1 font-mono text-[11px] text-cyan-300">
                  {activeStep.metric}
                </span>
              </div>

              <motion.div
                key={activeStep.step}
                initial={shouldReduceMotion ? false : { x: 16 }}
                animate={{ x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-[#050b14] text-cyan-300">
                  <ActiveIcon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-3xl font-extrabold text-[#f1f5f9]">
                  {activeStep.title}
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                  {activeStep.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-[#94a3b8]">
                  {activeStep.description}
                </p>
              </motion.div>

              {/* Progress Line */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between font-mono text-[10px] text-[#94a3b8]">
                  {MISSION_WORKFLOW_STEPS.map((st, idx) => (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`uppercase transition ${
                        idx === activeIndex ? 'text-cyan-300 font-bold' : 'hover:text-white'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${((activeIndex + 1) / MISSION_WORKFLOW_STEPS.length) * 100}%` }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9]"
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
                        ? 'border-cyan-400/60 bg-[#112640] shadow-[0_0_28px_rgba(34,211,238,0.12)]'
                        : 'border-white/10 bg-[#0b1a2c] hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/35 bg-[#050b14] font-mono text-xs font-bold text-cyan-300">
                          {item.step}
                        </span>
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f1f5f9]">
                            {item.title}
                          </h3>
                          <p className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <Icon className="h-6 w-6 text-cyan-300 shrink-0" />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">
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

