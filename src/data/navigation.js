export const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    to: '/',
  },
  {
    id: 'shop',
    label: 'Shop',
    to: '/products',
  },
  {
    id: 'defence',
    label: 'Defence',
    to: '/defence',
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    to: '/agriculture',
  },
  {
    id: 'products',
    label: 'Products',
    to: '/products',
    menu: {
      eyebrow: 'Aerospace Systems Catalogue',
      title: 'Complete Autonomous UAV Hardware Architecture',
      links: [
        {
          label: 'UAV Drones',
          to: '/products?category=uav-drones',
          tagline: 'High-endurance tactical defence, precision ag & commercial airframes',
          badge: 'Airborne Fleet',
        },
        {
          label: 'UAV Remote Controllers',
          to: '/products?category=controllers',
          tagline: '2,000-nit daylight screens, long-range COFDM & multi-UAV commanders',
          badge: 'C2 Control',
        },
        {
          label: 'Ground Control Stations',
          to: '/products?category=gcs',
          tagline: 'Pelican briefcases, dual-monitor consoles & IP67 rugged field command tablets',
          badge: 'Mission Command',
        },
        {
          label: 'Avionics & Datalink',
          to: '/products?category=avionics',
          tagline: 'AES-256 tactical IP mesh radios, micro-datalinks & LEO satellite telemetry',
          badge: 'Intelligence',
        },
        {
          label: 'View Complete Catalogue →',
          to: '/products',
          tagline: 'Explore all 27 certified aerospace systems and request quotes',
        },
      ],
      promo: {
        eyebrow: 'Enterprise Fleet',
        headline: 'Mission-Ready Hardware. Engineered for Critical Airspace.',
        image: 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&h=750&w=1000',
        imageAlt: 'Tactical unmanned aerial vehicle systems ready on runway',
        to: '/products',
        cta: 'Browse Hardware Fleet',
      },
    },
  },
  {
    id: 'about',
    label: 'About',
    to: '/about',
  },
  {
    id: 'support',
    label: 'Support',
    to: '/contact',
  },
];
