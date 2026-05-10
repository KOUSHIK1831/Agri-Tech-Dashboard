import { useState, useMemo } from 'react'
import {
  Sun, Moon, RefreshCw, LayoutGrid, Table2, Sprout,
  TrendingUp, TrendingDown, Award, AlertCircle, Wheat, Search as SearchIcon,
} from 'lucide-react'
import { useCropData } from './hooks/useCropData'
import { useSearch } from './hooks/useSearch'
import { translations } from './i18n/translations'
import { uniqueValues, topN, fmt } from './utils/helpers'
import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import PriceCard from './components/PriceCard'
import MarketTable from './components/MarketTable'
import MarketChart from './components/MarketChart'
import StatCard from './components/StatCard'
import StateOverview from './components/StateOverview'
import FuturePlaceholder from './components/FuturePlaceholder'
import LoadingSkeleton from './components/LoadingSkeleton'

const DEFAULT_STATES = ['Telangana', 'Andhra Pradesh']

export default function App() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('en')
  const [view, setView] = useState('card')
  const [filters, setFilters] = useState({ state: '', district: '', commodity: '' })

  const t = translations[lang]
  const { data, stateData, loading, error, total, refetch } = useCropData(filters)
  const search = useSearch()

  const allData = useMemo(() => {
    const combined = [...data]
    DEFAULT_STATES.forEach(s => {
      if (!filters.state && stateData[s]) {
        stateData[s].forEach(r => { if (!combined.find(c => c === r)) combined.push(r) })
      }
    })
    return combined
  }, [data, stateData, filters.state])

  const isSearchActive = search.results !== null
  const activeData = isSearchActive ? search.results.records : allData
  const activeLoading = search.loading || loading
  const activeError = search.error || error

  const states = useMemo(() => uniqueValues(allData, 'state'), [allData])
  const districts = useMemo(() => {
    const src = filters.state ? allData.filter(r => r.state === filters.state) : allData
    return uniqueValues(src, 'district')
  }, [allData, filters.state])
  const commodities = useMemo(() => uniqueValues(allData, 'commodity'), [allData])

  const highest = useMemo(() => topN(activeData, 'modal_price', 1)[0], [activeData])
  const lowest = useMemo(() => [...activeData].sort((a, b) => Number(a.modal_price) - Number(b.modal_price))[0], [activeData])
  const topCommodities = useMemo(() => topN(activeData, 'modal_price', 3), [activeData])

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* Header */}
        <header className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 dark:from-green-900 dark:via-green-800 dark:to-emerald-700 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wheat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">{t.title}</h1>
                <p className="text-green-100 text-xs hidden sm:block">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(l => l === 'en' ? 'te' : 'en')}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
                {lang === 'en' ? 'తె' : 'EN'}
              </button>
              <button onClick={() => setDark(d => !d)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={refetch}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Sticky Filter Bar */}
        <div className="sticky top-[60px] z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-end">
            <SearchBar
              query={search.query}
              setQuery={search.setQuery}
              loading={search.loading}
              error={search.error}
              suggestions={search.suggestions}
              recentSearches={search.recentSearches}
              showDropdown={search.showDropdown}
              setShowDropdown={search.setShowDropdown}
              selectSuggestion={search.selectSuggestion}
              selectRecent={search.selectRecent}
              clearSearch={search.clearSearch}
              retry={search.retry}
              clearRecent={search.clearRecent}
              removeRecent={search.removeRecent}
              inputRef={search.inputRef}
              placeholder={t.search}
            />
            <FilterPanel filters={filters} setFilters={setFilters} states={states} districts={districts} commodities={commodities} t={t} />
            <div className="flex gap-1 ml-auto">
              <button onClick={() => setView('card')} className={`p-2 rounded-lg transition-all ${view === 'card' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('table')} className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                <Table2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

          {/* Error */}
          {activeError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-sm">{activeError}</span>
              <button onClick={isSearchActive ? search.retry : refetch} className="btn-primary bg-red-600 hover:bg-red-700 text-sm px-3 py-1.5">{t.retry}</button>
            </div>
          )}

          {activeLoading ? <LoadingSkeleton /> : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={TrendingUp} label={t.highestMarket} color="green"
                  value={highest ? fmt(highest.modal_price) : '—'}
                  sub={highest ? `${highest.commodity} · ${highest.market}` : ''} />
                <StatCard icon={TrendingDown} label={t.lowestMarket} color="red"
                  value={lowest ? fmt(lowest.modal_price) : '—'}
                  sub={lowest ? `${lowest.commodity} · ${lowest.market}` : ''} />
                <StatCard icon={Award} label={t.topCommodities} color="orange"
                  value={topCommodities[0]?.commodity || '—'}
                  sub={topCommodities.slice(1).map(c => c.commodity).join(', ')} />
                <StatCard icon={Sprout} label="Total Records" color="purple"
                  value={activeData.length.toLocaleString()}
                  sub={`${states.length} states · ${districts.length} districts`} />
              </div>

              {/* State Overviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StateOverview state="Telangana" records={stateData['Telangana']} color="green" />
                <StateOverview state="Andhra Pradesh" records={stateData['Andhra Pradesh']} color="blue" />
              </div>

              {/* Charts */}
              {activeData.length > 0 && <MarketChart data={activeData} t={t} />}

              {/* Data Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-800 dark:text-white text-base">
                    {activeData.length} {t.records}
                    {isSearchActive && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        for "<span className="font-medium text-green-600 dark:text-green-400">{search.query}</span>"
                        {search.results.filters.commodity && <span className="ml-1">· {search.results.filters.commodity}</span>}
                        {search.results.filters.state && <span className="ml-1">· {search.results.filters.state}</span>}
                        {search.results.filters.district && <span className="ml-1">· {search.results.filters.district}</span>}
                      </span>
                    )}
                  </h2>
                </div>

                {activeData.length === 0 && !activeLoading ? (
                  <div className="card p-12 text-center">
                    <SearchIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {isSearchActive ? `No results found for "${search.query}"` : t.noData}
                    </p>
                    {isSearchActive && (
                      <p className="text-xs text-gray-400 mt-1">Try different keywords like "tomato", "hyderabad", or "rice in telangana"</p>
                    )}
                  </div>
                ) : view === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeData.slice(0, 60).map((r, i) => <PriceCard key={i} record={r} />)}
                  </div>
                ) : (
                  <MarketTable data={activeData} />
                )}
              </div>

              {/* Future Features */}
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white text-base mb-3">🚀 Smart Farming Features</h2>
                <FuturePlaceholder lang={lang} />
              </div>
            </>
          )}
        </main>

        <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 mt-6">
          Data sourced from Government of India Open Data Platform · api.data.gov.in
        </footer>
      </div>
    </div>
  )
}
