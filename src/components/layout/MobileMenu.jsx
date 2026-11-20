import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, User, ShoppingBag, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '@/data/navigation';
import { useShop } from '@/hooks/useShop';
import Logo from './Logo';

export default function MobileMenu({ open, onClose, onOpenCart, onOpenAccount }) {
  const [expandedId, setExpandedId] = useState(null);
  const { cartCount, wishlist } = useShop();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-[#080F1B] px-6 py-6 text-[#F5F8FC] lg:hidden"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: 'easeOut' }}
        >
          <div className="flex h-12 items-center justify-between border-b border-white/10 pb-4">
            <Logo tone="light" />
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-slate-300 hover:bg-[#101B2B] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8]"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-6 flex flex-col space-y-1" aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              if (!item.menu) {
                return (
                  <div key={item.id} className="border-b border-white/10 py-1">
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center py-2.5 font-display text-xl font-bold text-[#F8FAFC] transition-colors hover:text-[#00C8FF] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }

              const { menu } = item;
              const expanded = expandedId === item.id;

              return (
                <div key={item.id} className="border-b border-white/10 py-1">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className={`flex min-h-[44px] w-full items-center justify-between py-2.5 text-left font-display text-xl font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] ${
                      expanded ? 'text-[#00C8FF]' : 'text-[#F8FAFC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-base font-bold text-cyan-300" aria-hidden="true">
                      {expanded ? '−' : '+'}
                    </span>
                  </button>

                  {expanded && (
                    <div className="pl-2 pb-2">
                      <ul className="flex flex-col space-y-1">
                        {menu.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              to={link.to}
                              onClick={onClose}
                              className="flex min-h-[44px] items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-200 transition-colors hover:bg-[#101B2A] hover:text-[#00C8FF] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
                            >
                              <span>{link.label}</span>
                              {link.badge && (
                                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Account & Cart Quick Access */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAccount?.();
              }}
              className="flex min-h-[44px] items-center gap-3 py-2 text-base font-bold text-[#F8FAFC] hover:text-[#00C8FF] transition-colors"
            >
              <User className="h-5 w-5 text-[#00C8FF]" />
              <span>Sign In / Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart?.();
              }}
              className="flex min-h-[44px] items-center justify-between py-2 text-base font-bold text-[#F8FAFC] hover:text-[#00C8FF] transition-colors"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#00C8FF]" />
                <span>Procurement Cart</span>
              </span>
              {cartCount > 0 && (
                <span className="rounded-full bg-[#00C8FF] px-2 py-0.5 text-xs font-black text-[#07111F]">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex min-h-[44px] items-center justify-between py-2 text-base font-bold text-[#F8FAFC] hover:text-[#00C8FF] transition-colors"
            >
              <span className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-[#FF9B42]" />
                <span>Saved Platforms (Wishlist)</span>
              </span>
              {wishlist.length > 0 && (
                <span className="rounded-full bg-[#101B2A] px-2 py-0.5 text-xs font-bold text-[#FF9B42]">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>ZIPI DRONES &amp; CONTROLS</span>
            <Link to="/contact" onClick={onClose} className="text-[#00C8FF] hover:underline py-2">
              Support Desk
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
