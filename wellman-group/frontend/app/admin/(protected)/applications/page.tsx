'use client';

import { useEffect, useState } from 'react';
import { Trash2, X, Eye, EyeOff, FileText } from 'lucide-react';
import { applicationsApi } from '@/lib/api';
import type { JobApplication } from '@/types/job';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await applicationsApi.list();
      setApplications(data);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleView(app: JobApplication) {
    setSelected(app);
    if (!app.is_read) {
      try {
        await applicationsApi.markRead(app.id);
        setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, is_read: true } : a));
      } catch { /* silent */ }
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await applicationsApi.delete(confirmId);
      setConfirmId(null);
      if (selected?.id === confirmId) setSelected(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<JobApplication>[] = [
    {
      header: 'Applicant',
      key: 'applicant_name',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
          <span className={row.is_read ? 'text-slate-600' : 'font-semibold text-slate-900'}>{row.applicant_name}</span>
        </div>
      ),
    },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    {
      header: 'Resume',
      key: 'resume_url',
      render: (row) => (
        <a href={row.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs">
          <FileText size={13} /> View
        </a>
      ),
    },
    {
      header: 'Date',
      key: 'applied_at',
      render: (row) => <span className="text-xs text-slate-500">{new Date(row.applied_at).toLocaleDateString()}</span>,
    },
    {
      header: 'Actions',
      key: 'id',
      className: 'w-24',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => handleView(row)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            {row.is_read ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button onClick={() => setConfirmId(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const unreadCount = applications.filter((a) => !a.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Applications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Job applications submitted by candidates</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={applications} loading={loading} emptyMessage="No applications yet." />

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Application Detail</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Applicant</p>
                  <p className="text-sm font-semibold text-slate-900">{selected.applicant_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Applied</p>
                  <p className="text-sm text-slate-700">{new Date(selected.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-sm text-blue-600 hover:underline">{selected.email}</a>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Phone</p>
                  <a href={`tel:${selected.phone}`} className="text-sm text-blue-600 hover:underline">{selected.phone}</a>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Resume</p>
                <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                  <FileText size={15} /> Open Resume
                </a>
              </div>

              {selected.cover_letter && (
                <div>
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Cover Letter</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4">{selected.cover_letter}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <button onClick={() => { setConfirmId(selected.id); }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Application"
        description="This will permanently delete this job application. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
