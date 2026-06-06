'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MapPin, ExternalLink, FileText, LayoutGrid, Gauge, Wind, HeartPulse } from 'lucide-react';
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
  { value: '12+',  label: 'Years Experience',  accent: '#1A3A6B' },
  { value: '185+', label: 'Hospitals Served',   accent: '#2060B0' },
  { value: '45+',  label: 'Cities Covered',     accent: '#3A8FD4' },
  { value: '8',    label: 'Core Services',      accent: '#7DC0E4' },
];

const services = [
  { label: 'Modular OT',       sub: 'Design & installation',    icon: LayoutGrid,  accent: '#1A3A6B' },
  { label: 'MGPS',             sub: 'Medical gas pipelines',     icon: Gauge,       accent: '#2060B0' },
  { label: 'HVAC & Cleanroom', sub: 'ISO 5 certified solutions', icon: Wind,        accent: '#3A8FD4' },
  { label: 'ICU / NICU / IVF', sub: 'Critical care units',      icon: HeartPulse,  accent: '#7DC0E4' },
];

export default function AboutPage() {
  const [team, setTeam]   = useState<TeamMember[]>([]);
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
        <section className="pt-36 pb-16 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A8FD4] mb-4">About Us</p>
            <h1 className="text-5xl sm:text-6xl font-black text-[#0F1F3A] tracking-tight leading-tight mb-5">
              Building the Future of{' '}
              <span style={{ color: '#2060B0' }}>Healthcare</span>
            </h1>
            <p className="text-[#475569] text-lg leading-relaxed">
              Established in 2011, Wellman Group is a pluridisciplinary healthcare infrastructure company — delivering world-class Modular OT, MGPS, HVAC and cleanroom solutions to hospitals across India.
            </p>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ value, label, accent }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl px-6 py-8 text-center"
                  style={{ borderTop: `3px solid ${accent}`, boxShadow: '0 4px 24px rgba(26,58,107,0.08)' }}
                >
                  <p className="text-4xl font-black mb-1.5" style={{ color: accent }}>{value}</p>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Story ────────────────────────────────────────────── */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Visual card */}
              <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 40px rgba(26,58,107,0.12)' }}>

                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <img src="/wellman_logo.png" alt="Wellman" className="w-11 h-11 object-contain" />
                  <div>
                    <p className="font-black text-[#0F1F3A]">Wellman Group</p>
                    <p className="text-xs text-slate-400 mt-0.5">Healthcare Infrastructure</p>
                  </div>
                </div>

                {/* Location pill */}
                <div className="flex items-center gap-2 mb-6 px-3.5 py-2.5 rounded-xl" style={{ background: 'rgba(32,96,176,0.07)' }}>
                  <MapPin size={13} className="text-[#2060B0] shrink-0" />
                  <span className="text-xs text-[#2060B0] font-medium">Changodar, Ahmedabad, Gujarat</span>
                </div>

                {/* Services grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {services.map(({ label, sub, icon: Icon, accent }) => (
                    <div
                      key={label}
                      className="rounded-2xl p-4"
                      style={{ background: `${accent}10`, border: `1px solid ${accent}22` }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: accent }}
                      >
                        <Icon size={16} color="white" />
                      </div>
                      <p className="text-sm font-bold text-[#0F1F3A] leading-tight">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 pt-5 border-t border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                  <p className="text-xs text-slate-500 font-medium">Serving hospitals across India since 2011</p>
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A8FD4] mb-3">Our Story</p>
                <h2 className="text-4xl sm:text-5xl font-black text-[#0F1F3A] tracking-tight leading-tight mb-5">
                  12+ Years of{' '}
                  <span style={{ color: '#2060B0' }}>Excellence</span>
                </h2>
                <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                  Set up in 2011, Wellman Group is a pluridisciplinary organisation backed by a young, enthusiastic and well-qualified team of Biomedical Engineers and MBAs with sound experience in the healthcare sector. We operate in the field of hospital projects with expertise in Modular Operation Theatre, Medical Gas Pipeline System, and the planning, designing and supply of clean room facilities as per NABH/ISO 5 guidelines.
                </p>
                <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                  Our in-house engineering team handles AutoCAD design for Modular Panels, HVAC Systems and Medical Gas Pipelines — with consultancy services for hospital engineering departments as per NABH and JCI standards.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={15} className="text-[#3A8FD4] shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded-full transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #2060B0, #1A3A6B)', boxShadow: '0 4px 16px rgba(26,58,107,0.25)' }}
                >
                  Get in Touch <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission & Vision ─────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A8FD4] mb-3">What Drives Us</p>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0F1F3A] tracking-tight">Mission &amp; Vision</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mission */}
              <div
                className="rounded-3xl p-8 text-white"
                style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)', boxShadow: '0 4px 32px rgba(26,58,107,0.20)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#7DC0E4] mb-3">Our Mission</p>
                <h3 className="text-2xl font-black mb-4">Innovative &amp; Affordable Solutions</h3>
                <p className="text-[#B8D5EC] leading-relaxed text-sm">
                  By giving innovative and affordable solutions and products with timely post-sales services, enhancing the quality of treatment and services provided by the hospital to the patients.
                </p>
              </div>
              {/* Vision */}
              <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 32px rgba(26,58,107,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#3A8FD4] mb-3">Our Vision</p>
                <h3 className="text-2xl font-black text-[#0F1F3A] mb-4">Leading Healthcare Infrastructure Partner</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  To be the leading manufacturer, supplier, service provider and technological consultant of Modular O.T., Medical Gas Pipeline System and OT-ICU-NICU-CSSD equipment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────── */}
        {team.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A8FD4] mb-3">The People</p>
                <h2 className="text-4xl sm:text-5xl font-black text-[#0F1F3A] tracking-tight">Meet Our Team</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ boxShadow: '0 2px 16px rgba(26,58,107,0.08)' }}
                  >
                    <div className="h-48 flex items-center justify-center" style={{ background: 'rgba(58,143,212,0.08)' }}>
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2060B0, #1A3A6B)' }}>
                          <span className="text-white text-3xl font-black">{member.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-bold text-[#0F1F3A] text-sm">{member.name}</p>
                      <p className="text-[#2060B0] text-xs font-medium mt-0.5">{member.designation}</p>
                      {member.bio && <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2">{member.bio}</p>}
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-slate-400 hover:text-[#2060B0] transition-colors">
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
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A8FD4] mb-3">Credentials</p>
                <h2 className="text-4xl sm:text-5xl font-black text-[#0F1F3A] tracking-tight">Our Certifications</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white rounded-2xl p-5 flex items-start gap-4"
                    style={{ boxShadow: '0 2px 16px rgba(26,58,107,0.07)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(32,96,176,0.08)' }}>
                      <FileText size={18} className="text-[#2060B0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0F1F3A] text-sm">{cert.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{cert.issuing_body}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Issued: {cert.issue_date}{cert.expiry_date ? ` · Expires: ${cert.expiry_date}` : ''}
                      </p>
                    </div>
                    {cert.file_url && (
                      <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="text-[#2060B0] hover:underline text-xs font-semibold shrink-0">View</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-3xl p-10 md:p-14 text-center"
              style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)', boxShadow: '0 4px 40px rgba(26,58,107,0.25)' }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Build Something Great?</h2>
              <p className="text-[#B8D5EC] text-base mb-8 max-w-lg mx-auto">Let's discuss your next healthcare infrastructure project.</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white font-bold text-sm rounded-full transition-all hover:-translate-y-0.5"
                style={{ color: '#1A3A6B', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              >
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
