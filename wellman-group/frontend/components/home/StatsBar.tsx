const stats = [
  { value: '12+',  label: 'Years Experience' },
  { value: '185+', label: 'Hospitals Served' },
  { value: '45+',  label: 'Cities Across India' },
  { value: '8',    label: 'Core Services' },
];

export default function StatsBar() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-10 px-4 text-center">
              <span className="text-4xl font-black text-white mb-1">{value}</span>
              <span className="text-sm text-[#7DC0E4]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
