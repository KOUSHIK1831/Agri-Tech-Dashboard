import { TrendingUp, TrendingDown, Minus, MapPin, Calendar } from 'lucide-react'
import { fmt, trend } from '../utils/helpers'

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30', label: '↑' },
  down: { icon: TrendingDown, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', label: '↓' },
  stable: { icon: Minus, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30', label: '→' },
}

export default function PriceCard({ record }) {
  const { state, district, market, commodity, variety, min_price, max_price, modal_price, arrival_date } = record
  const t = trendConfig[trend(min_price, max_price)]
  const Icon = t.icon

  return (
    <div className="card p-4 hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">{commodity}</h3>
          {variety && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{variety}</p>}
        </div>
        <span className={`badge ${t.bg} ${t.color} ml-2 shrink-0`}>
          <Icon className="w-3 h-3" /> {t.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
          <p className="font-bold text-sm text-red-600 dark:text-red-400">{fmt(min_price)}</p>
        </div>
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Modal</p>
          <p className="font-bold text-sm text-green-600 dark:text-green-400">{fmt(modal_price)}</p>
        </div>
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
          <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{fmt(max_price)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{market}, {district}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0 ml-1">
          <Calendar className="w-3 h-3" /> {arrival_date}
        </span>
      </div>

      <div className="mt-2">
        <span className={`badge text-xs px-2 py-0.5 rounded-full font-medium ${state === 'Telangana' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
          {state}
        </span>
      </div>
    </div>
  )
}
