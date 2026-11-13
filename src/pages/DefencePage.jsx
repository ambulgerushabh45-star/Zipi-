import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Shield,
  Crosshair,
  Radar,
  Radio,
  Lock,
  Sparkles,
  ShoppingBag,
  Heart,
  FileText,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';
import QuoteModal from '@/components/common/QuoteModal';
import { Reveal, Stagger, StaggerItem, Tilt } from '@/components/motion';

const DEFENCE_BANNER =
  'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1920';

const SUB_CATEGORIES = [
  'All Defence Systems',
  'Surveillance Drones',
  'Reconnaissance Drones',
  'Security Monitoring Drones',
  'Search and Rescue Drones',
];

const DEFENCE_MISSIONS = [
  {
    id: 'surveillance',
    code: 'MSN-SURV-01',
    title: 'Surveillance',
    fullTitle: 'Surveillance & Monitoring',
    subtitle: 'Persistent Wide-Area Non-Weaponized Observation',
    tagline: 'High-altitude loiter with dual daylight EO and radiometric FLIR thermal sensor feeds.',
    summary:
      'Engineered for 24/7 continuous perimeter and strategic infrastructure vigilance. Equipped with an optical zoom gimbal capable of monitoring wide corridors without acoustic compromise.',
    droneId: 'aegis-mk4',
    telemetry: {
      altitude: '2,400 M ASL',
      range: '25.0 KM LOS',
      endurance: '55 MIN LOITER',
      encryption: 'AES-256',
      sensor: '40x EO + 640 FLIR',
    },
    capabilities: [
      {
        key: 'zoom',
        title: 'Optical & Thermal Zoom',
        metric: '40x Continuous Optical + Thermal',
        description:
          'Continuous optical magnification paired with a 640x512 radiometric thermal sensor for day and night observation.',
      },
      {
        key: 'crypto',
        title: 'Encrypted Communication',
        metric: 'AES-256 Dynamic Frequency-Hopping',
        description:
          'Zero-leak encrypted command, control, and multi-stream high-definition video downlink resilient against RF interference.',
      },
      {
        key: 'flir',
        title: 'Night Vision / FLIR',
        metric: 'Radiometric Thermal Contrast',
        description:
          'Resolves subtle thermal differentials, exposing heat signatures through darkness, coastal mist, and smoke.',
      },
      {
        key: 'weather',
        title: 'All-Weather Operation',
        metric: 'IP65 Protection // Level 8 Gusts',
        description:
          'Sealed carbon-kevlar monocoque chassis engineered for harsh ambient temperatures and wind gusts.',
      },
      {
        key: 'endurance',
        title: 'Long Flight Endurance',
        metric: '55 Minutes On-Station',
        description:
          'Dual-redundant lithium battery architecture with live cell telemetry and rapid turnaround swaps.',
      },
    ],
    matchedIds: {
      drone: 'aegis-mk4',
      controller: 'rc-pro-tactical',
      gcs: 'gcs-portable-briefcase',
      avionics: 'datalink-air-mesh',
    },
  },
  {
    id: 'reconnaissance',
    code: 'MSN-RECON-02',
    title: 'Reconnaissance',
    fullTitle: 'Forward Reconnaissance',
    subtitle: 'Discreet Scouting & Corridor Verification',
    tagline: 'Silent acoustic footprint for terrain and infrastructure verification.',
    summary:
      'Provides forward aerial observation ahead of search teams and civil infrastructure auditors. Features low-noise rotors and Starlight low-light optics.',
    droneId: 'recon-raven',
    telemetry: {
      altitude: '1,800 M ASL',
      range: '18.0 KM LOS',
      endurance: '48 MIN SILENT',
      encryption: 'AES-128 FREQ SHIFT',
      sensor: '4K Starlight + IR',
    },
    capabilities: [
      {
        key: 'zoom',
        title: 'Starlight Optical Clarity',
        metric: '4K Low-Light Sensor',
        description:
          'Target observation camera locks smoothly onto vehicles and structures during twilight and low-light patrols.',
      },
      {
        key: 'crypto',
        title: 'Encrypted Communication',
        metric: 'Dynamic Frequency Shift',
        description:
          'Digital datalink capable of maintaining reliable telemetry across hills and urban concrete canyons.',
      },
      {
        key: 'flir',
        title: 'Passive Night Optics',
        metric: 'Starlight Without Active Beacon',
        description:
          'Captures low-light optical imagery passively without emitting visible strobes.',
      },
      {
        key: 'weather',
        title: 'All-Weather Operation',
        metric: 'Level 7 Wind Tolerance',
        description:
          'Stabilized gimbal and weather-resistant airframe built for cold-altitude patrol corridors.',
      },
      {
        key: 'endurance',
        title: 'Rapid Deployment',
        metric: '48 Minutes Patrol Flight',
        description:
          'Compact folding airframe ready for deployment in under 90 seconds from transport case.',
      },
    ],
    matchedIds: {
      drone: 'recon-raven',
      controller: 'rc-longrange-x',
      gcs: 'gcs-dual-console',
      avionics: 'datalink-micro-node',
    },
  },
  {
    id: 'border-security',
    code: 'MSN-PERIM-03',
    title: 'Perimeter Security',
    fullTitle: 'Border & Perimeter Security',
    subtitle: 'Automated 24/7 Geofence Sentry Observation',
    tagline: 'Scheduled autonomous patrols with perimeter anomaly alerts.',
    summary:
      'Engineered for continuous facility boundary monitoring, coastal patrols, and critical utility protection using non-weaponized sensor payloads.',
    droneId: 'guardian-sentry',
    telemetry: {
      altitude: '1,200 M ASL',
      range: '30.0 KM RELAY',
      endurance: '62 MIN PATROL',
      encryption: 'AES-256 + LEO',
      sensor: '360° Perimeter AI',
    },
    capabilities: [
      {
        key: 'zoom',
        title: 'Panoramic + Telephoto',
        metric: 'Dual-Lens Inspection',
        description:
          'Wide-angle boundary overview coupled with telephoto snapshot verification of fence-line anomalies.',
      },
      {
        key: 'crypto',
        title: 'Satellite Fallback',
        metric: 'LEO Telemetry Redundancy',
        description:
          'Automatic failover from terrestrial RF radio to LEO satellite telemetry across remote borders.',
      },
      {
        key: 'flir',
        title: 'Thermal Tripwire Alerts',
        metric: 'Continuous Day/Night Scanning',
        description:
          'Automated perimeter alerts distinguish vehicles and intruders from wildlife.',
      },
      {
        key: 'weather',
        title: 'Dust & Marine Sealing',
        metric: 'Sealed Propulsion Bearings',
        description:
          'Protected against blowing sand, rain squalls, and coastal moisture.',
      },
      {
        key: 'endurance',
        title: 'Continuous Relay Ops',
        metric: '62 Minutes Heavy Patrol',
        description:
          'Supports automated dock handoffs for persistent non-stop perimeter coverage.',
      },
    ],
    matchedIds: {
      drone: 'guardian-sentry',
      controller: 'rc-swarm-nexus',
      gcs: 'gcs-mobile-vehicle',
      avionics: 'telemetry-satlink-leo',
    },
  },
  {
    id: 'search-rescue',
    code: 'MSN-SAR-04',
    title: 'Search & Rescue',
    fullTitle: 'Humanitarian Search & Rescue',
    subtitle: 'High-Altitude Lifeline & Survivor Spotting',
    tagline: 'Thermal human body-heat detection and emergency lifeline payload delivery.',
    summary:
      'Built for mountain rescue, maritime emergency response, and disaster relief. Combines thermal survivor isolation with high-output spotlights and emergency supply drops.',
    droneId: 'valkyrie-sar',
    telemetry: {
      altitude: '3,800 M CEILING',
      range: '20.0 KM RELAY',
      endurance: '50 MIN LOADED',
      encryption: 'EMS GATEWAY',
      sensor: 'SAR FLIR + Spotlight',
    },
    capabilities: [
      {
        key: 'zoom',
        title: 'Body-Heat Isolation',
        metric: '+37°C Thermal Filter',
        description:
          'Thermal contrast isolation helps rescue teams locate missing persons in snow, dense forest, or floodplains.',
      },
      {
        key: 'crypto',
        title: 'First-Responder Bridge',
        metric: 'Multi-Team Telemetry Stream',
        description:
          'Shares live location coordinates and stabilized video feeds to mobile incident command stations.',
      },
      {
        key: 'flir',
        title: 'Searchlight + Thermal',
        metric: 'Dual Tracking Gimbal',
        description:
          'Illuminates confirmed ground coordinates while maintaining thermal tracking lock.',
      },
      {
        key: 'weather',
        title: 'Alpine Wind Stability',
        metric: 'High-Torque Co-Axial Hover',
        description:
          'Holds steady station in turbulent mountain canyons and storm conditions.',
      },
      {
        key: 'endurance',
        title: 'Lifeline Supply Drop',
        metric: '50 Min Emergency Flight',
        description:
          'Delivers radio beacons, medical kits, and thermal blankets to stranded survivors.',
      },
    ],
    matchedIds: {
      drone: 'valkyrie-sar',
      controller: 'rc-pro-tactical',
      gcs: 'gcs-field-rugged',
      avionics: 'autopilot-vector-core',
    },
  },
];

export default function DefencePage({ onOpenShowcase }) {
  useDocumentTitle('Defence & Perimeter Security');
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, wishlist, toggleWishlist } = useShop();

  const [selectedMissionId, setSelectedMissionId] = useState('surveillance');
  const [selectedCapabilityKey, setSelectedCapabilityKey] = useState('zoom');
  const [thermalViewActive, setThermalViewActive] = useState(false);
  const [selectedSubCat, setSelectedSubCat] = useState('All Defence Systems');
  const [quoteProduct, setQuoteProduct] = useState(null);

  const activeMission =
    DEFENCE_MISSIONS.find((m) => m.id === selectedMissionId) || DEFENCE_MISSIONS[0];
  const activeMissionDrone =
    PRODUCTS.find((p) => p.id === activeMission.droneId) ||
    PRODUCTS.find((p) => p.category === 'defence');

  const defenceProducts = PRODUCTS.filter((p) => p.category === 'defence');
  const filteredProducts =
    selectedSubCat === 'All Defence Systems'
      ? defenceProducts
      : defenceProducts.filter((p) => p.subCategory === selectedSubCat);

  const handleSelectMission = (id) => {
    setSelectedMissionId(id);
    setSelectedCapabilityKey('zoom');
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-[#f1f5f9]">
      {/* 1. HERO WITH MAP-STYLE RADAR VISUAL (#60a5fa Defence Blue) */}
      <section className="relative overflow-hidden border-b border-white/10 pt-28 pb-16 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-20">
          <img
            src={DEFENCE_BANNER}
            alt="ZIPI Non-Weaponized Defence ISR Platform"
            className="h-full w-full object-cover opacity-20 brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050b14] via-[#050b14]/85 to-[#050b14]" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hero-grid-overlay" />

        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-12 items-center">
          <Reveal direction="left" className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/40 bg-[#0b1a2c] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#60a5fa]">
              <Shield className="h-3.5 w-3.5" />
              <span>LAWFUL NON-WEAPONIZED ISR &amp; SECURITY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f1f5f9]">
              Precision in the Air.{' '}
              <span className="block bg-gradient-to-r from-[#60a5fa] via-[#22d3ee] to-[#0ea5e9] bg-clip-text text-transparent">
                Confidence on the Ground.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#94a3b8]">
              ZIPI Drones &amp; Controls engineers strictly non-weaponized UAV observation systems for border monitoring, critical asset security, and high-altitude search and rescue.
            </p>

            {/* Prominent Non-Weaponized Compliance Notice */}
            <div className="rounded-2xl border border-[#60a5fa]/40 bg-[#60a5fa]/10 p-4 flex items-start gap-3">
              <Lock className="h-5 w-5 shrink-0 text-[#60a5fa] mt-0.5" />
              <p className="text-xs sm:text-sm text-[#f1f5f9]">
                <strong className="text-[#60a5fa] font-mono uppercase tracking-wider mr-1.5">
                  Compliance Policy:
                </strong>
                All ZIPI defence platforms are strictly non-weaponized optical, thermal, and rescue observation systems.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#defence-missions" className="btn-mission-primary min-h-[44px]">
                <Radar className="h-4 w-4" />
                <span>Explore Mission Tabs</span>
              </a>
              <Link to="/contact?type=rfp" className="btn-mission-ghost min-h-[44px]">
                <span>Initiate Enterprise RFP</span>
              </Link>
            </div>
          </Reveal>

          {/* Map-Style Radar Visual */}
          <Reveal direction="right" className="lg:col-span-5 flex justify-center">
            <div
              aria-hidden="true"
              className="relative flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center rounded-full border border-[#60a5fa]/35 bg-[#0b1a2c] shadow-[0_0_55px_rgba(96,165,250,0.2)]"
            >
              <div className="absolute inset-5 rounded-full border border-[#60a5fa]/20" />
              <div className="absolute inset-12 rounded-full border border-dashed border-[#60a5fa]/30" />
              <div className="absolute inset-20 rounded-full border border-[#60a5fa]/25" />
              <div className="absolute inset-x-0 h-px bg-[#60a5fa]/20" />
              <div className="absolute inset-y-0 w-px bg-[#60a5fa]/20" />

              {!shouldReduceMotion && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(96,165,250,0.34) 0deg, rgba(34,211,238,0.08) 55deg, transparent 85deg)',
                  }}
                />
              )}

              <span className="absolute top-14 right-16 h-2 w-2 rounded-full bg-[#60a5fa] shadow-[0_0_10px_#60a5fa]" />
              <span className="absolute bottom-16 left-14 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <Compass className="h-8 w-8 text-[#60a5fa]" />
                <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#60a5fa]">
                  ISR SECTOR RADAR
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. ANIMATED MISSION TABS (Sliding underline + Staggered Capabilities + Matched Bundle) */}
      <section id="defence-missions" className="scroll-mt-24 bg-[#08121f] border-b border-white/10 py-16 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Reveal direction="up">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#60a5fa]">
              NON-WEAPONIZED MISSION PROFILES
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              Mission Profiles &amp; Matched Hardware Suites
            </h2>
          </Reveal>

          {/* Animated Tabs with Sliding Underline */}
          <div
            role="tablist"
            aria-label="Defence mission profiles"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-1"
          >
            {DEFENCE_MISSIONS.map((mission) => {
              const selected = activeMission.id === mission.id;
              return (
                <button
                  key={mission.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => handleSelectMission(mission.id)}
                  className={`relative min-h-[44px] whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa] ${
                    selected ? 'text-[#60a5fa] font-bold' : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-2 opacity-75">{mission.code}</span>
                  <span>{mission.title}</span>
                  {selected && (
                    <motion.span
                      layoutId="defenceMissionUnderline"
                      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] bg-[#60a5fa] shadow-[0_0_12px_rgba(96,165,250,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Mission Panel (opacity: 1 always, crisp slide transition) */}
          <motion.div
            key={activeMission.id}
            initial={shouldReduceMotion ? false : { x: 18 }}
            animate={{ x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            role="tabpanel"
            className="rounded-3xl border border-[#60a5fa]/30 bg-[#0b1a2c] p-6 sm:p-10 space-y-10 shadow-2xl"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded-full bg-[#60a5fa] px-3 py-1 font-bold text-[#031018]">
                    {activeMission.code}
                  </span>
                  <span className="text-[#94a3b8]">{activeMission.subtitle}</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
                  {activeMission.fullTitle}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-[#94a3b8]">
                  {activeMission.summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono text-xs">
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">Altitude</span>
                    <span className="font-bold text-[#f1f5f9]">{activeMission.telemetry.altitude}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">Range</span>
                    <span className="font-bold text-[#f1f5f9]">{activeMission.telemetry.range}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">Endurance</span>
                    <span className="font-bold text-[#60a5fa]">{activeMission.telemetry.endurance}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">Security</span>
                    <span className="font-bold text-[#f1f5f9]">{activeMission.telemetry.encryption}</span>
                  </div>
                </div>
              </div>

              {activeMissionDrone && (
                <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#050b14] p-6">
                  <DroneRender product={activeMissionDrone} className="max-h-64 w-full object-contain" />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#94a3b8] block">
                        Primary Platform
                      </span>
                      <span className="font-display text-lg font-bold text-[#f1f5f9]">
                        {activeMissionDrone.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenShowcase?.(activeMissionDrone.id)}
                        className="btn-mission-ghost min-h-[44px]"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#60a5fa]" />
                        <span>3D View</span>
                      </button>
                      <Link
                        to={`/contact?type=rfp&product=${activeMissionDrone.id}`}
                        className="btn-mission-primary min-h-[44px]"
                      >
                        <span>Enquire</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Staggered Capabilities */}
            <div className="border-t border-white/10 pt-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-xl font-bold text-[#f1f5f9]">
                  Key Mission Capabilities
                </h4>
                <span className="font-mono text-xs text-[#94a3b8]">
                  Select a capability to inspect
                </span>
              </div>

              <Stagger key={`caps-${activeMission.id}`} className="grid gap-3 sm:grid-cols-5">
                {activeMission.capabilities.map((cap) => {
                  const isCapActive = selectedCapabilityKey === cap.key;
                  return (
                    <StaggerItem key={cap.key}>
                      <button
                        type="button"
                        onClick={() => setSelectedCapabilityKey(cap.key)}
                        className={`flex h-full w-full flex-col justify-between rounded-2xl border p-4 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa] ${
                          isCapActive
                            ? 'border-[#60a5fa] bg-[#60a5fa]/15 shadow-[0_0_20px_rgba(96,165,250,0.2)]'
                            : 'border-white/10 bg-[#050b14]/70 hover:border-white/25'
                        }`}
                      >
                        <p className="font-display text-sm font-bold text-[#f1f5f9]">{cap.title}</p>
                        <p className="mt-2 font-mono text-[11px] font-semibold text-[#60a5fa]">
                          {cap.metric}
                        </p>
                      </button>
                    </StaggerItem>
                  );
                })}
              </Stagger>

              {(() => {
                const activeCap = activeMission.capabilities.find(
                  (c) => c.key === selectedCapabilityKey
                );
                if (!activeCap) return null;
                return (
                  <div className="rounded-2xl border border-[#60a5fa]/30 bg-[#050b14]/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h5 className="font-display text-base font-bold text-[#f1f5f9]">
                        {activeCap.title} &mdash; {activeCap.metric}
                      </h5>
                      <p className="mt-1 text-xs sm:text-sm text-[#94a3b8] max-w-3xl leading-relaxed">
                        {activeCap.description}
                      </p>
                    </div>
                    <span className="self-start rounded-full border border-[#60a5fa]/40 bg-[#60a5fa]/10 px-3 py-1 font-mono text-[11px] text-[#60a5fa] whitespace-nowrap">
                      NON-WEAPONIZED SPEC
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Matched Hardware Bundle Cards */}
            <div className="border-t border-white/10 pt-8 space-y-5">
              <h4 className="font-display text-2xl font-bold text-[#f1f5f9]">
                Matched Systems for {activeMission.title}
              </h4>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { role: 'UAV DRONE', id: activeMission.matchedIds.drone },
                  { role: 'REMOTE CONTROLLER', id: activeMission.matchedIds.controller },
                  { role: 'GROUND CONTROL STATION', id: activeMission.matchedIds.gcs },
                  { role: 'DATALINK / AVIONICS', id: activeMission.matchedIds.avionics },
                ].map(({ role, id }) => {
                  const product = PRODUCTS.find((p) => p.id === id);
                  if (!product) return null;
                  const isSaved = wishlist.includes(product.id);

                  return (
                    <Tilt key={product.id} className="rounded-2xl">
                      <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#050b14]/80 p-5 hover:border-[#60a5fa]/50 transition">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="rounded-full border border-[#60a5fa]/35 bg-[#60a5fa]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase text-[#60a5fa]">
                              {role}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              aria-label="Save to Wishlist"
                              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                                isSaved
                                  ? 'border-[#f87171]/60 bg-[#f87171]/15 text-[#f87171]'
                                  : 'border-white/10 bg-white/5 text-[#94a3b8] hover:text-[#f87171]'
                              }`}
                            >
                              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <div
                            onClick={() => onOpenShowcase?.(product.id)}
                            className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#08121f] p-3 flex items-center justify-center cursor-pointer border border-white/10"
                          >
                            <DroneRender product={product} className="max-h-28 w-full object-contain" />
                          </div>

                          <h5 className="mt-3 font-display text-base font-bold text-[#f1f5f9] line-clamp-1">
                            <Link to={`/product/${product.id}`} className="hover:text-[#60a5fa] transition">
                              {product.name}
                            </Link>
                          </h5>
                          <p className="mt-1 text-xs text-[#94a3b8] line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <span className="font-display text-sm font-bold text-[#f1f5f9]">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                addToCart(product.id, product.colors?.[0]?.name || 'Standard')
                              }
                              className="rounded-lg bg-white px-3 py-1.5 font-mono text-[11px] font-bold text-[#031018] hover:bg-cyan-300 transition"
                            >
                              + Cart
                            </button>
                            <Link
                              to={`/contact?type=order&product=${product.id}`}
                              className="rounded-lg border border-white/15 px-2.5 py-1.5 font-mono text-[11px] text-[#60a5fa] hover:border-[#60a5fa]"
                            >
                              Enquire
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Tilt>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. INTERACTIVE EO/IR SENSOR SIMULATOR (Zero purple/pink!) */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <Reveal direction="up">
          <div className="rounded-3xl border border-[#60a5fa]/30 bg-[#0b1a2c] p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#60a5fa]">
                  OPTICAL SENSOR SIMULATOR
                </span>
                <h3 className="text-2xl font-bold font-display text-[#f1f5f9] mt-1">
                  Daylight EO Zoom vs. Radiometric FLIR Thermal
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setThermalViewActive(false)}
                  className={`min-h-[44px] rounded-xl px-4 py-2 text-xs font-bold uppercase transition ${
                    !thermalViewActive
                      ? 'bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] text-[#031018]'
                      : 'border border-white/15 bg-[#050b14] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Daylight EO 4K
                </button>
                <button
                  type="button"
                  onClick={() => setThermalViewActive(true)}
                  className={`min-h-[44px] rounded-xl px-4 py-2 text-xs font-bold uppercase transition ${
                    thermalViewActive
                      ? 'bg-[#fbbf24] text-[#031018]'
                      : 'border border-white/15 bg-[#050b14] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Radiometric FLIR
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#050b14] border border-white/10">
              <img
                src={
                  thermalViewActive
                    ? 'https://images.pexels.com/photos/6493443/pexels-photo-6493443.jpeg?auto=compress&cs=tinysrgb&w=1400'
                    : 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1400'
                }
                alt="Optical and thermal observation simulator"
                loading="lazy"
                className={`h-full w-full object-cover transition-all duration-500 ${
                  thermalViewActive
                    ? 'grayscale contrast-200 brightness-110'
                    : 'brightness-90 contrast-110'
                }`}
              />

              <div className="pointer-events-none absolute inset-0 p-5 flex flex-col justify-between font-mono text-xs">
                <div className="flex flex-wrap justify-between gap-2 text-[#60a5fa]">
                  <span className="rounded bg-[#050b14]/80 px-3 py-1 border border-[#60a5fa]/40">
                    ZOOM: 40x EO // FLIR: 640x512
                  </span>
                  <span className="rounded bg-[#050b14]/80 px-3 py-1 border border-[#60a5fa]/40">
                    AES-256 TELEMETRY LOCKED
                  </span>
                </div>

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded border border-[#60a5fa]/60">
                  <Crosshair className="h-8 w-8 text-[#60a5fa]" />
                </div>

                <div className="flex flex-wrap justify-between gap-2 text-[11px] text-[#f1f5f9]">
                  <span className="rounded bg-[#050b14]/80 px-3 py-1 border border-white/10">
                    {thermalViewActive
                      ? 'THERMAL MODE: +37.2°C RESCUE SIGNATURE'
                      : 'OPTICAL MODE: 3840 x 2160'}
                  </span>
                  <span className="rounded bg-[#050b14]/80 px-3 py-1 border border-white/10 text-[#60a5fa]">
                    NON-WEAPONIZED ISR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. DEFENCE HARDWARE CATALOGUE */}
      <section id="catalogue-section" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#60a5fa]">
              DEFENCE &amp; SECURITY INVENTORY
            </span>
            <h3 className="text-3xl font-display font-extrabold text-[#f1f5f9] mt-1">
              Non-Weaponized ISR Drone Platforms
            </h3>
          </div>
          <span className="text-xs font-mono text-[#94a3b8]">
            Showing {filteredProducts.length} certified platforms
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {SUB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedSubCat(cat)}
              className={`min-h-[44px] whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                selectedSubCat === cat
                  ? 'bg-[#60a5fa] text-[#031018] font-bold'
                  : 'border border-white/15 bg-[#0b1a2c] text-[#94a3b8] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 mt-6">
          {filteredProducts.map((product, idx) => {
            const isSaved = wishlist.includes(product.id);
            return (
              <Reveal key={product.id} direction={idx % 2 === 0 ? 'left' : 'right'}>
                <Tilt className="h-full rounded-3xl">
                  <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8 hover:border-[#60a5fa]/70 transition">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-[#60a5fa]/40 bg-[#050b14] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#60a5fa]">
                          {product.subCategory}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label="Save to Wishlist"
                          className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                            isSaved
                              ? 'border-[#f87171]/60 bg-[#f87171]/15 text-[#f87171]'
                              : 'border-white/10 bg-[#050b14] text-[#94a3b8] hover:text-[#f87171]'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div
                        onClick={() => onOpenShowcase?.(product.id)}
                        className="relative my-6 aspect-[16/10] overflow-hidden rounded-2xl bg-[#050b14] p-4 cursor-pointer flex items-center justify-center border border-white/10"
                      >
                        <DroneRender product={product} className="h-full w-full max-h-56" />
                      </div>

                      <h3 className="font-display text-2xl font-bold text-[#f1f5f9]">
                        <Link to={`/product/${product.id}`} className="hover:text-[#60a5fa] transition">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#94a3b8] line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <span className="font-display text-2xl font-bold text-[#f1f5f9]">
                        {formatPrice(product.price)}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            addToCart(product.id, product.colors?.[0]?.name || 'Standard')
                          }
                          className="btn-mission-primary min-h-[44px]"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuoteProduct(product)}
                          className="btn-mission-ghost min-h-[44px]"
                        >
                          <FileText className="h-4 w-4 text-[#60a5fa]" />
                          <span>Quote</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </section>

      {quoteProduct && (
        <QuoteModal
          product={quoteProduct}
          open={Boolean(quoteProduct)}
          onClose={() => setQuoteProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
