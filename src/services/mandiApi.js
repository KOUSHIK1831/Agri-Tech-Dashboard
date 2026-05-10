import axios from 'axios'
import { parseSearchQuery, removeDuplicates } from '../utils/searchUtils'

const BASE = import.meta.env.VITE_API_BASE
const API_KEY = import.meta.env.VITE_API_KEY
const PER_PAGE = 10
const cache = new Map()
const CACHE_TTL = 2 * 60 * 1000

async function fetchPage(params) {
  const url = `${BASE}?${params.toString()}`
  console.log('[mandiApi] Fetching:', url)

  const { data } = await axios.get(url)
  return data
}

function buildSearchParams(filters) {
  const p = new URLSearchParams({
    'api-key': API_KEY,
    format: 'json',
    limit: PER_PAGE,
    offset: 0,
  })
  if (filters.commodity) p.append('filters[commodity]', filters.commodity)
  if (filters.state) p.append('filters[state]', filters.state)
  if (filters.district) p.append('filters[district]', filters.district)
  if (filters.market) p.append('filters[market]', filters.market)
  return p
}

export async function searchMandi(query) {
  if (!query || !query.trim()) {
    return { records: [], total: 0, count: 0, filters: {}, query: '' }
  }

  const trimmed = query.trim()
  console.log('[mandiApi] Search query:', trimmed)

  const filters = parseSearchQuery(trimmed)
  console.log('[mandiApi] Parsed filters:', filters)

  const params = buildSearchParams(filters)
  const cacheKey = params.toString()

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log('[mandiApi] Cache hit:', cacheKey)
    return { ...cached.data, filters, query: trimmed }
  }

  let attempts = 0
  while (attempts < 2) {
    try {
      const data = await fetchPage(params)
      console.log('[mandiApi] API response:', JSON.stringify(data).slice(0, 300))

      let records = Array.isArray(data.records) ? data.records : []
      const total = data.total || 0

      // paginate if more records
      if (total > PER_PAGE) {
        const maxPages = Math.min(Math.ceil(total / PER_PAGE), 10)
        const offsets = []
        for (let i = 1; i < maxPages; i++) offsets.push(i * PER_PAGE)

        const pages = await Promise.allSettled(
          offsets.map(async off => {
            const p = new URLSearchParams(params)
            p.set('offset', String(off))
            return fetchPage(p)
          })
        )
        for (const r of pages) {
          if (r.status === 'fulfilled' && Array.isArray(r.value.records)) {
            records = records.concat(r.value.records)
          }
        }
      }

      records = removeDuplicates(records)
      console.log(`[mandiApi] Got ${records.length} records`)

      const result = { records, total, count: records.length, filters, query: trimmed }
      cache.set(cacheKey, { data: result, ts: Date.now() })
      return result
    } catch (err) {
      attempts++
      console.error(`[mandiApi] Attempt ${attempts}/2 failed:`, err.message)
      if (err.response) console.error('[mandiApi] Status:', err.response.status, err.response.data)
      else if (err.request) console.error('[mandiApi] No response - network/CORS')
      if (attempts >= 2) throw new Error(`Search failed: ${err.message}`, { cause: err })
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

export async function fetchAllStates() {
  const params = new URLSearchParams({
    'api-key': API_KEY,
    format: 'json',
    limit: 1,
    offset: 0,
  })
  try {
    const data = await fetchPage(params)
    if (data && Array.isArray(data.records) && data.records.length > 0) {
      const records = data.records
      return [...new Set(records.map(r => r.state).filter(Boolean))]
    }
  } catch (e) {
    console.error('[mandiApi] fetchAllStates error:', e)
  }
  return []
}
