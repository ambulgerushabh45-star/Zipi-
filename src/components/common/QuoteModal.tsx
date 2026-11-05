import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, X, CheckCircle2, Shield, Building2, User, Mail, Phone } from 'lucide-react';
import type { Product } from '@/data/products';

type QuoteModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export default function QuoteModal({ product, open, onClose }: QuoteModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    quantity: '1-2 Units',
    timeline: 'Immediate (< 30 Days)',
    notes: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = `ZP-RFP-${Math.floor(10000 + Math.random() * 90000)}`;
    setQuoteId(id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-neutral-950 p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(0,229,255,0.25)] max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
              aria-label="Close quote modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <div>
                {/* Header Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-950/60 text-cyan-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400">
                      ENTERPRISE &amp; DEFENCE PROCUREMENT
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      Request Formal Quotation
                    </h3>
                  </div>
                </div>

                {/* Selected Product Summary Box */}
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover bg-neutral-900 border border-white/10 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                      SKU: {product.id.toUpperCase()}
                    </span>
                    <h4 className="font-display font-bold text-base text-white">{product.name}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">{product.tagline}</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Officer / Requester Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Commander Alex Vance"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Organization / Agency *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder="e.g. Tactical Defense Command"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Official Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@agency.gov or corp"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Secure Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 019-2834"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Procurement Quantity
                      </label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-neutral-900 py-2.5 px-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="1-2 Units">1 - 2 Units (Evaluation / Pilot)</option>
                        <option value="3-5 Fleet">3 - 5 Units (Squadron / Field Crew)</option>
                        <option value="6-20 Enterprise">6 - 20 Units (Enterprise Scale)</option>
                        <option value="20+ Sovereign">20+ Units (Sovereign / Agency Fleet)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                        Deployment Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-neutral-900 py-2.5 px-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="Immediate (< 30 Days)">Immediate (&lt; 30 Days)</option>
                        <option value="30-90 Days">30 - 90 Days Deployment</option>
                        <option value="Next Fiscal Quarter">Next Fiscal Quarter</option>
                        <option value="RFP / Budget Planning">RFP / Budget Planning</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Mission Scope &amp; Custom Integration Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Specify mission operational ceiling, encryption protocols, ground control preferences, or payload integrations..."
                      className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-cyan-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]"
                    >
                      <Send className="h-4 w-4" />
                      <span>Transmit Quotation Request</span>
                    </button>
                    <p className="mt-2 text-center text-[10px] font-mono text-zinc-500">
                      AES-256 Encrypted Protocol // ZIPI Aerospace Commercial &amp; Defence Sales
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Success confirmation state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-950/70 text-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <span className="mt-5 inline-block rounded-full border border-cyan-500/40 bg-cyan-950/50 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyan-300">
                  RFP TRANSMITTED // TICKET {quoteId}
                </span>

                <h3 className="mt-3 font-display text-2xl font-bold text-white">
                  Quotation Request Received
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm text-zinc-300 leading-relaxed font-light">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our aerospace procurement specialists have received your request for the{' '}
                  <strong className="text-cyan-300">{product.name}</strong> ({formData.quantity}).
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 text-left font-mono text-xs text-zinc-400">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Target Organization:</span>
                    <span className="text-white">{formData.organization}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Contact Channel:</span>
                    <span className="text-white">{formData.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Response Window:</span>
                    <span className="text-cyan-400">&lt; 4 Business Hours</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="rounded-full border border-cyan-400 bg-cyan-400/20 px-8 py-3 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition"
                  >
                    Return to Hardware Fleet
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

