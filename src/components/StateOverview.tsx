import { useTranslation } from 'react-i18next'
import { TrendingUp, MapPin, Building2 } from 'lucide-react'
import { fmt, topN } from '../utils/helpers'

export default function StateOverview({
  state,
  records = [],
  color = 'green',
  t: _t,
}: any) {
  const { t } = useTranslation()
  const topRecords = topN(records, 'modal_price', 3)

  const colors: any = {
    green: {
      bg: 'bg-green-600',
      light: 'bg-green-50 dark:bg-green-900/10',
      text: 'text-green-600 dark:text-green-400',
    },
    blue: {
      bg: 'bg-blue-600',
      light: 'bg-blue-50 dark:bg-blue-900/10',
      text: 'text-blue-600 dark:text-blue-400',
    },
  }

  const c = colors[color] || colors.green

  return (
    <div className="card overflow-hidden group">
      <div className={`${c.bg} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-bold text-lg">{state}</h2>
        </div>
        <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2 py-1 rounded-full uppercase tracking-widest">
          {records.length} {t('records')}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          {t('highestMarket')}
        </p>

        <div className="space-y-2">
          {topRecords.map((r: any, i: number) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 ${c.light} rounded-2xl group/item hover:scale-[1.01] transition-transform`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-gray-400 shadow-sm border border-gray-100 dark:border-gray-700">
                  #{i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">
                    {r.commodity}
                  </p>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Building2 className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{r.market}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${c.text}`}>
                  {fmt(r.modal_price)}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                  {t('perQuintal')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
