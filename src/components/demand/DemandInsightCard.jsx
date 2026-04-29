function DemandInsightCard({ insight }) {
  return (
    <section className="rounded-2xl border border-[#DDE3FF] bg-[linear-gradient(105deg,#F4F6FF,#FFFFFF)] p-6 shadow-[0_18px_50px_rgba(79,70,229,0.12)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#4F46E5] text-white shadow-[0_14px_32px_rgba(79,70,229,0.24)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 14s3-6 8-6 8 6 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#4F46E5]">AI Demand Insight</h2>
          <p className="mt-2 max-w-5xl text-base leading-7 text-[#111827]">{insight}</p>
        </div>
      </div>
    </section>
  )
}

export default DemandInsightCard
