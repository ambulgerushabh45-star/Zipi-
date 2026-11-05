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

type NavbarProps = {
  onOpenCart: () => void;
};

export default function Navbar({ onOpenCart }: NavbarProps) {
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
    'relative rounded-full p-2.5 text-zinc-300 transition-colors duration-300 hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';

  return (
    <>
      <header
        onMouseEnter={enterArea}
        onMouseLeave={leaveArea}
        onBlur={(e) => {
          const next = e.relatedTarget;
          if (next instanceof Node && !e.currentTarget.contains(next)) close();
        }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 sm:gap-6 px-4 sm:px-8">
          <Logo tone="light" />

          {/* Center Navigation Links with Dropdown Mega-Menus on Hover */}
          <DesktopNav
            items={NAV_ITEMS}
            activeId={activeId}
            onHover={hoverItem}
            onOpen={open}
            onClose={close}
          />

          {/* Right Navigation Elements: Search, Account, Wishlist, Cart */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
              aria-label="Search drones"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account */}
            <button
              onClick={() => setAccountOpen(true)}
              className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors duration-300 hover:bg-white/10 hover:text-cyan-400 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
              <span className="hidden xl:inline">Account</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={iconBtn}
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <CountBadge value={wishlist.length} tone="brand" />}
            </Link>

            {/* Cart with animated count badge and cyan glow */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
            <MegaMenuPanel key="mega-menu" id={activeItem.id} menu={activeMenu} onNavigate={close} />
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

function CountBadge({ value, tone = 'cyan' }: { value: number; tone?: 'cyan' | 'brand' }) {
  const bgClass =
    tone === 'cyan'
      ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,229,255,0.8)]'
      : 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.8)]';

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
