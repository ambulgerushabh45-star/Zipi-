import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Camera, Compass, ShieldCheck, Radio, X, ShoppingBag, Zap, Sliders, ChevronLeft, ChevronRight, CheckCircle2, Share2, FileText, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import DroneRender from './DroneRender';
export default function CinematicShowcase({ productId = 'aegis-mk4', initialProduct, onClose, }) {
    const navigate = useNavigate();
    const { addToCart, notify } = useShop();
    const [currentId, setCurrentId] = useState(initialProduct?.id || productId || 'aegis-mk4');
    const product = getProduct(currentId) || initialProduct || PRODUCTS[0];
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
    const [activeFeature, setActiveFeature] = useState('shooting');
    const [viewMode, setViewMode] = useState('tactical');
    const [specsModalOpen, setSpecsModalOpen] = useState(false);
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    // Synchronize when prop changes
    useEffect(() => {
        if (productId && productId !== currentId) {
            setCurrentId(productId);
        }
    }, [productId, currentId]);
    // Update selected color when product changes
    useEffect(() => {
        if (product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0].name);
        }
    }, [currentId, product.colors]);
    const currentIndex = PRODUCTS.findIndex((p) => p.id === currentId);
    const nextProduct = useCallback(() => {
        const nextIdx = (currentIndex + 1) % PRODUCTS.length;
        setCurrentId(PRODUCTS[nextIdx].id);
    }, [currentIndex]);
    const prevProduct = useCallback(() => {
        const prevIdx = (currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
        setCurrentId(PRODUCTS[prevIdx].id);
    }, [currentIndex]);
    // Keyboard accessibility
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                if (specsModalOpen)
                    setSpecsModalOpen(false);
                else if (onClose)
                    onClose();
            }
            else if (e.key === 'ArrowRight') {
                nextProduct();
            }
            else if (e.key === 'ArrowLeft') {
                prevProduct();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentId, specsModalOpen, onClose, nextProduct, prevProduct]);
    // Interactive 3D Parallax Tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [9, -9]), { stiffness: 140, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), { stiffness: 140, damping: 20 });
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };
    const handleMouseLeave = () => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    };
    // Color hex
    const activeColorObj = product.colors.find((c) => c.name === selectedColor) || product.colors[0];
    const handleAddToCart = () => {
        addToCart(product.id, selectedColor, 1);
    };
    const handleBuyNow = () => {
        addToCart(product.id, selectedColor, 1);
        if (onClose)
            onClose();
        navigate('/checkout');
    };
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            notify('Showcase link copied to clipboard!', 'info');
        }
    };
    // Dynamic color theme accents
    const isAgri = product.category === 'agriculture';
    const isDefence = product.category === 'defence';
    const accentGlow = isAgri
        ? 'rgba(16,185,129,0.22)'
        : isDefence
            ? 'rgba(0,229,255,0.25)'
            : 'rgba(56,189,248,0.22)';
    const accentActiveBg = isAgri
        ? 'bg-emerald-500 text-black shadow-[0_0_24px_rgba(16,185,129,0.7)]'
        : isDefence
            ? 'bg-cyan-400 text-black shadow-[0_0_24px_rgba(0,229,255,0.7)]'
            : 'bg-sky-400 text-black shadow-[0_0_24px_rgba(56,189,248,0.7)]';
    const features = product.showcaseFeatures;
    return (<div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative inset-0 min-h-screen w-full bg-black text-white overflow-hidden flex flex-col justify-between select-none" style={{ perspective: 1200 }}>
      {/* Dynamic Atmospheric Spotlights */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[140px] opacity-40 transition-colors duration-700" style={{ backgroundColor: accentGlow }}/>
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[450px] w-[900px] -translate-x-1/2 rounded-full blur-[160px] opacity-30 transition-colors duration-700" style={{ backgroundColor: accentGlow }}/>

      {/* TOP HEADER BAR */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-4">
          <button onClick={() => {
            if (onClose)
                onClose();
            else
                navigate(-1);
        }} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white" aria-label="Back to catalog">
            <ChevronLeft className="h-4 w-4"/>
            <span>Catalog</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"/>
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
              {product.category.toUpperCase()} // {product.subCategory || 'AEROSPACE SYSTEM'}
     // {product.subCategory || 'AEROSPACE SYSTEM'}
            </span>
          </div>
        </div>

        {/* View mode toggle (3D CAD Blueprint vs Real Field Photo) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
            <button onClick={() => setViewMode('tactical')} className={`rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${viewMode === 'tactical'
            ? 'bg-white text-black shadow-md'
            : 'text-white/60 hover:text-white'}`}>
              3D Blueprint
            </button>
            <button onClick={() => setViewMode('photo')} className={`rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${viewMode === 'photo'
            ? 'bg-white text-black shadow-md'
            : 'text-white/60 hover:text-white'}`}>
              Field Imagery
            </button>
          </div>

          <button onClick={() => setSpecsModalOpen(true)} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/10">
            <Sliders className="h-3.5 w-3.5"/>
            <span className="hidden sm:inline">Specs Sheet</span>
          </button>

          <button onClick={handleShare} className="rounded-full border border-white/15 bg-white/5 p-2.5 text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white" aria-label="Share">
            <Share2 className="h-4 w-4"/>
          </button>

          {onClose && (<button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 backdrop-blur transition-all duration-300 hover:rotate-90 hover:bg-white hover:text-black" aria-label="Close showcase">
              <X className="h-5 w-5"/>
            </button>)}
        </div>
      </header>

      {/* CENTER STAGE: HUGE BACKGROUND NAME + DRONE + 4 INTERACTIVE ICONS */}
      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-8">
        {/* HUGE UPPERCASE PRODUCT NAME BEHIND THE DRONE */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden z-0">
          <motion.h1 key={product.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="whitespace-nowrap font-display text-[11vw] font-black uppercase tracking-[0.08em] text-neutral-800/60 select-none text-center" style={{ textShadow: '0 0 60px rgba(0,0,0,0.9)' }}>
            {product.name.replace('ZIPI ', '')}
          </motion.h1>
        </div>

        {/* 3D PARALLAX & FLOATING DRONE CONTAINER */}
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center animate-float py-8">
          {/* Transparent Realistic Drone Render */}
          <motion.div key={`${product.id}-${viewMode}`} initial={{ opacity: 0, y: 30, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="w-full">
            <DroneRender product={product} selectedColor={activeColorObj?.hex} viewMode={viewMode} className="w-full"/>
          </motion.div>

          {/* Ground reflection specular glow */}
          <div className="pointer-events-none -mt-10 h-10 w-3/4 rounded-full blur-xl opacity-40 transition-colors duration-700" style={{ backgroundColor: accentGlow }}/>
        </motion.div>

        {/* FOUR INTERACTIVE FEATURE ICONS AROUND THE DRONE */}
        {/* 1. TOP-LEFT: SHOOTING FUNCTIONS */}
        <div className="absolute left-6 top-8 sm:left-12 sm:top-14 md:left-20 md:top-20 z-20">
          <FeatureHotspot title="Shooting Functions" icon={<Camera className="h-5 w-5"/>} data={features.shooting} isActive={activeFeature === 'shooting'} onSelect={() => setActiveFeature('shooting')} accentClass={accentActiveBg} positionClass="origin-top-left"/>
        </div>

        {/* 2. TOP-RIGHT: ADVANCED STABILIZATION */}
        <div className="absolute right-6 top-8 sm:right-12 sm:top-14 md:right-20 md:top-20 z-20">
          <FeatureHotspot title="Advanced Stabilization" icon={<Compass className="h-5 w-5"/>} data={features.stabilization} isActive={activeFeature === 'stabilization'} onSelect={() => setActiveFeature('stabilization')} accentClass={accentActiveBg} positionClass="origin-top-right right-0"/>
        </div>

        {/* 3. BOTTOM-LEFT: PREMIUM QUALITY */}
        <div className="absolute left-6 bottom-28 sm:left-12 sm:bottom-28 md:left-20 md:bottom-28 z-20">
          <FeatureHotspot title="Premium Quality" icon={<ShieldCheck className="h-5 w-5"/>} data={features.quality} isActive={activeFeature === 'quality'} onSelect={() => setActiveFeature('quality')} accentClass={accentActiveBg} positionClass="origin-bottom-left bottom-0"/>
        </div>

        {/* 4. BOTTOM-RIGHT: REMOTE CONTROL */}
        <div className="absolute right-6 bottom-28 sm:right-12 sm:bottom-28 md:right-20 md:bottom-28 z-20">
          <FeatureHotspot title="Remote Control" icon={<Radio className="h-5 w-5"/>} data={features.control} isActive={activeFeature === 'control'} onSelect={() => setActiveFeature('control')} accentClass={accentActiveBg} positionClass="origin-bottom-right bottom-0 right-0"/>
        </div>
      </div>

      {/* BOTTOM CONTROL & TELEMETRY PANEL */}
      <footer className="relative z-30 mx-auto w-full max-w-7xl border-t border-white/10 bg-black/60 backdrop-blur-xl px-6 py-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          {/* PRODUCT INFO & PRICE */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                {product.category}
              </span>
              {product.badge && (<span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {product.badge}
                </span>)}
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {product.name}
            </h2>
            <p className="mt-1 max-w-md text-xs sm:text-sm text-white/60 line-clamp-1">
              {product.tagline}
            </p>

            {/* COLORWAY SWITCHER */}
            {product.colors.length > 1 && (<div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-white/50">Finish:</span>
                <div className="flex gap-1.5">
                  {product.colors.map((color) => (<button key={color.name} onClick={() => setSelectedColor(color.name)} aria-label={color.name} title={color.name} className={`h-5 w-5 rounded-full border-2 transition-transform ${selectedColor === color.name
                    ? 'border-cyan-400 scale-125'
                    : 'border-white/30 hover:scale-110'}`} style={{ backgroundColor: color.hex }}/>))}
                </div>
                <span className="text-xs text-white/70 font-mono ml-1">{selectedColor}</span>
              </div>)}
          </div>

          {/* TELEMETRY QUICK SPECS ADAPTED TO HARDWARE TYPE */}
          <div className="grid grid-cols-3 gap-2.5 md:col-span-4">
            {product.hardwareType === 'controller' ? (<>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Display</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.display || '7" 2000-Nit'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">RF Range</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.transmissionRange || '15 km LOS'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Battery Life</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.batteryLife || '8.5 Hours'}</p>
                </div>
              </>) : product.hardwareType === 'gcs' ? (<>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Screen</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.screenSize || 'Dual 24" 4K'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Processor</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.processor?.split(' ')[0] || 'Intel Core i7'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Enclosure</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.ingressProtection || 'IP67 Sealed'}</p>
                </div>
              </>) : product.hardwareType === 'avionics' ? (<>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Throughput</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.dataRate?.split(' ')[0] || '30 Mbps'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Latency</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.latency || '< 12 ms'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Weight</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.weight || '185 g'}</p>
                </div>
              </>) : (<>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Flight Time</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.flightTime}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Max Range</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.range}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-mono">Max Speed</p>
                  <p className="font-display text-xs sm:text-sm font-bold text-white truncate">{product.specs.maxSpeed}</p>
                </div>
              </>)}
          </div>

          {/* PRICING & ACTIONS */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:col-span-3">
            <div className="text-right sm:text-left md:text-right">
              {product.originalPrice && (<span className="text-xs text-white/40 line-through mr-2 font-mono">
                  {formatPrice(product.originalPrice)}
                </span>)}
              <div className="font-display text-xl sm:text-2xl font-bold text-white">
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {product.isQuoteRequired ? (<button onClick={() => setQuoteModalOpen(true)} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full border border-cyan-400 bg-cyan-950/70 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition">
                  <FileText className="h-3.5 w-3.5"/>
                  <span>Request Quote</span>
                </button>) : (<button onClick={handleAddToCart} className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white/20 active:scale-95" aria-label={`Add ${product.name} to cart`}>
                  <ShoppingBag className="h-3.5 w-3.5"/>
                  Add
                </button>)}
              <button onClick={handleBuyNow} className={`flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${accentActiveBg}`} aria-label="Buy now">
                <Zap className="h-3.5 w-3.5 fill-current"/>
                Buy
              </button>
            </div>
          </div>
        </div>

        {/* DRONE SELECTOR CAROUSEL MINI THUMBNAILS */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={prevProduct} className="rounded-full border border-white/15 bg-white/5 p-1.5 text-white/70 hover:bg-white/15 hover:text-white transition" aria-label="Previous drone">
              <ChevronLeft className="h-4 w-4"/>
            </button>
            <span className="text-xs font-mono text-white/50">
              {currentIndex + 1} / {PRODUCTS.length}
            </span>
            <button onClick={nextProduct} className="rounded-full border border-white/15 bg-white/5 p-1.5 text-white/70 hover:bg-white/15 hover:text-white transition" aria-label="Next drone">
              <ChevronRight className="h-4 w-4"/>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {PRODUCTS.slice(0, 8).map((p) => {
            const isSelected = p.id === currentId;
            return (<button key={p.id} onClick={() => setCurrentId(p.id)} className={`relative flex items-center gap-2 rounded-full px-3 py-1 text-xs transition-all duration-300 ${isSelected
                    ? 'border border-cyan-400/80 bg-white/15 text-white font-semibold'
                    : 'border border-transparent text-white/50 hover:text-white hover:bg-white/5'}`}>
                  <span className="truncate max-w-[120px]">{p.name.replace('ZIPI ', '')}</span>
                </button>);
        })}
          </div>
        </div>
      </footer>

      {/* DETAILED TECHNICAL SPECIFICATIONS MODAL */}
      <AnimatePresence>
        {specsModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpecsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"/>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/20 bg-neutral-900 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-cyan-400">Technical Data Sheet</p>
                  <h3 className="text-2xl font-bold font-display">{product.name}</h3>
                </div>
                <button onClick={() => setSpecsModalOpen(false)} className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white">
                  <X className="h-5 w-5"/>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-sm text-white/70 leading-relaxed">{product.description}</p>

                <h4 className="text-xs uppercase tracking-widest text-white/40 pt-2">Full Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {Object.entries(product.specs).map(([key, value]) => (<div key={key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/50">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-semibold text-white mt-0.5">{value}</p>
                    </div>))}
                </div>

                <h4 className="text-xs uppercase tracking-widest text-white/40 pt-3">Key Highlights</h4>
                <ul className="space-y-1.5 text-sm text-white/80">
                  {product.highlights.map((h, i) => (<li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0"/>
                      <span>{h}</span>
                    </li>))}
                </ul>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-4">
                <button onClick={() => setSpecsModalOpen(false)} className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10">
                  Close
                </button>
                <button onClick={() => {
                handleAddToCart();
                setSpecsModalOpen(false);
            }} className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider ${accentActiveBg}`}>
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>)}
      </AnimatePresence>

      {/* QUOTE MODAL */}
      {quoteModalOpen && (
        <QuoteModal
          product={product}
          open={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
        />
      )}
    </div>);
}
// FEATURE HOTSPOT COMPONENT WITH ELEGANT POPUP INFORMATION PANEL
function FeatureHotspot({ title, icon, data, isActive, onSelect, accentClass, positionClass, }) {
    const [hovered, setHovered] = useState(false);
    const showPopup = isActive || hovered;
    return (<div className="relative group">
      {/* Interactive Trigger Button */}
      <button onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} aria-label={title} className={`relative flex items-center gap-3 rounded-full border backdrop-blur-md px-3.5 py-2 transition-all duration-400 ${showPopup
            ? 'border-white bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-105'
            : 'border-white/20 bg-black/60 text-white/80 hover:border-white/50 hover:bg-white/10'}`}>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform ${showPopup ? accentClass : 'bg-white/10 text-white'}`}>
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider pr-1">
          {title}
        </span>
        {/* Subtle pulsing beacon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"/>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"/>
        </span>
      </button>

      {/* POPUP INFORMATION PANEL */}
      <AnimatePresence>
        {showPopup && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.25, ease: 'easeOut' }} className={`absolute top-full mt-3 w-72 sm:w-80 rounded-2xl border border-white/20 bg-neutral-950/90 p-5 backdrop-blur-xl shadow-2xl z-30 ${positionClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                DIAGNOSTIC TELEMETRY
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                ONLINE
              </span>
            </div>

            <h4 className="font-display text-base font-bold text-white">{data.shortDesc}</h4>
            <p className="mt-2 text-xs leading-relaxed text-white/70">{data.detail}</p>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-[11px] uppercase tracking-wider text-white/50">{data.metricLabel}</span>
              <span className="font-mono text-sm font-bold text-cyan-400">{data.metric}</span>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
}
