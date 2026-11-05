import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sprout, Crosshair, Radar, Droplets, Activity, Layers, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFENCE_BG =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1200';
const AGRI_BG =
  'https://images.pexels.com/photos/34182367/pexels-photo-34182367.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function DefenceAgriSplit({ onOpenShowcase }) {
  return (
    <section id="sectors" className="relative scroll-mt-20 bg-[#07111F] py-20 px-5 sm:px-8 border-t border-[#101B2A]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#00C8FF]">
            STRATEGIC SECTOR PREVIEWS
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#F5F8FC] sm:text-5xl">
            Dual Fronts of Airborne Innovation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#AAB7C7]">
            Purpose-built unmanned aerial architectures deployed across tactical security frontiers and high-yield autonomous agricultural fields.
          </p>
        </div>

        {/* 2 PROMINENT VISUALLY IMPRESSIVE SECTIONS */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ========================================================
              1. DEFENCE SECTION (Dark navy, deep graphite, electric cyan)
              ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#00C8FF]/30 bg-[#101B2A] p-8 sm:p-10 transition-all duration-500 hover:border-[#00C8FF] hover:shadow-[0_0_50px_rgba(0,200,255,0.22)]"
          >
            {/* Background Image with Cinematic Overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src={DEFENCE_BG}
                alt="Tactical Defence Drone"
                className="h-full w-full object-cover opacity-25 filter brightness-75 contrast-125 transition-transform duration-1000 ease-out group-hover:scale-108 group-hover:opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B2A] via-[#101B2A]/85 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,200,255,0.15)_0,transparent_60%)]" />
            </div>

            <div>
              {/* Sector Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00C8FF]/40 bg-[#07111F]/80 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-[#00C8FF] backdrop-blur">
                <Shield className="h-3.5 w-3.5 text-[#00C8FF]" />
                <span>DEFENCE &amp; SECURITY SYSTEMS</span>
              </div>

              {/* Exact Requested Heading */}
              <h3 className="mt-5 font-display text-3xl font-extrabold text-[#F5F8FC] sm:text-4xl">
                Mission-Ready Intelligence.
              </h3>

              {/* Exact Supporting Text */}
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#AAB7C7]">
                Engineered strictly for lawful, non-weaponized aerial surveillance, reconnaissance, security monitoring, and rapid search and rescue support. Zero compromise in GPS-denied or adverse atmospheric theaters.
              </p>

              {/* 4 Pillars */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#00C8FF]/30">
                  <Crosshair className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00C8FF]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Surveillance &amp; Persistent Monitoring</h4>
                    <p className="text-xs text-[#AAB7C7]">40x continuous optical EO/IR zoom and FLIR thermal detection up to 25 km.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#00C8FF]/30">
                  <Radar className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00C8FF]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Reconnaissance &amp; Corridor Verification</h4>
                    <p className="text-xs text-[#AAB7C7]">Silent acoustic footprint with micro-radar terrain navigation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#00C8FF]/30">
                  <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00C8FF]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Security Monitoring &amp; Perimeter Sentry</h4>
                    <p className="text-xs text-[#AAB7C7]">Autonomous docking stations with real-time AI perimeter tripwire alerts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#00C8FF]/30">
                  <HeartPulse className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00C8FF]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Search and Rescue Support</h4>
                    <p className="text-xs text-[#AAB7C7]">12,000-lumen tracking searchlights and remote life-saving cargo drops.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <Link
                to="/defence"
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-[#00C8FF] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#07111F] shadow-[0_0_24px_rgba(0,200,255,0.6)] transition-all duration-300 hover:bg-cyan-300 hover:scale-105"
              >
                <span>Explore Defence</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>

              {onOpenShowcase && (
                <button
                  onClick={() => onOpenShowcase('aegis-mk4')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F5F8FC] hover:bg-white/15 transition"
                >
                  View Aegis MK-IV
                </button>
              )}
            </div>
          </motion.div>

          {/* ========================================================
              2. AGRICULTURE SECTION (Dark-to-natural green visual treatment)
              ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#67B56B]/30 bg-[#101B2A] p-8 sm:p-10 transition-all duration-500 hover:border-[#67B56B] hover:shadow-[0_0_50px_rgba(103,181,107,0.22)]"
          >
            {/* Background Image with Natural Green Overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src={AGRI_BG}
                alt="Agricultural Spraying Drone"
                className="h-full w-full object-cover opacity-25 filter brightness-85 contrast-115 transition-transform duration-1000 ease-out group-hover:scale-108 group-hover:opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B2A] via-[#101B2A]/85 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,181,107,0.2)_0,transparent_60%)]" />
            </div>

            <div>
              {/* Sector Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#67B56B]/40 bg-[#07111F]/80 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-[#67B56B] backdrop-blur">
                <Sprout className="h-3.5 w-3.5 text-[#67B56B]" />
                <span>PRECISION AGRICULTURE &amp; FARMING</span>
              </div>

              {/* Exact Requested Heading */}
              <h3 className="mt-5 font-display text-3xl font-extrabold text-[#F5F8FC] sm:text-4xl">
                Smarter Farming with Drones.
              </h3>

              {/* Exact Supporting Text */}
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#AAB7C7]">
                Revolutionizing modern agronomic yields with high-capacity atomizing sprayers, sub-centimeter RTK topographic terrain mapping, and multi-band NDVI crop health analysis.
              </p>

              {/* 4 Pillars */}
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#67B56B]/30">
                  <Droplets className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#67B56B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Precision Spraying</h4>
                    <p className="text-xs text-[#AAB7C7]">40-liter payload with centrifugal atomizing nozzles covering up to 45 acres/hour.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#67B56B]/30">
                  <Activity className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#67B56B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Crop Monitoring</h4>
                    <p className="text-xs text-[#AAB7C7]">5-band multispectral radiometric sensors identifying water and nitrogen stress.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#67B56B]/30">
                  <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#67B56B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Field Mapping</h4>
                    <p className="text-xs text-[#AAB7C7]">61MP mechanical shutter photogrammetry and 3D elevation slope modeling.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#07111F]/60 p-3.5 backdrop-blur transition-colors duration-300 group-hover:border-[#67B56B]/30">
                  <Sprout className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#67B56B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F8FC]">Variable-Rate Prescription</h4>
                    <p className="text-xs text-[#AAB7C7]">Cuts chemical runoff up to 35% with tractor terminal ISOBUS integration.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <Link
                to="/agriculture"
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-[#67B56B] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#07111F] shadow-[0_0_24px_rgba(103,181,107,0.6)] transition-all duration-300 hover:bg-emerald-400 hover:scale-105"
              >
                <span>Explore Agriculture</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>

              {onOpenShowcase && (
                <button
                  onClick={() => onOpenShowcase('terra-spray-x40')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F5F8FC] hover:bg-white/15 transition"
                >
                  View Terra Spray X40
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
