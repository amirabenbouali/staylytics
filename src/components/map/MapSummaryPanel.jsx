import { formatCurrency, formatNumber } from '../../utils/analytics'

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-[#ECE7DF] bg-[#F8F7F4] p-3.5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">{label}</p>
      <strong className="mt-1.5 block text-base font-bold text-[#111827]">{value}</strong>
    </div>
  )
}

function MapSummaryPanel({ summary, selectedListing, insight }) {
  const title = selectedListing?.name ?? summary.name

  return (
    <aside className="self-start rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] xl:sticky xl:top-8">
      <p className="text-sm font-semibold text-[#F97316]">Selected location</p>
      <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-tight text-[#111827]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
        {selectedListing
          ? `${selectedListing.borough} • ${selectedListing.roomType}`
          : `${formatNumber(summary.listings)} weighted listings in view`}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <SummaryMetric
          label="Average price"
          value={formatCurrency(selectedListing?.price ?? summary.averagePrice)}
        />
        <SummaryMetric
          label="Average reviews"
          value={formatNumber(Math.round(selectedListing?.reviews ?? summary.averageReviews))}
        />
        <SummaryMetric
          label="Average availability"
          value={`${Math.round(selectedListing?.availability ?? summary.averageAvailability)} days`}
        />
        <SummaryMetric
          label="Common room type"
          value={selectedListing?.roomType ?? summary.mostCommonRoomType}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-[#FED7AA] bg-[linear-gradient(120deg,#FFF7ED,#FFFFFF)] p-4">
        <p className="text-sm font-bold text-[#F97316]">AI Location Insight</p>
        <p className="mt-3 text-sm leading-6 text-[#111827]">{insight}</p>
      </div>
    </aside>
  )
}

export default MapSummaryPanel
