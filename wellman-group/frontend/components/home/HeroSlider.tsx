'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlidesApi } from '@/lib/api';
import type { HeroSlide } from '@/types/hero-slide';

const FALLBACK: HeroSlide[] = [
  {
    id: 'f1',
    image_url: '',
    heading: 'Transforming Healthcare Infrastructure',
    subheading: '12+ years of excellence in Modular OT, MGPS, HVAC and Cleanroom Engineering across India.',
    cta_text: 'Explore Services',
    cta_link: '/services',
    order_index: 0,
    is_active: true,
  },
  {
    id: 'f2',
    image_url: '',
    heading: 'Trusted by 185+ Hospitals Across India',
    subheading: 'From Ahmedabad to every corner of the country — we build the spaces that save lives.',
    cta_text: 'View Projects',
    cta_link: '/projects',
    order_index: 1,
    is_active: true,
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    heroSlidesApi
      .list()
      .then(({ data }) => {
        const active = data.filter((s) => s.is_active);
        if (active.length > 0) setSlides(active);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Background image or gradient */}
      {slide.image_url ? (
        <img
          key={slide.id}
          src={slide.image_url}
          alt={slide.heading}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)' }} />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(26,58,107,0.85) 0%, rgba(26,58,107,0.4) 60%, transparent)' }}
      />

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-[#3A8FD4]/20 border border-[#3A8FD4]/40 text-[#7DC0E4] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
              Healthcare Infrastructure Experts
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
              {slide.heading}
            </h1>
            {slide.subheading && (
              <p className="text-base sm:text-lg text-[#B8D5EC] mb-8 leading-relaxed max-w-xl">
                {slide.subheading}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.cta_link}
                className="px-7 py-3.5 bg-[#3A8FD4] hover:bg-[#2060B0] text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:-translate-y-0.5"
              >
                {slide.cta_text}
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/25 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-7 h-2 bg-[#3A8FD4]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

    </section>
  );
}
