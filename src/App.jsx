import { useState, useMemo, useEffect } from 'react'
import {
  Sun, Moon, RefreshCw, Table2,
  TrendingUp, TrendingDown, Award, AlertCircle, Wheat, Search as SearchIcon, Globe,
} from 'lucide-react'
import { useCropData } from './hooks/useCropData'
import { useSearch } from './hooks/useSearch'
import { translations } from './i18n/translations'
import { uniqueValues, topN, fmt, colorForState } from './utils/helpers'
import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import PriceCard from './components/PriceCard'
import MarketTable from './components/MarketTable'
import MarketChart from './components/MarketChart'
import StatCard from './components/StatCard'
import StateOverview from './components/StateOverview'
import LoadingSkeleton from './components/LoadingSkeleton'

export default function App() {
  const preferredStates = ['Telangana', 'Andhra Pradesh']
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [lang, setLang] = useState('en')
  const [langOpen, setLangOpen] = useState(false)
  const [view, setView] = useState('card')
  const [filters, setFilters] = useState({ state: '', district: '', commodity: '' })
  const [tempFilters, setTempFilters] = useState(filters)
  const [availableStates, setAvailableStates] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = translations[lang]
  const apiFilters = useMemo(() => ({ state: filters.state }), [filters.state])
  const { data, stateData, loading, error, refetch } = useCropData(apiFilters)
  const search = useSearch()

  const isSearchActive = search.results !== null
  const baseData = isSearchActive ? search.results.records : data
  const activeData = useMemo(() => {
    let result = baseData
    if (filters.state) {
      result = result.filter(r => r.state === filters.state)
    }
    if (filters.district) {
      result = result.filter(r => r.district === filters.district)
    }
    if (filters.commodity) {
      result = result.filter(r => r.commodity === filters.commodity)
    }
    return result
  }, [baseData, filters.state, filters.district, filters.commodity])
  const activeLoading = search.loading || loading
  const activeError = search.error || error

  useEffect(() => {
    const hasNoFilters = !filters.state && !filters.district && !filters.commodity
    if (hasNoFilters && data.length) {
      const nextStates = uniqueValues(data, 'state')
      if (nextStates.length) setAvailableStates(prev => {
        if (prev.length === nextStates.length && prev.every((state, index) => state === nextStates[index])) {
          return prev
        }
        return nextStates
      })
    }
  }, [data, filters.state, filters.district, filters.commodity])

  const states = useMemo(() => {
    const source = availableStates.length
      ? availableStates
      : uniqueValues((data.length ? data : Object.values(stateData).flat()), 'state')
    const merged = [...preferredStates, ...source].filter(Boolean)
    return [...new Set(merged)]
  }, [availableStates, data, stateData])
  const districts = useMemo(() => {
    const selectedState = filters.state || tempFilters.state
    const src = selectedState ? data.filter(r => r.state === selectedState) : data
    return uniqueValues(src, 'district')
  }, [data, filters.state, tempFilters.state])
  const commodities = useMemo(() => {
    const selectedState = filters.state || tempFilters.state
    const selectedDistrict = filters.district || tempFilters.district
    let src = data
    if (selectedState) src = src.filter(r => r.state === selectedState)
    if (selectedDistrict) src = src.filter(r => r.district === selectedDistrict)
    return uniqueValues(src, 'commodity')
  }, [data, filters.state, filters.district, tempFilters.state, tempFilters.district])

  const highest = useMemo(() => topN(activeData, 'modal_price', 1)[0], [activeData])
  const lowest = useMemo(() => [...activeData].sort((a, b) => Number(a.modal_price) - Number(b.modal_price))[0], [activeData])
  const topCommodities = useMemo(() => topN(activeData, 'modal_price', 3), [activeData])

  return (
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
              <div className="relative">
                <button onClick={() => setLangOpen(o => !o)} onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                  <Globe className="w-4 h-4" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden z-50 min-w-[120px]">
                    {[['en', t.languageEn], ['te', t.languageTe], ['hi', t.languageHi]].map(([val, label]) => (
                      <button key={val} onMouseDown={() => { setLang(val); setLangOpen(false) }}
                        className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${lang === val ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                lang={lang}
                t={t}
              />
            <FilterPanel tempFilters={tempFilters} setTempFilters={setTempFilters} onFetch={() => { setFilters(tempFilters) }} states={states} districts={districts} commodities={commodities} t={t} />
            <button onClick={() => setView('table')} className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              <Table2 className="w-4 h-4" />
            </button>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <StatCard icon={TrendingUp} label={t.highestMarket} color="green"
                  value={highest ? fmt(highest.modal_price) : '—'}
                  sub={highest ? `${highest.commodity} · ${highest.market}` : ''} />
                <StatCard icon={TrendingDown} label={t.lowestMarket} color="red"
                  value={lowest ? fmt(lowest.modal_price) : '—'}
                  sub={lowest ? `${lowest.commodity} · ${lowest.market}` : ''} />
                <StatCard icon={Award} label={t.topCommodities} color="orange"
                  value={topCommodities[0]?.commodity || '—'}
                  sub={topCommodities.slice(1).map(c => c.commodity).join(', ')} />
              </div>

              {/* State Overviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filters.state ? (
                  <div className="md:col-span-2">
                    <StateOverview state={filters.state} records={stateData[filters.state] || []} color={colorForState(filters.state) === '#16a34a' ? 'green' : (colorForState(filters.state) === '#2563eb' ? 'blue' : 'green')} t={t} />
                  </div>
                ) : (
                  states.slice(0, 2).map((s, i) => (
                    <StateOverview key={s} state={s} records={stateData[s]} color={i === 0 ? 'green' : 'blue'} t={t} />
                  ))
                )}
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
                      {isSearchActive ? `${t.noResultsFor} "${search.query}"` : t.noData}
                    </p>
                    {isSearchActive && (
                      <p className="text-xs text-gray-400 mt-1">{t.searchHelpText}</p>
                    )}
                  </div>
                ) : view === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeData.slice(0, 60).map((r, i) => <PriceCard key={i} record={r} t={t} />)}
                  </div>
                ) : (
                  <MarketTable data={activeData} t={t} />
                )}
              </div>

            </>
          )}
        </main>

        <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 mt-6">
          {t.dataAttribution}
        </footer>
      </div>
    )
  }
