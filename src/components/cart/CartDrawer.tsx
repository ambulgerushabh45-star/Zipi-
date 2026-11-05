import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useShop } from '@/hooks/useShop';
import { getProduct, CATEGORY_LABELS } from '@/data/products';
import { formatPrice } from '@/lib/format';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-neutral-950 text-white border-l border-white/10 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">Mission Equipment</p>
                <h2 className="text-2xl font-bold font-display text-white">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Cart Items or Empty State */}
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <p className="text-lg font-bold font-display text-white">Your cart is empty</p>
                <p className="text-sm text-zinc-400 max-w-xs">
                  Discover tactical defence platforms and precision agricultural systems.
                </p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="mt-2 rounded-full bg-cyan-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition"
                >
                  Explore Drones
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => {
                      const product = getProduct(item.productId);
                      if (!product) return null;
                      return (
                        <motion.li
                          key={`${item.productId}-${item.color}`}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-white/20"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-20 w-20 rounded-xl object-cover bg-neutral-900 border border-white/5 flex-shrink-0"
                          />
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                                  {CATEGORY_LABELS[product.category] || product.category}
                                </span>
                                <p className="font-semibold text-white leading-tight mt-0.5">{product.name}</p>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                  Color: {item.color} | Unit: {formatPrice(product.price)}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.productId, item.color)}
                                className="rounded-full p-1.5 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                                aria-label={`Remove ${product.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between pt-1">
                              {/* Quantity Controls */}
                              <div className="flex items-center rounded-full border border-white/15 bg-black/40">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-1.5 text-zinc-400 transition hover:text-white disabled:opacity-30"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-mono font-bold text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                                  disabled={item.quantity >= 10}
                                  className="p-1.5 text-zinc-400 transition hover:text-white disabled:opacity-30"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <p className="font-display font-bold text-white text-base">
                                {formatPrice(product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <footer className="space-y-4 border-t border-white/10 bg-neutral-950 px-6 py-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-zinc-400">Order Subtotal</span>
                    <span className="font-display text-2xl font-bold text-white">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Free secured aerospace freight &amp; encrypted checkout</span>
                  </div>
                  <button
                    onClick={checkout}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_24px_rgba(0,229,255,0.6)] hover:bg-cyan-300 transition active:scale-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
