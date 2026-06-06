'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';
import type { Testimonial, TestimonialCreate } from '@/types/testimonial';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: TestimonialCreate = {
  client_name: '',
  designation: '',
  hospital_name: '',
  message: '',
  photo_url: '',
  rating: 5,
  order_index: 0,
  is_active: true,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialCreate>(EMPTY);
  const [photoPublicId, setPhotoPublicId] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await testimonialsApi.adminList();
      setTestimonials(data);
    } catch {
      setError('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof TestimonialCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setPhotoPublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditTarget(t);
    setForm({
      client_name: t.client_name,
      designation: t.designation,
      hospital_name: t.hospital_name,
      message: t.message,
      photo_url: t.photo_url ?? '',
      rating: t.rating,
      order_index: t.order_index,
      is_active: t.is_active,
    });
    setPhotoPublicId('');
    setError('');
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.client_name || !form.designation || !form.hospital_name || !form.message) {
      setError('Name, Designation, Hospital and Message are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await testimonialsApi.update(editTarget.id, form);
      } else {
        await testimonialsApi.create(form);
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
      await testimonialsApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Testimonial>[] = [
    { header: 'Name', key: 'client_name' },
    { header: 'Hospital', key: 'hospital_name' },
    {
      header: 'Rating',
      key: 'rating',
      render: (row) => (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={13} className={s <= row.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
          ))}
        </div>
      ),
    },
    {
      header: 'Message',
      key: 'message',
      render: (row) => <span className="text-slate-500 text-xs line-clamp-1 max-w-xs">{row.message}</span>,
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
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage client testimonials</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={testimonials} loading={loading} emptyMessage="No testimonials yet." />

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{editTarget ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <ImageUpload
                label="Client Photo"
                value={form.photo_url ?? ''}
                publicId={photoPublicId}
                onChange={(url, pid) => { f('photo_url', url); setPhotoPublicId(pid); }}
                onRemove={() => { f('photo_url', ''); setPhotoPublicId(''); }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Name <span className="text-red-500">*</span></label>
                  <input value={form.client_name} onChange={(e) => f('client_name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dr. John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                  <input value={form.designation} onChange={(e) => f('designation', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="CMO" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Hospital Name <span className="text-red-500">*</span></label>
                <input value={form.hospital_name} onChange={(e) => f('hospital_name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apollo Hospitals" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                <textarea value={form.message} onChange={(e) => f('message', e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Their testimonial message…" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => f('rating', s)} className="focus:outline-none">
                      <Star size={24} className={s <= (form.rating ?? 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                    </button>
                  ))}
                </div>
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
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving…' : editTarget ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Testimonial"
        description="This will permanently delete this testimonial. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
