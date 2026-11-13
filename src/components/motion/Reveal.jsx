import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const OFFSET_MAP = {
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  none: { x: 0, y: 0 },
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.36,
  className = '',
  as = 'div',
}) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  // Safety guarantee: never leave content stuck invisible if IntersectionObserver stalls
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFallbackVisible(true);
    }, 850);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = Boolean(shouldReduceMotion || isInView || fallbackVisible);
  const offset = shouldReduceMotion ? OFFSET_MAP.none : OFFSET_MAP[direction] || OFFSET_MAP.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={false}
      animate={
        visible
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0.01, x: offset.x, y: offset.y }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : Math.min(0.4, duration),
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

