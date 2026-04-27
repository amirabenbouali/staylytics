import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, formatNumber } from '../utils/analytics'

function LineTrendChart({ data }) {
  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F172A]">Listings Added Over Time</h2>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 12, left: 0 }}>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#0F172A', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#0F172A', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}K`} />
            <Tooltip formatter={(value) => [formatNumber(value), 'Listings added']} />
            <Line
              type="monotone"
              dataKey="listings"
              stroke={chartColors.accent}
              strokeWidth={3}
              dot={{ r: 3, fill: chartColors.accent }}
              activeDot={{ r: 5, fill: chartColors.accent }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default LineTrendChart
