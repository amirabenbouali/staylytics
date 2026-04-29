import { useState } from 'react'
import { FilterActions, FilterDropdown, RangeControl } from '../ui/FilterControls'

function PriceFilterBar({
  borough,
  roomType,
  maxPrice,
  boroughOptions,
  roomTypeOptions,
  onBoroughChange,
  onRoomTypeChange,
  onMaxPriceChange,
  onApply,
  onReset,
  accent = '#FF5A5F',
}) {
  const [openFilter, setOpenFilter] = useState(null)

  const closeMenus = () => setOpenFilter(null)

  return (
    <section className="rounded-2xl border border-[#ECE7DF] bg-white/95 p-4 shadow-[0_16px_48px_rgba(17,24,39,0.08)] backdrop-blur sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(170px,220px)_minmax(170px,220px)_minmax(280px,1fr)_auto] xl:items-end">
        <FilterDropdown
          label="Borough"
          value={borough}
          options={boroughOptions}
          accent={accent}
          open={openFilter === 'borough'}
          onToggle={() => setOpenFilter(openFilter === 'borough' ? null : 'borough')}
          onClose={closeMenus}
          onChange={onBoroughChange}
        />
        <FilterDropdown
          label="Room type"
          value={roomType}
          options={roomTypeOptions}
          accent={accent}
          open={openFilter === 'roomType'}
          onToggle={() => setOpenFilter(openFilter === 'roomType' ? null : 'roomType')}
          onClose={closeMenus}
          onChange={onRoomTypeChange}
        />

        <RangeControl
          label="Price range"
          value={maxPrice}
          onChange={onMaxPriceChange}
          accent={accent}
        />

        <FilterActions onApply={onApply} onReset={onReset} onClose={closeMenus} accent={accent} />
      </div>
    </section>
  )
}

export default PriceFilterBar
