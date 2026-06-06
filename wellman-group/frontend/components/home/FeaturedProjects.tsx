'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import type { ProjectListItem } from '@/types/project';


export default function FeaturedProjects() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.list()
      .then(({ data }) => setProjects(data.filter((p) => p.is_featured && p.is_active).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && projects.length === 0) return null;

  const items = projects.length > 0 ? [...projects, ...projects] : [];

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <style>{`
        @keyframes wg-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .wg-marquee-track {
          animation: wg-marquee 38s linear infinite;
          will-change: transform;
        }
        .wg-marquee-wrap:hover .wg-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[#3A8FD4] text-xs font-semibold uppercase tracking-widest mb-3">Our Work</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Featured Projects</h2>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-[#2060B0] font-semibold text-sm hover:gap-3 transition-all shrink-0">
            View All <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-5 px-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white animate-pulse h-56 w-80 shrink-0" />
          ))}
        </div>
      ) : (
        <div className="wg-marquee-wrap">
          <div className="wg-marquee-track flex gap-5" style={{ width: 'max-content' }}>
            {items.map((project, i) => (
              <Link
                key={`${project.id}-${i}`}
                href={`/projects/${project.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-80 h-56 shrink-0"
              >
                {project.cover_image_url ? (
                  <>
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,58,107,0.85) 0%, rgba(26,58,107,0.4) 50%, transparent)' }} />
                  </>
                ) : (
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)' }} />
                )}
                <div className="relative z-10 h-full flex flex-col justify-end p-5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin size={11} className="text-white/60" />
                    <span className="text-white/70 text-xs">{project.city}, {project.state}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug mb-1">{project.title}</h3>
                  <p className="text-white/60 text-xs">{project.client_name}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-white/60 group-hover:text-white transition-colors">
                    <span className="text-xs font-semibold">View Project</span>
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
