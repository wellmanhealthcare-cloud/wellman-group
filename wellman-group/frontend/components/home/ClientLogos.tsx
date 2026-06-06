'use client';

import { useEffect, useState } from 'react';
import { clientsApi } from '@/lib/api';
import type { Client } from '@/types/client';

export default function ClientLogos() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    clientsApi.list()
      .then(({ data }) => setClients(data.filter((c) => c.is_active).slice(0, 40)))
      .catch(() => {});
  }, []);

  if (clients.length === 0) return null;

  const half = Math.ceil(clients.length / 2);
  const row1 = [...clients.slice(0, half), ...clients.slice(0, half)];
  const row2 = [...clients.slice(half), ...clients.slice(half)];

  return (
    <section className="py-16 overflow-hidden">
      <style>{`
        @keyframes wg-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wg-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .wg-row-1 { animation: wg-scroll-left 30s linear infinite; }
        .wg-row-2 { animation: wg-scroll-right 36s linear infinite; }
        .wg-marquee:hover .wg-row-1,
        .wg-marquee:hover .wg-row-2 { animation-play-state: paused; }
      `}</style>

      <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8 px-4">
        Trusted by Leading Hospitals Across India
      </p>

      <div className="wg-marquee space-y-3">
        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden">
          <div className="wg-row-1 flex gap-3" style={{ width: 'max-content' }}>
            {row1.map((client, i) => (
              <div
                key={`r1-${client.id}-${i}`}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-[#3A8FD4]/30 hover:shadow-md transition-all duration-200 shrink-0 group"
              >
                <span className="w-2 h-2 rounded-full bg-[#3A8FD4]/40 group-hover:bg-[#3A8FD4] transition-colors shrink-0" />
                <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                  {client.hospital_name}
                </span>
                {client.city && (
                  <span className="text-[10px] text-slate-300 whitespace-nowrap hidden sm:block">
                    {client.city}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div className="wg-row-2 flex gap-3" style={{ width: 'max-content' }}>
            {row2.map((client, i) => (
              <div
                key={`r2-${client.id}-${i}`}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-[#3A8FD4]/30 hover:shadow-md transition-all duration-200 shrink-0 group"
              >
                <span className="w-2 h-2 rounded-full bg-[#3A8FD4]/40 group-hover:bg-[#3A8FD4] transition-colors shrink-0" />
                <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                  {client.hospital_name}
                </span>
                {client.city && (
                  <span className="text-[10px] text-slate-300 whitespace-nowrap hidden sm:block">
                    {client.city}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
