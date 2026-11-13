import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ routeKey, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div key={routeKey} className="relative">
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ transformOrigin: '0% 50%' }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9]"
        />
      )}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0.85, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

