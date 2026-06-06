'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types/service';

const FALLBACK: Service[] = [
  { id: '1', title: 'Modular Operation Theatre', slug: 'modular-operation-theatre', short_desc: 'State-of-the-art modular OT with HEPA filtration, laminar airflow, and full NABH compliance.', long_desc: '', icon_url: null, order_index: 1, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '2', title: 'Medical Gas Pipeline System', slug: 'medical-gas-pipeline-system', short_desc: 'OxyMac™ MGPS — safe, reliable oxygen, nitrous oxide, and vacuum piping for hospitals.', long_desc: '', icon_url: null, order_index: 2, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '3', title: 'HVAC & Cleanroom Engineering', slug: 'hvac-cleanroom-engineering', short_desc: 'Precision HVAC ensuring temperature, humidity, and particulate control in critical areas.', long_desc: '', icon_url: null, order_index: 3, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '4', title: 'Clean Room Solutions', slug: 'clean-room-solutions', short_desc: 'ISO-classified clean rooms designed for pharmaceutical and medical device manufacturing.', long_desc: '', icon_url: null, order_index: 4, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '5', title: 'Laminar Air Flow Systems', slug: 'laminar-air-flow-systems', short_desc: 'Vertical and horizontal laminar airflow units for OT, ICU, and lab environments.', long_desc: '', icon_url: null, order_index: 5, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '6', title: 'Modular ICU Solutions', slug: 'modular-icu-solutions', short_desc: 'Fully equipped modular ICUs integrating medical gases, lighting and monitoring systems.', long_desc: '', icon_url: null, order_index: 6, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '7', title: 'Modular NICU Solutions', slug: 'modular-nicu-solutions', short_desc: 'Purpose-built neonatal ICU environments for the most vulnerable, premature patients.', long_desc: '', icon_url: null, order_index: 7, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '8', title: 'IVF Lab Setup', slug: 'ivf-lab-setup', short_desc: 'Turn-key IVF laboratory with ISO-class cleanrooms and precision air handling units.', long_desc: '', icon_url: null, order_index: 8, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
];

export default function ServicesOverview() {
  const [services, setServices] = useState<Service[]>(FALLBACK);

  useEffect(() => {
    servicesApi.list().then(({ data }) => {
      const active = data.filter((s) => s.is_active);
      if (active.length > 0) setServices(active);
    }).catch(() => {});
  }, []);

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#3A8FD4] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            What We Do
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Our Services
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            End-to-end healthcare infrastructure — from sterile operating theatres to medical gas networks.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const num = String(i + 1).padStart(2, '0');

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: '1px solid rgba(58,143,212,0.15)',
                  borderLeftWidth: '3px',
                  borderLeftColor: '#3A8FD4',
                  boxShadow: '0 2px 12px rgba(26,58,107,0.06)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(26,58,107,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(26,58,107,0.06)';
                }}
              >
                {/* Image header — only when available */}
                {service.icon_url && (
                  <div className="relative h-36 overflow-hidden shrink-0">
                    <img
                      src={service.icon_url}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,107,0.5), transparent)' }} />
                  </div>
                )}

                {/* Body */}
                <div className="relative flex flex-col flex-1 p-5 overflow-hidden">
                  {/* Watermark number */}
                  <span
                    className="absolute top-2 right-3 text-5xl font-black leading-none select-none pointer-events-none"
                    style={{ color: '#B8D5EC' }}
                  >
                    {num}
                  </span>

                  <h3 className="font-bold text-slate-900 text-[14px] leading-snug mb-2 group-hover:text-[#2060B0] transition-colors relative z-10">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-[12px] leading-relaxed line-clamp-3 flex-1 relative z-10">
                    {service.short_desc}
                  </p>

                  {/* Learn more */}
                  <div className="flex items-center gap-1.5 mt-4 text-[12px] font-semibold text-[#2060B0] group-hover:gap-2.5 transition-all duration-200 relative z-10">
                    Learn More <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition-all shadow-md hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2060B0, #1A3A6B)' }}
          >
            View All Services <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
