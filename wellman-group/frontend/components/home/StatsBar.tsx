'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { target: 12,  suffix: '+', label: 'Years Experience',  accent: '#1A3A6B' },
  { target: 185, suffix: '+', label: 'Hospitals Served',  accent: '#2060B0' },
  { target: 45,  suffix: '+', label: 'Cities Across India', accent: '#3A8FD4' },
  { target: 8,   suffix: '',  label: 'Core Services',     accent: '#7DC0E4' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsBar() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ target, suffix, label, accent }) => (
            <div
              key={label}
              className="bg-white rounded-2xl px-6 py-8 text-center"
              style={{
                borderTop: `3px solid ${accent}`,
                boxShadow: '0 4px 24px rgba(26,58,107,0.08)',
              }}
            >
              <p className="text-4xl font-black mb-1.5" style={{ color: accent }}>
                <Counter target={target} suffix={suffix} />
              </p>
              <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
