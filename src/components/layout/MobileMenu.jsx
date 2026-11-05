import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X, User, ShoppingBag, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '@/data/navigation';
import { useShop } from '@/hooks/useShop';
import Logo from './Logo';

const EASE = [0.22, 1, 0.36, 1];

export default function MobileMenu({ open, onClose, onOpenCart, onOpenAccount }) {
  const [expandedId, setExpandedId] = useState(null);
  const { cartCount, wishlist } = useShop();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-[#07111F] px-6 py-6 text-[#F5F8FC] md:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="flex h-12 items-center justify-between border-b border-[#101B2A] pb-4">
            <Logo tone="light" />
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[#AAB7C7] hover:bg-[#101B2A] hover:text-[#F5F8FC]"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col space-y-1" aria-label="Mobile">
            {NAV_ITEMS.map((item, i) => {
              const delay = 0.05 + i * 0.04;

              if (!item.menu) {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay }}
                    className="border-b border-white/5 py-2"
                  >
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="block py-3 font-display text-2xl font-bold text-[#F5F8FC] transition-colors hover:text-[#00C8FF]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              }

              const { menu } = item;
              const expanded = expandedId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay }}
                  className="border-b border-white/5 py-2"
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="flex w-full items-center justify-between py-3 text-left font-display text-2xl font-bold text-[#F5F8FC]"
                  >
                    <span>{item.label}</span>
                    <motion.span
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <ChevronDown className="h-5 w-5 text-[#AAB7C7]" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="links"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden pl-2"
                      >
                        <ul className="flex flex-col pb-3 space-y-1">
                          {menu.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                to={link.to}
                                onClick={onClose}
                                className="block py-2 text-sm text-[#AAB7C7] transition-colors hover:text-[#00C8FF]"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          {/* Account & Cart Quick Access for Mobile Menu */}
          <div className="mt-6 pt-4 border-t border-[#101B2A] flex flex-col space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenAccount?.();
              }}
              className="flex items-center gap-3 py-2.5 text-base font-bold text-[#F5F8FC] hover:text-[#00C8FF] transition-colors"
            >
              <User className="h-5 w-5 text-[#00C8FF]" />
              <span>Sign In / Account</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCart?.();
              }}
              className="flex items-center justify-between py-2.5 text-base font-bold text-[#F5F8FC] hover:text-[#00C8FF] transition-colors"
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
              className="flex items-center justify-between py-2.5 text-base font-bold text-[#F5F8FC] hover:text-[#00C8FF] transition-colors"
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

          <div className="mt-auto pt-6 border-t border-[#101B2A] flex items-center justify-between text-xs font-mono text-[#AAB7C7]">
            <span>ZIPI AEROSPACE // VER. 4.8</span>
            <Link to="/contact" onClick={onClose} className="text-[#00C8FF] hover:underline">
              Support Desk →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
