function PriceInsightCard({ insight }) {
  return (
    <section className="rounded-2xl border border-[#F7DDD8] bg-[linear-gradient(105deg,#FFF3F0,#FFFFFF)] p-6 shadow-[0_18px_50px_rgba(255,90,95,0.12)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#FF5A5F] text-white shadow-[0_14px_32px_rgba(255,90,95,0.28)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#FF5A5F]">AI Pricing Insight</h2>
          <p className="mt-2 max-w-5xl text-base leading-7 text-[#111827]">{insight}</p>
        </div>
      </div>
    </section>
  )
}

export default PriceInsightCard
