import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import ProductCategoryShowcase from '@/components/home/ProductCategoryShowcase';
import DefenceAgriSplit from '@/components/home/DefenceAgriSplit';
import MissionStory from '@/components/home/MissionStory';
import ProductRow from '@/components/common/ProductRow';
import TrustBrandExperience from '@/components/home/TrustBrandExperience';
import Footer from '@/components/layout/Footer';
import { Magnetic, Reveal } from '@/components/motion';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function HomePage({ onOpenShowcase }) {
  useDocumentTitle('Home');

  return (
    <main className="bg-[#050b14] text-[#f1f5f9] min-h-screen">
      {/* 1. Full-screen Mission Control Hero */}
      <Hero onOpenShowcase={onOpenShowcase} />

      {/* 2. Alternating Category Cards with real counts */}
      <ProductCategoryShowcase />

      {/* 3. Defence vs Agriculture Interactive Split */}
      <DefenceAgriSplit onOpenShowcase={onOpenShowcase} />

      {/* 4. Pinned Scroll Story: Plan -> Fly -> Capture -> Deliver */}
      <MissionStory />

      {/* 5. Featured Systems Drag Carousel */}
      <ProductRow
        id="featured"
        eyebrow="Certified Airborne &amp; Control Systems"
        title="Deployed in Mission-Critical Airspace."
        description="Explore flagship unmanned aerial platforms and controllers engineered for non-weaponized ISR observation and precision agriculture."
        productIds={[
          'aegis-mk4',
          'terra-spray-x40',
          'rc-pro-tactical',
          'recon-raven',
          'agriscan-ndvi',
          'gcs-portable-briefcase',
        ]}
      />

      {/* 6. Real Catalog Stat Counters + Marquee Trust Strip */}
      <TrustBrandExperience />

      {/* 7. Closing CTA Band */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal direction="up">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#0b1a2c] via-[#08121f] to-[#050b14] p-8 sm:p-12 text-center shadow-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
              READY FOR DEPLOYMENT
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              Configure Your Drone &amp; Control Fleet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-[#94a3b8]">
              Compare remote controllers, inspect 3D hardware blueprints, or initiate a direct order, dealer application, or enterprise RFP with our supervisors.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <Link to="/contact" className="btn-mission-primary min-h-[48px]">
                  <span>Talk to Our Team</span>
                </Link>
              </Magnetic>
              <Link to="/controllers" className="btn-mission-ghost min-h-[48px]">
                <span>Open Controller Finder</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
