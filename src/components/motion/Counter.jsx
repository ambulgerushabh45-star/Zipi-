import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export default function Counter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 380,
  className = '',
}) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-20px 0px' });
  const numericTarget = Number(value) || 0;
  const [display, setDisplay] = useState(shouldReduceMotion ? numericTarget : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(numericTarget);
      return undefined;
    }
    if (!isInView) return undefined;

    let rafId = null;
    const startTime = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (numericTarget - startVal) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplay(numericTarget);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isInView, numericTarget, durationMs, shouldReduceMotion]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

