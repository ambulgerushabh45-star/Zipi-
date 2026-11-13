import { motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function DesktopNav({
  items,
  activeId,
  onToggle,
  onOpen,
  onClose,
  registerTriggerRef,
}) {
  const { pathname } = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const focusFirstMenuItem = () => {
    window.requestAnimationFrame(() => {
      document.querySelector('#mega-menu [data-megamenu-link="true"]')?.focus();
    });
  };

  return (
    <nav className="hidden flex-1 items-center justify-center gap-1 lg:gap-2 lg:flex" aria-label="Main">
      {items.map((item) => {
        const isCurrentRoute = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

        if (item.menu) {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              ref={(el) => registerTriggerRef?.(item.id, el)}
              aria-expanded={isActive}
              aria-haspopup="true"
              aria-controls="mega-menu"
              onClick={() => onToggle(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (!isActive) {
                    onOpen(item.id);
                  }
                  focusFirstMenuItem();
                } else if (e.key === 'Escape' && isActive) {
                  e.preventDefault();
                  onClose();
                }
              }}
              className={`relative inline-flex items-center rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] ${
                isActive || isCurrentRoute
                  ? 'text-[#00C8FF] font-bold'
                  : 'text-[#CBD5E1] hover:text-[#F5F8FC]'
              }`}
            >
              <span>{item.label}</span>
              {(isActive || isCurrentRoute) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-[#00C8FF] shadow-[0_0_10px_rgba(0,200,255,0.8)]"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.14, ease: 'easeOut' }
                  }
                />
              )}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            to={item.to}
            onClick={onClose}
            className={`relative rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] ${
              isCurrentRoute
                ? 'text-[#00C8FF] font-bold'
                : 'text-[#CBD5E1] hover:text-[#F5F8FC]'
            }`}
          >
            {item.label}
            {isCurrentRoute && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-[#00C8FF] shadow-[0_0_10px_rgba(0,200,255,0.8)]"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.14, ease: 'easeOut' }
                }
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
