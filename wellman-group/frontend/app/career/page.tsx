'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, Clock, ArrowRight, Send, CheckCircle, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { jobsApi, inquiriesApi } from '@/lib/api';
import type { JobOpening } from '@/types/job';

const ROLES = [
  'Biomedical Engineer',
  'HVAC Engineer',
  'Project Manager',
  'Site Supervisor',
  'Sales Executive',
  'Design Engineer',
  'Other',
];

export default function CareerPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  function f(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setFormError('Name, email and phone are required.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await inquiriesApi.submit({
        full_name: form.name,
        company_name: form.role || 'Career Application',
        email: form.email,
        phone: form.phone,
        subject: `Career Application${form.role ? ` — ${form.role}` : ''}`,
        message: form.message || `I am interested in joining Wellman Group${form.role ? ` as ${form.role}` : ''}.`,
      });
      setSubmitted(true);
    } catch {
      setFormError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    jobsApi.list()
      .then(({ data }) => setJobs(data.filter((j) => j.is_open)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const departments = [...new Set(jobs.map((j) => j.department))].sort();

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
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Join the Team</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Build Your{' '}
              <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Career
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Join a team of engineers, biomedical professionals and project managers building India's healthcare infrastructure.
            </p>
          </div>
        </section>

        {/* ── Why Join ─────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: 'Meaningful Work', desc: 'Every project you deliver improves patient outcomes at real hospitals.' },
                { title: 'Pan-India Exposure', desc: 'Work across 45+ cities with diverse hospital clients and projects.' },
                { title: 'Expert Team', desc: 'Learn from biomedical engineers and MBAs with 12+ years of experience.' },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6">
                  <div className="w-8 h-8 rounded-xl bg-[#3E63DD]/10 flex items-center justify-center mb-4">
                    <span className="w-3 h-3 rounded-full bg-[#3E63DD]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Job Listings ─────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-1">Open Positions</p>
                <h2 className="text-3xl font-black text-slate-900">
                  {loading ? 'Loading…' : jobs.length === 0 ? 'No Openings Right Now' : `${jobs.length} Open Position${jobs.length > 1 ? 's' : ''}`}
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-white/60 rounded-2xl animate-pulse" />)}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">{dept}</p>
                    {jobs.filter((j) => j.department === dept).map((job) => (
                      <Link
                        key={job.id}
                        href={`/career/${job.id}`}
                        className="group flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5 mb-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-[#3E63DD] transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin size={11} className="text-slate-400" /> {job.location}</span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Briefcase size={11} className="text-slate-400" /> {job.department}</span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock size={11} className="text-slate-400" /> {job.job_type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <span className="hidden sm:block text-xs font-semibold text-[#3E63DD] bg-blue-50 px-3 py-1.5 rounded-full">Apply Now</span>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-[#3E63DD] group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* ── Apply Form ───────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-[#3E63DD] px-8 py-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Join the Team</p>
                  <h2 className="text-2xl font-black text-white mb-1">Send Us Your Application</h2>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    No openings right now? Drop your details anyway — we'll reach out when the right role opens up.
                  </p>
                </div>
              </div>

              {/* Form / Success */}
              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Application Received!</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                      We've received your details. Now please send your CV directly so we can keep it on file.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href="https://wa.me/919409428888?text=Hi%2C%20I%20just%20submitted%20my%20application%20on%20your%20website.%20Please%20find%20my%20CV%20attached."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-full hover:bg-[#1ebe5d] transition-all shadow-md"
                      >
                        <MessageCircle size={15} />
                        Send CV on WhatsApp
                      </a>
                      <a
                        href="mailto:info@wellmangroup.in?subject=CV%20Submission&body=Hi%20Wellman%20Group%2C%0A%0APlease%20find%20my%20CV%20attached."
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all"
                      >
                        Send CV via Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                        <input
                          value={form.name}
                          onChange={(e) => f('name', e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E63DD]/30 focus:border-[#3E63DD] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone <span className="text-red-400">*</span></label>
                        <input
                          value={form.phone}
                          onChange={(e) => f('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E63DD]/30 focus:border-[#3E63DD] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => f('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E63DD]/30 focus:border-[#3E63DD] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role You're Interested In</label>
                      <select
                        value={form.role}
                        onChange={(e) => f('role', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3E63DD]/30 focus:border-[#3E63DD] transition-all bg-white"
                      >
                        <option value="">Select a role (optional)</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message / Cover Note</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => f('message', e.target.value)}
                        rows={4}
                        placeholder="Tell us about yourself, your experience and why you'd like to join Wellman Group..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E63DD]/30 focus:border-[#3E63DD] transition-all resize-none"
                      />
                    </div>

                    {formError && (
                      <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{formError}</p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-slate-400">
                        After submitting, you'll be asked to send your CV via WhatsApp or Email.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3E63DD] text-white text-sm font-semibold rounded-full hover:bg-[#3558c8] disabled:opacity-60 transition-all shadow-md hover:-translate-y-0.5"
                      >
                        {submitting ? 'Sending…' : <><Send size={14} /> Submit Application</>}
                      </button>
                    </div>
                  </form>
                )}
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
