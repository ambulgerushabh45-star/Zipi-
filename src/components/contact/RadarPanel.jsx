import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Radar, ShieldCheck } from 'lucide-react';

export default function RadarPanel() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-6">
      {/* Intro & Live Radar Telemetry Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <span
                className={`h-2 w-2 rounded-full bg-cyan-400 ${
                  shouldReduceMotion ? '' : 'animate-pulse'
                }`}
              />
              <span>OPS DESK // ONLINE</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
              Mission Control{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
                Enquiry Desk
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-[#94a3b8]">
              Connect with ZIPI Drones &amp; Controls specialists for fleet procurement, regional partner applications, enterprise RFPs, or telemetry field support. All platforms operate exclusively for non-weaponized ISR and precision agriculture.
            </p>
          </div>

          {/* Pulsing Radar Visualization */}
          <div
            aria-hidden="true"
            className="relative mx-auto sm:mx-0 flex h-36 w-36 shrink-0 items-center justify-center rounded-full border border-cyan-400/25 bg-[#050b14]/80 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
          >
            {/* Concentric HUD rings */}
            <div className="absolute inset-3 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-8 rounded-full border border-dashed border-cyan-400/25" />
            <div className="absolute inset-x-0 h-px bg-cyan-400/15" />
            <div className="absolute inset-y-0 w-px bg-cyan-400/15" />

            {/* Ambient radar sweep */}
            {!shouldReduceMotion && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(34,211,238,0.34) 0deg, rgba(14,165,233,0.06) 55deg, transparent 85deg)',
                }}
              />
            )}

            {/* Pulsing radar waves */}
            {!shouldReduceMotion && (
              <motion.div
                animate={{ scale: [0.35, 1], opacity: [0.65, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-2 rounded-full border border-cyan-400/60"
              />
            )}

            {/* Target blips */}
            <span className="absolute right-8 top-8 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
            <span className="absolute bottom-9 left-9 h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#0ea5e9]" />

            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-[#050b14] text-cyan-300">
              <Radar className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Live Telemetry Metrics Strip */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 font-mono text-xs">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">Response SLA</span>
            <span className="mt-0.5 inline-flex items-center gap-1.5 font-semibold text-cyan-300">
              <Clock className="h-3.5 w-3.5" />
              &lt; 4 hrs
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">Compliance</span>
            <span className="mt-0.5 inline-flex items-center gap-1.5 font-semibold text-slate-100">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Non-Weaponized
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">Routing</span>
            <span className="mt-0.5 block font-semibold text-slate-100">Supervisor Direct</span>
          </div>
        </div>
      </div>

      {/* Direct Office & Operations Channels */}
      <div
        id="support"
        className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7 backdrop-blur-xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-display text-lg font-bold text-slate-50">Direct Flight Headquarters</h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            SECTOR OPS
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#f1f5f9]">Flight Systems Complex</h3>
              <p className="mt-0.5 text-xs text-[#94a3b8]">
                840 Flight Line Boulevard, San Diego, CA 92101
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Technical &amp; Sector Desks</h3>
              <p className="mt-0.5 font-mono text-xs text-slate-300">
                defence@zipi.aero &bull; agri@zipi.aero
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">24/7 Operations Line</h3>
              <p className="mt-0.5 font-mono text-xs text-slate-300">
                +1 (800) 492-ZIPI &bull; Mon–Fri 08:00–18:00 PST
              </p>
            </div>
          </div>
        </div>

        <div
          id="faq"
          className="scroll-mt-28 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4 font-mono text-xs text-slate-300 space-y-1.5"
        >
          <p className="font-bold uppercase tracking-wider text-cyan-300">
            Compliance &amp; Export Notes
          </p>
          <p>CAGE: 7Z89A &bull; SAM Registered Non-Weaponized ISR &amp; Agronomy Supplier</p>
          <p className="text-slate-400">
            Every enquiry receives a <span className="text-cyan-300">ZP-XXXXXX</span> tracking reference reviewed directly by a mission supervisor.
          </p>
        </div>
      </div>
    </div>
  );
}

