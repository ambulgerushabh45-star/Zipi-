import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange }) {
  const [direction, setDirection] = useState(1);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const shouldReduceMotion = useReducedMotion();

  const clampQty = (num) => Math.min(999, Math.max(1, Number.isFinite(num) ? Math.round(num) : 1));

  const step = (delta) => {
    const next = clampQty(value + delta);
    if (next === value) return;
    setDirection(delta > 0 ? 1 : -1);
    onChange(next);
    setDraft(String(next));
  };

  const commitDraft = () => {
    const parsed = Number.parseInt(draft, 10);
    const next = clampQty(Number.isNaN(parsed) ? 1 : parsed);
    setDirection(next >= value ? 1 : -1);
    onChange(next);
    setDraft(String(next));
    setEditing(false);
  };

  const digits = String(value).split('');

  return (
    <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= 1}
        aria-label="Decrease unit quantity"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-cyan-300 disabled:opacity-35 disabled:hover:bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Minus className="h-4 w-4" />
      </button>

      {editing ? (
        <input
          type="number"
          min={1}
          max={999}
          autoFocus
          aria-label="Unit quantity"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitDraft();
            } else if (e.key === 'Escape') {
              setDraft(String(value));
              setEditing(false);
            }
          }}
          className="h-10 w-20 bg-transparent text-center font-mono text-base font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(String(value));
            setEditing(true);
          }}
          title="Click to type a quantity between 1 and 999"
          aria-label={`Quantity ${value} units. Click to type exact number.`}
          className="relative flex h-10 min-w-[5rem] items-center justify-center overflow-hidden px-3 font-mono text-base font-bold text-white rounded-lg hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span className="inline-flex items-center">
            {digits.map((digit, idx) => (
              <span key={`${idx}-${digits.length}`} className="relative inline-block h-6 w-[0.72em] overflow-hidden text-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={`${idx}-${digit}`}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { y: direction > 0 ? 16 : -16, opacity: 0 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : { y: direction > 0 ? -16 : 16, opacity: 0 }
                    }
                    transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
                    className="inline-block leading-6"
                  >
                    {digit}
                  </motion.span>
                </AnimatePresence>
              </span>
            ))}
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={() => step(1)}
        disabled={value >= 999}
        aria-label="Increase unit quantity"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-cyan-300 disabled:opacity-35 disabled:hover:bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

