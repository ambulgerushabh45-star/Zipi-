import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Shield, Battery, Gauge, Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { useShop } from '@/hooks/useShop';
import { Reveal } from '@/components/motion';

const FEATURED_DRONE_IDS = ['aegis-mk4', 'terra-spray-x40', 'recon-raven', 'guardian-sentry'];
const FEATURED_CONTROLLER_IDS = ['rc-pro-tactical', 'rc-touch-lumina', 'rc-longrange-x'];

export default function FeaturedFleetSpotlight({ onOpenShowcase }) {
  const [activeTab, setActiveTab] = useState('drones'); // 'drones' | 'controllers'
  const { cart = [], addToCart } = useShop();

  const drones = FEATURED_DRONE_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const controllers = FEATURED_CONTROLLER_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  const activeItems = activeTab === 'drones' ? drones : controllers;

  return (
    <section className="relative z-10 border-b border-[#AAB7C6]/20 bg-[#F5F8FC] py-20 px-5 sm:px-8 text-[#111827]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#AAB7C6]/25 pb-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#0092ab]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C8E8] animate-pulse" />
              <span>PRODUCTION FLEET // SPOTLIGHT</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              Featured Systems &amp; Controls
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-xl">
              Inspect our most deployed industrial multi-rotor platforms and sunlight-readable tactical ground controllers.
            </p>
          </div>

          {/* Interactive Dual Category Switcher Tabs */}
          <div className="flex items-center rounded-2xl border border-[#AAB7C6]/30 bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('drones')}
              className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'drones' ? 'text-[#080F1B]' : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              {activeTab === 'drones' && (
                <motion.span
                  layoutId="spotlight-tab"
                  className="absolute inset-0 rounded-xl bg-[#00C8E8] shadow-[0_0_16px_rgba(0,200,232,0.4)]"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>UAV Drones</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('controllers')}
              className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                activeTab === 'controllers' ? 'text-[#080F1B]' : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              {activeTab === 'controllers' && (
                <motion.span
                  layoutId="spotlight-tab"
                  className="absolute inset-0 rounded-xl bg-[#00C8E8] shadow-[0_0_16px_rgba(0,200,232,0.4)]"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <span>Remote Controllers</span>
              </span>
            </button>
          </div>
        </Reveal>

        {/* Product Cards Grid with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {activeItems.map((product) => {
              const alreadyInCart = Array.isArray(cart) && cart.some((i) => i.productId === product.id);
              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between rounded-3xl border border-[#AAB7C6]/30 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00C8E8] hover:shadow-[0_20px_45px_rgba(0,200,232,0.14)]"
                >
                  <div>
                    {/* Badge and Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="rounded-full border border-[#00C8E8]/40 bg-[#00C8E8]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0092ab]">
                        {product.badge || 'Certified Fleet'}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#111827]">
                        ${product.price?.toLocaleString()}
                      </span>
                    </div>

                    {/* Image Preview with Hover Zoom */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#080F1B] p-4 flex items-center justify-center mb-5 border border-[#AAB7C6]/20">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                      />
                      {onOpenShowcase && (
                        <button
                          type="button"
                          onClick={() => onOpenShowcase(product.id)}
                          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur transition hover:border-[#00C8E8] hover:text-[#00C8E8]"
                        >
                          <Eye className="h-3 w-3" />
                          <span>3D</span>
                        </button>
                      )}
                    </div>

                    {/* Title and tagline */}
                    <h3 className="font-display text-lg font-bold text-[#111827] group-hover:text-[#0092ab] transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                      {product.tagline || product.description}
                    </p>

                    {/* Micro Spec Pills */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#F1F5F9] pt-3 text-[11px] font-mono">
                      {product.specs?.flightTime && (
                        <div className="flex items-center gap-1 text-[#64748B]">
                          <Battery className="h-3 w-3 text-[#0092ab]" />
                          <span>{product.specs.flightTime}</span>
                        </div>
                      )}
                      {product.specs?.range && (
                        <div className="flex items-center gap-1 text-[#64748B]">
                          <Gauge className="h-3 w-3 text-[#0092ab]" />
                          <span>{product.specs.range}</span>
                        </div>
                      )}
                      {product.specs?.display && (
                        <div className="flex items-center gap-1 text-[#64748B] col-span-2">
                          <Eye className="h-3 w-3 text-[#0092ab]" />
                          <span>{product.specs.display}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="font-mono text-xs font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#00C8E8] transition-colors"
                    >
                      Specifications &rarr;
                    </Link>

                    <button
                      type="button"
                      onClick={() => addToCart(product.id, product.colors?.[0]?.name || 'Standard')}
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
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* View Full Catalog Link */}
        <div className="mt-12 text-center">
          <Link
            to={activeTab === 'drones' ? '/products?category=uav-drones' : '/controllers'}
            className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-[#0092ab] hover:text-[#00C8E8] transition"
          >
            <span>View All {activeTab === 'drones' ? 'UAV Airframes' : 'Remote Controllers'}</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
