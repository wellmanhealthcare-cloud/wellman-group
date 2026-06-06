'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import type { Service, ServiceCreate } from '@/types/service';
import { slugify } from '@/lib/utils';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: ServiceCreate = {
  title: '',
  slug: '',
  short_desc: '',
  long_desc: '',
  icon_url: '',
  order_index: 0,
  is_active: true,
  meta_title: '',
  meta_desc: '',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceCreate>(EMPTY);
  const [iconPublicId, setIconPublicId] = useState('');

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await servicesApi.list();
      setServices(data);
    } catch {
      setError('Failed to load services.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof ServiceCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setIconPublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(service: Service) {
    setEditTarget(service);
    setForm({
      title: service.title,
      slug: service.slug,
      short_desc: service.short_desc,
      long_desc: service.long_desc,
      icon_url: service.icon_url ?? '',
      order_index: service.order_index,
      is_active: service.is_active,
      meta_title: service.meta_title ?? '',
      meta_desc: service.meta_desc ?? '',
    });
    setIconPublicId('');
    setError('');
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.slug || !form.short_desc) {
      setError('Title, Slug and Short description are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await servicesApi.update(editTarget.id, form);
      } else {
        await servicesApi.create(form);
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
      await servicesApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Service>[] = [
    {
      header: 'Icon',
      key: 'icon_url',
      className: 'w-16',
      render: (row) =>
        row.icon_url ? (
          <img
            src={row.icon_url}
            alt={row.title}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-300 text-xs">
            —
          </div>
        ),
    },
    { header: 'Title', key: 'title' },
    {
      header: 'Slug',
      key: 'slug',
      render: (row) => (
        <span className="text-slate-400 font-mono text-xs">{row.slug}</span>
      ),
    },
    {
      header: 'Order',
      key: 'order_index',
      className: 'w-20',
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (row) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            row.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
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
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setConfirmId(row.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage service offerings</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        emptyMessage="No services yet. Add your first service."
      />

      {/* Add / Edit panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPanelOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editTarget ? 'Edit Service' : 'Add Service'}
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => {
                      f('title', e.target.value);
                      if (!editTarget) f('slug', slugify(e.target.value));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Service name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => f('slug', slugify(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="auto-generated"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.short_desc}
                  onChange={(e) => f('short_desc', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description shown in service cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Long Description
                </label>
                <textarea
                  value={form.long_desc}
                  onChange={(e) => f('long_desc', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Full service detail page content"
                />
              </div>

              <ImageUpload
                label="Icon / Banner Image"
                value={form.icon_url}
                publicId={iconPublicId}
                onChange={(url, pid) => {
                  f('icon_url', url);
                  setIconPublicId(pid);
                }}
                onRemove={() => {
                  f('icon_url', '');
                  setIconPublicId('');
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Order
                  </label>
                  <input
                    type="number"
                    value={form.order_index ?? 0}
                    onChange={(e) => f('order_index', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active ?? true}
                      onChange={(e) => f('is_active', e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              {/* SEO */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  SEO
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Meta Title
                    </label>
                    <input
                      value={form.meta_title ?? ''}
                      onChange={(e) => f('meta_title', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Page title for search engines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Meta Description
                    </label>
                    <textarea
                      value={form.meta_desc ?? ''}
                      onChange={(e) => f('meta_desc', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Description shown in search engine results"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Panel footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setPanelOpen(false)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving
                  ? 'Saving…'
                  : editTarget
                  ? 'Update Service'
                  : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Service"
        description="This will permanently delete this service and all its data. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
