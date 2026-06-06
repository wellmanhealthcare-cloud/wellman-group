'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';
import type { Testimonial } from '@/types/testimonial';

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    testimonialsApi.list()
      .then(({ data }) => setItems(data.filter((t) => t.is_active)))
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, items.length]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#3A8FD4] text-xs font-semibold uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            What Clients Say
          </h2>
        </div>

        <div
          className="bg-white rounded-3xl p-8 sm:p-12 text-center relative"
          style={{ border: '1px solid rgba(58,143,212,0.15)', boxShadow: '0 2px 12px rgba(26,58,107,0.06)' }}
        >
          {/* Quote mark */}
          <div className="text-6xl font-black leading-none mb-4 select-none" style={{ color: 'rgba(58,143,212,0.15)' }}>"</div>

          <p className="text-slate-700 text-lg leading-relaxed mb-8 italic">
            "{item.message}"
          </p>

          {item.rating > 0 && (
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < item.rating ? 'text-amber-400 text-lg' : 'text-slate-200 text-lg'}>
                  ★
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            {item.photo_url && (
              <img
                src={item.photo_url}
                alt={item.client_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#3A8FD4]/20"
              />
            )}
            <div className="text-left">
              <p className="font-bold text-slate-900">{item.client_name}</p>
              <p className="text-slate-400 text-sm">
                {item.designation}
                {item.hospital_name && ` · ${item.hospital_name}`}
              </p>
            </div>
          </div>

          {items.length > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={prev}
                className="p-2.5 bg-[#F5F8FC] hover:bg-[#2060B0] hover:text-white text-slate-500 rounded-full transition-colors"
              >
                <ChevronLeft size={17} />
              </button>
              <div className="flex gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all ${i === current ? 'w-5 h-2 bg-[#3A8FD4]' : 'w-2 h-2 bg-slate-200'}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2.5 bg-[#F5F8FC] hover:bg-[#2060B0] hover:text-white text-slate-500 rounded-full transition-colors"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
