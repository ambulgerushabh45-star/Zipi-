import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Marquee({ items = [], className = '', speedSeconds = 26 }) {
  const shouldReduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-[#0b1a2c] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#f1f5f9]"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  const repeated = [...items, ...items];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050b14] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050b14] to-transparent"
      />

      <motion.div
        animate={paused ? undefined : { x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speedSeconds,
            ease: 'linear',
          },
        }}
        className="flex w-max items-center gap-4"
      >
        {repeated.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-[#0b1a2c] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#f1f5f9] transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

