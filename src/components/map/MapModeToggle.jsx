const modes = [
  { label: 'Price', value: 'price' },
  { label: 'Demand', value: 'demand' },
  { label: 'Availability', value: 'availability' },
]

function MapModeToggle({ mode, onChange }) {
  return (
    <div className="inline-grid rounded-xl border border-[#DED8CF] bg-white p-1 shadow-sm sm:grid-cols-3">
      {modes.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
            mode === item.value
              ? 'bg-[#F97316] text-white shadow-[0_10px_24px_rgba(249,115,22,0.22)]'
              : 'text-[#6B7280] hover:bg-[#F8F7F4] hover:text-[#111827]'
          }`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default MapModeToggle
