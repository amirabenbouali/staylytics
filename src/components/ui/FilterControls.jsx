import { formatCurrency } from '../../utils/analytics'

export function Chevron({ open }) {
  return (
    <svg
      className={`text-[#6B7280] transition-transform ${open ? 'rotate-180' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FilterDropdown({ label, value, options, open, onToggle, onClose, onChange, accent = '#FF5A5F' }) {
  return (
    <div className="relative min-w-0">
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">
        {label}
      </label>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-[#E2DDD5] bg-[#FBFAF8] px-3.5 text-left text-sm font-semibold text-[#111827] outline-none transition hover:border-[#CFC7BC] hover:bg-white focus:ring-4"
        style={{
          '--tw-ring-color': `${accent}1A`,
          borderColor: open ? accent : undefined,
          backgroundColor: open ? '#FFFFFF' : undefined,
        }}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{value}</span>
        <Chevron open={open} />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-[#E5E0D8] bg-white p-1.5 shadow-[0_22px_50px_rgba(17,24,39,0.14)]">
          <ul className="max-h-64 overflow-auto" role="listbox">
            {options.map((option) => {
              const selected = option === value

              return (
                <li key={option}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#374151] transition hover:bg-[#F8F7F4]"
                    style={{
                      backgroundColor: selected ? `${accent}14` : undefined,
                      color: selected ? accent : undefined,
                    }}
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option)
                      onClose()
                    }}
                  >
                    <span className="truncate">{option}</span>
                    {selected ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="m6 12 4 4 8-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export function RangeControl({
  label,
  minLabel = '£0',
  maxLabel,
  value,
  min = 50,
  max = 2500,
  step = 50,
  onChange,
  accent = '#FF5A5F',
}) {
  const resolvedMaxLabel = maxLabel ?? (value >= max ? `${formatCurrency(max)}+` : formatCurrency(value))

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">
          {label}
        </label>
        <span className="text-xs font-bold text-[#111827]">{resolvedMaxLabel}</span>
      </div>
      <div className="flex h-11 items-center gap-3 rounded-xl border border-[#E2DDD5] bg-[#FBFAF8] px-3.5">
        <span className="text-sm font-semibold text-[#6B7280]">{minLabel}</span>
        <input
          className="staylytics-range h-2 min-w-0 flex-1"
          style={{ accentColor: accent }}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </div>
  )
}

export function FilterActions({ onApply, onReset, onClose, accent = '#FF5A5F' }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
      {onApply ? (
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(255,90,95,0.2)] transition hover:-translate-y-0.5"
          style={{ backgroundColor: accent }}
          onClick={() => {
            onClose()
            onApply()
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Apply
        </button>
      ) : null}
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E2DDD5] bg-white px-4 text-sm font-bold text-[#111827] transition hover:-translate-y-0.5 hover:bg-[#F8F7F4]"
        onClick={() => {
          onClose()
          onReset()
        }}
      >
        Reset
      </button>
    </div>
  )
}
