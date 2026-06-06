'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { clientsApi } from '@/lib/api';
import type { Client } from '@/types/client';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsApi.list()
      .then(({ data }) => setClients(data.filter((c) => c.is_active)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cities = [...new Set(clients.map((c) => c.city))].sort();

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
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Trusted By</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Our{' '}
              <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Clients
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              185+ hospitals across 45+ cities trust Wellman Group for their critical healthcare infrastructure.
            </p>

            {/* Stats strip */}
            <div className="inline-flex items-center gap-6 bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-8 py-4 shadow-sm">
              {[
                { value: '185+', label: 'Hospitals' },
                { value: '45+', label: 'Cities' },
                { value: '12+', label: 'Years' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-[#3E63DD]">{value}</p>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Logo Grid ────────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-36 bg-white/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : clients.length === 0 ? (
              /* Placeholder when no clients in DB */
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm">Client logos will appear here once added.</p>
              </div>
            ) : (
              <>
                {/* City groups */}
                {cities.map((city) => {
                  const cityClients = clients.filter((c) => c.city === city);
                  return (
                    <div key={city} className="mb-12">
                      <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-sm font-bold text-slate-700">{city}</h2>
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400">{cityClients.length} hospital{cityClients.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {cityClients.map((client) => (
                          <div key={client.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="relative h-28 bg-slate-100">
                              {client.logo_url ? (
                                <img
                                  src={client.logo_url}
                                  alt={client.hospital_name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#ECEEF8] to-[#dde0f5] flex items-center justify-center">
                                  <span className="text-[#3E63DD] text-4xl font-black opacity-20">
                                    {client.hospital_name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="px-3 py-2.5 flex items-center justify-center min-h-[48px]">
                              <p className="text-[11px] text-slate-600 text-center leading-snug font-semibold">{client.hospital_name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#3E63DD] rounded-3xl p-10 md:p-14 text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Join Our Growing Network</h2>
              <p className="text-blue-100 text-base mb-8 max-w-lg mx-auto">Partner with Wellman Group for your next healthcare infrastructure project.</p>
              <a
                href="https://wa.me/919409428888"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3E63DD] font-bold text-sm rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
