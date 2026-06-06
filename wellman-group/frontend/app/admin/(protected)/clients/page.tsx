'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { clientsApi } from '@/lib/api';
import type { Client, ClientCreate } from '@/types/client';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: ClientCreate = {
  hospital_name: '',
  city: '',
  state: '',
  logo_url: '',
  order_index: 0,
  is_active: true,
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientCreate>(EMPTY);
  const [logoPublicId, setLogoPublicId] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await clientsApi.adminList();
      setClients(data);
    } catch {
      setError('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: keyof ClientCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setLogoPublicId('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(c: Client) {
    setEditTarget(c);
    setForm({
      hospital_name: c.hospital_name,
      city: c.city,
      state: c.state,
      logo_url: c.logo_url,
      order_index: c.order_index,
      is_active: c.is_active,
    });
    setLogoPublicId('');
    setError('');
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.hospital_name || !form.city || !form.state || !form.logo_url) {
      setError('Hospital name, City, State, and Logo are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await clientsApi.update(editTarget.id, form);
      } else {
        await clientsApi.create(form);
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
      await clientsApi.delete(confirmId);
      setConfirmId(null);
      await load();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Client>[] = [
    {
      header: 'Logo',
      key: 'logo_url',
      render: (row) => (
        <img src={row.logo_url} alt={row.hospital_name} className="h-10 w-20 object-contain rounded" />
      ),
    },
    { header: 'Hospital', key: 'hospital_name' },
    {
      header: 'Location',
      key: 'city',
      render: (row) => <span>{row.city}, {row.state}</span>,
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
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage hospital client logos</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {error && !panelOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <DataTable columns={columns} data={clients} loading={loading} emptyMessage="No clients yet. Add your first client." />

      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{editTarget ? 'Edit Client' : 'Add Client'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <ImageUpload
                label="Hospital Logo *"
                value={form.logo_url}
                publicId={logoPublicId}
                onChange={(url, pid) => { f('logo_url', url); setLogoPublicId(pid); }}
                onRemove={() => { f('logo_url', ''); setLogoPublicId(''); }}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Hospital Name <span className="text-red-500">*</span></label>
                <input value={form.hospital_name} onChange={(e) => f('hospital_name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Apollo Hospitals" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                  <input value={form.city} onChange={(e) => f('city', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ahmedabad" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                  <input value={form.state} onChange={(e) => f('state', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Gujarat" />
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
                {saving ? 'Saving…' : editTarget ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Client"
        description="This will permanently delete this client. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
