import { useTranslation } from 'react-i18next'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { groupBy } from '../utils/helpers'

export default function MarketPieChart({ data }: { data: any[] }) {
  const { t } = useTranslation()

  const grouped = groupBy(data || [], 'commodity')
  const chartData = Object.keys(grouped)
    .map((name) => ({
      name,
      value: grouped[name].length,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const colors = [
    '#16a34a',
    '#2563eb',
    '#7c3aed',
    '#db2777',
    '#ea580c',
    '#0891b2',
  ]

  if (!data || data.length === 0) return null

  return (
    <div className="card p-6 h-full">
      <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">
        {t('commodityDistribution')}
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
