'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, FileText } from 'lucide-react';
import { certificatesApi, uploadApi } from '@/lib/api';
import type { Certificate, CertificateCreate } from '@/types/certificate';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const EMPTY: CertificateCreate = {
  title: '',
  issuing_body: '',
  issue_date: '',
  expiry_date: '',
  file_url: '',
  order_index: 0,
  is_active: true,
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Certificate | null>(null);
  const [form, setForm] = useState<CertificateCreate>(EMPTY);
  const [filePublicId, setFilePublicId] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await certificatesApi.adminList();
      setCertificates(data);
    } catch {
      setError('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof CertificateCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setFilePublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(c: Certificate) {
    setEditTarget(c);
    setForm({
      title: c.title,
      issuing_body: c.issuing_body,
      issue_date: c.issue_date,
      expiry_date: c.expiry_date ?? '',
      file_url: c.file_url,
      order_index: c.order_index,
      is_active: c.is_active,
    });
    setFilePublicId('');
    setError('');
    setPanelOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadApi.pdf(file);
      f('file_url', data.url);
      setFilePublicId(data.public_id);
    } catch {
      setError('File upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.title || !form.issuing_body || !form.issue_date || !form.file_url) {
      setError('Title, Issuing Body, Issue Date and Certificate File are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await certificatesApi.update(editTarget.id, form);
      } else {
        await certificatesApi.create(form);
      }
      setPanelOpen(false);
      await load();
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await certificatesApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Certificate>[] = [
    { header: 'Title', key: 'title' },
    { header: 'Issuing Body', key: 'issuing_body' },
    {
      header: 'Issue Date',
      key: 'issue_date',
      render: (row) => <span className="text-xs text-slate-600">{row.issue_date}</span>,
    },
    {
      header: 'Expiry',
      key: 'expiry_date',
      render: (row) => (
        <span className="text-xs text-slate-500">{row.expiry_date ?? '—'}</span>
      ),
    },
    {
      header: 'File',
      key: 'file_url',
      render: (row) => (
        <a href={row.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs">
          <FileText size={13} /> View
        </a>
      ),
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (row) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'id',
      className: 'w-24',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(row)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Pencil size={15} /></button>
          <button onClick={() => setConfirmId(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage company certifications</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={certificates} loading={loading} emptyMessage="No certificates yet." />

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{editTarget ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={(e) => f('title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. ISO 9001:2015" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Issuing Body <span className="text-red-500">*</span></label>
                <input value={form.issuing_body} onChange={(e) => f('issuing_body', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Bureau Veritas" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.issue_date} onChange={(e) => f('issue_date', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
                  <input type="date" value={form.expiry_date ?? ''} onChange={(e) => f('expiry_date', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Certificate File (PDF) <span className="text-red-500">*</span></label>
                {form.file_url ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <FileText size={18} className="text-blue-600 shrink-0" />
                    <a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">View uploaded file</a>
                    <button onClick={() => { f('file_url', ''); setFilePublicId(''); }} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <FileText size={20} className="text-slate-400 mb-1" />
                    <span className="text-sm text-slate-500">{uploading ? 'Uploading…' : 'Click to upload PDF'}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
                  <input type="number" value={form.order_index ?? 0} onChange={(e) => f('order_index', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => f('is_active', e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setPanelOpen(false)} disabled={saving} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving…' : editTarget ? 'Update Certificate' : 'Add Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Certificate"
        description="This will permanently delete this certificate. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
