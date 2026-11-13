import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const MegaMenuPanel = forwardRef(function MegaMenuPanel(
  { id, menu, onNavigate, onEscape, topClass = 'top-20' },
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
      initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: 'easeOut' }}
      className={`fixed inset-x-0 ${topClass} z-[60] mx-auto w-full max-w-7xl max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-b-3xl border border-t-0 border-white/10 bg-[#0b1a2c] text-[#f1f5f9] shadow-[0_28px_72px_rgba(0,0,0,0.92)]`}
    >
      <div className="px-5 py-7 sm:px-8">
        <div key={id} className="grid gap-8 md:grid-cols-12 md:gap-10 items-start">
          {/* Single-column list on the left */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                {menu.eyebrow}
              </p>
            </div>

            <ul className="mt-3 divide-y divide-white/10">
              {menu.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    data-megamenu-link="true"
                    onClick={onNavigate}
                    className="group block rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-[#101B2A] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-display text-base font-bold text-[#F8FAFC] transition-colors duration-150 group-hover:text-[#00C8FF]">
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    {link.tagline && (
                      <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                        {link.tagline}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured image card on the right */}
          <div className="group relative h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-[#101B2A] md:col-span-6 shadow-xl">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={menu.promo.image}
                alt={menu.promo.imageAlt}
                className="h-full w-full object-cover brightness-75 contrast-110 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111d] via-[#07111d]/70 to-transparent" />
            </div>

            <Link
              to={menu.promo.to}
              data-megamenu-link="true"
              onClick={onNavigate}
              className="relative z-10 flex h-full flex-col justify-end p-7 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] sm:p-9"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#07111d]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                <Sparkles className="h-3 w-3 text-cyan-300" />
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
