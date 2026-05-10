import { useState, useEffect } from 'react'
import { fetchCropPrices } from '../services/api'
import { generateFallbackRecords } from '../data/fallback.js'

const DEFAULT_STATES = ['Telangana', 'Andhra Pradesh']

function splitByState(records) {
  const grouped = {}
  for (const r of records) {
    const s = r.state || 'Unknown'
    if (!grouped[s]) grouped[s] = []
    grouped[s].push(r)
  }
  DEFAULT_STATES.forEach(s => { if (!grouped[s]) grouped[s] = [] })
  return grouped
}

function ensureStateData(records) {
  const stateData = splitByState(records)
  if (stateData['Telangana'].length < 20) {
    const fallback = generateFallbackRecords()
    const existing = new Set(stateData['Telangana'].map(x => `${x.district}|${x.market}|${x.commodity}`))
    for (const f of fallback) {
      const key = `${f.district}|${f.market}|${f.commodity}`
      if (!existing.has(key)) {
        stateData['Telangana'].push(f)
        existing.add(key)
      }
    }
  }
  return stateData
}

export function useCropData(filters) {
  const [data, setData] = useState([])
  const [stateData, setStateData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const main = await fetchCropPrices(filters)
        if (cancelled) return
        setData(main.records)
        setTotal(main.total)
        setStateData(ensureStateData(main.records))
      } catch (e) {
        if (cancelled) return
        console.error('[useCropData] Fetch error:', e)
        setError(e.message || 'Failed to fetch data')
        if (!filters.state) {
          const fallback = generateFallbackRecords()
          setData(fallback)
          setStateData({ Telangana: fallback, 'Andhra Pradesh': [] })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), refreshKey])

  return { data, stateData, loading, error, total, refetch: () => setRefreshKey(k => k + 1) }
}
