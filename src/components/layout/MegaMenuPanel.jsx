import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const EASE = [0.22, 1, 0.36, 1];

const contentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, staggerChildren: 0.05, delayChildren: 0.03 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.15 } },
};

const arrowVariants = {
  show: { x: 0 },
  hover: { x: 6, transition: { type: 'spring', stiffness: 400, damping: 22 } },
};

const imageVariants = {
  show: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.8, ease: EASE } },
};

export default function MegaMenuPanel({ id, menu, onNavigate }) {
  return (
    <motion.div
      id="mega-menu"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="absolute inset-x-0 top-full border-b border-[#101B2A] bg-[#07111F]/98 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-[#F5F8FC]"
    >
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={id}
            variants={contentVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid gap-8 md:grid-cols-12 md:gap-12"
          >
            <div className="md:col-span-5">
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#00C8FF]">
                  {menu.eyebrow}
                </p>
              </motion.div>

              <ul className="mt-6 space-y-1">
                {menu.links.map((link) => (
                  <motion.li
                    key={link.label}
                    variants={itemVariants}
                    whileHover="hover"
                    className="border-b border-white/5 last:border-b-0"
                  >
                    <Link
                      to={link.to}
                      onClick={onNavigate}
                      className="group flex items-center justify-between rounded-xl py-3.5 px-3 transition-colors duration-200 hover:bg-[#101B2A] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg font-bold text-[#F5F8FC] transition-colors duration-200 group-hover:text-[#00C8FF]">
                            {link.label}
                          </span>
                          {link.badge && (
                            <span className="rounded-full border border-[#00C8FF]/40 bg-[#00C8FF]/10 px-2 py-0.5 text-[9px] font-mono font-bold text-[#00C8FF]">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.tagline && (
                          <p className="mt-0.5 text-xs text-[#AAB7C7] font-light">
                            {link.tagline}
                          </p>
                        )}
                      </div>

                      <motion.span
                        variants={arrowVariants}
                        className="flex text-[#AAB7C7] transition-colors duration-200 group-hover:text-[#00C8FF]"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="group relative h-[360px] overflow-hidden rounded-3xl border border-[#101B2A] bg-[#101B2A]/70 md:col-span-7 shadow-lg"
            >
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={menu.promo.image}
                  alt={menu.promo.imageAlt}
                  variants={imageVariants}
                  className="h-full w-full object-cover filter brightness-75 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/60 to-transparent" />
              </div>

              <Link
                to={menu.promo.to}
                onClick={onNavigate}
                className="relative z-10 flex h-full flex-col justify-end p-8 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] sm:p-10"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07111F]/80 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#00C8FF] backdrop-blur w-fit">
                  <Sparkles className="h-3 w-3 text-[#00C8FF]" />
                  <span>{menu.promo.eyebrow}</span>
                </div>

                <h3 className="mt-4 max-w-lg font-display text-2xl font-extrabold leading-tight text-[#F5F8FC] sm:text-3xl">
                  {menu.promo.headline}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00C8FF] group-hover:text-[#FF9B42] transition-colors">
                  <span>{menu.promo.cta || 'Explore System'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
