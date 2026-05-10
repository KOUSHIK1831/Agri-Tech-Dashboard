import { Filter } from 'lucide-react'

function Select({ label, value, onChange, options, allLabel }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 truncate"
      >
        <option value="">{allLabel}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
export default function FilterPanel({ tempFilters, setTempFilters, onFetch, states, districts, commodities, t }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
        <Filter className="w-4 h-4" /> {t.filters || 'Filters'}
      </div>
      <Select label={t.state} value={tempFilters.state} onChange={v => setTempFilters(f => ({ ...f, state: v, district: '', commodity: '' }))} options={states} allLabel={t.allStates} />
      <Select label={t.district} value={tempFilters.district} onChange={v => setTempFilters(f => ({ ...f, district: v, commodity: '' }))} options={districts} allLabel={t.allDistricts} />
      <Select label={t.commodity} value={tempFilters.commodity} onChange={v => setTempFilters(f => ({ ...f, commodity: v }))} options={commodities} allLabel={t.allCommodities} />
      <div className="flex items-center gap-2 ml-2">
        <button onClick={onFetch} className="btn-primary bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-sm">{t.fetch || 'Fetch'}</button>
      </div>
    </div>
  )
}
