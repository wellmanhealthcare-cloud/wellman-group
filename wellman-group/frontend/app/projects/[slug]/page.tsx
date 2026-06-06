'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Building2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/types/project';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    projectsApi.get(slug)
      .then(({ data }) => setProject(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/60 rounded-2xl w-1/3" />
              <div className="h-16 bg-white/60 rounded-2xl w-2/3" />
              <div className="h-64 bg-white/60 rounded-3xl w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !project) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Project Not Found</h1>
          <p className="text-slate-500 mb-8">This project doesn't exist or has been removed.</p>
          <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E63DD] text-white font-semibold text-sm rounded-full">
            <ArrowLeft size={15} /> Back to Projects
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const images = project.images ?? [];

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
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#3E63DD] transition-colors mb-8">
              <ArrowLeft size={14} /> All Projects
            </Link>
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Project</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              {project.title}
            </h1>
            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-white rounded-full text-xs font-medium text-slate-600">
                <MapPin size={11} className="text-[#3E63DD]" /> {project.city}, {project.state}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-white rounded-full text-xs font-medium text-slate-600">
                <Building2 size={11} className="text-[#3E63DD]" /> {project.client_name}
              </span>
              {project.completion_date && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-white rounded-full text-xs font-medium text-slate-600">
                  <Calendar size={11} className="text-[#3E63DD]" /> {project.completion_date}
                </span>
              )}
              {project.is_featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3E63DD] rounded-full text-xs font-bold text-white">
                  Featured Project
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main */}
              <div className="lg:col-span-2 space-y-5">

                {/* Image gallery */}
                {images.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm overflow-hidden">
                    {/* Main image */}
                    <div className="relative aspect-video bg-slate-100">
                      <img
                        src={images[activeImg].image_url}
                        alt={images[activeImg].caption ?? project.title}
                        className="w-full h-full object-cover"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImg((prev) => (prev - 1 + images.length) % images.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ChevronLeft size={16} className="text-slate-700" />
                          </button>
                          <button
                            onClick={() => setActiveImg((prev) => (prev + 1) % images.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ChevronRight size={16} className="text-slate-700" />
                          </button>
                        </>
                      )}
                    </div>
                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {images.map((img, i) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImg(i)}
                            className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#3E63DD]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {project.description && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
                    <h2 className="text-xl font-black text-slate-900 mb-5">Project Overview</h2>
                    <div className="space-y-4">
                      {project.description.split('\n').filter((p) => p.trim()).map((p, i) => (
                        <p key={i} className="text-slate-600 leading-relaxed text-sm">{p}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Project info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Project Details</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Client', value: project.client_name },
                      { label: 'Location', value: `${project.city}, ${project.state}` },
                      { label: 'Completed', value: project.completion_date || '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-[#3E63DD] rounded-2xl p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Start Your Project</p>
                  <p className="text-sm text-blue-100 mb-5 leading-relaxed">Want a similar setup for your hospital? Let's talk.</p>
                  <a
                    href="https://wa.me/919409428888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-[#3E63DD] font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <MessageCircle size={14} /> WhatsApp Us
                  </a>
                  <Link href="/contact" className="flex items-center justify-center w-full py-2.5 mt-2 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors">
                    Send Inquiry
                  </Link>
                </div>

                {/* Back */}
                <Link href="/projects" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#3E63DD] transition-colors">
                  <ArrowLeft size={14} /> View all projects
                </Link>
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
