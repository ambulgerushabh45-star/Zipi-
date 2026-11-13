import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export default function Parallax({ children, offset = 40, className = '' }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-offset, offset]
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={shouldReduceMotion ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}

