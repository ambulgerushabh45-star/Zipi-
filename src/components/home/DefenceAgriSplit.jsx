import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sprout, Crosshair, Radar, CheckCircle2, Droplets, Activity, Layers, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
const DEFENCE_BG = 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1200';
const AGRI_BG = 'https://images.pexels.com/photos/34182367/pexels-photo-34182367.jpeg?auto=compress&cs=tinysrgb&w=1200';
export default function DefenceAgriSplit({ onOpenShowcase, }) {
    return (<section id="sectors" className="relative scroll-mt-20 bg-black py-20 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-cyan-400">
            STRATEGIC SECTOR CAPABILITIES
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Pioneering Two Fronts of Innovation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-400">
            ZIPI delivers mission-critical unmanned aerial architectures engineered specifically for tactical defence security and precision agricultural yield.
          </p>
        </div>

        {/* 2 PROMINENT VISUALLY DISTINCT EXPLORATION CARDS */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ========================================================
            1. DEFENCE SECTION (Dark cinematic styling, cyan accents)
            ======================================================== */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/30 bg-neutral-950 p-8 sm:p-10 transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            {/* Background Image with Cinematic Overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img src={DEFENCE_BG} alt="Tactical Defence Drone" className="h-full w-full object-cover opacity-25 filter brightness-75 contrast-125 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-35"/>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"/>
              {/* Tactical Cyber Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.15)_0,transparent_60%)]"/>
            </div>

            <div>
              {/* Sector Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-cyan-300 backdrop-blur">
                <Shield className="h-3.5 w-3.5 text-cyan-400"/>
                <span>DEFENCE &amp; SECURITY SYSTEMS</span>
              </div>

              <h3 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Tactical Superiority in Unforgiving Environments.
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300">
                Purpose-built for lawful, non-weaponized aerial intelligence, perimeter vigilance, and humanitarian rescue. Zero compromise under electronic jamming or extreme weather.
              </p>

              {/* 4 Required Defence Pillars */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-cyan-500/20 group-hover:bg-cyan-950/20">
                  <Crosshair className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tactical Surveillance and Reconnaissance</h4>
                    <p className="text-xs text-zinc-400">Continuous 40x optical EO/IR zoom and FLIR thermal detection up to 25 km.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-cyan-500/20 group-hover:bg-cyan-950/20">
                  <Radar className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Border and Perimeter Monitoring</h4>
                    <p className="text-xs text-zinc-400">Automated drone-in-a-box scheduled patrols with AI intruder classification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-cyan-500/20 group-hover:bg-cyan-950/20">
                  <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Aerial Intelligence and Observation</h4>
                    <p className="text-xs text-zinc-400">Encrypted frequency-hopping telemetry resilient against hostile GPS jamming.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-cyan-500/20 group-hover:bg-cyan-950/20">
                  <HeartPulse className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Search and Rescue Support</h4>
                    <p className="text-xs text-zinc-400">12,000-lumen dual searchlights and remote emergency life-line drop winches.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <Link to="/defence" className="group/btn inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_24px_rgba(0,229,255,0.6)] transition-all duration-300 hover:bg-cyan-300 hover:scale-105">
                <span>Explore Defence</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"/>
              </Link>

              {onOpenShowcase && (<button onClick={() => onOpenShowcase('aegis-mk4')} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/15 transition">
                  View Aegis MK-IV
                </button>)}
            </div>
          </motion.div>

          {/* ========================================================
            2. AGRICULTURE SECTION (Natural imagery, earthy & green)
            ======================================================== */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-neutral-950 p-8 sm:p-10 transition-all duration-500 hover:border-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            {/* Background Image with Agricultural Overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img src={AGRI_BG} alt="Agricultural Spraying Drone" className="h-full w-full object-cover opacity-25 filter brightness-90 contrast-110 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-35"/>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"/>
              {/* Earthy Emerald Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18)_0,transparent_60%)]"/>
            </div>

            <div>
              {/* Sector Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-emerald-300 backdrop-blur">
                <Sprout className="h-3.5 w-3.5 text-emerald-400"/>
                <span>PRECISION AGRICULTURE &amp; FARMING</span>
              </div>

              <h3 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Smarter Farming. Unprecedented Crop Yield.
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300">
                Transforming modern agronomy with heavy-capacity autonomous atomizing sprayers, sub-centimeter RTK topographical terrain mapping, and 5-band NDVI diagnostics.
              </p>

              {/* 4 Required Agriculture Pillars */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-950/20">
                  <Activity className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Precision Crop Monitoring</h4>
                    <p className="text-xs text-zinc-400">Identify water stress, fungal blight, and nutrient deficiencies weeks early.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-950/20">
                  <Droplets className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Agricultural Spraying</h4>
                    <p className="text-xs text-zinc-400">40-liter payload with centrifugal atomizing nozzles covering up to 45 acres/hour.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-950/20">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Crop Health Analysis</h4>
                    <p className="text-xs text-zinc-400">5-band multispectral radiometric sensors with automated NDVI variable-rate maps.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur transition-colors duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-950/20">
                  <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400"/>
                  <div>
                    <h4 className="text-sm font-bold text-white">Smart Field Mapping</h4>
                    <p className="text-xs text-zinc-400">61MP mechanical shutter photogrammetry and 3D elevation slope modeling.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <Link to="/agriculture" className="group/btn inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_24px_rgba(16,185,129,0.6)] transition-all duration-300 hover:bg-emerald-400 hover:scale-105">
                <span>Explore Agriculture</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"/>
              </Link>

              {onOpenShowcase && (<button onClick={() => onOpenShowcase('terra-spray-x40')} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/15 transition">
                  View Terra Spray X40
                </button>)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>);
}
