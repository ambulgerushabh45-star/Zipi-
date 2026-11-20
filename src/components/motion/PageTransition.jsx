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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ transformOrigin: '0% 50%' }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] bg-gradient-to-r from-[#00C8E8] via-[#55A8FF] to-[#00C8E8] shadow-[0_0_12px_#00C8E8]"
        />
      )}

      {/* Main page content with subtle entrance lift */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0.94, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
