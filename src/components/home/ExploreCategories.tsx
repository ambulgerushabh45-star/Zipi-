import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_LABELS, PRODUCTS, getProduct, type Category } from '@/data/products';
import SectionHeading from '@/components/common/SectionHeading';

const CATEGORY_IMAGE_SOURCE: Partial<Record<Category, string>> = {
  'uav-drones': 'aegis-mk4',
  controllers: 'rc-pro-tactical',
  gcs: 'gcs-portable-briefcase',
  avionics: 'datalink-air-mesh',
  defence: 'aegis-mk4',
  agriculture: 'terra-spray-x40',
  commercial: 'apex-pro',
  camera: 'horizon-ultra',
  mini: 'nano-mini',
  fpv: 'storm-fpv',
  beginner: 'nano-mini',
  accessories: 'power-hub',
};

const CATEGORY_TAGLINE: Partial<Record<Category, string>> = {
  'uav-drones': 'Tactical defence, precision farming & industrial inspection aircraft',
  controllers: 'Handheld, long-range COFDM, touchscreen & multi-drone swarm commanders',
  gcs: 'Rugged Pelican briefcases, dual-monitor consoles & vehicle command stations',
  avionics: 'Encrypted IP radios, micro datalinks, LEO satellite hubs & autopilots',
  defence: 'Tactical ISR, perimeter security & search and rescue',
  agriculture: 'Heavy-payload 40L sprayers & multispectral NDVI mapping',
  commercial: 'Industrial infrastructure audits & cinema-grade platforms',
  camera: 'Stabilized 4K and 48MP imaging in the sky',
  mini: 'Sub-250 g ultralights for effortless everyday flight',
  fpv: 'Immersive low-latency digital racing quadcopters',
  beginner: 'Guided telemetry, optical flow & safe training',
  accessories: 'Smart chargers, high-efficiency blades & battery hubs',
};

const CATEGORY_ORDER: Category[] = [
  'uav-drones',
  'controllers',
  'gcs',
  'avionics',
  'defence',
  'agriculture',
];

export default function ExploreCategories({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      {showHeading && (
        <SectionHeading
          eyebrow="Hardware Architecture"
          title={
            <>
              Engineered for <span className="text-cyan-400">Critical Missions.</span>
            </>
          }
          description="From sovereign tactical security to rugged GCS consoles and encrypted datalinks, discover the complete unmanned ecosystem built for your operation."
        />
      )}
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? 'mt-14' : ''}`}>
        {CATEGORY_ORDER.map((category, i) => {
          const sourceId = CATEGORY_IMAGE_SOURCE[category] || 'aegis-mk4';
          const source = getProduct(sourceId) || PRODUCTS[0];
          const count = PRODUCTS.filter((p) => {
            if (category === 'uav-drones') return p.hardwareType === 'drone';
            if (category === 'controllers') return p.hardwareType === 'controller';
            if (category === 'gcs') return p.hardwareType === 'gcs';
            if (category === 'avionics') return p.hardwareType === 'avionics';
            return p.category === category || p.missionTag === category;
          }).length;

          const targetUrl =
            category === 'defence'
              ? '/defence'
              : category === 'agriculture'
              ? '/agriculture'
              : `/products?category=${category}`;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                to={targetUrl}
                className="group relative flex h-[340px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-7 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
              >
                {/* Background image */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <img
                    src={source.image}
                    alt={CATEGORY_LABELS[category] || category}
                    className="h-full w-full object-cover filter brightness-50 contrast-125 transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-400 backdrop-blur">
                    {count} {count === 1 ? 'System' : 'Systems'}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-black">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div>
                  <h3 className="font-display text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                    {CATEGORY_LABELS[category] || category}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-300 font-light line-clamp-2">
                    {CATEGORY_TAGLINE[category]}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
