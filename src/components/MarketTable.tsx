import { useTranslation } from 'react-i18next'
import { fmt } from '../utils/helpers'
import { useMemo, useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type SortConfig = {
  key: string
  direction: 'asc' | 'desc' | null
}

export default function MarketTable({ data }: { data: any[] }) {
  const { t } = useTranslation()
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'modal_price',
    direction: 'desc',
  })

  // Calculate averages for heatmap styling
  const priceStats = useMemo(() => {
    if (!data.length) return { modal: 0, min: 0, max: 0 }
    const stats = data.reduce(
      (acc, r) => {
        acc.modal += Number(r.modal_price)
        acc.min += Number(r.min_price)
        acc.max += Number(r.max_price)
        return acc
      },
      { modal: 0, min: 0, max: 0 }
    )

    return {
      modal: stats.modal / data.length,
      min: stats.min / data.length,
      max: stats.max / data.length,
    }
  }, [data])

  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return data

    return [...data].sort((a, b) => {
      const aVal = Number(a[sortConfig.key])
      const bVal = Number(b[sortConfig.key])

      if (sortConfig.direction === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })
  }, [data, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    } else if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = null
    }
    setSortConfig({ key, direction })
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column || !sortConfig.direction)
      return <ArrowUpDown className="w-3 h-3 opacity-30" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-green-500" />
    ) : (
      <ArrowDown className="w-3 h-3 text-green-500" />
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase font-black text-gray-400 bg-gray-50 dark:bg-gray-800 tracking-wider">
            <tr>
              <th className="px-4 py-3">{t('commodity')}</th>
              <th className="px-4 py-3">{t('market')}</th>
              <th className="px-4 py-3">{t('district')}</th>
              <th
                className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => requestSort('min_price')}
              >
                <div className="flex items-center justify-end gap-1">
                  {t('minPrice')}
                  <SortIcon column="min_price" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-orange-600 dark:text-orange-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => requestSort('max_price')}
              >
                <div className="flex items-center justify-end gap-1">
                  {t('maxPrice')}
                  <SortIcon column="max_price" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-green-600 dark:text-green-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => requestSort('modal_price')}
              >
                <div className="flex items-center justify-end gap-1">
                  {t('modalPrice')}
                  <SortIcon column="modal_price" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedData.slice(0, 100).map((r, i) => {
              const modal = Number(r.modal_price)
              const min = Number(r.min_price)
              const max = Number(r.max_price)

              // Row background based on modal price (Farmer Perspective)
              const rowClass =
                modal > priceStats.modal * 1.1
                  ? 'bg-green-50/50 dark:bg-green-900/10'
                  : modal < priceStats.modal * 0.9
                    ? 'bg-red-50/50 dark:bg-red-900/10'
                    : ''

              return (
                <tr
                  key={i}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${rowClass}`}
                >
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                    {r.commodity}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {r.market}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {r.district}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-blue-600 dark:text-blue-400 font-bold">
                    {fmt(r.min_price)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-orange-600 dark:text-orange-400 font-bold">
                    {fmt(r.max_price)}
                  </td>
                  <td className="px-4 py-3 text-right font-black tabular-nums text-green-600 dark:text-green-400">
                    {fmt(r.modal_price)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
