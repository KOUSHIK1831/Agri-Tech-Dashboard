import { useState, useEffect, useCallback, useRef } from 'react'
import { searchMandi } from '../services/mandiApi'
import { getSuggestions, debounce } from '../utils/searchUtils'

const RECENT_KEY = 'kisan_mandi_recent'
const MAX_RECENT = 8

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch { return [] }
}

function saveRecent(items) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT))) }
  catch { /* ignore */ }
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState(loadRecent)
  const [showDropdown, setShowDropdown] = useState(false)
  const activeQuery = useRef('')
  const inputRef = useRef(null)

  const doSearch = useCallback(async (q) => {
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
      console.log('[useSearch] Results for', trimmed, ':', res.count, 'records')

      // save to recent
      setRecentSearches(prev => {
        const next = [trimmed, ...prev.filter(x => x !== trimmed)].slice(0, MAX_RECENT)
        saveRecent(next)
        return next
      })
    } catch (e) {
      if (activeQuery.current !== trimmed) return
      console.error('[useSearch] Error:', e)
      setError(e.message || 'Search failed')
    } finally {
      if (activeQuery.current === trimmed) setLoading(false)
    }
  }, [])

  const debouncedSearchRef = useRef(null)
  useEffect(() => {
    debouncedSearchRef.current = debounce((q) => doSearch(q), 500)
    return () => debouncedSearchRef.current?.cancel()
  }, [doSearch])

  const updateQuery = useCallback((val) => {
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

  const selectSuggestion = useCallback((text) => {
    setQuery(text)
    setShowDropdown(false)
    doSearch(text)
  }, [doSearch])

  const selectRecent = useCallback((text) => {
    setQuery(text)
    setShowDropdown(false)
    doSearch(text)
  }, [doSearch])

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

  const removeRecent = useCallback((text) => {
    setRecentSearches(prev => {
      const next = prev.filter(x => x !== text)
      saveRecent(next)
      return next
    })
  }, [])

  return {
    query, setQuery: updateQuery,
    results, loading, error,
    suggestions, recentSearches,
    showDropdown, setShowDropdown,
    selectSuggestion, selectRecent,
    clearSearch, retry, clearRecent, removeRecent,
    inputRef,
  }
}
