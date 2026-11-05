import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { PRODUCTS, getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';

export default function WishlistPage({
  onOpenShowcase,
}: {
  onOpenShowcase: (id: string) => void;
}) {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const savedProducts = wishlist
    .map((id) => getProduct(id))
    .filter(Boolean) as (typeof PRODUCTS)[number][];

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="border-b border-white/10 pb-6 mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            SAVED PLATFORMS
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
            Your Aerospace Wishlist ({savedProducts.length})
          </h1>
        </div>

        {savedProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-16 text-center max-w-lg mx-auto">
            <Heart className="mx-auto h-12 w-12 text-zinc-600" />
            <h2 className="mt-4 text-xl font-bold font-display">No Aircraft Saved Yet</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Browse our tactical defence and precision agriculture collections to save platforms for evaluation.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300"
            >
              Browse Fleet
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border border-white/10 bg-neutral-900 p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      {product.category}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-zinc-400 hover:text-red-400 p-1"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div
                    onClick={() => onOpenShowcase(product.id)}
                    className="relative my-4 aspect-[4/3] rounded-2xl bg-black p-4 flex items-center justify-center cursor-pointer border border-white/5"
                  >
                    <DroneRender product={product} className="max-h-40" />
                  </div>

                  <h3
                    onClick={() => onOpenShowcase(product.id)}
                    className="font-display text-xl font-bold text-white hover:text-cyan-300 cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{product.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-display text-xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenShowcase(product.id)}
                      className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase text-white hover:bg-white/10"
                    >
                      Showcase
                    </button>
                    <button
                      onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')}
                      className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold uppercase text-black hover:bg-cyan-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
