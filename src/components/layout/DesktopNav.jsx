import { motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

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
    <nav className="hidden flex-1 items-center justify-center gap-1 xl:gap-2 lg:flex" aria-label="Main">
      {items.map((item) => {
        const isCurrentRoute = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to.split('?')[0]);

        if (item.menu) {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => onOpen(item.id)}
              onMouseLeave={() => onClose(false)}
            >
              <button
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
                    onClose(true);
                  }
                }}
                className={`group relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#00C9E8] ${
                  isActive || isCurrentRoute
                    ? 'text-[#00C8E8] font-bold'
                    : 'text-[#AAB7C6] hover:text-[#FFFFFF]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`h-3 w-3 text-[#00C9E8]/70 transition-transform duration-200 ${
                    isActive ? 'rotate-180 text-[#00C9E8]' : 'group-hover:translate-y-0.5'
                  }`}
                />
                {(isActive || isCurrentRoute) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-[#00C9E8] to-[#55A8FF] shadow-[0_0_12px_rgba(0,201,232,0.85)]"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.16, ease: 'easeOut' }
                    }
                  />
                )}
              </button>
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            to={item.to}
            onClick={() => onClose(true)}
            className={`relative rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#00C9E8] ${
              isCurrentRoute
                ? 'text-[#00C8E8] font-bold'
                : 'text-[#AAB7C6] hover:text-[#FFFFFF]'
            }`}
          >
            {item.label}
            {isCurrentRoute && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-[#00C9E8] to-[#55A8FF] shadow-[0_0_12px_rgba(0,201,232,0.85)]"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.16, ease: 'easeOut' }
                }
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
