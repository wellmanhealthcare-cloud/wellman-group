import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

const highlights = [
  'NABH, AERB & international standards compliance',
  'Biomedical engineers on every project',
  'End-to-end — design, supply, install & commission',
  'Pan-India after-sales support network',
];

export default function AboutSnippet() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Visual */}
          <div className="relative">
            {/* Main card */}
            <div
              className="bg-white rounded-3xl p-8"
              style={{
                border: '1px solid rgba(58,143,212,0.15)',
                boxShadow: '0 2px 12px rgba(26,58,107,0.06)',
              }}
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F5F8FC] rounded-2xl p-5">
                  <p className="text-4xl font-black text-[#2060B0]">12+</p>
                  <p className="text-xs text-slate-500 mt-1">Years Excellence</p>
                </div>
                <div className="bg-[#2060B0] rounded-2xl p-5">
                  <p className="text-4xl font-black text-white">185+</p>
                  <p className="text-xs text-[#B8D5EC] mt-1">Hospitals</p>
                </div>
                <div className="bg-[#3A8FD4] rounded-2xl p-5">
                  <p className="text-4xl font-black text-white">45+</p>
                  <p className="text-xs text-[#B8D5EC] mt-1">Cities</p>
                </div>
                <div className="bg-[#F5F8FC] rounded-2xl p-5">
                  <p className="text-4xl font-black text-[#2060B0]">8</p>
                  <p className="text-xs text-slate-500 mt-1">Core Services</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#F5F8FC] rounded-xl">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-medium text-slate-600">Serving hospitals across India since 2011</p>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3"
              style={{
                boxShadow: '0 8px 32px rgba(26,58,107,0.12)',
                border: '1px solid rgba(58,143,212,0.15)',
              }}
            >
              <p className="text-xs font-semibold text-slate-500">Based in</p>
              <p className="font-bold text-slate-900 text-sm">Ahmedabad, Gujarat</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-[#3A8FD4] text-xs font-semibold uppercase tracking-widest mb-3">
              About Us
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              Building the Future of{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2060B0, #3A8FD4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Healthcare
              </span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6 text-base">
              Established in 2011, Wellman Group is a pluridisciplinary healthcare infrastructure company backed by a team of Biomedical Engineers and MBAs. We specialise in Modular Operation Theatres, Medical Gas Pipeline Systems, HVAC and cleanroom solutions designed and installed as per NABH/ISO 5 guidelines — with an in-house engineering and installation team covering the full project lifecycle.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#3A8FD4] shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded-full transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2060B0, #1A3A6B)', boxShadow: '0 4px 16px rgba(26,58,107,0.25)' }}
            >
              Learn More
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
