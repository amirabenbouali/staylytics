import { cleanPrice } from './priceAnalytics'

const DEFAULT_LONDON_CENTER = [51.5074, -0.1278]

export function getValidMapListings(data) {
  return data
    .map((listing) => {
      const price = cleanPrice(listing.price)
      const latitude = Number(listing.latitude ?? listing.lat)
      const longitude = Number(listing.longitude ?? listing.lng)
      const reviews = Number(listing.reviews ?? listing.number_of_reviews ?? 0)
      const availability = Number(listing.availability ?? listing.availability_365 ?? 0)
      const listings = Number(listing.listings ?? 1)

      if (price === null || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null
      }

      return {
        ...listing,
        name: listing.name ?? `${listing.roomType ?? listing.room_type} in ${listing.borough}`,
        price,
        reviews: Number.isFinite(reviews) ? reviews : 0,
        availability: Number.isFinite(availability) ? availability : 0,
        listings: Number.isFinite(listings) && listings > 0 ? listings : 1,
        latitude,
        longitude,
        borough: listing.borough || listing.neighbourhood || 'Unknown',
        roomType: listing.roomType ?? listing.room_type ?? 'Unknown',
      }
    })
    .filter(Boolean)
}

function weightedAverage(data, key) {
  const totalWeight = data.reduce((sum, item) => sum + item.listings, 0)
  if (!totalWeight) return 0

  return data.reduce((sum, item) => sum + item[key] * item.listings, 0) / totalWeight
}

export function groupMapListingsByBorough(data) {
  const groups = new Map()

  getValidMapListings(data).forEach((listing) => {
    const current = groups.get(listing.borough) ?? {
      borough: listing.borough,
      listings: 0,
      items: [],
    }

    current.listings += listing.listings
    current.items.push(listing)
    groups.set(listing.borough, current)
  })

  return [...groups.values()].map((group) => ({
    borough: group.borough,
    listings: group.listings,
    averagePrice: weightedAverage(group.items, 'price'),
    averageReviews: weightedAverage(group.items, 'reviews'),
    averageAvailability: weightedAverage(group.items, 'availability'),
    latitude: weightedAverage(group.items, 'latitude'),
    longitude: weightedAverage(group.items, 'longitude'),
    mostCommonRoomType: getMostCommonRoomType(group.items),
    items: group.items,
  }))
}

export function getMostCommonRoomType(data) {
  const groups = new Map()

  data.forEach((listing) => {
    groups.set(listing.roomType, (groups.get(listing.roomType) ?? 0) + listing.listings)
  })

  return [...groups.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'Unknown'
}

export function getMapSummary(data, selectedBorough) {
  const validListings = getValidMapListings(data)
  const boroughGroups = groupMapListingsByBorough(validListings)
  const selectedGroup = selectedBorough
    ? boroughGroups.find((group) => group.borough === selectedBorough)
    : null
  const source = selectedGroup?.items ?? validListings

  return {
    name: selectedGroup?.borough ?? 'Filtered London Market',
    averagePrice: weightedAverage(source, 'price'),
    averageReviews: weightedAverage(source, 'reviews'),
    averageAvailability: weightedAverage(source, 'availability'),
    mostCommonRoomType: getMostCommonRoomType(source),
    listings: source.reduce((sum, listing) => sum + listing.listings, 0),
    center: selectedGroup
      ? [selectedGroup.latitude, selectedGroup.longitude]
      : DEFAULT_LONDON_CENTER,
  }
}

export function generateLocationInsight(data, selectedBorough) {
  const validListings = getValidMapListings(data)
  const londonSummary = getMapSummary(validListings)
  const selectedSummary = getMapSummary(validListings, selectedBorough)

  if (!validListings.length) {
    return 'No valid location data is available for the current filters.'
  }

  const priceSignal =
    selectedSummary.averagePrice > londonSummary.averagePrice * 1.12
      ? 'higher-than-average prices'
      : selectedSummary.averagePrice < londonSummary.averagePrice * 0.88
        ? 'lower-than-average prices'
        : 'prices close to the London average'
  const demandSignal =
    selectedSummary.averageReviews > londonSummary.averageReviews
      ? 'strong demand'
      : 'moderate demand'
  const availabilitySignal =
    selectedSummary.averageAvailability < londonSummary.averageAvailability
      ? 'lower availability, which may indicate frequent bookings'
      : 'higher availability, suggesting looser supply'

  return `${selectedSummary.name} shows ${priceSignal} and ${demandSignal}. Availability is ${availabilitySignal}. ${selectedSummary.mostCommonRoomType} listings make up the largest share of supply in this view.`
}

export function getMarkerColor(listing, mode) {
  if (mode === 'demand') {
    if (listing.reviews >= 220) return '#D92D20'
    if (listing.reviews >= 130) return '#FF5A5F'
    return '#FFB4B6'
  }

  if (mode === 'availability') {
    if (listing.availability >= 240) return '#15965C'
    if (listing.availability >= 120) return '#FFB020'
    return '#FF5A5F'
  }

  if (listing.price >= 190) return '#D92D20'
  if (listing.price >= 120) return '#FF5A5F'
  return '#FFB4B6'
}
