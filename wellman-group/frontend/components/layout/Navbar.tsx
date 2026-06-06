'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';

const mainLinks = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact',  href: '/contact' },
];

const moreLinks = [
  { label: 'Our Clients',  href: '/clients' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Career',       href: '/career' },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen]     = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // close mobile on route change
  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const moreActive = moreLinks.some((l) => pathname.startsWith(l.href));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300"
      style={{
        borderBottom: '1px solid rgba(58,143,212,0.14)',
        boxShadow: scrolled ? '0 2px 20px rgba(26,58,107,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <img
              src="/wellman_logo.png"
              alt="Wellman Group"
              className="h-9 w-auto object-contain"
            />
            <span
              className="text-[15px] font-black tracking-widest uppercase"
              style={{ color: '#0F1F3A', letterSpacing: '0.12em' }}
            >
              Wellman Group
            </span>
          </Link>

          {/* ── Desktop nav — centered ────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {mainLinks.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-5 text-[13.5px] font-semibold transition-colors duration-150"
                  style={{
                    color: active ? '#2060B0' : '#475569',
                    borderBottom: active ? '2px solid #2060B0' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#1A3A6B';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#475569';
                  }}
                >
                  {label}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="flex items-center gap-1 px-4 py-5 text-[13.5px] font-semibold transition-colors duration-150"
                style={{
                  color: moreActive ? '#2060B0' : '#475569',
                  borderBottom: moreActive ? '2px solid #2060B0' : '2px solid transparent',
                }}
              >
                More
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200"
                  style={{ transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {moreOpen && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white py-1.5 rounded-xl z-50"
                  style={{
                    border: '1px solid rgba(58,143,212,0.15)',
                    boxShadow: '0 8px 32px rgba(26,58,107,0.12)',
                  }}
                >
                  {moreLinks.map(({ label, href }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors duration-150"
                        style={{ color: active ? '#2060B0' : '#475569', backgroundColor: active ? '#F0F6FC' : 'transparent' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#F0F6FC';
                          (e.currentTarget as HTMLElement).style.color = '#2060B0';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = active ? '#F0F6FC' : 'transparent';
                          (e.currentTarget as HTMLElement).style.color = active ? '#2060B0' : '#475569';
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: active ? '#2060B0' : '#B8D5EC' }}
                        />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ── CTA ──────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="tel:+919409428888"
              className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-150"
              style={{ color: '#2060B0' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#1A3A6B')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#2060B0')}
            >
              <Phone size={13} />
              +91 94094 28888
            </a>
            <div className="w-px h-4 bg-slate-200" />
            <a
              href="https://wa.me/919409428888"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-[13px] font-bold text-white rounded-full transition-all duration-150 hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #2060B0 0%, #1A3A6B 100%)',
                boxShadow: '0 2px 12px rgba(32,96,176,0.35)',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(32,96,176,0.5)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(32,96,176,0.35)')}
            >
              Get a Quote
            </a>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden bg-white border-t"
          style={{ borderColor: 'rgba(58,143,212,0.14)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {[...mainLinks, ...moreLinks].map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    color: active ? '#2060B0' : '#475569',
                    backgroundColor: active ? '#F0F6FC' : 'transparent',
                  }}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#2060B0' }} />
                  )}
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 pb-1 flex flex-col gap-2">
              <a
                href="tel:+919409428888"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors"
                style={{ color: '#2060B0', borderColor: '#3A8FD4' }}
              >
                <Phone size={14} /> +91 94094 28888
              </a>
              <a
                href="https://wa.me/919409428888"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2060B0 0%, #1A3A6B 100%)' }}
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
