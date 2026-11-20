import { Shield, Eye, ShoppingBag, Battery, Gauge, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { Reveal, Tilt } from '@/components/motion';

const DRONE_IDS = ['aegis-mk4', 'terra-spray-x40', 'recon-raven', 'guardian-sentry'];

export default function FeaturedDronesSection({ onOpenShowcase }) {
  const { cart = [], addToCart } = useShop();
  const drones = DRONE_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <section id="featured-drones" className="relative scroll-mt-20 border-t border-[#AAB7C6]/20 bg-[#F5F8FC] py-24 px-5 sm:px-8 text-[#111827]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#AAB7C6]/25 pb-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#0092ab]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C8E8] animate-pulse" />
              <span>AIRFRAME DIVISION // CERTIFIED FLEET</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              Featured UAV Drone Platforms
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-xl">
              High-endurance multirotor platforms engineered for non-weaponized tactical ISR observation, infrastructure survey, and high-capacity precision spraying.
            </p>
          </div>

          <Link
            to="/products?category=uav-drones"
            className="inline-flex items-center gap-2 font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#00C8E8] transition"
          >
            <span>Explore All Drones ({PRODUCTS.filter(p => p.hardwareType === 'drone').length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* 4 Drone Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {drones.map((drone, idx) => {
            const alreadyInCart = Array.isArray(cart) && cart.some((i) => i.productId === drone.id);
            return (
              <Reveal key={drone.id} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.05}>
                <Tilt className="h-full rounded-3xl">
                  <div className="group flex h-full flex-col justify-between rounded-3xl border border-[#AAB7C6]/30 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00C8E8] hover:shadow-[0_20px_45px_rgba(0,200,232,0.14)]">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0092ab]">
                          {drone.badge || 'Certified'}
                        </span>
                        <span className="font-mono text-sm font-bold text-[#111827]">
                          {formatPrice(drone.price)}
                        </span>
                      </div>

                      {/* Large Product Render */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#080F1B] p-4 flex items-center justify-center mb-5 border border-[#AAB7C6]/20">
                        <img
                          src={drone.image}
                          alt={drone.name}
                          loading="lazy"
                          className="h-full w-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-108"
                        />
                        {onOpenShowcase && (
                          <button
                            type="button"
                            onClick={() => onOpenShowcase(drone.id)}
                            className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur transition hover:border-[#00C8E8] hover:text-[#00C8E8]"
                            title="Open 360 Turntable"
                          >
                            <Eye className="h-3 w-3 text-[#00C8E8]" />
                            <span>3D 360°</span>
                          </button>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="font-display text-lg font-bold text-[#111827] group-hover:text-[#0092ab] transition-colors">
                        {drone.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                        {drone.tagline || drone.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#F1F5F9] pt-3 text-[11px] font-mono">
                        {drone.specs?.flightTime && (
                          <div className="flex items-center gap-1 text-[#64748B]">
                            <Battery className="h-3 w-3 text-[#0092ab]" />
                            <span>{drone.specs.flightTime}</span>
                          </div>
                        )}
                        {drone.specs?.range && (
                          <div className="flex items-center gap-1 text-[#64748B]">
                            <Gauge className="h-3 w-3 text-[#0092ab]" />
                            <span>{drone.specs.range}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                      <Link
                        to={`/product/${drone.id}`}
                        className="font-mono text-xs font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#00C8E8] transition-colors"
                      >
                        Details &rarr;
                      </Link>

                      <button
                        type="button"
                        onClick={() => addToCart(drone.id, drone.colors?.[0]?.name || 'Tactical Black')}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                          alreadyInCart
                            ? 'border border-emerald-500/40 bg-emerald-50 text-emerald-700'
                            : 'bg-[#101B2B] text-white hover:bg-[#00C8E8] hover:text-[#080F1B] active:scale-95'
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
