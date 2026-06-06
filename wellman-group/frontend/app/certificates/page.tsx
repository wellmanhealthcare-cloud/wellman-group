'use client';

import { useEffect, useState } from 'react';
import { FileText, ExternalLink, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { certificatesApi } from '@/lib/api';
import type { Certificate } from '@/types/certificate';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificatesApi.list()
      .then(({ data }) => setCerts(data.filter((c) => c.is_active)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)', filter: 'blur(48px)' }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(62,99,221,0.12) 0%, transparent 65%)', filter: 'blur(56px)' }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Credentials</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Our{' '}
              <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Certifications
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Every project we deliver meets the highest quality, safety and compliance standards — backed by internationally recognised certifications.
            </p>
          </div>
        </section>

        {/* ── Certs Grid ───────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-white/60 rounded-2xl animate-pulse" />)}
              </div>
            ) : certs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm">Certificates will appear here once added.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {certs.map((cert) => {
                  const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
                  return (
                    <div key={cert.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#3E63DD]/10 rounded-2xl flex items-center justify-center shrink-0">
                          <FileText size={22} className="text-[#3E63DD]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{cert.title}</h3>
                            {isExpired ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-500 rounded-full shrink-0">Expired</span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-50 text-green-600 rounded-full shrink-0">Valid</span>
                            )}
                          </div>
                          <p className="text-[#3E63DD] text-xs font-medium mt-0.5">{cert.issuing_body}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                              <Calendar size={10} /> Issued: {cert.issue_date}
                            </span>
                            {cert.expiry_date && (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                Expires: {cert.expiry_date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E63DD] hover:underline"
                        >
                          <ExternalLink size={12} /> View Certificate
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Trust strip ──────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Compliance Standards We Follow</h2>
                <p className="text-slate-500 text-sm">Every project meets these regulatory requirements</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['NABH', 'AERB', 'ISO 9001', 'CGMP', 'ASHRAE', 'HEPA', 'BIS', 'WHO-GMP'].map((std) => (
                  <div key={std} className="bg-[#ECEEF8] rounded-2xl p-4 text-center">
                    <p className="font-black text-[#3E63DD] text-lg">{std}</p>
                  </div>
                ))}
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
