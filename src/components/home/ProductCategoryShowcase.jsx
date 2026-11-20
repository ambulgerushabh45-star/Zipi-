import { useMemo } from 'react';
import { Crosshair, Radio, Terminal, Cpu } from 'lucide-react';
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
    icon: Crosshair,
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
      className="relative scroll-mt-20 border-t border-b border-[#E2E8F0] bg-[#F5F7FA] py-24 px-5 sm:px-8 text-[#080D14]"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2E8F0] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00C9E8]/40 bg-[#00C9E8]/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#0092ab]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C9E8] animate-pulse" />
              <span>CORE ARCHITECTURE // HARDWARE DIVISIONS</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[#080D14] sm:text-5xl tracking-tight">
              Integrated UAV &amp; Control Architecture
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#475569] leading-relaxed font-sans">
            Engineered as one interoperable aerospace ecosystem spanning autonomous airframes, 2,000-nit daylight controllers, mission command briefcases, and encrypted datalinks.
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
                  <article className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00C9E8] hover:shadow-[0_20px_45px_rgba(0,201,232,0.14)]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080D14] text-[#00C9E8] shadow-[0_0_14px_rgba(0,201,232,0.3)] transition-transform group-hover:scale-105">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <span className="rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-3 py-1 font-mono text-[11px] font-bold text-[#080D14]">
                          {count} {count === 1 ? 'System' : 'Systems'}
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#080D14] mb-5 border border-[#E2E8F0]">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          loading="lazy"
                          className="h-full w-full object-cover brightness-95 contrast-110 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                        <span className="absolute bottom-2.5 left-3 font-mono text-[10px] uppercase tracking-wider text-white/90 drop-shadow">
                          SYS-0{idx + 1} // ACTIVE SPEC
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#080D14] group-hover:text-[#0092ab] transition-colors">
                        {cat.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#475569] font-sans">
                        {cat.benefit}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                      <Link
                        to={cat.link}
                        className="inline-flex min-h-[44px] items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#00C9E8] transition-colors group-hover:translate-x-1 duration-200"
                      >
                        <span>Explore Division</span>
                        <span>&rarr;</span>
                      </Link>
                      <span className="font-mono text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                        AEROSPACE GRADE
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
