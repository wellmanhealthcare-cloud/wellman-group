'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { heroSlidesApi } from '@/lib/api';
import type { HeroSlide, HeroSlideCreate } from '@/types/hero-slide';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: HeroSlideCreate = {
  image_url: '',
  heading: '',
  subheading: '',
  cta_text: '',
  cta_link: '',
  order_index: 0,
  is_active: true,
};

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<HeroSlideCreate>(EMPTY);
  const [imgPublicId, setImgPublicId] = useState('');

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await heroSlidesApi.list();
      setSlides(data);
    } catch {
      setError('Failed to load slides.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof HeroSlideCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setImgPublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditTarget(slide);
    setForm({
      image_url: slide.image_url,
      heading: slide.heading,
      subheading: slide.subheading ?? '',
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      order_index: slide.order_index,
      is_active: slide.is_active,
    });
    setImgPublicId('');
    setError('');
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.image_url || !form.heading || !form.cta_text || !form.cta_link) {
      setError('Image, Heading, CTA Text and CTA Link are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await heroSlidesApi.update(editTarget.id, form);
      } else {
        await heroSlidesApi.create(form);
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
      await heroSlidesApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<HeroSlide>[] = [
    {
      header: 'Image',
      key: 'image_url',
      render: (row) =>
        row.image_url ? (
          <img
            src={row.image_url}
            alt={row.heading}
            className="w-16 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-300 text-xs">
            —
          </div>
        ),
    },
    { header: 'Heading', key: 'heading' },
    {
      header: 'CTA',
      key: 'cta_text',
      render: (row) => (
        <span>
          {row.cta_text}{' '}
          <span className="text-slate-400 text-xs">→ {row.cta_link}</span>
        </span>
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
          <h1 className="text-2xl font-bold text-slate-900">Hero Slides</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage homepage hero slider images
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={slides}
        loading={loading}
        emptyMessage="No hero slides yet. Add your first slide."
      />

      {/* Add / Edit panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPanelOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editTarget ? 'Edit Slide' : 'Add Slide'}
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
              <ImageUpload
                label="Slide Image *"
                value={form.image_url}
                publicId={imgPublicId}
                onChange={(url, pid) => {
                  f('image_url', url);
                  setImgPublicId(pid);
                }}
                onRemove={() => {
                  f('image_url', '');
                  setImgPublicId('');
                }}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Heading <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.heading}
                  onChange={(e) => f('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Main heading text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subheading
                </label>
                <input
                  value={form.subheading ?? ''}
                  onChange={(e) => f('subheading', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional subheading"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    CTA Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.cta_text}
                    onChange={(e) => f('cta_text', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    CTA Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.cta_link}
                    onChange={(e) => f('cta_link', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/contact"
                  />
                </div>
              </div>

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
                {saving ? 'Saving…' : editTarget ? 'Update Slide' : 'Add Slide'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Slide"
        description="This will permanently delete the hero slide. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
