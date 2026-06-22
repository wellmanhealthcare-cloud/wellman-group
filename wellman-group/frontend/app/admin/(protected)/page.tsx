'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import type { DashboardStats } from '@/types/dashboard';
import {
  FolderOpen,
  Wrench,
  Building2,
  Users,
  MessageSquareQuote,
  Briefcase,
  ClipboardList,
  Mail,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: number;
  sub?: string;
  subValue?: number;
  icon: React.ElementType;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .get()
      .then((res) => setStats(res.data.stats))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-sm">
        {error || 'Something went wrong'}
      </div>
    );
  }

  const cards: StatCard[] = [
    { label: 'Projects',     value: stats.total_projects,     icon: FolderOpen,           color: 'bg-blue-500' },
    { label: 'Products',     value: stats.total_services,     icon: Wrench,               color: 'bg-indigo-500' },
    { label: 'Clients',      value: stats.total_clients,      icon: Building2,            color: 'bg-cyan-500' },
    { label: 'Team Members', value: stats.total_team_members, icon: Users,                color: 'bg-violet-500' },
    { label: 'Testimonials', value: stats.total_testimonials, icon: MessageSquareQuote,   color: 'bg-pink-500' },
    {
      label: 'Jobs',
      value: stats.total_jobs,
      sub: 'Open',
      subValue: stats.open_jobs,
      icon: Briefcase,
      color: 'bg-amber-500',
    },
    {
      label: 'Applications',
      value: stats.total_applications,
      sub: 'Unread',
      subValue: stats.unread_applications,
      icon: ClipboardList,
      color: 'bg-orange-500',
    },
    {
      label: 'Inquiries',
      value: stats.total_inquiries,
      sub: 'Unread',
      subValue: stats.unread_inquiries,
      icon: Mail,
      color: 'bg-rose-500',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of your CMS content</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, subValue, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <span className={`${color} p-2 rounded-lg`}>
                <Icon size={16} className="text-white" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {sub && subValue !== undefined && (
              <p className="text-xs text-slate-400 mt-1">
                {subValue} {sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
