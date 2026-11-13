import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX: shouldReduceMotion ? scrollYProgress : scaleX,
        transformOrigin: '0% 50%',
      }}
      className="pointer-events-none h-[2px] w-full bg-gradient-to-r from-[#22d3ee] via-[#0ea5e9] to-[#22d3ee]"
    />
  );
}

