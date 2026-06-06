'use client';

import { useEffect, useState } from 'react';
import { Trash2, X, Mail, Phone, Building2, Eye } from 'lucide-react';
import { inquiriesApi } from '@/lib/api';
import type { Inquiry } from '@/types/inquiry';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await inquiriesApi.adminList();
      setInquiries(data);
    } catch {
      setError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleView(inq: Inquiry) {
    setSelected(inq);
    if (!inq.is_read) {
      try {
        await inquiriesApi.markRead(inq.id, true);
        setInquiries((prev) => prev.map((i) => i.id === inq.id ? { ...i, is_read: true } : i));
      } catch { /* silent */ }
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await inquiriesApi.delete(confirmId);
      setConfirmId(null);
      if (selected?.id === confirmId) setSelected(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Inquiry>[] = [
    {
      header: 'Name',
      key: 'full_name',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
          <span className={row.is_read ? 'text-slate-600' : 'font-semibold text-slate-900'}>{row.full_name}</span>
        </div>
      ),
    },
    { header: 'Email', key: 'email' },
    { header: 'Subject', key: 'subject' },
    {
      header: 'Date',
      key: 'created_at',
      render: (row) => <span className="text-xs text-slate-500">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      header: 'Status',
      key: 'is_read',
      render: (row) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
          {row.is_read ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'id',
      className: 'w-24',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => handleView(row)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Eye size={15} /></button>
          <button onClick={() => setConfirmId(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inquiries
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Messages from the contact form</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={inquiries} loading={loading} emptyMessage="No inquiries yet." />

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Inquiry Detail</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Contact info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3E63DD] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {selected.full_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{selected.full_name}</p>
                    {selected.company_name && <p className="text-xs text-slate-500">{selected.company_name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={13} className="text-slate-400" />
                  <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={13} className="text-slate-400" />
                  <a href={`tel:${selected.phone}`} className="text-blue-600 hover:underline">{selected.phone}</a>
                </div>
                {selected.company_name && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 size={13} className="text-slate-400" />
                    {selected.company_name}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Subject</p>
                <p className="text-sm font-semibold text-slate-900">{selected.subject}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Message</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-xl p-4 border border-slate-100">{selected.message}</p>
              </div>

              <p className="text-xs text-slate-400">
                Received: {new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <button onClick={() => setConfirmId(selected.id)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Mail size={14} /> Reply
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Inquiry"
        description="This will permanently delete this inquiry. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
