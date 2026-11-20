import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import FeaturedDronesSection from '@/components/home/FeaturedDronesSection';
import FeaturedControllersSection from '@/components/home/FeaturedControllersSection';
import PopularAccessoriesSection from '@/components/home/PopularAccessoriesSection';
import ProductCategoryShowcase from '@/components/home/ProductCategoryShowcase';
import DefenceAgriSplit from '@/components/home/DefenceAgriSplit';
import MissionStory from '@/components/home/MissionStory';
import ProductRow from '@/components/common/ProductRow';
import TrustBrandExperience from '@/components/home/TrustBrandExperience';
import Footer from '@/components/layout/Footer';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { Magnetic, Reveal } from '@/components/motion';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function HomePage({ onOpenShowcase, onReplayIntro }) {
  useDocumentTitle('Home');

  const triggerReplay = () => {
    if (onReplayIntro) onReplayIntro();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zipi:replay-intro'));
    }
  };

  return (
    <main className="bg-[#080D14] text-[#f1f5f9] min-h-screen">
      {/* 1. Full-screen Mission Control Hero (DARK #080D14) */}
      <Hero onOpenShowcase={onOpenShowcase} />

      {/* 2. Featured UAV Drone Platforms (LIGHT #F5F8FC) */}
      <FeaturedDronesSection onOpenShowcase={onOpenShowcase} />

      {/* 3. Featured Intelligent Remote Controllers (DARK #101B2B) */}
      <FeaturedControllersSection onOpenShowcase={onOpenShowcase} />

      {/* 4. Popular Drone Accessories & Avionics (LIGHT #F5F8FC) */}
      <PopularAccessoriesSection />

      {/* 5. Hardware Architecture Categories (LIGHT #F5F7FA) */}
      <ProductCategoryShowcase />

      {/* 6. Defence vs Agriculture Sensor Simulator (DARK #080D14) */}
      <DefenceAgriSplit onOpenShowcase={onOpenShowcase} />

      {/* 7. End-to-End Workflow & Waypoint Simulator (LIGHT #E9EEF4) */}
      <MissionStory />

      {/* 8. Certified Airborne & Control Systems Carousel (DARK #101923) */}
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

      {/* 9. Real Catalog Stat Counters + Marquee Trust Strip (LIGHT #FFFFFF) */}
      <TrustBrandExperience />

      {/* 10. Closing Fleet Deployment CTA (DARK #080D14) */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal direction="up">
          <div className="hud-bracket relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0b1a2c] via-[#08121f] to-[#080D14] p-8 sm:p-14 text-center shadow-[0_0_50px_rgba(0,201,232,0.18)]">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#00C8E8]">
              READY FOR DEPLOYMENT // MISSION FLEET
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold text-[#f1f5f9]">
              Configure Your Drone &amp; Control Fleet
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              Compare remote controllers, inspect 3D hardware blueprints, or initiate a direct order, dealer application, or enterprise RFP with our supervisors.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <PrimaryButton to="/contact" showArrow shimmer magnetic>
                Talk to Our Team
              </PrimaryButton>
              <SecondaryButton to="/controllers" magnetic>
                Open Controller Finder
              </SecondaryButton>
              <button
                type="button"
                onClick={triggerReplay}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#AAB7C6]/30 bg-white/5 px-5 font-mono text-xs uppercase tracking-wider text-[#F5F8FC] hover:border-[#00C8E8] hover:text-[#00C8E8] transition active:scale-95"
              >
                <span>↺ Replay Cinematic Intro</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 11. Tactical Zulu Status & Deep Nav Footer (DARK #050b14) */}
      <Footer onReplayIntro={triggerReplay} />
    </main>
  );
}
