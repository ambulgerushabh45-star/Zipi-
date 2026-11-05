import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export default function ProductGallery({ product, className = '' }) {
  const images = [
    product?.image,
    ...(product?.gallery || []),
  ].filter(Boolean);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = images[activeIdx] || product?.image;

  const nextImage = () => {
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative flex flex-col gap-4 select-none ${className}`}>
      {/* Main Image Frame with Click to Enlarge */}
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#101B2A] bg-[#07111F] flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={`${product?.name} view ${activeIdx + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          />
        </AnimatePresence>

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.1)_0,transparent_65%)]" />

        {/* Zoom Overlay Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#101B2A] bg-[#07111F]/80 text-[#AAB7C7] backdrop-blur hover:bg-[#101B2A] hover:text-[#00C8FF] transition opacity-0 group-hover:opacity-100"
          title="Click to enlarge"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Next / Prev Chevrons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[#101B2A] bg-[#07111F]/80 text-[#AAB7C7] backdrop-blur hover:bg-[#101B2A] hover:text-[#00C8FF] transition opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[#101B2A] bg-[#07111F]/80 text-[#AAB7C7] backdrop-blur hover:bg-[#101B2A] hover:text-[#00C8FF] transition opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl border transition-all p-2 bg-[#101B2A]/50 ${
                activeIdx === idx
                  ? 'border-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.4)] scale-105'
                  : 'border-[#101B2A] opacity-60 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative max-h-full max-w-5xl w-full flex flex-col items-center"
            >
              <div className="flex w-full items-center justify-between pb-4 border-b border-white/10 mb-4 text-[#F5F8FC]">
                <div className="font-mono text-xs uppercase tracking-wider text-[#00C8FF]">
                  {product?.name} // Photo {activeIdx + 1} of {images.length}
                </div>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="rounded-full p-2 text-[#AAB7C7] hover:bg-white/10 hover:text-white transition"
                  aria-label="Close Lightbox"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative flex items-center justify-center w-full max-h-[75vh]">
                <img
                  src={activeImage}
                  alt={product?.name}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
