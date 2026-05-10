import { queuedFetch } from './apiClient.js'
import { parseSearchQuery, removeDuplicates } from '../utils/searchUtils'

const PER_PAGE = 100
const cache = new Map()
const CACHE_TTL = 2 * 60 * 1000

async function fetchPage(params) {
  console.log('[mandiApi] Queuing fetch for:', params.toString())
  try {
    const { data } = await queuedFetch({ params: Object.fromEntries(params) })
    return data
  } catch (err) {
    console.error('[mandiApi] Fetch error:', err.message)
    throw err
  }
}

function buildSearchParams(filters) {
  const p = new URLSearchParams({
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
  const params = buildSearchParams(filters)
  const cacheKey = params.toString()

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log('[mandiApi] Cache hit:', cacheKey)
    return { ...cached.data, filters, query: trimmed }
  }

  try {
    const data = await fetchPage(params)
    let records = Array.isArray(data.records) ? data.records : []
    const total = data.total || 0

    // paginate if more records - SEQUENTIAL via queue
    if (total > PER_PAGE) {
      const maxPages = Math.min(Math.ceil(total / PER_PAGE), 10)
      for (let i = 1; i < maxPages; i++) {
        const p = new URLSearchParams(params)
        p.set('offset', String(i * PER_PAGE))
        try {
          const page = await fetchPage(p)
          if (Array.isArray(page.records)) {
            records = records.concat(page.records)
          }
        } catch (err) {
          console.warn('[mandiApi] Pagination stopped:', err.message)
          break
        }
      }
    }

    records = removeDuplicates(records)
    const result = { records, total, count: records.length, filters, query: trimmed }
    cache.set(cacheKey, { data: result, ts: Date.now() })
    return result
  } catch (err) {
    console.error('[mandiApi] Search failed:', err)
    throw new Error(`Search failed: ${err.message}`, { cause: err })
  }
}
