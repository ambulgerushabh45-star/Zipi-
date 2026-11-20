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
  const [utcTime, setUtcTime] = useState('');
  const { activeId, toggle, open, close, clearTimer } = useMegaMenu();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
    'relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#AAB7C6] transition-all duration-200 hover:bg-[#162438] hover:text-[#00C8E8] active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8]';

  const topOffsetClass = scrolled ? 'top-16' : 'top-20 sm:top-[112px]';

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          activeId
            ? 'bg-[#101B2B]/98 border-b border-[#AAB7C6]/20 shadow-[0_16px_45px_rgba(0,0,0,0.6)]'
            : scrolled
              ? 'bg-[#101B2B]/90 backdrop-blur-xl border-b border-[#AAB7C6]/20 shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
              : 'bg-transparent border-b border-white/5'
        }`}
      >
        {/* Top Tactical Mission Status Bar */}
        {!scrolled && (
          <div className="border-b border-white/5 bg-[#080F1B]/95 px-4 py-1.5 text-[10px] font-mono text-[#AAB7C6] backdrop-blur-md hidden sm:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-bold text-[#00C8E8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00C8E8] animate-pulse shadow-[0_0_8px_#00C8E8]" />
                  <span>FLEET TELEMETRY // ACTIVE</span>
                </span>
                <span className="text-white/20">|</span>
                <span className="text-slate-300">NON-WEAPONIZED ISR DEFENCE &amp; PRECISION AGRI</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#00C8E8] font-bold">C2 LINK:</span>
                  <span>AES-256 ENCRYPTED</span>
                </span>
                <span className="text-white/20">|</span>
                <span className="font-bold text-[#00C8E8]">{utcTime || '12:00:00 UTC'}</span>
              </div>
            </div>
          </div>
        )}

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

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
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
              className="relative inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#F5F8FC] transition-all duration-200 hover:border-[#00C8E8] hover:bg-[#162438] hover:text-[#00C8E8] active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8]"
              aria-label="Sign In or Account"
            >
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">Account</span>
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
              className="relative inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#00C8E8]/40 bg-[#162438] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#00C8E8] shadow-[0_0_18px_rgba(0,200,232,0.2)] transition-all duration-200 hover:border-[#00C8E8] hover:bg-[#00C8E8] hover:text-[#080F1B] hover:shadow-[0_0_24px_rgba(0,200,232,0.5)] active:translate-y-[1px] active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8]"
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
              onNavigate={() => close(true)}
              onEscape={closeWithFocus}
              onMouseEnter={clearTimer}
              onMouseLeave={() => close(false)}
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
