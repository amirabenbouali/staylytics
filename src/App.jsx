import { useMemo, useState } from 'react'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import InsightBox from './components/InsightBox'
import KeyTakeaways from './components/KeyTakeaways'
import LineTrendChart from './components/LineTrendChart'
import PriceByBoroughChart from './components/PriceByBoroughChart'
import PriceDistributionChart from './components/PriceDistributionChart'
import RankingCard from './components/RankingCard'
import RoomTypeChart from './components/RoomTypeChart'
import ScatterChart from './components/ScatterChart'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import { annualTrend, listings } from './data/listings'
import PricesPage from './pages/PricesPage'
import {
  filterListings,
  formatCurrency,
  formatNumber,
  getRoomTypeDistribution,
  getUniqueValues,
  round,
} from './utils/analytics'
import {
  generatePriceInsight,
  getPriceBuckets,
  getPriceKPIs,
  getPriceVsReviews,
  getTopAffordableBoroughs,
  getTopExpensiveBoroughs,
  groupByBorough,
  groupByRoomType,
} from './utils/priceAnalytics'

function App() {
  const [activePage, setActivePage] = useState('overview')
  const [selectedBorough, setSelectedBorough] = useState('All boroughs')
  const [selectedRoomType, setSelectedRoomType] = useState('All room types')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')

  const boroughOptions = useMemo(
    () => ['All boroughs', ...getUniqueValues(listings, 'borough')],
    [],
  )
  const roomTypeOptions = useMemo(
    () => ['All room types', ...getUniqueValues(listings, 'room_type')],
    [],
  )

  const filteredListings = filterListings(listings, {
    borough: selectedBorough,
    roomType: selectedRoomType,
    priceRange: selectedPriceRange,
  })

  const activeListings = filteredListings.length > 0 ? filteredListings : listings
  const fallbackNotice =
    filteredListings.length === 0
      ? 'No listings matched those filters, so the full London market view is shown.'
      : null

  const priceKpis = getPriceKPIs(activeListings)
  const boroughSummary = groupByBorough(activeListings)
  const roomTypePriceSummary = groupByRoomType(activeListings)
  const roomTypeDistribution = getRoomTypeDistribution(activeListings)
  const priceBuckets = getPriceBuckets(activeListings)
  const priceVsReviews = getPriceVsReviews(activeListings)
  const totalListings = priceKpis.totalValidListings
  const averagePrice = priceKpis.averagePrice
  const londonAverage = getPriceKPIs(listings).averagePrice
  const avgPriceDelta = ((averagePrice - londonAverage) / londonAverage) * 100
  const dominantRoomType = roomTypeDistribution[0]
  const mostExpensiveRoomType = roomTypePriceSummary[0]
  const expensiveAreas = getTopExpensiveBoroughs(activeListings)
  const affordableAreas = getTopAffordableBoroughs(activeListings)
  const summary = generatePriceInsight(activeListings)

  const resetFilters = () => {
    setSelectedBorough('All boroughs')
    setSelectedRoomType('All room types')
    setSelectedPriceRange('all')
  }

  return (
    <main className="flex min-h-screen bg-[#FAFAFB] text-[#0F172A]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      {activePage === 'prices' ? (
        <div className="min-w-0 flex-1">
          <PricesPage />
        </div>
      ) : (
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1680px] space-y-3">
          <section className="grid gap-5 xl:grid-cols-[1fr_760px] xl:items-start">
            <Header fallbackNotice={fallbackNotice} />
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
          </section>

          <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4" aria-label="Key metrics">
            <StatCard
              icon="listings"
              label="Total Listings"
              value={formatNumber(totalListings)}
              detail="Active listings in London"
              note="+4.2% vs last month"
            />
            <StatCard
              icon="price"
              label="Average Price"
              value={formatCurrency(averagePrice)}
              detail="Per night"
              note={`${avgPriceDelta >= 0 ? '+' : ''}${round(avgPriceDelta)}% vs last month`}
            />
            <StatCard
              icon="location"
              label="Median Price"
              value={formatCurrency(priceKpis.medianPrice)}
              detail="Less affected by extreme listings"
              note="Skew-resistant"
            />
            <StatCard
              icon="room"
              label="Price Range"
              value={`${formatCurrency(priceKpis.minPrice)}-${formatCurrency(priceKpis.maxPrice)}`}
              detail={`${mostExpensiveRoomType?.roomType ?? 'Room type'} has the highest average`}
              note={`${dominantRoomType?.name ?? 'Room type'} is most common`}
            />
          </section>

          <InsightBox>{summary}</InsightBox>

          <section className="grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
            <PriceByBoroughChart data={boroughSummary} />
            <PriceDistributionChart data={priceBuckets} />
          </section>

          <section className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
            <ScatterChart data={priceVsReviews} />
            <LineTrendChart data={annualTrend} />
          </section>

          <section className="grid gap-3 xl:grid-cols-[0.95fr_1.05fr]">
            <RoomTypeChart data={roomTypeDistribution} total={totalListings} />
            <PriceByBoroughChart
              title="Average Price by Room Type"
              data={roomTypePriceSummary.map((item) => ({
                borough: item.roomType,
                avgPrice: item.averagePrice,
                averagePrice: item.averagePrice,
              }))}
            />
          </section>

          <section className="grid gap-3 xl:grid-cols-[1fr_1fr_0.72fr]">
            <RankingCard
              eyebrow="Premium pockets"
              title="Top 5 Most Expensive Boroughs"
              items={expensiveAreas}
            />
            <RankingCard
              eyebrow="Value pockets"
              title="Top 5 Most Affordable Boroughs"
              items={affordableAreas}
            />
            <KeyTakeaways />
          </section>
        </div>
      </div>
      )}
    </main>
  )
}

export default App
