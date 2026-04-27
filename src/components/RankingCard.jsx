import { formatCurrency } from '../utils/analytics'

function RankingCard({ eyebrow, title, items }) {
  const maxPrice = Math.max(...items.map((item) => item.avgPrice ?? item.averagePrice), 1)
  const isAffordable = eyebrow.toLowerCase().includes('value')

  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-full ${isAffordable ? 'bg-[#DDF4E8] text-[#15965C]' : 'bg-[#FFE8E9] text-[#FF5A5F]'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={isAffordable ? 'M12 5v14M6 13l6 6 6-6' : 'M12 19V5M6 11l6-6 6 6'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
      </div>
      <div className="mt-5 grid grid-cols-[40px_1fr_1fr_54px] border-b border-[#E6EAF0] pb-2 text-sm text-[#41516B]">
        <span />
        <span>Borough</span>
        <span>Average Price</span>
        <span />
      </div>
      <ol className="mt-3 space-y-3">
        {items.map((item, index) => (
          <li
            key={item.borough}
            className="grid grid-cols-[40px_1fr_1fr_54px] items-center gap-2 text-sm text-[#0F172A]"
          >
            <span>{index + 1}</span>
            <span className="truncate font-medium">{item.borough}</span>
            <span className={`h-2.5 rounded-full ${isAffordable ? 'bg-[#A9D8BF]' : 'bg-[#FF9DA0]'}`} style={{ width: `${Math.max(((item.avgPrice ?? item.averagePrice) / maxPrice) * 100, 28)}%` }} />
            <strong className={isAffordable ? 'text-[#334155]' : 'text-[#FF5A5F]'}>
              {formatCurrency(item.avgPrice ?? item.averagePrice)}
            </strong>
          </li>
        ))}
      </ol>
    </article>
  )
}

export default RankingCard
