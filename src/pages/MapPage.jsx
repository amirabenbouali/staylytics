import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import MapFilterBar from '../components/map/MapFilterBar'
import MapModeToggle from '../components/map/MapModeToggle'
import MapSummaryPanel from '../components/map/MapSummaryPanel'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { RangeControl } from '../components/ui/FilterControls'
import { FILTER_DEFAULTS } from '../constants/market'
import { formatCurrency, formatNumber } from '../utils/analytics'
import { filterListings, getFilterOptions, isAllBorough } from '../utils/filters'
import {
  generateLocationInsight,
  getMapSummary,
  getMarkerColor,
  getValidMapListings,
  groupMapListingsByBorough,
} from '../utils/mapAnalytics'

function MapViewport({ center }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, center[0] === 51.5074 ? 10 : 12, { animate: true })
  }, [center, map])

  return null
}

function MapPage({ listings }) {
  const defaultFilters = {
    borough: FILTER_DEFAULTS.borough,
    roomType: FILTER_DEFAULTS.roomType,
    maxPrice: FILTER_DEFAULTS.maxPrice,
    maxAvailability: FILTER_DEFAULTS.maxAvailability,
  }
  const [draftFilters, setDraftFilters] = useState(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)
  const [mapMode, setMapMode] = useState('price')
  const [selectedListing, setSelectedListing] = useState(null)
  const [selectedMapBorough, setSelectedMapBorough] = useState(null)

  const boroughOptions = useMemo(
    () => getFilterOptions(listings, 'borough', FILTER_DEFAULTS.borough),
    [listings],
  )
  const roomTypeOptions = useMemo(
    () => getFilterOptions(listings, 'roomType', FILTER_DEFAULTS.roomType),
    [listings],
  )

  const filteredListings = useMemo(
    () => filterListings(listings, appliedFilters),
    [appliedFilters, listings],
  )

  const mapListings = useMemo(() => getValidMapListings(filteredListings), [filteredListings])
  const boroughClusters = useMemo(() => groupMapListingsByBorough(mapListings), [mapListings])
  const showClusters = mapListings.length > 600
  const selectedBorough =
    selectedListing?.borough ??
    selectedMapBorough ??
    (isAllBorough(appliedFilters.borough) ? null : appliedFilters.borough)
  const summary = useMemo(
    () => getMapSummary(mapListings, selectedBorough),
    [mapListings, selectedBorough],
  )
  const insight = useMemo(
    () => generateLocationInsight(mapListings, selectedBorough),
    [mapListings, selectedBorough],
  )

  const resetFilters = () => {
    setDraftFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
    setSelectedListing(null)
    setSelectedMapBorough(null)
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-7 sm:px-6 sm:py-8 lg:space-y-8 lg:px-10 lg:py-10">
        <PageHeader
          title="Map"
          subtitle="Explore Airbnb market patterns across London."
          accent="#F97316"
          action={<MapModeToggle mode={mapMode} onChange={setMapMode} />}
        />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
          <MapFilterBar
            borough={draftFilters.borough}
            roomType={draftFilters.roomType}
            maxPrice={draftFilters.maxPrice}
            boroughOptions={boroughOptions}
            roomTypeOptions={roomTypeOptions}
            onBoroughChange={(value) => setDraftFilters((current) => ({ ...current, borough: value }))}
            onRoomTypeChange={(value) => setDraftFilters((current) => ({ ...current, roomType: value }))}
            onMaxPriceChange={(value) => setDraftFilters((current) => ({ ...current, maxPrice: value }))}
            onApply={() => {
              setAppliedFilters(draftFilters)
              setSelectedListing(null)
              setSelectedMapBorough(isAllBorough(draftFilters.borough) ? null : draftFilters.borough)
            }}
            onReset={resetFilters}
          />

          <div className="rounded-2xl border border-[#ECE7DF] bg-white/95 p-4 shadow-[0_16px_48px_rgba(17,24,39,0.08)] backdrop-blur sm:p-5">
            <RangeControl
              label="Availability"
              minLabel="0d"
              maxLabel={`${draftFilters.maxAvailability}d`}
              min={30}
              max={365}
              step={5}
              value={draftFilters.maxAvailability}
              onChange={(value) => setDraftFilters((current) => ({ ...current, maxAvailability: value }))}
              accent="#F97316"
            />
          </div>
        </section>

        <section className="grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="overflow-hidden rounded-2xl border border-[#ECE7DF] bg-white shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
            <div className="flex flex-col gap-3 border-b border-[#ECE7DF] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">London Listings Map</h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {showClusters
                    ? `${formatNumber(boroughClusters.length)} borough clusters shown`
                    : `${formatNumber(mapListings.length)} location points shown`}
                  . Colour reflects {mapMode}.
                </p>
              </div>
              <button
                type="button"
                className="text-sm font-bold text-[#F97316]"
                onClick={() => {
                  setSelectedListing(null)
                  setSelectedMapBorough(null)
                }}
              >
                Clear selection
              </button>
            </div>

            <div className="h-[420px] min-h-[360px] sm:h-[480px] lg:h-[540px]">
              {!mapListings.length ? (
                <div className="grid h-full place-items-center bg-[#F8F7F4] p-8">
                  <EmptyState title="No map points found" message="Try increasing the price or availability range." />
                </div>
              ) : (
                <MapContainer
                  center={summary.center}
                  zoom={10}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <MapViewport center={summary.center} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {showClusters
                    ? boroughClusters.map((cluster) => (
                      <CircleMarker
                        key={cluster.borough}
                        center={[cluster.latitude, cluster.longitude]}
                        radius={Math.max(10, Math.min(22, 8 + Math.log10(cluster.listings) * 3))}
                        pathOptions={{
                          color: '#ffffff',
                          weight: 2,
                          fillColor: getMarkerColor(
                            {
                              price: cluster.averagePrice,
                              reviews: cluster.averageReviews,
                              availability: cluster.averageAvailability,
                            },
                            mapMode,
                          ),
                          fillOpacity: 0.82,
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelectedListing(null)
                            setSelectedMapBorough(cluster.borough)
                          },
                        }}
                      >
                        <Popup>
                          <div className="min-w-48 space-y-1.5 text-sm">
                            <strong className="block text-base">{cluster.borough}</strong>
                            <p>{formatNumber(cluster.listings)} listings</p>
                            <p>{formatCurrency(cluster.averagePrice)} avg. price</p>
                            <p>{formatNumber(cluster.averageReviews)} avg. reviews</p>
                            <p>{Math.round(cluster.averageAvailability)} avg. available days</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))
                    : mapListings.map((listing) => (
                      <CircleMarker
                        key={listing.id}
                        center={[listing.latitude, listing.longitude]}
                        radius={Math.max(7, Math.min(15, 6 + Math.log10(listing.listings)))}
                        pathOptions={{
                          color: '#ffffff',
                          weight: 2,
                          fillColor: getMarkerColor(listing, mapMode),
                          fillOpacity: 0.86,
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelectedListing(listing)
                            setSelectedMapBorough(null)
                          },
                        }}
                      >
                        <Popup>
                          <div className="min-w-48 space-y-1.5 text-sm">
                            <strong className="block text-base">{listing.name}</strong>
                            <p>{listing.borough}</p>
                            <p>{formatCurrency(listing.price)} per night</p>
                            <p>{listing.roomType}</p>
                            <p>{formatNumber(listing.reviews)} reviews</p>
                            <p>{listing.availability} days available</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                </MapContainer>
              )}
            </div>
          </article>

          <MapSummaryPanel
            summary={summary}
            selectedListing={selectedListing}
            insight={insight}
          />
        </section>

        <p className="pb-4 text-sm text-[#6B7280]">
          Map points use OpenStreetMap tiles and cleaned Inside Airbnb listing coordinates.
        </p>
      </div>
    </div>
  )
}

export default MapPage
