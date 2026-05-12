import { useTranslation } from 'react-i18next'
import {
  MapPin,
  Building2,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { fmt } from '../utils/helpers'

export default function PriceCard({ record, t: _t }: any) {
  const { t } = useTranslation()
  const price = Number(record.modal_price)
  const isHigh = price > 5000
  const isLow = price < 1500

  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-green-500 overflow-hidden relative">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-green-500" />
              {record.commodity}
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {record.variety}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-green-600 dark:text-green-400 leading-none">
              {fmt(record.modal_price)}
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
              {t('perQuintal')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                <MapPin className="w-3 h-3 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">
                  {t('state')}
                </p>
                <p className="text-xs font-semibold truncate">{record.state}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg shrink-0">
                <Building2 className="w-3 h-3 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">
                  {t('district')}
                </p>
                <p className="text-xs font-semibold truncate">
                  {record.district}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg shrink-0">
                <Building2 className="w-3 h-3 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">
                  {t('market')}
                </p>
                <p className="text-xs font-semibold truncate">
                  {record.market}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg shrink-0">
                <Calendar className="w-3 h-3 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">
                  {t('arrivalDate')}
                </p>
                <p className="text-xs font-semibold truncate">
                  {record.arrival_date}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-4">
          <div>
            <p className="text-[9px] uppercase font-bold text-gray-400">
              {t('minPrice')}
            </p>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
              {fmt(record.min_price)}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-gray-400">
              {t('maxPrice')}
            </p>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
              {fmt(record.max_price)}
            </p>
          </div>
        </div>
        {isHigh ? (
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        ) : isLow ? (
          <ArrowDownRight className="w-4 h-4 text-blue-500" />
        ) : null}
      </div>
    </div>
  )
}
