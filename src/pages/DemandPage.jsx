import { useMemo, useState } from 'react'
import DemandByBoroughChart from '../components/demand/DemandByBoroughChart'
import DemandFilterBar from '../components/demand/DemandFilterBar'
import DemandInsightCard from '../components/demand/DemandInsightCard'
import DemandKpiCard from '../components/demand/DemandKpiCard'
import DemandRankingCard from '../components/demand/DemandRankingCard'
import PriceReviewsScatterChart from '../components/demand/PriceReviewsScatterChart'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { FILTER_DEFAULTS } from '../constants/market'
import { formatNumber } from '../utils/analytics'
import { filterListings, getFilterOptions } from '../utils/filters'
import {
  generateDemandInsight,
  getDemandKPIs,
  getLeastDemandBoroughs,
  getPriceVsReviews,
  getTopDemandBoroughs,
  groupDemandByBorough,
  groupDemandByRoomType,
} from '../utils/demandAnalytics'

const iconClass = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const icons = {
  average: (
    <svg {...iconClass}>
      <path d="M4 12s3-6 8-6 8 6 8 6" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  median: (
    <svg {...iconClass}>
      <path d="M5 12h14" />
      <path d="M8 7h8" />
      <path d="M8 17h8" />
    </svg>
  ),
  borough: (
    <svg {...iconClass}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M5 6H3v2a4 4 0 0 0 4 4" />
      <path d="M19 6h2v2a4 4 0 0 1-4 4" />
    </svg>
  ),
  room: (
    <svg {...iconClass}>
      <path d="M4 18V9a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v2h4a3 3 0 0 1 3 3v4" />
      <path d="M4 14h16" />
    </svg>
  ),
}

function DemandPage({ listings }) {
  const defaultFilters = {
    borough: FILTER_DEFAULTS.borough,
    roomType: FILTER_DEFAULTS.roomType,
    maxPrice: FILTER_DEFAULTS.maxPrice,
  }
  const [draftFilters, setDraftFilters] = useState(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)

  const boroughOptions = useMemo(
    () => getFilterOptions(listings, 'borough', FILTER_DEFAULTS.borough),
    [listings],
  )
  const roomTypeOptions = useMemo(
    () => getFilterOptions(listings, 'roomType', FILTER_DEFAULTS.roomType),
    [listings],
  )

  const filteredListings = useMemo(
    () => filterListings(listings, appliedFilters),
    [appliedFilters, listings],
  )

  const analytics = useMemo(() => {
    const topDemandBoroughs = getTopDemandBoroughs(filteredListings)

    return {
      kpis: getDemandKPIs(filteredListings),
      boroughDemand: groupDemandByBorough(filteredListings).slice(0, 10),
      scatterData: getPriceVsReviews(filteredListings),
      topDemandBoroughs,
      leastDemandBoroughs: getLeastDemandBoroughs(filteredListings),
      highestDemandBorough: topDemandBoroughs[0],
      mostReviewedRoomType: groupDemandByRoomType(filteredListings)[0],
      insight: generateDemandInsight(filteredListings),
    }
  }, [filteredListings])

  const resetFilters = () => {
    setDraftFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-7 sm:px-6 sm:py-8 lg:space-y-8 lg:px-10 lg:py-10">
        <PageHeader
          title="Demand"
          subtitle="Understand guest demand signals through reviews and pricing patterns."
          accent="#4F46E5"
          action={(
            <div className="flex items-center gap-5 text-sm text-[#6B7280]">
            <span>Source: Inside Airbnb London</span>
            <button
              type="button"
              className="rounded-xl bg-[#4F46E5] px-5 py-3 font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.22)] transition hover:bg-[#4338CA]"
            >
              Export
            </button>
            </div>
          )}
        />

        <DemandFilterBar
          borough={draftFilters.borough}
          roomType={draftFilters.roomType}
          maxPrice={draftFilters.maxPrice}
          boroughOptions={boroughOptions}
          roomTypeOptions={roomTypeOptions}
          onBoroughChange={(value) => setDraftFilters((current) => ({ ...current, borough: value }))}
          onRoomTypeChange={(value) => setDraftFilters((current) => ({ ...current, roomType: value }))}
          onMaxPriceChange={(value) => setDraftFilters((current) => ({ ...current, maxPrice: value }))}
          onApply={() => setAppliedFilters(draftFilters)}
          onReset={resetFilters}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DemandKpiCard
            icon={icons.average}
            label="Average Reviews"
            value={formatNumber(Math.round(analytics.kpis.averageReviews))}
            detail="Average reviews per listing in the current view."
          />
          <DemandKpiCard
            icon={icons.median}
            label="Median Reviews"
            value={formatNumber(Math.round(analytics.kpis.medianReviews))}
            detail="Midpoint review count for filtered listings."
          />
          <DemandKpiCard
            icon={icons.borough}
            label="Highest Demand Borough"
            value={analytics.highestDemandBorough?.borough ?? 'No data'}
            detail={
              analytics.highestDemandBorough
                ? `${Math.round(analytics.highestDemandBorough.averageReviews)} average reviews.`
                : 'Adjust filters to include more listings.'
            }
          />
          <DemandKpiCard
            icon={icons.room}
            label="Most Reviewed Room Type"
            value={analytics.mostReviewedRoomType?.roomType ?? 'No data'}
            detail={
              analytics.mostReviewedRoomType
                ? `${formatNumber(analytics.mostReviewedRoomType.listings)} listings in this segment.`
                : 'Adjust filters to include more listings.'
            }
          />
        </section>

        {filteredListings.length ? (
          <DemandInsightCard insight={analytics.insight} />
        ) : (
          <EmptyState title="No matching demand data" />
        )}

        <section className="grid gap-5 lg:gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          {filteredListings.length ? (
            <>
              <PriceReviewsScatterChart data={analytics.scatterData} />
              <DemandByBoroughChart data={analytics.boroughDemand} />
            </>
          ) : (
            <div className="xl:col-span-2">
              <EmptyState title="No chart data available" />
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:gap-6 lg:grid-cols-2">
          <DemandRankingCard title="Top 5 Most In-Demand Boroughs" rows={analytics.topDemandBoroughs} />
          <DemandRankingCard title="Top 5 Least In-Demand Boroughs" rows={analytics.leastDemandBoroughs} />
        </section>

        <p className="pb-4 text-sm text-[#6B7280]">
          Demand is estimated using review activity as a proxy. Data source: Inside Airbnb.
        </p>
      </div>
    </div>
  )
}

export default DemandPage
