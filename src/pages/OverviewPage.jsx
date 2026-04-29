import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/ui/EmptyState'
import { FILTER_DEFAULTS } from '../constants/market'
import {
  formatCurrency,
  formatNumber,
  getRoomTypeDistribution,
} from '../utils/analytics'
import { filterListings, getFilterOptions } from '../utils/filters'
import {
  getAvailabilityKPIs,
  getLeastAvailableBoroughs,
} from '../utils/availabilityAnalytics'
import {
  getDemandKPIs,
  getTopDemandBoroughs,
} from '../utils/demandAnalytics'
import {
  generatePriceInsight,
  getPriceKPIs,
  groupByBorough,
} from '../utils/priceAnalytics'

const chartGrid = '#EAE7E1'

function OverviewKpi({ label, value, detail, accent = '#FF5A5F' }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <span className="block h-1.5 w-10 rounded-full" style={{ backgroundColor: accent }} />
      <p className="mt-5 text-sm font-semibold text-[#6B7280]">{label}</p>
      <strong className="mt-3 block text-3xl font-bold tracking-tight text-[#111827]">
        {value}
      </strong>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{detail}</p>
    </article>
  )
}

function OverviewChartCard({ title, subtitle, children }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
        <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
      </div>
      {children}
    </article>
  )
}

function ExploreCard({ title, detail, accent, onClick }) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-[#ECE7DF] bg-white p-5 text-left shadow-[0_14px_40px_rgba(17,24,39,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(17,24,39,0.1)] sm:p-6"
      onClick={onClick}
    >
      <span className="block h-2 w-12 rounded-full" style={{ backgroundColor: accent }} />
      <h3 className="mt-5 text-lg font-bold text-[#111827]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{detail}</p>
      <span className="mt-5 inline-flex text-sm font-bold" style={{ color: accent }}>
        Open page →
      </span>
    </button>
  )
}

function OverviewPage({ listings, onNavigate }) {
  const [selectedBorough, setSelectedBorough] = useState(FILTER_DEFAULTS.overviewBorough)
  const [selectedRoomType, setSelectedRoomType] = useState(FILTER_DEFAULTS.overviewRoomType)
  const [selectedPriceRange, setSelectedPriceRange] = useState(FILTER_DEFAULTS.priceRange)

  const boroughOptions = useMemo(
    () => getFilterOptions(listings, 'borough', FILTER_DEFAULTS.overviewBorough),
    [listings],
  )
  const roomTypeOptions = useMemo(
    () => getFilterOptions(listings, 'roomType', FILTER_DEFAULTS.overviewRoomType),
    [listings],
  )

  const filteredListings = useMemo(
    () =>
      filterListings(listings, {
        borough: selectedBorough,
        roomType: selectedRoomType,
        priceRange: selectedPriceRange,
      }),
    [listings, selectedBorough, selectedRoomType, selectedPriceRange],
  )

  const analytics = useMemo(() => ({
    priceKpis: getPriceKPIs(filteredListings),
    availabilityKpis: getAvailabilityKPIs(filteredListings),
    demandKpis: getDemandKPIs(filteredListings),
    boroughPrices: groupByBorough(filteredListings).slice(0, 8),
    roomMix: getRoomTypeDistribution(filteredListings).slice(0, 4),
    highDemand: getTopDemandBoroughs(filteredListings)[0],
    tightSupply: getLeastAvailableBoroughs(filteredListings)[0],
    summary: generatePriceInsight(filteredListings),
  }), [filteredListings])

  const resetFilters = () => {
    setSelectedBorough(FILTER_DEFAULTS.overviewBorough)
    setSelectedRoomType(FILTER_DEFAULTS.overviewRoomType)
    setSelectedPriceRange(FILTER_DEFAULTS.priceRange)
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-7 sm:px-6 sm:py-8 lg:space-y-8 lg:px-10 lg:py-10">
        <header className="rounded-3xl border border-[#ECE7DF] bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.07)] sm:p-8 lg:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF5A5F]">
            Staylytics market overview
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
                London Airbnb Market Dashboard
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#6B7280]">
                Explore the market at a glance, then drill into pricing, supply, demand,
                and location patterns across London.
              </p>
            </div>
            <div className="rounded-2xl bg-[#F8F7F4] p-5">
              <p className="text-sm font-semibold text-[#6B7280]">Current focus</p>
              <p className="mt-2 text-2xl font-bold text-[#111827]">
                {formatNumber(analytics.priceKpis.totalValidListings)}
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">valid weighted listings</p>
            </div>
          </div>
          {!filteredListings.length ? (
            <p className="mt-6 rounded-xl bg-[#FFF0F0] px-4 py-3 text-sm font-medium text-[#A83F43]">
              No listings matched those filters. Reset filters to return to the full London market.
            </p>
          ) : null}
        </header>

        <FilterBar
          boroughOptions={boroughOptions}
          roomTypeOptions={roomTypeOptions}
          selectedBorough={selectedBorough}
          selectedRoomType={selectedRoomType}
          selectedPriceRange={selectedPriceRange}
          onBoroughChange={setSelectedBorough}
          onRoomTypeChange={setSelectedRoomType}
          onPriceRangeChange={setSelectedPriceRange}
          onReset={resetFilters}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewKpi
            label="Average Price"
            value={formatCurrency(analytics.priceKpis.averagePrice)}
            detail="Average nightly rate in the selected market."
            accent="#FF5A5F"
          />
          <OverviewKpi
            label="Average Availability"
            value={`${Math.round(analytics.availabilityKpis.averageAvailability)} days`}
            detail="Supply signal based on days available per year."
            accent="#2FBF71"
          />
          <OverviewKpi
            label="Average Reviews"
            value={formatNumber(analytics.demandKpis.averageReviews)}
            detail={`${analytics.highDemand?.borough ?? 'Top borough'} leads review activity.`}
            accent="#4F46E5"
          />
          <OverviewKpi
            label="Tightest Supply"
            value={analytics.tightSupply?.borough ?? 'No data'}
            detail={
              analytics.tightSupply
                ? `${Math.round(analytics.tightSupply.averageAvailability)} avg. available days.`
                : 'Adjust filters to include more listings.'
            }
            accent="#F97316"
          />
        </section>

        <section className="rounded-3xl border border-[#F7DDD8] bg-[linear-gradient(120deg,#FFF3F0,#FFFFFF)] p-6 shadow-[0_22px_60px_rgba(255,90,95,0.12)] sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#FF5A5F] text-white shadow-[0_14px_32px_rgba(255,90,95,0.28)]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">Market Snapshot</h2>
              <p className="mt-3 max-w-5xl text-base leading-7 text-[#374151]">{analytics.summary}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <OverviewChartCard
            title="Where Prices Concentrate"
            subtitle="Top boroughs by average nightly price"
          >
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={analytics.boroughPrices} margin={{ top: 8, right: 40, left: 96, bottom: 12 }}>
                  <CartesianGrid horizontal={false} stroke={chartGrid} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `£${value}`} />
                  <YAxis type="category" dataKey="borough" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#111827' }} width={112} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Average price']} />
                  <Bar dataKey="averagePrice" fill="#FF5A5F" radius={[0, 8, 8, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </OverviewChartCard>

          <OverviewChartCard
            title="Room Type Mix"
            subtitle="Share of weighted listings in the current view"
          >
            <div className="space-y-5">
              {analytics.roomMix.length ? analytics.roomMix.map((item) => {
                const share = analytics.priceKpis.totalValidListings
                  ? (item.value / analytics.priceKpis.totalValidListings) * 100
                  : 0

                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-[#111827]">{item.name}</span>
                      <span className="text-[#6B7280]">{share.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#F1EEE8]">
                      <span
                        className="block h-full rounded-full bg-[#FF5A5F]"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                )
              }) : (
                <EmptyState title="No room type mix available" />
              )}
            </div>
          </OverviewChartCard>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#111827]">Explore deeper</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Use the specialist pages for focused analysis.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ExploreCard
              title="Prices"
              detail="Understand price bands, borough premiums, and affordability pockets."
              accent="#FF5A5F"
              onClick={() => onNavigate('prices')}
            />
            <ExploreCard
              title="Availability"
              detail="Review supply pressure and boroughs with looser or tighter availability."
              accent="#2FBF71"
              onClick={() => onNavigate('availability')}
            />
            <ExploreCard
              title="Demand"
              detail="Use review activity to compare guest demand across boroughs and room types."
              accent="#4F46E5"
              onClick={() => onNavigate('demand')}
            />
            <ExploreCard
              title="Map"
              detail="Explore location patterns interactively across price, demand, and supply."
              accent="#F97316"
              onClick={() => onNavigate('map')}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default OverviewPage
