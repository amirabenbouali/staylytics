import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart as RechartsScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, round } from '../utils/analytics'

function ScatterChart({ data }) {
  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F172A]">Price vs Reviews</h2>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={{ top: 8, right: 16, bottom: 12, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} />
            <XAxis
              type="number"
              dataKey="price"
              name="Price"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#0F172A', fontSize: 12 }}
              tickFormatter={(value) => `£${value}`}
            />
            <YAxis
              type="number"
              dataKey="reviews"
              name="Reviews"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#0F172A', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '4 4' }}
              formatter={(value, name) => [
                name === 'price' ? `£${round(value)}` : round(value),
                name === 'price' ? 'Price' : 'Reviews',
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.borough ?? ''}
            />
            <Scatter data={data} fill={chartColors.accent} />
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default ScatterChart
