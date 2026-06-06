'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MapPin, ExternalLink, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { teamApi, certificatesApi } from '@/lib/api';
import type { TeamMember } from '@/types/team';
import type { Certificate } from '@/types/certificate';

const highlights = [
  'NABH, AERB & international compliance standards',
  'Biomedical engineers on every project',
  'End-to-end — design, supply, install & commission',
  'Pan-India after-sales support network',
  'ISO certified processes',
  '12+ years of healthcare infrastructure experience',
];

const stats = [
  { value: '12+', label: 'Years Experience', bg: 'bg-[#ECEEF8]', color: 'text-[#3E63DD]' },
  { value: '185+', label: 'Hospitals Served', bg: 'bg-[#3E63DD]', color: 'text-white', sub: 'text-blue-200' },
  { value: '45+', label: 'Cities Covered', bg: 'bg-[#6366f1]', color: 'text-white', sub: 'text-indigo-200' },
  { value: '8', label: 'Core Services', bg: 'bg-[#ECEEF8]', color: 'text-[#8b5cf6]' },
];

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    teamApi.list().then(({ data }) => setTeam(data.filter((m) => m.is_active))).catch(() => {});
    certificatesApi.list().then(({ data }) => setCerts(data.filter((c) => c.is_active))).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)', filter: 'blur(48px)' }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(62,99,221,0.12) 0%, transparent 65%)', filter: 'blur(56px)' }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">About Us</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Building the Future of{' '}
              <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Healthcare
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Established in 2011, Wellman Group is a pluridisciplinary healthcare infrastructure company backed by a team of Biomedical Engineers and MBAs — delivering world-class Modular OT, MGPS, HVAC and cleanroom solutions to hospitals across India.
            </p>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ value, label, bg, color, sub }) => (
                <div key={label} className={`${bg} rounded-3xl p-7 text-center`}>
                  <p className={`text-5xl font-black ${color} mb-1`}>{value}</p>
                  <p className={`text-xs font-medium ${sub ?? 'text-slate-500'}`}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Story ────────────────────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* Visual card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-2xl shadow-slate-200/60 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#3E63DD] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/30">
                    <span className="text-white font-black text-base">W</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Wellman Group</p>
                    <p className="text-xs text-slate-400">Healthcare Infrastructure</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4 p-3 bg-[#ECEEF8] rounded-xl">
                  <MapPin size={13} className="text-[#3E63DD]" />
                  <span className="text-xs font-medium text-slate-600">50,51,88 Parishram Industrial Hub, Changodar, Ahmedabad</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Modular OT Projects', pct: 92 },
                    { label: 'MGPS Installations', pct: 87 },
                    { label: 'HVAC & Cleanrooms', pct: 78 },
                    { label: 'ICU / NICU / IVF', pct: 70 },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-600">{label}</span>
                        <span className="text-xs font-bold text-slate-700">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full">
                        <div className="h-full rounded-full bg-[#3E63DD]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-3">Our Story</p>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                  12+ Years of{' '}
                  <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Excellence
                  </span>
                </h2>
                <p className="text-slate-500 leading-relaxed mb-4">
                  Set up in 2011, Wellman Group is a pluridisciplinary organisation backed by a young, enthusiastic and well-qualified team of Biomedical Engineers and MBAs with sound experience in the healthcare sector. We operate in the field of hospital projects with expertise in Modular Operation Theatre, Medical Gas Pipeline System, and the planning, designing and supply of clean room facilities as per NABH/ISO 5 guidelines.
                </p>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Our in-house engineering team handles AutoCAD design for Modular Panels, HVAC Systems and Medical Gas Pipelines. Our in-house installation team handles Modular Panels, Vinyl Flooring and MGPS — with consultancy services for hospital engineering departments as per NABH and JCI standards.
                </p>
                <ul className="space-y-3 mb-8">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={15} className="text-[#3E63DD] shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E63DD] hover:bg-[#3558c8] text-white font-semibold text-sm rounded-full transition-all shadow-md shadow-blue-500/25 hover:-translate-y-0.5">
                  Get in Touch <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission & Vision ─────────────────────────────────── */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-3">What Drives Us</p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Mission & Vision</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#3E63DD] rounded-3xl p-8 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Our Mission</p>
                <h3 className="text-2xl font-black mb-4">Innovative &amp; Affordable Solutions</h3>
                <p className="text-blue-100 leading-relaxed text-sm">
                  By giving innovative and affordable solutions and products with timely post-sales services, enhancing the quality of treatment and services provided by the hospital to the patients.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-xl p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#3E63DD] mb-3">Our Vision</p>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Leading Healthcare Infrastructure Partner</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  To be the leading manufacturer, supplier, service provider and technological consultant of Modular O.T., Medical Gas Pipeline System and OT-ICU-NICU-CSSD equipment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────── */}
        {team.length > 0 && (
          <section className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-3">The People</p>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Meet Our Team</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {team.map((member) => (
                  <div key={member.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="h-48 bg-[#ECEEF8] flex items-center justify-center">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#3E63DD] flex items-center justify-center">
                          <span className="text-white text-3xl font-black">{member.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                      <p className="text-[#3E63DD] text-xs font-medium mt-0.5">{member.designation}</p>
                      {member.bio && <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2">{member.bio}</p>}
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-slate-400 hover:text-[#3E63DD] transition-colors">
                          <ExternalLink size={12} /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Certificates ─────────────────────────────────────── */}
        {certs.length > 0 && (
          <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-3">Credentials</p>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Our Certifications</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certs.map((cert) => (
                  <div key={cert.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3E63DD]/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-[#3E63DD]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{cert.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{cert.issuing_body}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Issued: {cert.issue_date}{cert.expiry_date ? ` · Expires: ${cert.expiry_date}` : ''}
                      </p>
                    </div>
                    <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="text-[#3E63DD] hover:underline text-xs font-medium shrink-0">View</a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#3E63DD] rounded-3xl p-10 md:p-14 text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Build Something Great?</h2>
              <p className="text-blue-100 text-base mb-8 max-w-lg mx-auto">Let's discuss your next healthcare infrastructure project.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3E63DD] font-bold text-sm rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
                Contact Us <ArrowRight size={16} />
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
