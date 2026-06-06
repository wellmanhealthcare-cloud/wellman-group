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
  { id: '1', title: 'Modular Operation Theatre',   slug: 'modular-operation-theatre',   short_desc: 'Jointless, seamless modular OT structures engineered to maintain a 0.3-micron clean environment with precise temperature, humidity and pressure control.', long_desc: '', icon_url: null, order_index: 1, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '2', title: 'Medical Gas Pipeline System', slug: 'medical-gas-pipeline-system',  short_desc: 'OxyMac™ MGPS — BS EN 13348:2008 and Lloyd certified medical gas pipeline systems supplying O₂, N₂O, CO₂, vacuum and medical air across hospital zones.', long_desc: '', icon_url: null, order_index: 2, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '3', title: 'HVAC & Cleanroom Engineering', slug: 'hvac-cleanroom-engineering',  short_desc: 'Precision HVAC systems for critical healthcare areas — maintaining temperature, humidity, air changes and particulate counts to NABH & JCI standards.', long_desc: '', icon_url: null, order_index: 3, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '4', title: 'Clean Room Solutions',         slug: 'clean-room-solutions',         short_desc: 'ISO 5–8 classified modular clean rooms designed for pharmaceutical manufacturing, medical device production and research environments.', long_desc: '', icon_url: null, order_index: 4, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '5', title: 'Laminar Air Flow Systems',     slug: 'laminar-air-flow-systems',     short_desc: 'Vertical and horizontal LAF units providing unidirectional, particle-free airflow for OT tables, ICU bays, pharmacy and laboratory environments.', long_desc: '', icon_url: null, order_index: 5, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '6', title: 'Modular ICU Solutions',        slug: 'modular-icu-solutions',        short_desc: 'Fully integrated modular ICUs with built-in medical gas outlets, nurse call, pendant systems, controlled lighting and ISO 7 clean air.', long_desc: '', icon_url: null, order_index: 6, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '7', title: 'Modular NICU Solutions',       slug: 'modular-nicu-solutions',       short_desc: 'Purpose-designed neonatal intensive care environments with thermal regulation, low-noise airflow, infection control and specialist medical gas provisions.', long_desc: '', icon_url: null, order_index: 7, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
  { id: '8', title: 'IVF Lab Setup',                slug: 'ivf-lab-setup',                short_desc: 'Turnkey IVF laboratory build-outs meeting ISO 5 requirements — VOC-free materials, precision humidity control and dedicated air handling units.', long_desc: '', icon_url: null, order_index: 8, is_active: true, meta_title: null, meta_desc: null, created_at: '', updated_at: '' },
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
      <main>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="pt-36 pb-16 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A8FD4] mb-4">What We Do</p>
            <h1 className="text-5xl sm:text-6xl font-black text-[#0F1F3A] tracking-tight leading-tight mb-5">
              Specialised Healthcare<br />
              <span style={{ color: '#2060B0' }}>Infrastructure Services</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              From sterile operating theatres to medical gas networks — eight end-to-end services trusted by 185+ hospitals across India.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {WHY.map((w) => (
                <span
                  key={w}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600"
                  style={{ boxShadow: '0 2px 10px rgba(26,58,107,0.08)' }}
                >
                  <CheckCircle size={11} className="text-[#3A8FD4] shrink-0" />
                  {w}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Grid ────────────────────────────────────── */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => {
                const num = String(i + 1).padStart(2, '0');
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5"
                    style={{ boxShadow: '0 2px 16px rgba(26,58,107,0.08)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(26,58,107,0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 16px rgba(26,58,107,0.08)')}
                  >
                    {/* Card header */}
                    <div
                      className="relative h-44 flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ background: 'rgba(32,96,176,0.06)' }}
                    >
                      {service.icon_url ? (
                        <img
                          src={service.icon_url}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span
                          className="text-[110px] font-black leading-none select-none"
                          style={{ color: '#2060B0', opacity: 0.06 }}
                        >
                          {num}
                        </span>
                      )}
                      <span
                        className="absolute top-3 left-4 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full"
                        style={{ background: '#2060B0', color: 'white' }}
                      >
                        {num}
                      </span>
                    </div>

                    {/* Accent line on hover */}
                    <div
                      className="h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(90deg, #1A3A6B, #3A8FD4)' }}
                    />

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h2
                        className="font-bold text-[#0F1F3A] text-[15px] leading-snug mb-2.5 transition-colors duration-200"
                        style={{}}
                        onMouseEnter={() => {}}
                      >
                        {service.title}
                      </h2>
                      <p className="text-slate-500 text-[13px] leading-relaxed flex-1">
                        {service.short_desc}
                      </p>
                      <div className="flex items-center gap-1.5 mt-5 text-[#2060B0] text-[12px] font-semibold">
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
            <div
              className="rounded-3xl p-10 md:p-16 text-center"
              style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)', boxShadow: '0 4px 40px rgba(26,58,107,0.25)' }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Need a Custom Solution?</h2>
              <p className="text-[#B8D5EC] text-base mb-8 max-w-lg mx-auto">
                Every hospital is unique. Let's design a solution tailored to your exact requirements and budget.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white font-bold text-sm rounded-full transition-all hover:-translate-y-0.5"
                style={{ color: '#1A3A6B', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              >
                Talk to an Expert <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
