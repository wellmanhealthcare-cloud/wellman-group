'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types/service';

const FALLBACK: Service[] = [
  { id: '1', title: 'Modular Operation Theatre', slug: 'modular-operation-theatre', short_desc: 'Jointless, seamless modular OT structures engineered to maintain a 0.3-micron clean environment with precise temperature, humidity and pressure control.', long_desc: '', icon_url: null, order_index: 1, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '2', title: 'Medical Gas Pipeline System', slug: 'medical-gas-pipeline-system', short_desc: 'OxyMac™ MGPS — BS EN 13348:2008 and Lloyd certified medical gas pipeline systems supplying O₂, N₂O, CO₂, vacuum and medical air across hospital zones.', long_desc: '', icon_url: null, order_index: 2, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '3', title: 'HVAC & Cleanroom Engineering', slug: 'hvac-cleanroom-engineering', short_desc: 'Precision HVAC systems for critical healthcare areas — maintaining temperature, humidity, air changes and particulate counts to NABH & JCI standards.', long_desc: '', icon_url: null, order_index: 3, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '4', title: 'Clean Room Solutions', slug: 'clean-room-solutions', short_desc: 'ISO 5–8 classified modular clean rooms designed for pharmaceutical manufacturing, medical device production and research environments.', long_desc: '', icon_url: null, order_index: 4, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '5', title: 'Laminar Air Flow Systems', slug: 'laminar-air-flow-systems', short_desc: 'Vertical and horizontal LAF units providing unidirectional, particle-free airflow for OT tables, ICU bays, pharmacy and laboratory environments.', long_desc: '', icon_url: null, order_index: 5, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '6', title: 'Modular ICU Solutions', slug: 'modular-icu-solutions', short_desc: 'Fully integrated modular ICUs with built-in medical gas outlets, nurse call, pendant systems, controlled lighting and ISO 7 clean air.', long_desc: '', icon_url: null, order_index: 6, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '7', title: 'Modular NICU Solutions', slug: 'modular-nicu-solutions', short_desc: 'Purpose-designed neonatal intensive care environments with thermal regulation, low-noise airflow, infection control and specialist medical gas provisions.', long_desc: '', icon_url: null, order_index: 7, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '8', title: 'IVF Lab Setup', slug: 'ivf-lab-setup', short_desc: 'Turnkey IVF laboratory build-outs meeting ISO 5 requirements — VOC-free materials, precision humidity control and dedicated air handling units.', long_desc: '', icon_url: null, order_index: 8, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
];

const WHY = [
  'NABH, AERB & international compliance',
  'Biomedical engineers on every project',
  'Design, supply, install & commission',
  'Pan-India after-sales support',
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(FALLBACK);

  useEffect(() => {
    servicesApi.list()
      .then(({ data }) => { const a = data.filter((s) => s.is_active); if (a.length) setServices(a); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#F4F5FB]">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-20 overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)', filter: 'blur(56px)' }} />
            <div className="absolute -top-10 right-0 w-[400px] h-[400px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(62,99,221,0.10) 0%, transparent 65%)', filter: 'blur(56px)' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-[#ECEEF8] text-[#3E63DD] text-[11px] font-bold uppercase tracking-[0.18em] mb-6">
              What We Do
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Specialised Healthcare<br />
              <span style={{ background: 'linear-gradient(135deg, #3E63DD 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Infrastructure Services
              </span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              From sterile operating theatres to medical gas networks — eight end-to-end services trusted by 185+ hospitals across India.
            </p>
            {/* Why us pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {WHY.map((w) => (
                <span key={w} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ECEEF8] rounded-full text-[12px] font-medium text-slate-600">
                  <CheckCircle size={11} className="text-[#3E63DD] shrink-0" />
                  {w}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Grid ────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => {
                const num = String(i + 1).padStart(2, '0');
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Image / placeholder header */}
                    <div className="relative h-44 overflow-hidden bg-[#ECEEF8] shrink-0">
                      {service.icon_url ? (
                        <>
                          <img
                            src={service.icon_url}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </>
                      ) : (
                        /* Placeholder: large watermark number + subtle dot grid */
                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-[0.04]"
                            style={{
                              backgroundImage: 'radial-gradient(circle, #3E63DD 1px, transparent 1px)',
                              backgroundSize: '20px 20px',
                            }}
                          />
                          <span
                            className="text-[120px] font-black leading-none select-none"
                            style={{ color: '#3E63DD', opacity: 0.07 }}
                          >
                            {num}
                          </span>
                        </div>
                      )}
                      {/* Number badge */}
                      <span className="absolute top-3 left-4 text-[10px] font-black tracking-[0.15em] text-white bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {num}
                      </span>
                    </div>

                    {/* Blue accent line */}
                    <div className="h-[3px] bg-gradient-to-r from-[#3E63DD] to-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h2 className="font-bold text-slate-900 text-[15px] leading-snug mb-2.5 group-hover:text-[#3E63DD] transition-colors duration-200">
                        {service.title}
                      </h2>
                      <p className="text-slate-500 text-[13px] leading-relaxed flex-1">
                        {service.short_desc}
                      </p>
                      <div className="flex items-center gap-1.5 mt-5 text-[#3E63DD] text-[12px] font-semibold">
                        Learn More
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden bg-[#3E63DD] rounded-3xl p-10 md:p-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl" />
              </div>
              <div className="relative z-10 text-center max-w-xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  Need a Custom Solution?
                </h2>
                <p className="text-blue-100 text-base mb-8 leading-relaxed">
                  Every hospital is unique. Let's design a solution tailored to your exact requirements and budget.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#3E63DD] font-bold text-sm rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  Talk to an Expert <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
