import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, Heart, Plus, Sparkles } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { CATEGORY_LABELS, type Product } from '@/data/products';
import { discountPercent, formatPrice } from '@/lib/format';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';

type ProductCardProps = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const saved = wishlist.includes(product.id);
  const discount = discountPercent(product.price, product.originalPrice);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 180, damping: 20 });
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,229,255,0.15), transparent 60%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 p-4 shadow-2xl transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
      >
        <motion.div
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-950 border border-white/5">
          <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </Link>

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>

          <button
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              saved
                ? 'border-red-500/50 bg-red-500/20 text-red-400'
                : 'border-white/20 bg-black/60 text-zinc-300 hover:text-red-400'
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Actions Bar on Hover */}
          <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white/90 py-2 text-[11px] font-bold uppercase tracking-wider text-black backdrop-blur hover:bg-white"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </button>
            <Link
              to={`/product/${product.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-cyan-400 py-2 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.6)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              3D Showcase
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-4" style={{ transform: 'translateZ(20px)' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400">
            {CATEGORY_LABELS[product.category]}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="mt-1 font-display text-lg font-bold leading-snug text-white transition-colors hover:text-cyan-300"
          >
            {product.name}
          </Link>
          <div className="mt-1.5">
            <StarRating rating={product.rating} count={product.reviewCount} size={11} />
          </div>

          {/* Key Specs Preview */}
          <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span>{product.specs.flightTime}</span>
            <span>•</span>
            <span>{product.specs.range}</span>
            <span>•</span>
            <span className="text-white">{product.specs.maxSpeed}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-white/5">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[11px] text-zinc-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="font-display text-xl font-bold text-white">{formatPrice(product.price)}</span>
            </div>
            <button
              onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')}
              className="group/btn flex h-10 items-center gap-1.5 rounded-full bg-white pl-3.5 pr-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-cyan-400 active:scale-95"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
              Add
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {quickViewOpen && (
          <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
        )}
      </AnimatePresence>
    </motion.article>
  );
}
