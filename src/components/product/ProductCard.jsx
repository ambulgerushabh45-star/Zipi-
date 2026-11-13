import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { CATEGORY_LABELS } from '@/data/products';
import { discountPercent, formatPrice } from '@/lib/format';
import { Reveal, Tilt } from '@/components/motion';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product, index = 0 }) {
    const { wishlist, toggleWishlist, addToCart } = useShop();
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const saved = wishlist.includes(product.id);
    const discount = discountPercent(product.price, product.originalPrice);

    return (
      <Reveal delay={(index % 4) * 0.06} y={24} className="group relative h-full">
        <Tilt maxTilt={5} className="h-full">
          <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b1a2c]/95 p-4 shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#050b14] border border-white/5">
              <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`} className="block h-full w-full">
                <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"/>
              </Link>

              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {product.badge && (<span className="rounded-full bg-[#08121f]/90 border border-cyan-400/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur">
                    {product.badge}
                  </span>)}
                {discount > 0 && (<span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white">
                    -{discount}%
                  </span>)}
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.84 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={saved}
                aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-200 ${saved
                ? 'border-red-400/50 bg-red-500/20 text-red-400'
                : 'border-white/20 bg-[#050b14]/75 text-slate-300 hover:text-red-400'}`}
              >
                <motion.span animate={saved ? { scale: [1, 1.28, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                  <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`}/>
                </motion.span>
              </motion.button>

              {/* Quick Actions Bar on Hover */}
              <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <button type="button" onClick={() => setQuickViewOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 text-[11px] font-bold uppercase tracking-wider text-[#031018] backdrop-blur hover:bg-white">
                  <Eye className="h-3.5 w-3.5"/>
                  Quick View
                </button>
                <Link to={`/product/${product.id}`} className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] py-2 text-[11px] font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 shadow-[0_0_15px_rgba(34,211,238,0.45)]">
                  <Sparkles className="h-3.5 w-3.5"/>
                  3D Showcase
                </Link>
              </div>
            </div>

            <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400">
                {CATEGORY_LABELS[product.category]}
              </p>
              <Link to={`/product/${product.id}`} className="mt-1 font-display text-lg font-bold leading-snug text-[#f1f5f9] transition-colors hover:text-cyan-300">
                {product.name}
              </Link>
              <div className="mt-1.5">
                <StarRating rating={product.rating} count={product.reviewCount} size={11}/>
              </div>

              {/* Key Specs Preview */}
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-[#94a3b8]">
                <span>{product.specs.flightTime}</span>
                <span>•</span>
                <span>{product.specs.range}</span>
                <span>•</span>
                <span className="text-[#f1f5f9]">{product.specs.maxSpeed}</span>
              </div>

              <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  {product.originalPrice && (<span className="text-[11px] text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>)}
                  <span className="font-display text-xl font-bold text-[#f1f5f9]">{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/contact?type=order&product=${product.id}`}
                    className="flex h-10 items-center rounded-full border border-white/15 bg-white/5 px-3 text-[11px] font-semibold uppercase tracking-wider text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/15"
                  >
                    Enquire
                  </Link>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')}
                    className="group/btn flex h-10 items-center gap-1.5 rounded-full bg-white pl-3.5 pr-4 text-xs font-bold uppercase tracking-wider text-[#031018] transition-colors duration-200 hover:bg-[#22d3ee]"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <Plus className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90"/>
                    Add
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </Tilt>

        <AnimatePresence>
        {quickViewOpen && (<QuickViewModal product={product} onClose={() => setQuickViewOpen(false)}/>)}
      </AnimatePresence>
    </Reveal>);
}
