import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, formatNumber } from '../utils/analytics'

function PriceDistributionChart({ data }) {
  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F172A]">Price Distribution</h2>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 12, left: 0 }}>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#0F172A', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#0F172A', fontSize: 12 }}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}K` : value)}
            />
            <Tooltip formatter={(value) => [formatNumber(value), 'Listings']} />
            <Bar dataKey="count" radius={[10, 10, 0, 0]} fill={chartColors.accent} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default PriceDistributionChart
