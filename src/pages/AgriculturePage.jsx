import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Droplets, Activity, Sparkles, ShoppingBag, Heart, TrendingUp, ArrowRight, X, FileText, Scan, } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';
import QuoteModal from '@/components/common/QuoteModal';
const AGRI_BANNER = 'https://images.pexels.com/photos/34182367/pexels-photo-34182367.jpeg?auto=compress&cs=tinysrgb&w=1920';
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
        subtitle: 'Automated Centrifugal Atomization & Variable Dosage',
        tagline: 'Uniform micron-droplet deposition without drift or wasteful soil leaching.',
        summary: 'Engineered for maximum bio-efficacy and chemical conservation. Magnetic centrifugal atomizers regulate droplet sizes from 50 to 500 microns in real-time based on canopy density, ground speed, and crosswinds.',
        droneId: 'terra-spray-x40',
        telemetry: {
            sprayRate: '12.0 L/MIN MAX',
            swathWidth: '12.5 METER SWATH',
            flowVelocity: '14,000 RPM ATOMIZER',
            rtkAccuracy: '±1.5 CM HORIZONTAL',
            fieldPace: '45 ACRES / HOUR',
        },
        capabilities: [
            {
                key: 'variable-rate',
                title: 'Variable Rate Spraying',
                metric: '0.5 – 12.0 L/min Dynamic Flow Adjustment',
                description: 'Modulates chemical dosage meter-by-meter using uploaded prescription maps, preventing scorching in light zones and under-treatment in dense outbreaks.',
            },
            {
                key: 'multispectral',
                title: 'Multispectral Crop Health Analysis',
                metric: 'Pre-Flight NDVI Prescription Sync',
                description: 'Directly ingests multispectral prescription shapefiles to target only infected weed patches, cutting pesticide expenditure up to 35%.',
            },
            {
                key: 'terrain-mapping',
                title: 'High-Resolution Terrain Mapping',
                metric: 'Sub-Centimeter 3D Ground Following',
                description: 'Millimeter-wave radar continuously adjusts boom elevation over rolling hills and tiered orchards, maintaining constant 2.5m altitude above canopy.',
            },
            {
                key: 'flight-planning',
                title: 'Automated Flight Planning',
                metric: 'One-Touch Swath & Turnaround Routing',
                description: 'Autonomous boundary detection calculates optimal flight paths with automated battery return-to-refill points and resume-where-left-off accuracy.',
            },
            {
                key: 'data-processing',
                title: 'Real-Time Crop Data Processing',
                metric: 'ISOBUS & FMIS Live Cloud Telemetry',
                description: 'Synchronizes real-time application logs with John Deere Operations Center and Trimble Farm Management systems via encrypted 4G/5G datalinks.',
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
        subtitle: '5-Band Multispectral NDVI & Canopy Stress Diagnostics',
        tagline: 'Detect water stress, fungal blight, and nitrogen deficits weeks before visual onset.',
        summary: 'Combines high-resolution visual imagery with synchronized Near-Infrared (NIR) and RedEdge bands. Translates reflectance data into scientific NDVI and NDRE vegetative indices for targeted agronomy.',
        droneId: 'agriscan-ndvi',
        telemetry: {
            sprayRate: '5-BAND RADIOMETRIC',
            swathWidth: '1.2 CM/PX GSD @ 100M',
            flowVelocity: 'SUNLIGHT ILLUMINANCE SENSOR',
            rtkAccuracy: '±1.0 CM RTK FIX',
            fieldPace: '120 ACRES / FLIGHT',
        },
        capabilities: [
            {
                key: 'variable-rate',
                title: 'Variable Rate Spraying',
                metric: 'Automated VRA Export for Sprayers',
                description: 'Automatically exports variable-rate application (VRA) maps directly to spraying drones and modern tractor seeders without manual GIS editing.',
            },
            {
                key: 'multispectral',
                title: 'Multispectral Crop Health Analysis',
                metric: 'Green, Red, RedEdge, NIR + 20MP RGB',
                description: 'Simultaneous multi-band exposure reveals chlorophyll breakdown and plant vascular health before yellowing leaves appear to the naked eye.',
            },
            {
                key: 'terrain-mapping',
                title: 'High-Resolution Terrain Mapping',
                metric: 'Digital Surface Model (DSM) Generation',
                description: 'Accurately calculates tree canopy volume and crop height metrics to evaluate nitrogen uptake across distinct field zones.',
            },
            {
                key: 'flight-planning',
                title: 'Automated Flight Planning',
                metric: 'Continuous Cross-Hatch Survey Grids',
                description: 'Calculates forward and side image overlaps (75%/80%) to produce gap-free orthomosaics with calibrated radiometric compensation.',
            },
            {
                key: 'data-processing',
                title: 'Real-Time Crop Data Processing',
                metric: 'Edge-AI Fast Orthomosaic Stitching',
                description: 'Generates a calibrated NDVI index map on the GCS tablet before the drone touches down on the landing pad.',
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
        subtitle: 'Sub-Centimeter 3D Topography & Drainage Surveying',
        tagline: 'Digital elevation modeling, watershed drainage channels, and cadastral boundaries.',
        summary: 'Produces high-density point clouds and 3D terrain elevation models. Allows farmers to plan precision drainage ditches, eliminate standing water pooling, and optimize pivot irrigation paths.',
        droneId: 'cropguard-harvest',
        telemetry: {
            sprayRate: '61MP FULL-FRAME RGB',
            swathWidth: 'SUB-CM RTK SURVEY',
            flowVelocity: 'MECHANICAL LEAF SHUTTER',
            rtkAccuracy: '±0.8 CM ACCURACY',
            fieldPace: '200 ACRES / MISSION',
        },
        capabilities: [
            {
                key: 'variable-rate',
                title: 'Variable Rate Spraying',
                metric: 'Runoff & Erosion Hazard Boundaries',
                description: 'Elevation slope analysis highlights buffer zones and natural waterways to prevent agricultural chemicals from washing into local streams.',
            },
            {
                key: 'multispectral',
                title: 'Multispectral Crop Health Analysis',
                metric: 'Topographic Soil Moisture Correlation',
                description: 'Cross-references soil elevation dips with moisture retention indices to identify areas prone to root rot or excessive drying.',
            },
            {
                key: 'terrain-mapping',
                title: 'High-Resolution Terrain Mapping',
                metric: '3D Mesh & Digital Elevation Modeling (DEM)',
                description: 'Sub-centimeter contour mapping provides precise slope calculations for laser leveling and automated tile-drain installation.',
            },
            {
                key: 'flight-planning',
                title: 'Automated Flight Planning',
                metric: 'Terrain-Aware 3D Corridor Trajectories',
                description: 'Automated altitude compensation maintains constant ground resolution even when flying over steep hillside vineyards and terraced slopes.',
            },
            {
                key: 'data-processing',
                title: 'Real-Time Crop Data Processing',
                metric: 'GeoTIFF, LAS Point Cloud & CAD Export',
                description: 'Direct compatibility with standard GIS and precision farming software for rapid export into earthmoving equipment guidance monitors.',
            },
        ],
        matchedIds: {
            drone: 'cropguard-harvest',
            controller: 'rc-longrange-x',
            gcs: 'gcs-field-rugged',
        },
    },
    {
        id: 'precision-ag',
        code: 'AGRI-ECO-04',
        title: 'Precision Agriculture',
        subtitle: 'Full-Cycle Autonomous Agronomy Ecosystem',
        tagline: 'End-to-end swarm integration of scout UAVs, heavy sprayers, and base stations.',
        summary: 'Unifies scouting, prescription calculation, and high-capacity aerial application into one coordinated autonomous fleet. One operator oversees multiple drones managing thousands of agricultural acres.',
        droneId: 'terra-spray-x40',
        telemetry: {
            sprayRate: 'MULTI-DRONE SWARM C2',
            swathWidth: 'COOPERATIVE DUAL SWATH',
            flowVelocity: 'SYNCHRONIZED RTK MESH',
            rtkAccuracy: '±1.0 CM SHARED BASE',
            fieldPace: '150 ACRES / HOUR FLEET',
        },
        capabilities: [
            {
                key: 'variable-rate',
                title: 'Variable Rate Spraying',
                metric: 'Closed-Loop Scout-to-Sprayer Direct Handoff',
                description: 'AgriScan Pro scouts the field in the morning; prescription data is sent directly to Terra Spray X40 drones for targeted midday treatment.',
            },
            {
                key: 'multispectral',
                title: 'Multispectral Crop Health Analysis',
                metric: 'Full-Season Crop Growth Time-Lapse',
                description: 'Monitors canopy development week by week, providing machine-learning yield forecasting before harvest season commences.',
            },
            {
                key: 'terrain-mapping',
                title: 'High-Resolution Terrain Mapping',
                metric: 'Continuous Farm Digital Twin',
                description: 'Constructs an evolving 3D digital model of field roads, drainage canals, and crop canopies updated after every flight.',
            },
            {
                key: 'flight-planning',
                title: 'Automated Flight Planning',
                metric: 'Multi-UAV Non-Conflicting Swarm Dispatch',
                description: 'Command desk automatically partitions massive farm acreage across multiple UAVs, synchronizing flight corridors and battery recharges.',
            },
            {
                key: 'data-processing',
                title: 'Real-Time Crop Data Processing',
                metric: 'Central Cloud Operations Dashboard',
                description: 'Consolidates chemical logs, fuel consumption, battery cycles, and crop health analytics into automated compliance reports.',
            },
        ],
        matchedIds: {
            drone: 'terra-spray-x40',
            controller: 'rc-touch-lumina',
            gcs: 'gcs-dual-console',
        },
    },
];
export default function AgriculturePage({ onOpenShowcase, }) {
    const { addToCart, wishlist, toggleWishlist } = useShop();
    // Selected Interactive Mission State (starts closed until clicked, satisfying the user's rule)
    const [selectedMissionId, setSelectedMissionId] = useState(null);
    const [selectedCapabilityKey, setSelectedCapabilityKey] = useState('variable-rate');
    // Interactive Agriculture Simulator States
    const [dropletSize, setDropletSize] = useState(150); // microns
    const [acresToCover, setAcresToCover] = useState(250);
    const [ndviMode, setNdviMode] = useState('ndvi');
    // Subcategory Filtering State
    const [selectedSubCat, setSelectedSubCat] = useState('All Agriculture Systems');
    // Quote RFP Modal State
    const [quoteProduct, setQuoteProduct] = useState(null);
    const agriProducts = PRODUCTS.filter((p) => p.category === 'agriculture');
    const filteredProducts = selectedSubCat === 'All Agriculture Systems'
        ? agriProducts
        : agriProducts.filter((p) => p.subCategory === selectedSubCat);
    const activeMission = AGRI_MISSIONS.find((m) => m.id === selectedMissionId);
    const activeMissionDrone = activeMission
        ? PRODUCTS.find((p) => p.id === activeMission.droneId)
        : null;
    // Acreage calculator estimates
    const flightHoursNeeded = (acresToCover / 45).toFixed(1);
    const chemicalSavingsPct = 32;
    const batterySwaps = Math.ceil(acresToCover / 45);
    const handleSelectMission = (id) => {
        setSelectedMissionId(id);
        setSelectedCapabilityKey('variable-rate');
        const el = document.getElementById('agri-mission-experience');
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };
    const handleCloseMission = () => {
        setSelectedMissionId(null);
    };
    return (<div className="bg-[#f8faf9] text-zinc-900 min-h-screen">
      {/* ========================================================
            1. CINEMATIC AGRICULTURE HERO (PREMIUM LIGHT SURFACES)
            ======================================================== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-28 pb-16 px-5 sm:px-8 border-b border-emerald-200/80 bg-white">
        {/* Soft Background Image & Fresh Green Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src={AGRI_BANNER} alt="Agricultural Spraying Drone Platform" className="h-full w-full object-cover object-center opacity-20 filter saturate-150 brightness-95"/>
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-[#f8faf9]"/>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12)_0,transparent_70%)]"/>
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-emerald-800 shadow-sm">
            <Sprout className="h-3.5 w-3.5 text-emerald-600"/>
            <span>AUTONOMOUS AGRONOMY &amp; PRECISION SPRAYING</span>
          </div>

          <h1 className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-zinc-900">
            SMARTER FARMING.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700">
              BETTER HARVESTS.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            Elevating modern agricultural productivity through 40-liter centrifugal atomizing sprayers, sub-centimeter RTK topographic field mapping, and synchronized 5-band NDVI multispectral scouting.
          </p>

          {/* Operational Metrics Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-700">
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-3.5 py-1.5 shadow-sm">
              <Droplets className="h-3.5 w-3.5 text-emerald-600"/>
              45 ACRES / HOUR SPRAY EFFICIENCY
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-3.5 py-1.5 shadow-sm">
              <Activity className="h-3.5 w-3.5 text-emerald-600"/>
              5-BAND MULTISPECTRAL NDVI
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-3.5 py-1.5 shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600"/>
              UP TO 35% INPUT REDUCTION
            </span>
          </div>

          {/* Interactive Trigger CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => handleSelectMission('spraying')} className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 hover:scale-105">
              <Sprout className="h-4 w-4"/>
              <span>Launch Mission Experience</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
            </button>
            <a href="#agri-catalogue" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-zinc-50 transition shadow-sm">
              Browse Complete Hardware
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
            2. INTERACTIVE MISSION CARDS (CLICK TO ACTIVATE)
            "The animations must start when the visitor clicks or selects a section, card, mission or feature."
            ======================================================== */}
      <section id="agri-missions-section" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping"/>
              <span>INTERACTIVE AGRONOMY MISSIONS</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              Select an Agricultural Mission to Initialize Experience
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md">
            Click any mission card to trigger live field-grid scanning, agronomic capability matrices, and matched equipment.
          </p>
        </div>

        {/* 4 Interactive Agriculture Mission Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AGRI_MISSIONS.map((mission) => {
            const isSelected = selectedMissionId === mission.id;
            return (<button key={mission.id} onClick={() => handleSelectMission(mission.id)} className={`group relative flex flex-col justify-between rounded-2xl p-6 text-left transition-all duration-300 border ${isSelected
                    ? 'border-emerald-600 bg-white shadow-xl ring-2 ring-emerald-500'
                    : 'border-zinc-200/90 bg-white hover:border-emerald-400 hover:shadow-lg'}`}>
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 mb-4">
                    <span className="text-emerald-700 font-bold">{mission.code}</span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 border border-emerald-200 text-emerald-800">
                      {mission.telemetry.fieldPace}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    {mission.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                    {mission.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 font-mono text-xs">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Scan className="h-3.5 w-3.5"/>
                    {isSelected ? 'ACTIVE MISSION' : 'CLICK TO SIMULATE'}
                  </span>
                  <ArrowRight className={`h-4 w-4 text-emerald-600 transition-transform duration-300 ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`}/>
                </div>
              </button>);
        })}
        </div>

        {/* ========================================================
            3. DEDICATED EXPANDED AGRICULTURE MISSION EXPERIENCE
            (Revealed smoothly upon clicking a mission card)
            ======================================================== */}
        <div id="agri-mission-experience">
          <AnimatePresence mode="wait">
            {activeMission && activeMissionDrone && (<motion.div key={activeMission.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mt-12 overflow-hidden rounded-3xl border border-emerald-300 bg-white shadow-2xl">
                {/* Mission Command Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-emerald-100 bg-emerald-50/70 p-6 sm:p-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                      <span className="rounded-full bg-emerald-600 px-3 py-1 font-bold text-white uppercase tracking-wider">
                        MISSION ENGAGED
                      </span>
                      <span className="text-emerald-800 font-bold">{activeMission.code}</span>
                      <span className="text-zinc-400">{'//'}</span>
                      <span className="text-zinc-600">{activeMission.subtitle}</span>
                    </div>

                    {/* Cinematic Text Reveal */}
                    <motion.h3 initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-zinc-900">
                      {activeMission.title}
                    </motion.h3>
                    <p className="mt-2 text-sm text-emerald-800 font-medium">
                      {activeMission.tagline}
                    </p>
                  </div>

                  {/* Return to Overview Button */}
                  <div className="flex items-center gap-3">
                    <button onClick={handleCloseMission} className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-700 hover:bg-zinc-100 transition shadow-sm">
                      <X className="h-4 w-4 text-emerald-700"/>
                      <span>Close Mission View</span>
                    </button>
                  </div>
                </div>

                {/* Main Mission Body */}
                <div className="p-6 sm:p-10 space-y-10">
                  {/* Visual + Field-Grid Scanning Overlay */}
                  <div className="grid gap-8 lg:grid-cols-12 items-center">
                    {/* Left 7 cols: Agricultural Drone Visual with Field-Grid Scanning Overlay */}
                    <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/40 via-white to-zinc-50 p-6 sm:p-8">
                      {/* Subtle Field-Grid Scanning Canvas/SVG */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                        {/* SVG Field Grid Pattern */}
                        <svg className="h-full w-full stroke-emerald-600/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]">
                          <defs>
                            <pattern id="field-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                              <path d="M 32 0 L 0 0 0 32" fill="none" strokeWidth="0.8"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#field-grid)"/>
                        </svg>

                        {/* Animated Horizontal Crop-Scanning Sweep Line */}
                        <motion.div animate={{ y: ['0%', '100%', '0%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.8)]"/>
                      </div>

                      {/* Agronomy HUD Header */}
                      <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-emerald-800 pb-4 border-b border-emerald-100">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse"/>
                          NDVI SPECTRUM: 0.82 [HEALTHY CANOPY]
                        </span>
                        <span className="text-zinc-600 font-medium">
                          RTK LOCK: {activeMission.telemetry.rtkAccuracy}
                        </span>
                      </div>

                      {/* Large Agricultural Drone Visual (Smoothly animates into view) */}
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 my-6 flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
                        <DroneRender product={activeMissionDrone} className="w-full max-h-[300px] object-contain drop-shadow-[0_20px_35px_rgba(16,185,129,0.2)]"/>
                      </motion.div>

                      {/* Telemetry Indicator Readout */}
                      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-emerald-100 font-mono text-[10px]">
                        <div className="rounded-lg bg-white border border-emerald-100 p-2 shadow-sm">
                          <span className="text-zinc-500 block uppercase">Discharge Rate</span>
                          <span className="text-emerald-800 font-bold text-xs">{activeMission.telemetry.sprayRate}</span>
                        </div>
                        <div className="rounded-lg bg-white border border-emerald-100 p-2 shadow-sm">
                          <span className="text-zinc-500 block uppercase">Effective Swath</span>
                          <span className="text-zinc-900 font-bold text-xs">{activeMission.telemetry.swathWidth}</span>
                        </div>
                        <div className="rounded-lg bg-white border border-emerald-100 p-2 shadow-sm">
                          <span className="text-zinc-500 block uppercase">Atomizer Speed</span>
                          <span className="text-emerald-700 font-bold text-xs">{activeMission.telemetry.flowVelocity}</span>
                        </div>
                        <div className="rounded-lg bg-white border border-emerald-100 p-2 shadow-sm">
                          <span className="text-zinc-500 block uppercase">Survey Pace</span>
                          <span className="text-zinc-900 font-bold text-xs">{activeMission.telemetry.fieldPace}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right 5 cols: Mission Description & Agricultural Task */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 block mb-2 font-bold">
                          AGRICULTURAL TASK OBJECTIVE
                        </span>
                        <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
                          {activeMission.summary}
                        </p>

                        <div className="mt-6 space-y-2 border-t border-zinc-100 pt-4 text-xs font-mono">
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Soil Compaction Factor:</span>
                            <span className="text-emerald-700 font-bold">0.0 kg/cm² (Zero Impact)</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Chemical Drift Reduction:</span>
                            <span className="text-emerald-700 font-bold">-35% Input Savings</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Elevation Following Radar:</span>
                            <span className="text-zinc-900 font-bold">Millimeter-Wave Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Primary Platform Card */}
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                            Primary Aerial Platform
                          </span>
                          <h4 className="font-display text-lg font-bold text-zinc-900">
                            {activeMissionDrone.name}
                          </h4>
                          <span className="font-mono text-sm text-emerald-700 font-bold">
                            {activeMissionDrone.isQuoteRequired
                ? 'Request Formal Quote'
                : formatPrice(activeMissionDrone.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button onClick={() => onOpenShowcase(activeMissionDrone.id)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-400 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:bg-emerald-600 hover:text-white transition shadow-sm">
                            <Sparkles className="h-3.5 w-3.5"/>
                            Showcase
                          </button>
                          {activeMissionDrone.isQuoteRequired ? (<button onClick={() => setQuoteProduct(activeMissionDrone)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 transition shadow-sm">
                              <FileText className="h-3.5 w-3.5"/>
                              Quote
                            </button>) : (<button onClick={() => addToCart(activeMissionDrone.id, activeMissionDrone.colors[0]?.name || 'Standard')} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition">
                              <ShoppingBag className="h-3.5 w-3.5"/>
                              Add
                            </button>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                5 KEY CAPABILITIES REQUIRED FOR THIS MISSION:
                * Variable rate spraying
                * Multispectral crop health analysis
                * High-resolution terrain mapping
                * Automated flight planning
                * Real-time crop data processing
                ======================================================== */}
                  <div className="border-t border-zinc-200 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
                          KEY CAPABILITIES REQUIRED FOR THIS MISSION
                        </span>
                        <h4 className="text-2xl font-display font-bold text-zinc-900 mt-1">
                          Precision Agronomic Technology
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">
                        Click capability to inspect operational specs
                      </span>
                    </div>

                    {/* Interactive Capability Selector Tabs */}
                    <div className="grid gap-3 sm:grid-cols-5">
                      {activeMission.capabilities.map((cap) => {
                const isCapActive = selectedCapabilityKey === cap.key;
                return (<button key={cap.key} onClick={() => setSelectedCapabilityKey(cap.key)} className={`rounded-xl p-4 text-left transition-all border ${isCapActive
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-1 ring-emerald-500'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'}`}>
                            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                              {cap.key === 'variable-rate' && 'VARIABLE RATE'}
                              {cap.key === 'multispectral' && 'MULTISPECTRAL'}
                              {cap.key === 'terrain-mapping' && 'TERRAIN MAP'}
                              {cap.key === 'flight-planning' && 'FLIGHT PLAN'}
                              {cap.key === 'data-processing' && 'DATA SYNC'}
                            </span>
                            <p className="font-display text-sm font-bold text-zinc-900 line-clamp-1">
                              {cap.title}
                            </p>
                            <div className="mt-2 text-[11px] font-mono text-emerald-700 line-clamp-1 font-semibold">
                              {cap.metric}
                            </div>
                          </button>);
            })}
                    </div>

                    {/* Active Capability Deep-Dive Explanation */}
                    {(() => {
                const activeCap = activeMission.capabilities.find((c) => c.key === selectedCapabilityKey);
                if (!activeCap)
                    return null;
                return (<motion.div key={activeCap.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-600"/>
                              <h5 className="font-display text-base font-bold text-zinc-900">
                                {activeCap.title} — {activeCap.metric}
                              </h5>
                            </div>
                            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
                              {activeCap.description}
                            </p>
                          </div>
                          <span className="self-start md:self-auto rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-xs text-emerald-800 whitespace-nowrap">
                            CERTIFIED FIELD DEPLOYMENT
                          </span>
                        </motion.div>);
            })()}
                  </div>

                  {/* ========================================================
                MATCHED PRODUCTS FROM CATALOGUE:
                * Appropriate Agricultural Drone
                * Matching Remote Controller
                * Matching Ground Control Station
                ======================================================== */}
                  <div className="border-t border-zinc-200 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
                          INTEGRATED FARM HARDWARE PACKAGE
                        </span>
                        <h4 className="text-2xl font-display font-bold text-zinc-900 mt-1">
                          Matched Systems for {activeMission.title}
                        </h4>
                      </div>
                      <p className="text-xs font-mono text-zinc-500">
                        Compatible sunlight-readable controllers &amp; rugged field tablets
                      </p>
                    </div>

                    {/* Grid of Matched Agricultural Equipment */}
                    <div className="grid gap-6 sm:grid-cols-3">
                      {[
                { role: 'AGRICULTURAL DRONE', id: activeMission.matchedIds.drone },
                { role: 'REMOTE CONTROLLER', id: activeMission.matchedIds.controller },
                { role: 'GROUND CONTROL STATION', id: activeMission.matchedIds.gcs },
            ].map(({ role, id }) => {
                const product = PRODUCTS.find((p) => p.id === id);
                if (!product)
                    return null;
                const isSaved = wishlist.includes(product.id);
                return (<div key={product.id} className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:border-emerald-400 hover:shadow-xl">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-800">
                                  {role}
                                </span>
                                <button onClick={() => toggleWishlist(product.id)} className={`rounded-full p-1.5 border transition ${isSaved
                        ? 'border-red-400 bg-red-50 text-red-500'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-red-500'}`} aria-label="Save to Wishlist">
                                  <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`}/>
                                </button>
                              </div>

                              {/* Product Visual */}
                              <div onClick={() => onOpenShowcase(product.id)} className="relative aspect-[16/11] overflow-hidden rounded-xl bg-zinc-50 p-3 flex items-center justify-center cursor-pointer border border-zinc-100 group-hover:border-emerald-200 transition-colors">
                                <DroneRender product={product} className="max-h-28 w-full object-contain"/>
                                <span className="absolute bottom-2 right-2 rounded border border-zinc-300 bg-white/90 px-2 py-0.5 text-[9px] font-mono text-emerald-700 uppercase opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                  Showcase
                                </span>
                              </div>

                              <h5 onClick={() => onOpenShowcase(product.id)} className="mt-3 font-display text-base font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1">
                                {product.name}
                              </h5>
                              <p className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>

                              {/* Spec Snapshot */}
                              <div className="mt-3 rounded bg-zinc-50 p-2 font-mono text-[10px] text-zinc-700 border border-zinc-100">
                                {product.specs.payloadCapacity && (<div>
                                    <span className="text-zinc-500 uppercase">Tank: </span>
                                    {product.specs.payloadCapacity}
                                  </div>)}
                                {product.specs.display && (<div>
                                    <span className="text-zinc-500 uppercase">Display: </span>
                                    {product.specs.display}
                                  </div>)}
                                {product.specs.screenSize && (<div>
                                    <span className="text-zinc-500 uppercase">Console: </span>
                                    {product.specs.screenSize}
                                  </div>)}
                              </div>
                            </div>

                            {/* Bottom Actions */}
                            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                                  Price
                                </span>
                                <span className="font-display text-sm font-bold text-zinc-900">
                                  {product.isQuoteRequired ? 'Quote Req.' : formatPrice(product.price)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button onClick={() => onOpenShowcase(product.id)} className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-emerald-800 hover:bg-emerald-600 hover:text-white transition">
                                  View
                                </button>
                                {product.isQuoteRequired ? (<button onClick={() => setQuoteProduct(product)} className="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-white hover:bg-emerald-500 transition shadow-sm">
                                    Quote
                                  </button>) : (<button onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')} className="rounded-full bg-zinc-900 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-white hover:bg-zinc-800 transition">
                                    + Cart
                                  </button>)}
                              </div>
                            </div>
                          </div>);
            })}
                    </div>
                  </div>

                  {/* Return To Overview Banner */}
                  <div className="text-center pt-4">
                    <button onClick={handleCloseMission} className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-zinc-700 hover:bg-zinc-100 transition shadow-sm">
                      <X className="h-4 w-4 text-emerald-700"/>
                      <span>Return to Agriculture Overview</span>
                    </button>
                  </div>
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================
            4. INTERACTIVE AGRONOMY SIMULATOR: NDVI & SPRAY CALIBRATION
            (Light surface styling with natural green accents)
            ======================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Diagnostic 1: NDVI Multispectral Simulator */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                  OPTICAL SENSOR DIAGNOSTIC
                </span>
                <h3 className="text-xl font-bold font-display text-zinc-900 mt-0.5">
                  NDVI Vegetative Index Analysis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setNdviMode('normal')} className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition ${ndviMode === 'normal'
            ? 'bg-zinc-900 text-white'
            : 'border border-zinc-300 bg-white text-zinc-600'}`}>
                  RGB View
                </button>
                <button onClick={() => setNdviMode('ndvi')} className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition ${ndviMode === 'ndvi'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'border border-zinc-300 bg-white text-zinc-600'}`}>
                  NDVI Map
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100">
              <img src="https://images.pexels.com/photos/2044043/pexels-photo-2044043.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Crop Health Map" className={`h-full w-full object-cover transition-all duration-700 ${ndviMode === 'ndvi'
            ? 'filter hue-rotate-[90deg] saturate-200 contrast-125'
            : ''}`}/>
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur p-2.5 rounded-xl border border-zinc-200 flex justify-between items-center text-xs font-mono shadow-sm">
                <span className="text-emerald-800 font-semibold">
                  {ndviMode === 'ndvi' ? '5-BAND RADIOMETRIC NDVI: LOCKED' : 'RGB PHOTOGRAMMETRY SENSOR: ACTIVE'}
                </span>
                <span className="text-zinc-600">GSD: 1.2 CM/PX</span>
              </div>
            </div>

            {/* NDVI Index Scale */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-800 font-semibold">
                NDVI 0.8–1.0 (Healthy)
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-amber-800 font-semibold">
                NDVI 0.4–0.7 (Stress)
              </div>
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-rose-800 font-semibold">
                NDVI &lt; 0.3 (Deficit)
              </div>
            </div>
          </div>

          {/* Diagnostic 2: Real-Time Field Acreage & Chemical Reduction Calculator */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="border-b border-zinc-100 pb-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                  SPRAY EFFICIENCY ESTIMATOR
                </span>
                <h3 className="text-xl font-bold font-display text-zinc-900 mt-0.5">
                  Field Coverage &amp; Battery Cycling
                </h3>
              </div>

              {/* Acreage Slider */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-zinc-600 font-medium">Farm Acreage:</span>
                  <span className="font-bold text-emerald-700 text-base">{acresToCover} Acres</span>
                </div>
                <input type="range" min="50" max="1000" step="25" value={acresToCover} onChange={(e) => setAcresToCover(Number(e.target.value))} className="w-full accent-emerald-600 cursor-pointer"/>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>50 Acres</span>
                  <span>500 Acres</span>
                  <span>1,000 Acres</span>
                </div>
              </div>

              {/* Droplet Slider */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 mt-4">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-zinc-600 font-medium">Centrifugal Atomization:</span>
                  <span className="font-bold text-emerald-700 text-base">{dropletSize} μm</span>
                </div>
                <input type="range" min="50" max="500" step="10" value={dropletSize} onChange={(e) => setDropletSize(Number(e.target.value))} className="w-full accent-emerald-600 cursor-pointer"/>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>50μm (Fine Fog)</span>
                  <span>250μm (Standard Mist)</span>
                  <span>500μm (Coarse Anti-Drift)</span>
                </div>
              </div>
            </div>

            {/* Computed Results */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-100 mt-6 text-center">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] text-zinc-500 uppercase">Flight Time</p>
                <p className="font-display text-xl font-bold text-zinc-900">{flightHoursNeeded} hrs</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] text-zinc-500 uppercase">Battery Cycles</p>
                <p className="font-display text-xl font-bold text-zinc-900">{batterySwaps} swaps</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-[10px] text-emerald-800 uppercase font-semibold">Chemical Saved</p>
                <p className="font-display text-xl font-bold text-emerald-700">-{chemicalSavingsPct}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
            5. COMPLETE AGRICULTURE CATALOGUE
            ======================================================== */}
      <section id="agri-catalogue" className="mx-auto max-w-7xl px-5 pt-12 pb-6 sm:px-8 border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
              AGRICULTURE SYSTEMS CATALOGUE
            </span>
            <h3 className="text-3xl font-display font-extrabold text-zinc-900 mt-1">
              Agronomy Fleet &amp; Spray Equipment
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Showing {filteredProducts.length} certified agricultural platforms
          </span>
        </div>

        {/* Subcategory Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {AGRI_SUB_CATEGORIES.map((cat) => (<button key={cat} onClick={() => setSelectedSubCat(cat)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${selectedSubCat === cat
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'}`}>
              {cat}
            </button>))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 mt-8">
          {filteredProducts.map((product) => {
            const isSaved = wishlist.includes(product.id);
            return (<article key={product.id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 transition-all duration-500 hover:border-emerald-500 hover:shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-semibold">
                      {product.subCategory}
                    </span>
                    <button onClick={() => toggleWishlist(product.id)} className={`rounded-full p-2 border transition ${isSaved
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-red-500'}`} aria-label="Wishlist">
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}/>
                    </button>
                  </div>

                  {/* Drone Image Render */}
                  <div onClick={() => onOpenShowcase(product.id)} className="relative my-6 aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-50 p-4 cursor-pointer flex items-center justify-center border border-zinc-100 group-hover:border-emerald-200 transition-colors">
                    <DroneRender product={product} className="h-full w-full max-h-56"/>
                    <span className="absolute bottom-3 right-3 rounded-full border border-zinc-300 bg-white/90 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-700 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      Click for 3D Showcase
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 onClick={() => onOpenShowcase(product.id)} className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Specifications Grid */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Payload</p>
                      <p className="font-bold text-emerald-700 mt-0.5">{product.specs.payloadCapacity || '25 L'}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Coverage Range</p>
                      <p className="font-bold text-zinc-900 mt-0.5">{product.specs.range || '15 km'}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Flight Time</p>
                      <p className="font-bold text-zinc-900 mt-0.5">{product.specs.flightTime || '45 min'}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Max Speed</p>
                      <p className="font-bold text-zinc-900 mt-0.5">{product.specs.maxSpeed || '18 m/s'}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-100 pt-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      System Investment
                    </span>
                    <div className="font-display text-2xl font-bold text-zinc-900">
                      {product.isQuoteRequired ? (<span className="text-emerald-700 text-lg">Quote Required</span>) : (formatPrice(product.price))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => onOpenShowcase(product.id)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:bg-emerald-600 hover:text-white transition duration-300">
                      <Sparkles className="h-3.5 w-3.5"/>
                      View Details
                    </button>

                    {product.isQuoteRequired ? (<button onClick={() => setQuoteProduct(product)} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 transition active:scale-95 shadow-sm">
                        <FileText className="h-3.5 w-3.5"/>
                        Request Quote
                      </button>) : (<button onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition active:scale-95">
                        <ShoppingBag className="h-3.5 w-3.5"/>
                        Add to Cart
                      </button>)}
                  </div>
                </div>
              </article>);
        })}
        </div>
      </section>

      {/* ========================================================
            6. AGRONOMY FLEET CONSULTATION & ON-SITE DEMO
            ======================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 border-t border-zinc-200">
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md">
          <Sprout className="mx-auto h-12 w-12 text-emerald-600"/>
          <h3 className="mt-4 font-display text-3xl font-bold text-zinc-900">
            Commercial Farm Fleet Deployments &amp; RTK Setup
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-zinc-600">
            Deploy multi-drone automated spray squadrons, integrate RTK base stations with John Deere or Trimble tractor telemetry, and schedule on-site flight demonstrations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => {
            const spray = PRODUCTS.find((p) => p.id === 'terra-spray-x40');
            if (spray)
                setQuoteProduct(spray);
        }} className="rounded-full bg-emerald-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/30">
              Request Agronomy Consultation RFP
            </button>
            <button onClick={() => onOpenShowcase('terra-spray-x40')} className="rounded-full border border-zinc-300 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-zinc-50 transition shadow-sm">
              Explore Terra Spray X40
            </button>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      {quoteProduct && (<QuoteModal product={quoteProduct} open={Boolean(quoteProduct)} onClose={() => setQuoteProduct(null)}/>)}

      <Footer />
    </div>);
}
