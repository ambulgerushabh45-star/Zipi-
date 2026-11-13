import { useMemo } from 'react';
import { Plane, Radio, Terminal, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, Tilt } from '@/components/motion';
import { PRODUCTS } from '@/data/products';

const CATEGORY_DEFS = [
  {
    id: 'uav-drones',
    hardwareType: 'drone',
    title: 'UAV Drones',
    benefit: 'High-endurance airframes for non-weaponized ISR, rescue & precision spraying.',
    image: 'https://images.pexels.com/photos/17854251/pexels-photo-17854251.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Plane,
    link: '/products?category=uav-drones',
  },
  {
    id: 'controllers',
    hardwareType: 'controller',
    title: 'Remote Controllers',
    benefit: '2,000-nit daylight touchscreens, anti-jam RF links & multi-UAV handoffs.',
    image: 'https://images.pexels.com/photos/1034812/pexels-photo-1034812.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Radio,
    link: '/controllers',
  },
  {
    id: 'gcs',
    hardwareType: 'gcs',
    title: 'Ground Control Stations',
    benefit: 'IP67 Pelican briefcases, rugged field tablets & dual-screen command consoles.',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Terminal,
    link: '/products?category=gcs',
  },
  {
    id: 'avionics',
    hardwareType: 'avionics',
    title: 'Avionics & Datalink',
    benefit: 'AES-256 IP mesh radios, LEO telemetry nodes & triple-redundant autopilots.',
    image: 'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=1000',
    icon: Cpu,
    link: '/products?category=avionics',
  },
];

export default function ProductCategoryShowcase() {
  const countsByType = useMemo(() => {
    return PRODUCTS.reduce((acc, p) => {
      const key = p.hardwareType || 'drone';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, []);

  return (
    <section
      id="categories"
      className="relative scroll-mt-20 border-t border-white/10 bg-[#08121f] py-20 px-5 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>DRONE HARDWARE CATEGORIES</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#f1f5f9] sm:text-5xl">
              Complete UAV &amp; Control Architecture
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#94a3b8] leading-relaxed">
            Engineered as one interoperable ecosystem spanning airframes, remote controllers, ground consoles, and encrypted datalinks.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_DEFS.map((cat, idx) => {
            const IconComp = cat.icon;
            const count = countsByType[cat.hardwareType] || 0;
            const direction = idx % 2 === 0 ? 'left' : 'right';

            return (
              <Reveal key={cat.id} direction={direction} delay={idx * 0.05}>
                <Tilt className="h-full rounded-3xl">
                  <article className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 transition-colors duration-300 hover:border-cyan-400/60 hover:bg-[#112640]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/35 bg-[#050b14] text-cyan-300">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <span className="rounded-full border border-cyan-400/30 bg-[#050b14] px-3 py-1 font-mono text-[11px] font-bold text-cyan-300">
                          {count} {count === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#050b14] mb-5 border border-white/10">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          loading="lazy"
                          className="h-full w-full object-cover brightness-85 contrast-115 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2c] via-transparent to-transparent opacity-80" />
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#f1f5f9] group-hover:text-cyan-300 transition-colors">
                        {cat.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#94a3b8]">
                        {cat.benefit}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <Link
                        to={cat.link}
                        className="inline-flex min-h-[44px] items-center font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-sky-300 transition-colors"
                      >
                        Explore Category
                      </Link>
                      <span className="font-mono text-[10px] text-[#94a3b8] uppercase">
                        CERTIFIED
                      </span>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
