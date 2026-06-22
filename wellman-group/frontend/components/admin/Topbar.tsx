'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <Link
          href="/admin/account"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1 -mx-2 hover:bg-slate-50 transition-colors"
          title="Account settings"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {(user?.name ?? 'A')[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name ?? 'Admin'}</span>
        </Link>
        <div className="w-px h-5 bg-slate-200" />
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}
