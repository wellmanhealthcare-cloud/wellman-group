'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { projectsApi, productsApi } from '@/lib/api';
import type { ProjectListItem } from '@/types/project';
import type { Product } from '@/types/service';

const CARD_GRADIENTS = [
  'from-blue-600 to-indigo-700',
  'from-indigo-600 to-violet-700',
  'from-violet-600 to-purple-700',
  'from-cyan-600 to-blue-700',
  'from-blue-700 to-indigo-800',
  'from-indigo-500 to-blue-600',
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.list()
      .then(({ data }) => setProjects(data.filter((p) => p.is_active)))
      .catch(() => {})
      .finally(() => setLoading(false));
    productsApi.list()
      .then(({ data }) => setProducts(data.filter((s) => s.is_active)))
      .catch(() => {});
  }, []);

  const filtered = activeProduct === 'all'
    ? projects
    : projects.filter((p) => p.service_id === activeProduct);

  const cities = [...new Set(projects.map((p) => p.city))].sort();

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
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Our Work</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Our{' '}
              <span style={{ background: 'linear-gradient(135deg, #3E63DD, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Projects
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              {projects.length > 0
                ? `185+ completed projects across ${cities.length} cities in India.`
                : '185+ completed healthcare infrastructure projects across 45+ cities in India.'}
            </p>
          </div>
        </section>

        {/* ── Filters ──────────────────────────────────────────── */}
        {products.length > 0 && (
          <section className="pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveProduct('all')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeProduct === 'all'
                      ? 'bg-[#3E63DD] text-white shadow-md shadow-blue-500/25'
                      : 'bg-white/80 text-slate-600 border border-white hover:bg-white'
                  }`}
                >
                  All Projects {activeProduct === 'all' && `(${projects.length})`}
                </button>
                {products.map((s) => {
                  const count = projects.filter((p) => p.service_id === s.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveProduct(s.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        activeProduct === s.id
                          ? 'bg-[#3E63DD] text-white shadow-md shadow-blue-500/25'
                          : 'bg-white/80 text-slate-600 border border-white hover:bg-white'
                      }`}
                    >
                      {s.title} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Grid ─────────────────────────────────────────────── */}
        <section className="pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl bg-white/60 animate-pulse h-52" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm">No projects found for this filter.</p>
                <button onClick={() => setActiveProduct('all')} className="mt-4 text-[#3E63DD] text-sm font-semibold hover:underline">
                  Show all projects
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((project, i) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-60"
                  >
                    {project.cover_image_url ? (
                      <>
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10" />
                      </>
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
                      </div>
                    )}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin size={12} className="text-white/60" />
                        <span className="text-white/70 text-xs font-medium">{project.city}, {project.state}</span>
                      </div>
                      <h2 className="text-white font-bold text-base leading-snug mb-1">{project.title}</h2>
                      <p className="text-white/60 text-xs">{project.client_name}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-white/70 group-hover:text-white transition-colors">
                        <span className="text-xs font-semibold">View Project</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
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
