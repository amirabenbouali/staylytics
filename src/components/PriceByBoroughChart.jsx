import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, formatCurrency } from '../utils/analytics'

function PriceByBoroughChart({ data, title = 'Average Price by Borough' }) {
  return (
    <article className="rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slice(0, 10)} margin={{ top: 8, right: 8, bottom: 20, left: 0 }}>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="borough"
              interval={0}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#0F172A', fontSize: 10 }}
              angle={-22}
              textAnchor="end"
              height={58}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#0F172A', fontSize: 12 }}
              tickFormatter={(value) => `£${value}`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Average price']}
              cursor={{ fill: chartColors.softAccent }}
            />
            <Bar dataKey="avgPrice" radius={[10, 10, 0, 0]} fill={chartColors.accent} maxBarSize={34} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default PriceByBoroughChart
