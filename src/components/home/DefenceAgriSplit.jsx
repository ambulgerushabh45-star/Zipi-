import { useState } from 'react';
import {
  Shield,
  Sprout,
  Crosshair,
  Radar,
  Layers,
  HeartPulse,
  Droplets,
  Activity,
  Eye,
  Flame,
  Moon,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/motion';

const DEFENCE_BG =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1200';
const AGRI_BG =
  'https://images.pexels.com/photos/34182367/pexels-photo-34182367.jpeg?auto=compress&cs=tinysrgb&w=1200';

const DEFENCE_MISSIONS = [
  { icon: Crosshair, title: 'Surveillance & Persistent Monitoring', desc: '40x optical EO/IR zoom and FLIR thermal detection up to 25 km.' },
  { icon: Radar, title: 'Reconnaissance & Corridor Verification', desc: 'Quiet acoustic signature with terrain-aware micro-radar.' },
  { icon: Layers, title: 'Border & Perimeter Security', desc: 'Autonomous dock patrols and real-time perimeter alerts.' },
  { icon: HeartPulse, title: 'Search and Rescue Support', desc: '12,000-lumen tracking lights and lifeline cargo drops.' },
];

const AGRI_MISSIONS = [
  { icon: Droplets, title: 'Precision Variable-Rate Spraying', desc: '40-liter centrifugal atomizing sprayers up to 45 acres/hour.' },
  { icon: Activity, title: '5-Band Multispectral Crop Monitoring', desc: 'Detect canopy chlorophyll and water stress early.' },
  { icon: Layers, title: 'Topographic Field Mapping', desc: '61MP photogrammetry and sub-cm RTK slope elevation models.' },
  { icon: Sprout, title: 'Input Reduction Workflows', desc: 'Targeted weed prescriptions reducing chemical runoff up to 35%.' },
];

export default function DefenceAgriSplit({ onOpenShowcase }) {
  const [expanded, setExpanded] = useState(null);
  const [defenceVision, setDefenceVision] = useState('optical'); // 'optical' | 'thermal' | 'nvg'
  const [agriVision, setAgriVision] = useState('rgb'); // 'rgb' | 'ndvi' | 'spray'

  return (
    <section id="sectors" className="relative scroll-mt-20 border-t border-white/10 bg-[#050b14] py-20 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-14 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.28em] text-cyan-300">
            STRATEGIC MISSION SECTORS
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#f1f5f9] sm:text-5xl">
            Dual Fronts of Autonomous Flight
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#94a3b8]">
            Hover on desktop or tap a panel on mobile to expand our non-weaponized Defence ISR and Precision Agriculture capabilities.
          </p>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 1. DEFENCE PANEL (#60a5fa Defence Blue) */}
          <Reveal
            direction="left"
            className={`transition-all duration-300 ${
              expanded === 'defence'
                ? 'lg:flex-[1.35]'
                : expanded === 'agriculture'
                  ? 'lg:flex-[0.85]'
                  : 'lg:flex-1'
            }`}
          >
            <div
              onMouseEnter={() => setExpanded('defence')}
              onMouseLeave={() => setExpanded(null)}
              onClick={() => setExpanded((prev) => (prev === 'defence' ? null : 'defence'))}
              className={`hud-bracket group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-[#0b1a2c] p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                expanded === 'defence'
                  ? 'border-[#60a5fa] shadow-[0_0_45px_rgba(96,165,250,0.25)]'
                  : 'border-[#60a5fa]/35 hover:border-[#60a5fa]'
              }`}
            >
              {/* Vision Shaders Background */}
              <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
                <img
                  src={DEFENCE_BG}
                  alt="Non-weaponized tactical surveillance drone"
                  loading="lazy"
                  className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
                    defenceVision === 'thermal'
                      ? 'thermal-filter opacity-40 contrast-150'
                      : defenceVision === 'nvg'
                        ? 'night-vision-filter opacity-45'
                        : 'opacity-25 brightness-75'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2c] via-[#0b1a2c]/85 to-transparent" />
                {(defenceVision === 'thermal' || defenceVision === 'nvg') && (
                  <div className="absolute inset-0 scanlines" />
                )}
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/40 bg-[#050b14]/85 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest text-[#60a5fa]">
                    <Shield className="h-3.5 w-3.5" />
                    <span>DEFENCE &amp; SECURITY // NON-WEAPONIZED ISR</span>
                  </div>

                  {/* Sensor Vision Mode Toggle */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#050b14]/90 p-1 backdrop-blur"
                  >
                    {[
                      { id: 'optical', label: '4K EO', icon: Eye },
                      { id: 'thermal', label: 'FLIR Thermal', icon: Flame },
                      { id: 'nvg', label: 'NVG Night', icon: Moon },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setDefenceVision(mode.id)}
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] font-bold uppercase transition ${
                            defenceVision === mode.id
                              ? 'bg-[#60a5fa] text-[#031018] shadow-[0_0_10px_rgba(96,165,250,0.6)]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          <span className="hidden sm:inline">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Sensor Telemetry Readout */}
                <div className="mt-3 flex items-center gap-3 font-mono text-[10px] text-[#60a5fa] bg-[#050b14]/75 px-3 py-1.5 rounded-lg border border-[#60a5fa]/20 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                  {defenceVision === 'thermal' && (
                    <span>SENSOR: FLIR RADIOMETRIC 640x512 // 37.4°C HEAT SIGNATURE LOCK</span>
                  )}
                  {defenceVision === 'nvg' && (
                    <span>SENSOR: GEN-3 NVG PHOSPHOR // IR ILLUMINATOR: 850nm ACTIVE</span>
                  )}
                  {defenceVision === 'optical' && (
                    <span>SENSOR: 40x CONTINUOUS OPTICAL ZOOM // STABILIZED GIMBAL</span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-2xl font-extrabold text-[#f1f5f9] sm:text-3xl">
                  Mission-Ready Intelligence.
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                  Built strictly for lawful, non-weaponized aerial observation, border security, critical asset monitoring, and humanitarian search and rescue.
                </p>

                <div className="mt-5 space-y-2.5">
                  {DEFENCE_MISSIONS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#050b14]/70 p-3"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#60a5fa]" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#f1f5f9]">{m.title}</h4>
                          <p className="text-[11px] text-[#94a3b8]">{m.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <Link
                  to="/defence"
                  onClick={(e) => e.stopPropagation()}
                  className="btn-mission-primary min-h-[44px]"
                >
                  <span>Explore Defence</span>
                </Link>
                {onOpenShowcase && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShowcase('aegis-mk4');
                    }}
                    className="btn-mission-ghost min-h-[44px]"
                  >
                    Inspect Aegis MK-IV
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* 2. AGRICULTURE PANEL (#4ade80 Agriculture Green) */}
          <Reveal
            direction="right"
            className={`transition-all duration-300 ${
              expanded === 'agriculture'
                ? 'lg:flex-[1.35]'
                : expanded === 'defence'
                  ? 'lg:flex-[0.85]'
                  : 'lg:flex-1'
            }`}
          >
            <div
              onMouseEnter={() => setExpanded('agriculture')}
              onMouseLeave={() => setExpanded(null)}
              onClick={() => setExpanded((prev) => (prev === 'agriculture' ? null : 'agriculture'))}
              className={`hud-bracket group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-[#0b1a2c] p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                expanded === 'agriculture'
                  ? 'border-[#4ade80] shadow-[0_0_45px_rgba(74,222,128,0.25)]'
                  : 'border-[#4ade80]/35 hover:border-[#4ade80]'
              }`}
            >
              {/* Vision Shaders Background */}
              <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
                <img
                  src={AGRI_BG}
                  alt="Precision agriculture spraying drone"
                  loading="lazy"
                  className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
                    agriVision === 'ndvi'
                      ? 'ndvi-filter opacity-45 contrast-150'
                      : agriVision === 'spray'
                        ? 'opacity-35 saturate-200'
                        : 'opacity-25 brightness-75'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2c] via-[#0b1a2c]/85 to-transparent" />
                {agriVision === 'ndvi' && <div className="absolute inset-0 scanlines" />}
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/40 bg-[#050b14]/85 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest text-[#4ade80]">
                    <Sprout className="h-3.5 w-3.5" />
                    <span>PRECISION AGRICULTURE &amp; FARMING</span>
                  </div>

                  {/* Sensor Vision Mode Toggle */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#050b14]/90 p-1 backdrop-blur"
                  >
                    {[
                      { id: 'rgb', label: 'True Color', icon: Eye },
                      { id: 'ndvi', label: '5-Band NDVI', icon: Sparkles },
                      { id: 'spray', label: 'Spray Swath', icon: Droplets },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setAgriVision(mode.id)}
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] font-bold uppercase transition ${
                            agriVision === mode.id
                              ? 'bg-[#4ade80] text-[#031018] shadow-[0_0_10px_rgba(74,222,128,0.6)]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          <span className="hidden sm:inline">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Sensor Telemetry Readout */}
                <div className="mt-3 flex items-center gap-3 font-mono text-[10px] text-[#4ade80] bg-[#050b14]/75 px-3 py-1.5 rounded-lg border border-[#4ade80]/20 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                  {agriVision === 'ndvi' && (
                    <span>CANOPY NDVI: 0.84 // HIGH VIGOR CHLOROPHYLL DETECTED</span>
                  )}
                  {agriVision === 'spray' && (
                    <span>ATOMIZATION: 180μm // FLOW: 12.0 L/MIN // ±1.5CM RTK SWATH</span>
                  )}
                  {agriVision === 'rgb' && (
                    <span>HIGH-RES SURVEY RGB // 61MP PHOTOGRAMMETRY CANOPY</span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-2xl font-extrabold text-[#f1f5f9] sm:text-3xl">
                  Smarter Farming with Drones.
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                  High-capacity atomizing sprayers, sub-centimeter RTK terrain mapping, and 5-band NDVI diagnostics for measurable field efficiency.
                </p>

                <div className="mt-5 space-y-2.5">
                  {AGRI_MISSIONS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#050b14]/70 p-3"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#4ade80]" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#f1f5f9]">{m.title}</h4>
                          <p className="text-[11px] text-[#94a3b8]">{m.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <Link
                  to="/agriculture"
                  onClick={(e) => e.stopPropagation()}
                  className="btn-mission-primary min-h-[44px]"
                >
                  <span>Explore Agriculture</span>
                </Link>
                {onOpenShowcase && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShowcase('terra-spray-x40');
                    }}
                    className="btn-mission-ghost min-h-[44px]"
                  >
                    Inspect Terra Spray X40
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
