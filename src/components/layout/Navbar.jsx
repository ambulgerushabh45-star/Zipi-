import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { useMegaMenu } from '@/hooks/useMegaMenu';
import { NAV_ITEMS } from '@/data/navigation';
import DesktopNav from './DesktopNav';
import Logo from './Logo';
import MegaMenuPanel from './MegaMenuPanel';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';
import AccountModal from './AccountModal';

export default function Navbar({ onOpenCart }) {
  const { cartCount, wishlist } = useShop();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { activeId, hoverItem, enterArea, leaveArea, open, close } = useMegaMenu();

  const activeItem = NAV_ITEMS.find((item) => item.id === activeId);
  const activeMenu = activeItem?.menu;

  useEffect(() => {
    setMenuOpen(false);
    close();
  }, [pathname, close]);

  const iconBtn =
    'relative rounded-full p-2.5 text-[#AAB7C7] transition-colors duration-300 hover:bg-[#101B2A] hover:text-[#F5F8FC] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]';

  return (
    <>
      <header
        onMouseEnter={enterArea}
        onMouseLeave={leaveArea}
        onBlur={(e) => {
          const next = e.relatedTarget;
          if (next instanceof Node && !e.currentTarget.contains(next)) close();
        }}
        className="fixed inset-x-0 top-0 z-50 border-b border-[#101B2A] bg-[#07111F]/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 sm:gap-6 px-4 sm:px-8">
          <Logo tone="light" />

          {/* Center Navigation Links with Dropdown on Hover */}
          <DesktopNav
            items={NAV_ITEMS}
            activeId={activeId}
            onHover={hoverItem}
            onOpen={open}
            onClose={close}
          />

          {/* Right Navigation Elements: Search, Sign In/Account, Wishlist, Cart */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
              aria-label="Search drones and equipment"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Sign In / Account */}
            <button
              onClick={() => setAccountOpen(true)}
              className="relative inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#AAB7C7] transition-all duration-300 hover:border-[#101B2A] hover:bg-[#101B2A] hover:text-[#00C8FF] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
              aria-label="Sign In or Account"
            >
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">Sign In / Account</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={iconBtn}
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <CountBadge value={wishlist.length} tone="orange" />}
            </Link>

            {/* Cart with count badge and cyan glow */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 rounded-full border border-[#00C8FF]/40 bg-[#101B2A] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#00C8FF] transition-all duration-300 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#07111F] hover:shadow-[0_0_20px_rgba(0,200,255,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && <CountBadge value={cartCount} tone="cyan" />}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`${iconBtn} md:hidden`}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeItem && activeMenu && (
            <MegaMenuPanel
              key="mega-menu"
              id={activeItem.id}
              menu={activeMenu}
              onNavigate={close}
              onMouseEnter={enterArea}
              onMouseLeave={leaveArea}
            />
          )}
        </AnimatePresence>
      </header>

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

function CountBadge({ value, tone = 'cyan' }) {
  const bgClass =
    tone === 'cyan'
      ? 'bg-[#00C8FF] text-[#07111F] shadow-[0_0_12px_rgba(0,200,255,0.8)]'
      : tone === 'orange'
      ? 'bg-[#FF9B42] text-[#07111F] shadow-[0_0_12px_rgba(255,155,66,0.8)]'
      : 'bg-[#67B56B] text-[#07111F] shadow-[0_0_12px_rgba(103,181,107,0.8)]';

  return (
    <motion.span
      key={value}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${bgClass}`}
    >
      {value}
    </motion.span>
  );
}
