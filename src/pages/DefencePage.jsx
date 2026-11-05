import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Crosshair, Radar, Radio, Lock, Sparkles, ShoppingBag, Heart, ArrowRight, X, Compass, FileText, } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useShop } from '@/hooks/useShop';
import Footer from '@/components/layout/Footer';
import DroneRender from '@/components/showcase/DroneRender';
import QuoteModal from '@/components/common/QuoteModal';
const DEFENCE_BANNER = 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1920';
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
        title: 'Surveillance and Monitoring',
        subtitle: 'Persistent Wide-Area Tactical Observation',
        tagline: 'High-altitude loiter with dual daylight EO and radiometric FLIR thermal sensor feeds.',
        summary: 'Engineered for 24/7 continuous perimeter and strategic infrastructure vigilance. Equipped with an optical zoom gimbal capable of recognizing license plates and personnel at up to 2.5 kilometers without acoustic compromise.',
        droneId: 'aegis-mk4',
        telemetry: {
            altitude: '2,400 M ASL',
            range: '25.0 KM LOS',
            endurance: '65 MIN LOITER',
            encryption: 'AES-256 GCM',
            sensor: '40x EO + 640 FLIR',
        },
        capabilities: [
            {
                key: 'zoom',
                title: 'Optical & Thermal Zoom',
                metric: '40x Continuous Optical + 120x Hybrid',
                description: 'Continuous lossless optical magnification paired with a 640x512 uncooled VOx radiometric thermal microbolometer for day/night target isolation.',
            },
            {
                key: 'crypto',
                title: 'Encrypted Communication',
                metric: 'AES-256 Dynamic Frequency-Hopping',
                description: 'Zero-leak encrypted command, control, and multi-stream high-definition video downlink resilient against tactical RF interception.',
            },
            {
                key: 'flir',
                title: 'Night Vision / FLIR',
                metric: '<30mK Thermal NETD Sensitivity',
                description: 'Resolves minute thermal differentials down to 0.03°C, exposing heat signatures through total darkness, heavy mist, and thick smoke.',
            },
            {
                key: 'weather',
                title: 'All-Weather Operation',
                metric: 'IP55 Ingress Protection // 15 m/s Wind',
                description: 'Fully sealed magnesium-alloy carbon composite chassis with internal sensor heating elements operational from -20°C to +55°C.',
            },
            {
                key: 'endurance',
                title: 'Long Flight Endurance',
                metric: '65 Minutes Continuous On-Station',
                description: 'Dual solid-state intelligent battery redundancy with live cell telemetry and automated hot-swap capability on the landing pad.',
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
        subtitle: 'Discreet Forward Scouting & Stealth ISR',
        tagline: 'Silent acoustic signature and low radar cross-section for contested corridor verification.',
        summary: 'Provides forward aerial scout telemetry ahead of human search teams and perimeter guards. Features specialized toroidal silent low-noise propellers and radar-absorbent composite coating.',
        droneId: 'specter-apex',
        telemetry: {
            altitude: '1,800 M ASL',
            range: '22.0 KM LOS',
            endurance: '55 MIN SILENT',
            encryption: 'COFDM MESH',
            sensor: '30x EO + 4K Starlight',
        },
        capabilities: [
            {
                key: 'zoom',
                title: 'Optical & Thermal Zoom',
                metric: '30x Optical Zoom with AI Auto-Track',
                description: 'Target acquisition camera with deep-learning centroid tracking locks onto vehicles and assets while the UAV maintains stealth loiter orbit.',
            },
            {
                key: 'crypto',
                title: 'Encrypted Communication',
                metric: 'COFDM Anti-Jamming Mesh Radio',
                description: 'Low-probability-of-intercept (LPI) digital datalink capable of relaying signals across hills and urban concrete canyons via mesh nodes.',
            },
            {
                key: 'flir',
                title: 'Night Vision / FLIR',
                metric: '0.0001 Lux Ultra Starlight Sensor',
                description: 'Full-color twilight and starlight optical reconnaissance without requiring active infrared illuminators that could reveal UAV presence.',
            },
            {
                key: 'weather',
                title: 'All-Weather Operation',
                metric: 'IP54 Rain Sealed // -25°C De-Icing',
                description: 'Internal motor heaters and self-heating battery arrays prevent ice accumulation in sub-zero high-altitude reconnaissance missions.',
            },
            {
                key: 'endurance',
                title: 'Long Flight Endurance',
                metric: '55 Minutes Aerodynamic Gliding Patrol',
                description: 'High-aspect carbon winglets reduce drag coefficient by 18%, extending operational scouting radius up to 40 kilometers round trip.',
            },
        ],
        matchedIds: {
            drone: 'specter-apex',
            controller: 'rc-longrange-x',
            gcs: 'gcs-dual-console',
            avionics: 'datalink-micro-node',
        },
    },
    {
        id: 'border-security',
        code: 'MSN-BORDER-03',
        title: 'Border and Perimeter Security',
        subtitle: 'Automated 24/7 Geofence Sentry & Interceptor',
        tagline: 'Autonomous drone-in-a-box scheduled patrols with intelligent border tripwire alerts.',
        summary: 'Engineered for continuous border integrity, coastal monitoring, and critical facility boundaries. Dispatches automatically upon perimeter radar alert to record high-resolution video and classify intruders.',
        droneId: 'vanguard-isr',
        telemetry: {
            altitude: '1,200 M ASL',
            range: '30.0 KM SATCOM',
            endurance: '58 MIN PATROL',
            encryption: 'AES-256 + LEO',
            sensor: 'AI Perimeter Sentinel',
        },
        capabilities: [
            {
                key: 'zoom',
                title: 'Optical & Thermal Zoom',
                metric: 'Dual-Lens Panoramic + 48MP Telephoto',
                description: 'Instant wide-angle perimeter coverage coupled with high-resolution telephoto snapshot verification of border fence line anomalies.',
            },
            {
                key: 'crypto',
                title: 'Encrypted Communication',
                metric: 'Satellite LEO Telemetry Fallback',
                description: 'Seamless automatic failover from terrestrial C2 radio to Low-Earth-Orbit satellite datalink for uninterrupted control across remote desert borders.',
            },
            {
                key: 'flir',
                title: 'Night Vision / FLIR',
                metric: 'Continuous 360° Thermal Tripwire AI',
                description: 'Automated border intrusion detection algorithms distinguish humans and vehicles from wildlife with 99.4% classification accuracy.',
            },
            {
                key: 'weather',
                title: 'All-Weather Operation',
                metric: 'MIL-STD-810H Desert & Sand Tested',
                description: 'Hermetically sealed brushless motor bearings and hydrophobic lens coatings resist blowing sand, torrential rain, and maritime salt spray.',
            },
            {
                key: 'endurance',
                title: 'Long Flight Endurance',
                metric: 'Continuous Relay via Docking Stations',
                description: 'Interlocks with automated weather-sealed landing pads for autonomous battery swap in 90 seconds, maintaining unbroken aerial presence.',
            },
        ],
        matchedIds: {
            drone: 'vanguard-isr',
            controller: 'rc-swarm-nexus',
            gcs: 'gcs-mobile-vehicle',
            avionics: 'telemetry-satlink-leo',
        },
    },
    {
        id: 'search-rescue',
        code: 'MSN-SAR-04',
        title: 'Search and Rescue',
        subtitle: 'High-Altitude Humanitarian Lifeline & Survivor Spotting',
        tagline: 'Thermal human body heat isolation and rapid delivery of emergency medical payloads.',
        summary: 'Designed for humanitarian emergency services, mountain rescue, and disaster relief. Features 12,000-lumen dual searchlights, thermal survivor detection, and a remote-controlled lifeline release winch.',
        droneId: 'stratos-sar',
        telemetry: {
            altitude: '3,800 M MAX CEILING',
            range: '20.0 KM RELAY',
            endurance: '50 MIN HEAVY LOAD',
            encryption: 'LOCAL EMS BRIDGE',
            sensor: 'SAR FLIR + 12K Lumens',
        },
        capabilities: [
            {
                key: 'zoom',
                title: 'Optical & Thermal Zoom',
                metric: 'Body Heat Isolation Profile (+37°C Filter)',
                description: 'Algorithmic optical isolation of human body temperature signatures against snowfields, dense forest canopies, and flooded riverbeds.',
            },
            {
                key: 'crypto',
                title: 'Encrypted Communication',
                metric: 'First-Responder Interoperable Gateway',
                description: 'Broadcasts low-latency real-time video streams to handheld radios and emergency operations command centers simultaneously.',
            },
            {
                key: 'flir',
                title: 'Night Vision / FLIR',
                metric: 'Dual Gimbal: Thermal + 12,000-Lumen Spotlight',
                description: 'Synchronized tracking spotlight illuminates the exact ground coordinates where thermal sensors isolate survivors for helicopter retrieval.',
            },
            {
                key: 'weather',
                title: 'All-Weather Operation',
                metric: 'Gale-Force Wind Level 8 Tolerance (18 m/s)',
                description: 'High-torque co-axial propulsion architecture maintains rock-solid hover stability in turbulent mountain canyons and coastal storms.',
            },
            {
                key: 'endurance',
                title: 'Long Flight Endurance',
                metric: '50 Min Flight with 5kg Medical Payload',
                description: 'Equipped with quick-release winch carrying automated external defibrillators (AEDs), satellite beacons, and thermal shelter blankets.',
            },
        ],
        matchedIds: {
            drone: 'stratos-sar',
            controller: 'rc-pro-tactical',
            gcs: 'gcs-field-rugged',
            avionics: 'autopilot-vector-core',
        },
    },
];
export default function DefencePage({ onOpenShowcase, }) {
    const { addToCart, wishlist, toggleWishlist } = useShop();
    // Selected Interactive Mission State (starts closed until clicked, satisfying the user's rule)
    const [selectedMissionId, setSelectedMissionId] = useState(null);
    const [selectedCapabilityKey, setSelectedCapabilityKey] = useState('zoom');
    // Interactive Sensor Simulator State (click triggered)
    const [thermalViewActive, setThermalViewActive] = useState(false);
    // Subcategory Filtering State
    const [selectedSubCat, setSelectedSubCat] = useState('All Defence Systems');
    // Quote RFP Modal State
    const [quoteProduct, setQuoteProduct] = useState(null);
    const activeMission = DEFENCE_MISSIONS.find((m) => m.id === selectedMissionId);
    const activeMissionDrone = activeMission
        ? PRODUCTS.find((p) => p.id === activeMission.droneId)
        : null;
    const defenceProducts = PRODUCTS.filter((p) => p.category === 'defence');
    const filteredProducts = selectedSubCat === 'All Defence Systems'
        ? defenceProducts
        : defenceProducts.filter((p) => p.subCategory === selectedSubCat);
    const handleSelectMission = (id) => {
        setSelectedMissionId(id);
        setSelectedCapabilityKey('zoom');
        // Smooth scroll down to mission simulator if needed
        const el = document.getElementById('mission-experience-panel');
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };
    const handleCloseMission = () => {
        setSelectedMissionId(null);
    };
    return (<div className="bg-black text-white min-h-screen">
      {/* ========================================================
            1. CINEMATIC DEFENCE HERO HEADER & STATS
            ======================================================== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-28 pb-16 px-5 sm:px-8 border-b border-cyan-500/20">
        {/* Banner Imagery & Dark Gradients */}
        <div className="absolute inset-0 -z-10">
          <img src={DEFENCE_BANNER} alt="ZIPI Defence Aircraft Platform" className="h-full w-full object-cover object-center opacity-30 filter brightness-75 contrast-125"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black"/>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.14)_0,transparent_70%)]"/>
        </div>

        {/* Tactical Crosshair Background Watermark */}
        <div className="pointer-events-none absolute right-12 top-28 opacity-10 hidden lg:block">
          <Crosshair className="h-72 w-72 text-cyan-400 stroke-[0.5]"/>
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-cyan-300 backdrop-blur">
            <Shield className="h-3.5 w-3.5 text-cyan-400"/>
            <span>LAWFUL TACTICAL ISR &amp; PERIMETER SURVEILLANCE</span>
          </div>

          <h1 className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white">
            PRECISION IN THE AIR.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-200">
              CONFIDENCE ON THE GROUND.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            ZIPI Defence delivers high-endurance, non-weaponized aerial systems designed strictly for tactical surveillance, border observation, infrastructure protection, and high-altitude humanitarian rescue.
          </p>

          {/* Verification Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 rounded-md border border-cyan-500/20 bg-white/5 px-3 py-1.5">
              <Lock className="h-3.5 w-3.5 text-cyan-400"/>
              AES-256 ENCRYPTED C2
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-cyan-500/20 bg-white/5 px-3 py-1.5">
              <Radar className="h-3.5 w-3.5 text-cyan-400"/>
              NON-WEAPONIZED ISR ONLY
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-cyan-500/20 bg-white/5 px-3 py-1.5">
              <Radio className="h-3.5 w-3.5 text-cyan-400"/>
              ANTI-JAMMING FREQ HOP
            </span>
          </div>

          {/* Interactive Trigger CTA - Guides visitor to select a mission */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => handleSelectMission('surveillance')} className="group inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all hover:bg-cyan-300 hover:scale-105">
              <Radar className="h-4 w-4"/>
              <span>Launch Mission Experience</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
            </button>
            <a href="#catalogue-section" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition">
              Browse Complete Hardware
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
            2. INTERACTIVE MISSION CARDS (CLICK TO ACTIVATE)
            "The animations must start when the visitor clicks or selects a section, card, mission or feature."
            ======================================================== */}
      <section id="missions-section" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-500/20 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"/>
              <span>TACTICAL MISSION PROFILES</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
              Select a Mission to Initialize Interactive Simulation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Click any mission card to trigger live UAV telemetry, capability matrices, and matched hardware packages.
          </p>
        </div>

        {/* 4 Clickable Mission Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DEFENCE_MISSIONS.map((mission) => {
            const isSelected = selectedMissionId === mission.id;
            return (<button key={mission.id} onClick={() => handleSelectMission(mission.id)} className={`group relative flex flex-col justify-between rounded-2xl p-6 text-left transition-all duration-300 border ${isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_35px_rgba(0,229,255,0.3)] ring-1 ring-cyan-400'
                    : 'border-white/10 bg-neutral-950 hover:border-cyan-500/50 hover:bg-neutral-900/80 hover:shadow-lg'}`}>
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 mb-4">
                    <span className="text-cyan-400 font-bold">{mission.code}</span>
                    <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">
                      {mission.telemetry.endurance}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mission.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {mission.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs">
                  <span className="text-[11px] text-cyan-400/90 flex items-center gap-1.5">
                    <Radar className="h-3.5 w-3.5"/>
                    {isSelected ? 'ACTIVE MISSION' : 'CLICK TO SIMULATE'}
                  </span>
                  <ArrowRight className={`h-4 w-4 text-cyan-400 transition-transform duration-300 ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`}/>
                </div>
              </button>);
        })}
        </div>

        {/* ========================================================
            3. DEDICATED EXPANDED MISSION EXPERIENCE
            (Revealed smoothly only upon clicking a mission card)
            ======================================================== */}
        <div id="mission-experience-panel">
          <AnimatePresence mode="wait">
            {activeMission && activeMissionDrone && (<motion.div key={activeMission.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mt-12 overflow-hidden rounded-3xl border border-cyan-400/40 bg-neutral-950 shadow-[0_0_60px_rgba(0,229,255,0.18)]">
                {/* Mission Command Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-cyan-500/20 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                      <span className="rounded-full bg-cyan-400 px-3 py-1 font-bold text-black uppercase tracking-wider">
                        MISSION ENGAGED
                      </span>
                      <span className="text-cyan-400 font-bold">{activeMission.code}</span>
                      <span className="text-zinc-500">{'//'}</span>
                      <span className="text-zinc-400">{activeMission.subtitle}</span>
                    </div>

                    {/* Cinematic Text Heading Reveal */}
                    <motion.h3 initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-white">
                      {activeMission.title}
                    </motion.h3>
                    <p className="mt-2 text-sm text-cyan-300/80 font-mono">
                      {activeMission.tagline}
                    </p>
                  </div>

                  {/* Return to Overview Button */}
                  <div className="flex items-center gap-3">
                    <button onClick={handleCloseMission} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:bg-white/10 hover:text-white transition">
                      <X className="h-4 w-4 text-cyan-400"/>
                      <span>Close Mission View</span>
                    </button>
                  </div>
                </div>

                {/* Main Mission Simulator Body */}
                <div className="p-6 sm:p-10 space-y-10">
                  {/* Visual + Radar + Telemetry Section */}
                  <div className="grid gap-8 lg:grid-cols-12 items-center">
                    {/* Left 7 cols: Large UAV Render with HUD Overlay & Radar Sweep */}
                    <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-black p-6 sm:p-8">
                      {/* Subtle Radar Scanning Rings & Sweep Beam */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                        {/* Concentric Range Rings */}
                        <div className="absolute h-96 w-96 rounded-full border border-cyan-500/15"/>
                        <div className="absolute h-64 w-64 rounded-full border border-cyan-500/20"/>
                        <div className="absolute h-36 w-36 rounded-full border border-cyan-500/25"/>
                        {/* Rotating Radar Sweep Gradient */}
                        <div className="absolute h-96 w-96 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(0,229,255,0.18)_360deg)] animate-spin [animation-duration:6s]"/>
                      </div>

                      {/* Tactical HUD Header */}
                      <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-cyan-400 pb-4 border-b border-white/10">
                        <span className="flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-cyan-400 animate-pulse"/>
                          BEARING: 042° NE // AZIMUTH: +12.4°
                        </span>
                        <span className="text-zinc-400">
                          {activeMission.telemetry.encryption}
                        </span>
                      </div>

                      {/* Large UAV Drone Visual (Animates smoothly into view upon click) */}
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 my-6 flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
                        <DroneRender product={activeMissionDrone} className="w-full max-h-[300px] object-contain drop-shadow-[0_20px_40px_rgba(0,229,255,0.25)]"/>
                      </motion.div>

                      {/* Targeting-Free HUD Lower Readout */}
                      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/10 font-mono text-[10px]">
                        <div className="rounded bg-white/5 p-2">
                          <span className="text-zinc-500 block uppercase">Altitude (ASL)</span>
                          <span className="text-white font-bold text-xs">{activeMission.telemetry.altitude}</span>
                        </div>
                        <div className="rounded bg-white/5 p-2">
                          <span className="text-zinc-500 block uppercase">LOS Range</span>
                          <span className="text-white font-bold text-xs">{activeMission.telemetry.range}</span>
                        </div>
                        <div className="rounded bg-white/5 p-2">
                          <span className="text-zinc-500 block uppercase">Loiter Cap</span>
                          <span className="text-cyan-400 font-bold text-xs">{activeMission.telemetry.endurance}</span>
                        </div>
                        <div className="rounded bg-white/5 p-2">
                          <span className="text-zinc-500 block uppercase">Sensor Suite</span>
                          <span className="text-white font-bold text-xs">{activeMission.telemetry.sensor}</span>
                        </div>
                      </div>

                      <div className="mt-3 text-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                          NON-WEAPONIZED ISR // STRICTLY LAWFUL PERIMETER &amp; SAR MONITORING
                        </span>
                      </div>
                    </div>

                    {/* Right 5 cols: Mission Description & Tactical Objectives */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                      <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 block mb-2">
                          TACTICAL MISSION OBJECTIVE
                        </span>
                        <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                          {activeMission.summary}
                        </p>

                        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs font-mono">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Target Classification:</span>
                            <span className="text-white">AI Centroid Multi-Class</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Link Latency:</span>
                            <span className="text-cyan-400">&lt; 35ms Low-LOS</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Acoustic Profile:</span>
                            <span className="text-white">&lt; 58 dBA @ 100m</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Buttons for the active UAV Drone */}
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                            Primary Aerial Platform
                          </span>
                          <h4 className="font-display text-lg font-bold text-white">
                            {activeMissionDrone.name}
                          </h4>
                          <span className="font-mono text-sm text-cyan-400 font-bold">
                            {activeMissionDrone.isQuoteRequired
                ? 'Request Formal Quote'
                : formatPrice(activeMissionDrone.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button onClick={() => onOpenShowcase(activeMissionDrone.id)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan-400/60 bg-cyan-950/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition">
                            <Sparkles className="h-3.5 w-3.5"/>
                            Showcase
                          </button>
                          {activeMissionDrone.isQuoteRequired ? (<button onClick={() => setQuoteProduct(activeMissionDrone)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition">
                              <FileText className="h-3.5 w-3.5"/>
                              Quote
                            </button>) : (<button onClick={() => addToCart(activeMissionDrone.id, activeMissionDrone.colors[0]?.name || 'Standard')} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition">
                              <ShoppingBag className="h-3.5 w-3.5"/>
                              Add
                            </button>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                5 KEY UAV CAPABILITIES REQUIRED FOR THIS MISSION
                * Optical and thermal zoom
                * Encrypted communication
                * Night vision / FLIR
                * All-weather operation
                * Long flight endurance
                ======================================================== */}
                  <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                          KEY UAV CAPABILITIES REQUIRED FOR THIS MISSION
                        </span>
                        <h4 className="text-2xl font-display font-bold text-white mt-1">
                          Mission-Critical Aerospace Systems
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">
                        Click capability to inspect real-time specs
                      </span>
                    </div>

                    {/* Interactive Capability Selector Tabs */}
                    <div className="grid gap-3 sm:grid-cols-5">
                      {activeMission.capabilities.map((cap) => {
                const isCapActive = selectedCapabilityKey === cap.key;
                return (<button key={cap.key} onClick={() => setSelectedCapabilityKey(cap.key)} className={`rounded-xl p-4 text-left transition-all border ${isCapActive
                        ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_20px_rgba(0,229,255,0.25)]'
                        : 'border-white/10 bg-neutral-900/60 hover:border-white/20 hover:bg-neutral-900'}`}>
                            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                              {cap.key === 'zoom' && 'OPTICAL / IR'}
                              {cap.key === 'crypto' && 'ENCRYPTION'}
                              {cap.key === 'flir' && 'NIGHT / FLIR'}
                              {cap.key === 'weather' && 'WEATHER'}
                              {cap.key === 'endurance' && 'ENDURANCE'}
                            </span>
                            <p className="font-display text-sm font-bold text-white line-clamp-1">
                              {cap.title}
                            </p>
                            <div className="mt-2 text-[11px] font-mono text-cyan-400 line-clamp-1 font-semibold">
                              {cap.metric}
                            </div>
                          </button>);
            })}
                    </div>

                    {/* Active Capability Deep-Dive Explanation Panel */}
                    {(() => {
                const activeCap = activeMission.capabilities.find((c) => c.key === selectedCapabilityKey);
                if (!activeCap)
                    return null;
                return (<motion.div key={activeCap.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-cyan-500/20 bg-neutral-900/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-cyan-400"/>
                              <h5 className="font-display text-base font-bold text-white">
                                {activeCap.title} — {activeCap.metric}
                              </h5>
                            </div>
                            <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                              {activeCap.description}
                            </p>
                          </div>
                          <span className="self-start md:self-auto rounded-md border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 font-mono text-xs text-cyan-300 whitespace-nowrap">
                            FLIGHT-TESTED SPECIFICATION
                          </span>
                        </motion.div>);
            })()}
                  </div>

                  {/* ========================================================
                MATCHED PRODUCTS FROM CATALOGUE:
                * Appropriate UAV Drone
                * Matching Remote Controller
                * Matching Ground Control Station
                * Recommended Datalink or Avionics Equipment
                ======================================================== */}
                  <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                          COMPLETE INTEGRATED HARDWARE SUITE
                        </span>
                        <h4 className="text-2xl font-display font-bold text-white mt-1">
                          Matched Systems for {activeMission.title}
                        </h4>
                      </div>
                      <p className="text-xs font-mono text-zinc-400">
                        Plug-and-play interoperable avionics, controllers &amp; ground stations
                      </p>
                    </div>

                    {/* Grid of 4 Matched Hardware Components */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                { role: 'UAV DRONE', id: activeMission.matchedIds.drone },
                { role: 'REMOTE CONTROLLER', id: activeMission.matchedIds.controller },
                { role: 'GROUND CONTROL STATION', id: activeMission.matchedIds.gcs },
                { role: 'DATALINK / AVIONICS', id: activeMission.matchedIds.avionics },
            ].map(({ role, id }) => {
                const product = PRODUCTS.find((p) => p.id === id);
                if (!product)
                    return null;
                const isSaved = wishlist.includes(product.id);
                return (<div key={product.id} className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/60 p-5 transition-all duration-300 hover:border-cyan-400/60 hover:bg-neutral-900">
                            <div>
                              {/* Top Bar: Role & Wishlist */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                                  {role}
                                </span>
                                <button onClick={() => toggleWishlist(product.id)} className={`rounded-full p-1.5 border transition ${isSaved
                        ? 'border-red-500/50 bg-red-500/10 text-red-400'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-red-400'}`} aria-label="Save to Wishlist">
                                  <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`}/>
                                </button>
                              </div>

                              {/* Product Visual */}
                              <div onClick={() => onOpenShowcase(product.id)} className="relative aspect-[16/11] overflow-hidden rounded-xl bg-black/60 p-3 flex items-center justify-center cursor-pointer border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                <DroneRender product={product} className="max-h-28 w-full object-contain"/>
                                <span className="absolute bottom-2 right-2 rounded border border-white/20 bg-black/80 px-2 py-0.5 text-[9px] font-mono text-cyan-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                  Showcase
                                </span>
                              </div>

                              {/* Product Info */}
                              <h5 onClick={() => onOpenShowcase(product.id)} className="mt-3 font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1">
                                {product.name}
                              </h5>
                              <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>

                              {/* Spec Snapshot */}
                              <div className="mt-3 rounded bg-white/5 p-2 font-mono text-[10px] text-zinc-300">
                                {product.specs.range && (<div>
                                    <span className="text-zinc-500 uppercase">Range: </span>
                                    {product.specs.range}
                                  </div>)}
                                {product.specs.display && (<div>
                                    <span className="text-zinc-500 uppercase">Display: </span>
                                    {product.specs.display}
                                  </div>)}
                                {product.specs.screenSize && (<div>
                                    <span className="text-zinc-500 uppercase">Console: </span>
                                    {product.specs.screenSize}
                                  </div>)}
                                {product.specs.dataRate && (<div>
                                    <span className="text-zinc-500 uppercase">Throughput: </span>
                                    {product.specs.dataRate}
                                  </div>)}
                              </div>
                            </div>

                            {/* Bottom Actions: Price, View Product, Add to Cart */}
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                                  Procurement
                                </span>
                                <span className="font-display text-sm font-bold text-white">
                                  {product.isQuoteRequired ? 'Quote Req.' : formatPrice(product.price)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button onClick={() => onOpenShowcase(product.id)} className="rounded-full border border-cyan-400/40 bg-cyan-950/30 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-cyan-300 hover:bg-cyan-400 hover:text-black transition">
                                  View
                                </button>
                                {product.isQuoteRequired ? (<button onClick={() => setQuoteProduct(product)} className="rounded-full bg-cyan-400 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-black hover:bg-cyan-300 transition">
                                    Quote
                                  </button>) : (<button onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')} className="rounded-full bg-white px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-black hover:bg-zinc-200 transition">
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
                    <button onClick={handleCloseMission} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/20 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition">
                      <X className="h-4 w-4"/>
                      <span>Return to Defence Overview</span>
                    </button>
                  </div>
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================
            4. INTERACTIVE TACTICAL EO/IR THERMAL VIEWER SIMULATOR
            (Click to switch sensor mode)
            ======================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-neutral-950 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                LIVE OPTICAL SENSOR SIMULATOR
              </span>
              <h3 className="text-2xl font-bold font-display text-white mt-1">
                Daylight EO Zoom vs. Radiometric FLIR Thermal
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-mono text-zinc-400">Sensor Mode:</span>
              <button onClick={() => setThermalViewActive(false)} className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition ${!thermalViewActive
            ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,229,255,0.6)]'
            : 'bg-white/10 text-white/70 hover:text-white'}`}>
                Daylight EO 4K
              </button>
              <button onClick={() => setThermalViewActive(true)} className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition ${thermalViewActive
            ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]'
            : 'bg-white/10 text-white/70 hover:text-white'}`}>
                Radiometric FLIR
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-black">
            <img src={thermalViewActive
            ? 'https://images.pexels.com/photos/6493443/pexels-photo-6493443.jpeg?auto=compress&cs=tinysrgb&w=1400'
            : 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1400'} alt="Optical Sensor View" className={`h-full w-full object-cover transition-all duration-700 ${thermalViewActive
            ? 'filter hue-rotate-[180deg] invert brightness-125 contrast-200'
            : 'filter brightness-90 contrast-110'}`}/>

            {/* Tactical HUD Overlay Over Image */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start font-mono text-xs text-cyan-400">
                <div className="bg-black/60 px-3 py-1.5 rounded border border-cyan-400/40 backdrop-blur">
                  ZOOM: 40.0x CONTINUOUS // FLIR: 640x512
                </div>
                <div className="bg-black/60 px-3 py-1.5 rounded border border-cyan-400/40 backdrop-blur text-right">
                  BEARING: 042° NE // TILT: -14.2° // ELEV: 1,420M
                </div>
              </div>

              {/* Center Target Box */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center border border-cyan-400/60 rounded">
                <Crosshair className="h-10 w-10 text-cyan-400 animate-pulse"/>
              </div>

              <div className="flex justify-between items-end font-mono text-[11px] text-zinc-300">
                <span className="bg-black/60 px-3 py-1 rounded border border-white/10">
                  {thermalViewActive
            ? 'TARGET TEMP: 37.2°C [SURVIVOR DETECTED]'
            : 'OPTICAL RESOLUTION: 3840 x 2160'}
                </span>
                <span className="bg-black/60 px-3 py-1 rounded border border-white/10 text-cyan-400">
                  AES-256 TELEMETRY LOCKED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
            5. COMPLETE DEFENCE CATALOGUE SECTION
            ======================================================== */}
      <section id="catalogue-section" className="mx-auto max-w-7xl px-5 pt-12 pb-6 sm:px-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              COMPLETE DEFENCE INVENTORY
            </span>
            <h3 className="text-3xl font-display font-extrabold text-white mt-1">
              Mission Hardware Catalogue
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredProducts.length} certified aerospace platforms
          </span>
        </div>

        {/* Subcategory Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {SUB_CATEGORIES.map((cat) => (<button key={cat} onClick={() => setSelectedSubCat(cat)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${selectedSubCat === cat
                ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,229,255,0.5)] font-bold'
                : 'border border-white/15 bg-white/5 text-zinc-300 hover:border-white/30 hover:bg-white/10'}`}>
              {cat}
            </button>))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 mt-8">
          {filteredProducts.map((product) => {
            const isSaved = wishlist.includes(product.id);
            return (<article key={product.id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-6 sm:p-8 transition-all duration-500 hover:border-cyan-400/80 hover:shadow-[0_0_40px_rgba(0,229,255,0.18)]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                      {product.subCategory}
                    </span>
                    <button onClick={() => toggleWishlist(product.id)} className={`rounded-full p-2 border transition ${isSaved
                    ? 'border-red-500/50 bg-red-500/10 text-red-400'
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-red-400'}`} aria-label="Wishlist">
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}/>
                    </button>
                  </div>

                  {/* Drone Image Render with Parallax Hover */}
                  <div onClick={() => onOpenShowcase(product.id)} className="relative my-6 aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-900/60 p-4 cursor-pointer flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                    <DroneRender product={product} className="h-full w-full max-h-56"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"/>
                    <span className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                      Click for 3D Showcase
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 onClick={() => onOpenShowcase(product.id)} className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Key Specifications Grid */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Flight Time</p>
                      <p className="font-bold text-white mt-0.5">{product.specs.flightTime || '60 min'}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Range</p>
                      <p className="font-bold text-white mt-0.5">{product.specs.range || '25 km'}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Wind Rating</p>
                      <p className="font-bold text-white mt-0.5">{product.specs.windResistance || 'Level 8'}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] uppercase text-zinc-500">Encryption</p>
                      <p className="font-bold text-cyan-400 mt-0.5">{product.specs.encryption?.split(' ')[0] || 'AES-256'}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Price, View Details, Add to Cart or Quote */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Procurement Price
                    </span>
                    <div className="font-display text-2xl font-bold text-white">
                      {product.isQuoteRequired ? (<span className="text-cyan-400 text-lg">Quote Required</span>) : (formatPrice(product.price))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => onOpenShowcase(product.id)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan-400/50 bg-cyan-950/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-black transition duration-300">
                      <Sparkles className="h-3.5 w-3.5"/>
                      View Details
                    </button>

                    {product.isQuoteRequired ? (<button onClick={() => setQuoteProduct(product)} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition active:scale-95">
                        <FileText className="h-3.5 w-3.5"/>
                        Request Quote
                      </button>) : (<button onClick={() => addToCart(product.id, product.colors[0]?.name || 'Standard')} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition active:scale-95">
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
            6. DEFENCE CONTRACTOR INQUIRY / RFP SECTION
            ======================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 border-t border-white/10">
        <div className="rounded-3xl border border-cyan-500/30 bg-neutral-950 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <Shield className="mx-auto h-12 w-12 text-cyan-400"/>
          <h3 className="mt-4 font-display text-3xl font-bold text-white">
            Custom Defense &amp; Security Fleet Integrations
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-zinc-300">
            For governmental tenders, border security integration, encrypted C2 frequencies, and rapid-response search and rescue fleets, connect directly with our aerospace engineering team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => {
            const aegis = PRODUCTS.find((p) => p.id === 'aegis-mk4');
            if (aegis)
                setQuoteProduct(aegis);
        }} className="rounded-full bg-cyan-400 px-7 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition">
              Request Tactical Dossier RFP
            </button>
            <button onClick={() => onOpenShowcase('aegis-mk4')} className="rounded-full border border-white/20 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition">
              Launch Aegis MK-IV Showcase
            </button>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      {quoteProduct && (<QuoteModal product={quoteProduct} open={Boolean(quoteProduct)} onClose={() => setQuoteProduct(null)}/>)}

      <Footer />
    </div>);
}
