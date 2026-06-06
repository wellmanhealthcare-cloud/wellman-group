'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Shield, Activity, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-28 pb-0">

      {/* ── Background blobs ───────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -left-32 w-[640px] h-[640px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.22) 0%, transparent 65%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute top-[15%] -right-20 w-[520px] h-[520px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 60% 35%, rgba(62,99,221,0.18) 0%, transparent 65%)',
            filter: 'blur(56px)',
          }}
        />
        <div
          className="absolute bottom-32 left-[20%] w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.14) 0%, transparent 60%)',
            filter: 'blur(64px)',
          }}
        />
      </div>

      {/* ── Centered heading ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mb-14">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 bg-white/70 backdrop-blur-sm rounded-full border border-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3E63DD] animate-pulse" />
          <span className="text-xs font-semibold text-slate-600 tracking-wide">
            Healthcare Infrastructure Experts · Est. 2011
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black text-slate-900 leading-[1.0] tracking-tight mb-6 max-w-3xl">
          Modern{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3E63DD 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Healthcare
          </span>
          <br />
          Infrastructure
        </h1>

        <p className="text-slate-500 text-lg leading-relaxed max-w-xl mb-9">
          Modular OT, MGPS, HVAC, Cleanroom, ICU and IVF Lab solutions — delivered across{' '}
          <span className="font-semibold text-slate-700">185+ hospitals</span> in 45+ cities.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-0.5"
          >
            Explore Services
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 font-semibold text-sm rounded-full transition-all shadow-md shadow-slate-200 border border-white/90 hover:-translate-y-0.5"
          >
            View Projects
          </Link>
        </div>
      </div>

      {/* ── Browser mockup card ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">

        {/* Dark blob behind the card */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(11,30,63,0.55) 0%, rgba(11,30,63,0) 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Card frame */}
        <div className="relative bg-white/55 backdrop-blur-2xl rounded-3xl border border-white shadow-2xl shadow-slate-400/20 overflow-hidden">

          {/* Browser chrome bar */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-white/50 border-b border-white/60">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-amber-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <div className="flex-1 bg-white/60 rounded-full h-6 flex items-center px-3 mx-2">
              <span className="text-[11px] text-slate-400">wellmangroup.in</span>
            </div>
            <div className="w-16 h-5 rounded-full bg-[#3E63DD]/90 flex items-center justify-center">
              <span className="text-[10px] text-white font-semibold">Get Quote</span>
            </div>
          </div>

          {/* Mock content inside the frame */}
          <div className="p-5 sm:p-7">

            {/* Mini hero text inside mockup */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Healthcare
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                12+ years · 185+ hospitals · 45+ cities
              </p>
            </div>

            {/* Three floating stat/info cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Card 1 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-[#3E63DD] flex items-center justify-center">
                    <Building2 size={13} className="text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">Projects</span>
                </div>
                <p className="text-2xl font-black text-slate-900">185+</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Hospitals served</p>
                <div className="mt-2 h-1 bg-slate-100 rounded-full">
                  <div className="h-full w-[85%] rounded-full bg-[#3E63DD]" />
                </div>
              </div>

              {/* Card 2 — main info */}
              <div className="bg-slate-900 rounded-2xl p-4 shadow-sm col-span-1">
                <p className="text-[10px] text-slate-400 mb-1 font-medium">Active Projects</p>
                <p className="text-2xl font-black text-white">45+</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Cities across India</p>
                <div className="mt-3 flex gap-1">
                  {[65, 85, 50, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-[#3E63DD]/70"
                      style={{ height: `${h * 0.28}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Activity size={13} className="text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">Uptime</span>
                </div>
                <p className="text-2xl font-black text-slate-900">12+</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Years of excellence</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-medium">All systems active</span>
                </div>
              </div>
            </div>

            {/* Bottom row — services mini grid */}
            <div className="grid grid-cols-4 gap-2">
              {['Modular OT', 'MGPS', 'HVAC', 'Clean Room', 'ICU', 'NICU', 'IVF Lab', 'Laminar AF'].map((s, i) => (
                <div
                  key={s}
                  className="bg-white/80 backdrop-blur-sm rounded-xl px-2.5 py-2.5 border border-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#3E63DD]/15 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3E63DD]" />
                    </div>
                    <CheckCircle size={10} className="text-slate-200" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{s}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Floating badges outside the card */}
        <div className="absolute -top-4 -left-2 sm:left-6 z-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white px-4 py-3">
          <p className="text-xl font-black text-[#3E63DD]">NABH</p>
          <p className="text-[10px] text-slate-500 font-medium">Compliant setups</p>
        </div>

        <div className="absolute -top-4 -right-2 sm:right-6 z-20 bg-[#3E63DD] rounded-2xl shadow-xl px-4 py-3">
          <p className="text-xl font-black text-white">8</p>
          <p className="text-[10px] text-blue-200 font-medium">Core Services</p>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Trusted across 45+ Indian cities</span>
          <Shield size={12} className="text-[#3E63DD]" />
        </div>

      </div>

      {/* Bottom fade so the card bleeds into the next section */}
      <div className="relative w-full h-16 mt-10" />
    </section>
  );
}
