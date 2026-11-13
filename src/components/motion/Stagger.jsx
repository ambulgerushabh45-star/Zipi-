import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export function Stagger({ children, className = '', staggerMs = 70 }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-30px 0px' });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setFallbackVisible(true), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = Boolean(shouldReduceMotion || isInView || fallbackVisible);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={visible ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerMs / 1000,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0.01, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.34,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

