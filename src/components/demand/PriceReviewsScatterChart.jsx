import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, formatCurrency, formatNumber } from '../../utils/analytics'

const roomColors = {
  'Entire home/apt': '#4F46E5',
  'Private room': '#6D8DFF',
  'Shared room': '#2FBF71',
  'Hotel room': '#FF5A5F',
}

function PriceReviewsScatterChart({ data }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">Price vs Number of Reviews</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Demand proxy by price and room type</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-[#111827]">
        {Object.entries(roomColors).map(([name, color]) => (
          <span key={name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </span>
        ))}
      </div>

      <div className="h-[420px] sm:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 18, left: 0, bottom: 18 }}>
            <CartesianGrid stroke={chartColors.grid} />
            <XAxis
              type="number"
              dataKey="price"
              name="Price"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `£${value}`}
            />
            <YAxis
              type="number"
              dataKey="reviews"
              name="Reviews"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip
              formatter={(value, name) => [
                name === 'Price' ? formatCurrency(value) : formatNumber(value),
                name,
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.borough ?? ''}
            />
            {Object.entries(roomColors).map(([name, color]) => (
              <Scatter key={name} data={data.filter((item) => item.roomType === name)} fill={color} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default PriceReviewsScatterChart
