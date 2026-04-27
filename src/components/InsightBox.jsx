function InsightBox({ children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#F5D9D9] bg-[linear-gradient(100deg,#FFF5FA,#FFF8F2)] p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[auto_1fr_300px] lg:items-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#FFE2E4] text-[#FF5A5F]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2.8 14.2 9l6.2 2.2-6.2 2.2L12 19.6l-2.2-6.2-6.2-2.2L9.8 9 12 2.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-bold text-[#0F172A]">AI Market Summary</h2>
            <span className="rounded-full bg-[#ECE7FF] px-4 py-1 text-xs font-bold uppercase text-[#4F46E5]">
              AI generated
            </span>
          </div>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1E293B]">{children}</p>
        </div>
        <div className="hidden h-28 items-end justify-center gap-4 lg:flex">
          {[36, 58, 78, 104].map((height) => (
            <span
              key={height}
              className="w-7 rounded-t-md bg-[linear-gradient(180deg,#FF8A8D,#FF5A5F)] shadow-lg shadow-[#FF5A5F]/20"
              style={{ height }}
            />
          ))}
          <div className="relative mb-1 ml-5 h-20 w-24 rounded-t-xl border-4 border-[#FFD7D0] bg-[#FFF3EF]">
            <div className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 rotate-45 border-l-4 border-t-4 border-[#FFD7D0] bg-[#FFF3EF]" />
            <div className="absolute bottom-0 left-9 h-9 w-7 rounded-t-md bg-[#FFD7D0]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default InsightBox
