export const COMPACT_LISTING_FIELDS = [
  'id',
  'name',
  'borough',
  'latitude',
  'longitude',
  'roomType',
  'price',
  'reviews',
  'reviewsPerMonth',
  'availability',
]

export function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(String(value).replace(/[,\s]/g, ''))
  return Number.isFinite(number) ? number : null
}

export function cleanDatasetPrice(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(String(value).replace(/[£$,\s]/g, ''))
  if (!Number.isFinite(number) || number <= 0 || number > 10000) return null
  return number
}

export function normaliseListingRow(row) {
  const id = row.id ?? row.listing_id
  const latitude = parseNumber(row.latitude)
  const longitude = parseNumber(row.longitude)
  const price = cleanDatasetPrice(row.price)
  const availability = parseNumber(row.availability_365 ?? row.availability)
  const reviews = parseNumber(row.number_of_reviews ?? row.reviews)
  const reviewsPerMonth = parseNumber(row.reviews_per_month)
  const borough = row.neighbourhood_cleansed ?? row.neighbourhood ?? row.borough
  const roomType = row.room_type ?? row.roomType

  if (
    !id ||
    !borough ||
    !roomType ||
    price === null ||
    latitude === null ||
    longitude === null ||
    availability === null ||
    reviews === null
  ) {
    return null
  }

  if (availability < 0 || availability > 365) return null

  return {
    id: String(id),
    name: String(row.name || `${roomType} in ${borough}`).slice(0, 90),
    borough,
    latitude: Number(latitude.toFixed(5)),
    longitude: Number(longitude.toFixed(5)),
    roomType,
    price: Math.round(price),
    reviews,
    reviewsPerMonth: Number((reviewsPerMonth ?? 0).toFixed(2)),
    availability,
  }
}

export function processListingsData(rows) {
  return rows.map(normaliseListingRow).filter(Boolean)
}

export async function parseListingsCsv(raw) {
  const { default: Papa } = await import('papaparse')
  const parsed = Papa.parse(raw, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })

  if (parsed.errors.length) {
    throw new Error(`CSV parsing failed: ${parsed.errors[0].message}`)
  }

  return parsed.data
}

export function compactListings(listings) {
  return {
    fields: COMPACT_LISTING_FIELDS,
    rows: listings.map((listing) =>
      COMPACT_LISTING_FIELDS.map((field) => listing[field]),
    ),
  }
}

export function expandCompactDataset(parsed) {
  if (!Array.isArray(parsed?.fields) || !Array.isArray(parsed?.rows)) return null

  return parsed.rows.map((row) =>
    parsed.fields.reduce((listing, field, index) => {
      listing[field] = row[index]
      return listing
    }, {}),
  )
}

export async function loadStaylyticsDataset() {
  const datasetFiles = import.meta.glob('../data/{london_listings,listings}.json', {
    query: '?url',
    import: 'default',
    eager: true,
  })
  const entries = Object.entries(datasetFiles)
  const jsonEntry =
    entries.find(([path]) => path.endsWith('london_listings.json')) ??
    entries.find(([path]) => path.endsWith('listings.json'))

  if (!jsonEntry) {
    throw new Error(
      'No processed dataset found. Run npm run prepare-data to create src/data/london_listings.json.',
    )
  }

  const [, url] = jsonEntry
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Dataset request failed with status ${response.status}.`)
  }

  const parsed = await response.json()
  const rows = Array.isArray(parsed)
    ? parsed
    : expandCompactDataset(parsed) ?? parsed.listings

  if (!Array.isArray(rows)) {
    throw new Error('JSON dataset must be an array, compact rows object, or object with a listings array.')
  }

  const cleaned = processListingsData(rows)

  if (!cleaned.length) {
    throw new Error('Dataset loaded, but no valid listings remained after cleaning.')
  }

  return cleaned
}
