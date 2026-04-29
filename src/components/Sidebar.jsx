const navItems = [
  { label: 'Overview', page: 'overview', icon: 'grid' },
  { label: 'Prices', page: 'prices', icon: 'pound' },
  { label: 'Availability', page: 'availability', icon: 'calendar' },
  { label: 'Demand', page: 'demand', icon: 'spark' },
  { label: 'Map', page: 'map', icon: 'home' },
  { label: 'Insights', page: 'insights', icon: 'info' },
]

function Icon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'grid') {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </svg>
    )
  }

  if (name === 'pound') {
    return (
      <svg {...common}>
        <path d="M7 20h10" />
        <path d="M9 11h6" />
        <path d="M10 20c2-3 2-12 0-14a4 4 0 0 1 7 2" />
      </svg>
    )
  }

  if (name === 'home') {
    return (
      <svg {...common}>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6 10.5V20h12v-9.5" />
        <path d="M10 20v-6h4v6" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    )
  }

  if (name === 'star') {
    return (
      <svg {...common}>
        <path d="m12 3 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9L12 3Z" />
      </svg>
    )
  }

  if (name === 'spark') {
    return (
      <svg {...common}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="m6.3 6.3 2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  )
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#ECE7DF] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#FF5A5F]">
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path d="M32 12c-6 9-14 22-14 30a14 14 0 0 0 28 0c0-8-8-21-14-30Z" stroke="currentColor" strokeWidth="3" />
              <path d="M24 42c5-7 11-12 16-16" stroke="currentColor" strokeWidth="3" />
              <path d="M40 42c-5-7-11-12-16-16" stroke="currentColor" strokeWidth="3" />
            </svg>
            <span className="text-lg font-bold text-[#111827]">staylytics</span>
          </div>
          <select
            className="h-10 rounded-xl border border-[#DED8CF] bg-white px-3 text-sm font-semibold text-[#111827] outline-none focus:border-[#FF5A5F] focus:ring-4 focus:ring-[#FF5A5F]/10"
            value={activePage}
            onChange={(event) => onNavigate(event.target.value)}
          >
            {navItems.map((item) => (
              <option key={item.page} value={item.page}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <aside className="hidden w-[224px] shrink-0 border-r border-[#E6EAF0] bg-white px-4 py-6 lg:flex lg:flex-col">
        <div className="mb-12 flex items-center gap-3 px-2 text-[#FF5A5F]">
        <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path
            d="M32 12c-6 9-14 22-14 30a14 14 0 0 0 28 0c0-8-8-21-14-30Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M24 42c5-7 11-12 16-16" stroke="currentColor" strokeWidth="3" />
          <path d="M40 42c-5-7-11-12-16-16" stroke="currentColor" strokeWidth="3" />
        </svg>
        <span className="text-xl font-bold text-[#111827]">staylytics</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition hover:translate-x-0.5 ${
                activePage === item.page
                  ? 'bg-[#FFF0F0] text-[#FF5A5F] shadow-sm'
                  : 'text-[#111827] hover:bg-[#F8F7F4]'
              }`}
              onClick={() => onNavigate(item.page)}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-[#F0E4E0] bg-white p-4 text-xs leading-5 text-[#41516B] shadow-sm">
          <p className="font-bold text-[#FF5A5F]">Pro Tip</p>
          <p className="mt-3">Use filters to explore specific areas and room types.</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
