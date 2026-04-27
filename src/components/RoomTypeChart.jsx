import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { chartColors, formatNumber } from '../utils/analytics'

function RoomTypeChart({ data, total }) {
  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F172A]">Room Type Distribution</h2>
      <div className="mt-3 grid h-56 items-center gap-4 md:grid-cols-[1fr_220px]">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={1}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={chartColors.rooms[entry.name] ?? chartColors.accent} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatNumber(value), 'Listings']} />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center">
            <strong className="block text-2xl font-bold text-[#0F172A]">{formatNumber(total)}</strong>
            <span className="text-xs font-semibold text-[#52637A]">Listings</span>
          </div>
        </div>
        <div className="hidden space-y-4 md:block">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2 text-[#0F172A]">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: chartColors.rooms[item.name] ?? chartColors.accent }}
                />
                {item.name}
              </span>
              <strong className="text-[#0F172A]">{((item.value / total) * 100).toFixed(1)}%</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default RoomTypeChart
