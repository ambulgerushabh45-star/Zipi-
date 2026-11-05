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
    const isAgri = id === 'agriculture';
    return (<motion.div id="mega-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }} className="absolute inset-x-0 top-full border-b border-white/10 bg-neutral-950/95 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-white">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={id} variants={contentVariants} initial="hidden" animate="show" exit="exit" className="grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${isAgri ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse`}/>
                <p className={`text-[11px] font-mono font-bold uppercase tracking-[0.25em] ${isAgri ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {menu.eyebrow}
                </p>
              </motion.div>

              <ul className="mt-6 space-y-1">
                {menu.links.map((link) => (<motion.li key={link.label} variants={itemVariants} whileHover="hover" className="border-b border-white/5 last:border-b-0">
                    <Link to={link.to} onClick={onNavigate} className="group flex items-center justify-between rounded-xl py-3.5 px-3 transition-colors duration-200 hover:bg-white/[0.04] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg font-bold text-white transition-colors duration-200 group-hover:text-cyan-400">
                            {link.label}
                          </span>
                          {link.badge && (<span className="rounded-full border border-cyan-500/40 bg-cyan-950/60 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                              {link.badge}
                            </span>)}
                        </div>
                        {link.tagline && (<p className="mt-0.5 text-xs text-zinc-400 font-light">
                            {link.tagline}
                          </p>)}
                      </div>

                      <motion.span variants={arrowVariants} className="flex text-zinc-400 transition-colors duration-200 group-hover:text-cyan-400">
                        <ArrowRight className="h-5 w-5"/>
                      </motion.span>
                    </Link>
                  </motion.li>))}
              </ul>
            </div>

            <motion.div variants={itemVariants} whileHover="hover" className="group relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 md:col-span-7">
              <div className="absolute inset-0 overflow-hidden">
                <motion.img src={menu.promo.image} alt={menu.promo.imageAlt} variants={imageVariants} className="h-full w-full object-cover filter brightness-75 contrast-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"/>
              </div>

              <Link to={menu.promo.to} onClick={onNavigate} className="relative z-10 flex h-full flex-col justify-end p-8 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-300 backdrop-blur w-fit">
                  <Sparkles className="h-3 w-3 text-cyan-400"/>
                  <span>{menu.promo.eyebrow}</span>
                </div>

                <h3 className="mt-4 max-w-lg font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  {menu.promo.headline}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300">
                  <span>{menu.promo.cta || 'Explore System'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"/>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>);
}
