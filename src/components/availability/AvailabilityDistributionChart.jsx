import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, formatNumber } from '../../utils/analytics'

function AvailabilityDistributionChart({ data }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">Availability Range Trend</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Supply concentration across availability bands</p>
      </div>

      <div className="h-[360px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 22, right: 18, left: 0, bottom: 18 }}>
            <defs>
              <linearGradient id="availabilityArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2FBF71" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2FBF71" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#111827' }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}K` : value)}
            />
            <Tooltip formatter={(value) => [formatNumber(value), 'Listings']} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2FBF71"
              strokeWidth={3}
              fill="url(#availabilityArea)"
              dot={{ r: 4, fill: '#2FBF71', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#15965C' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default AvailabilityDistributionChart
