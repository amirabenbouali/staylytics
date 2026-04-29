import { lazy, Suspense, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import EmptyState from './components/ui/EmptyState'
import Skeleton from './components/ui/Skeleton'
import { loadStaylyticsDataset } from './utils/dataProcessing'

const OverviewPage = lazy(() => import('./pages/OverviewPage'))
const PricesPage = lazy(() => import('./pages/PricesPage'))
const AvailabilityPage = lazy(() => import('./pages/AvailabilityPage'))
const DemandPage = lazy(() => import('./pages/DemandPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <Skeleton className="h-16 w-80 max-w-full" />
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('overview')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    loadStaylyticsDataset()
      .then((data) => {
        if (!cancelled) {
          setListings(data)
          setError(null)
        }
      })
      .catch((datasetError) => {
        if (!cancelled) setError(datasetError.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const pages = {
    overview: <OverviewPage listings={listings} onNavigate={setActivePage} />,
    prices: <PricesPage listings={listings} />,
    availability: <AvailabilityPage listings={listings} />,
    demand: <DemandPage listings={listings} />,
    map: <MapPage listings={listings} />,
    insights: <InsightsPage listings={listings} />,
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#F8F7F4] text-[#0F172A] lg:flex-row">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="min-w-0 flex-1">
        {loading ? (
          <PageSkeleton />
        ) : error ? (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
            <EmptyState
              title="Dataset could not be loaded"
              message={`${error} Add an Inside Airbnb London CSV at src/data/london_listings.csv, run npm run prepare-data, then restart the dev server.`}
            />
          </div>
        ) : (
          <Suspense fallback={<PageSkeleton />}>
            {pages[activePage] ?? pages.overview}
          </Suspense>
        )}
      </div>
    </main>
  )
}

export default App
