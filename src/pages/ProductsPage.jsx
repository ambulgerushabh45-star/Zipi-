import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Eye, Heart, Plus, Layers, X, FileText, Check, ArrowRight, Gamepad2 } from 'lucide-react';
import { PRODUCTS, CATEGORY_LABELS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Reveal, Tilt } from '@/components/motion';
import QuickViewModal from '@/components/product/QuickViewModal';
import QuoteModal from '@/components/common/QuoteModal';
import StarRating from '@/components/product/StarRating';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';

const FILTER_TABS = [
    { id: 'all', label: 'All Systems' },
    { id: 'uav-drones', label: 'UAV Drones' },
    { id: 'controllers', label: 'Remote Controllers' },
    { id: 'gcs', label: 'Ground Control Stations' },
    { id: 'avionics', label: 'Avionics & Datalinks' },
    { id: 'defence', label: 'Defence & Security' },
    { id: 'agriculture', label: 'Agriculture & Farming' },
    { id: 'commercial', label: 'Commercial & Industrial' },
    { id: 'accessories', label: 'Accessories' },
];

export default function ProductsPage({ onOpenShowcase, }) {
    useDocumentTitle('Hardware Catalog');
    const [searchParams, setSearchParams] = useSearchParams();

    const resolveCategoryFromParams = useCallback((params) => {
        const typeParam = params.get('type');
        if (typeParam === 'controller') return 'controllers';
        return params.get('category') || 'all';
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(() => resolveCategoryFromParams(searchParams));
    const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
    const [sortBy, setSortBy] = useState(() => {
        const f = searchParams.get('filter');
        if (f === 'new') return 'new';
        if (f === 'featured') return 'featured';
        return searchParams.get('sort') || 'featured';
    });

    const { wishlist, toggleWishlist, addToCart, compare, toggleCompare, removeFromCompare } = useShop();
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [quoteModalProduct, setQuoteModalProduct] = useState(null);
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [addedItemNotice, setAddedItemNotice] = useState(null);

    // Sync state when external URL navigation changes query parameters
    useEffect(() => {
        const nextCat = resolveCategoryFromParams(searchParams);
        setSelectedCategory(nextCat);
        const q = searchParams.get('q');
        setSearchQuery(q !== null ? q : '');
        const filter = searchParams.get('filter');
        const sort = searchParams.get('sort');
        if (filter === 'new') setSortBy('new');
        else if (filter === 'featured') setSortBy('featured');
        else if (sort) setSortBy(sort);
    }, [searchParams, resolveCategoryFromParams]);

    const syncUrlParams = useCallback((cat, q, sort) => {
        const next = new URLSearchParams();
        if (cat && cat !== 'all') {
            next.set('category', cat);
        }
        if (q && q.trim()) {
            next.set('q', q);
        }
        if (sort && sort !== 'featured') {
            if (sort === 'new') next.set('filter', 'new');
            else next.set('sort', sort);
        }
        setSearchParams(next, { replace: true });
    }, [setSearchParams]);

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        syncUrlParams(cat, searchQuery, sortBy);
    };

    const handleSearchChange = (q) => {
        setSearchQuery(q);
        syncUrlParams(selectedCategory, q, sortBy);
    };

    const handleSortChange = (s) => {
        setSortBy(s);
        syncUrlParams(selectedCategory, searchQuery, s);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('featured');
        setSearchParams({}, { replace: true });
    };
    // Filtered and Sorted Products across all 4 hardware categories
    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter((p) => {
            // Category filter
            if (selectedCategory !== 'all') {
                if (selectedCategory === 'uav-drones') {
                    if (p.hardwareType !== 'drone')
                        return false;
                }
                else if (selectedCategory === 'controllers') {
                    if (p.hardwareType !== 'controller')
                        return false;
                }
                else if (selectedCategory === 'gcs') {
                    if (p.hardwareType !== 'gcs')
                        return false;
                }
                else if (selectedCategory === 'avionics') {
                    if (p.hardwareType !== 'avionics')
                        return false;
                }
                else if (selectedCategory === 'defence') {
                    if (p.missionTag !== 'defence' && p.category !== 'defence')
                        return false;
                }
                else if (selectedCategory === 'agriculture') {
                    if (p.missionTag !== 'agriculture' && p.category !== 'agriculture')
                        return false;
                }
                else if (selectedCategory === 'commercial') {
                    if (p.missionTag !== 'commercial' &&
                        p.category !== 'commercial' &&
                        p.category !== 'fpv' &&
                        p.category !== 'mini')
                        return false;
                }
                else if (p.category !== selectedCategory) {
                    return false;
                }
            }
            // Search query filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesName = p.name.toLowerCase().includes(query);
                const matchesDesc = p.description.toLowerCase().includes(query);
                const matchesCat = (p.subCategory || '').toLowerCase().includes(query);
                const matchesHighlights = p.highlights.some((h) => h.toLowerCase().includes(query));
                const matchesCategoryLabel = (CATEGORY_LABELS[p.category] || '').toLowerCase().includes(query);
                if (!matchesName && !matchesDesc && !matchesCat && !matchesHighlights && !matchesCategoryLabel) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-asc')
                return a.price - b.price;
            if (sortBy === 'price-desc')
                return b.price - a.price;
            if (sortBy === 'rating')
                return b.rating - a.rating;
            if (sortBy === 'new')
                return (b.badge === 'New' || b.badge === 'Flagship Fleet' ? 1 : 0) - (a.badge === 'New' || a.badge === 'Flagship Fleet' ? 1 : 0);
            return 0; // featured default order
        });
    }, [selectedCategory, searchQuery, sortBy]);
    const comparedProducts = useMemo(() => compare.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean), [compare]);
    const handleQuickAdd = (p) => {
        addToCart(p.id, p.colors[0]?.name || 'Standard', 1);
        setAddedItemNotice(p.id);
        setTimeout(() => setAddedItemNotice(null), 1800);
    };
    return (<div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-24">
      {/* Header Bar */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08121f]/60">
        <div className="pointer-events-none absolute inset-0 hero-grid-overlay opacity-40" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
                FLEET HARDWARE CATALOG
              </span>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-[#f1f5f9]">
                Autonomous Systems &amp; Equipment
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#94a3b8] leading-relaxed">
                Explore non-weaponized ISR and precision agricultural UAV drones, long-range remote controllers, rugged Ground Control Stations, and encrypted avionics datalinks.
              </p>
            </div>

            {/* Quick Counter */}
            <div className="flex items-center gap-3 font-mono text-xs text-[#94a3b8]">
              <span className="rounded-full border border-white/10 bg-[#0b1a2c] px-4 py-1.5">
                Showing <strong className="text-[#f1f5f9]">{filteredProducts.length}</strong> Systems
              </span>
              {compare.length > 0 && (<button type="button" onClick={() => setCompareModalOpen(true)} className="flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/15 px-4 py-1.5 text-cyan-300 hover:bg-[#22d3ee] hover:text-[#031018] transition">
                  <Layers className="h-3.5 w-3.5"/>
                  <span>Compare ({compare.length}/3)</span>
                </button>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sticky Animated Filter & Search Bar */}
      <div className="sticky top-16 z-30 border-b border-white/10 bg-[#050b14]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]"/>
              <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Search drones, GCS, controllers, datalinks..." className="w-full rounded-full border border-white/10 bg-[#0b1a2c] pl-11 pr-10 py-2.5 text-sm text-[#f1f5f9] placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"/>
              {searchQuery && (<button type="button" onClick={() => handleSearchChange('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white" aria-label="Clear search">
                  <X className="h-4 w-4"/>
                </button>)}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SlidersHorizontal className="h-4 w-4 text-[#94a3b8]"/>
              <span className="text-xs uppercase text-[#94a3b8] font-mono">Sort:</span>
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="rounded-full border border-white/10 bg-[#0b1a2c] px-4 py-2 text-xs font-semibold uppercase text-[#f1f5f9] focus:outline-none focus:border-cyan-400 cursor-pointer">
                <option value="featured" className="bg-[#0b1a2c]">Featured Missions</option>
                <option value="new" className="bg-[#0b1a2c]">New &amp; Flagship</option>
                <option value="price-asc" className="bg-[#0b1a2c]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#0b1a2c]">Price: High to Low</option>
                <option value="rating" className="bg-[#0b1a2c]">Highest Pilot Rating</option>
              </select>
            </div>
          </div>

          {/* Animated Category Filter Tabs with Sliding Pill */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTER_TABS.map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategorySelect(tab.id)}
                  className={`relative whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active ? 'text-[#031018] font-bold' : 'border border-white/10 bg-[#0b1a2c]/70 text-[#94a3b8] hover:border-white/25 hover:text-[#f1f5f9]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="catalog-filter-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controllers Hub Quick Link Banner when filtering Controllers */}
      {selectedCategory === 'controllers' && (
        <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-cyan-400/30 bg-[#0b1a2c]/90 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#f1f5f9]">Looking to pair a controller with your aircraft?</p>
                <p className="text-xs text-[#94a3b8]">Use the interactive 3-step Controller Finder Quiz, Compatibility Matrix, and Hotspot Viewer on our dedicated hub.</p>
              </div>
            </div>
            <Link to="/controllers" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 transition">
              Open Controllers Hub
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Product Discovery Grid */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 pb-28">
        {filteredProducts.length === 0 ? (<div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-16 text-center">
            <Search className="mx-auto h-12 w-12 text-slate-600"/>
            <h3 className="mt-4 text-xl font-bold font-display text-[#f1f5f9]">No Hardware Systems Matching Criteria</h3>
            <p className="mt-2 text-sm text-[#94a3b8]">Try adjusting your search query or switching categories.</p>
            <button type="button" onClick={handleResetFilters} className="mt-6 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 transition">
              Reset Filters
            </button>
          </div>) : (<motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
                const isSaved = wishlist.includes(product.id);
                const isCompared = compare.includes(product.id);
                const isAdded = addedItemNotice === product.id;
                return (<motion.article layout key={product.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25 }} className="h-full">
                  <Tilt maxTilt={4} className="h-full">
                  <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0b1a2c]/90 p-5 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]">
                  <div>
                    {/* Top Badges & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                          {CATEGORY_LABELS[product.category] || product.category}
                        </span>
                        {product.badge && (<span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            {product.badge}
                          </span>)}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Compare toggle */}
                        <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => toggleCompare(product.id)} className={`rounded-full p-1.5 border transition text-xs ${isCompared
                        ? 'border-cyan-400 bg-cyan-400 text-[#031018]'
                        : 'border-white/10 bg-white/5 text-[#94a3b8] hover:text-white'}`} title={isCompared ? 'Remove from compare' : 'Add to compare'} aria-label={isCompared ? `Remove ${product.name} from compare` : `Compare ${product.name}`}>
                          <Layers className="h-3.5 w-3.5"/>
                        </motion.button>

                        {/* Wishlist toggle */}
                        <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => toggleWishlist(product.id)} className={`rounded-full p-1.5 border transition ${isSaved
                        ? 'border-red-400/50 bg-red-500/20 text-red-400'
                        : 'border-white/10 bg-white/5 text-[#94a3b8] hover:text-red-400'}`} aria-label={`Wishlist ${product.name}`}>
                          <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`}/>
                        </motion.button>
                      </div>
                    </div>

                    {/* Image Area with 3D Render & Quick View on Hover */}
                    <div onClick={() => onOpenShowcase(product.id)} className="relative my-4 aspect-[4/3] overflow-hidden rounded-2xl bg-[#050b14] p-4 cursor-pointer flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
                      {product.hardwareType === 'drone' ? (<DroneRender product={product} className="h-full w-full max-h-48"/>) : (<img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain filter drop-shadow-[0_15px_30px_rgba(34,211,238,0.22)] rounded-xl group-hover:scale-105 transition-transform duration-500"/>)}

                      {/* Hover Overlay with Quick View button */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center gap-3 transition-opacity duration-300">
                        <button type="button" onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                    }} className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#031018] hover:bg-white shadow">
                          <Eye className="h-3.5 w-3.5"/>
                          Quick View
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onOpenShowcase(product.id); }} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-3.5 py-1.5 text-xs font-bold text-[#031018] hover:brightness-110 shadow">
                          <Sparkles className="h-3.5 w-3.5"/>
                          View Specs
                        </button>
                      </div>
                    </div>

                    {/* Name & Tagline */}
                    <h3 onClick={() => onOpenShowcase(product.id)} className="font-display text-xl font-bold text-[#f1f5f9] group-hover:text-cyan-300 transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#94a3b8] line-clamp-1">
                      {product.tagline}
                    </p>

                    {/* Star Rating */}
                    <div className="mt-2">
                      <StarRating rating={product.rating} count={product.reviewCount} size={11}/>
                    </div>

                    {/* SPECS REVEAL ADAPTED TO HARDWARE TYPE */}
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      {product.hardwareType === 'controller' && (<>
                          <div className="flex justify-between">
                            <span>Display Panel:</span>
                            <strong className="text-white">{product.specs.display || 'FHD 2000-Nit'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>C2 Frequency:</span>
                            <strong className="text-white">{product.specs.frequency || 'Dual-Band 2.4/5.8'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Battery Runtime:</span>
                            <strong className="text-white">{product.specs.batteryLife || '8.5 Hours'}</strong>
                          </div>
                        </>)}

                      {product.hardwareType === 'gcs' && (<>
                          <div className="flex justify-between">
                            <span>GCS Monitor:</span>
                            <strong className="text-white">{product.specs.screenSize || 'Dual 24" 4K'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Workstation CPU:</span>
                            <strong className="text-white">{product.specs.processor || 'Intel Core i7'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Ingress Protection:</span>
                            <strong className="text-cyan-300">{product.specs.ingressProtection || 'IP67 Sealed'}</strong>
                          </div>
                        </>)}

                      {product.hardwareType === 'avionics' && (<>
                          <div className="flex justify-between">
                            <span>Throughput:</span>
                            <strong className="text-white">{product.specs.dataRate || '30 Mbps'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Latency:</span>
                            <strong className="text-white">{product.specs.latency || '< 12 ms'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight:</span>
                            <strong className="text-cyan-300">{product.specs.weight || '185 g'}</strong>
                          </div>
                        </>)}

                      {(product.hardwareType === 'drone' || (!product.hardwareType && product.specs.flightTime)) && (<>
                          <div className="flex justify-between">
                            <span>Flight Time:</span>
                            <strong className="text-white">{product.specs.flightTime}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Operating Range:</span>
                            <strong className="text-white">{product.specs.range}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Speed:</span>
                            <strong className="text-white">{product.specs.maxSpeed}</strong>
                          </div>
                          {product.specs.payloadCapacity && (<div className="flex justify-between text-cyan-400">
                              <span>Payload Capacity:</span>
                              <strong>{product.specs.payloadCapacity}</strong>
                            </div>)}
                        </>)}
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      {product.originalPrice && (<span className="text-[11px] text-zinc-500 line-through block font-mono">
                          {formatPrice(product.originalPrice)}
                        </span>)}
                      <span className="font-display text-xl font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.isQuoteRequired && (<span className="block text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                          Quote Option Available
                        </span>)}
                    </div>

                    <div className="flex items-center gap-2">
                      {product.isQuoteRequired ? (<button onClick={() => setQuoteModalProduct(product)} className="flex items-center gap-1.5 rounded-full border border-cyan-400/80 bg-cyan-950/60 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition active:scale-95 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                          <FileText className="h-3.5 w-3.5"/>
                          <span>Quote</span>
                        </button>) : (<button onClick={() => handleQuickAdd(product)} className="flex items-center gap-1 rounded-full bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400 hover:text-black transition active:scale-95 shadow">
                          {isAdded ? <Check className="h-3.5 w-3.5 text-emerald-600"/> : <Plus className="h-3.5 w-3.5"/>}
                          <span>{isAdded ? 'Added' : 'Add'}</span>
                        </button>)}

                      <Link to={`/contact?type=order&product=${product.id}`} className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition">
                        Enquire
                      </Link>

                      {/* Instant View Action */}
                      <button onClick={() => onOpenShowcase(product.id)} className="rounded-full border border-white/15 bg-white/5 p-2 text-[#94a3b8] hover:text-white hover:border-white/30 transition" title="View System Details">
                        <Eye className="h-3.5 w-3.5"/>
                      </button>
                    </div>
                  </div>
                  </div>
                  </Tilt>
                </motion.article>);
            })}
            </AnimatePresence>
          </motion.div>)}
      </section>

      {/* STICKY BOTTOM COMPARE TRAY */}
      <AnimatePresence>
        {comparedProducts.length > 0 && !compareModalOpen && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-cyan-400/40 bg-[#08121f]/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400 mr-1">
                  Compare ({comparedProducts.length}/3)
                </span>
                {comparedProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b1a2c] pl-2.5 pr-1.5 py-1 text-xs text-[#f1f5f9]">
                    <span className="font-semibold truncate max-w-[130px]">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(p.id)}
                      className="rounded-full p-0.5 text-[#94a3b8] hover:text-red-400 transition"
                      aria-label={`Remove ${p.name} from compare`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => compare.forEach((cid) => removeFromCompare(cid))}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] hover:text-white transition"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setCompareModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#031018] shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:brightness-110 transition"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Compare Matrix
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (<QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onRequestQuote={(p) => setQuoteModalProduct(p)}/>)}
      </AnimatePresence>

      {/* FORMAL QUOTATION RFP MODAL */}
      <QuoteModal product={quoteModalProduct} open={Boolean(quoteModalProduct)} onClose={() => setQuoteModalProduct(null)}/>

      {/* SIDE-BY-SIDE DRONE COMPARISON MODAL */}
      <AnimatePresence>
        {compareModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCompareModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"/>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-neutral-900 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                    SIDE-BY-SIDE TECHNICAL MATRIX
                  </span>
                  <h3 className="text-2xl font-bold font-display">Compare Fleet Hardware</h3>
                </div>
                <button onClick={() => setCompareModalOpen(false)} className="rounded-full bg-white/10 p-2 hover:bg-white/20 text-white">
                  <X className="h-5 w-5"/>
                </button>
              </div>

              {comparedProducts.length === 0 ? (<div className="py-12 text-center text-zinc-400">
                  <p>No aircraft selected for comparison yet.</p>
                  <p className="text-xs mt-1">Check the layers icon on any product card to compare.</p>
                </div>) : (<div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-zinc-400 uppercase w-1/4">Specification</th>
                        {comparedProducts.map((p) => (<th key={p.id} className="py-3 px-4 text-white font-bold">
                            <div className="flex items-center justify-between">
                              <span>{p.name}</span>
                              <button onClick={() => removeFromCompare(p.id)} className="text-zinc-500 hover:text-red-400">
                                <X className="h-3.5 w-3.5"/>
                              </button>
                            </div>
                          </th>))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-3 px-4 text-zinc-400">Hardware Class</td>
                        {comparedProducts.map((p) => (<td key={p.id} className="py-3 px-4 text-cyan-400 uppercase">
                            {p.hardwareType || p.category}
                          </td>))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-zinc-400">Procurement Price</td>
                        {comparedProducts.map((p) => (<td key={p.id} className="py-3 px-4 font-bold text-white">
                            {formatPrice(p.price)}
                          </td>))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-zinc-400">Range / Distance</td>
                        {comparedProducts.map((p) => (<td key={p.id} className="py-3 px-4">
                            {p.specs.range || p.specs.transmissionRange || 'N/A'}
                          </td>))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-zinc-400">Battery / Endurance</td>
                        {comparedProducts.map((p) => (<td key={p.id} className="py-3 px-4">
                            {p.specs.flightTime || p.specs.batteryLife || 'Continuous AC'}
                          </td>))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-zinc-400">Encryption Standard</td>
                        {comparedProducts.map((p) => (<td key={p.id} className="py-3 px-4 text-cyan-300">
                            {p.specs.encryption || 'AES-128 Standard'}
                          </td>))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-zinc-400">Actions</td>
                        {comparedProducts.map((p) => (<td key={p.id} className="py-3 px-4">
                            <button onClick={() => {
                        addToCart(p.id, p.colors[0]?.name || 'Standard', 1);
                        setCompareModalOpen(false);
                    }} className="rounded-full bg-cyan-400 px-3 py-1 text-[11px] font-bold uppercase text-black hover:bg-cyan-300 transition">
                              Add to Cart
                            </button>
                          </td>))}
                      </tr>
                    </tbody>
                  </table>
                </div>)}
            </motion.div>
          </div>)}
      </AnimatePresence>

      <Footer />
    </div>);
}
