import { useMemo, useState } from 'react'
import AvailabilityByBoroughChart from '../components/availability/AvailabilityByBoroughChart'
import AvailabilityDistributionChart from '../components/availability/AvailabilityDistributionChart'
import AvailabilityFilterBar from '../components/availability/AvailabilityFilterBar'
import AvailabilityInsightCard from '../components/availability/AvailabilityInsightCard'
import AvailabilityKpiCard from '../components/availability/AvailabilityKpiCard'
import AvailabilityRankingCard from '../components/availability/AvailabilityRankingCard'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { FILTER_DEFAULTS } from '../constants/market'
import { filterListings, getFilterOptions } from '../utils/filters'
import {
  generateAvailabilityInsight,
  getAvailabilityBuckets,
  getAvailabilityKPIs,
  getLeastAvailableBoroughs,
  getTopAvailableBoroughs,
  groupAvailabilityByBorough,
} from '../utils/availabilityAnalytics'

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
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  median: (
    <svg {...iconClass}>
      <path d="M5 12h14" />
      <path d="M8 7h8" />
      <path d="M8 17h8" />
    </svg>
  ),
  high: (
    <svg {...iconClass}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  ),
  low: (
    <svg {...iconClass}>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  ),
}

function AvailabilityPage({ listings }) {
  const defaultFilters = {
    borough: FILTER_DEFAULTS.borough,
    roomType: FILTER_DEFAULTS.roomType,
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
    const mostAvailableBoroughs = getTopAvailableBoroughs(filteredListings)
    const leastAvailableBoroughs = getLeastAvailableBoroughs(filteredListings)

    return {
      kpis: getAvailabilityKPIs(filteredListings),
      boroughAvailability: groupAvailabilityByBorough(filteredListings).slice(0, 10),
      availabilityBuckets: getAvailabilityBuckets(filteredListings),
      mostAvailableBoroughs,
      leastAvailableBoroughs,
      mostAvailable: mostAvailableBoroughs[0],
      leastAvailable: leastAvailableBoroughs[0],
      insight: generateAvailabilityInsight(filteredListings),
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
          title="Availability"
          subtitle="Understand supply patterns and listing availability across London."
          accent="#2FBF71"
          action={(
            <div className="flex items-center gap-5 text-sm text-[#6B7280]">
            <span>Source: Inside Airbnb London</span>
            <button
              type="button"
              className="rounded-xl bg-[#2FBF71] px-5 py-3 font-bold text-white shadow-[0_14px_30px_rgba(47,191,113,0.22)] transition hover:bg-[#15965C]"
            >
              Export
            </button>
            </div>
          )}
        />

        <AvailabilityFilterBar
          borough={draftFilters.borough}
          roomType={draftFilters.roomType}
          boroughOptions={boroughOptions}
          roomTypeOptions={roomTypeOptions}
          onBoroughChange={(value) => setDraftFilters((current) => ({ ...current, borough: value }))}
          onRoomTypeChange={(value) => setDraftFilters((current) => ({ ...current, roomType: value }))}
          onApply={() => setAppliedFilters(draftFilters)}
          onReset={resetFilters}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AvailabilityKpiCard
            icon={icons.average}
            label="Average Availability"
            value={`${Math.round(analytics.kpis.averageAvailability)} days`}
            detail="Average days available per listing each year."
          />
          <AvailabilityKpiCard
            icon={icons.median}
            label="Median Availability"
            value={`${Math.round(analytics.kpis.medianAvailability)} days`}
            detail="Midpoint availability for the filtered listings."
          />
          <AvailabilityKpiCard
            icon={icons.high}
            label="Most Available Borough"
            value={analytics.mostAvailable?.borough ?? 'No data'}
            detail={
              analytics.mostAvailable
                ? `${Math.round(analytics.mostAvailable.averageAvailability)} average days available.`
                : 'Adjust filters to include more listings.'
            }
          />
          <AvailabilityKpiCard
            icon={icons.low}
            label="Least Available Borough"
            value={analytics.leastAvailable?.borough ?? 'No data'}
            detail={
              analytics.leastAvailable
                ? `${Math.round(analytics.leastAvailable.averageAvailability)} average days available.`
                : 'Adjust filters to include more listings.'
            }
          />
        </section>

        {filteredListings.length ? (
          <AvailabilityInsightCard insight={analytics.insight} />
        ) : (
          <EmptyState title="No matching availability data" />
        )}

        <section className="grid gap-5 lg:gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          {filteredListings.length ? (
            <>
              <AvailabilityByBoroughChart data={analytics.boroughAvailability} />
              <AvailabilityDistributionChart data={analytics.availabilityBuckets} />
            </>
          ) : (
            <div className="xl:col-span-2">
              <EmptyState title="No chart data available" />
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:gap-6 lg:grid-cols-2">
          <AvailabilityRankingCard
            title="Top 5 Most Available Boroughs"
            rows={analytics.mostAvailableBoroughs}
          />
          <AvailabilityRankingCard
            title="Top 5 Least Available Boroughs"
            rows={analytics.leastAvailableBoroughs}
          />
        </section>

        <p className="pb-4 text-sm text-[#6B7280]">
          Availability is measured as days available in a year. Data source: Inside Airbnb.
        </p>
      </div>
    </div>
  )
}

export default AvailabilityPage
