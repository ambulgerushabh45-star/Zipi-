export const NAV_ITEMS = [
    {
        id: 'home',
        label: 'Home',
        to: '/',
    },
    {
        id: 'defence',
        label: 'Defence',
        to: '/defence',
        menu: {
            eyebrow: 'Defence Systems',
            title: 'Tactical Airborne Security & ISR',
            links: [
                {
                    label: 'Aegis Sentinel MK-IV',
                    to: '/product/aegis-mk4',
                    tagline: 'Tactical autonomous surveillance platform',
                    badge: 'ISR Flagship',
                },
                {
                    label: 'Recon Raven V2',
                    to: '/product/recon-raven',
                    tagline: 'Ultra-silent stealth perimeter quadcopter',
                },
                {
                    label: 'Guardian Sentry-X',
                    to: '/product/guardian-sentry',
                    tagline: '24/7 autonomous perimeter security hexacopter',
                },
                {
                    label: 'Valkyrie SAR-9',
                    to: '/product/valkyrie-sar',
                    tagline: 'High-altitude search & rescue platform',
                },
                {
                    label: 'All Defence Systems →',
                    to: '/defence',
                    tagline: 'Explore tactical observation & security solutions',
                },
            ],
            promo: {
                eyebrow: 'Mission Ready',
                headline: 'Precision in the air. Confidence on the ground.',
                image: 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&h=750&w=1000',
                imageAlt: 'Tactical unmanned aerial vehicle systems ready on tarmac',
                to: '/defence',
                cta: 'Explore Defence Systems',
            },
        },
    },
    {
        id: 'agriculture',
        label: 'Agriculture',
        to: '/agriculture',
        menu: {
            eyebrow: 'Precision Agriculture',
            title: 'Smart Farming & Field Automation',
            links: [
                {
                    label: 'Terra Spray X40',
                    to: '/product/terra-spray-x40',
                    tagline: '40-Liter heavy payload precision spray drone',
                    badge: 'High-Capacity',
                },
                {
                    label: 'Agriscan NDVI Pro',
                    to: '/product/agriscan-ndvi',
                    tagline: 'Multispectral crop stress & health analysis',
                },
                {
                    label: 'FieldMapper Aero-T',
                    to: '/product/fieldmapper-aero',
                    tagline: '61MP full-frame topographical orthomosaic drone',
                },
                {
                    label: 'CropGuard Harvest-8',
                    to: '/product/cropguard-harvest',
                    tagline: 'Air-assisted orchard & steep canopy protector',
                },
                {
                    label: 'All Agriculture Solutions →',
                    to: '/agriculture',
                    tagline: 'Smarter farming and variable-rate aerial workflows',
                },
            ],
            promo: {
                eyebrow: 'Agricultural Innovation',
                headline: 'Smarter farming. Better harvests.',
                image: 'https://images.pexels.com/photos/34182367/pexels-photo-34182367.jpeg?auto=compress&cs=tinysrgb&h=750&w=1000',
                imageAlt: 'Agricultural drone actively misting crops over green field',
                to: '/agriculture',
                cta: 'Explore Agriculture Drones',
            },
        },
    },
    {
        id: 'products',
        label: 'Products',
        to: '/products',
        menu: {
            eyebrow: 'Aerospace Hardware Architecture',
            title: 'Complete UAV Systems & Mission Equipment',
            links: [
                {
                    label: 'UAV Drones',
                    to: '/products?category=uav-drones',
                    tagline: 'Tactical defence, precision agriculture & commercial aircraft',
                    badge: 'Aerial Fleet',
                },
                {
                    label: 'UAV Remote Controllers',
                    to: '/products?category=controllers',
                    tagline: 'Professional handheld, long-range COFDM & touchscreen controllers',
                    badge: 'C2 Systems',
                },
                {
                    label: 'Ground Control Stations (GCS)',
                    to: '/products?category=gcs',
                    tagline: 'Portable briefcases, dual-monitor consoles & rugged field tablets',
                    badge: 'Command',
                },
                {
                    label: 'Avionics & Datalink Intelligence',
                    to: '/products?category=avionics',
                    tagline: 'Encrypted tactical radios, micro datalinks & satellite telemetry',
                    badge: 'Avionics',
                },
                {
                    label: 'All Hardware Catalog →',
                    to: '/products',
                    tagline: 'Search, filter, compare specifications & request formal quotes',
                },
            ],
            promo: {
                eyebrow: 'Fleet Procurement',
                headline: 'Mission-Ready Hardware. Engineered for the Future.',
                image: 'https://images.pexels.com/photos/6493443/pexels-photo-6493443.jpeg?auto=compress&cs=tinysrgb&h=750&w=1000',
                imageAlt: 'Tactical UAV drone platform flying against dramatic sky',
                to: '/products',
                cta: 'Browse Full Hardware Fleet',
            },
        },
    },
    {
        id: 'accessories',
        label: 'Accessories',
        to: '/products?category=accessories',
    },
    {
        id: 'about',
        label: 'About Us',
        to: '/about',
    },
    {
        id: 'contact',
        label: 'Contact',
        to: '/contact',
    },
];
