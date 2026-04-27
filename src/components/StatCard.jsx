function StatCard({ label, value, detail, icon, note }) {
  const icons = {
    listings: (
      <path d="M5 11.5 12 5l7 6.5M7 10v9h10v-9M10 19v-5h4v5" />
    ),
    price: (
      <path d="M9 20h8M10 11h6M11 20c2-3 2-12 0-14a4 4 0 0 1 7 2" />
    ),
    location: (
      <>
        <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    room: (
      <path d="M4 18V9a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v2h4a3 3 0 0 1 3 3v4M4 14h16M6 14v-2M18 14v-2" />
    ),
  }

  return (
    <article className="flex gap-5 rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#FFE8E9] text-[#FF5A5F]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icons[icon]}
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
        <strong className="mt-2 block truncate text-2xl font-bold text-[#0F172A]">{value}</strong>
        <p className="mt-2 text-sm text-[#52637A]">{detail}</p>
        {note ? <p className="mt-3 text-sm font-medium text-[#FF5A5F]">{note}</p> : null}
      </div>
    </article>
  )
}

export default StatCard
