import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
export default function DesktopNav({ items, activeId, onHover, onOpen, onClose }) {
    const { pathname } = useLocation();
    return (<nav className="hidden flex-1 items-center justify-center gap-1 lg:gap-2 md:flex" aria-label="Main">
      {items.map((item) => {
            const isCurrentRoute = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
            if (item.menu) {
                const isActive = activeId === item.id;
                return (<button key={item.id} type="button" aria-expanded={isActive} aria-controls="mega-menu" onMouseEnter={() => onHover(item.id)} onFocus={() => onOpen(item.id)} onClick={() => onOpen(item.id)} onKeyDown={(e) => {
                        if (e.key !== 'ArrowDown')
                            return;
                        e.preventDefault();
                        document.getElementById('mega-menu')?.querySelector('a')?.focus();
                    }} className={`relative rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${isCurrentRoute || isActive
                        ? 'text-cyan-400 font-bold'
                        : 'text-zinc-300 hover:text-white'}`}>
              {item.label}
              {(isActive || isCurrentRoute) && (<motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.8)]" transition={{ type: 'spring', stiffness: 420, damping: 36 }}/>)}
            </button>);
            }
            return (<Link key={item.id} to={item.to} onMouseEnter={() => onHover(null)} onFocus={onClose} className={`relative rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${isCurrentRoute
                    ? 'text-cyan-400 font-bold'
                    : 'text-zinc-300 hover:text-white'}`}>
            {item.label}
            {isCurrentRoute && (<motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.8)]" transition={{ type: 'spring', stiffness: 420, damping: 36 }}/>)}
          </Link>);
        })}
    </nav>);
}
