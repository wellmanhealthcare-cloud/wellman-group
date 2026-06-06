'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types/service';

// ── Static technical content per slug ───────────────────────────────────────

function MOTTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">What is a Modular OT?</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          A jointless and seamless structure designed to provide a clean and hygienic (0.3 micron) environment inside the O.T. — avoiding infection during surgery by controlling particulate matter, temperature, pressure and humidity. This process reduces bacteria by a factor of 15,000.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Superspeciality OT', desc: 'Neuroscience, Orthopedics, Cardiothoracic & Transplant surgery' },
            { label: 'General OT', desc: 'Laparoscopy, Ophthalmology, Gynecology, ENT, Dental, and more' },
          ].map(({ label, desc }) => (
            <div key={label} className="bg-[#ECEEF8] rounded-2xl p-4">
              <p className="text-xs font-bold text-[#3E63DD] uppercase tracking-wider mb-1">{label}</p>
              <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Clean Room Classification</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['USA Class', 'ISO Equivalent', 'Use Case'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ['100', 'ISO 5', 'Superspeciality OT'],
                ['1,000', 'ISO 6', 'General OT'],
                ['10,000', 'ISO 7', 'ICU / NICU'],
                ['100,000', 'ISO 8', 'General'],
              ].map(([cls, iso, use]) => (
                <tr key={cls}>
                  <td className="py-3 font-semibold text-slate-900 text-sm pr-4">{cls}</td>
                  <td className="py-3 text-slate-600 text-sm pr-4">{iso}</td>
                  <td className="py-3 text-slate-500 text-sm">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-2">NABH Specifications</h2>
        <p className="text-slate-500 text-xs mb-5">As per NABH & JCI Standards — Class 100/ISO 5</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Parameter', 'Superspeciality OT', 'General OT'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ['Temperature', '21 ± 3°C', '21 ± 3°C'],
                ['Pressure (Pascal)', '10–15', '10–15'],
                ['Humidity (Rh)', '40–60%', '40–60%'],
                ['Air Filtration', '10µ Pre + 5µ Fine + 0.3µ HEPA', 'Same'],
                ['Plenum Box Size', '8×6 ft', '6×4 ft'],
                ['Class US/ISO', '100 / ISO 5', '1,000 / ISO 6'],
                ['Air changes/hour', '> 25', '> 25'],
                ['Fresh Air Component', '> 5', '> 5'],
                ['Air Velocity (FPM)', '90–120', '90–120'],
              ].map(([param, ss, gen]) => (
                <tr key={param}>
                  <td className="py-3 font-medium text-slate-700 text-xs pr-4">{param}</td>
                  <td className="py-3 text-slate-600 text-xs pr-4">{ss}</td>
                  <td className="py-3 text-slate-500 text-xs">{gen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 space-y-1.5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NABH Guidelines</p>
          {[
            'Dedicated A.H.U. for every OT',
            'No Window AC or Split AC',
            'Wall, Ceiling & Flooring: non-porous, jointless-seamless, no 90° corners, washable with anti-bacterial and anti-fungal properties',
            'Regular cleaning of pre-filters',
            'Validation required on commissioning',
          ].map((g) => (
            <div key={g} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <span className="text-slate-600 text-xs">{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Laminar Air Flow (LAF)</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          Vertical Laminar Air Flow is the primary component of a Modular OT. It delivers 0.3 micron HEPA-filtered air directly over the surgical table, killing bacteria inside the OT area and creating a Class 100 / ISO 5 sterile zone. The secondary component is the complete jointless and seamless structure — no 90° corners to prevent bacterial formation in joints or cracks.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {['Air Handling Unit (AHU)', 'AC unit connected to AHU', 'HEPA Filters (0.3 micron)', 'Plenum (Filter Housing) Box above OT table', 'Distribution Ducting'].map((c) => (
            <div key={c} className="flex items-center gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0" />
              <span className="text-slate-600 text-xs">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Wall Material Options</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Material', 'Life', 'Key Features'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ['Anti-bacterial Paint', '4–8 yrs', 'Cost-effective, glare free'],
                ['Epoxy Wall', '4–5 yrs', 'Moisture resistant, cost-effective'],
                ['Vinyl Wall', '10–12 yrs', 'Recyclable, glare free, anti-static'],
                ['ACP/HPL Sheet', '10–12 yrs', 'Moisture & abrasion resistant'],
                ['GI PUF Panels', '12–15 yrs', 'High moisture/wear resistance'],
                ['ACP/HPL PUF Panel', '12–15 yrs', 'High durability'],
                ['SS PUF Panels', '15–20 yrs', 'Very high durability'],
                ['Corian Panels', '20–25 yrs', 'Best quality — fully jointless/seamless, PTFE sealed'],
              ].map(([mat, life, feat]) => (
                <tr key={mat}>
                  <td className="py-3 font-medium text-slate-700 text-xs pr-4">{mat}</td>
                  <td className="py-3 text-slate-600 text-xs pr-4">{life}</td>
                  <td className="py-3 text-slate-500 text-xs">{feat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Flooring Material Options</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Material', 'Life', 'Key Features'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ['Epoxy Flooring', '4–5 yrs', 'Cost-effective, moisture resistant'],
                ['Vinyl Flooring', '10–12 yrs', 'Anti-static, recyclable, glare free'],
                ['Marble Flooring', '12–15 yrs', 'Durable — note: not jointless/seamless'],
              ].map(([mat, life, feat]) => (
                <tr key={mat}>
                  <td className="py-3 font-medium text-slate-700 text-xs pr-4">{mat}</td>
                  <td className="py-3 text-slate-600 text-xs pr-4">{life}</td>
                  <td className="py-3 text-slate-500 text-xs">{feat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">OT Control Panel Features</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Time of Day Clock', 'Elapsed Time Clock', 'Temperature Controller',
            'Humidity Controller', 'Lighting Control / Dimming', 'Medical Gas Alarm Systems',
            'Hands Free Telephone', 'HEPA Filter Status Indicator',
            'Laminar Flow Status', 'OT Pressure Indicator', 'Music Control',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0" />
              <span className="text-slate-600 text-xs">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Other MOT Components</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'Pendants', desc: 'Well designed surgical tools positioning and working environment' },
            { name: 'Hatch Box', desc: 'For transfer of material — minimises contaminant entry' },
            { name: 'Pressure Relief Damper', desc: 'Controls positive room pressure' },
            { name: 'Peripheral Light', desc: 'Glare free, 5,000 hrs life, CRI >90%, Color Temp 6500K, >13,000 Lux' },
            { name: 'LED X-Ray View Box', desc: '85% energy saving, film-activated auto-off switch, 12-step digital timer' },
            { name: 'Clean Room Doors', desc: 'Sliding & hinged — maintains positive pressure, acoustic and contamination control' },
            { name: 'Storage Cabinet', desc: 'Modular storage integrated into the OT structure' },
            { name: 'Scrub Sink (SS)', desc: 'Stainless steel surgical scrub sink' },
          ].map(({ name, desc }) => (
            <div key={name} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-700 text-xs font-semibold">{name}</span>
                <span className="text-slate-500 text-xs"> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MGPSTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Copper Piping Specifications</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['Make', 'Mexflow'],
            ['Certification', 'BS EN 13348:2008 & Lloyd Certified'],
            ['Grade', 'Medical Grade; Carbon Free (Pipe & Elbow)'],
            ['Brazing Rod', 'Harris O, USA Make'],
            ['Process', 'Nitrogen Purging'],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#ECEEF8] rounded-xl p-4">
              <p className="text-xs font-bold text-[#3E63DD] uppercase tracking-wider mb-1">{k}</p>
              <p className="text-slate-700 text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Medical Gas Outlets — 4 Standards Available</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Type', 'O-Rings', 'Lock'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ['S-Bracket', '1', 'Single'],
                ['Puritan-Bennet', '2', 'Double'],
                ['British Standard', '3', 'Double'],
                ['Datex-Ohmeda', '4', 'Double'],
              ].map(([type, rings, lock]) => (
                <tr key={type}>
                  <td className="py-3 font-medium text-slate-700 pr-4">{type}</td>
                  <td className="py-3 text-slate-600 pr-4">{rings}</td>
                  <td className="py-3 text-slate-500">{lock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Gases Supplied</h2>
        <div className="flex flex-wrap gap-2">
          {['Oxygen (O₂)', 'Nitrous Oxide (N₂O)', 'Medical Air', 'Vacuum / Suction', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)'].map((g) => (
            <span key={g} className="px-3 py-1.5 bg-[#ECEEF8] text-[#3E63DD] text-xs font-semibold rounded-full">{g}</span>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">System Components</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Manifold & Control Panel</p>
            <div className="space-y-2">
              {[
                'O₂ & N₂O Manifold (170–180 bar pressure capacity)',
                'Auto change-over between Bank-A & Bank-B',
                'Enhances life of NRV (Non-Return Valve)',
                'Machine pressed — reduced breakage risk',
                'Semi-Automatic & Fully Automatic options',
                'Available in Analog & Digital versions',
              ].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs">{i}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Zone & Ward Equipment</p>
            <div className="space-y-2">
              {[
                'Digital & Analog Area Alarm Systems',
                'Master Gas Alarm System (multi-zone monitoring)',
                'Zonal Valve Box (break-in-case-of-emergency with isolation valve)',
                'Bed Head Panels — integrates gas outlets + electrical sockets',
                'Available in single and multi-gas configurations',
              ].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-xs">{i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Vacuum & Air Plant</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Indian and imported makes available — including Anest Iwata (Japan). Oil base and oil-free options.
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {['Vacuum Plant', 'Air Plant', 'Air Dryer (Indian)', 'Air Dryer (Imported)'].map((a) => (
            <span key={a} className="px-3 py-1 bg-[#ECEEF8] text-[#3E63DD] text-xs font-semibold rounded-full">{a}</span>
          ))}
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Accessories</p>
        <div className="flex flex-wrap gap-2">
          {['Ward Vacuum Unit', 'BPC Flowmeter', 'OT Suction Trolley', 'MOX Regulator'].map((a) => (
            <span key={a} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs rounded-lg">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CleanRoomClassTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['USA Class', 'ISO Equivalent', 'Application'].map((h) => (
              <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            ['100', 'ISO 5', 'Superspeciality OT / IVF Lab'],
            ['1,000', 'ISO 6', 'General OT'],
            ['10,000', 'ISO 7', 'ICU / NICU'],
            ['100,000', 'ISO 8', 'General / CSSD'],
          ].map(([cls, iso, app]) => (
            <tr key={cls}>
              <td className="py-3 font-semibold text-slate-900 text-sm pr-4">{cls}</td>
              <td className="py-3 text-slate-600 text-sm pr-4">{iso}</td>
              <td className="py-3 text-slate-500 text-sm">{app}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HVACTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Clean Room Classification</h2>
        <CleanRoomClassTable />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">NABH HVAC Requirements</h2>
        <div className="space-y-2">
          {[
            'Dedicated Air Handling Unit (AHU) for every OT zone',
            'No Window AC or Split AC in critical clinical areas',
            'Non-porous, jointless-seamless wall, ceiling and flooring materials',
            'No 90° corners — prevents bacterial formation in joints or cracks',
            'Washable surfaces with anti-bacterial and anti-fungal properties',
            'Regular cleaning and replacement schedule for pre-filters',
            'Commissioning validation with documented airflow and particle counts',
          ].map((g) => (
            <div key={g} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <span className="text-slate-600 text-xs">{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Applications</h2>
        <div className="flex flex-wrap gap-2">
          {['Operation Theatres (ISO 5–ISO 8)', 'ICU / NICU', 'IVF Labs', 'Negative Pressure Isolation Rooms', 'CSSD', 'Pharmaceutical Cleanrooms'].map((a) => (
            <span key={a} className="px-3 py-1.5 bg-[#ECEEF8] text-[#3E63DD] text-xs font-semibold rounded-full">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CleanRoomTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Clean Room Classification</h2>
        <CleanRoomClassTable />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">System Components</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Wall panels (various material options)',
            'Walkable ceiling panels',
            'Non-walkable ceiling panels',
            'Risers',
            'Sliding & Hinged Clean Room Doors',
            'View panels',
            'Covings (coved corners — no 90°)',
            'All customised to specific requirements',
          ].map((c) => (
            <div key={c} className="flex items-center gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0" />
              <span className="text-slate-600 text-xs">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Applications</h2>
        <div className="flex flex-wrap gap-2">
          {['Operation Theatres (Class 100/ISO 5 to ISO 8)', 'ICU / NICU', 'IVF Labs', 'Negative Pressure Isolation Rooms', 'CSSD', 'Pharmaceutical Cleanrooms'].map((a) => (
            <span key={a} className="px-3 py-1.5 bg-[#ECEEF8] text-[#3E63DD] text-xs font-semibold rounded-full">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LAFTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">How Laminar Air Flow Works</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          Vertical Laminar Air Flow delivers HEPA-filtered (0.3 micron) unidirectional air directly over the operating table. This continuous column of clean air sweeps particles and micro-organisms away from the surgical site, creating a localised Class 100 / ISO 5 sterile zone inside the OT — reducing bacteria by a factor of 15,000 compared to conventional ventilation.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Air Handling Unit (AHU)',
            'AC unit connected to AHU',
            'HEPA Filters (0.3 micron / H14)',
            'Plenum (Filter Housing) Box — sized 8×6 ft (Superspeciality) / 6×4 ft (General)',
            'Distribution Ducting',
            'Unidirectional vertical airflow pattern',
          ].map((c) => (
            <div key={c} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <span className="text-slate-600 text-xs">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Performance Specifications</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['Air Velocity', '90–120 FPM'],
            ['Filtration', '0.3 micron HEPA'],
            ['Air Changes/hr', '> 25'],
            ['Cleanliness Class', 'ISO 5 / Class 100'],
            ['Fresh Air Component', '> 5 ACH'],
            ['Particle removal', '15,000× reduction'],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#ECEEF8] rounded-xl p-3">
              <p className="text-xs font-bold text-[#3E63DD] uppercase tracking-wider mb-0.5">{k}</p>
              <p className="text-slate-700 text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ICUTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Clean Room Standard for ICU</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          {[
            ['Classification', 'ISO 7 / Class 10,000'],
            ['Temperature', '21 ± 3°C'],
            ['Humidity', '40–60% Rh'],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#ECEEF8] rounded-xl p-4">
              <p className="text-xs font-bold text-[#3E63DD] uppercase tracking-wider mb-1">{k}</p>
              <p className="text-slate-700 text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs">
          ICU environments are designed to ISO 7 / Class 10,000 — providing a controlled clean environment that significantly reduces hospital-acquired infections (HAI) in critically ill patients.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Integrated Systems</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'MGPS Bed Head Panels (O₂, Medical Air, Vacuum)',
            'Medical Pendant Systems',
            'Infection-control modular wall panels',
            'Dedicated HVAC with positive or negative pressure',
            'Full electrical and data infrastructure',
            'Coved corners — no 90° joints',
            'Anti-microbial surface finishes',
            'Optimised clinical lighting',
          ].map((f) => (
            <div key={f} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <span className="text-slate-600 text-xs">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NICUTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">Clean Room Standard for NICU</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          {[
            ['Classification', 'ISO 7 / Class 10,000'],
            ['Temperature', '21 ± 3°C (precise)'],
            ['Humidity', '40–60% Rh'],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#ECEEF8] rounded-xl p-4">
              <p className="text-xs font-bold text-[#3E63DD] uppercase tracking-wider mb-1">{k}</p>
              <p className="text-slate-700 text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs">
          NICU environments demand tighter thermal tolerances and lower noise levels than standard ICUs. Every design parameter is optimised around the needs of premature and critically ill newborns.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">NICU-Specific Features</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Individual bay gas services — O₂, Medical Air, Vacuum',
            'Low-turbulence HVAC (minimises disturbance to neonates)',
            'Anti-microbial surface finishes throughout',
            'Optimised low-glare clinical lighting per bay',
            'Dedicated MGPS Bed Head Panels at each incubator position',
            'Positive pressure environment to protect immunocompromised neonates',
            'Coved corners — no 90° joints for easy disinfection',
            'Sliding clean room doors for quiet operation',
          ].map((f) => (
            <div key={f} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <span className="text-slate-600 text-xs">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IVFTechContent() {
  return (
    <div className="space-y-5 mt-5">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">IVF Lab Environmental Requirements</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {[
            ['Cleanroom Class', 'ISO 5 / Class 100'],
            ['Temperature', 'Precision controlled 21 ± 1°C'],
            ['Humidity', '40–60% Rh'],
            ['VOC Level', 'Effectively zero (VOC-free materials)'],
            ['Particulate', '< 100 particles ≥ 0.5 µm per ft³'],
            ['Compliance', 'ICMR Guidelines'],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#ECEEF8] rounded-xl p-4">
              <p className="text-xs font-bold text-[#3E63DD] uppercase tracking-wider mb-1">{k}</p>
              <p className="text-slate-700 text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs">
          An IVF lab is the most environmentally sensitive clinical space — even trace VOCs can compromise embryo viability. Every material, adhesive and finish used in a Wellman IVF lab is selected for zero off-gassing.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-900 mb-5">What's Included</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'ISO Class 5 cleanroom construction',
            'VOC-free wall, ceiling and flooring materials',
            'Purpose-built HEPA-filtered HVAC system',
            'CO₂ gas supply system for incubators',
            'N₂ gas supply for liquid nitrogen storage',
            'Positive pressure environment',
            'Laminar air flow over embryology workstations',
            'Interlocked clean room door systems',
          ].map((f) => (
            <div key={f} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-[#3E63DD] shrink-0 mt-0.5" />
              <span className="text-slate-600 text-xs">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceTechContent({ slug }: { slug: string }) {
  if (slug === 'modular-operation-theatre') return <MOTTechContent />;
  if (slug === 'medical-gas-pipeline-system') return <MGPSTechContent />;
  if (slug === 'hvac-cleanroom-engineering') return <HVACTechContent />;
  if (slug === 'clean-room-solutions') return <CleanRoomTechContent />;
  if (slug === 'laminar-air-flow-systems') return <LAFTechContent />;
  if (slug === 'modular-icu-solutions') return <ICUTechContent />;
  if (slug === 'modular-nicu-solutions') return <NICUTechContent />;
  if (slug === 'ivf-lab-setup') return <IVFTechContent />;
  return null;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    servicesApi.get(slug)
      .then(({ data }) => setService(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (notFound || !service) {
    return (
      <>
        <Navbar />
        <main className="pt-36 pb-28 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Service Not Found</h1>
          <p className="text-slate-500 mb-8">This service doesn't exist or has been removed.</p>
          <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E63DD] text-white font-semibold text-sm rounded-full">
            <ArrowLeft size={15} /> Back to Services
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const paragraphs = service.long_desc
    ? service.long_desc.split('\n').filter((p) => p.trim().length > 0)
    : [];

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(62,99,221,0.15) 0%, transparent 65%)', filter: 'blur(48px)' }} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#3E63DD] transition-colors mb-8">
              <ArrowLeft size={14} /> All Services
            </Link>
            <p className="text-[#3E63DD] text-xs font-bold uppercase tracking-[0.2em] mb-4">Service</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              {service.title}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">{service.short_desc}</p>
          </div>
        </section>

        {/* ── Banner Image (shown when icon_url is set in admin) ── */}
        {service.icon_url && (
          <section className="pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-96 shadow-xl">
                <img
                  src={service.icon_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </section>
        )}

        {/* ── Content ──────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main content */}
              <div className="lg:col-span-2">
                {paragraphs.length > 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
                    <h2 className="text-xl font-black text-slate-900 mb-5">About This Service</h2>
                    <div className="space-y-4">
                      {paragraphs.map((p, i) => (
                        <p key={i} className="text-slate-600 leading-relaxed text-sm">{p}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-8">
                    <h2 className="text-xl font-black text-slate-900 mb-5">About This Service</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.short_desc}</p>
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {['End-to-end project delivery', 'NABH & AERB compliant', 'Biomedical engineer support', 'Pan-India installation', 'After-sales maintenance', 'Turnkey solutions available'].map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-[#3E63DD] shrink-0" />
                          <span className="text-slate-600 text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical content from company profile PDFs */}
                <ServiceTechContent slug={slug} />

                {/* Projects CTA */}
                <div className="mt-5 bg-[#ECEEF8] rounded-3xl p-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">See Projects Using This Service</p>
                    <p className="text-slate-500 text-xs mt-0.5">Browse our completed hospital projects</p>
                  </div>
                  <Link href="/projects" className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-[#3E63DD] text-white text-xs font-semibold rounded-full hover:bg-[#3558c8] transition-colors">
                    Projects <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Contact card */}
                <div className="bg-[#3E63DD] rounded-2xl p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Get a Quote</p>
                  <p className="text-sm text-blue-100 mb-5 leading-relaxed">Interested in {service.title}? Let's discuss your project requirements.</p>
                  <a
                    href="https://wa.me/919409428888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-[#3E63DD] font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <MessageCircle size={14} /> WhatsApp Us
                  </a>
                  <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors">
                    Send Inquiry
                  </Link>
                </div>

                {/* Other services */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Other Services</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Modular OT', slug: 'modular-operation-theatre' },
                      { label: 'MGPS (OxyMac™)', slug: 'medical-gas-pipeline-system' },
                      { label: 'HVAC & Cleanroom', slug: 'hvac-cleanroom-engineering' },
                      { label: 'ICU Solutions', slug: 'modular-icu-solutions' },
                      { label: 'IVF Lab Setup', slug: 'ivf-lab-setup' },
                    ].filter((s) => s.slug !== slug).map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#3E63DD] transition-colors py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
