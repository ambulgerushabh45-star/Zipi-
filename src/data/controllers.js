// Controller compatibility matrix, finder quiz scoring, hotspot callouts, and kit pairings.
// PLACEHOLDER: confirm specs — compatibility links, hotspot coordinates, and kit suggestions below are mapped for UI demo purposes; confirm with engineering before launch.

export const CONTROLLER_HOTSPOTS = {
  'rc-pro-tactical': [
    {
      id: 'antennas',
      x: 26,
      y: 22,
      title: 'Dual-Band COFDM Antennas',
      detail: 'High-gain directional array supporting AES-256 encrypted C2 telemetry up to catalog range.',
    },
    {
      id: 'screen',
      x: 50,
      y: 52,
      title: 'High-Brightness Telemetry Display',
      detail: 'Sunlight-readable tactical display for live EO/IR gimbal framing and map waypoints.',
    },
    {
      id: 'gimbals',
      x: 74,
      y: 58,
      title: 'Hall-Effect Control Sticks',
      detail: 'Precision dual-spring gimbals with programmable payload turret and zoom dials.',
    },
  ],
  'rc-longrange-x': [
    {
      id: 'uhf',
      x: 30,
      y: 20,
      title: 'Long-Range UHF/COFDM Link',
      detail: 'Extended BVLOS corridor link architecture engineered for coastal and border relays.',
    },
    {
      id: 'chassis',
      x: 52,
      y: 55,
      title: 'Weather-Sealed Field Frame',
      detail: 'Reinforced chassis designed for high-wind field operations and cold-weather grips.',
    },
    {
      id: 'switches',
      x: 72,
      y: 42,
      title: 'Dedicated Payload Switches',
      detail: 'Tactile hardware toggles for spotlight, thermal palette, and return-to-home overrides.',
    },
  ],
  'rc-touch-lumina': [
    {
      id: 'display',
      x: 50,
      y: 46,
      title: 'Daylight Agronomy Touchscreen',
      detail: 'Displays real-time field swath lines, refill alerts, and NDVI prescription overlays.',
    },
    {
      id: 'battery',
      x: 28,
      y: 66,
      title: 'Hot-Swappable Field Power',
      detail: 'All-day field battery autonomy engineered for multi-acre spraying schedules.',
    },
    {
      id: 'rtk',
      x: 74,
      y: 28,
      title: 'RTK Mission Sync Port',
      detail: 'Direct boundary sync with base stations and farm field prescriptions.',
    },
  ],
  'rc-swarm-nexus': [
    {
      id: 'console',
      x: 48,
      y: 45,
      title: 'Multi-UAV Swarm Switcher',
      detail: 'Coordinates simultaneous scout + sprayer or multi-perimeter ISR unit handoffs.',
    },
    {
      id: 'mesh',
      x: 25,
      y: 26,
      title: 'IP Mesh Telemetry Backhaul',
      detail: 'Links seamlessly into tactical IP mesh radios and Ground Control Stations.',
    },
    {
      id: 'aux',
      x: 76,
      y: 62,
      title: 'HDMI / Ethernet Telemetry Out',
      detail: 'Streams split-screen pilot & payload video feeds to command tents.',
    },
  ],
};

// PLACEHOLDER: confirm specs — mapping of which drones each controller supports.
export const CONTROLLER_COMPATIBILITY = {
  'rc-pro-tactical': [
    'aegis-mk4',
    'recon-raven',
    'guardian-sentry',
    'valkyrie-sar',
    'apex-pro',
    'horizon-ultra',
  ],
  'rc-longrange-x': [
    'aegis-mk4',
    'recon-raven',
    'guardian-sentry',
    'valkyrie-sar',
    'fieldmapper-aero',
    'apex-pro',
  ],
  'rc-touch-lumina': [
    'terra-spray-x40',
    'agriscan-ndvi',
    'fieldmapper-aero',
    'cropguard-harvest',
    'vista-4k',
  ],
  'rc-swarm-nexus': [
    'aegis-mk4',
    'guardian-sentry',
    'terra-spray-x40',
    'agriscan-ndvi',
    'fieldmapper-aero',
    'cropguard-harvest',
  ],
};

// PLACEHOLDER: confirm specs — "Complete the kit" accessory/companion pairings per controller.
export const CONTROLLER_KIT_PAIRINGS = {
  'rc-pro-tactical': ['datalink-air-mesh', 'power-hub', 'gcs-portable-briefcase'],
  'rc-longrange-x': ['telemetry-satlink-leo', 'datalink-micro-node', 'power-hub'],
  'rc-touch-lumina': ['power-hub', 'gcs-field-rugged', 'prop-guard'],
  'rc-swarm-nexus': ['gcs-dual-console', 'datalink-air-mesh', 'autopilot-vector-core'],
};

export const FINDER_QUESTIONS = [
  {
    id: 'droneFocus',
    stepTitle: 'Which drone platform or fleet class will you pilot?',
    options: [
      { id: 'isr', label: 'Defence & SAR Airframes', hint: 'Aegis MK-IV, Recon Raven, Valkyrie SAR' },
      { id: 'agri', label: 'Precision Agriculture Fleet', hint: 'Terra Spray X40, Agriscan NDVI, CropGuard' },
      { id: 'mapping', label: 'Industrial & Survey Platforms', hint: 'FieldMapper Aero-T, Apex Pro, Horizon Ultra' },
      { id: 'multi', label: 'Coordinated Multi-UAV Fleet', hint: 'Concurrent scout + patrol / spray ops' },
    ],
  },
  {
    id: 'sector',
    stepTitle: 'Which primary operational sector applies?',
    options: [
      { id: 'defence', label: 'Defence & Security (Non-Weaponized ISR)', hint: 'Encrypted C2, border & rescue observation' },
      { id: 'agriculture', label: 'Precision Agriculture', hint: 'Daylight spray planning, NDVI & RTK routing' },
      { id: 'commercial', label: 'Industrial & Commercial Audits', hint: 'Infrastructure inspection & mapping' },
    ],
  },
  {
    id: 'priority',
    stepTitle: 'What matters most in the field?',
    options: [
      { id: 'range', label: 'Maximum BVLOS Range & Link Resilience', hint: 'Long-range RF & obstacle penetration' },
      { id: 'display', label: 'Ultra-Bright Sunlight Touchscreen', hint: '2,000-nit outdoor field readability' },
      { id: 'swarm', label: 'Multi-Drone Handoff & Swarm Command', hint: 'Coordinate several UAVs from one station' },
      { id: 'tactical', label: 'Balanced Tactical Ergonomics', hint: 'Compact dual-operator handheld reliability' },
    ],
  },
];

// PLACEHOLDER: confirm specs — scoring logic for the 3-step Controller Finder quiz.
export function recommendControllers(answers) {
  const scores = {
    'rc-pro-tactical': 0,
    'rc-longrange-x': 0,
    'rc-touch-lumina': 0,
    'rc-swarm-nexus': 0,
  };

  if (answers.droneFocus === 'isr') {
    scores['rc-pro-tactical'] += 3;
    scores['rc-longrange-x'] += 2;
  } else if (answers.droneFocus === 'agri') {
    scores['rc-touch-lumina'] += 4;
    scores['rc-swarm-nexus'] += 1;
  } else if (answers.droneFocus === 'mapping') {
    scores['rc-longrange-x'] += 2;
    scores['rc-touch-lumina'] += 2;
    scores['rc-pro-tactical'] += 1;
  } else if (answers.droneFocus === 'multi') {
    scores['rc-swarm-nexus'] += 5;
  }

  if (answers.sector === 'defence') {
    scores['rc-pro-tactical'] += 2;
    scores['rc-longrange-x'] += 2;
  } else if (answers.sector === 'agriculture') {
    scores['rc-touch-lumina'] += 3;
    scores['rc-swarm-nexus'] += 1;
  } else if (answers.sector === 'commercial') {
    scores['rc-pro-tactical'] += 2;
    scores['rc-longrange-x'] += 2;
  }

  if (answers.priority === 'range') {
    scores['rc-longrange-x'] += 4;
  } else if (answers.priority === 'display') {
    scores['rc-touch-lumina'] += 4;
  } else if (answers.priority === 'swarm') {
    scores['rc-swarm-nexus'] += 5;
  } else if (answers.priority === 'tactical') {
    scores['rc-pro-tactical'] += 4;
  }

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  return {
    primaryId: ranked[0],
    runnerUpId: ranked[1],
  };
}

