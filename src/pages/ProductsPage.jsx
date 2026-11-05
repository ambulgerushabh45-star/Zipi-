import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Eye, Heart, Plus, Layers, X, FileText, Check, } from 'lucide-react';
import { PRODUCTS, CATEGORY_LABELS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
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
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';
    const initialSearch = searchParams.get('q') || '';
    const { wishlist, toggleWishlist, addToCart, compare, toggleCompare, removeFromCompare } = useShop();
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [sortBy, setSortBy] = useState('featured');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [quoteModalProduct, setQuoteModalProduct] = useState(null);
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [addedItemNotice, setAddedItemNotice] = useState(null);
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
            return 0; // featured default order
        });
    }, [selectedCategory, searchQuery, sortBy]);
    const comparedProducts = useMemo(() => compare.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean), [compare]);
    const handleQuickAdd = (p) => {
        addToCart(p.id, p.colors[0]?.name || 'Standard', 1);
        setAddedItemNotice(p.id);
        setTimeout(() => setAddedItemNotice(null), 1800);
    };
    return (<div className="min-h-screen bg-neutral-950 text-white pt-24">
      {/* Header Bar */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
              FLEET HARDWARE CATALOG
            </span>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-white">
              Autonomous Systems &amp; Equipment
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 leading-relaxed font-light">
              Explore tactical defence and agricultural UAV drones, long-range remote controllers, rugged Ground Control Stations (GCS), and encrypted avionics datalinks.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              Showing <strong className="text-white">{filteredProducts.length}</strong> Systems
            </span>
            {compare.length > 0 && (<button onClick={() => setCompareModalOpen(true)} className="flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-950/40 px-4 py-1.5 text-cyan-300 hover:bg-cyan-400 hover:text-black transition">
                <Layers className="h-3.5 w-3.5"/>
                <span>Compare ({compare.length}/3)</span>
              </button>)}
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"/>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search drones, GCS, controllers, datalinks..." className="w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition"/>
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                <X className="h-4 w-4"/>
              </button>)}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400"/>
            <span className="text-xs uppercase text-zinc-400 font-mono">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-full border border-white/15 bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase text-white focus:outline-none focus:border-cyan-400 cursor-pointer">
              <option value="featured" className="bg-neutral-900">Featured Missions</option>
              <option value="price-asc" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900">Highest Pilot Rating</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {FILTER_TABS.map((tab) => (<button key={tab.id} onClick={() => setSelectedCategory(tab.id)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${selectedCategory === tab.id
                ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,229,255,0.5)] font-bold'
                : 'border border-white/15 bg-white/5 text-zinc-300 hover:border-white/30 hover:bg-white/10'}`}>
              {tab.label}
            </button>))}
        </div>
      </section>

      {/* Product Discovery Grid */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {filteredProducts.length === 0 ? (<div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
            <Search className="mx-auto h-12 w-12 text-zinc-600"/>
            <h3 className="mt-4 text-xl font-bold font-display">No Hardware Systems Matching Criteria</h3>
            <p className="mt-2 text-sm text-zinc-400">Try adjusting your search query or switching categories.</p>
            <button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
            }} className="mt-6 rounded-full bg-cyan-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition">
              Reset Filters
            </button>
          </div>) : (<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, i) => {
                const isSaved = wishlist.includes(product.id);
                const isCompared = compare.includes(product.id);
                const isAdded = addedItemNotice === product.id;
                return (<motion.article key={product.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (i % 6) * 0.08 }} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-5 transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.14)]">
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
                        <button onClick={() => toggleCompare(product.id)} className={`rounded-full p-1.5 border transition text-xs ${isCompared
                        ? 'border-cyan-400 bg-cyan-400 text-black'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'}`} title={isCompared ? 'Remove from compare' : 'Add to compare'}>
                          <Layers className="h-3.5 w-3.5"/>
                        </button>

                        {/* Wishlist toggle */}
                        <button onClick={() => toggleWishlist(product.id)} className={`rounded-full p-1.5 border transition ${isSaved
                        ? 'border-red-500/50 bg-red-500/20 text-red-400'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-red-400'}`} aria-label="Wishlist">
                          <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`}/>
                        </button>
                      </div>
                    </div>

                    {/* Image Area with 3D Render & Quick View on Hover */}
                    <div onClick={() => onOpenShowcase(product.id)} className="relative my-4 aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-950 p-4 cursor-pointer flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
                      {product.hardwareType === 'drone' ? (<DroneRender product={product} className="h-full w-full max-h-48"/>) : (<img src={product.image} alt={product.name} className="h-full w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,229,255,0.25)] rounded-xl group-hover:scale-105 transition-transform duration-500"/>)}

                      {/* Hover Overlay with Quick View button */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center gap-3 transition-opacity duration-300">
                        <button onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                    }} className="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-white shadow">
                          <Eye className="h-3.5 w-3.5"/>
                          Quick View
                        </button>
                        <button onClick={() => onOpenShowcase(product.id)} className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-cyan-300 shadow">
                          <Sparkles className="h-3.5 w-3.5"/>
                          View Specs
                        </button>
                      </div>
                    </div>

                    {/* Name & Tagline */}
                    <h3 onClick={() => onOpenShowcase(product.id)} className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-1 font-light">
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

                      {/* Instant View Action */}
                      <button onClick={() => onOpenShowcase(product.id)} className="rounded-full border border-white/15 bg-white/5 p-2 text-zinc-400 hover:text-white hover:border-white/30 transition" title="View System Details">
                        <Eye className="h-3.5 w-3.5"/>
                      </button>
                    </div>
                  </div>
                </motion.article>);
            })}
          </div>)}
      </section>

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
