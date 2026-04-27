export const priceRangeOptions = [
  { label: 'All prices', value: 'all' },
  { label: 'Under £100', value: 'budget' },
  { label: '£100-£180', value: 'mid' },
  { label: '£180+', value: 'premium' },
]

export const chartColors = {
  accent: '#FF5A5F',
  softAccent: '#FFE8E9',
  grid: '#EAE7E1',
  text: '#5F6368',
  rooms: {
    'Entire home/apt': '#FF5A5F',
    'Private room': '#FF9A8B',
    'Hotel room': '#F6C5B6',
    'Shared room': '#C8D8D2',
  },
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value || 0)

export const round = (value) => Math.round(value || 0)

export const getUniqueValues = (records, key) => [
  ...new Set(records.map((record) => record[key])),
]

export const inPriceRange = (price, range) => {
  if (range === 'budget') return price < 100
  if (range === 'mid') return price >= 100 && price <= 180
  if (range === 'premium') return price > 180
  return true
}

export const filterListings = (records, filters) =>
  records.filter((listing) => {
    const boroughMatch =
      filters.borough === 'All boroughs' || listing.borough === filters.borough
    const roomTypeMatch =
      filters.roomType === 'All room types' || listing.room_type === filters.roomType
    const priceMatch = inPriceRange(listing.price, filters.priceRange)

    return boroughMatch && roomTypeMatch && priceMatch
  })

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
      accumulator[listing.room_type] =
        (accumulator[listing.room_type] ?? 0) + getListingWeight(listing)
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
