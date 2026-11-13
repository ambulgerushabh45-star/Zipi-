import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  Radio,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import ControllerInspector from '@/components/product/ControllerInspector';
import {
  Carousel,
  Magnetic,
  Reveal,
  Stagger,
  StaggerItem,
  Tilt,
} from '@/components/motion';
import {
  CONTROLLER_COMPATIBILITY,
  FINDER_QUESTIONS,
  recommendControllers,
} from '@/data/controllers';
import { PRODUCTS, getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SPEC_ROWS = [
  { key: 'display', label: 'Display Panel' },
  { key: 'transmissionRange', label: 'Transmission Range' },
  { key: 'frequency', label: 'RF Link Band' },
  { key: 'batteryLife', label: 'Battery Runtime' },
  { key: 'channels', label: 'Control Channels' },
  { key: 'ingressProtection', label: 'Ingress Rating' },
  { key: 'encryption', label: 'Encryption' },
];

export default function ControllersPage() {
  useDocumentTitle('Remote Controllers');
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, compare, toggleCompare, notify } = useShop();

  const controllers = useMemo(
    () => PRODUCTS.filter((p) => p.hardwareType === 'controller'),
    []
  );
  const drones = useMemo(
    () => PRODUCTS.filter((p) => p.hardwareType === 'drone'),
    []
  );

  // 3-step Controller Finder quiz
  const [quizStep, setQuizStep] = useState(0);
  const [quizDirection, setQuizDirection] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);

  // Selected controller for Hotspot & Kit Inspector
  const [inspectedId, setInspectedId] = useState(controllers[0]?.id || 'rc-pro-tactical');
  const inspectedController =
    controllers.find((c) => c.id === inspectedId) || controllers[0];

  const handleQuizOption = (questionId, optionId) => {
    const nextAnswers = { ...quizAnswers, [questionId]: optionId };
    setQuizAnswers(nextAnswers);
    if (quizStep < FINDER_QUESTIONS.length - 1) {
      setQuizDirection(1);
      setQuizStep((s) => s + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setQuizDirection(-1);
    setQuizComplete(false);
  };

  const recommendation = useMemo(() => {
    if (!quizComplete) return null;
    const { primaryId, runnerUpId } = recommendControllers(quizAnswers);
    return {
      primary: getProduct(primaryId),
      runnerUp: getProduct(runnerUpId),
    };
  }, [quizAnswers, quizComplete]);

  // Controllers shown in Compare Table: up to 3 compared controllers if any selected, else first 3 controllers
  const comparedControllers = useMemo(() => {
    const selected = compare
      .map((id) => controllers.find((c) => c.id === id))
      .filter(Boolean);
    return selected.length > 0 ? selected.slice(0, 3) : controllers.slice(0, 3);
  }, [compare, controllers]);

  const activeQuestion = FINDER_QUESTIONS[quizStep];

  return (
    <div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-24 pb-16">
      {/* 1. HERO: Precision in your hands */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b14]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-grid-overlay" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <Reveal direction="left" className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-[#0b1a2c] px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                <Radio className="h-3.5 w-3.5" />
                <span>C2 COMMAND HARDWARE // {controllers.length} PLATFORMS</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f1f5f9]">
                Precision in{' '}
                <span className="bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] bg-clip-text text-transparent">
                  your hands.
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#94a3b8]">
                Engineered for 2,000-nit outdoor readability, encrypted COFDM line-of-sight links, and multi-UAV fleet command across non-weaponized ISR and precision agriculture missions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Magnetic>
                  <a href="#controller-finder" className="btn-mission-primary min-h-[44px]">
                    <span>Launch Controller Finder</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Magnetic>
                <Link
                  to="/contact?type=order&product=rc-pro-tactical"
                  className="btn-mission-ghost min-h-[44px]"
                >
                  <span>Enquire About Controllers</span>
                </Link>
              </div>
            </Reveal>

            <Reveal direction="right" className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1a2c] p-5 sm:p-7 shadow-2xl">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#050b14]"
                >
                  <img
                    src={controllers[0]?.image}
                    alt={controllers[0]?.name || 'ZIPI Remote Controller'}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <span className="rounded-lg border border-cyan-400/40 bg-[#050b14]/85 px-3 py-1 text-cyan-300">
                      {controllers[0]?.name}
                    </span>
                    <span className="rounded-lg border border-white/15 bg-[#050b14]/85 px-3 py-1 text-[#f1f5f9]">
                      {controllers[0]?.specs?.transmissionRange || '—'}
                    </span>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. 3-STEP ANIMATED CONTROLLER FINDER QUIZ */}
      <section id="controller-finder" className="scroll-mt-24 bg-[#08121f] border-b border-white/10 py-16 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal direction="up" className="text-center mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              3-STEP MATCHING WIZARD
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              Interactive Controller Finder
            </h2>
          </Reveal>

          <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8 shadow-2xl">
            {!quizComplete ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Question {quizStep + 1} of {FINDER_QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {FINDER_QUESTIONS.map((q, idx) => (
                      <span
                        key={q.id}
                        className={`h-2 rounded-full transition-all ${
                          idx <= quizStep ? 'w-8 bg-cyan-400' : 'w-3 bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={activeQuestion.id}
                  initial={shouldReduceMotion ? false : { x: quizDirection > 0 ? 22 : -22 }}
                  animate={{ x: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
                  className="space-y-5"
                >
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f1f5f9]">
                    {activeQuestion.stepTitle}
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeQuestion.options.map((opt) => {
                      const selected = quizAnswers[activeQuestion.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleQuizOption(activeQuestion.id, opt.id)}
                          className={`flex min-h-[72px] flex-col justify-center rounded-2xl border p-4 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                            selected
                              ? 'border-cyan-400 bg-cyan-400/15 text-[#f1f5f9]'
                              : 'border-white/10 bg-[#050b14]/70 text-[#f1f5f9] hover:border-cyan-400/50 hover:bg-[#112640]'
                          }`}
                        >
                          <span className="font-display text-base font-bold">{opt.label}</span>
                          <span className="mt-1 text-xs text-[#94a3b8]">{opt.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={quizStep === 0}
                    onClick={() => {
                      setQuizDirection(-1);
                      setQuizStep((s) => Math.max(0, s - 1));
                    }}
                    className="btn-mission-ghost min-h-[44px] disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="font-mono text-xs text-[#94a3b8] hover:text-cyan-300 py-2 px-3"
                  >
                    Reset Finder
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6" role="status" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#34d399]">
                      RECOMMENDED MATCH READY
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#f1f5f9] mt-0.5">
                      Best Controller for Your Mission
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="btn-mission-ghost min-h-[44px]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Retake Quiz</span>
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: 'Primary Recommendation', item: recommendation?.primary, primary: true },
                    { label: 'Runner-Up Option', item: recommendation?.runnerUp, primary: false },
                  ].map(
                    ({ label, item, primary }) =>
                      item && (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 ${
                            primary
                              ? 'border-cyan-400/60 bg-[#050b14]/85 shadow-[0_0_28px_rgba(34,211,238,0.16)]'
                              : 'border-white/10 bg-[#050b14]/60'
                          }`}
                        >
                          <div>
                            <span
                              className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                                primary
                                  ? 'bg-cyan-400 text-[#031018]'
                                  : 'border border-white/15 bg-white/5 text-[#94a3b8]'
                              }`}
                            >
                              {label}
                            </span>
                            <h4 className="mt-3 font-display text-xl font-bold text-[#f1f5f9]">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-xs text-[#94a3b8]">{item.tagline}</p>
                            <p className="mt-3 font-display text-2xl font-extrabold text-cyan-300">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => addToCart(item.id, item.colors?.[0]?.name || 'Standard')}
                              className="btn-mission-primary flex-1 min-h-[44px]"
                            >
                              <ShoppingBag className="h-4 w-4" />
                              <span>Add to Cart</span>
                            </button>
                            <Link
                              to={`/contact?type=order&product=${item.id}`}
                              className="btn-mission-ghost min-h-[44px]"
                            >
                              <span>Enquire</span>
                            </Link>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. CONTROLLER GRID (4 Controllers with Tilt, Works With, Add, Compare, Enquire) */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal direction="left" className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              C2 CONTROLLER FLEET
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              Compare All {controllers.length} Remote Controllers
            </h2>
          </div>
          <Link
            to="/products?type=controller"
            className="font-mono text-xs uppercase tracking-wider text-cyan-300 hover:underline"
          >
            View in Full Catalog
          </Link>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-2">
          {controllers.map((ctrl) => {
            const isCompared = compare.includes(ctrl.id);
            const compatDroneNames = (CONTROLLER_COMPATIBILITY[ctrl.id] || [])
              .map((dId) => getProduct(dId)?.name?.replace('ZIPI ', ''))
              .filter(Boolean);

            return (
              <StaggerItem key={ctrl.id}>
                <Tilt className="h-full rounded-3xl">
                  <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 transition-colors hover:border-cyan-400/50">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                            {ctrl.subCategory}
                          </span>
                          <h3 className="mt-1 font-display text-2xl font-bold text-[#f1f5f9]">
                            <Link to={`/product/${ctrl.id}`} className="hover:text-cyan-300 transition">
                              {ctrl.name}
                            </Link>
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCompare(ctrl.id)}
                          aria-pressed={isCompared}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                            isCompared
                              ? 'border-cyan-400 bg-cyan-400 text-[#031018]'
                              : 'border-white/15 bg-[#050b14]/60 text-[#94a3b8] hover:text-white'
                          }`}
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>{isCompared ? 'Compared' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="relative my-5 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-[#050b14]">
                        <img
                          src={ctrl.image}
                          alt={ctrl.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>

                      <p className="text-sm text-[#94a3b8] leading-relaxed">{ctrl.tagline}</p>

                      {/* Key Specs */}
                      <div className="mt-4 grid grid-cols-2 gap-2.5 font-mono text-xs">
                        <div className="rounded-xl border border-white/10 bg-[#050b14]/70 p-2.5">
                          <span className="block text-[10px] uppercase text-[#94a3b8]">Display</span>
                          <span className="font-bold text-[#f1f5f9]">{ctrl.specs?.display || '—'}</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-[#050b14]/70 p-2.5">
                          <span className="block text-[10px] uppercase text-[#94a3b8]">Range</span>
                          <span className="font-bold text-[#f1f5f9]">
                            {ctrl.specs?.transmissionRange || '—'}
                          </span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-[#050b14]/70 p-2.5">
                          <span className="block text-[10px] uppercase text-[#94a3b8]">Battery</span>
                          <span className="font-bold text-[#f1f5f9]">
                            {ctrl.specs?.batteryLife || '—'}
                          </span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-[#050b14]/70 p-2.5">
                          <span className="block text-[10px] uppercase text-[#94a3b8]">Rating</span>
                          <span className="font-bold text-cyan-300">
                            {ctrl.specs?.ingressProtection || '—'}
                          </span>
                        </div>
                      </div>

                      {/* Works With Row */}
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#94a3b8] mb-2">
                          Works with:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {compatDroneNames.map((dName) => (
                            <span
                              key={dName}
                              className="rounded-full border border-white/10 bg-[#050b14] px-2.5 py-1 font-mono text-[10px] text-[#f1f5f9]"
                            >
                              {dName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className="font-display text-2xl font-extrabold text-[#f1f5f9]">
                        {formatPrice(ctrl.price)}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(ctrl.id, ctrl.colors?.[0]?.name || 'Standard')}
                          className="btn-mission-primary min-h-[44px]"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                        <Link
                          to={`/contact?type=order&product=${ctrl.id}`}
                          className="btn-mission-ghost min-h-[44px]"
                        >
                          <span>Enquire</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </Tilt>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* 4. HOTSPOT VIEWER & BUNDLE BUILDER */}
      {inspectedController && (
        <section className="bg-[#08121f] border-y border-white/10 py-16 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <Reveal direction="right" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                  SUBSYSTEM INSPECTOR &amp; KIT BUILDER
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[#f1f5f9]">
                  Inspect Controls &amp; Complete Your Kit
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {controllers.map((ctrl) => (
                  <button
                    key={ctrl.id}
                    type="button"
                    onClick={() => {
                      setInspectedId(ctrl.id);
                      notify(`Loaded ${ctrl.name} in inspector`, 'info');
                    }}
                    className={`min-h-[44px] rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold transition ${
                      inspectedController.id === ctrl.id
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                        : 'border-white/10 bg-[#0b1a2c] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {ctrl.name.replace('ZIPI ', '')}
                  </button>
                ))}
              </div>
            </Reveal>

            <ControllerInspector key={inspectedController.id} controller={inspectedController} />
          </div>
        </section>
      )}

      {/* 5. SIDE-BY-SIDE COMPARE TABLE (Differences highlighted) */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal direction="left" className="mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            SPECIFICATION COMPARISON (UP TO 3)
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[#f1f5f9]">
            Controller Spec Matrix
          </h2>
          <p className="mt-1 text-xs text-[#94a3b8]">
            Rows with differing capabilities across selected controllers are highlighted. Missing catalog entries display &ldquo;&mdash;&rdquo;.
          </p>
        </Reveal>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0b1a2c]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#08121f] font-mono uppercase tracking-wider text-[#94a3b8]">
              <tr>
                <th className="px-5 py-4 w-48">Specification</th>
                {comparedControllers.map((ctrl) => (
                  <th key={ctrl.id} className="px-5 py-4 text-[#f1f5f9]">
                    <div className="flex items-center justify-between gap-2">
                      <span>{ctrl.name}</span>
                      <span className="text-cyan-300">{formatPrice(ctrl.price)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {SPEC_ROWS.map((row) => {
                const values = comparedControllers.map((c) => c.specs?.[row.key] || '—');
                const differs = new Set(values).size > 1;
                return (
                  <tr
                    key={row.key}
                    className={differs ? 'bg-cyan-400/[0.06]' : undefined}
                  >
                    <td className="px-5 py-3.5 font-mono text-[#94a3b8]">
                      <span>{row.label}</span>
                      {differs && (
                        <span className="ml-2 rounded bg-cyan-400/20 px-1.5 py-0.5 text-[9px] text-cyan-300">
                          DIFF
                        </span>
                      )}
                    </td>
                    {values.map((val, idx) => (
                      <td key={`${row.key}-${idx}`} className="px-5 py-3.5 font-medium text-[#f1f5f9]">
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. COMPATIBILITY MATRIX (All 13 Drones vs 4 Controllers) */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <Reveal direction="up" className="mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            FLEET INTEROPERABILITY MATRIX
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[#f1f5f9]">
            Drone &amp; Controller Compatibility
          </h2>
          <p className="mt-1 text-xs text-[#94a3b8]">
            Hover or focus any status cell for compatibility details.
          </p>
        </Reveal>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0b1a2c]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#08121f] font-mono uppercase tracking-wider text-[#94a3b8]">
              <tr>
                <th className="px-5 py-4">UAV Platform</th>
                {controllers.map((ctrl) => (
                  <th key={ctrl.id} className="px-4 py-4 text-center text-[#f1f5f9]">
                    {ctrl.name.replace('ZIPI ', '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {drones.map((drone) => (
                <tr key={drone.id} className="hover:bg-white/[0.03]">
                  <td className="px-5 py-3 font-medium text-[#f1f5f9]">
                    <Link to={`/product/${drone.id}`} className="hover:text-cyan-300 transition">
                      {drone.name}
                    </Link>
                  </td>
                  {controllers.map((ctrl) => {
                    const compatible = (CONTROLLER_COMPATIBILITY[ctrl.id] || []).includes(drone.id);
                    return (
                      <td key={`${drone.id}-${ctrl.id}`} className="px-4 py-3 text-center">
                        <span
                          tabIndex={0}
                          title={
                            compatible
                              ? `${ctrl.name} supports ${drone.name}`
                              : `${ctrl.name} is not paired for ${drone.name}`
                          }
                          aria-label={
                            compatible
                              ? `${ctrl.name} compatible with ${drone.name}`
                              : `${ctrl.name} not compatible with ${drone.name}`
                          }
                          className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border font-bold outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                            compatible
                              ? 'border-[#34d399]/40 bg-[#34d399]/15 text-[#34d399]'
                              : 'border-white/10 bg-white/[0.03] text-[#94a3b8]/60'
                          }`}
                        >
                          {compatible ? <Check className="h-4 w-4" /> : <X className="h-3.5 w-3.5" />}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Drag carousel quick links */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-[#f1f5f9]">
              Quick-Access Controller Models
            </h3>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Drag to browse
            </span>
          </div>
          <Carousel
            items={controllers}
            label="Remote controller models"
            renderItem={(ctrl) => (
              <div className="rounded-2xl border border-white/10 bg-[#0b1a2c] p-4 space-y-3">
                <p className="font-mono text-[10px] uppercase text-cyan-300">{ctrl.subCategory}</p>
                <p className="font-display text-base font-bold text-[#f1f5f9] truncate">{ctrl.name}</p>
                <p className="font-mono text-sm font-bold text-[#f1f5f9]">{formatPrice(ctrl.price)}</p>
                <Link
                  to={`/product/${ctrl.id}`}
                  className="inline-block font-mono text-xs text-cyan-300 hover:underline"
                >
                  Open Controller Page
                </Link>
              </div>
            )}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

