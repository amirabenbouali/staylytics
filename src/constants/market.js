export const FILTER_DEFAULTS = {
  borough: 'All Boroughs',
  roomType: 'All Room Types',
  overviewBorough: 'All boroughs',
  overviewRoomType: 'All room types',
  priceRange: 'all',
  maxPrice: 2000,
  maxAvailability: 365,
}

export const PRICE_RANGE_OPTIONS = [
  { label: 'All prices', value: 'all' },
  { label: 'Under £100', value: 'budget' },
  { label: '£100-£180', value: 'mid' },
  { label: '£180+', value: 'premium' },
]

export const PRICE_BUCKETS = [
  { label: '£0-£50', min: 0, max: 50 },
  { label: '£51-£100', min: 51, max: 100 },
  { label: '£101-£150', min: 101, max: 150 },
  { label: '£151-£200', min: 151, max: 200 },
  { label: '£201-£300', min: 201, max: 300 },
  { label: '£301+', min: 301, max: Infinity },
]

export const AVAILABILITY_BUCKETS = [
  { label: '0-30', min: 0, max: 30 },
  { label: '31-90', min: 31, max: 90 },
  { label: '91-180', min: 91, max: 180 },
  { label: '181-270', min: 181, max: 270 },
  { label: '271-365', min: 271, max: 365 },
]

export const THRESHOLDS = {
  minBoroughListings: 10,
  maxRealisticPrice: 10000,
}

export const CHART_COLORS = {
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
