import { Radio, Eye, ShoppingBag, Sun, Wifi, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { Reveal, Tilt } from '@/components/motion';

const CONTROLLER_IDS = ['rc-pro-tactical', 'rc-touch-lumina', 'rc-longrange-x', 'gcs-portable-briefcase'];

export default function FeaturedControllersSection({ onOpenShowcase }) {
  const { cart = [], addToCart } = useShop();
  const controllers = CONTROLLER_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <section id="featured-controllers" className="relative scroll-mt-20 border-t border-b border-[#AAB7C6]/20 bg-[#101B2B] py-24 px-5 sm:px-8 text-[#F5F8FC]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#00C8E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C8E8] animate-pulse" />
              <span>COMMAND &amp; TELEMETRY // DAYLIGHT CONSOLES</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#F5F8FC] tracking-tight">
              Intelligent Remote Controllers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#AAB7C6] max-w-xl">
              2,000-nit ultra-bright daylight touchscreens with hardware-level AES-256 frequency-hopping RF datalinks and multi-UAV mission waypoint handoffs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/controllers"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00C8E8]/40 bg-[#00C8E8]/15 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#00C8E8] hover:bg-[#00C8E8] hover:text-[#080F1B] transition"
            >
              <span>Controller Finder Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* 4 Controller Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {controllers.map((controller, idx) => {
            const alreadyInCart = Array.isArray(cart) && cart.some((i) => i.productId === controller.id);
            return (
              <Reveal key={controller.id} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.05}>
                <Tilt className="h-full rounded-3xl">
                  <div className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#080F1B] p-6 shadow-xl transition-all duration-300 hover:border-[#00C8E8] hover:shadow-[0_20px_45px_rgba(0,200,232,0.18)]">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00C8E8]">
                          {controller.badge || 'Tactical C2'}
                        </span>
                        <span className="font-mono text-sm font-bold text-[#F5F8FC]">
                          {formatPrice(controller.price)}
                        </span>
                      </div>

                      {/* Large Product Render */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#101B2B] p-4 flex items-center justify-center mb-5 border border-white/10">
                        <img
                          src={controller.image}
                          alt={controller.name}
                          loading="lazy"
                          className="h-full w-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-108"
                        />
                        {onOpenShowcase && (
                          <button
                            type="button"
                            onClick={() => onOpenShowcase(controller.id)}
                            className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur transition hover:border-[#00C8E8] hover:text-[#00C8E8]"
                            title="Inspect 3D Blueprint"
                          >
                            <Eye className="h-3 w-3 text-[#00C8E8]" />
                            <span>Inspect</span>
                          </button>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="font-display text-lg font-bold text-[#F5F8FC] group-hover:text-[#00C8E8] transition-colors">
                        {controller.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#AAB7C6] leading-relaxed line-clamp-2">
                        {controller.tagline || controller.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[11px] font-mono">
                        {controller.specs?.display && (
                          <div className="flex items-center gap-1 text-[#AAB7C6] col-span-2">
                            <Sun className="h-3 w-3 text-[#00C8E8]" />
                            <span className="truncate">{controller.specs.display}</span>
                          </div>
                        )}
                        {controller.specs?.transmissionRange && (
                          <div className="flex items-center gap-1 text-[#AAB7C6]">
                            <Wifi className="h-3 w-3 text-[#00C8E8]" />
                            <span>{controller.specs.transmissionRange}</span>
                          </div>
                        )}
                        {controller.specs?.batteryLife && (
                          <div className="flex items-center gap-1 text-[#AAB7C6]">
                            <span>{controller.specs.batteryLife}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <Link
                        to={`/product/${controller.id}`}
                        className="font-mono text-xs font-bold uppercase tracking-wider text-[#00C8E8] hover:underline"
                      >
                        Specs &rarr;
                      </Link>

                      <button
                        type="button"
                        onClick={() => addToCart(controller.id, controller.colors?.[0]?.name || 'Standard')}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                          alreadyInCart
                            ? 'border border-emerald-500/40 bg-emerald-900/30 text-emerald-300'
                            : 'bg-[#00C8E8] text-[#080F1B] hover:brightness-110 active:scale-95'
                        }`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{alreadyInCart ? 'In Fleet' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
