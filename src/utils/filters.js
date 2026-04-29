import { FILTER_DEFAULTS } from '../constants/market'
import { cleanPrice } from './priceAnalytics'

export function isAllBorough(value) {
  return !value || value === FILTER_DEFAULTS.borough || value === FILTER_DEFAULTS.overviewBorough
}

export function isAllRoomType(value) {
  return !value || value === FILTER_DEFAULTS.roomType || value === FILTER_DEFAULTS.overviewRoomType
}

export function getFilterOptions(records, key, allLabel) {
  return [
    allLabel,
    ...new Set(records.map((record) => record[key]).filter(Boolean).sort()),
  ]
}

export function inPriceRange(price, range) {
  if (range === 'budget') return price < 100
  if (range === 'mid') return price >= 100 && price <= 180
  if (range === 'premium') return price > 180
  return true
}

export function filterListings(records, filters = {}) {
  return records.filter((listing) => {
    const price = cleanPrice(listing.price)
    const reviews = Number(listing.reviews ?? listing.number_of_reviews ?? 0)
    const availability = Number(listing.availability ?? listing.availability_365)
    const roomType = listing.roomType ?? listing.room_type

    const boroughMatch = isAllBorough(filters.borough) || listing.borough === filters.borough
    const roomTypeMatch = isAllRoomType(filters.roomType) || roomType === filters.roomType
    const priceRangeMatch = inPriceRange(price ?? 0, filters.priceRange)
    const minPriceMatch = filters.minPrice === undefined || (price !== null && price >= filters.minPrice)
    const maxPriceMatch = filters.maxPrice === undefined || (price !== null && price <= filters.maxPrice)
    const minAvailabilityMatch =
      filters.minAvailability === undefined ||
      (Number.isFinite(availability) && availability >= filters.minAvailability)
    const maxAvailabilityMatch =
      filters.maxAvailability === undefined ||
      (Number.isFinite(availability) && availability <= filters.maxAvailability)
    const minReviewsMatch =
      filters.minReviews === undefined || (Number.isFinite(reviews) && reviews >= filters.minReviews)
    const maxReviewsMatch =
      filters.maxReviews === undefined || (Number.isFinite(reviews) && reviews <= filters.maxReviews)

    return (
      boroughMatch &&
      roomTypeMatch &&
      priceRangeMatch &&
      minPriceMatch &&
      maxPriceMatch &&
      minAvailabilityMatch &&
      maxAvailabilityMatch &&
      minReviewsMatch &&
      maxReviewsMatch
    )
  })
}
