import { motion } from 'framer-motion';
import { ArrowRight, Plane, Radio, Terminal, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 'uav-drones',
    title: 'UAV Drones',
    tagline: 'High-Endurance Aerial Airframes',
    description:
      'Purpose-built platforms for tactical surveillance, autonomous crop protection, and sub-centimeter topographical surveying.',
    image: 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Plane,
    link: '/products?category=uav-drones',
    stats: '65+ MIN FLIGHT TIME',
    badge: 'Flagship Fleet',
  },
  {
    id: 'controllers',
    title: 'UAV Remote Controllers',
    tagline: 'Professional Precision Command',
    description:
      'Ultra-bright 2,000-nit sunlight-readable touchscreens, dual-frequency anti-jamming RF links, and multi-drone swarm management.',
    image: 'https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Radio,
    link: '/products?category=controllers',
    stats: '15 KM RANGE // 2000 NITS',
    badge: 'C2 Controllers',
  },
  {
    id: 'gcs',
    title: 'Ground Control Stations',
    tagline: 'Tactical Mission Command Consoles',
    description:
      'Waterproof Pelican briefcases, dual-screen operations desks, and IP67 field tablets engineered for extreme environments.',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Terminal,
    link: '/products?category=gcs',
    stats: 'IP67 RATED // DUAL 4K',
    badge: 'Command Stations',
  },
  {
    id: 'avionics',
    title: 'Avionics & Datalink Intelligence',
    tagline: 'Encrypted C2 & Telemetry Links',
    description:
      'Tactical IP mesh radios, micro-datalink modules, triple-redundant autopilots, and LEO satellite communications.',
    image: 'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Cpu,
    link: '/products?category=avionics',
    stats: 'AES-256 // < 12MS LATENCY',
    badge: 'Avionics Suite',
  },
];

export default function ProductCategoryShowcase() {
  return (
    <section id="categories" className="relative scroll-mt-20 bg-[#07111F] py-20 px-5 sm:px-8 border-t border-[#101B2A]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#101B2A] pb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#00C8FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
              <span>AEROSPACE HARDWARE CATEGORIES</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#F5F8FC] sm:text-5xl">
              Complete UAV Hardware Architecture
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#AAB7C7] leading-relaxed">
            Engineered as an interoperable aerospace ecosystem. Explore airframes, control consoles, ground stations, and avionics.
          </p>
        </div>

        {/* 4 Premium Category Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const IconComp = cat.icon;
            return (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#101B2A] bg-[#101B2A]/60 p-6 transition-all duration-500 hover:border-[#00C8FF]/70 hover:bg-[#101B2A] hover:shadow-[0_20px_45px_rgba(0,200,255,0.15)] hover:-translate-y-1"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full border border-[#00C8FF]/30 bg-[#07111F]/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#00C8FF]">
                      {cat.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#AAB7C7]">
                      {cat.stats}
                    </span>
                  </div>

                  {/* Product Image Frame with Realistic Depth */}
                  <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#07111F] mb-5 border border-white/5">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover filter brightness-85 contrast-115 transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101B2A] via-transparent to-transparent opacity-80" />
                    
                    {/* Category Icon Badge */}
                    <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-xl border border-[#00C8FF]/40 bg-[#07111F]/90 text-[#00C8FF] backdrop-blur">
                      <IconComp className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display text-xl font-bold text-[#F5F8FC] group-hover:text-[#00C8FF] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-[#00C8FF]/80">
                    {cat.tagline}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-[#AAB7C7] line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                {/* Explore / Shop Now Link */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    to={cat.link}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00C8FF] group-hover:text-cyan-300 transition-colors"
                  >
                    <span>Explore Category</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <span className="text-[10px] font-mono text-[#AAB7C7] uppercase">
                    CERTIFIED
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

