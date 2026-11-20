import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { getProduct, CATEGORY_LABELS } from '@/data/products';
import { formatPrice } from '@/lib/format';

export default function CartDrawer({ open, onClose }) {
    const { cart, cartTotal, updateQuantity, removeFromCart } = useShop();
    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    const checkout = () => {
        onClose();
        navigate('/checkout');
    };

    const drawerTransition = prefersReducedMotion
        ? { duration: 0.01 }
        : { type: 'spring', stiffness: 320, damping: 32 };

    return (<AnimatePresence>
      {open && (<div className="fixed inset-0 z-[70]">
          <motion.div className="absolute inset-0 bg-black/65 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}/>
          <motion.aside role="dialog" aria-label="Shopping cart" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#08121f] text-[#f1f5f9] border-l border-white/10 shadow-2xl" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={drawerTransition}>
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-[#050b14]/60">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">Mission Equipment</p>
                <h2 className="text-2xl font-bold font-display text-[#f1f5f9]">Your Cart</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-2 text-[#94a3b8] transition hover:bg-white/10 hover:text-white" aria-label="Close cart">
                <X className="h-5 w-5"/>
              </button>
            </header>

            {/* Cart Items or Empty State */}
            {cart.length === 0 ? (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#0b1a2c] border border-cyan-400/30 text-cyan-400">
                  {!prefersReducedMotion && (
                    <motion.span
                      animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.15, 0.45] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full border border-cyan-400/40"
                    />
                  )}
                  <ShoppingBag className="h-7 w-7"/>
                </div>
                <p className="text-lg font-bold font-display text-[#f1f5f9]">Your cart is empty</p>
                <p className="text-sm text-[#94a3b8] max-w-xs">
                  Discover non-weaponized ISR platforms, precision agriculture drones, and long-range controllers.
                </p>
                <Link to="/products" onClick={onClose} className="mt-2 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#031018] shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:brightness-110 transition">
                  Explore Systems
                </Link>
              </motion.div>) : (<>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => {
                    const product = getProduct(item.productId);
                    if (!product)
                        return null;
                    return (<motion.li key={`${item.productId}-${item.color}`} layout={!prefersReducedMotion} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.22 }} className="flex gap-4 rounded-2xl border border-white/10 bg-[#0b1a2c] p-3.5 transition-colors hover:border-cyan-400/30">
                          <img src={product.image} alt={product.name} loading="lazy" className="h-20 w-20 rounded-xl object-cover bg-[#050b14] border border-white/10 flex-shrink-0"/>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                                  {CATEGORY_LABELS[product.category] || product.category}
                                </span>
                                <p className="font-semibold text-[#f1f5f9] leading-tight mt-0.5">{product.name}</p>
                                <p className="text-xs text-[#94a3b8] font-mono mt-0.5">
                                  Finish: {item.color} | {formatPrice(product.price)}
                                </p>
                              </div>
                              <button type="button" onClick={() => removeFromCart(item.productId, item.color)} className="rounded-full p-1.5 text-[#94a3b8] transition hover:bg-red-500/15 hover:text-red-400" aria-label={`Remove ${product.name}`}>
                                <Trash2 className="h-4 w-4"/>
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between pt-1">
                              {/* Quantity Controls */}
                              <div className="flex items-center rounded-full border border-white/15 bg-[#050b14]">
                                <button type="button" onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 text-[#94a3b8] transition hover:text-white disabled:opacity-30" aria-label="Decrease quantity">
                                  <Minus className="h-3.5 w-3.5"/>
                                </button>
                                <span className="w-8 text-center text-xs font-mono font-bold text-[#f1f5f9]">{item.quantity}</span>
                                <button type="button" onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)} disabled={item.quantity >= 10} className="p-1.5 text-[#94a3b8] transition hover:text-white disabled:opacity-30" aria-label="Increase quantity">
                                  <Plus className="h-3.5 w-3.5"/>
                                </button>
                              </div>

                              <p className="font-display font-bold text-[#f1f5f9] text-base">
                                {formatPrice(product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </motion.li>);
                })}
                  </AnimatePresence>
                </ul>

                <footer className="space-y-4 border-t border-[#AAB7C6]/20 bg-[#080F1B] px-6 py-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-[#AAB7C6]">Order Subtotal</span>
                    <span className="font-display text-2xl font-bold text-[#F5F8FC]">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#AAB7C6]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#00C8E8]"/>
                    <span>Free insured hardware delivery &amp; encrypted checkout</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      to="/checkout"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#AAB7C6]/30 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-[#F5F8FC] hover:border-[#00C8E8] hover:text-[#00C8E8] transition"
                    >
                      <span>View Cart</span>
                    </Link>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={checkout}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#00C8E8] py-3 text-xs font-black uppercase tracking-wider text-[#080F1B] shadow-[0_0_20px_rgba(0,200,232,0.4)] hover:brightness-105 active:scale-95 transition"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="h-4 w-4"/>
                    </motion.button>
                  </div>
                </footer>
              </>)}
          </motion.aside>
        </div>)}
    </AnimatePresence>);
}
