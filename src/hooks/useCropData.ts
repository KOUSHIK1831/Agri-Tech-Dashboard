import { useQuery } from '@tanstack/react-query'
import { fetchMandiData } from '../services/mandiService'
import { generateFallbackRecords } from '../data/fallback'

const DEFAULT_STATES = ['Telangana', 'Andhra Pradesh']

function ensureStateData(records: any[]) {
  const grouped: Record<string, any[]> = {}

  for (const r of records) {
    const s = r.state || 'Unknown'
    if (!grouped[s]) grouped[s] = []
    grouped[s].push(r)
  }

  // Ensure both preferred states have at least an empty array
  DEFAULT_STATES.forEach((s) => {
    if (!grouped[s]) grouped[s] = []
  })

  // Add Fallback for preferred states if data is sparse
  const fallback = generateFallbackRecords()

  DEFAULT_STATES.forEach((stateName) => {
    if (grouped[stateName]!.length < 10) {
      const existing = new Set(
        grouped[stateName]!.map(
          (x) => `${x.district}|${x.market}|${x.commodity}`
        )
      )
      for (const f of fallback) {
        // Only add if it's the right state (fallback generator should ideally handle this,
        // but for safety we filter here)
        if (f.state === stateName) {
          const key = `${f.district}|${f.market}|${f.commodity}`
          if (!existing.has(key)) {
            grouped[stateName]!.push(f)
            existing.add(key)
          }
        }
      }
    }
  })

  return grouped
}

export function useCropData(filters: any) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['mandiData', filters],
    queryFn: async () => {
      // If no state is selected, fetch both preferred states to ensure visibility
      if (!filters.state) {
        const [tsRes, apRes] = await Promise.all([
          fetchMandiData({ state: 'Telangana', limit: 300 }),
          fetchMandiData({ state: 'Andhra Pradesh', limit: 300 }),
        ])

        return {
          records: [...tsRes.records, ...apRes.records],
          total: tsRes.total + apRes.total,
        }
      }
      return fetchMandiData(filters)
    },
    staleTime: 5 * 60 * 1000,
  })

  const records = data?.records || []
  const stateData = ensureStateData(records)

  return {
    data: records,
    stateData,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    total: data?.total || 0,
    refetch,
  }
}
