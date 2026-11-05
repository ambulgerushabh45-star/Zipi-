import Hero from '@/components/home/Hero';
import DefenceAgriSplit from '@/components/home/DefenceAgriSplit';
import ExploreCategories from '@/components/home/ExploreCategories';
import ProductRow from '@/components/common/ProductRow';
import Footer from '@/components/layout/Footer';

export default function HomePage({
  onOpenShowcase,
}: {
  onOpenShowcase: (id: string) => void;
}) {
  return (
    <main className="bg-black">
      {/* 1. Cinematic Hero with 3D Drone & Mission Headings */}
      <Hero onOpenShowcase={onOpenShowcase} />

      {/* 2. Prominent Interactive Exploration Sections: DEFENCE & AGRICULTURE */}
      <DefenceAgriSplit onOpenShowcase={onOpenShowcase} />

      {/* 3. Featured Flagship Airborne Systems */}
      <ProductRow
        id="featured"
        eyebrow="Flagship Aerial Fleet"
        title="Engineered for Mission-Critical Airspace."
        description="Our most advanced unmanned aerial platforms deployed across tactical defense reconnaissance and precision agricultural automation."
        productIds={['aegis-mk4', 'terra-spray-x40', 'recon-raven', 'agriscan-ndvi']}
      />

      {/* 4. Complete Category Matrix */}
      <ExploreCategories />

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}
