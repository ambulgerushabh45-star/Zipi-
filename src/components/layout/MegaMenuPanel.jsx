import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const MegaMenuPanel = forwardRef(function MegaMenuPanel(
  { id, menu, onNavigate, onEscape, onMouseEnter, onMouseLeave, topClass = 'top-20' },
  ref
) {
  const shouldReduceMotion = useReducedMotion();

  const handlePanelKeyDown = (e) => {
    const panelEl = e.currentTarget;
    const links = Array.from(panelEl.querySelectorAll('[data-megamenu-link="true"]'));
    if (links.length === 0) return;

    const currentIndex = links.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % links.length;
      links[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex =
        currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
      links[prevIndex].focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      id="mega-menu"
      role="region"
      aria-label={`${menu.title} menu`}
      onKeyDown={handlePanelKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
      className={`fixed inset-x-0 ${topClass} z-[60] mx-auto w-full max-w-7xl max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-b-3xl border border-t-0 border-[#AAB7C6]/20 bg-[#101B2B]/95 text-[#F5F8FC] shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl`}
    >
      <div className="px-6 py-8 sm:px-10">
        <div key={id} className="grid gap-8 md:grid-cols-12 md:gap-10 items-start">
          {/* Single-column list on the left with thumbnails */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-2 w-2 rounded-full bg-[#00C8E8] shadow-[0_0_8px_#00C8E8]" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#00C8E8]">
                {menu.eyebrow}
              </p>
            </div>

            <ul className="mt-3 divide-y divide-white/5">
              {menu.links.map((link, idx) => (
                <motion.li
                  key={link.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, delay: shouldReduceMotion ? 0 : idx * 0.035 }}
                >
                  <Link
                    to={link.to}
                    data-megamenu-link="true"
                    onClick={onNavigate}
                    className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-[#162438] hover:pl-4 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8]"
                  >
                    {link.thumbnail && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#080F1B] p-1">
                        <img
                          src={link.thumbnail}
                          alt={link.label}
                          className="h-full w-full object-contain filter drop-shadow transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm sm:text-base font-bold text-[#F5F8FC] transition-colors duration-150 group-hover:text-[#00C8E8] truncate">
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className="rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#00C8E8] shrink-0">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.tagline && (
                        <p className="mt-0.5 text-xs text-[#AAB7C6] leading-relaxed truncate">
                          {link.tagline}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Featured image card on the right */}
          <div className="group relative h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-[#101923] md:col-span-6 shadow-2xl">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={menu.promo.image}
                alt={menu.promo.imageAlt}
                className="h-full w-full object-cover brightness-75 contrast-110 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D14] via-[#080D14]/70 to-transparent" />
            </div>

            <Link
              to={menu.promo.to}
              data-megamenu-link="true"
              onClick={onNavigate}
              className="relative z-10 flex h-full flex-col justify-end p-7 outline-none focus-visible:ring-2 focus-visible:ring-[#00C9E8] sm:p-9"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#080D14]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#00C9E8]">
                <Sparkles className="h-3 w-3 text-[#00C9E8]" />
                <span>{menu.promo.eyebrow}</span>
              </div>

              <h3 className="mt-3 max-w-lg font-display text-2xl font-extrabold leading-tight text-[#F8FAFC]">
                {menu.promo.headline}
              </h3>

              <span className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 transition-colors group-hover:text-sky-300">
                {menu.promo.cta || 'Explore System'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default MegaMenuPanel;
