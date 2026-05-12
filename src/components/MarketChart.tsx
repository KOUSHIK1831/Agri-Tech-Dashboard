import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { fmt } from '../utils/helpers'

export default function MarketChart({ data }: any) {
  const { t } = useTranslation()
  if (!data || data.length === 0) return null

  const chartData = data.slice(0, 8).map((r: any) => ({
    name: r.market.split(' ')[0],
    fullName: r.market,
    price: Number(r.modal_price),
    commodity: r.commodity,
  }))

  const colors = [
    '#16a34a',
    '#2563eb',
    '#7c3aed',
    '#db2777',
    '#ea580c',
    '#0891b2',
    '#4f46e5',
    '#be185d',
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">
            {t('marketChart')}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{t('avgModalPrice')}</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                padding: '12px',
              }}
              formatter={(value: any) => [fmt(value), t('modalPrice')]}
            />
            <Bar dataKey="price" radius={[6, 6, 0, 0]} barSize={35}>
              {chartData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
