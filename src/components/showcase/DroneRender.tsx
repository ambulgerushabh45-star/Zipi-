import React from 'react';
import type { Product } from '@/data/products';

type DroneRenderProps = {
  product: Product;
  selectedColor?: string;
  className?: string;
  viewMode?: 'tactical' | 'photo';
};

// Map each drone product to its dedicated realistic transparent asset
const PRODUCT_DRONE_ASSETS: Record<string, { image: string; glow: string }> = {
  'aegis-mk4': {
    image: '/images/drones/hero-flagship.png',
    glow: 'rgba(0, 229, 255, 0.45)',
  },
  'recon-raven': {
    image: '/images/drones/mavic-tactical.png',
    glow: 'rgba(0, 229, 255, 0.35)',
  },
  'guardian-sentry': {
    image: '/images/drones/heavy-hex.png',
    glow: 'rgba(0, 229, 255, 0.35)',
  },
  'valkyrie-sar': {
    image: '/images/drones/phantom-white.png',
    glow: 'rgba(255, 170, 0, 0.35)',
  },
  'terra-spray-x40': {
    image: '/images/drones/heavy-hex.png',
    glow: 'rgba(16, 185, 129, 0.45)',
  },
  'agriscan-ndvi': {
    image: '/images/drones/aero-mapping.png',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  'fieldmapper-aero': {
    image: '/images/drones/aero-mapping.png',
    glow: 'rgba(0, 229, 255, 0.35)',
  },
  'cropguard-harvest': {
    image: '/images/drones/heavy-hex.png',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  'apex-pro': {
    image: '/images/drones/hero-flagship.png',
    glow: 'rgba(0, 229, 255, 0.4)',
  },
  'horizon-ultra': {
    image: '/images/drones/phantom-white.png',
    glow: 'rgba(0, 229, 255, 0.35)',
  },
  'vista-4k': {
    image: '/images/drones/mavic-tactical.png',
    glow: 'rgba(0, 229, 255, 0.3)',
  },
  'nano-mini': {
    image: '/images/drones/crop0_full.png',
    glow: 'rgba(0, 229, 255, 0.3)',
  },
  'storm-fpv': {
    image: '/images/drones/drone_4.png',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
};

export default function DroneRender({
  product,
  selectedColor,
  className = '',
  viewMode = 'tactical',
}: DroneRenderProps) {
  // If user switched to field photo view or if it's GCS/Controller/Avionics
  const isNonDrone = product.hardwareType && product.hardwareType !== 'drone';

  if (viewMode === 'photo' || isNonDrone) {
    return (
      <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
        {/* Subtle Cybernetic Radar Background Ring */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
          <div className="h-64 w-64 sm:h-80 sm:w-80 rounded-full border border-cyan-500/20 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-400">
              000°
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[9px] font-mono text-cyan-400">
              180°
            </div>
          </div>
          <div className="absolute h-48 w-48 sm:h-60 sm:w-60 rounded-full border border-dashed border-cyan-500/25" />
        </div>

        {/* Product Image */}
        <div className="relative flex items-center justify-center w-full max-h-[52vh]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[44vh] sm:max-h-[48vh] w-auto max-w-[90%] rounded-2xl object-contain filter drop-shadow-[0_20px_45px_rgba(0,229,255,0.35)] transition-transform duration-700 hover:scale-105"
          />

          {/* Hardware Class Badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-cyan-500/40 bg-black/85 px-4 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-300 backdrop-blur whitespace-nowrap">
            {product.hardwareType === 'controller'
              ? 'Tactical C2 Remote Controller'
              : product.hardwareType === 'gcs'
              ? 'Ground Control Station Console'
              : product.hardwareType === 'avionics'
              ? 'Avionics & Telemetry Datalink'
              : 'Field Operational Unit'}
          </div>
        </div>

        {/* Specular Ground Reflection Glow */}
        <div className="pointer-events-none -mt-4 h-6 w-3/5 rounded-full bg-cyan-500/20 blur-xl" />
      </div>
    );
  }

  // Tactical Transparent 3D Drone Render
  const asset = PRODUCT_DRONE_ASSETS[product.id] || {
    image: product.image.includes('.png') ? product.image : '/images/drones/hero-flagship.png',
    glow: product.category === 'agriculture' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(0, 229, 255, 0.4)',
  };

  const isDefence = product.category === 'defence' || product.missionTag === 'defence';
  const isAgri = product.category === 'agriculture' || product.missionTag === 'agriculture';

  const rimFilter = isAgri
    ? 'drop-shadow-[0_20px_50px_rgba(16,185,129,0.35)] drop-shadow-[0_0_20px_rgba(16,185,129,0.25)]'
    : 'drop-shadow-[0_25px_60px_rgba(0,229,255,0.4)] drop-shadow-[0_0_20px_rgba(0,229,255,0.25)]';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Tactical Radar Scope Background Ring */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-64 w-64 sm:h-80 sm:w-80 rounded-full border border-white/10 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-400">
            000°
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[9px] font-mono text-cyan-400">
            180°
          </div>
        </div>
        <div className="absolute h-48 w-48 sm:h-60 sm:w-60 rounded-full border border-dashed border-cyan-500/20" />
      </div>

      {/* Realistic Transparent Drone Image */}
      <div className="relative flex items-center justify-center w-full max-h-[54vh]">
        <img
          src={asset.image}
          alt={product.name}
          className={`max-h-[46vh] sm:max-h-[52vh] w-auto max-w-[85%] object-contain filter ${rimFilter} transition-all duration-500`}
        />

        {/* Selected color swatch indicator pill */}
        {selectedColor && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/20 bg-neutral-950/80 px-3 py-1 text-[10px] font-mono text-white/80 backdrop-blur">
            <span
              className="h-2 w-2 rounded-full border border-white/40"
              style={{ backgroundColor: selectedColor }}
            />
            <span>FINISH: {product.colors.find((c) => c.hex === selectedColor)?.name || 'Custom'}</span>
          </div>
        )}
      </div>

      {/* Specular Ground Reflection & Drop Shadow */}
      <div
        className="pointer-events-none -mt-4 sm:-mt-6 h-6 w-3/5 rounded-full blur-xl opacity-60 transition-colors duration-700"
        style={{ backgroundColor: asset.glow }}
      />
      <div className="pointer-events-none -mt-3 h-3 w-2/5 rounded-full bg-black/80 blur-md" />

      {/* Subsystem Telemetry Badge */}
      <div className="mt-4 flex items-center gap-3 font-mono text-[10px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {isDefence ? 'DEFENCE ISR' : isAgri ? 'PRECISION AGRI' : 'AEROSPACE FLEET'}
        </span>
        <span>//</span>
        <span>ID: {product.id.toUpperCase()}</span>
        <span>//</span>
        <span>PAYLOAD: {product.specs.payloadCapacity || product.specs.weight || 'Integrated'}</span>
      </div>
    </div>
  );
}
