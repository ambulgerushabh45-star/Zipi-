import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  ShoppingBag,
  Zap,
  Heart,
  ChevronRight,
  Share2,
  CheckCircle2,
  Sparkles,
  Rotate3d,
  Images,
  ArrowRight,
  Check,
  Truck,
  Award,
} from 'lucide-react';
import { PRODUCTS, getProduct, CATEGORY_LABELS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Reveal } from '@/components/motion';
import StarRating from '@/components/product/StarRating';
import Interactive3DViewer from '@/components/product/Interactive3DViewer';
import ProductGallery from '@/components/product/ProductGallery';
import ControllerInspector from '@/components/product/ControllerInspector';
import QuantityStepper from '@/components/contact/QuantityStepper';
import QuoteModal from '@/components/common/QuoteModal';
import CinematicShowcase from '@/components/showcase/CinematicShowcase';
import ProductCard from '@/components/product/ProductCard';
import Footer from '@/components/layout/Footer';

const SPEC_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specifications' },
  { id: 'highlights', label: 'Highlights' },
];

export default function ShowcasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, notify } = useShop();

  const product = getProduct(id || 'aegis-mk4') || PRODUCTS[0];
  useDocumentTitle(product.name);
  const [activeTab, setActiveTab] = useState('3d'); // '3d' | 'gallery'
  const [specTab, setSpecTab] = useState('specs'); // 'overview' | 'specs' | 'highlights'
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [cinematicModalOpen, setCinematicModalOpen] = useState(false);

  // Sync color when product changes
  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product?.id, product?.colors]);

  const isSaved = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, selectedColor, quantity);
    notify(`Added ${quantity}x ${product.name} to cart.`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product.id, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notify('Link copied to clipboard.', 'info');
    }
  };

  // Category determination
  const hardwareType = product.hardwareType || 'drone';
  const categoryLabel = CATEGORY_LABELS[product.category] || 'Autonomous Hardware';

  // Related products from same category or complement
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.hardwareType === hardwareType || p.category === product.category)
  ).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-24 pb-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* ==========================================================
            1. BREADCRUMBS NAVIGATION
            ========================================================== */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#AAB7C7] mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-[#00C8FF] transition">
            HOME
          </Link>
          <ChevronRight className="h-3 w-3 text-white/30" />
          <Link to="/products" className="hover:text-[#00C8FF] transition">
            PRODUCTS
          </Link>
          <ChevronRight className="h-3 w-3 text-white/30" />
          <Link
            to={`/products?category=${product.hardwareType === 'drone' ? 'uav-drones' : product.hardwareType}`}
            className="hover:text-[#00C8FF] transition uppercase"
          >
            {categoryLabel}
          </Link>
          <ChevronRight className="h-3 w-3 text-white/30" />
          <span className="text-[#00C8FF] font-bold truncate max-w-[220px]">
            {product.name}
          </span>
        </nav>

        {/* ==========================================================
            2. PRODUCT HERO GRID: 3D VIEWER / GALLERY + SHOPPING CARD
            ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              LEFT COLUMN (7 cols): INTERACTIVE 3D VIEWER & GALLERY TABS
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Viewer Mode Switcher */}
            <div className="flex items-center justify-between border-b border-[#101B2A] pb-3">
              <div className="inline-flex rounded-xl bg-[#101B2A] p-1 border border-white/5">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeTab === '3d'
                      ? 'bg-[#00C8FF] text-[#07111F] shadow-[0_0_15px_rgba(0,200,255,0.5)] font-bold'
                      : 'text-[#AAB7C7] hover:text-[#F5F8FC]'
                  }`}
                >
                  <Rotate3d className="h-4 w-4" />
                  <span>3D Turntable (360°)</span>
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeTab === 'gallery'
                      ? 'bg-[#00C8FF] text-[#07111F] shadow-[0_0_15px_rgba(0,200,255,0.5)] font-bold'
                      : 'text-[#AAB7C7] hover:text-[#F5F8FC]'
                  }`}
                >
                  <Images className="h-4 w-4" />
                  <span>HD Photo Gallery</span>
                </button>
              </div>

              {/* Cinematic Fullscreen Showcase Trigger */}
              <button
                onClick={() => setCinematicModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#00C8FF]/30 bg-[#101B2A]/60 px-3 py-1.5 text-xs font-mono text-[#00C8FF] hover:bg-[#101B2A] hover:border-[#00C8FF] transition"
                title="Launch Full Cinematic Experience"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cinematic Mode</span>
              </button>
            </div>

            {/* Main Stage: 3D Turntable or HD Gallery */}
            <div className="relative">
              {activeTab === '3d' ? (
                <Interactive3DViewer
                  product={product}
                  className="shadow-2xl"
                />
              ) : (
                <ProductGallery
                  product={product}
                  className="shadow-2xl"
                />
              )}
            </div>

            {/* Quick Guarantees & Certifications Pill Bar */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#101B2A] bg-[#101B2A]/40 p-4 text-center mt-2">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-[#00C8FF]" />
                <span className="text-[11px] font-bold text-[#F5F8FC]">Global Dispatch</span>
                <span className="text-[9px] text-[#AAB7C7]">Secure Express Freight</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <Award className="h-4 w-4 text-[#FF9B42]" />
                <span className="text-[11px] font-bold text-[#F5F8FC]">Military &amp; ISO Certified</span>
                <span className="text-[9px] text-[#AAB7C7]">Defense Compliance Ready</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-4 w-4 text-[#67B56B]" />
                <span className="text-[11px] font-bold text-[#F5F8FC]">3-Year Warranty</span>
                <span className="text-[9px] text-[#AAB7C7]">24/7 Field Support</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN (5 cols): STICKY PRODUCT DETAILS & ACTIONS
              ======================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#0b1a2c]/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Header: Badges & Sector */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {product.badge && (
                    <span className="rounded-full border border-[#00C8FF]/40 bg-[#00C8FF]/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00C8FF]">
                      {product.badge}
                    </span>
                  )}
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-mono uppercase text-[#AAB7C7]">
                    {categoryLabel}
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="rounded-full p-2 text-[#AAB7C7] hover:bg-white/10 hover:text-white transition"
                  title="Share system"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Product Title */}
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F5F8FC]">
                {product.name}
              </h1>

              {/* Star Rating & Review Count */}
              <div className="mt-2.5 flex items-center gap-3">
                <StarRating rating={product.rating} count={product.reviewCount} size={14} />
                <span className="text-xs font-mono text-[#AAB7C7]">
                  ({product.reviewCount} Certified Deployments)
                </span>
              </div>

              {/* Tagline */}
              <p className="mt-4 text-sm sm:text-base text-[#AAB7C7] leading-relaxed">
                {product.tagline || product.description}
              </p>
            </div>

            {/* Price & Availability Status */}
            <div className="border-y border-[#101B2A] py-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#AAB7C7] block">
                    PRICE // PROCUREMENT
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-display text-3xl sm:text-4xl font-black text-[#F5F8FC]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-mono text-sm text-[#AAB7C7] line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#67B56B]/40 bg-[#67B56B]/10 px-3 py-1 font-mono text-[10px] font-bold text-[#67B56B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#67B56B] animate-pulse" />
                    MISSION READY // IN STOCK
                  </div>
                  <span className="block font-mono text-[9px] text-[#AAB7C7] mt-1">
                    Dispatches within 24 Hours
                  </span>
                </div>
              </div>
            </div>

            {/* Color / Finish Selection (If Available) */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#AAB7C7] block mb-2">
                  Tactical Finish: <span className="text-[#F5F8FC] font-bold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => {
                    const active = selectedColor === c.name;
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition hover:border-white/50"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Select finish ${c.name}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="showcase-color-ring"
                            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                            className="absolute -inset-1 rounded-full border-2 border-[#22d3ee] shadow-[0_0_12px_rgba(34,211,238,0.55)]"
                          />
                        )}
                        {active && (
                          <Check className="relative z-10 h-4 w-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Shopping Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Animated Quantity Stepper */}
                <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={99} />

                {/* Primary Add to Cart Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-[#031018] shadow-[0_0_24px_rgba(34,211,238,0.4)] transition hover:brightness-110"
                >
                  <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
                  <span>Add to Cart</span>
                </motion.button>

                {/* Wishlist Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.86 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                    isSaved
                      ? 'border-red-500/50 bg-red-500/20 text-red-400'
                      : 'border-white/15 bg-[#08121f] text-[#94a3b8] hover:text-red-400 hover:border-red-500/40'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </motion.button>
              </div>

              {/* Secondary Actions: Buy Now & Request a Quote RFP */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00C8FF] px-4 text-xs font-bold uppercase tracking-wider text-[#07111F] shadow-[0_0_18px_rgba(0,200,255,0.4)] transition hover:bg-cyan-300"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-semibold uppercase tracking-wider text-[#F5F8FC] hover:bg-white/15 transition"
                >
                  <FileText className="h-3.5 w-3.5 text-[#00C8FF]" />
                  <span>Request Quote</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <Link
                  to={`/contact?type=order&product=${product.id}`}
                  className="flex h-10 items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-[#07111F] transition"
                >
                  Enquire to Order
                </Link>
                <Link
                  to={`/contact?type=dealer&product=${product.id}`}
                  className="flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 transition"
                >
                  Dealer Inquiry
                </Link>
              </div>
            </div>

            {/* Key Highlights Bullet Points */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="border-t border-[#101B2A] pt-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00C8FF] block mb-2">
                  KEY MISSION CAPABILITIES
                </span>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#AAB7C7]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#00C8FF] flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================================
            3. TECHNICAL SPECIFICATIONS TABS & DATASHEET
            ========================================================== */}
        <section className="mt-20 border-t border-white/10 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ENGINEERING DATASHEET</span>
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-[#f1f5f9]">
                System Intelligence &amp; Parameters
              </h2>
            </div>
            <button
              type="button"
              onClick={() => notify('Downloading certified spec sheet PDF...', 'info')}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#0b1a2c] px-4 py-2 text-xs font-mono text-cyan-300 hover:bg-[#22d3ee] hover:text-[#031018] transition"
            >
              <FileText className="h-4 w-4" />
              <span>Download Spec Sheet (PDF)</span>
            </button>
          </div>

          {/* Animated Spec Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
            {SPEC_TABS.map((t) => {
              const active = specTab === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSpecTab(t.id)}
                  className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                    active ? 'text-[#f1f5f9]' : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="showcase-spec-tab"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {specTab === 'overview' && (
            <Reveal className="grid gap-6 md:grid-cols-12 rounded-3xl border border-white/10 bg-[#0b1a2c]/70 p-6 sm:p-8">
              <div className="md:col-span-7 space-y-4">
                <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">SYSTEM BRIEF</p>
                <p className="text-base text-[#f1f5f9] leading-relaxed">{product.description}</p>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Engineered by ZIPI Drones &amp; Controls for non-weaponized ISR, precision agriculture, and industrial field operations. Ready for rapid enterprise fleet integration.
                </p>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-3">
                {Object.entries(product.specs || {}).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/10 bg-[#08121f] p-3.5">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="mt-1 block font-display text-sm font-bold text-[#f1f5f9]">
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {specTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(product.specs || {}).map(([key, value]) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <div
                    key={key}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1a2c]/60 p-4 hover:border-cyan-400/40 transition"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">
                      {formattedKey}
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-[#f1f5f9] mt-1">
                      {String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {specTab === 'highlights' && (
            <div className="grid gap-4 md:grid-cols-2">
              {(product.highlights || []).map((h, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0b1a2c]/70 p-4">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-[#f1f5f9] leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==========================================================
            3B. CONTROLLER HOTSPOT INSPECTOR & KIT BUILDER
            ========================================================== */}
        {hardwareType === 'controller' && (
          <section id="controller-inspector" className="mt-20 border-t border-white/10 pt-12">
            <ControllerInspector controller={product} />
          </section>
        )}

        {/* ==========================================================
            4. RELATED FLEET SYSTEMS ROW
            ========================================================== */}
        {relatedProducts.length > 0 && (
          <Reveal as="section" className="mt-20 border-t border-white/10 pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                  FREQUENTLY PAIRED
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#f1f5f9]">
                  Complementary Autonomous Hardware
                </h3>
              </div>
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 hover:underline"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* Mobile Sticky Enquire & Add Bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#050b14]/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase text-[#94a3b8] truncate max-w-[140px]">{product.name}</p>
            <p className="font-display text-base font-bold text-[#f1f5f9]">{formatPrice(product.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/contact?type=order&product=${product.id}`}
              className="rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300"
            >
              Enquire
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#031018]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      <QuoteModal
        product={product}
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      {/* Full-Screen Cinematic Showcase Modal */}
      {cinematicModalOpen && (
        <div className="fixed inset-0 z-[130] bg-black">
          <CinematicShowcase
            productId={product.id}
            onClose={() => setCinematicModalOpen(false)}
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
