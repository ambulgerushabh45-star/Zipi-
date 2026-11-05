import Hero from '@/components/home/Hero';
import ProductCategoryShowcase from '@/components/home/ProductCategoryShowcase';
import DefenceAgriSplit from '@/components/home/DefenceAgriSplit';
import ProductRow from '@/components/common/ProductRow';
import TrustBrandExperience from '@/components/home/TrustBrandExperience';
import Footer from '@/components/layout/Footer';

export default function HomePage({ onOpenShowcase }) {
  return (
    <main className="bg-[#07111F] text-[#F5F8FC] min-h-screen">
      {/* 1. Cinematic Hero with 3D Drone & Choreographed Opening */}
      <Hero onOpenShowcase={onOpenShowcase} />

      {/* 2. Four Premium Product Category Cards Directly Below Hero */}
      <ProductCategoryShowcase />

      {/* 3. Defence and Agriculture Previews */}
      <DefenceAgriSplit onOpenShowcase={onOpenShowcase} />

      {/* 4. Featured Flagship Airborne Systems */}
      <ProductRow
        id="featured"
        eyebrow="Certified Airborne Systems"
        title="Deployed in Mission-Critical Airspace."
        description="Our most advanced unmanned aerial platforms engineered for tactical defense reconnaissance and precision agricultural automation."
        productIds={['aegis-mk4', 'terra-spray-x40', 'recon-raven', 'agriscan-ndvi']}
      />

      {/* 5. Product Trust and Brand Experience */}
      <TrustBrandExperience />

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
