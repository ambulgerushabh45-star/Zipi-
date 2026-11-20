import { Suspense, lazy, useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CartDrawer from '@/components/cart/CartDrawer';
import Toaster from '@/components/feedback/Toaster';
import PageSkeleton from '@/components/common/PageSkeleton';
import { PageTransition } from '@/components/motion';
import CinematicIntro from '@/components/home/CinematicIntro';

import HomePage from '@/pages/HomePage';
import DefencePage from '@/pages/DefencePage';
import AgriculturePage from '@/pages/AgriculturePage';
import ProductsPage from '@/pages/ProductsPage';
import ShowcasePage from '@/pages/ShowcasePage';
import ControllersPage from '@/pages/ControllersPage';
import CheckoutPage from '@/pages/CheckoutPage';
import WishlistPage from '@/pages/WishlistPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AdminInquiriesPage from '@/pages/AdminInquiriesPage';

const CinematicShowcase = lazy(() => import('@/components/showcase/CinematicShowcase'));

function App() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [showcaseDroneId, setShowcaseDroneId] = useState(null);

  // Cinematic intro starts automatically on every fresh entry / new tab / page refresh.
  // Stored in React state (not localStorage or sessionStorage), so it never gets permanently skipped.
  // Internal page navigation within this React app session does not unmount App, so it doesn't replay on route clicks.
  const [introActive, setIntroActive] = useState(true);

  // Global listener for replay intro button (from footer or CTA buttons on any page)
  useEffect(() => {
    const handleReplay = () => {
      setIntroActive(true);
    };
    window.addEventListener('zipi:replay-intro', handleReplay);
    return () => window.removeEventListener('zipi:replay-intro', handleReplay);
  }, []);

  const openShowcase = (id) => {
    setShowcaseDroneId(id);
  };
  const closeShowcase = () => {
    setShowcaseDroneId(null);
  };

  return (
    <>
      {/* 0. App-Level Cinematic Intro: Plays on every entry, then reveals destination route */}
      {introActive && (
        <CinematicIntro onComplete={() => setIntroActive(false)} />
      )}

      <ScrollToTop />
      <Navbar onOpenCart={() => setCartOpen(true)} />

      <Suspense fallback={<PageSkeleton />}>
        <PageTransition routeKey={location.pathname}>
          <Routes>
            <Route path="/" element={<HomePage onOpenShowcase={openShowcase} onReplayIntro={() => setIntroActive(true)} />} />
            <Route path="/defence" element={<DefencePage onOpenShowcase={openShowcase} />} />
            <Route path="/agriculture" element={<AgriculturePage onOpenShowcase={openShowcase} />} />
            <Route path="/products" element={<ProductsPage onOpenShowcase={openShowcase} />} />
            <Route path="/shop" element={<ProductsPage onOpenShowcase={openShowcase} />} />
            <Route path="/accessories" element={<ProductsPage onOpenShowcase={openShowcase} />} />
            <Route path="/controllers" element={<ControllersPage />} />
            <Route path="/product/:id" element={<ShowcasePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage onOpenShowcase={openShowcase} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Suspense>

      {/* Global Full-Screen Cinematic Showcase Modal */}
      {showcaseDroneId && (
        <div className="fixed inset-0 z-[100] bg-[#050b14]">
          <Suspense fallback={<PageSkeleton />}>
            <CinematicShowcase productId={showcaseDroneId} onClose={closeShowcase} />
          </Suspense>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster />
    </>
  );
}

export default App;
