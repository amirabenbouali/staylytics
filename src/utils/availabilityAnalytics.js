import { AVAILABILITY_BUCKETS, THRESHOLDS } from '../constants/market'

const DEFAULT_MIN_LISTINGS = THRESHOLDS.minBoroughListings

export { AVAILABILITY_BUCKETS }

function cleanAvailability(value) {
  const availability = Number(value)
  if (!Number.isFinite(availability)) return null
  if (availability < 0 || availability > 365) return null
  return availability
}

function getListingWeight(listing) {
  const weight = Number(listing.listings ?? listing.count ?? 1)
  return Number.isFinite(weight) && weight > 0 ? weight : 1
}

function getBorough(listing) {
  return listing.borough || listing.neighbourhood || 'Unknown'
}

export function getValidAvailabilityListings(data) {
  return data
    .map((listing) => {
      const availability = cleanAvailability(
        listing.availability ?? listing.availability_365,
      )
      if (availability === null) return null

      return {
        ...listing,
        availability,
        borough: getBorough(listing),
        roomType: listing.roomType ?? listing.room_type ?? 'Unknown',
        listingCount: getListingWeight(listing),
      }
    })
    .filter(Boolean)
}

function calculateWeightedAverage(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (!totalWeight) return 0

  return entries.reduce((sum, entry) => sum + entry.value * entry.weight, 0) / totalWeight
}

function calculateWeightedMedian(entries) {
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

export function getAvailabilityKPIs(data) {
  const validListings = getValidAvailabilityListings(data)
  const entries = validListings.map((listing) => ({
    value: listing.availability,
    weight: listing.listingCount,
  }))

  return {
    averageAvailability: calculateWeightedAverage(entries),
    medianAvailability: calculateWeightedMedian(entries),
    totalValidListings: validListings.reduce(
      (sum, listing) => sum + listing.listingCount,
      0,
    ),
  }
}

export function groupAvailabilityByBorough(data) {
  const groups = new Map()

  getValidAvailabilityListings(data).forEach((listing) => {
    const current = groups.get(listing.borough) ?? {
      borough: listing.borough,
      listings: 0,
      entries: [],
    }

    current.listings += listing.listingCount
    current.entries.push({
      value: listing.availability,
      weight: listing.listingCount,
    })
    groups.set(listing.borough, current)
  })

  return [...groups.values()]
    .map((group) => ({
      borough: group.borough,
      listings: group.listings,
      averageAvailability: calculateWeightedAverage(group.entries),
      medianAvailability: calculateWeightedMedian(group.entries),
    }))
    .sort((left, right) => right.averageAvailability - left.averageAvailability)
}

export function getAvailabilityBuckets(data) {
  const buckets = AVAILABILITY_BUCKETS.map((bucket) => ({ ...bucket, count: 0 }))

  getValidAvailabilityListings(data).forEach((listing) => {
    const bucket = buckets.find(
      (item) => listing.availability >= item.min && listing.availability <= item.max,
    )

    if (bucket) bucket.count += listing.listingCount
  })

  return buckets.map(({ label, count, min, max }) => ({ label, count, min, max }))
}

export function getTopAvailableBoroughs(data, minListings = DEFAULT_MIN_LISTINGS) {
  return groupAvailabilityByBorough(data)
    .filter((borough) => borough.listings >= minListings)
    .slice(0, 5)
}

export function getLeastAvailableBoroughs(data, minListings = DEFAULT_MIN_LISTINGS) {
  return groupAvailabilityByBorough(data)
    .filter((borough) => borough.listings >= minListings)
    .sort((left, right) => left.averageAvailability - right.averageAvailability)
    .slice(0, 5)
}

export function generateAvailabilityInsight(data) {
  const kpis = getAvailabilityKPIs(data)
  const buckets = getAvailabilityBuckets(data)
  const mostCommonBucket = [...buckets].sort((left, right) => right.count - left.count)[0]
  const mostAvailable = getTopAvailableBoroughs(data)[0]
  const leastAvailable = getLeastAvailableBoroughs(data)[0]

  if (!kpis.totalValidListings) {
    return 'No valid availability data is available for the current filters.'
  }

  const demandSignal =
    kpis.averageAvailability < 120
      ? 'This suggests tighter supply and potentially stronger demand.'
      : kpis.averageAvailability > 220
        ? 'This suggests looser supply, with more listings available for longer periods.'
        : 'This suggests a balanced supply picture across the filtered market.'

  return `Most listings fall in the ${mostCommonBucket?.label ?? 'mid-range'} days availability range. ${
    mostAvailable?.borough ?? 'The leading borough'
  } has the highest average availability, while ${
    leastAvailable?.borough ?? 'the lowest-availability borough'
  } has the lowest. ${demandSignal}`
}
