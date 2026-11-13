import { AnimatePresence, motion, useReducedMotion, useScroll } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { useMegaMenu } from '@/hooks/useMegaMenu';
import { NAV_ITEMS } from '@/data/navigation';
import { ScrollProgress } from '@/components/motion';
import DesktopNav from './DesktopNav';
import Logo from './Logo';
import MegaMenuPanel from './MegaMenuPanel';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';
import AccountModal from './AccountModal';

export default function Navbar({ onOpenCart }) {
  const { cartCount, wishlist } = useShop();
  const { pathname, search, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { activeId, toggle, open, close } = useMegaMenu();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const headerRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRefs = useRef({});
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setScrolled(latest > 24);
    });
  }, [scrollY]);

  const registerTriggerRef = useCallback((id, el) => {
    triggerRefs.current[id] = el;
  }, []);

  const closeWithFocus = useCallback(() => {
    const prevId = activeIdRef.current;
    close();
    if (prevId) {
      window.requestAnimationFrame(() => {
        triggerRefs.current[prevId]?.focus();
      });
    }
  }, [close]);

  const activeItem = NAV_ITEMS.find((item) => item.id === activeId);
  const activeMenu = activeItem?.menu;

  useEffect(() => {
    setMenuOpen(false);
    close();
  }, [pathname, search, hash, close]);

  useEffect(() => {
    if (!activeId) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeWithFocus();
      }
    };

    const handlePointerDown = (e) => {
      const target = e.target;
      const inHeader = headerRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inHeader && !inPanel) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [activeId, close, closeWithFocus]);

  const iconBtn =
    'relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#cbd5e1] transition-colors duration-150 hover:bg-[#112640] hover:text-[#f1f5f9] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';

  const topOffsetClass = scrolled ? 'top-16' : 'top-20';

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-colors duration-200 ${
          activeId
            ? 'bg-[#08121f]'
            : scrolled
              ? 'bg-[#050b14]/90 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.45)]'
              : 'bg-[#050b14]/80 backdrop-blur-md'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center gap-3 sm:gap-5 px-4 sm:px-8 transition-[height] duration-200 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          <Logo tone="light" />

          <DesktopNav
            items={NAV_ITEMS}
            activeId={activeId}
            onToggle={toggle}
            onOpen={open}
            onClose={close}
            registerTriggerRef={registerTriggerRef}
          />

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => {
                close();
                setSearchOpen(true);
              }}
              className={iconBtn}
              aria-label="Search drones and equipment"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                close();
                setAccountOpen(true);
              }}
              className="relative inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] transition-all duration-150 hover:border-white/10 hover:bg-[#112640] hover:text-cyan-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Sign In or Account"
            >
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">Sign In / Account</span>
            </button>

            <Link
              to="/wishlist"
              onClick={close}
              className={iconBtn}
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <CountBadge
                  value={wishlist.length}
                  tone="highlight"
                  shouldReduceMotion={shouldReduceMotion}
                />
              )}
            </Link>

            <button
              type="button"
              onClick={() => {
                close();
                onOpenCart?.();
              }}
              className="relative inline-flex min-h-[44px] items-center gap-2 rounded-full border border-cyan-400/40 bg-[#0b1a2c] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 transition-all duration-150 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-[#22d3ee] hover:to-[#0ea5e9] hover:text-[#031018] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <CountBadge
                  value={cartCount}
                  tone="cyan"
                  shouldReduceMotion={shouldReduceMotion}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                close();
                setMenuOpen(true);
              }}
              className={`${iconBtn} lg:hidden`}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <ScrollProgress />
      </header>

      {/* Dim backdrop & opaque mega-menu panel outside header stacking context */}
      <AnimatePresence>
        {activeItem && activeMenu && (
          <div key="mega-menu-layer">
            <motion.div
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
              onClick={close}
              className={`fixed inset-0 ${topOffsetClass} z-[55] bg-black/50`}
            />
            <MegaMenuPanel
              ref={panelRef}
              id={activeItem.id}
              menu={activeMenu}
              topClass={topOffsetClass}
              onNavigate={close}
              onEscape={closeWithFocus}
            />
          </div>
        )}
      </AnimatePresence>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenCart={onOpenCart}
        onOpenAccount={() => setAccountOpen(true)}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}

function CountBadge({ value, tone = 'cyan', shouldReduceMotion = false }) {
  const bgClass =
    tone === 'cyan'
      ? 'bg-cyan-400 text-[#031018] shadow-[0_0_12px_rgba(34,211,238,0.75)]'
      : 'bg-[#fbbf24] text-[#031018] shadow-[0_0_12px_rgba(251,191,36,0.75)]';

  return (
    <motion.span
      key={value}
      initial={shouldReduceMotion ? false : { scale: 0.6 }}
      animate={{ scale: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
      className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${bgClass}`}
    >
      {value}
    </motion.span>
  );
}
