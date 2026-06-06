'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { inquiriesApi, settingsApi } from '@/lib/api';
import type { InquiryCreate } from '@/types/inquiry';
import type { SiteSettings } from '@/types/settings';

const EMPTY: InquiryCreate = {
  full_name: '',
  company_name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const SUBJECTS = [
  'Modular Operation Theatre',
  'Medical Gas Pipeline System',
  'HVAC & Cleanroom Engineering',
  'Clean Room Solutions',
  'Laminar Air Flow Systems',
  'Modular ICU / NICU',
  'IVF Lab Setup',
  'General Inquiry',
];

export default function ContactPage() {
  const [form, setForm] = useState<InquiryCreate>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    settingsApi.get().then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  function f(key: keyof InquiryCreate, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.subject || !form.message) {
      setError('All fields except Company Name are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await inquiriesApi.submit(form);
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  const phone = settings?.phone_primary ?? '+91 94094 28888';
  const email = settings?.email_primary ?? 'info@wellmangroup.in';
  const whatsapp = settings?.whatsapp_number?.replace(/\D/g, '') ?? '919409428888';
  const address = settings?.unit_address ?? '50,51,88 Parishram Industrial Hub, Vasna Chacharwadi, Sarkhej-Bavla Highway, Changodar, Ahmedabad 382213';
  const officeAddress = settings?.office_address ?? 'B-414, WTT (World Trade Tower), Nr. Sarkhej-Sanand Cross Road, Makrba, Off S.G. Highway, Ahmedabad';
  const mapsUrl = settings?.google_maps_url;

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
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Get in Touch</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Let's{' '}
              <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Talk
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Have a project in mind? We'd love to hear about it. Send us a message or reach out directly.
            </p>
          </div>
        </section>

        {/* ── Main ─────────────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-8">

              {/* Form — wider */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7 md:p-10">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Send Us an Inquiry</h2>

                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Message Received!</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">We'll get back to you within 24 hours. For urgent queries, WhatsApp us directly.</p>
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green-500 text-white font-semibold text-sm rounded-full hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle size={15} /> WhatsApp Us
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                          <input value={form.full_name} onChange={(e) => f('full_name', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dr. John Smith" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company / Hospital</label>
                          <input value={form.company_name ?? ''} onChange={(e) => f('company_name', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apollo Hospitals" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                          <input type="email" value={form.email} onChange={(e) => f('email', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@hospital.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                          <input value={form.phone} onChange={(e) => f('phone', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject / Service <span className="text-red-500">*</span></label>
                        <select value={form.subject} onChange={(e) => f('subject', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="">Select a service or topic…</option>
                          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                        <textarea value={form.message} onChange={(e) => f('message', e.target.value)} rows={5} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Tell us about your project — hospital name, city, scope of work, timeline…" />
                      </div>

                      {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

                      <button type="submit" disabled={submitting} className="w-full py-3.5 bg-[#3E63DD] text-white font-bold text-sm rounded-xl hover:bg-[#3558c8] disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/25">
                        {submitting ? 'Sending…' : 'Send Inquiry'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Info sidebar */}
              <div className="lg:col-span-2 space-y-5">
                {/* Quick contact */}
                <div className="bg-[#3E63DD] rounded-2xl p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-4">Direct Contact</p>
                  <div className="space-y-4">
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <Phone size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200">Call us</p>
                        <p className="text-sm font-semibold text-white group-hover:underline">{phone}</p>
                      </div>
                    </a>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <Mail size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200">Email us</p>
                        <p className="text-sm font-semibold text-white group-hover:underline">{email}</p>
                      </div>
                    </a>
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-xl bg-green-500/80 flex items-center justify-center shrink-0">
                        <MessageCircle size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200">WhatsApp</p>
                        <p className="text-sm font-semibold text-white group-hover:underline">{phone}</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Addresses */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Our Addresses</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#3E63DD]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={13} className="text-[#3E63DD]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-0.5">Unit / Works</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#3E63DD]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={13} className="text-[#3E63DD]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-0.5">Corporate Office</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{officeAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response time */}
                <div className="bg-[#ECEEF8] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs font-bold text-slate-700">Typical Response Time</p>
                  </div>
                  <p className="text-2xl font-black text-[#3E63DD]">&lt; 24 hours</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            {mapsUrl && (
              <div className="mt-8 rounded-3xl overflow-hidden border border-white shadow-sm h-80">
                <iframe
                  src={mapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
