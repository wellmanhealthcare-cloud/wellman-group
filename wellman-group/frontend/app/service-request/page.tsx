'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { clientsApi, settingsApi } from '@/lib/api';
import { sendAdminNotification } from '@/lib/notify';
import type { Client } from '@/types/client';
import type { SiteSettings } from '@/types/settings';

const PRODUCTS = [
  'Modular Operation Theatre',
  'Medical Gas Pipeline System',
  'HVAC & Cleanroom Engineering',
  'Clean Room Solutions',
  'Laminar Air Flow Systems',
  'Modular ICU Solutions',
  'Modular NICU Solutions',
  'IVF Lab Setup',
  'Other',
];

const SERVICE_TYPES = [
  { label: 'AMC',              sub: 'Annual Maintenance Contract',        value: 'AMC' },
  { label: 'Under Warranty',   sub: 'Equipment is within warranty period', value: 'Under Warranty' },
  { label: 'Out of Warranty',  sub: 'Chargeable service',                 value: 'Out of Warranty' },
  { label: 'New Installation', sub: 'New equipment installation query',   value: 'New Installation' },
];

const ISSUE_TYPES = [
  'Breakdown / Not working',
  'Partial fault',
  'Routine maintenance',
  'Calibration / Testing',
  'Gas leakage',
  'Electrical issue',
  'Other',
];

const URGENCY = [
  { label: 'Emergency', sub: 'OT / ICU is down — same day needed', value: 'Emergency', color: '#EF4444' },
  { label: 'Urgent',    sub: 'Response needed within 24 hours',    value: 'Urgent',    color: '#F59E0B' },
  { label: 'Routine',   sub: 'Flexible scheduling',                value: 'Routine',   color: '#10B981' },
];


// Major Indian cities for autocomplete
const INDIAN_CITIES = [
  'Ahmedabad', 'Agra', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Amravati', 'Amritsar',
  'Anand', 'Ankleshwar', 'Aurangabad',
  'Bangalore', 'Bareilly', 'Bharuch', 'Bhavnagar', 'Bhopal', 'Bhubaneswar',
  'Chandigarh', 'Chennai', 'Coimbatore',
  'Dahod', 'Dehradun', 'Delhi', 'Dharampur', 'Dhangadhra',
  'Erode',
  'Faridabad',
  'Gandhinagar', 'Goa', 'Gurgaon', 'Guwahati', 'Gwalior',
  'Hyderabad',
  'Indore',
  'Jaipur', 'Jambusar', 'Jamnagar', 'Jodhpur', 'Junagadh',
  'Kadi', 'Kalol', 'Kanpur', 'Kochi', 'Kolhapur', 'Kolkata',
  'Limbdi', 'Lucknow', 'Ludhiana',
  'Mehsana', 'Modasa', 'Mumbai', 'Mysore',
  'Nadiad', 'Nagpur', 'Navsari', 'Noida',
  'Palanpur', 'Patan', 'Patna', 'Pune',
  'Rajkot', 'Ranchi',
  'Surat', 'Surendranagar',
  'Thane', 'Trichur', 'Thiruvananthapuram',
  'Vadodara', 'Vapi', 'Varanasi', 'Viramgam', 'Visnagar', 'Vizag',
].sort();

const SLUG_TO_PRODUCT: Record<string, string> = {
  'modular-operation-theatre':   'Modular Operation Theatre',
  'medical-gas-pipeline-system': 'Medical Gas Pipeline System',
  'hvac-cleanroom-engineering':  'HVAC & Cleanroom Engineering',
  'clean-room-solutions':        'Clean Room Solutions',
  'laminar-air-flow-systems':    'Laminar Air Flow Systems',
  'modular-icu-solutions':       'Modular ICU Solutions',
  'modular-nicu-solutions':      'Modular NICU Solutions',
  'ivf-lab-setup':               'IVF Lab Setup',
};

const STEPS = ['Product', 'Service Type', 'Problem', 'Your Details'];

interface Form {
  product: string;
  equipment: string;
  serviceType: string;
  issueType: string;
  issueOther: string;
  urgency: string;
  description: string;
  hospitalName: string;
  city: string;
  contactPerson: string;
  contactNumber: string;
}

const EMPTY: Form = {
  product: '', equipment: '', serviceType: '', issueType: '',
  issueOther: '', urgency: '', description: '', hospitalName: '',
  city: '', contactPerson: '', contactNumber: '',
};

// ── Searchable combobox for hospital name ─────────────────────────────────────
function HospitalCombobox({
  value, clients, onSelect,
}: {
  value: string;
  clients: Client[];
  onSelect: (name: string, city: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value.length > 0
    ? clients.filter((c) => c.hospital_name.toLowerCase().includes(value.toLowerCase()))
    : clients;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        value={value}
        onChange={(e) => { onSelect(e.target.value, ''); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search or type hospital name…"
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {filtered.slice(0, 20).map((c) => (
            <li
              key={c.id}
              onMouseDown={() => { onSelect(c.hospital_name, c.city); setOpen(false); }}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F0F7FF] transition-colors"
            >
              <span style={{ color: '#1A3A6B' }} className="font-medium">{c.hospital_name}</span>
              {c.city && <span className="text-slate-400 text-xs ml-2">{c.city}</span>}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-slate-400 italic">No match — your entry will be used as-is</li>
          )}
        </ul>
      )}
    </div>
  );
}

function RequestForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [done, setDone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && SLUG_TO_PRODUCT[cat]) {
      setForm((prev) => ({ ...prev, product: SLUG_TO_PRODUCT[cat] }));
    }
  }, [searchParams]);

  useEffect(() => {
    clientsApi.list()
      .then(({ data }) => setClients(data.filter((c) => c.is_active).sort((a, b) => a.hospital_name.localeCompare(b.hospital_name))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    settingsApi.get().then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  function f(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhoneChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    f('contactNumber', digits);
    if (digits.length > 0 && digits.length < 10) {
      setPhoneError('Contact number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  }

  function canNext() {
    if (step === 0) return !!form.product;
    if (step === 1) return !!form.serviceType;
    if (step === 2) return !!form.issueType && !!form.urgency;
    if (step === 3) return !!form.hospitalName && form.contactNumber.length === 10;
    return true;
  }

  function buildMessageLines(): (string | null)[] {
    const issue = form.issueType === 'Other' ? form.issueOther || 'Other' : form.issueType;
    const isKnownClient = clients.some(
      (c) => c.hospital_name.toLowerCase() === form.hospitalName.toLowerCase()
    );
    return [
      '🔧 *SERVICE REQUEST — Wellman Group*',
      !isKnownClient ? '🆕 *NEW CLIENT — not in existing client list*' : null,
      '',
      `*Product:* ${form.product}`,
      form.equipment    ? `*Equipment / Part:* ${form.equipment}`    : null,
      `*Service Type:* ${form.serviceType}`,
      `*Issue:* ${issue}`,
      `*Urgency:* ${form.urgency}`,
      form.description  ? `*Details:* ${form.description}`           : null,
      '',
      `*Hospital:* ${form.hospitalName}`,
      form.city         ? `*City:* ${form.city}`                     : null,
      form.contactPerson? `*Contact Person:* ${form.contactPerson}`  : null,
      `*Contact Number:* ${form.contactNumber}`,
      '',
      'Please share photos of the issue directly in this chat.',
    ];
  }

  function handleSubmit() {
    sendAdminNotification(settings, {
      subject: `New Service Request — ${form.product}`,
      lines: buildMessageLines(),
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#1A3A6B' }}>Request Sent!</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Your request has been opened in WhatsApp. Our team will get back to you shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setForm(EMPTY); setStep(0); setDone(false); }}
            className="px-6 py-3 text-sm font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Submit Another
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-sm font-semibold text-white rounded-full"
            style={{ background: '#1A3A6B' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Step progress bar */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all"
                style={{
                  background: i < step ? '#10B981' : i === step ? '#1A3A6B' : '#F1F5F9',
                  color: i <= step ? '#fff' : '#94A3B8',
                }}
              >
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-slate-800' : 'text-slate-400'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-3 h-0.5 rounded-full" style={{ background: i < step ? '#10B981' : '#E2E8F0' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0: Product ── */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-black mb-1" style={{ color: '#1A3A6B' }}>Which product needs service?</h2>
          <p className="text-sm text-slate-500 mb-6">Select the product category</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {PRODUCTS.map((p) => (
              <button
                key={p}
                onClick={() => f('product', p)}
                className="text-left px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all"
                style={{
                  borderColor: form.product === p ? '#1A3A6B' : '#E2E8F0',
                  background:  form.product === p ? '#F0F7FF' : '#fff',
                  color:       form.product === p ? '#1A3A6B' : '#475569',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Specific equipment or part{' '}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              value={form.equipment}
              onChange={(e) => f('equipment', e.target.value)}
              placeholder="e.g. LED OT Light, Gas Outlet, HEPA Unit…"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* ── Step 1: Service type ── */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-black mb-1" style={{ color: '#1A3A6B' }}>Type of service?</h2>
          <p className="text-sm text-slate-500 mb-6">Select the service contract type</p>
          <div className="space-y-3">
            {SERVICE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => f('serviceType', t.value)}
                className="w-full text-left px-5 py-4 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: form.serviceType === t.value ? '#1A3A6B' : '#E2E8F0',
                  background:  form.serviceType === t.value ? '#F0F7FF' : '#fff',
                }}
              >
                <p className="font-bold text-sm" style={{ color: form.serviceType === t.value ? '#1A3A6B' : '#1E293B' }}>
                  {t.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{t.sub}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Problem ── */}
      {step === 2 && (
        <div className="space-y-7">
          <div>
            <h2 className="text-xl font-black mb-1" style={{ color: '#1A3A6B' }}>Describe the problem</h2>
            <p className="text-sm text-slate-500 mb-4">What kind of issue are you facing?</p>
            <div className="grid sm:grid-cols-2 gap-2.5 mb-3">
              {ISSUE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => f('issueType', t)}
                  className="text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                  style={{
                    borderColor: form.issueType === t ? '#1A3A6B' : '#E2E8F0',
                    background:  form.issueType === t ? '#F0F7FF' : '#fff',
                    color:       form.issueType === t ? '#1A3A6B' : '#475569',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            {form.issueType === 'Other' && (
              <input
                value={form.issueOther}
                onChange={(e) => f('issueOther', e.target.value)}
                placeholder="Briefly describe the issue…"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Urgency level</p>
            <div className="space-y-2.5">
              {URGENCY.map((u) => (
                <button
                  key={u.value}
                  onClick={() => f('urgency', u.value)}
                  className="w-full text-left px-5 py-3.5 rounded-2xl border-2 transition-all flex items-center gap-4"
                  style={{
                    borderColor: form.urgency === u.value ? '#1A3A6B' : '#E2E8F0',
                    background:  form.urgency === u.value ? '#F0F7FF' : '#fff',
                  }}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: u.color }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: form.urgency === u.value ? '#1A3A6B' : '#1E293B' }}>
                      {u.label}
                    </p>
                    <p className="text-xs text-slate-400">{u.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional details{' '}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => f('description', e.target.value)}
              rows={3}
              placeholder="Any additional context about the issue…"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* ── Step 3: Details ── */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-black mb-1" style={{ color: '#1A3A6B' }}>Your details</h2>
          <p className="text-sm text-slate-500 mb-6">So our team can reach you</p>
          <div className="space-y-4">

            {/* Hospital name — searchable combobox */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Hospital / Facility name <span className="text-red-500">*</span>
              </label>
              <HospitalCombobox
                value={form.hospitalName}
                clients={clients}
                onSelect={(name, city) => {
                  f('hospitalName', name);
                  if (city) f('city', city);
                }}
              />
            </div>

            {/* City — datalist autocomplete */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input
                list="india-cities"
                value={form.city}
                onChange={(e) => f('city', e.target.value)}
                placeholder="e.g. Ahmedabad"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="india-cities">
                {INDIAN_CITIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Contact person */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact person name</label>
              <input
                value={form.contactPerson}
                onChange={(e) => f('contactPerson', e.target.value)}
                placeholder="Name of person to call back"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact number — 10 digits only */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contact number <span className="text-red-500">*</span>
              </label>
              <input
                value={form.contactNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="10-digit mobile number"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  phoneError ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              />
              {phoneError && (
                <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
              )}
              {form.contactNumber.length === 10 && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={11} /> Valid number
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
        ) : (
          <Link
            href="/products"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={14} /> Products
          </Link>
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-full transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: '#1A3A6B' }}
          >
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-full transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: '#25D366' }}
          >
            <Send size={14} /> Send on WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}

export default function ServiceRequestPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20" style={{ background: 'linear-gradient(180deg, #F8FBFF 0%, #ffffff 60%)' }}>
        <div className="text-center px-4 mb-10">
          <p className="text-[#3A8FD4] text-xs font-bold uppercase tracking-[0.2em] mb-3">After Sales</p>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Request Support</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Fill in a few details and we'll respond on WhatsApp within hours.
          </p>
        </div>
        <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-400 text-sm">Loading…</div>}>
          <RequestForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
