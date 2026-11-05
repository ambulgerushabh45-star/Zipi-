import { motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, X, Heart, ShoppingBag, FileText, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { CATEGORY_LABELS, type Product } from '@/data/products';
import { formatPrice } from '@/lib/format';
import StarRating from './StarRating';
import DroneRender from '@/components/showcase/DroneRender';

type QuickViewModalProps = {
  product: Product;
  onClose: () => void;
  onRequestQuote?: (product: Product) => void;
};

export default function QuickViewModal({ product, onClose, onRequestQuote }: QuickViewModalProps) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [color, setColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const saved = wishlist.includes(product.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleAdd = () => {
    addToCart(product.id, color, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/15 bg-neutral-950 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] md:grid-cols-12"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-neutral-900/80 p-2.5 text-zinc-400 border border-white/10 hover:text-white transition"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Column: Visual Staging */}
        <div className="relative flex flex-col items-center justify-center bg-black/50 p-6 md:col-span-6 border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative w-full aspect-square flex items-center justify-center">
            {product.hardwareType === 'drone' ? (
              <DroneRender product={product} className="w-full max-h-72" />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-72 w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,229,255,0.25)] rounded-2xl"
              />
            )}
          </div>
          <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-cyan-400/70">
            SYSTEM SKU: {product.id.toUpperCase()}
          </span>
        </div>

        {/* Right Column: Information, Specs, Procurement Actions */}
        <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
              {product.badge && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-mono uppercase text-zinc-300">
                  {product.badge}
                </span>
              )}
            </div>

            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-white">
              {product.name}
            </h2>

            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} count={product.reviewCount} size={13} />
              <span className="text-xs font-mono text-zinc-500">|</span>
              <span className="text-xs font-mono text-cyan-400">IN STOCK // DEPLOY READY</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-zinc-300 font-light">
              {product.description}
            </p>

            {/* Specifications Box Tailored to Hardware Type */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-mono text-xs space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-cyan-400 mb-2">
                Mission Specifications
              </div>
              {product.hardwareType === 'controller' && (
                <>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Display:</span>
                    <strong className="text-white">{product.specs.display || 'FHD 2000-Nit'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Transmission Range:</span>
                    <strong className="text-white">{product.specs.transmissionRange || '15 km LOS'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Battery Life:</span>
                    <strong className="text-white">{product.specs.batteryLife || '8.5 Hours'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Channels:</span>
                    <strong className="text-white">{product.specs.channels || '16 Channels'}</strong>
                  </div>
                </>
              )}

              {product.hardwareType === 'gcs' && (
                <>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Console Monitor:</span>
                    <strong className="text-white">{product.specs.screenSize || 'Dual 24" 4K'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Workstation Processor:</span>
                    <strong className="text-white">{product.specs.processor || 'Intel Core i7'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">RAM / Storage:</span>
                    <strong className="text-white">{product.specs.ramStorage || '32GB / 1TB SSD'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Enclosure Protection:</span>
                    <strong className="text-white">{product.specs.ingressProtection || 'IP67 Sealed'}</strong>
                  </div>
                </>
              )}

              {product.hardwareType === 'avionics' && (
                <>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Data Throughput:</span>
                    <strong className="text-white">{product.specs.dataRate || '30 Mbps'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Frequency Band:</span>
                    <strong className="text-white">{product.specs.frequency || '1.4 GHz / 2.4 GHz'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Latency:</span>
                    <strong className="text-white">{product.specs.latency || '< 12 ms'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Weight &amp; Form:</span>
                    <strong className="text-white">{product.specs.weight || '185 g'}</strong>
                  </div>
                </>
              )}

              {(product.hardwareType === 'drone' || (!product.hardwareType && product.specs.flightTime)) && (
                <>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Flight Endurance:</span>
                    <strong className="text-white">{product.specs.flightTime}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Operational Range:</span>
                    <strong className="text-white">{product.specs.range}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-400">Maximum Velocity:</span>
                    <strong className="text-white">{product.specs.maxSpeed}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payload Capacity:</span>
                    <strong className="text-white">{product.specs.payloadCapacity || product.specs.weight}</strong>
                  </div>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Finish: <span className="text-white font-bold">{color}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform ${
                        color === c.name ? 'border-cyan-400 scale-125' : 'border-white/30 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Procurement Actions */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Procurement Valuation
                </span>
                <span className="font-display text-3xl font-extrabold text-white">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Quantity control */}
              <div className="flex items-center rounded-full border border-white/15 bg-white/5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-zinc-400 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="p-2 text-zinc-400 hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {product.isQuoteRequired ? (
                <button
                  onClick={() => {
                    onClose();
                    onRequestQuote?.(product);
                  }}
                  className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                >
                  <FileText className="h-4 w-4" />
                  <span>Request Formal Quote</span>
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                >
                  {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  <span>{added ? 'Added to Cart' : 'Add to Order'}</span>
                </button>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`rounded-xl border p-3 transition ${
                  saved
                    ? 'border-red-500/50 bg-red-500/20 text-red-400'
                    : 'border-white/15 bg-white/5 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
              </button>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition"
              >
                <span>Full Specs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
