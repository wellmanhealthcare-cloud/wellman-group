'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Images } from 'lucide-react';
import { productsApi } from '@/lib/api';
import type { Product, ProductCreate } from '@/types/service';
import { slugify } from '@/lib/utils';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: ProductCreate = {
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductCreate>(EMPTY);
  const [iconPublicId, setIconPublicId] = useState('');

  // Gallery panel
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImagePublicId, setNewImagePublicId] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [addingImage, setAddingImage] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await productsApi.list();
      setProducts(data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof ProductCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setIconPublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(product: Product) {
    setEditTarget(product);
    setForm({
      title: product.title,
      slug: product.slug,
      short_desc: product.short_desc,
      long_desc: product.long_desc,
      icon_url: product.icon_url ?? '',
      order_index: product.order_index,
      is_active: product.is_active,
      meta_title: product.meta_title ?? '',
      meta_desc: product.meta_desc ?? '',
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
        await productsApi.update(editTarget.id, form);
      } else {
        await productsApi.create(form);
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
      await productsApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  async function openGallery(product: Product) {
    try {
      const { data } = await productsApi.get(product.slug);
      setGalleryProduct(data);
      setNewImageUrl('');
      setNewImagePublicId('');
      setNewCaption('');
      setGalleryOpen(true);
    } catch {
      setError('Failed to load product images.');
    }
  }

  async function handleAddImage() {
    if (!galleryProduct || !newImageUrl) return;
    setAddingImage(true);
    try {
      const { data } = await productsApi.addImage(galleryProduct.id, {
        image_url: newImageUrl,
        caption: newCaption || undefined,
        order_index: galleryProduct.images?.length ?? 0,
      });
      setGalleryProduct((p) =>
        p ? { ...p, images: [...(p.images ?? []), data] } : p
      );
      setNewImageUrl('');
      setNewImagePublicId('');
      setNewCaption('');
    } catch {
      setError('Failed to add image.');
    } finally {
      setAddingImage(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!galleryProduct) return;
    setDeletingImageId(imageId);
    try {
      await productsApi.removeImage(galleryProduct.id, imageId);
      setGalleryProduct((p) =>
        p ? { ...p, images: (p.images ?? []).filter((i) => i.id !== imageId) } : p
      );
    } catch {
      setError('Failed to delete image.');
    } finally {
      setDeletingImageId(null);
    }
  }

  const columns: Column<Product>[] = [
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
      className: 'w-28',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => openGallery(row)}
            className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
            title="Manage Images"
          >
            <Images size={15} />
          </button>
          <button
            onClick={() => setConfirmId(row.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
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
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage product offerings</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {error && !panelOpen && !galleryOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products yet. Add your first product."
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
                {editTarget ? 'Edit Product' : 'Add Product'}
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
                    placeholder="Product name"
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
                  placeholder="Brief description shown in product cards"
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
                  placeholder="Full product detail page content"
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
                  ? 'Update Product'
                  : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image gallery panel */}
      {galleryOpen && galleryProduct && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setGalleryOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Images
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {galleryProduct.title}
                </p>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Existing images grid */}
              {(galleryProduct.images?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {galleryProduct.images!.map((img) => (
                    <div
                      key={img.id}
                      className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption ?? ''}
                        className="w-full h-36 object-cover"
                      />
                      {img.caption && (
                        <div className="px-2 py-1.5 text-xs text-slate-500 truncate">
                          {img.caption}
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
                      >
                        {deletingImageId === img.id ? (
                          <span className="text-xs leading-none px-0.5">…</span>
                        ) : (
                          <X size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-10 mb-6">
                  No images yet
                </p>
              )}

              {/* Add new image */}
              <div className="border-t border-slate-200 pt-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Add New Image
                </p>
                <ImageUpload
                  label="Upload Image"
                  value={newImageUrl}
                  publicId={newImagePublicId}
                  onChange={(url, pid) => {
                    setNewImageUrl(url);
                    setNewImagePublicId(pid);
                  }}
                  onRemove={() => {
                    setNewImageUrl('');
                    setNewImagePublicId('');
                  }}
                />
                {newImageUrl && (
                  <div className="mt-3 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Caption (optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Installed MOT setup"
                      />
                      <button
                        onClick={handleAddImage}
                        disabled={addingImage}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {addingImage ? 'Adding…' : 'Add'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && galleryOpen && (
                <p className="mt-4 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Product"
        description="This will permanently delete this product and all its data. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
