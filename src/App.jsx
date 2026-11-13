import { Suspense, lazy, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CartDrawer from '@/components/cart/CartDrawer';
import Toaster from '@/components/feedback/Toaster';
import PageSkeleton from '@/components/common/PageSkeleton';
import { PageTransition } from '@/components/motion';

const HomePage = lazy(() => import('@/pages/HomePage'));
const DefencePage = lazy(() => import('@/pages/DefencePage'));
const AgriculturePage = lazy(() => import('@/pages/AgriculturePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ShowcasePage = lazy(() => import('@/pages/ShowcasePage'));
const ControllersPage = lazy(() => import('@/pages/ControllersPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AdminInquiriesPage = lazy(() => import('@/pages/AdminInquiriesPage'));
const CinematicShowcase = lazy(() => import('@/components/showcase/CinematicShowcase'));

function App() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [showcaseDroneId, setShowcaseDroneId] = useState(null);

  const openShowcase = (id) => {
    setShowcaseDroneId(id);
  };
  const closeShowcase = () => {
    setShowcaseDroneId(null);
  };

  return (
    <>
      <ScrollToTop />
      <Navbar onOpenCart={() => setCartOpen(true)} />

      <Suspense fallback={<PageSkeleton />}>
        <PageTransition routeKey={location.pathname}>
          <Routes>
            <Route path="/" element={<HomePage onOpenShowcase={openShowcase} />} />
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
