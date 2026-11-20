import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sprout,
  Droplets,
  Activity,
  Sparkles,
  ShoppingBag,
  Heart,
  TrendingUp,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';
import QuoteModal from '@/components/common/QuoteModal';
import { Counter, Reveal, Stagger, StaggerItem, Tilt } from '@/components/motion';

const AGRI_BANNER =
  'https://images.pexels.com/photos/34182367/pexels-photo-34182367.jpeg?auto=compress&cs=tinysrgb&w=1920';

const AGRI_SUB_CATEGORIES = [
  'All Agriculture Systems',
  'Agricultural Spraying Drones',
  'Crop Monitoring Drones',
  'Field Mapping Drones',
  'Precision Farming Solutions',
];

const AGRI_MISSIONS = [
  {
    id: 'spraying',
    code: 'AGRI-SPRAY-01',
    title: 'Precision Spraying',
    subtitle: 'Centrifugal Atomization & Variable Dosage',
    tagline: 'Uniform micron-droplet deposition without drift or soil leaching.',
    summary:
      'Magnetic centrifugal atomizers regulate droplet sizes from 50 to 500 microns in real time based on canopy density, ground speed, and crosswinds.',
    droneId: 'terra-spray-x40',
    telemetry: {
      sprayRate: '12.0 L/MIN MAX',
      swathWidth: '12.5 M SWATH',
      rtkAccuracy: '±1.5 CM RTK',
      fieldPace: '45 ACRES / HR',
    },
    capabilities: [
      {
        key: 'variable-rate',
        title: 'Variable Rate Spraying',
        metric: '0.5–12.0 L/min Dynamic Flow',
        description:
          'Modulates dosage meter-by-meter from uploaded prescription maps.',
      },
      {
        key: 'multispectral',
        title: 'Prescription Sync',
        metric: 'Up to 35% Input Reduction',
        description:
          'Ingests NDVI shapefiles to target affected zones precisely.',
      },
      {
        key: 'terrain-mapping',
        title: 'Terrain Following',
        metric: 'Sub-Centimeter Radar',
        description:
          'Maintains constant 2.5m boom elevation above orchards and rolling hills.',
      },
      {
        key: 'flight-planning',
        title: 'Automated Routing',
        metric: 'One-Touch Boundary Grid',
        description:
          'Calculates refill checkpoints and resume-where-left-off coordinates.',
      },
      {
        key: 'data-processing',
        title: 'Field Telemetry Logs',
        metric: 'FMIS Export Ready',
        description:
          'Synchronizes application logs via encrypted 4G/5G and local GCS stations.',
      },
    ],
    matchedIds: {
      drone: 'terra-spray-x40',
      controller: 'rc-touch-lumina',
      gcs: 'gcs-field-rugged',
    },
  },
  {
    id: 'monitoring',
    code: 'AGRI-MONITOR-02',
    title: 'Crop Monitoring',
    subtitle: '5-Band Multispectral NDVI & Stress Diagnostics',
    tagline: 'Detect water stress and nitrogen deficits before visual symptoms.',
    summary:
      'Combines RGB imagery with synchronized Near-Infrared and RedEdge bands, generating calibrated NDVI and NDRE vegetative maps.',
    droneId: 'agriscan-ndvi',
    telemetry: {
      sprayRate: '5-BAND SENSOR',
      swathWidth: '1.2 CM/PX GSD',
      rtkAccuracy: '±1.0 CM RTK',
      fieldPace: '120 ACRES / FLIGHT',
    },
    capabilities: [
      {
        key: 'variable-rate',
        title: 'VRA Export',
        metric: 'Direct Sprayer Handoff',
        description:
          'Exports variable-rate application maps directly to Terra Spray X40 drones.',
      },
      {
        key: 'multispectral',
        title: 'Multispectral Bands',
        metric: 'Green, Red, RedEdge, NIR + RGB',
        description:
          'Reveals chlorophyll breakdown earlier than visual field walks.',
      },
      {
        key: 'terrain-mapping',
        title: 'Canopy Volume Models',
        metric: 'DSM Height Mapping',
        description:
          'Calculates orchard canopy height and nitrogen uptake zones.',
      },
      {
        key: 'flight-planning',
        title: 'Cross-Hatch Survey Grids',
        metric: '75%/80% Image Overlap',
        description:
          'Produces calibrated radiometric orthomosaics across large farms.',
      },
      {
        key: 'data-processing',
        title: 'Field Edge Stitching',
        metric: 'On-Site GCS Map',
        description:
          'Renders NDVI vegetative maps on the field tablet immediately after landing.',
      },
    ],
    matchedIds: {
      drone: 'agriscan-ndvi',
      controller: 'rc-touch-lumina',
      gcs: 'gcs-portable-briefcase',
    },
  },
  {
    id: 'mapping',
    code: 'AGRI-MAP-03',
    title: 'Field Mapping',
    subtitle: 'Sub-Centimeter 3D Topography & Drainage',
    tagline: 'Digital elevation models and irrigation slope planning.',
    summary:
      'Produces high-density point clouds and 3D terrain elevation models to plan drainage lines and optimize irrigation routes.',
    droneId: 'fieldmapper-aero',
    telemetry: {
      sprayRate: '61MP RGB SHUTTER',
      swathWidth: 'SUB-CM SURVEY',
      rtkAccuracy: '±0.8 CM RTK',
      fieldPace: '200 ACRES / MISSION',
    },
    capabilities: [
      {
        key: 'variable-rate',
        title: 'Waterway Buffers',
        metric: 'Runoff Prevention Zones',
        description:
          'Highlights slope contours near streams to prevent overspray.',
      },
      {
        key: 'multispectral',
        title: 'Moisture Correlation',
        metric: 'Low-Spot Detection',
        description:
          'Pinpoints standing water pooling and dry ridge zones.',
      },
      {
        key: 'terrain-mapping',
        title: '3D DEM & Contour Maps',
        metric: 'Laser-Leveling Precision',
        description:
          'Provides accurate slope contours for drainage installation.',
      },
      {
        key: 'flight-planning',
        title: 'Terrain-Aware Corridors',
        metric: 'Constant Ground GSD',
        description:
          'Adjusts altitude dynamically over terraced vineyards.',
      },
      {
        key: 'data-processing',
        title: 'GIS & CAD Exports',
        metric: 'GeoTIFF & LAS Point Clouds',
        description:
          'Compatible with major precision ag guidance software.',
      },
    ],
    matchedIds: {
      drone: 'fieldmapper-aero',
      controller: 'rc-longrange-x',
      gcs: 'gcs-field-rugged',
    },
  },
  {
    id: 'precision-ag',
    code: 'AGRI-ECO-04',
    title: 'Precision Ecosystem',
    subtitle: 'Full-Cycle Autonomous Agronomy Fleet',
    tagline: 'Integrated scouting UAVs, sprayers, and daylight controllers.',
    summary:
      'Unifies multispectral scouting, prescription generation, and aerial application across large cooperative farms.',
    droneId: 'cropguard-harvest',
    telemetry: {
      sprayRate: 'MULTI-DRONE C2',
      swathWidth: 'DUAL SWATH',
      rtkAccuracy: '±1.0 CM SHARED BASE',
      fieldPace: '150 ACRES / HR',
    },
    capabilities: [
      {
        key: 'variable-rate',
        title: 'Closed-Loop Workflow',
        metric: 'Scout-to-Sprayer Handoff',
        description:
          'Morning scout prescriptions dispatch midday sprayers automatically.',
      },
      {
        key: 'multispectral',
        title: 'Season Time-Lapse',
        metric: 'Yield Trend Diagnostics',
        description:
          'Tracks canopy vigor week by week across the growing cycle.',
      },
      {
        key: 'terrain-mapping',
        title: 'Farm Digital Twin',
        metric: 'Updated After Every Sortie',
        description:
          'Maintains live maps of farm roads, canals, and crop health.',
      },
      {
        key: 'flight-planning',
        title: 'Swarm Partitioning',
        metric: 'Non-Conflicting Corridors',
        description:
          'Assigns multi-drone acreage sectors with synchronized battery stops.',
      },
      {
        key: 'data-processing',
        title: 'Audit Reporting',
        metric: 'Compliance & Chemical Logs',
        description:
          'Generates traceable spray and fuel-saving audit summaries.',
      },
    ],
    matchedIds: {
      drone: 'cropguard-harvest',
      controller: 'rc-swarm-nexus',
      gcs: 'gcs-dual-console',
    },
  },
];

export default function AgriculturePage({ onOpenShowcase }) {
  useDocumentTitle('Precision Agriculture');
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, wishlist, toggleWishlist } = useShop();

  const [selectedMissionId, setSelectedMissionId] = useState('spraying');
  const [selectedCapabilityKey, setSelectedCapabilityKey] = useState('variable-rate');
  const [ndviSplitPct, setNdviSplitPct] = useState(55); // NDVI before/after reveal slider
  const [dropletSize, setDropletSize] = useState(150);
  const [acresToCover, setAcresToCover] = useState(250);
  const [selectedSubCat, setSelectedSubCat] = useState('All Agriculture Systems');
  const [quoteProduct, setQuoteProduct] = useState(null);

  const agriProducts = PRODUCTS.filter((p) => p.category === 'agriculture');
  const filteredProducts =
    selectedSubCat === 'All Agriculture Systems'
      ? agriProducts
      : agriProducts.filter((p) => p.subCategory === selectedSubCat);

  const activeMission =
    AGRI_MISSIONS.find((m) => m.id === selectedMissionId) || AGRI_MISSIONS[0];
  const activeMissionDrone =
    PRODUCTS.find((p) => p.id === activeMission.droneId) || agriProducts[0];

  const flightHoursNeeded = Number((acresToCover / 45).toFixed(1));
  const batterySwaps = Math.ceil(acresToCover / 45);
  const chemicalSavingsPct = 32;

  return (
    <div className="min-h-screen bg-[#050b14] text-[#f1f5f9]">
      {/* 1. HERO WITH FIELD-PATTERN GRID & DRONE PATH ANIMATION (#4ade80 Agriculture Green) */}
      <section className="relative overflow-hidden border-b border-white/10 pt-28 pb-16 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-20">
          <img
            src={AGRI_BANNER}
            alt="Precision agriculture UAV drone over farmland"
            className="h-full w-full object-cover opacity-20 brightness-75 saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050b14] via-[#050b14]/85 to-[#050b14]" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hero-grid-overlay" />

        {/* Animated Drone Spray Path SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 320"
          fill="none"
          className="pointer-events-none absolute inset-x-0 bottom-4 -z-10 h-44 w-full opacity-35"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 240 L220 240 L260 120 L480 120 L520 240 L740 240 L780 120 L1000 120 L1040 240 L1200 240"
            stroke="#4ade80"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            initial={shouldReduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 4.5,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: 'linear',
            }}
          />
        </svg>

        <div className="mx-auto max-w-5xl text-center space-y-6">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/40 bg-[#0b1a2c] px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#4ade80]">
              <Sprout className="h-3.5 w-3.5" />
              <span>PRECISION AGRICULTURE &amp; SMART FARMING</span>
            </div>

            <h1 className="mt-5 font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f1f5f9]">
              Smarter Farming.{' '}
              <span className="block bg-gradient-to-r from-[#4ade80] via-emerald-300 to-[#22d3ee] bg-clip-text text-transparent">
                Better Harvests.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-[#94a3b8]">
              40-liter centrifugal atomizing sprayers, sub-centimeter RTK mapping, and synchronized 5-band NDVI diagnostics built for measurable farm efficiency.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-[#f1f5f9]">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#4ade80]/30 bg-[#0b1a2c] px-3.5 py-2">
                <Droplets className="h-3.5 w-3.5 text-[#4ade80]" />
                45 ACRES / HOUR PACE
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#4ade80]/30 bg-[#0b1a2c] px-3.5 py-2">
                <Activity className="h-3.5 w-3.5 text-[#4ade80]" />
                5-BAND NDVI SENSORS
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#4ade80]/30 bg-[#0b1a2c] px-3.5 py-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#4ade80]" />
                UP TO 35% INPUT REDUCTION
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#agri-missions" className="btn-mission-primary min-h-[44px]">
                <Sprout className="h-4 w-4" />
                <span>Explore Agronomy Missions</span>
              </a>
              <Link to="/contact?type=order&product=terra-spray-x40" className="btn-mission-ghost min-h-[44px]">
                <span>Request Farm Trial</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. ANIMATED AGRONOMY MISSION TABS */}
      <section id="agri-missions" className="scroll-mt-24 bg-[#08121f] border-b border-white/10 py-16 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Reveal direction="up">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#4ade80]">
              AUTONOMOUS AGRONOMY WORKFLOWS
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              Select an Agricultural Mission
            </h2>
          </Reveal>

          <div
            role="tablist"
            aria-label="Agriculture missions"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-1"
          >
            {AGRI_MISSIONS.map((mission) => {
              const selected = activeMission.id === mission.id;
              return (
                <button
                  key={mission.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setSelectedMissionId(mission.id);
                    setSelectedCapabilityKey('variable-rate');
                  }}
                  className={`relative min-h-[44px] whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] ${
                    selected ? 'text-[#4ade80] font-bold' : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-2 opacity-75">{mission.code}</span>
                  <span>{mission.title}</span>
                  {selected && (
                    <motion.span
                      layoutId="agriMissionUnderline"
                      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] bg-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeMission.id}
            initial={shouldReduceMotion ? false : { x: 18 }}
            animate={{ x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            role="tabpanel"
            className="hud-bracket rounded-3xl border border-[#4ade80]/30 bg-[#0b1a2c] p-6 sm:p-10 space-y-10 shadow-[0_0_45px_rgba(74,222,128,0.12)]"
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded-full bg-[#4ade80] px-3 py-1 font-bold text-[#031018]">
                    {activeMission.code}
                  </span>
                  <span className="text-[#94a3b8]">{activeMission.subtitle}</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
                  {activeMission.title}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-[#94a3b8]">
                  {activeMission.summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono text-xs">
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">System</span>
                    <span className="font-bold text-[#f1f5f9]">{activeMission.telemetry.sprayRate}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">Swath</span>
                    <span className="font-bold text-[#f1f5f9]">{activeMission.telemetry.swathWidth}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">RTK</span>
                    <span className="font-bold text-[#4ade80]">{activeMission.telemetry.rtkAccuracy}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#050b14] p-3">
                    <span className="block text-[10px] uppercase text-[#94a3b8]">Pace</span>
                    <span className="font-bold text-[#f1f5f9]">{activeMission.telemetry.fieldPace}</span>
                  </div>
                </div>
              </div>

              {activeMissionDrone && (
                <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#050b14] p-6">
                  <DroneRender product={activeMissionDrone} className="max-h-64 w-full object-contain" />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#94a3b8] block">
                        Primary Agronomy Platform
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
                        <Sparkles className="h-3.5 w-3.5 text-[#4ade80]" />
                        <span>3D View</span>
                      </button>
                      <Link
                        to={`/contact?type=order&product=${activeMissionDrone.id}`}
                        className="btn-mission-primary min-h-[44px]"
                      >
                        <span>Enquire</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Staggered Agronomy Capabilities */}
            <div className="border-t border-white/10 pt-8 space-y-5">
              <h4 className="font-display text-xl font-bold text-[#f1f5f9]">
                Agronomy Capabilities
              </h4>

              <Stagger key={`agri-caps-${activeMission.id}`} className="grid gap-3 sm:grid-cols-5">
                {activeMission.capabilities.map((cap) => {
                  const isCapActive = selectedCapabilityKey === cap.key;
                  return (
                    <StaggerItem key={cap.key}>
                      <button
                        type="button"
                        onClick={() => setSelectedCapabilityKey(cap.key)}
                        className={`flex h-full w-full flex-col justify-between rounded-2xl border p-4 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] ${
                          isCapActive
                            ? 'border-[#4ade80] bg-[#4ade80]/15'
                            : 'border-white/10 bg-[#050b14]/70 hover:border-white/25'
                        }`}
                      >
                        <p className="font-display text-sm font-bold text-[#f1f5f9]">{cap.title}</p>
                        <p className="mt-2 font-mono text-[11px] font-semibold text-[#4ade80]">
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
                  <div className="rounded-2xl border border-[#4ade80]/30 bg-[#050b14]/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h5 className="font-display text-base font-bold text-[#f1f5f9]">
                        {activeCap.title} &mdash; {activeCap.metric}
                      </h5>
                      <p className="mt-1 text-xs sm:text-sm text-[#94a3b8] max-w-3xl">
                        {activeCap.description}
                      </p>
                    </div>
                    <span className="self-start rounded-full border border-[#4ade80]/40 bg-[#4ade80]/10 px-3 py-1 font-mono text-[11px] text-[#4ade80] whitespace-nowrap">
                      FIELD VERIFIED
                    </span>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. INTERACTIVE NDVI BEFORE/AFTER REVEAL SLIDER + SPRAY CALCULATOR */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* NDVI Before / After Reveal Slider */}
          <Reveal direction="left">
            <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8 space-y-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4ade80]">
                      OPTICAL SENSOR DIAGNOSTIC
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#f1f5f9] mt-0.5">
                      NDVI Before / After Reveal Slider
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#4ade80] font-bold">
                    {ndviSplitPct}% NDVI
                  </span>
                </div>

                {/* Comparison Canvas */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050b14] select-none">
                  {/* Base RGB True Color */}
                  <img
                    src="https://images.pexels.com/photos/2044043/pexels-photo-2044043.jpeg?auto=compress&cs=tinysrgb&w=1000"
                    alt="True-color RGB agricultural field survey"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />

                  {/* Clipped NDVI Layer */}
                  <div
                    style={{ clipPath: `inset(0 ${100 - ndviSplitPct}% 0 0)` }}
                    className="absolute inset-0 overflow-hidden"
                  >
                    <img
                      src="https://images.pexels.com/photos/2044043/pexels-photo-2044043.jpeg?auto=compress&cs=tinysrgb&w=1000"
                      alt="Calibrated 5-band NDVI canopy health overlay"
                      loading="lazy"
                      className="h-full w-full object-cover filter hue-rotate-[95deg] saturate-200 contrast-125"
                    />
                  </div>

                  {/* Divider Line */}
                  <div
                    aria-hidden="true"
                    style={{ left: `${ndviSplitPct}%` }}
                    className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#4ade80] shadow-[0_0_12px_#4ade80]"
                  >
                    <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4ade80] bg-[#050b14] text-[#4ade80] shadow-lg">
                      <SlidersHorizontal className="h-4 w-4" />
                    </span>
                  </div>

                  <span className="absolute left-3 top-3 rounded-lg bg-[#050b14]/85 border border-[#4ade80]/40 px-2.5 py-1 font-mono text-[10px] text-[#4ade80]">
                    5-BAND NDVI
                  </span>
                  <span className="absolute right-3 top-3 rounded-lg bg-[#050b14]/85 border border-white/15 px-2.5 py-1 font-mono text-[10px] text-[#f1f5f9]">
                    TRUE-COLOR RGB
                  </span>
                </div>

                {/* Accessible Slider Control */}
                <div className="mt-4 space-y-1">
                  <label htmlFor="ndvi-reveal-range" className="sr-only">
                    NDVI comparison slider percentage
                  </label>
                  <input
                    id="ndvi-reveal-range"
                    type="range"
                    min="0"
                    max="100"
                    value={ndviSplitPct}
                    onChange={(e) => setNdviSplitPct(Number(e.target.value))}
                    className="w-full accent-[#4ade80] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 p-2 text-[#4ade80] font-semibold">
                  0.8&ndash;1.0 Healthy
                </div>
                <div className="rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/30 p-2 text-[#fbbf24] font-semibold">
                  0.4&ndash;0.7 Stress
                </div>
                <div className="rounded-xl bg-[#f87171]/10 border border-[#f87171]/30 p-2 text-[#f87171] font-semibold">
                  &lt; 0.3 Deficit
                </div>
              </div>
            </div>
          </Reveal>

          {/* Real-Time Acreage & Chemical Reduction Calculator */}
          <Reveal direction="right">
            <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4ade80]">
                    SPRAY EFFICIENCY ESTIMATOR
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#f1f5f9] mt-0.5">
                    Field Coverage &amp; Battery Cycling
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#050b14]/70 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <label htmlFor="acres-slider" className="text-[#94a3b8]">
                      Farm Acreage:
                    </label>
                    <motion.span
                      key={acresToCover}
                      initial={shouldReduceMotion ? false : { scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="font-bold text-[#4ade80] text-base tabular-nums"
                    >
                      {acresToCover} Acres
                    </motion.span>
                  </div>
                  <input
                    id="acres-slider"
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={acresToCover}
                    onChange={(e) => setAcresToCover(Number(e.target.value))}
                    className="w-full accent-[#4ade80] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#94a3b8] font-mono">
                    <span>50 Acres</span>
                    <span>500 Acres</span>
                    <span>1,000 Acres</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#050b14]/70 p-4 mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <label htmlFor="droplet-slider" className="text-[#94a3b8]">
                      Centrifugal Atomization:
                    </label>
                    <motion.span
                      key={dropletSize}
                      initial={shouldReduceMotion ? false : { scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="font-bold text-[#4ade80] text-base tabular-nums"
                    >
                      {dropletSize} &mu;m
                    </motion.span>
                  </div>
                  <input
                    id="droplet-slider"
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={dropletSize}
                    onChange={(e) => setDropletSize(Number(e.target.value))}
                    className="w-full accent-[#4ade80] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#94a3b8] font-mono">
                    <span>50&mu;m Fine</span>
                    <span>250&mu;m Standard</span>
                    <span>500&mu;m Anti-Drift</span>
                  </div>
                </div>
              </div>

              <div
                aria-live="polite"
                className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 mt-6 text-center"
              >
                <div className="rounded-2xl border border-white/10 bg-[#050b14]/80 p-3.5">
                  <p className="text-[10px] font-mono text-[#94a3b8] uppercase">Flight Time</p>
                  <p className="mt-1 font-display text-xl font-bold text-[#f1f5f9]">
                    <Counter value={flightHoursNeeded} decimals={1} suffix=" hrs" />
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#050b14]/80 p-3.5">
                  <p className="text-[10px] font-mono text-[#94a3b8] uppercase">Battery Cycles</p>
                  <p className="mt-1 font-display text-xl font-bold text-[#f1f5f9]">
                    <Counter value={batterySwaps} suffix=" swaps" />
                  </p>
                </div>
                <div className="rounded-2xl border border-[#4ade80]/30 bg-[#4ade80]/10 p-3.5">
                  <p className="text-[10px] font-mono text-[#4ade80] uppercase font-semibold">
                    Chemical Saved
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-[#4ade80]">
                    -<Counter value={chemicalSavingsPct} suffix="%" />
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. AGRICULTURE HARDWARE CATALOGUE */}
      <section id="agri-catalogue" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4ade80]">
              AGRICULTURE SYSTEMS CATALOGUE
            </span>
            <h3 className="text-3xl font-display font-extrabold text-[#f1f5f9] mt-1">
              Agronomy Fleet &amp; Spray Equipment
            </h3>
          </div>
          <span className="text-xs font-mono text-[#94a3b8]">
            Showing {filteredProducts.length} certified agricultural platforms
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {AGRI_SUB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedSubCat(cat)}
              className={`min-h-[44px] whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                selectedSubCat === cat
                  ? 'bg-[#4ade80] text-[#031018] font-bold'
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
                  <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8 hover:border-[#4ade80]/70 transition">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-[#4ade80]/40 bg-[#050b14] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#4ade80]">
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
                        <Link to={`/product/${product.id}`} className="hover:text-[#4ade80] transition">
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
                          <FileText className="h-4 w-4 text-[#4ade80]" />
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
