'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import type { JobOpening, JobOpeningCreate } from '@/types/job';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const EMPTY: JobOpeningCreate = {
  title: '',
  department: '',
  location: '',
  job_type: 'Full-time',
  description: '',
  responsibilities: '',
  requirements: '',
  is_open: true,
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JobOpening | null>(null);
  const [form, setForm] = useState<JobOpeningCreate>(EMPTY);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await jobsApi.adminList();
      setJobs(data);
    } catch {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof JobOpeningCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setError('');
    setPanelOpen(true);
  }

  function openEdit(j: JobOpening) {
    setEditTarget(j);
    setForm({
      title: j.title,
      department: j.department,
      location: j.location,
      job_type: j.job_type,
      description: j.description,
      responsibilities: j.responsibilities,
      requirements: j.requirements,
      is_open: j.is_open,
    });
    setError('');
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.department || !form.location || !form.description) {
      setError('Title, Department, Location and Description are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await jobsApi.update(editTarget.id, form);
      } else {
        await jobsApi.create(form);
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
      await jobsApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggle(job: JobOpening) {
    try {
      await jobsApi.toggle(job.id, !job.is_open);
      await load();
    } catch {
      setError('Toggle failed.');
    }
  }

  const columns: Column<JobOpening>[] = [
    { header: 'Title', key: 'title' },
    { header: 'Department', key: 'department' },
    { header: 'Location', key: 'location' },
    {
      header: 'Type',
      key: 'job_type',
      render: (row) => (
        <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{row.job_type}</span>
      ),
    },
    {
      header: 'Status',
      key: 'is_open',
      render: (row) => (
        <button onClick={() => handleToggle(row)} className="flex items-center gap-1.5 group">
          {row.is_open
            ? <ToggleRight size={20} className="text-green-500" />
            : <ToggleLeft size={20} className="text-slate-300" />}
          <span className={`text-xs font-medium ${row.is_open ? 'text-green-700' : 'text-slate-400'}`}>
            {row.is_open ? 'Open' : 'Closed'}
          </span>
        </button>
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
          <h1 className="text-2xl font-bold text-slate-900">Job Openings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage career opportunities</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Job
        </button>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={jobs} loading={loading} emptyMessage="No job openings yet." />

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{editTarget ? 'Edit Job' : 'Add Job'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={(e) => f('title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Site Engineer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                  <input value={form.department} onChange={(e) => f('department', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Engineering" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                  <input value={form.location} onChange={(e) => f('location', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ahmedabad" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
                <select value={form.job_type} onChange={(e) => f('job_type', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={(e) => f('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Role overview…" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Responsibilities</label>
                <textarea value={form.responsibilities} onChange={(e) => f('responsibilities', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Key responsibilities…" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Requirements</label>
                <textarea value={form.requirements} onChange={(e) => f('requirements', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Skills and qualifications…" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_open ?? true} onChange={(e) => f('is_open', e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm font-medium text-slate-700">Currently open for applications</span>
              </label>

              {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setPanelOpen(false)} disabled={saving} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving…' : editTarget ? 'Update Job' : 'Add Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Job"
        description="This will permanently delete this job opening. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
