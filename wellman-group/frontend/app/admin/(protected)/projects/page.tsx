'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Images, Star } from 'lucide-react';
import { projectsApi, productsApi } from '@/lib/api';
import type { ProjectListItem, Project, ProjectCreate } from '@/types/project';
import type { Product } from '@/types/service';
import { slugify } from '@/lib/utils';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY: ProjectCreate = {
  title: '',
  slug: '',
  client_name: '',
  city: '',
  state: '',
  service_id: '',
  description: '',
  completion_date: '',
  is_featured: false,
  is_active: true,
  order_index: 0,
  meta_title: '',
  meta_desc: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form panel
  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProjectListItem | null>(null);
  const [form, setForm] = useState<ProjectCreate>(EMPTY);

  // Gallery panel
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImagePublicId, setNewImagePublicId] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [addingImage, setAddingImage] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadProjects() {
    setLoading(true);
    try {
      const { data } = await projectsApi.adminList();
      setProjects(data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const { data } = await productsApi.list();
      setProducts(data);
    } catch {}
  }

  useEffect(() => {
    loadProjects();
    loadProducts();
  }, []);

  function f(key: keyof ProjectCreate, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY);
    setError('');
    setPanelOpen(true);
  }

  function openEdit(project: ProjectListItem) {
    setEditTarget(project);
    setForm({
      title: project.title,
      slug: project.slug,
      client_name: project.client_name,
      city: project.city,
      state: project.state,
      service_id: project.service_id,
      description: project.description,
      completion_date: project.completion_date,
      is_featured: project.is_featured,
      is_active: project.is_active,
      order_index: project.order_index,
      meta_title: project.meta_title ?? '',
      meta_desc: project.meta_desc ?? '',
    });
    setError('');
    setPanelOpen(true);
  }

  async function openGallery(project: ProjectListItem) {
    try {
      const { data } = await projectsApi.get(project.slug);
      setGalleryProject(data);
      setNewImageUrl('');
      setNewImagePublicId('');
      setNewCaption('');
      setGalleryOpen(true);
    } catch {
      setError('Failed to load project images.');
    }
  }

  async function handleSave() {
    if (
      !form.title ||
      !form.slug ||
      !form.client_name ||
      !form.city ||
      !form.state ||
      !form.service_id ||
      !form.description ||
      !form.completion_date
    ) {
      setError('All required fields must be filled.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editTarget) {
        await projectsApi.update(editTarget.id, form);
      } else {
        await projectsApi.create(form);
      }
      setPanelOpen(false);
      await loadProjects();
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
      await projectsApi.delete(confirmId);
      setConfirmId(null);
      await loadProjects();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  async function toggleFeature(project: ProjectListItem) {
    try {
      await projectsApi.toggleFeature(project.id, !project.is_featured);
      await loadProjects();
    } catch {
      setError('Failed to update featured status.');
    }
  }

  async function handleAddImage() {
    if (!galleryProject || !newImageUrl) return;
    setAddingImage(true);
    try {
      const { data } = await projectsApi.addImage(galleryProject.id, {
        image_url: newImageUrl,
        caption: newCaption || undefined,
        order_index: galleryProject.images.length,
      });
      setGalleryProject((p) =>
        p ? { ...p, images: [...p.images, data] } : p
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
    if (!galleryProject) return;
    setDeletingImageId(imageId);
    try {
      await projectsApi.removeImage(galleryProject.id, imageId);
      setGalleryProject((p) =>
        p ? { ...p, images: p.images.filter((i) => i.id !== imageId) } : p
      );
    } catch {
      setError('Failed to delete image.');
    } finally {
      setDeletingImageId(null);
    }
  }

  const productMap = Object.fromEntries(products.map((s) => [s.id, s.title]));

  const columns: Column<ProjectListItem>[] = [
    { header: 'Title', key: 'title' },
    { header: 'Client', key: 'client_name' },
    {
      header: 'Location',
      key: 'city',
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {row.city}, {row.state}
        </span>
      ),
    },
    {
      header: 'Product',
      key: 'service_id',
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {productMap[row.service_id] ?? '—'}
        </span>
      ),
    },
    {
      header: 'Featured',
      key: 'is_featured',
      className: 'w-24 text-center',
      render: (row) => (
        <button
          onClick={() => toggleFeature(row)}
          className={`p-1.5 rounded transition-colors ${
            row.is_featured
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-slate-300 hover:text-amber-400'
          }`}
          title={row.is_featured ? 'Remove from featured' : 'Mark as featured'}
        >
          <Star size={16} fill={row.is_featured ? 'currentColor' : 'none'} />
        </button>
      ),
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
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage completed and ongoing projects
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {error && !panelOpen && !galleryOpen && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        emptyMessage="No projects yet. Add your first project."
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
                {editTarget ? 'Edit Project' : 'Add Project'}
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
                    placeholder="Project title"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.client_name}
                    onChange={(e) => f('client_name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hospital / client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.service_id}
                    onChange={(e) => f('service_id', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select product</option>
                    {products.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => f('city', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ahmedabad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.state}
                    onChange={(e) => f('state', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gujarat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Completion Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.completion_date}
                    onChange={(e) => f('completion_date', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => f('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Project details and scope of work"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                      checked={form.is_featured ?? false}
                      onChange={(e) => f('is_featured', e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Featured
                    </span>
                  </label>
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active ?? true}
                      onChange={(e) => f('is_active', e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Active
                    </span>
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
                  ? 'Update Project'
                  : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image gallery panel */}
      {galleryOpen && galleryProject && (
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
                  Project Images
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {galleryProject.title}
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
              {galleryProject.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {galleryProject.images.map((img) => (
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
                        placeholder="e.g. Operation Theatre setup"
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
        title="Delete Project"
        description="This will permanently delete this project and all its images. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
}
