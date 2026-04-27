import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { listings } from '../data/listings'
import { chartColors, formatCurrency, formatNumber, getUniqueValues } from '../utils/analytics'
import {
  cleanPrice,
  generatePriceInsight,
  getPriceBuckets,
  getPriceKPIs,
  getPriceVsReviews,
  getTopAffordableBoroughs,
  getTopExpensiveBoroughs,
  groupByBorough,
  groupByRoomType,
} from '../utils/priceAnalytics'

const roomColors = {
  'Entire home/apt': '#FF5A5F',
  'Private room': '#6D8DFF',
  'Shared room': '#2FBF71',
  'Hotel room': '#7C5CFF',
}

function Chevron({ isOpen }) {
  return (
    <svg
      className={`text-[#64748B] transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

function SelectControl({ label, value, options, open, onToggle, onClose, onChange }) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const selected = normalized.find((option) => option.value === value)?.label ?? value

  return (
    <div className="relative">
      <span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#DDE3EC] bg-white px-4 text-left text-sm font-medium text-[#111827] outline-none transition hover:border-[#C9D3E1] focus:border-[#FF5A5F] focus:ring-4 focus:ring-[#FF5A5F]/10"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="truncate">{selected}</span>
        <Chevron isOpen={open} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
          {normalized.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  isSelected ? 'bg-[#FFF0F0] text-[#FF5A5F]' : 'text-[#334155] hover:bg-[#F8FAFC]'
                }`}
                onClick={() => {
                  onChange(option.value)
                  onClose()
                }}
              >
                {option.label}
                {isSelected ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 12 4 4 8-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({ label, value, detail, trend, icon }) {
  return (
    <article className="rounded-xl border border-[#E8EAF0] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFE8E9] text-[#FF5A5F]">
          {icon}
        </span>
        <p className="text-sm font-semibold text-[#111827]">{label}</p>
      </div>
      <strong className="block text-3xl font-bold tracking-tight text-[#0B1220]">{value}</strong>
      <p className="mt-1 text-sm text-[#52637A]">{detail}</p>
      <p className={`mt-5 text-sm ${trend?.startsWith('↑') ? 'text-[#18A058]' : 'text-[#64748B]'}`}>
        {trend}
      </p>
    </article>
  )
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChartShell({ title, subtitle, children }) {
  return (
    <article className="rounded-xl border border-[#E8EAF0] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#111827]">{title}</h2>
          <span className="text-[#8A97AA]"><InfoIcon /></span>
        </div>
        {subtitle ? <p className="mt-1 text-sm text-[#52637A]">{subtitle}</p> : null}
      </div>
      {children}
    </article>
  )
}

function RankingTable({ title, rows }) {
  return (
    <article className="rounded-xl border border-[#E8EAF0] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-bold text-[#111827]">{title}</h2>
      <div className="mt-8 grid grid-cols-[44px_1fr_110px] border-b border-[#E6EAF0] pb-3 text-sm text-[#52637A]">
        <span />
        <span>Borough</span>
        <span className="text-right">Average Price</span>
      </div>
      <ol>
        {rows.map((row, index) => (
          <li
            key={row.borough}
            className="grid grid-cols-[44px_1fr_110px] border-b border-[#EEF1F5] py-4 text-sm text-[#111827]"
          >
            <span>{index + 1}</span>
            <span className="font-medium">{row.borough}</span>
            <span className="text-right font-semibold">{formatCurrency(row.averagePrice)}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="mt-5 flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
      >
        View all boroughs
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

function PricesPage() {
  const [borough, setBorough] = useState('All Boroughs')
  const [roomType, setRoomType] = useState('All Room Types')
  const [maxPrice, setMaxPrice] = useState(2000)
  const [openFilter, setOpenFilter] = useState(null)

  const boroughOptions = useMemo(
    () => ['All Boroughs', ...getUniqueValues(listings, 'borough')],
    [],
  )
  const roomTypeOptions = useMemo(
    () => ['All Room Types', ...getUniqueValues(listings, 'room_type')],
    [],
  )

  const filteredListings = listings.filter((listing) => {
    const price = cleanPrice(listing.price)
    const boroughMatch = borough === 'All Boroughs' || listing.borough === borough
    const roomMatch = roomType === 'All Room Types' || listing.room_type === roomType
    const priceMatch = price !== null && price <= maxPrice

    return boroughMatch && roomMatch && priceMatch
  })

  const activeListings = filteredListings.length ? filteredListings : listings
  const kpis = getPriceKPIs(activeListings)
  const buckets = getPriceBuckets(activeListings)
  const boroughPrices = groupByBorough(activeListings).slice(0, 10)
  const roomTypePrices = groupByRoomType(activeListings)
  const scatterData = getPriceVsReviews(activeListings)
  const expensiveBoroughs = getTopExpensiveBoroughs(activeListings)
  const affordableBoroughs = getTopAffordableBoroughs(activeListings)
  const insight = generatePriceInsight(activeListings)

  const resetFilters = () => {
    setBorough('All Boroughs')
    setRoomType('All Room Types')
    setMaxPrice(2000)
    setOpenFilter(null)
  }

  return (
    <div className="mx-auto max-w-[1320px] space-y-7 px-4 py-8 sm:px-6 lg:px-9">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button type="button" className="mb-5 text-[#111827]" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="text-4xl font-bold tracking-tight text-[#111827]">Prices</h1>
          <p className="mt-3 text-base text-[#52637A]">
            Deep dive into pricing trends across London Airbnb listings.
          </p>
        </div>
        <div className="flex items-center gap-6 self-end text-sm text-[#52637A]">
          <span>Last updated: May 12, 2024</span>
          <button
            type="button"
            className="rounded-lg bg-[#FF5A5F] px-5 py-3 font-bold text-white shadow-lg shadow-[#FF5A5F]/20 transition hover:bg-[#F24E53]"
          >
            Export
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-[#E8EAF0] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.08)]">
        <div className="grid gap-5 lg:grid-cols-[240px_240px_1fr_auto_auto] lg:items-end">
          <SelectControl
            label="Borough"
            value={borough}
            options={boroughOptions}
            open={openFilter === 'borough'}
            onToggle={() => setOpenFilter(openFilter === 'borough' ? null : 'borough')}
            onClose={() => setOpenFilter(null)}
            onChange={setBorough}
          />
          <SelectControl
            label="Room type"
            value={roomType}
            options={roomTypeOptions}
            open={openFilter === 'roomType'}
            onToggle={() => setOpenFilter(openFilter === 'roomType' ? null : 'roomType')}
            onClose={() => setOpenFilter(null)}
            onChange={setRoomType}
          />

          <div>
            <span className="mb-4 block text-sm font-semibold text-[#111827]">Price range</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#52637A]">£0</span>
              <input
                className="h-2 w-full accent-[#FF5A5F]"
                type="range"
                min="100"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
              <span className="min-w-16 text-sm font-medium text-[#52637A]">
                {maxPrice >= 2500 ? '£2,500+' : formatCurrency(maxPrice)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="h-11 rounded-lg bg-[#FF5A5F] px-6 text-sm font-bold text-white shadow-lg shadow-[#FF5A5F]/20 transition hover:bg-[#F24E53]"
            onClick={() => setOpenFilter(null)}
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="h-11 rounded-lg border border-[#DDE3EC] bg-white px-6 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Average Price" value={formatCurrency(kpis.averagePrice)} detail="per night" trend="↑ 8.4% vs all listings" icon={<span>£</span>} />
        <MetricCard label="Median Price" value={formatCurrency(kpis.medianPrice)} detail="per night" trend="↑ 5.6% vs all listings" icon={<span>◌</span>} />
        <MetricCard label="Max Price" value={formatCurrency(kpis.maxPrice)} detail="per night" trend="— vs all listings" icon={<span>⌂</span>} />
        <MetricCard label="Min Price" value={formatCurrency(kpis.minPrice)} detail="per night" trend="— vs all listings" icon={<span>↓</span>} />
        <MetricCard label="Total Listings" value={formatNumber(kpis.totalValidListings)} detail="listings" trend="— vs all listings" icon={<span>⌖</span>} />
      </section>

      <section className="rounded-xl border border-[#E8EAF0] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        <div className="flex gap-6">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/20">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#FF5A5F]">AI Pricing Insight</h2>
            <p className="mt-2 max-w-5xl text-base leading-7 text-[#111827]">{insight}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.95fr]">
        <ChartShell title="Price Distribution" subtitle="Number of listings">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buckets} margin={{ top: 12, right: 12, left: 0, bottom: 18 }}>
                <CartesianGrid vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip formatter={(value) => [formatNumber(value), 'Listings']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#FF5A5F" maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartShell>

        <ChartShell title="Average Price by Borough" subtitle="Average price (GBP)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={boroughPrices} margin={{ top: 4, right: 34, left: 72, bottom: 12 }}>
                <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} />
                <YAxis type="category" dataKey="borough" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} width={86} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Average price']} />
                <Bar dataKey="averagePrice" radius={[0, 6, 6, 0]} fill="#FF5A5F" maxBarSize={15} label={{ position: 'right', formatter: (value) => formatCurrency(value), fontSize: 11, fill: '#111827' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartShell>

        <ChartShell title="Price by Room Type" subtitle="Average price (GBP)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomTypePrices} margin={{ top: 20, right: 12, left: 0, bottom: 18 }}>
                <CartesianGrid vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="roomType" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#111827' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Average price']} />
                <Bar dataKey="averagePrice" radius={[6, 6, 0, 0]} maxBarSize={44} label={{ position: 'top', formatter: (value) => formatCurrency(value), fontSize: 11, fill: '#111827' }}>
                  {roomTypePrices.map((entry) => (
                    <Cell key={entry.roomType} fill={roomColors[entry.roomType] ?? '#FF5A5F'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartShell>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.9fr_0.9fr]">
        <ChartShell title="Price vs Number of Reviews">
          <div className="mb-3 flex flex-wrap gap-4 text-xs text-[#111827]">
            {Object.entries(roomColors).map(([name, color]) => (
              <span key={name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                {name}
              </span>
            ))}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 14, left: 0, bottom: 18 }}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis type="number" dataKey="price" name="Price" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} />
                <YAxis type="number" dataKey="reviews" name="Reviews" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#111827' }} />
                <Tooltip formatter={(value, name) => [name === 'Price' ? formatCurrency(value) : formatNumber(value), name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.borough ?? ''} />
                {Object.entries(roomColors).map(([name, color]) => (
                  <Scatter key={name} data={scatterData.filter((item) => item.room_type === name)} fill={color} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartShell>

        <RankingTable title="Top 5 Most Expensive Boroughs" rows={expensiveBoroughs} />
        <RankingTable title="Top 5 Most Affordable Boroughs" rows={affordableBoroughs} />
      </section>

      <p className="pb-6 text-sm text-[#64748B]">
        Prices are in GBP and represent nightly rates. Data source: Inside Airbnb. Last updated: May 12, 2024.
      </p>
    </div>
  )
}

export default PricesPage
