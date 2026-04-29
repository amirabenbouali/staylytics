function AvailabilityInsightCard({ insight }) {
  return (
    <section className="rounded-2xl border border-[#D8F0E4] bg-[linear-gradient(105deg,#EFFBF5,#FFFFFF)] p-6 shadow-[0_18px_50px_rgba(47,191,113,0.12)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#2FBF71] text-white shadow-[0_14px_32px_rgba(47,191,113,0.28)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#15965C]">AI Availability Insight</h2>
          <p className="mt-2 max-w-5xl text-base leading-7 text-[#111827]">{insight}</p>
        </div>
      </div>
    </section>
  )
}

export default AvailabilityInsightCard
