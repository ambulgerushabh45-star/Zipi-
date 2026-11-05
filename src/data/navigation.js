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
    menu: {
      eyebrow: 'Direct Hardware Procurement',
      title: 'Aerospace E-Commerce Store',
      links: [
        {
          label: 'All Products',
          to: '/products',
          tagline: 'Explore our full certified inventory of UAVs, controllers & ground systems',
          badge: 'Catalogue',
        },
        {
          label: 'New Arrivals',
          to: '/products?filter=new',
          tagline: 'Latest next-generation autonomous airframes, tactical C2 & datalinks',
          badge: 'Latest',
        },
        {
          label: 'Featured Products',
          to: '/products?filter=featured',
          tagline: 'Flagship combat-proven defence systems and precision agricultural sprayers',
          badge: 'Flagship',
        },
      ],
      promo: {
        eyebrow: 'Fast Global Dispatch',
        headline: 'Mission-Ready Hardware. Certified Quality & Worldwide Deployment.',
        image: 'https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Tactical remote controller console ready for mission deployment',
        to: '/products',
        cta: 'Browse All Hardware',
      },
    },
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
    menu: {
      eyebrow: '24/7 Mission Readiness',
      title: 'Engineering & Client Operations',
      links: [
        {
          label: 'Contact Us',
          to: '/contact',
          tagline: 'Connect directly with our aerospace engineers and commercial sales specialists',
          badge: 'Direct Line',
        },
        {
          label: 'FAQs',
          to: '/contact#faq',
          tagline: 'Procurement compliance, export regulations, warranty & delivery timelines',
          badge: 'Knowledge',
        },
        {
          label: 'Technical Support',
          to: '/contact#support',
          tagline: 'Emergency field support, telemetry diagnostics & firmware maintenance',
          badge: '24/7 Operations',
        },
      ],
      promo: {
        eyebrow: 'Operations Center',
        headline: 'Dedicated Aerospace Support Team Standing By Around the Clock.',
        image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Mission control center monitoring drone telemetry',
        to: '/contact',
        cta: 'Contact Engineering Support',
      },
    },
  },
];
