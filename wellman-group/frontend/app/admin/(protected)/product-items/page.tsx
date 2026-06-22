'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { productItemsApi, productsApi } from '@/lib/api';
import type { ProductItem, ProductItemCreate } from '@/types/service-product';
import type { Product } from '@/types/service';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: ProductItemCreate = {
  service_slug: '',
  name: '',
  description: '',
  image_url: '',
  order_index: 0,
  is_active: true,
};

export default function ProductItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filterSlug, setFilterSlug] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductItem | null>(null);
  const [form, setForm] = useState<ProductItemCreate>(EMPTY);
  const [logoPublicId, setLogoPublicId] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    productsApi.list().then(({ data }) => setProducts(data)).catch(() => {});
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await productItemsApi.adminList(filterSlug || undefined);
      setItems(data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filterSlug]);

  function f(key: keyof ProductItemCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY, service_slug: filterSlug || products[0]?.slug || '' });
    setLogoPublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(p: ProductItem) {
    setEditTarget(p);
    setForm({
      service_slug: p.service_slug,
      name: p.name,
      description: p.description ?? '',
      image_url: p.image_url ?? '',
      order_index: p.order_index,
      is_active: p.is_active,
    });
    setLogoPublicId('');
    setError('');
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.service_slug) {
      setError('Product category and Product Name are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await productItemsApi.update(editTarget.id, form);
      } else {
        await productItemsApi.create(form);
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
      await productItemsApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<ProductItem>[] = [
    {
      header: 'Image',
      key: 'image_url',
      render: (row) => row.image_url
        ? <img src={row.image_url} alt={row.name} className="h-10 w-16 object-cover rounded-lg" />
        : <div className="h-10 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No img</div>,
    },
    { header: 'Name', key: 'name' },
    {
      header: 'Category',
      key: 'service_slug',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {products.find((s) => s.slug === row.service_slug)?.title ?? row.service_slug}
        </span>
      ),
    },
    { header: 'Order', key: 'order_index', className: 'w-20' },
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
          <h1 className="text-2xl font-bold text-slate-900">Products & Tools</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage products and tools shown on each product page</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filter by service */}
      <div className="mb-4">
        <select
          value={filterSlug}
          onChange={(e) => setFilterSlug(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Products</option>
          {products.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
        </select>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No products yet. Add your first product." />

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{editTarget ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product <span className="text-red-500">*</span></label>
                <select value={form.service_slug} onChange={(e) => f('service_slug', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {products.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                </select>
              </div>

              <ImageUpload
                label="Product Image"
                value={form.image_url ?? ''}
                publicId={logoPublicId}
                onChange={(url, pid) => { f('image_url', url); setLogoPublicId(pid); }}
                onRemove={() => { f('image_url', ''); setLogoPublicId(''); }}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product / Tool Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => f('name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Modular Wall Panel" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea value={form.description ?? ''} onChange={(e) => f('description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe this product or tool..." />
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
                {saving ? 'Saving…' : editTarget ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Product"
        description="This will permanently delete this product. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
