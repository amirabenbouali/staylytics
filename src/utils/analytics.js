import { CHART_COLORS, PRICE_RANGE_OPTIONS } from '../constants/market'
import { filterListings, inPriceRange } from './filters'

export const priceRangeOptions = PRICE_RANGE_OPTIONS
export const chartColors = CHART_COLORS
export { filterListings, inPriceRange }

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value || 0)

export const round = (value) => Math.round(value || 0)

export const getUniqueValues = (records, key) => [
  ...new Set(records.map((record) => record[key]).filter(Boolean)),
]

export const getAverage = (records, key) => {
  const totalListings = getTotalListings(records)
  if (!totalListings) return 0

  return (
    records.reduce((sum, item) => sum + item[key] * getListingWeight(item), 0) /
    totalListings
  )
}

export const getListingWeight = (listing) => listing.listings ?? 1

export const getTotalListings = (records) =>
  records.reduce((sum, listing) => sum + getListingWeight(listing), 0)

export const aggregateByBorough = (records) => {
  const groups = new Map()

  records.forEach((listing) => {
    const current = groups.get(listing.borough) ?? {
      borough: listing.borough,
      listings: 0,
      totalPrice: 0,
      totalReviews: 0,
      totalAvailability: 0,
    }

    const weight = getListingWeight(listing)

    current.listings += weight
    current.totalPrice += listing.price * weight
    current.totalReviews += listing.reviews * weight
    current.totalAvailability += listing.availability * weight
    groups.set(listing.borough, current)
  })

  return [...groups.values()]
    .map((item) => ({
      borough: item.borough,
      listings: item.listings,
      avgPrice: item.totalPrice / item.listings,
      reviews: item.totalReviews / item.listings,
      availability: item.totalAvailability / item.listings,
    }))
    .sort((left, right) => right.avgPrice - left.avgPrice)
}

export const getRoomTypeDistribution = (records) =>
  Object.entries(
    records.reduce((accumulator, listing) => {
      const roomType = listing.roomType ?? listing.room_type
      accumulator[roomType] =
        (accumulator[roomType] ?? 0) + getListingWeight(listing)
      return accumulator
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value)

export const getListingsTrend = (records) => {
  const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'short' })
  const buckets = new Map()

  records.forEach((listing) => {
    const date = new Date(listing.date_added)
    const monthIndex = date.getMonth()
    const month = monthFormatter.format(date)
    const current = buckets.get(monthIndex) ?? {
      month,
      listings: 0,
      reviews: 0,
    }

    current.listings += getListingWeight(listing)
    current.reviews += listing.reviews
    buckets.set(monthIndex, current)
  })

  return [...buckets.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, value]) => value)
}

export const buildMarketSummary = ({ boroughSummary, roomTypeDistribution }) => {
  const topBorough = boroughSummary[0]
  const affordableLeader = [...boroughSummary].reverse()[0]
  const strongestDemand = [...boroughSummary].sort((left, right) => right.reviews - left.reviews)[0]
  const dominantRoomType = roomTypeDistribution[0]?.name ?? 'Private room'

  return `${topBorough?.borough ?? 'Central London'} leads the current view at ${formatCurrency(
    topBorough?.avgPrice,
  )} per night, while ${dominantRoomType.toLowerCase()} listings make up the largest share of supply. ${
    strongestDemand?.borough ?? 'High-review boroughs'
  } shows the strongest review activity, and ${
    affordableLeader?.borough ?? 'outer London'
  } remains the clearest value pocket for lower nightly rates.`
}
