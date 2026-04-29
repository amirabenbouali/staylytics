import { useState } from 'react'
import { FilterActions, FilterDropdown } from '../ui/FilterControls'

function AvailabilityFilterBar({
  borough,
  roomType,
  boroughOptions,
  roomTypeOptions,
  onBoroughChange,
  onRoomTypeChange,
  onApply,
  onReset,
}) {
  const [openFilter, setOpenFilter] = useState(null)
  const closeMenus = () => setOpenFilter(null)

  return (
    <section className="rounded-2xl border border-[#ECE7DF] bg-white/95 p-4 shadow-[0_16px_48px_rgba(17,24,39,0.08)] backdrop-blur sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(170px,240px)_minmax(170px,240px)_auto] xl:items-end">
        <FilterDropdown
          label="Borough"
          value={borough}
          options={boroughOptions}
          accent="#2FBF71"
          open={openFilter === 'borough'}
          onToggle={() => setOpenFilter(openFilter === 'borough' ? null : 'borough')}
          onClose={closeMenus}
          onChange={onBoroughChange}
        />
        <FilterDropdown
          label="Room type"
          value={roomType}
          options={roomTypeOptions}
          accent="#2FBF71"
          open={openFilter === 'roomType'}
          onToggle={() => setOpenFilter(openFilter === 'roomType' ? null : 'roomType')}
          onClose={closeMenus}
          onChange={onRoomTypeChange}
        />

        <FilterActions onApply={onApply} onReset={onReset} onClose={closeMenus} accent="#2FBF71" />
      </div>
    </section>
  )
}

export default AvailabilityFilterBar
