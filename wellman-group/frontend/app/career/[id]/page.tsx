'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Clock, CheckCircle, Upload, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { jobsApi, uploadApi } from '@/lib/api';
import type { JobOpening, JobApplicationCreate } from '@/types/job';

const EMPTY: JobApplicationCreate = {
  applicant_name: '',
  email: '',
  phone: '',
  resume_url: '',
  cover_letter: '',
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState<JobApplicationCreate>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    jobsApi.get(id)
      .then(({ data }) => setJob(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function f(key: keyof JobApplicationCreate, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadApi.pdf(file);
      f('resume_url', data.url);
    } catch {
      setError('Resume upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.applicant_name || !form.email || !form.phone || !form.resume_url) {
      setError('Name, Email, Phone and Resume are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await jobsApi.apply(id!, form);
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-5">
            <div className="h-8 bg-white/60 rounded-2xl w-1/3" />
            <div className="h-14 bg-white/60 rounded-2xl w-2/3" />
            <div className="h-48 bg-white/60 rounded-3xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !job) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Job Not Found</h1>
          <Link href="/career" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E63DD] text-white font-semibold text-sm rounded-full">
            <ArrowLeft size={15} /> Back to Careers
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const bulletLines = (text: string) =>
    text.split('\n').filter((l) => l.trim()).map((l) => l.replace(/^[-•*]\s*/, ''));

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(62,99,221,0.15) 0%, transparent 65%)', filter: 'blur(48px)' }} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/career" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#3E63DD] transition-colors mb-8">
              <ArrowLeft size={14} /> All Openings
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-3">Career Opportunity</p>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">{job.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-white rounded-full text-xs font-medium text-slate-600">
                    <MapPin size={11} className="text-[#3E63DD]" /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-white rounded-full text-xs font-medium text-slate-600">
                    <Briefcase size={11} className="text-[#3E63DD]" /> {job.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-white rounded-full text-xs font-medium text-slate-600">
                    <Clock size={11} className="text-[#3E63DD]" /> {job.job_type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full text-xs font-semibold text-green-700">
                    Actively Hiring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Job details */}
              <div className="lg:col-span-2 space-y-5">
                {job.description && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7">
                    <h2 className="text-lg font-black text-slate-900 mb-4">About the Role</h2>
                    <div className="space-y-3">
                      {bulletLines(job.description).map((p, i) => (
                        <p key={i} className="text-slate-600 text-sm leading-relaxed">{p}</p>
                      ))}
                    </div>
                  </div>
                )}

                {job.responsibilities && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7">
                    <h2 className="text-lg font-black text-slate-900 mb-4">Responsibilities</h2>
                    <ul className="space-y-2.5">
                      {bulletLines(job.responsibilities).map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle size={14} className="text-[#3E63DD] shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-sm">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.requirements && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7">
                    <h2 className="text-lg font-black text-slate-900 mb-4">Requirements</h2>
                    <ul className="space-y-2.5">
                      {bulletLines(job.requirements).map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E63DD] shrink-0 mt-1.5" />
                          <span className="text-slate-600 text-sm">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7" id="apply">
                  <h2 className="text-lg font-black text-slate-900 mb-6">Apply for this Position</h2>

                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={28} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Application Submitted!</h3>
                      <p className="text-slate-500 text-sm">We'll review your application and get back to you within 3–5 business days.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                          <input value={form.applicant_name} onChange={(e) => f('applicant_name', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your full name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                          <input type="email" value={form.email} onChange={(e) => f('email', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                        <input value={form.phone} onChange={(e) => f('phone', e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume (PDF) <span className="text-red-500">*</span></label>
                        {form.resume_url ? (
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <CheckCircle size={16} className="text-green-500 shrink-0" />
                            <span className="text-sm text-slate-600 flex-1 truncate">Resume uploaded successfully</span>
                            <button type="button" onClick={() => f('resume_url', '')} className="text-slate-400 hover:text-red-500 transition-colors"><X size={15} /></button>
                          </div>
                        ) : (
                          <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#3E63DD] hover:bg-blue-50/40 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload size={18} className="text-slate-400 mb-1" />
                            <span className="text-sm text-slate-500">{uploading ? 'Uploading…' : 'Click to upload your CV/Resume (PDF)'}</span>
                            <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
                          </label>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Letter <span className="text-slate-400 font-normal">(optional)</span></label>
                        <textarea value={form.cover_letter ?? ''} onChange={(e) => f('cover_letter', e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Why do you want to join Wellman Group?" />
                      </div>

                      {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

                      <button type="submit" disabled={submitting || uploading} className="w-full py-3 bg-[#3E63DD] text-white font-bold text-sm rounded-xl hover:bg-[#3558c8] disabled:opacity-50 transition-colors shadow-md shadow-blue-500/25">
                        {submitting ? 'Submitting…' : 'Submit Application'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Job Info</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Department', value: job.department },
                      { label: 'Location', value: job.location },
                      { label: 'Type', value: job.job_type },
                      { label: 'Status', value: 'Open' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#ECEEF8] rounded-2xl p-5">
                  <p className="text-xs font-bold text-slate-700 mb-2">Questions?</p>
                  <p className="text-xs text-slate-500 mb-4">Reach out to us before applying.</p>
                  <a href="mailto:info@wellmangroup.in" className="text-xs font-semibold text-[#3E63DD] hover:underline">info@wellmangroup.in</a>
                </div>
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
