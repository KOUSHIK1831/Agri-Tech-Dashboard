import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { fmt } from '../utils/helpers'

const COLS = [
  { key: 'commodity', label: 'Commodity' },
  { key: 'variety', label: 'Variety' },
  { key: 'market', label: 'Market' },
  { key: 'district', label: 'District' },
  { key: 'state', label: 'State' },
  { key: 'min_price', label: 'Min ₹', num: true },
  { key: 'modal_price', label: 'Modal ₹', num: true },
  { key: 'max_price', label: 'Max ₹', num: true },
  { key: 'arrival_date', label: 'Date' },
]

const PAGE_SIZE = 15

export default function MarketTable({ data }) {
  const [sort, setSort] = useState({ key: 'modal_price', dir: 'desc' })
  const [page, setPage] = useState(1)

  const sorted = [...data].sort((a, b) => {
    const av = sort.key in { min_price: 1, max_price: 1, modal_price: 1 } ? Number(a[sort.key]) : a[sort.key] || ''
    const bv = sort.key in { min_price: 1, max_price: 1, modal_price: 1 } ? Number(b[sort.key]) : b[sort.key] || ''
    return sort.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })

  const pages = Math.ceil(sorted.length / PAGE_SIZE)
  const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {COLS.map(c => (
                <th key={c.key} onClick={() => toggleSort(c.key)}
                  className="px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap select-none">
                  <span className="flex items-center gap-1">
                    {c.label}
                    {sort.key === c.key ? (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-white whitespace-nowrap">{r.commodity}</td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{r.variety || '—'}</td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">{r.market}</td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{r.district}</td>
                <td className="px-3 py-2.5">
                  <span className={`badge px-2 py-0.5 rounded-full text-xs font-medium ${r.state === 'Telangana' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                    {r.state}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-red-600 dark:text-red-400 font-medium">{fmt(r.min_price)}</td>
                <td className="px-3 py-2.5 text-green-600 dark:text-green-400 font-bold">{fmt(r.modal_price)}</td>
                <td className="px-3 py-2.5 text-blue-600 dark:text-blue-400 font-medium">{fmt(r.max_price)}</td>
                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.arrival_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500">{data.length} records · Page {page}/{pages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
              ← Prev
            </button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-3 py-1 rounded-lg text-sm border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
