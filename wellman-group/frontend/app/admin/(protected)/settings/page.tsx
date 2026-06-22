'use client';

import { useEffect, useState } from 'react';
import { Save, FileText, X, MessageCircle, Mail, Bell } from 'lucide-react';
import { settingsApi, uploadApi } from '@/lib/api';
import type { SiteSettings, SiteSettingsUpdate } from '@/types/settings';

const SECTIONS = [
  {
    title: 'Company Info',
    fields: [
      { key: 'company_name', label: 'Company Name', placeholder: 'Wellman Group' },
      { key: 'tagline', label: 'Tagline', placeholder: 'Healthcare Infrastructure Experts' },
    ],
  },
  {
    title: 'Addresses',
    fields: [
      { key: 'unit_address', label: 'Unit Address', multiline: true, placeholder: '50,51,88 Parishram Industrial Hub…' },
      { key: 'office_address', label: 'Office Address', multiline: true, placeholder: 'B-414, WTT, SG Highway…' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'phone_primary', label: 'Primary Phone', placeholder: '+91 94094 28888' },
      { key: 'phone_secondary', label: 'Secondary Phone', placeholder: '' },
      { key: 'email_primary', label: 'Primary Email', placeholder: 'info@wellmangroup.in' },
      { key: 'email_secondary', label: 'Secondary Email', placeholder: '' },
      { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+91 94094 28888' },
    ],
  },
  {
    title: 'Social Links',
    fields: [
      { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/…' },
      { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/…' },
      { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/…' },
      { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/…' },
    ],
  },
  {
    title: 'Other',
    fields: [
      { key: 'google_maps_url', label: 'Google Maps Embed URL', multiline: true, placeholder: 'https://www.google.com/maps/embed?…' },
      { key: 'footer_text', label: 'Footer Text', placeholder: 'Building a healthier tomorrow.' },
    ],
  },
  {
    title: 'SEO',
    fields: [
      { key: 'meta_title', label: 'Meta Title', placeholder: 'Wellman Group | Healthcare Infrastructure' },
      { key: 'meta_desc', label: 'Meta Description', multiline: true, placeholder: '12+ years of excellence…' },
    ],
  },
] as const;

type FieldKey = keyof SiteSettingsUpdate;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [form, setForm] = useState<SiteSettingsUpdate>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await settingsApi.adminGet();
      setSettings(data);
      const { id, updated_at, ...rest } = data;
      void id; void updated_at;
      setForm(rest);
    } catch {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function f(key: FieldKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      await settingsApi.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleBrochureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBrochure(true);
    try {
      const { data } = await uploadApi.pdf(file);
      await settingsApi.updateBrochure(data.url);
      f('brochure_url', data.url);
    } catch {
      setError('Brochure upload failed.');
    } finally {
      setUploadingBrochure(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Loading settings…</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Company info, contact details, and SEO</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save size={15} />
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <div className="space-y-8">
        {SECTIONS.map(({ title, fields }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            </div>
            <div className="p-6 space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                  {'multiline' in field && field.multiline ? (
                    <textarea
                      value={(form[field.key as FieldKey] as string) ?? ''}
                      onChange={(e) => f(field.key as FieldKey, e.target.value)}
                      rows={3}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <input
                      value={(form[field.key as FieldKey] as string) ?? ''}
                      onChange={(e) => f(field.key as FieldKey, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notification channel */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Bell size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">
              Where should new inquiries, job applications, and service requests be sent?
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { value: 'whatsapp', label: 'WhatsApp', desc: 'Opens WhatsApp with the message pre-filled', icon: MessageCircle },
                { value: 'email', label: 'Email', desc: 'Opens an email draft to your primary email', icon: Mail },
                { value: 'both', label: 'Both', desc: 'Opens WhatsApp and an email draft', icon: Bell },
              ].map(({ value, label, desc, icon: Icon }) => {
                const active = (form.notification_channel ?? 'whatsapp') === value;
                return (
                  <label
                    key={value}
                    className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${
                      active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="notification_channel"
                      value={value}
                      checked={active}
                      onChange={() => f('notification_channel', value)}
                      className="hidden"
                    />
                    <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
                    <span className={`text-sm font-medium ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
                    <span className="text-xs text-slate-400 leading-snug">{desc}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brochure section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Company Brochure</h2>
          </div>
          <div className="p-6">
            {form.brochure_url ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <FileText size={18} className="text-blue-600 shrink-0" />
                <a href={form.brochure_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                  View current brochure
                </a>
                <button onClick={() => f('brochure_url', '')} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors ${uploadingBrochure ? 'opacity-50 pointer-events-none' : ''}`}>
                <FileText size={20} className="text-slate-400 mb-1" />
                <span className="text-sm text-slate-500">{uploadingBrochure ? 'Uploading…' : 'Click to upload brochure PDF'}</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handleBrochureUpload} />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Save size={15} />
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
