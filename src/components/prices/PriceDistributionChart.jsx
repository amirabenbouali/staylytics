import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, formatNumber } from '../../utils/analytics'

function PriceDistributionChart({ data }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">Price Distribution</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Number of listings by nightly price</p>
      </div>

      <div className="h-[360px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 22, right: 18, left: 0, bottom: 18 }}>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#111827' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}K` : value)}
            />
            <Tooltip formatter={(value) => [formatNumber(value), 'Listings']} />
            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              fill="#FF5A5F"
              maxBarSize={48}
              label={{
                position: 'top',
                formatter: (value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value),
                fontSize: 12,
                fill: '#111827',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default PriceDistributionChart
