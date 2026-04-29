import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors } from '../../utils/analytics'

function DemandByBoroughChart({ data }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">Average Reviews by Borough</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Average reviews per listing</p>
      </div>

      <div className="h-[360px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 52, left: 92, bottom: 16 }}>
            <CartesianGrid horizontal={false} stroke={chartColors.grid} />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis type="category" dataKey="borough" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#111827' }} width={112} />
            <Tooltip formatter={(value) => [`${Math.round(value)} reviews`, 'Average reviews']} />
            <Bar
              dataKey="averageReviews"
              radius={[0, 8, 8, 0]}
              fill="#4F46E5"
              maxBarSize={18}
              label={{
                position: 'right',
                formatter: (value) => `${Math.round(value)}`,
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

export default DemandByBoroughChart
