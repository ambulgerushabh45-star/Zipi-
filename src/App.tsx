import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CartDrawer from '@/components/cart/CartDrawer';
import Toaster from '@/components/feedback/Toaster';

import HomePage from '@/pages/HomePage';
import DefencePage from '@/pages/DefencePage';
import AgriculturePage from '@/pages/AgriculturePage';
import ProductsPage from '@/pages/ProductsPage';
import ShowcasePage from '@/pages/ShowcasePage';
import CheckoutPage from '@/pages/CheckoutPage';
import WishlistPage from '@/pages/WishlistPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import CinematicShowcase from '@/components/showcase/CinematicShowcase';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showcaseDroneId, setShowcaseDroneId] = useState<string | null>(null);

  const openShowcase = (id: string) => {
    setShowcaseDroneId(id);
  };

  const closeShowcase = () => {
    setShowcaseDroneId(null);
  };

  return (
    <>
      <ScrollToTop />
      <Navbar onOpenCart={() => setCartOpen(true)} />

      <Routes>
        <Route path="/" element={<HomePage onOpenShowcase={openShowcase} />} />
        <Route path="/defence" element={<DefencePage onOpenShowcase={openShowcase} />} />
        <Route path="/agriculture" element={<AgriculturePage onOpenShowcase={openShowcase} />} />
        <Route path="/products" element={<ProductsPage onOpenShowcase={openShowcase} />} />
        <Route path="/shop" element={<ProductsPage onOpenShowcase={openShowcase} />} />
        <Route path="/accessories" element={<ProductsPage onOpenShowcase={openShowcase} />} />
        <Route path="/product/:id" element={<ShowcasePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage onOpenShowcase={openShowcase} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Full-Screen Cinematic Showcase Modal */}
      {showcaseDroneId && (
        <div className="fixed inset-0 z-[100] bg-black">
          <CinematicShowcase
            productId={showcaseDroneId}
            onClose={closeShowcase}
          />
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster />
    </>
  );
}

export default App;
