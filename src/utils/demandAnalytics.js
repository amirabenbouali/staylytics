import { cleanPrice } from './priceAnalytics'
import { THRESHOLDS } from '../constants/market'

const DEFAULT_MIN_LISTINGS = THRESHOLDS.minBoroughListings

function getListingWeight(listing) {
  const weight = Number(listing.listings ?? listing.count ?? 1)
  return Number.isFinite(weight) && weight > 0 ? weight : 1
}

function getBorough(listing) {
  return listing.borough || listing.neighbourhood || 'Unknown'
}

function getReviews(listing) {
  const reviews = Number(listing.reviews ?? listing.number_of_reviews ?? 0)
  return Number.isFinite(reviews) && reviews >= 0 ? reviews : 0
}

export function getValidDemandListings(data) {
  return data
    .map((listing) => {
      const price = cleanPrice(listing.price)
      if (price === null) return null

      return {
        ...listing,
        price,
        borough: getBorough(listing),
        roomType: listing.roomType ?? listing.room_type ?? 'Unknown',
        reviews: getReviews(listing),
        listingCount: getListingWeight(listing),
      }
    })
    .filter(Boolean)
}

function weightedAverage(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (!totalWeight) return 0

  return entries.reduce((sum, entry) => sum + entry.value * entry.weight, 0) / totalWeight
}

function weightedMedian(entries) {
  const sortedEntries = [...entries]
    .filter((entry) => Number.isFinite(entry.value) && entry.weight > 0)
    .sort((left, right) => left.value - right.value)
  const totalWeight = sortedEntries.reduce((sum, entry) => sum + entry.weight, 0)
  if (!totalWeight) return 0

  const midpoint = totalWeight / 2
  let cumulativeWeight = 0

  for (let index = 0; index < sortedEntries.length; index += 1) {
    const entry = sortedEntries[index]
    cumulativeWeight += entry.weight

    if (cumulativeWeight === midpoint && sortedEntries[index + 1]) {
      return (entry.value + sortedEntries[index + 1].value) / 2
    }

    if (cumulativeWeight >= midpoint) return entry.value
  }

  return sortedEntries.at(-1)?.value ?? 0
}

export function getDemandKPIs(data) {
  const validListings = getValidDemandListings(data)
  const entries = validListings.map((listing) => ({
    value: listing.reviews,
    weight: listing.listingCount,
  }))

  return {
    averageReviews: weightedAverage(entries),
    medianReviews: weightedMedian(entries),
    totalValidListings: validListings.reduce((sum, listing) => sum + listing.listingCount, 0),
  }
}

export function groupDemandByBorough(data) {
  const groups = new Map()

  getValidDemandListings(data).forEach((listing) => {
    const current = groups.get(listing.borough) ?? {
      borough: listing.borough,
      listings: 0,
      reviewEntries: [],
    }

    current.listings += listing.listingCount
    current.reviewEntries.push({ value: listing.reviews, weight: listing.listingCount })
    groups.set(listing.borough, current)
  })

  return [...groups.values()]
    .map((group) => ({
      borough: group.borough,
      listings: group.listings,
      averageReviews: weightedAverage(group.reviewEntries),
      medianReviews: weightedMedian(group.reviewEntries),
    }))
    .sort((left, right) => right.averageReviews - left.averageReviews)
}

export function groupDemandByRoomType(data) {
  const groups = new Map()

  getValidDemandListings(data).forEach((listing) => {
    const current = groups.get(listing.roomType) ?? {
      roomType: listing.roomType,
      listings: 0,
      reviewEntries: [],
    }

    current.listings += listing.listingCount
    current.reviewEntries.push({ value: listing.reviews, weight: listing.listingCount })
    groups.set(listing.roomType, current)
  })

  return [...groups.values()]
    .map((group) => ({
      roomType: group.roomType,
      listings: group.listings,
      averageReviews: weightedAverage(group.reviewEntries),
      medianReviews: weightedMedian(group.reviewEntries),
    }))
    .sort((left, right) => right.listings - left.listings)
}

export function getPriceVsReviews(data) {
  return getValidDemandListings(data).map((listing) => ({
    price: listing.price,
    reviews: listing.reviews,
    borough: listing.borough,
    roomType: listing.roomType,
    listings: listing.listingCount,
  }))
}

export function getTopDemandBoroughs(data, minListings = DEFAULT_MIN_LISTINGS) {
  return groupDemandByBorough(data)
    .filter((borough) => borough.listings >= minListings)
    .slice(0, 5)
}

export function getLeastDemandBoroughs(data, minListings = DEFAULT_MIN_LISTINGS) {
  return groupDemandByBorough(data)
    .filter((borough) => borough.listings >= minListings)
    .sort((left, right) => left.averageReviews - right.averageReviews)
    .slice(0, 5)
}

export function generateDemandInsight(data) {
  const demandByBorough = groupDemandByBorough(data).filter(
    (borough) => borough.listings >= DEFAULT_MIN_LISTINGS,
  )
  const roomTypes = groupDemandByRoomType(data)
  const scatterData = getPriceVsReviews(data)
  const highestDemand = demandByBorough[0]
  const lowestDemand = [...demandByBorough].sort(
    (left, right) => left.averageReviews - right.averageReviews,
  )[0]
  const mostPopularRoomType = roomTypes[0]

  if (!scatterData.length) return 'No valid demand data is available for the current filters.'

  const lowerPriceListings = scatterData.filter((listing) => listing.price <= 120)
  const higherPriceListings = scatterData.filter((listing) => listing.price > 180)
  const lowerAvg = weightedAverage(
    lowerPriceListings.map((listing) => ({ value: listing.reviews, weight: listing.listings })),
  )
  const higherAvg = weightedAverage(
    higherPriceListings.map((listing) => ({ value: listing.reviews, weight: listing.listings })),
  )
  const cheaperDemandSignal =
    lowerAvg > higherAvg
      ? 'Cheaper listings tend to receive more reviews, suggesting stronger booking volume at accessible price points.'
      : 'Higher-priced listings are still attracting meaningful review activity in this filtered view.'

  return `${highestDemand?.borough ?? 'The leading borough'} has the highest average review activity, while ${
    lowestDemand?.borough ?? 'the lowest-demand borough'
  } shows the weakest review signal. ${cheaperDemandSignal} ${
    mostPopularRoomType?.roomType ?? 'The leading room type'
  } is the most common room type, indicating where guest demand is most concentrated.`
}
