import { fmt, topN } from '../utils/helpers'

export default function StateOverview({ state, records, color, t }) {
  if (!records?.length) return null
  const top5 = topN(records, 'modal_price', 5)
  const avgModal = Math.round(records.reduce((s, r) => s + Number(r.modal_price), 0) / records.length)
  const districts = [...new Set(records.map(r => r.district))].length

  const borderColor = color === 'green' ? 'border-green-500' : 'border-blue-500'
  const bgColor = color === 'green' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
  const textColor = color === 'green' ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
  const badgeColor = color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'

  return (
    <div className={`card p-4 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-base ${textColor}`}>{state}</h3>
        <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{records.length} {t.records}</span>
          <span>{districts} {t.districts}</span>
          <span>{t.avg || 'Avg'}: {fmt(avgModal)}</span>
        </div>
      </div>
      <div className="space-y-2">
        {top5.map((r, i) => (
          <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${bgColor}`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${badgeColor} shrink-0`}>{i + 1}</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{r.commodity}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.market}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className={`font-bold text-sm ${textColor}`}>{fmt(r.modal_price)}</p>
              <p className="text-xs text-gray-400">/Quintal</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
