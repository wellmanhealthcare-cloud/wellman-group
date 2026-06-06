'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Images,
  Wrench,
  FolderOpen,
  Users,
  Building2,
  MessageSquareQuote,
  Briefcase,
  Award,
  Mail,
  Settings,
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    href: '/admin',              icon: LayoutDashboard },
  { label: 'Hero Slides',  href: '/admin/hero-slides',  icon: Images },
  { label: 'Services',     href: '/admin/services',     icon: Wrench },
  { label: 'Projects',     href: '/admin/projects',     icon: FolderOpen },
  { label: 'Team',         href: '/admin/team',         icon: Users },
  { label: 'Clients',      href: '/admin/clients',      icon: Building2 },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Jobs',         href: '/admin/jobs',         icon: Briefcase },
  { label: 'Applications', href: '/admin/applications', icon: ClipboardList },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Inquiries',    href: '/admin/inquiries',    icon: Mail },
  { label: 'Settings',     href: '/admin/settings',     icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0 bg-[#0B1E3F]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg px-2.5 py-1.5 shrink-0">
            <img
              src="/wellman_logo.png"
              alt="Wellman Group"
              className="h-7 w-auto object-contain"
            />
          </div>
          <p className="text-white/60 text-xs font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-blue-100/70 hover:bg-white/8 hover:text-white'
              )}
            >
              <Icon size={17} className={active ? 'text-white' : 'text-blue-300/70'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-blue-300/40">CMS v1.0</p>
      </div>
    </aside>
  );
}
