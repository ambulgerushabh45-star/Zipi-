import { Heart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { Reveal, Tilt } from '@/components/motion';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';

export default function WishlistPage({ onOpenShowcase, }) {
    useDocumentTitle('Wishlist');
    const { wishlist, toggleWishlist, addToCart } = useShop();
    const savedProducts = wishlist
        .map((id) => getProduct(id))
        .filter(Boolean);

    return (<div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="border-b border-white/10 pb-6 mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            SAVED PLATFORMS
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
            Your Saved Fleet Wishlist ({savedProducts.length})
          </h1>
        </Reveal>

        {savedProducts.length === 0 ? (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-16 text-center max-w-lg mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-[#08121f] text-cyan-400">
              <Heart className="h-7 w-7"/>
            </div>
            <h2 className="mt-4 text-xl font-bold font-display text-[#f1f5f9]">No Systems Saved Yet</h2>
            <p className="mt-2 text-sm text-[#94a3b8]">
              Browse our non-weaponized ISR, precision agriculture, and controller collections to bookmark platforms for fleet evaluation.
            </p>
            <Link to="/products" className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 transition">
              Browse Fleet
            </Link>
          </motion.div>) : (<motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
            {savedProducts.map((product) => (<motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} className="h-full">
                <Tilt maxTilt={4} className="h-full">
                <div className="h-full rounded-3xl border border-white/10 bg-[#0b1a2c] p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-colors">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      {product.category}
                    </span>
                    <motion.button type="button" whileTap={{ scale: 0.84 }} onClick={() => toggleWishlist(product.id)} className="text-[#94a3b8] hover:text-red-400 p-1 transition" title="Remove from saved" aria-label={`Remove ${product.name} from wishlist`}>
                      <Trash2 className="h-4 w-4"/>
                    </motion.button>
                  </div>

                  <div onClick={() => onOpenShowcase(product.id)} className="relative my-4 aspect-[4/3] rounded-2xl bg-[#050b14] p-4 flex items-center justify-center cursor-pointer border border-white/5">
                    {product.hardwareType === 'drone' ? (<DroneRender product={product} className="max-h-40"/>) : (<img src={product.image} alt={product.name} loading="lazy" className="max-h-40 object-contain" />)}
                  </div>

                  <h3 onClick={() => onOpenShowcase(product.id)} className="font-display text-xl font-bold text-[#f1f5f9] hover:text-cyan-300 cursor-pointer">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#94a3b8] line-clamp-2">{product.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-display text-xl font-bold text-[#f1f5f9]">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onOpenShowcase(product.id)} className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase text-[#f1f5f9] hover:bg-white/10 transition">
                      Showcase
                    </button>
                    <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')} className="rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-4 py-2 text-xs font-bold uppercase text-[#031018] hover:brightness-110 transition">
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
                </div>
                </Tilt>
              </motion.div>))}
            </AnimatePresence>
          </motion.div>)}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>);
}
