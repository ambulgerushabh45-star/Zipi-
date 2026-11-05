import { Link } from 'react-router-dom';
export default function Logo({ tone = 'dark' }) {
    const isLight = tone === 'light';
    const textColor = isLight ? 'text-white' : 'text-ink-900';
    const strokeColor = isLight ? '#ffffff' : '#0f1217';
    return (<Link to="/" className={`group inline-flex items-center gap-2.5 ${textColor}`} aria-label="ZIPI Aerospace Home">
      {/* Sleek Aerospace Mark matching brand identity */}
      <div className="relative flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-colors duration-300">
          {/* Futuristic stylized Z with aerodynamic wing slices */}
          <path d="M 6 8 L 26 8" stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M 23 8.5 L 9 23.5" stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M 6 24 L 26 24" stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round"/>
          {/* Subtle tactical crossbar */}
          <path d="M 4 16 L 28 16" stroke="#00e5ff" strokeWidth="1.8" strokeLinecap="round" className="opacity-90 group-hover:stroke-brand-500"/>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-display text-2xl font-black tracking-[0.14em] leading-none">
          ZIPI
        </span>
        <span className="text-[8px] font-bold tracking-[0.35em] text-cyan-500 uppercase -mt-0.5">
          Aerospace
        </span>
      </div>
    </Link>);
}
