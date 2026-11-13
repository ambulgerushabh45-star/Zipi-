import { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function Carousel({ items = [], renderItem, label = 'Featured items' }) {
  const trackRef = useRef(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [activeDot, setActiveDot] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const total = items.length;

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || total <= 1) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    const ratio = el.scrollLeft / maxScroll;
    setActiveDot(Math.min(total - 1, Math.max(0, Math.round(ratio * (total - 1)))));
  };

  const scrollToIndex = (index) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index];
    if (child) {
      child.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  };

  const onPointerDown = (e) => {
    if (e.target.closest('a, button')) return;
    const el = trackRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    if (!dragState.current.active || !trackRef.current) return;
    const el = trackRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.25;
    if (Math.abs(walk) > 5) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDrag = () => {
    dragState.current.active = false;
  };

  return (
    <div className="space-y-6" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-2 cursor-grab active:cursor-grabbing select-none"
      >
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="w-[84%] sm:w-[48%] lg:w-[24%] shrink-0 snap-start"
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Progress dots (no chevron arrows) */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Carousel slides">
          {items.map((item, idx) => {
            const active = idx === activeDot;
            return (
              <button
                key={item.id || idx}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Slide ${idx + 1} of ${total}`}
                onClick={() => scrollToIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  active
                    ? 'w-7 bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

