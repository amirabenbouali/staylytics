import { useMemo, useState } from 'react'
import BoroughRankingCard from '../components/prices/BoroughRankingCard'
import PriceByBoroughChart from '../components/prices/PriceByBoroughChart'
import PriceDistributionChart from '../components/prices/PriceDistributionChart'
import PriceFilterBar from '../components/prices/PriceFilterBar'
import PriceInsightCard from '../components/prices/PriceInsightCard'
import PriceKpiCard from '../components/prices/PriceKpiCard'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { FILTER_DEFAULTS } from '../constants/market'
import { formatCurrency, formatNumber } from '../utils/analytics'
import { filterListings, getFilterOptions } from '../utils/filters'
import {
  generatePriceInsight,
  getPriceBuckets,
  getPriceKPIs,
  getTopAffordableBoroughs,
  getTopExpensiveBoroughs,
  groupByBorough,
} from '../utils/priceAnalytics'

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
      <path d="M7 20h10" />
      <path d="M9 11h6" />
      <path d="M10 20c2-3 2-12 0-14a4 4 0 0 1 7 2" />
    </svg>
  ),
  median: (
    <svg {...iconClass}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
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
  listings: (
    <svg {...iconClass}>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
}

function PricesPage({ listings }) {
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
    const expensiveBoroughs = getTopExpensiveBoroughs(filteredListings)

    return {
      kpis: getPriceKPIs(filteredListings),
      boroughPrices: groupByBorough(filteredListings).slice(0, 10),
      priceBuckets: getPriceBuckets(filteredListings),
      expensiveBoroughs,
      affordableBoroughs: getTopAffordableBoroughs(filteredListings),
      mostExpensiveBorough: expensiveBoroughs[0],
      insight: generatePriceInsight(filteredListings),
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
          title="Prices"
          subtitle="Understand pricing patterns across London Airbnb listings."
          action={(
            <div className="flex items-center gap-5 text-sm text-[#6B7280]">
            <span>Source: Inside Airbnb London</span>
            <button
              type="button"
              className="rounded-xl bg-[#FF5A5F] px-5 py-3 font-bold text-white shadow-[0_14px_30px_rgba(255,90,95,0.24)] transition hover:bg-[#F24E53]"
            >
              Export
            </button>
            </div>
          )}
        />

        <PriceFilterBar
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
          <PriceKpiCard
            icon={icons.average}
            label="Average Price"
            value={formatCurrency(analytics.kpis.averagePrice)}
            detail="Average nightly rate in the current view."
          />
          <PriceKpiCard
            icon={icons.median}
            label="Median Price"
            value={formatCurrency(analytics.kpis.medianPrice)}
            detail="A more stable midpoint for skewed Airbnb prices."
          />
          <PriceKpiCard
            icon={icons.borough}
            label="Most Expensive Borough"
            value={analytics.mostExpensiveBorough?.borough ?? 'No data'}
            detail={
              analytics.mostExpensiveBorough
                ? `${formatCurrency(analytics.mostExpensiveBorough.averagePrice)} average per night.`
                : 'Adjust filters to include more listings.'
            }
          />
          <PriceKpiCard
            icon={icons.listings}
            label="Total Listings"
            value={formatNumber(analytics.kpis.totalValidListings)}
            detail="Valid listings after cleaning and filters."
          />
        </section>

        {filteredListings.length ? (
          <PriceInsightCard insight={analytics.insight} />
        ) : (
          <EmptyState title="No matching price data" />
        )}

        <section className="grid gap-5 lg:gap-6 xl:grid-cols-2">
          {filteredListings.length ? (
            <>
              <PriceByBoroughChart data={analytics.boroughPrices} />
              <PriceDistributionChart data={analytics.priceBuckets} />
            </>
          ) : (
            <div className="xl:col-span-2">
              <EmptyState title="No chart data available" />
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:gap-6 lg:grid-cols-2">
          <BoroughRankingCard title="Top 5 Most Expensive Boroughs" rows={analytics.expensiveBoroughs} />
          <BoroughRankingCard title="Top 5 Most Affordable Boroughs" rows={analytics.affordableBoroughs} />
        </section>

        <p className="pb-4 text-sm text-[#6B7280]">
          Prices are in GBP and represent nightly rates. Data source: Inside Airbnb.
        </p>
      </div>
    </div>
  )
}

export default PricesPage
