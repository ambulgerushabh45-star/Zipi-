import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';
export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        sector: 'defence',
        message: '',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };
    return (<div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center border-b border-white/10 pb-10 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">
            STRATEGIC PROCUREMENT &amp; CONSULTATION
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold text-white">
            Initiate Contact with ZIPI
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-300">
            For military tender inquiries, municipal rescue deployments, agricultural fleet trials, or corporate aircraft partnerships, our technical specialists respond within 4 hours.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 max-w-6xl mx-auto">
          {/* Direct Office Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8">
              <h3 className="font-display text-xl font-bold text-white mb-6">Global Flight HQs</h3>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5"/>
                  <div>
                    <h4 className="font-bold text-white">Aerospace Research Complex</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">840 Flight Line Boulevard, San Diego, CA 92101</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5"/>
                  <div>
                    <h4 className="font-bold text-white">Technical Inquiries</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">defence@zipi.aero // agri@zipi.aero</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5"/>
                  <div>
                    <h4 className="font-bold text-white">Operations Desk</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">+1 (800) 492-ZIPI [Mon-Fri 0800 - 1800 PST]</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-neutral-900/50 p-6 text-xs text-zinc-400 font-mono space-y-2">
              <span className="text-cyan-400 font-bold block">GOVERNMENT &amp; MUNICIPAL RFPs:</span>
              <p>CAGE Code: 7Z89A // SAM Registered Supplier</p>
              <p>Export Compliance: EAR99 / ITAR Compliant Non-Weaponized Observation</p>
            </div>
          </div>

          {/* Consultation Request Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8 sm:p-10">
              {submitted ? (<div className="py-12 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400"/>
                  <h3 className="mt-4 font-display text-2xl font-bold">Inquiry Received</h3>
                  <p className="mt-2 text-sm text-zinc-300">
                    Your transmission has been logged into our tactical desk. A flight applications engineer will contact you shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 rounded-full border border-white/20 px-6 py-2 text-xs uppercase font-mono text-white hover:bg-white/10">
                    Submit Another Inquiry
                  </button>
                </div>) : (<form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Request Technical Consultation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Your Name *</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="Commander / Director / Owner"/>
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Official Email *</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="contact@organization.gov"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Organization / Entity</label>
                      <input type="text" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="Entity name"/>
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Primary Operational Focus</label>
                      <select value={formData.sector} onChange={(e) => setFormData({ ...formData, sector: e.target.value })} className="w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-white focus:outline-none focus:border-cyan-400">
                        <option value="defence">Defence &amp; Border Surveillance</option>
                        <option value="agriculture">Precision Agriculture Spraying / NDVI</option>
                        <option value="commercial">Industrial Infrastructure Audits</option>
                        <option value="sar">High-Altitude Search &amp; Rescue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Mission Requirements / Fleet Scope *</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="Outline your coverage area, sensor payload preferences, desired flight duration, or demonstration timeline..."/>
                  </div>

                  <button type="submit" className="w-full rounded-full bg-cyan-400 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_24px_rgba(0,229,255,0.6)] hover:bg-cyan-300 transition duration-300 flex items-center justify-center gap-2">
                    <Send className="h-4 w-4"/>
                    <span>Transmit Consultation Request</span>
                  </button>
                </form>)}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>);
}
