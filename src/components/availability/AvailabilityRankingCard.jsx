function AvailabilityRankingCard({ title, rows }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
      <div className="mt-7 grid grid-cols-[40px_1fr_112px] border-b border-[#ECE7DF] pb-3 text-sm font-medium text-[#6B7280]">
        <span>#</span>
        <span>Borough</span>
        <span className="text-right">Avg. Days</span>
      </div>
      <ol>
        {rows.map((row, index) => (
          <li
            key={row.borough}
            className="grid grid-cols-[40px_1fr_112px] border-b border-[#F0ECE6] py-4 text-sm text-[#111827]"
          >
            <span>{index + 1}</span>
            <span className="font-medium">{row.borough}</span>
            <span className="text-right font-semibold">
              {Math.round(row.averageAvailability)} days
            </span>
          </li>
        ))}
      </ol>
    </article>
  )
}

export default AvailabilityRankingCard
