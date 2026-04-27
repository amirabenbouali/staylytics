import { useState } from 'react'
import { priceRangeOptions } from '../utils/analytics'

function Chevron({ isOpen }) {
  return (
    <svg
      className={`text-[#64748B] transition-transform ${isOpen ? 'rotate-180' : ''}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CustomSelect({ label, value, options, onChange, open, onToggle, onClose }) {
  const normalisedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const selectedLabel =
    normalisedOptions.find((option) => option.value === value)?.label ?? value

  return (
    <div className="relative">
      <span className="mb-2 block text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-[#64748B]">
        {label}
      </span>
      <button
        type="button"
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left text-sm font-semibold text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.05)] outline-none transition ${
          open
            ? 'border-[#FF5A5F] ring-4 ring-[#FF5A5F]/10'
            : 'border-[#DDE3EC] hover:border-[#C9D3E1]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="truncate">{selectedLabel}</span>
        <Chevron isOpen={open} />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
          <ul className="max-h-64 overflow-auto" role="listbox">
            {normalisedOptions.map((option) => {
              const isSelected = option.value === value

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      isSelected
                        ? 'bg-[#FFF0F0] text-[#FF5A5F]'
                        : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value)
                      onClose()
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="m6 12 4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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

function FilterBar({
  boroughOptions,
  roomTypeOptions,
  selectedBorough,
  selectedRoomType,
  selectedPriceRange,
  onBoroughChange,
  onRoomTypeChange,
  onPriceRangeChange,
  onReset,
}) {
  const [openFilter, setOpenFilter] = useState(null)

  const toggleFilter = (filterName) => {
    setOpenFilter((current) => (current === filterName ? null : filterName))
  }

  return (
    <section className="rounded-2xl border border-[#E6EAF0] bg-white/90 p-3 shadow-sm backdrop-blur">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_160px] xl:items-end">
        <CustomSelect
          label="Borough"
          value={selectedBorough}
          options={boroughOptions}
          open={openFilter === 'borough'}
          onToggle={() => toggleFilter('borough')}
          onClose={() => setOpenFilter(null)}
          onChange={onBoroughChange}
        />

        <CustomSelect
          label="Room type"
          value={selectedRoomType}
          options={roomTypeOptions}
          open={openFilter === 'roomType'}
          onToggle={() => toggleFilter('roomType')}
          onClose={() => setOpenFilter(null)}
          onChange={onRoomTypeChange}
        />

        <CustomSelect
          label="Price range"
          value={selectedPriceRange}
          options={priceRangeOptions}
          open={openFilter === 'priceRange'}
          onToggle={() => toggleFilter('priceRange')}
          onClose={() => setOpenFilter(null)}
          onChange={onPriceRangeChange}
        />

        <button
          type="button"
          className="h-11 self-end rounded-xl border border-[#FFD4D6] bg-[#FFF4F3] px-4 text-sm font-bold text-[#FF5A5F] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-[#FFE8E8] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#FF5A5F]/10"
          onClick={() => {
            setOpenFilter(null)
            onReset()
          }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            Reset
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 4v6h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 12a8 8 0 0 1-14.6 4.5M4.8 10A8 8 0 0 1 19 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </section>
  )
}

export default FilterBar
