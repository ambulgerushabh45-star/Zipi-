import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Info, PackagePlus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProduct } from '@/data/products';
import { CONTROLLER_HOTSPOTS, CONTROLLER_KIT_PAIRINGS } from '@/data/controllers';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';

export default function ControllerInspector({ controller }) {
  const { addToCart, notify } = useShop();
  const shouldReduceMotion = useReducedMotion();

  const hotspots = CONTROLLER_HOTSPOTS[controller.id] || [];
  const [activeHotspotId, setActiveHotspotId] = useState(hotspots[0]?.id || null);

  const companionProducts = useMemo(() => {
    const ids = CONTROLLER_KIT_PAIRINGS[controller.id] || [];
    return ids.map(getProduct).filter(Boolean);
  }, [controller.id]);

  const [selectedKitIds, setSelectedKitIds] = useState(() =>
    companionProducts.slice(0, 2).map((p) => p.id)
  );

  const activeHotspot =
    hotspots.find((h) => h.id === activeHotspotId) || hotspots[0] || null;

  const toggleKitItem = (id) => {
    setSelectedKitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const kitTotal = useMemo(() => {
    const base = controller.price || 0;
    const extras = companionProducts
      .filter((p) => selectedKitIds.includes(p.id))
      .reduce((sum, p) => sum + (p.price || 0), 0);
    return base + extras;
  }, [controller.price, companionProducts, selectedKitIds]);

  const handleAddKit = () => {
    addToCart(controller.id, controller.colors?.[0]?.name || 'Standard', 1);
    companionProducts
      .filter((p) => selectedKitIds.includes(p.id))
      .forEach((p) => {
        addToCart(p.id, p.colors?.[0]?.name || 'Standard', 1);
      });
    notify(`Added ${controller.name} kit (${1 + selectedKitIds.length} items) to cart.`);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* Interactive Hotspot Image Viewer */}
      <div className="min-w-0 lg:col-span-7 rounded-3xl border border-white/10 bg-[#0b1a2c] p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              INTERACTIVE HARDWARE HOTSPOTS
            </span>
            <h3 className="font-display text-xl font-bold text-[#f1f5f9]">
              {controller.name} Layout
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#94a3b8]">
            Select pulsing nodes to inspect subsystems
          </span>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050b14]">
          <img
            src={controller.image}
            alt={`${controller.name} hardware hotspot view`}
            loading="lazy"
            className="h-full w-full object-cover brightness-90"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14]/80 via-transparent to-[#050b14]/25" />

          {hotspots.map((spot) => {
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                aria-label={`Inspect ${spot.title}`}
                aria-pressed={isSelected}
                onClick={() => setActiveHotspotId(spot.id)}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                {!shouldReduceMotion && (
                  <span className="absolute h-7 w-7 rounded-full bg-cyan-400/35 animate-ping" />
                )}
                <span
                  className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-transform ${
                    isSelected
                      ? 'scale-125 border-white bg-cyan-400 text-[#031018]'
                      : 'border-cyan-300 bg-[#050b14]/90 text-cyan-300 group-hover:scale-110'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
              </button>
            );
          })}
        </div>

        {activeHotspot && (
          <motion.div
            key={activeHotspot.id}
            initial={shouldReduceMotion ? false : { opacity: 0.5, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-cyan-400/30 bg-[#050b14]/85 p-4 flex items-start gap-3"
          >
            <Info className="h-5 w-5 shrink-0 text-cyan-300 mt-0.5" />
            <div>
              <h4 className="font-display text-sm font-bold text-[#f1f5f9]">
                {activeHotspot.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">
                {activeHotspot.detail}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Complete the Kit Bundle Builder */}
      <div className="min-w-0 lg:col-span-5 rounded-3xl border border-white/10 bg-[#0b1a2c] p-5 sm:p-7 space-y-5">
        <div className="border-b border-white/10 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
            COMPLETE THE KIT
          </span>
          <h3 className="font-display text-xl font-bold text-[#f1f5f9] mt-0.5">
            Field Command Bundle Builder
          </h3>
          <p className="mt-1 text-xs text-[#94a3b8]">
            Pair compatible datalinks, power hubs, and ground stations with {controller.name}.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Base Controller Row */}
          <div className="flex items-center justify-between rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-3.5 text-xs">
            <div className="min-w-0 pr-3">
              <span className="font-mono text-[10px] uppercase text-cyan-300 block">
                Base Controller (Included)
              </span>
              <span className="font-display text-sm font-bold text-[#f1f5f9] block truncate">
                {controller.name}
              </span>
            </div>
            <span className="font-mono font-bold text-[#f1f5f9] shrink-0">
              {formatPrice(controller.price)}
            </span>
          </div>

          {companionProducts.map((item) => {
            const checked = selectedKitIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleKitItem(item.id)}
                className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  checked
                    ? 'border-cyan-400/50 bg-[#112640] text-[#f1f5f9]'
                    : 'border-white/10 bg-[#050b14]/60 text-[#94a3b8] hover:border-white/25 hover:text-[#f1f5f9]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      checked
                        ? 'border-cyan-400 bg-cyan-400 text-[#031018]'
                        : 'border-white/25 bg-transparent'
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-[#f1f5f9] truncate">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] text-[#94a3b8] uppercase">
                      {item.subCategory || item.category}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-cyan-300 shrink-0">
                  +{formatPrice(item.price)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-4 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#94a3b8]">
              Configured Kit Total ({1 + selectedKitIds.length} items)
            </span>
            <span className="font-display text-2xl font-extrabold text-cyan-300 tabular-nums">
              {formatPrice(kitTotal)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddKit}
              className="btn-mission-primary min-h-[44px]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add Kit to Cart</span>
            </button>
            <Link
              to={`/contact?type=order&product=${controller.id}`}
              className="btn-mission-ghost min-h-[44px]"
            >
              <PackagePlus className="h-4 w-4 text-cyan-300" />
              <span>Enquire Kit</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
