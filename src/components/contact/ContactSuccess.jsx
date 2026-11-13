import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Copy, ArrowRight, Radio, UserCheck, MessageSquare } from 'lucide-react';

const STATUS_TIMELINE = [
  {
    id: 'received',
    title: 'Received',
    desc: 'Encrypted submission logged to MongoDB mission desk.',
    state: 'done',
    icon: Radio,
  },
  {
    id: 'assigned',
    title: 'Assigned to supervisor',
    desc: 'Routed to our sector supervisor for immediate technical triage.',
    state: 'active',
    icon: UserCheck,
  },
  {
    id: 'reply',
    title: 'Reply from our team',
    desc: 'Dedicated engineer responds within 4 business hours.',
    state: 'upcoming',
    icon: MessageSquare,
  },
];

export default function ContactSuccess({ referenceId, onReset }) {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = async () => {
    if (navigator.clipboard && referenceId) {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
      className="py-4 sm:py-6 space-y-8"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        {/* Drawn SVG Checkmark */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.28)]">
          <svg
            viewBox="0 0 52 52"
            className="h-11 w-11 text-cyan-300"
            fill="none"
            aria-hidden="true"
          >
            <motion.circle
              cx="26"
              cy="26"
              r="22"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeOpacity="0.4"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            />
            <motion.path
              d="M15 27L22.5 34.5L37.5 18.5"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.12, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300">
          TRANSMISSION CONFIRMED
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-50">
          Enquiry Dispatched to Supervisor
        </h2>

        {/* Reference ID pill */}
        <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
            Reference ID
          </span>
          <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-cyan-300">
            {referenceId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-200 hover:bg-white/15 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Copy reference ID"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 3-Step Status Timeline */}
      <div className="rounded-2xl border border-white/10 bg-[#050b14]/60 p-5 space-y-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
          Mission Dispatch Timeline
        </h3>

        <ol className="space-y-4">
          {STATUS_TIMELINE.map((item, idx) => {
            const Icon = item.icon;
            const isDone = item.state === 'done';
            const isActive = item.state === 'active';

            return (
              <motion.li
                key={item.id}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.25,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                }}
                className="flex items-start gap-3.5"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    isDone
                      ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                      : isActive
                        ? 'border-cyan-400/60 bg-cyan-400/20 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                        : 'border-white/15 bg-white/5 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-slate-100">
                      {idx + 1}. {item.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider ${
                        isDone
                          ? 'text-emerald-400'
                          : isActive
                            ? 'text-cyan-300'
                            : 'text-slate-400'
                      }`}
                    >
                      {isDone ? 'Completed' : isActive ? 'In Queue' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/[0.04] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-400 hover:text-[#050b14] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span>Send another enquiry</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

