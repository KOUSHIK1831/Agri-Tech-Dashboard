import { useState, useEffect, useCallback, useRef } from 'react'
import { searchMandi } from '../services/mandiService'
import { getSuggestions, debounce } from '../utils/searchUtils'

const RECENT_KEY = 'kisan_mandi_recent'
const MAX_RECENT = 8

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecent(items: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)))
  } catch {
    /* ignore */
  }
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecent)
  const [showDropdown, setShowDropdown] = useState(false)
  const activeQuery = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)

  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) {
      setResults(null)
      setError(null)
      setLoading(false)
      return
    }

    activeQuery.current = trimmed
    setLoading(true)
    setError(null)

    try {
      const res = await searchMandi(trimmed)
      if (activeQuery.current !== trimmed) return
      setResults(res)

      setRecentSearches((prev) => {
        const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(
          0,
          MAX_RECENT
        )
        saveRecent(next)
        return next
      })
    } catch (e: any) {
      if (activeQuery.current !== trimmed) return
      setError(e.message || 'Search failed')
    } finally {
      if (activeQuery.current === trimmed) setLoading(false)
    }
  }, [])

  const debouncedSearchRef = useRef<any>(null)
  useEffect(() => {
    debouncedSearchRef.current = debounce((q: string) => doSearch(q), 500)
    return () => debouncedSearchRef.current?.cancel()
  }, [doSearch])

  const updateQuery = useCallback((val: string) => {
    setQuery(val)
    const trimmed = val.trim()

    if (trimmed) {
      const s = getSuggestions(trimmed)
      setSuggestions(s)
      setShowDropdown(s.length > 0)
      debouncedSearchRef.current?.(val)
    } else {
      setSuggestions([])
      setShowDropdown(false)
      setResults(null)
      setError(null)
      setLoading(false)
    }
  }, [])

  const selectSuggestion = useCallback(
    (text: string) => {
      setQuery(text)
      setShowDropdown(false)
      doSearch(text)
    },
    [doSearch]
  )

  const selectRecent = useCallback(
    (text: string) => {
      setQuery(text)
      setShowDropdown(false)
      doSearch(text)
    },
    [doSearch]
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults(null)
    setError(null)
    setSuggestions([])
    setShowDropdown(false)
    setLoading(false)
    activeQuery.current = ''
    inputRef.current?.focus()
  }, [])

  const retry = useCallback(() => {
    if (query.trim()) doSearch(query)
  }, [query, doSearch])

  const clearRecent = useCallback(() => {
    setRecentSearches([])
    saveRecent([])
  }, [])

  const removeRecent = useCallback((text: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((x) => x !== text)
      saveRecent(next)
      return next
    })
  }, [])

  return {
    query,
    setQuery: updateQuery,
    results,
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
  }
}
