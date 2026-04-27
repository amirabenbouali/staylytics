const takeaways = [
  'Entire homes dominate the London Airbnb market.',
  'Central boroughs have significantly higher prices.',
  'Higher reviews generally correlate with lower availability.',
  'Demand remains strong in central locations.',
]

function KeyTakeaways() {
  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFE8E9] text-[#FF5A5F]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M19.8 7.5 17.2 9M6.8 15l-2.6 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <h2 className="text-lg font-bold text-[#0F172A]">Key Takeaways</h2>
      </div>

      <ul className="mt-5 space-y-4">
        {takeaways.map((takeaway) => (
          <li key={takeaway} className="flex gap-3 text-sm leading-5 text-[#334155]">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#94A3B8] text-[#41516B]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 12 4 4 8-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {takeaway}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default KeyTakeaways
