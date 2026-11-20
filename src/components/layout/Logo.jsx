import { Link } from 'react-router-dom';

export default function Logo({ tone = 'dark' }) {
  const isLight = tone === 'light';
  const textColor = isLight ? 'text-[#F5F8FC]' : 'text-[#101B2B]';
  const strokeColor = isLight ? '#F5F8FC' : '#101B2B';

  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 shrink-0 ${textColor} outline-none focus-visible:ring-2 focus-visible:ring-[#00C8E8] rounded-lg`}
      aria-label="ZIPI — DRONES &amp; CONTROLLERS Home"
    >
      <div className="relative flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 transition-colors duration-300"
        >
          <path d="M 6 8 L 26 8" stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 23 8.5 L 9 23.5" stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 6 24 L 26 24" stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round" />
          <path
            d="M 4 16 L 28 16"
            stroke="#00C8E8"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="opacity-95 group-hover:stroke-[#55A8FF] transition-colors"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-display text-2xl font-black tracking-[0.14em] leading-none text-[#F5F8FC]">
          ZIPI
        </span>
        <span className="text-[7.5px] font-bold tracking-[0.24em] text-[#00C8E8] uppercase -mt-0.5 whitespace-nowrap">
          DRONES &amp; CONTROLLERS
        </span>
      </div>
    </Link>
  );
}
