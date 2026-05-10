import { useState, useEffect } from 'react'
import { fetchCropPrices, fetchMultipleStates } from '../services/api'

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
        const [main, states] = await Promise.all([
          fetchCropPrices({ ...filters, limit: 500 }),
          fetchMultipleStates(['Telangana', 'Andhra Pradesh']),
        ])
        if (cancelled) return
        setData(main.records)
        setTotal(main.total)
        setStateData(states)
      } catch (e) {
        if (cancelled) return
        console.error('[useCropData] Fetch error:', e)
        setError(e.message || 'Failed to fetch data')
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
