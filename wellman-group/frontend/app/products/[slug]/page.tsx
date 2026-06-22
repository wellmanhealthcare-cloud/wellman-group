'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { productsApi, productItemsApi } from '@/lib/api';
import type { Product } from '@/types/service';
import type { ProductItem } from '@/types/service-product';

// ── Shared sub-components ────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7">
      <h2 className="text-lg font-black mb-5" style={{ color: '#1A3A6B' }}>{title}</h2>
      {children}
    </div>
  );
}

function SpecGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-xl p-5" style={{ borderLeft: '3px solid #2060B0', background: '#F0F7FF' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#2060B0' }}>{k}</p>
          <p className="text-sm font-semibold" style={{ color: '#1A3A6B' }}>{v}</p>
        </div>
      ))}
    </div>
  );
}

function TypeCards({ items }: { items: { label: string; desc: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(({ label, desc }) => (
        <div key={label} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(32,96,176,0.18)' }}>
          <div className="px-4 py-2.5" style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)' }}>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">{label}</p>
          </div>
          <div className="p-4 bg-white">
            <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2.5">
          <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: '#2060B0' }} />
          <span className="text-slate-600 text-xs leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}

function CheckGrid({ items }: { items: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2.5">
          <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: '#2060B0' }} />
          <span className="text-slate-600 text-xs leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="px-3 py-1.5 text-xs font-semibold rounded-full" style={{ background: 'rgba(26,58,107,0.08)', color: '#1A3A6B' }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(26,58,107,0.1)' }}>
            {headers.map((h) => (
              <th key={h} className="text-left pb-3 pr-4" style={{ fontSize: 10, fontWeight: 700, color: '#2060B0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(26,58,107,0.05)' }}>
              <td className="py-3 pr-4 text-xs font-semibold" style={{ color: '#1A3A6B' }}>{row[0]}</td>
              {row.slice(1).map((cell, j) => (
                <td key={j} className="py-3 pr-4 text-xs" style={{ color: '#4B6A8F' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tech content per service ─────────────────────────────────────────────────

function MOTTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Full width */}
      <div className="md:col-span-2">
        <Card title="What is a Modular OT?">
          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            A jointless and seamless structure designed to provide a clean and hygienic (0.3 micron) environment inside the O.T. — avoiding infection during surgery by controlling particulate matter, temperature, pressure and humidity. This process reduces bacteria by a factor of 15,000.
          </p>
          <TypeCards items={[
            { label: 'Superspeciality OT', desc: 'Neuroscience, Orthopedics, Cardiothoracic & Transplant surgery' },
            { label: 'General OT', desc: 'Laparoscopy, Ophthalmology, Gynecology, ENT, Dental, and more' },
          ]} />
        </Card>
      </div>

      {/* Row: Classification + LAF side by side */}
      <Card title="Clean Room Classification">
        <DataTable
          headers={['USA Class', 'ISO', 'Use Case']}
          rows={[
            ['100', 'ISO 5', 'Superspeciality OT'],
            ['1,000', 'ISO 6', 'General OT'],
            ['10,000', 'ISO 7', 'ICU / NICU'],
            ['100,000', 'ISO 8', 'General'],
          ]}
        />
      </Card>

      <Card title="Laminar Air Flow (LAF)">
        <p className="text-slate-600 text-xs leading-relaxed mb-4">
          Vertical LAF delivers 0.3µ HEPA-filtered air over the surgical table, creating a Class 100 / ISO 5 sterile zone. Reduces bacteria by 15,000×.
        </p>
        <CheckList items={['Air Handling Unit (AHU)', 'AC unit connected to AHU', 'HEPA Filters (0.3 micron)', 'Plenum Box above OT table', 'Distribution Ducting']} />
      </Card>

      {/* Full width: NABH Specs (large table) */}
      <div className="md:col-span-2">
        <Card title="NABH Specifications">
          <p className="text-xs mb-5" style={{ color: '#4B6A8F' }}>As per NABH & JCI Standards — Class 100/ISO 5</p>
          <DataTable
            headers={['Parameter', 'Superspeciality OT', 'General OT']}
            rows={[
              ['Temperature', '21 ± 3°C', '21 ± 3°C'],
              ['Pressure (Pascal)', '10–15', '10–15'],
              ['Humidity (Rh)', '40–60%', '40–60%'],
              ['Air Filtration', '10µ Pre + 5µ Fine + 0.3µ HEPA', 'Same'],
              ['Plenum Box Size', '8×6 ft', '6×4 ft'],
              ['Class US/ISO', '100 / ISO 5', '1,000 / ISO 6'],
              ['Air changes/hour', '> 25', '> 25'],
              ['Fresh Air Component', '> 5', '> 5'],
              ['Air Velocity (FPM)', '90–120', '90–120'],
            ]}
          />
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#2060B0' }}>NABH Guidelines</p>
            <CheckGrid items={[
              'Dedicated A.H.U. for every OT',
              'No Window AC or Split AC',
              'Non-porous, jointless-seamless walls/ceiling/floor — no 90° corners',
              'Washable with anti-bacterial & anti-fungal properties',
              'Regular cleaning of pre-filters',
              'Validation required on commissioning',
            ]} />
          </div>
        </Card>
      </div>

      {/* Full width: Wall Materials (large table) */}
      <div className="md:col-span-2">
        <Card title="Wall Material Options">
          <DataTable
            headers={['Material', 'Lifespan', 'Key Features']}
            rows={[
              ['Anti-bacterial Paint', '4–8 yrs', 'Cost-effective, glare free'],
              ['Epoxy Wall', '4–5 yrs', 'Moisture resistant, cost-effective'],
              ['Vinyl Wall', '10–12 yrs', 'Recyclable, glare free, anti-static'],
              ['ACP/HPL Sheet', '10–12 yrs', 'Moisture & abrasion resistant'],
              ['GI PUF Panels', '12–15 yrs', 'High moisture/wear resistance'],
              ['ACP/HPL PUF Panel', '12–15 yrs', 'High durability'],
              ['SS PUF Panels', '15–20 yrs', 'Very high durability'],
              ['Corian Panels', '20–25 yrs', 'Best — fully jointless/seamless, PTFE sealed'],
            ]}
          />
        </Card>
      </div>

      {/* Row: Flooring + Control Panel side by side */}
      <Card title="Flooring Options">
        <DataTable
          headers={['Material', 'Life', 'Features']}
          rows={[
            ['Epoxy Flooring', '4–5 yrs', 'Cost-effective, moisture resistant'],
            ['Vinyl — Geo', '10–12 yrs', 'Anti-static, seamless, glare free'],
            ['Vinyl — Tarkett', '10–12 yrs', 'Premium, anti-microbial, anti-static'],
            ['Vinyl — Gerflor', '10–12 yrs', 'French brand, hospital-grade, seamless'],
            ['Marble Flooring', '12–15 yrs', 'Durable — has joints, not NABH OT-compliant'],
          ]}
        />
      </Card>

      <Card title="OT Control Panel">
        <CheckList items={[
          'Time of Day & Elapsed Time Clocks',
          'Temperature & Humidity Controller',
          'Lighting Control / Dimming',
          'Medical Gas Alarm Systems',
          'HEPA Filter Status Indicator',
          'Laminar Flow & Pressure Indicator',
          'Hands Free Telephone',
          'Music Control',
        ]} />
      </Card>

      {/* Full width: Other components */}
      <div className="md:col-span-2">
        <Card title="Other MOT Components">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Pendants', desc: 'Surgical tools positioning and working environment' },
              { name: 'Hatch Box', desc: 'Transfer of material — minimises contaminant entry' },
              { name: 'Pressure Relief Damper', desc: 'Controls positive room pressure' },
              { name: 'Peripheral Light', desc: 'Glare free, 5,000 hrs, CRI >90%, 6500K, >13,000 Lux' },
              { name: 'LED X-Ray View Box', desc: '85% energy saving, auto-off, 12-step digital timer' },
              { name: 'Clean Room Doors', desc: 'Sliding & hinged — positive pressure, acoustic control' },
              { name: 'Storage Cabinet', desc: 'Modular storage integrated into OT structure' },
              { name: 'Scrub Sink (SS)', desc: 'Stainless steel surgical scrub sink' },
            ].map(({ name, desc }) => (
              <div key={name} className="flex items-start gap-2.5">
                <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: '#2060B0' }} />
                <div>
                  <span className="text-xs font-semibold" style={{ color: '#1A3A6B' }}>{name} — </span>
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MGPSTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Row: Copper specs + Gas outlets side by side */}
      <Card title="Copper Piping Specifications">
        <SpecGrid items={[
          ['Make', 'Mexflow'],
          ['Certification', 'BS EN 13348:2008 & Lloyd'],
          ['Grade', 'Medical Grade — Carbon Free'],
          ['Brazing Rod', 'Harris O, USA Make'],
          ['Process', 'Nitrogen Purging'],
        ]} />
      </Card>

      <Card title="Medical Gas Outlets">
        <p className="text-xs mb-3" style={{ color: '#4B6A8F' }}>4 international standards available</p>
        <DataTable
          headers={['Type', 'O-Rings', 'Lock']}
          rows={[
            ['S-Bracket', '1', 'Single'],
            ['Puritan-Bennet', '2', 'Double'],
            ['British Standard', '3', 'Double'],
            ['Datex-Ohmeda', '4', 'Double'],
          ]}
        />
      </Card>

      {/* Full width: Gases */}
      <div className="md:col-span-2">
        <Card title="Gases Supplied">
          <Pills items={['Oxygen (O₂)', 'Nitrous Oxide (N₂O)', 'Medical Air', 'Vacuum / Suction', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)']} />
        </Card>
      </div>

      {/* Row: Manifold + Ward equipment side by side */}
      <Card title="Manifold & Control Panel">
        <CheckList items={[
          'O₂ & N₂O Manifold (170–180 bar)',
          'Auto change-over Bank-A & Bank-B',
          'Enhances life of NRV (Non-Return Valve)',
          'Machine pressed — reduced breakage risk',
          'Semi-Automatic & Fully Automatic',
          'Analog & Digital versions available',
        ]} />
      </Card>

      <Card title="Zone & Ward Equipment">
        <CheckList items={[
          'Digital & Analog Area Alarm Systems',
          'Master Gas Alarm (multi-zone monitoring)',
          'Zonal Valve Box (emergency isolation)',
          'Bed Head Panels — gas + electrical sockets',
          'Single and multi-gas configurations',
        ]} />
      </Card>

      {/* Full width: Vacuum & Air plant */}
      <div className="md:col-span-2">
        <Card title="Vacuum & Air Plant">
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Indian and imported makes available — including Anest Iwata (Japan). Oil base and oil-free options.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2060B0' }}>Plant</p>
              <Pills items={['Vacuum Plant', 'Air Plant', 'Air Dryer (Indian)', 'Air Dryer (Imported)']} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2060B0' }}>Accessories</p>
              <div className="flex flex-wrap gap-2">
                {['Ward Vacuum Unit', 'BPC Flowmeter', 'OT Suction Trolley', 'MOX Regulator'].map((a) => (
                  <span key={a} className="px-3 py-1 text-xs rounded-lg" style={{ background: '#F0F4FA', color: '#4B6A8F', border: '1px solid rgba(26,58,107,0.1)' }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CleanRoomClassTable() {
  return (
    <DataTable
      headers={['USA Class', 'ISO Equivalent', 'Application']}
      rows={[
        ['100', 'ISO 5', 'Superspeciality OT / IVF Lab'],
        ['1,000', 'ISO 6', 'General OT'],
        ['10,000', 'ISO 7', 'ICU / NICU'],
        ['100,000', 'ISO 8', 'General / CSSD'],
      ]}
    />
  );
}

function HVACTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card title="Clean Room Classification"><CleanRoomClassTable /></Card>
      <Card title="Applications">
        <Pills items={['Operation Theatres (ISO 5–ISO 8)', 'ICU / NICU', 'IVF Labs', 'Negative Pressure Isolation Rooms', 'CSSD', 'Pharmaceutical Cleanrooms']} />
      </Card>
      <div className="md:col-span-2">
        <Card title="NABH HVAC Requirements">
          <CheckGrid items={[
            'Dedicated Air Handling Unit (AHU) for every OT zone',
            'No Window AC or Split AC in critical clinical areas',
            'Non-porous, jointless-seamless wall, ceiling and flooring',
            'No 90° corners — prevents bacterial formation in joints or cracks',
            'Washable surfaces with anti-bacterial and anti-fungal properties',
            'Regular cleaning and replacement schedule for pre-filters',
            'Commissioning validation with documented airflow and particle counts',
          ]} />
        </Card>
      </div>
    </div>
  );
}

function CleanRoomTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card title="Clean Room Classification"><CleanRoomClassTable /></Card>
      <Card title="System Components">
        <CheckList items={[
          'Wall panels (various material options)',
          'Walkable & non-walkable ceiling panels',
          'Risers',
          'Sliding & Hinged Clean Room Doors',
          'View panels',
          'Covings (coved corners — no 90°)',
          'All customised to requirements',
        ]} />
      </Card>
      <div className="md:col-span-2">
        <Card title="Applications">
          <Pills items={['Operation Theatres (Class 100/ISO 5 to ISO 8)', 'ICU / NICU', 'IVF Labs', 'Negative Pressure Isolation Rooms', 'CSSD', 'Pharmaceutical Cleanrooms']} />
        </Card>
      </div>
    </div>
  );
}

function LAFTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div className="md:col-span-2">
        <Card title="How Laminar Air Flow Works">
          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            Vertical Laminar Air Flow delivers HEPA-filtered (0.3 micron) unidirectional air directly over the operating table, sweeping particles away from the surgical site and creating a Class 100 / ISO 5 sterile zone — reducing bacteria by a factor of 15,000.
          </p>
          <CheckGrid items={[
            'Air Handling Unit (AHU)',
            'AC unit connected to AHU',
            'HEPA Filters (0.3 micron / H14)',
            'Plenum Box — 8×6 ft (Superspeciality) / 6×4 ft (General)',
            'Distribution Ducting',
            'Unidirectional vertical airflow pattern',
          ]} />
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card title="Performance Specifications">
          <SpecGrid items={[
            ['Air Velocity', '90–120 FPM'],
            ['Filtration', '0.3 micron HEPA'],
            ['Air Changes/hr', '> 25'],
            ['Cleanliness Class', 'ISO 5 / Class 100'],
            ['Fresh Air Component', '> 5 ACH'],
            ['Particle Removal', '15,000× reduction'],
          ]} />
        </Card>
      </div>
    </div>
  );
}

function ICUTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card title="ICU Environmental Standard">
        <SpecGrid items={[
          ['Classification', 'ISO 7 / Class 10,000'],
          ['Temperature', '21 ± 3°C'],
          ['Humidity', '40–60% Rh'],
        ]} />
        <p className="text-xs mt-4 leading-relaxed" style={{ color: '#4B6A8F' }}>
          Designed to ISO 7 / Class 10,000 — significantly reduces hospital-acquired infections (HAI) in critically ill patients.
        </p>
      </Card>
      <Card title="Integrated Systems">
        <CheckList items={[
          'MGPS Bed Head Panels (O₂, Air, Vacuum)',
          'Medical Pendant Systems',
          'Infection-control modular wall panels',
          'Dedicated HVAC (positive/negative pressure)',
          'Full electrical and data infrastructure',
          'Coved corners — no 90° joints',
          'Anti-microbial surface finishes',
          'Optimised clinical lighting',
        ]} />
      </Card>
    </div>
  );
}

function NICUTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card title="NICU Environmental Standard">
        <SpecGrid items={[
          ['Classification', 'ISO 7 / Class 10,000'],
          ['Temperature', '21 ± 3°C (precise)'],
          ['Humidity', '40–60% Rh'],
        ]} />
        <p className="text-xs mt-4 leading-relaxed" style={{ color: '#4B6A8F' }}>
          Tighter thermal tolerances and lower noise than standard ICUs — every parameter optimised for premature and critically ill newborns.
        </p>
      </Card>
      <Card title="NICU-Specific Features">
        <CheckList items={[
          'Individual bay gas services — O₂, Air, Vacuum',
          'Low-turbulence HVAC (minimises disturbance)',
          'Anti-microbial surface finishes throughout',
          'Low-glare clinical lighting per bay',
          'MGPS Bed Head Panels at each incubator',
          'Positive pressure for immunocompromised neonates',
          'Coved corners — no 90° joints',
          'Sliding clean room doors for quiet operation',
        ]} />
      </Card>
    </div>
  );
}

function IVFTechContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div className="md:col-span-2">
        <Card title="IVF Lab Environmental Requirements">
          <SpecGrid items={[
            ['Cleanroom Class', 'ISO 5 / Class 100'],
            ['Temperature', 'Precision 21 ± 1°C'],
            ['Humidity', '40–60% Rh'],
            ['VOC Level', 'Effectively zero'],
            ['Particulate', '< 100 particles ≥ 0.5µm/ft³'],
            ['Compliance', 'ICMR Guidelines'],
          ]} />
          <p className="text-xs mt-4 leading-relaxed" style={{ color: '#4B6A8F' }}>
            Even trace VOCs can compromise embryo viability — every material, adhesive and finish is selected for zero off-gassing.
          </p>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card title="What's Included">
          <CheckGrid items={[
            'ISO Class 5 cleanroom construction',
            'VOC-free wall, ceiling and flooring materials',
            'Purpose-built HEPA-filtered HVAC system',
            'CO₂ gas supply system for incubators',
            'N₂ gas supply for liquid nitrogen storage',
            'Positive pressure environment',
            'Laminar air flow over embryology workstations',
            'Interlocked clean room door systems',
          ]} />
        </Card>
      </div>
    </div>
  );
}

function ProductTechContent({ slug }: { slug: string }) {
  if (slug === 'modular-operation-theatre')   return <MOTTechContent />;
  if (slug === 'medical-gas-pipeline-system') return <MGPSTechContent />;
  if (slug === 'hvac-cleanroom-engineering')  return <HVACTechContent />;
  if (slug === 'clean-room-solutions')        return <CleanRoomTechContent />;
  if (slug === 'laminar-air-flow-systems')    return <LAFTechContent />;
  if (slug === 'modular-icu-solutions')       return <ICUTechContent />;
  if (slug === 'modular-nicu-solutions')      return <NICUTechContent />;
  if (slug === 'ivf-lab-setup')               return <IVFTechContent />;
  return null;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    productsApi.get(slug)
      .then(({ data }) => setProduct(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    productItemsApi.listBySlug(slug)
      .then(({ data }) => setProducts(data))
      .catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/60 rounded-2xl w-1/3" />
              <div className="h-16 bg-white/60 rounded-2xl w-2/3" />
              <div className="h-4 bg-white/60 rounded-xl w-full" />
              <div className="h-4 bg-white/60 rounded-xl w-5/6" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !product) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28 text-center">
          <h1 className="text-4xl font-black mb-4" style={{ color: '#1A3A6B' }}>Product Not Found</h1>
          <p className="text-slate-500 mb-8">This product doesn't exist or has been removed.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded-full" style={{ background: '#1A3A6B' }}>
            <ArrowLeft size={15} /> Back to Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const paragraphs = product.long_desc
    ? product.long_desc.split('\n').filter((p) => p.trim().length > 0)
    : [];
  const galleryImages = product.images ?? [];

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(32,96,176,0.12) 0%, transparent 65%)', filter: 'blur(48px)' }} />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors mb-8 hover:opacity-80" style={{ color: '#4B6A8F' }}>
              <ArrowLeft size={14} /> All Products
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: '#2060B0' }}>Product</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-5" style={{ color: '#1A3A6B' }}>
              {product.title}
            </h1>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#4B6A8F' }}>{product.short_desc}</p>
          </div>
        </section>

        {/* ── Banner Image ──────────────────────────────────────── */}
        {product.icon_url && (
          <section className="pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl bg-slate-100">
                <img
                  src={product.icon_url}
                  alt={product.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Content ───────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main */}
              <div className="lg:col-span-2">
                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-sm overflow-hidden">
                    <div className="relative max-w-[600px] mx-auto bg-slate-100">
                      <img
                        src={galleryImages[activeImg].image_url}
                        alt={galleryImages[activeImg].caption ?? product.title}
                        className="w-full h-auto"
                      />
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ChevronLeft size={16} style={{ color: '#1A3A6B' }} />
                          </button>
                          <button
                            onClick={() => setActiveImg((prev) => (prev + 1) % galleryImages.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ChevronRight size={16} style={{ color: '#1A3A6B' }} />
                          </button>
                        </>
                      )}
                    </div>
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {galleryImages.map((img, i) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImg(i)}
                            className="shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all"
                            style={{ borderColor: i === activeImg ? '#2060B0' : 'transparent', opacity: i === activeImg ? 1 : 0.6 }}
                          >
                            <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* About card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-7">
                  <h2 className="text-lg font-black mb-4" style={{ color: '#1A3A6B' }}>About This Product</h2>
                  {paragraphs.length > 0 ? (
                    <div className="space-y-3">
                      {paragraphs.map((p, i) => (
                        <p key={i} className="text-slate-600 leading-relaxed text-sm">{p}</p>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: '#4B6A8F' }}>{product.short_desc}</p>
                      <CheckGrid items={[
                        'End-to-end project delivery', 'NABH & AERB compliant',
                        'Biomedical engineer support', 'Pan-India installation',
                        'After-sales maintenance', 'Turnkey solutions available',
                      ]} />
                    </>
                  )}
                </div>

                {/* Technical sections */}
                <ProductTechContent slug={slug} />

                {/* Projects CTA */}
                <div className="mt-8 rounded-3xl p-6 flex items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, rgba(26,58,107,0.06) 0%, rgba(32,96,176,0.08) 100%)', border: '1px solid rgba(32,96,176,0.12)' }}>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1A3A6B' }}>See Projects Using This Product</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4B6A8F' }}>Browse our completed hospital projects</p>
                  </div>
                  <Link href="/projects" className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-full transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)' }}>
                    Projects <ArrowRight size={12} />
                  </Link>
                </div>

              </div>

              {/* Sidebar */}
              <div className="space-y-4 sticky top-28 self-start">
                {/* Quote card */}
                <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(183,215,240,0.9)' }}>Get a Quote</p>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Interested in {product.title}? Let's discuss your project requirements.
                  </p>
                  <a
                    href="https://wa.me/919409428888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white font-bold text-sm rounded-xl transition-opacity hover:opacity-90"
                    style={{ color: '#1A3A6B' }}
                  >
                    <MessageCircle size={14} /> WhatsApp Us
                  </a>
                  <Link
                    href={`/service-request?category=${slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 font-semibold text-sm rounded-xl transition-colors hover:opacity-90"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
                  >
                    Request Support
                  </Link>
                  <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 font-semibold text-sm rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
                    Send Inquiry
                  </Link>
                  {products.length > 0 && (
                    <button
                      onClick={() => document.getElementById('products-tools')?.scrollIntoView({ behavior: 'smooth' })}
                      className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 font-semibold text-sm rounded-xl transition-colors"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
                    >
                      View Products & Tools ↓
                    </button>
                  )}
                </div>

                {/* Other products */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#2060B0' }}>Other Products</p>
                  <div className="space-y-1">
                    {[
                      { label: 'Modular OT',      slug: 'modular-operation-theatre' },
                      { label: 'MGPS (OxyMac™)',   slug: 'medical-gas-pipeline-system' },
                      { label: 'HVAC & Cleanroom', slug: 'hvac-cleanroom-engineering' },
                      { label: 'ICU Solutions',    slug: 'modular-icu-solutions' },
                      { label: 'IVF Lab Setup',    slug: 'ivf-lab-setup' },
                    ].filter((s) => s.slug !== slug).map((s) => (
                      <Link key={s.slug} href={`/products/${s.slug}`} className="flex items-center gap-2.5 py-2 text-sm transition-colors rounded-lg px-2 hover:bg-[#F0F7FF]" style={{ color: '#4B6A8F' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2060B0' }} />
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Products & Tools — full width */}
            {products.length > 0 && (
              <div id="products-tools" className="mt-10 bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: '#2060B0' }}>Products & Tools</p>
                <h2 className="text-lg font-black mb-1" style={{ color: '#1A3A6B' }}>What We Use</h2>
                <p className="text-sm mt-2 mb-6" style={{ color: '#4B6A8F' }}>Equipment and materials we use for {product.title}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => (
                    <div key={p.id} className="rounded-2xl p-5 border border-slate-100 bg-white shadow-sm">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-full h-36 object-cover rounded-xl mb-4" />
                      )}
                      <h3 className="font-bold text-sm mb-1.5" style={{ color: '#1A3A6B' }}>{p.name}</h3>
                      {p.description && <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>


      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}