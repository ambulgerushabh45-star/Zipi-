import { Battery, Cpu, Radio, Shield, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { Reveal, Tilt } from '@/components/motion';

const ACCESSORY_IDS = ['power-hub', 'prop-guard', 'datalink-air-mesh', 'autopilot-vector-core'];

export default function PopularAccessoriesSection() {
  const { cart = [], addToCart } = useShop();
  const accessories = ACCESSORY_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <section id="popular-accessories" className="relative scroll-mt-20 border-t border-[#AAB7C6]/20 bg-[#F5F8FC] py-24 px-5 sm:px-8 text-[#111827]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#AAB7C6]/25 pb-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#0092ab]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C8E8] animate-pulse" />
              <span>UPGRADES &amp; HARDWARE // SPARES</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              Popular Accessories &amp; Avionics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-xl">
              High-output GaN multi-battery fast chargers, dynamically balanced carbon blades, and tactical encrypted flight controllers.
            </p>
          </div>

          <Link
            to="/accessories"
            className="inline-flex items-center gap-2 font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#00C8E8] transition"
          >
            <span>View All Accessories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* 4 Accessory Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {accessories.map((item, idx) => {
            const alreadyInCart = Array.isArray(cart) && cart.some((i) => i.productId === item.id);
            return (
              <Reveal key={item.id} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.05}>
                <Tilt className="h-full rounded-3xl">
                  <div className="group flex h-full flex-col justify-between rounded-3xl border border-[#AAB7C6]/30 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00C8E8] hover:shadow-[0_20px_45px_rgba(0,200,232,0.14)]">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#111827]">
                          {item.subCategory || 'Avionics'}
                        </span>
                        <span className="font-mono text-sm font-bold text-[#111827]">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {/* Product Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#080F1B] p-4 flex items-center justify-center mb-5 border border-[#AAB7C6]/20">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-108"
                        />
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="font-display text-lg font-bold text-[#111827] group-hover:text-[#0092ab] transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                        {item.tagline || item.description}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-mono text-xs font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#00C8E8] transition-colors"
                      >
                        Specs &rarr;
                      </Link>

                      <button
                        type="button"
                        onClick={() => addToCart(item.id, item.colors?.[0]?.name || 'Standard')}
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
