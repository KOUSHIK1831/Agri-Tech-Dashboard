import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  X,
  Loader2,
  Clock,
  TrendingUp,
  MapPin,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { useVoiceSearch } from '../hooks/useVoiceSearch'

export default function SearchBar({
  query,
  setQuery,
  loading,
  error,
  suggestions,
  recentSearches,
  showDropdown,
  setShowDropdown,
  selectSuggestion,
  selectRecent,
  clearSearch,
  retry,
  clearRecent,
  removeRecent,
  inputRef,
  placeholder,
  lang,
  t: _t,
}: any) {
  const { t } = useTranslation()
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const combined = useMemo(
    () => [
      ...(recentSearches.length > 0 && !query
        ? [{ type: 'header', text: t('recentSearches') }]
        : []),
      ...(query
        ? []
        : recentSearches.map((item: string) => ({
            type: 'recent',
            text: item,
          }))),
      ...(suggestions.length > 0
        ? [{ type: 'header', text: t('suggestions') }]
        : []),
      ...suggestions.map((s: any) => ({ kind: 'suggestion', ...s })),
    ],
    [recentSearches, query, suggestions, t]
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [setShowDropdown])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown || combined.length === 0) {
        if (e.key === 'Enter' && query.trim()) {
          setShowDropdown(false)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((i) => Math.min(i + 1, combined.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0) {
            const item = combined[focusedIndex]
            if (item.type === 'header') return
            if (item.type === 'recent') selectRecent(item.text)
            else if (item.kind === 'suggestion') selectSuggestion(item.text)
          } else if (query.trim()) {
            setShowDropdown(false)
          }
          break
        case 'Escape':
          setShowDropdown(false)
          break
      }
    },
    [
      showDropdown,
      combined,
      focusedIndex,
      query,
      selectSuggestion,
      selectRecent,
      setShowDropdown,
    ]
  )

  const TYPE_ICONS: any = {
    commodity: TrendingUp,
    state: MapPin,
    district: MapPin,
    market: Building2,
  }

  const TYPE_COLORS: any = {
    commodity: 'text-green-600 dark:text-green-400',
    state: 'text-blue-600 dark:text-blue-400',
    district: 'text-purple-600 dark:text-purple-400',
    market: 'text-orange-600 dark:text-orange-400',
  }

  return (
    <div className="relative flex-1 min-w-0" ref={dropdownRef}>
      <div className="relative">
        {loading ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (
              (suggestions.length > 0 || recentSearches.length > 0) &&
              query.trim()
            ) {
              setShowDropdown(true)
            } else if (recentSearches.length > 0 && !query) {
              setShowDropdown(true)
            }
          }}
          placeholder={placeholder || t('search')}
          className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {error && (
            <button
              onClick={retry}
              title={t('retryTooltip')}
              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <Loader2 className="w-3.5 h-3.5" />
            </button>
          )}
          {query && (
            <button
              onClick={clearSearch}
              title={t('clearTooltip')}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && combined.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {combined.map((item: any, i: number) => {
            if (item.type === 'header') {
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50"
                >
                  <span>{item.text}</span>
                  {item.text === t('recentSearches') &&
                    recentSearches.length > 0 && (
                      <button
                        onClick={clearRecent}
                        className="text-red-400 hover:text-red-500"
                      >
                        {t('clearTooltip')}
                      </button>
                    )}
                </div>
              )
            }
            if (item.type === 'recent') {
              return (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                    i === focusedIndex
                      ? 'bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => selectRecent(item.text)}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="flex-1 truncate">{item.text}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRecent(item.text)
                    }}
                    className="p-0.5 text-gray-300 hover:text-red-500 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </button>
              )
            }
            if (item.kind === 'suggestion') {
              const Icon = TYPE_ICONS[item.type] || Search
              const color = TYPE_COLORS[item.type] || 'text-gray-500'
              return (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                    i === focusedIndex
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => selectSuggestion(item.text)}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                  <span className="flex-1 truncate text-gray-900 dark:text-white">
                    {item.text}
                  </span>
                  <span className="text-xs capitalize text-gray-400">
                    {item.type}
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                </button>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
