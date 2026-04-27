const MAX_REALISTIC_PRICE = 10000
const DEFAULT_MIN_LISTINGS = 10

export const PRICE_BUCKETS = [
  { label: '£0-£50', min: 0, max: 50 },
  { label: '£51-£100', min: 51, max: 100 },
  { label: '£101-£150', min: 101, max: 150 },
  { label: '£151-£200', min: 151, max: 200 },
  { label: '£201-£300', min: 201, max: 300 },
  { label: '£301+', min: 301, max: Infinity },
]

export function cleanPrice(value) {
  if (value === null || value === undefined || value === '') return null

  const numericValue =
    typeof value === 'number'
      ? value
      : Number(String(value).replace(/[£$,\s]/g, ''))

  if (!Number.isFinite(numericValue)) return null
  if (numericValue <= 0 || numericValue > MAX_REALISTIC_PRICE) return null

  return numericValue
}

function getListingWeight(listing) {
  const weight = Number(listing.listings ?? listing.count ?? 1)
  return Number.isFinite(weight) && weight > 0 ? weight : 1
}

function getBorough(listing) {
  return listing.borough || listing.neighbourhood || 'Unknown'
}

function normaliseListing(listing) {
  const price = cleanPrice(listing.price)
  if (price === null) return null

  return {
    ...listing,
    borough: getBorough(listing),
    price,
    originalPrice: price,
    listingCount: getListingWeight(listing),
    reviews: Number(listing.reviews ?? listing.number_of_reviews ?? 0) || 0,
    availability: Number(listing.availability ?? listing.availability_365 ?? 0) || 0,
    room_type: listing.room_type || 'Unknown',
  }
}

function getWeightedPriceEntries(data) {
  return getValidListings(data).map((listing) => ({
    price: listing.price,
    weight: listing.listingCount,
  }))
}

function getTotalWeight(data) {
  return data.reduce((sum, item) => sum + (item.listingCount ?? item.weight ?? 1), 0)
}

export function getValidListings(data) {
  return data.map(normaliseListing).filter(Boolean)
}

export function calculateAverage(values) {
  const entries = values
    .map((value) =>
      typeof value === 'number'
        ? { price: value, weight: 1 }
        : { price: cleanPrice(value.price ?? value), weight: value.weight ?? value.listingCount ?? 1 },
    )
    .filter((entry) => entry.price !== null && entry.weight > 0)

  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (!totalWeight) return 0

  return entries.reduce((sum, entry) => sum + entry.price * entry.weight, 0) / totalWeight
}

export function calculateMedian(values) {
  const entries = values
    .map((value) =>
      typeof value === 'number'
        ? { price: value, weight: 1 }
        : { price: cleanPrice(value.price ?? value), weight: value.weight ?? value.listingCount ?? 1 },
    )
    .filter((entry) => entry.price !== null && entry.weight > 0)
    .sort((left, right) => left.price - right.price)

  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (!totalWeight) return 0

  const midpoint = totalWeight / 2
  let cumulativeWeight = 0

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    cumulativeWeight += entry.weight

    if (cumulativeWeight === midpoint && entries[index + 1]) {
      return (entry.price + entries[index + 1].price) / 2
    }

    if (cumulativeWeight >= midpoint) return entry.price
  }

  return entries.at(-1)?.price ?? 0
}

export function getPriceKPIs(data) {
  const validListings = getValidListings(data)
  const prices = getWeightedPriceEntries(validListings)
  const rawPrices = validListings.map((listing) => listing.originalPrice)

  return {
    averagePrice: calculateAverage(prices),
    medianPrice: calculateMedian(prices),
    minPrice: rawPrices.length ? Math.min(...rawPrices) : 0,
    maxPrice: rawPrices.length ? Math.max(...rawPrices) : 0,
    totalValidListings: getTotalWeight(validListings),
  }
}

export function groupByBorough(data) {
  const groups = new Map()

  getValidListings(data).forEach((listing) => {
    const current = groups.get(listing.borough) ?? {
      borough: listing.borough,
      listings: 0,
      priceEntries: [],
      totalReviews: 0,
      totalAvailability: 0,
    }

    current.listings += listing.listingCount
    current.priceEntries.push({ price: listing.price, weight: listing.listingCount })
    current.totalReviews += listing.reviews * listing.listingCount
    current.totalAvailability += listing.availability * listing.listingCount
    groups.set(listing.borough, current)
  })

  return [...groups.values()]
    .map((group) => ({
      borough: group.borough,
      listings: group.listings,
      averagePrice: calculateAverage(group.priceEntries),
      avgPrice: calculateAverage(group.priceEntries),
      medianPrice: calculateMedian(group.priceEntries),
      reviews: group.totalReviews / group.listings,
      availability: group.totalAvailability / group.listings,
    }))
    .sort((left, right) => right.averagePrice - left.averagePrice)
}

export function groupByRoomType(data) {
  const groups = new Map()

  getValidListings(data).forEach((listing) => {
    const current = groups.get(listing.room_type) ?? {
      roomType: listing.room_type,
      name: listing.room_type,
      listings: 0,
      value: 0,
      priceEntries: [],
    }

    current.listings += listing.listingCount
    current.value += listing.listingCount
    current.priceEntries.push({ price: listing.price, weight: listing.listingCount })
    groups.set(listing.room_type, current)
  })

  return [...groups.values()]
    .map((group) => ({
      roomType: group.roomType,
      name: group.name,
      listings: group.listings,
      value: group.value,
      averagePrice: calculateAverage(group.priceEntries),
      medianPrice: calculateMedian(group.priceEntries),
    }))
    .sort((left, right) => right.averagePrice - left.averagePrice)
}

export function getPriceBuckets(data) {
  const buckets = PRICE_BUCKETS.map((bucket) => ({ ...bucket, count: 0 }))

  getValidListings(data).forEach((listing) => {
    const bucket = buckets.find(
      (item) => listing.price >= item.min && listing.price <= item.max,
    )

    if (bucket) bucket.count += listing.listingCount
  })

  return buckets.map(({ label, count, min, max }) => ({ label, count, min, max }))
}

export function getPriceVsReviews(data) {
  return getValidListings(data).map((listing) => ({
    price: listing.price,
    reviews: listing.reviews,
    number_of_reviews: listing.reviews,
    room_type: listing.room_type,
    category: listing.room_type,
    borough: listing.borough,
    listings: listing.listingCount,
  }))
}

export function getTopExpensiveBoroughs(data, minListings = DEFAULT_MIN_LISTINGS) {
  return groupByBorough(data)
    .filter((borough) => borough.listings >= minListings)
    .slice(0, 5)
}

export function getTopAffordableBoroughs(data, minListings = DEFAULT_MIN_LISTINGS) {
  return groupByBorough(data)
    .filter((borough) => borough.listings >= minListings)
    .sort((left, right) => left.averagePrice - right.averagePrice)
    .slice(0, 5)
}

export function generatePriceInsight(data) {
  const kpis = getPriceKPIs(data)
  const boroughs = groupByBorough(data).filter(
    (borough) => borough.listings >= DEFAULT_MIN_LISTINGS,
  )
  const roomTypes = groupByRoomType(data)
  const buckets = getPriceBuckets(data)
  const mostExpensiveBorough = boroughs[0]
  const mostAffordableBorough = [...boroughs].sort(
    (left, right) => left.averagePrice - right.averagePrice,
  )[0]
  const mostExpensiveRoomType = roomTypes[0]
  const largestBucket = [...buckets].sort((left, right) => right.count - left.count)[0]
  const averageIsSkewed =
    kpis.medianPrice > 0 && kpis.averagePrice > kpis.medianPrice * 1.2

  if (!kpis.totalValidListings) {
    return 'No valid price data is available for the current filters.'
  }

  const skewMessage = averageIsSkewed
    ? 'the average price is higher than the median, suggesting that a small number of expensive listings are lifting the overall average'
    : 'the average and median prices are relatively close, suggesting a balanced price mix'

  return `Most listings are concentrated in the ${largestBucket?.label ?? 'mid-market'} range, while ${skewMessage}. ${
    mostExpensiveRoomType?.roomType ?? 'Entire homes'
  } are the most expensive room type, ${
    mostExpensiveBorough?.borough ?? 'the leading borough'
  } has the highest average nightly price, and ${
    mostAffordableBorough?.borough ?? 'outer London'
  } is the most affordable borough in the current view.`
}
