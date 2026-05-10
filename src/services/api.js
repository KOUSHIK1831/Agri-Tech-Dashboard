import { queuedFetch } from './apiClient.js'
import { generateFallbackRecords } from '../data/fallback.js'

const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000
const PER_PAGE = 100

async function fetchOnePage(params) {
  console.log('[API] Queuing fetch for:', params.toString())
  try {
    const { data } = await queuedFetch({ params: Object.fromEntries(params) })
    return data
  } catch (err) {
    console.error('[API] Fetch error:', err.message)
    throw err
  }
}

export async function fetchCropPrices({ state = '', district = '', commodity = '', limit = 500 } = {}) {
  const cacheKey = JSON.stringify({ state, district, commodity, limit })
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log('[API] Cache hit:', cacheKey)
    return cached.data
  }

  const baseParams = new URLSearchParams({
    limit: PER_PAGE,
    offset: 0,
  })
  if (state) baseParams.append('filters[state]', state)
  if (district) baseParams.append('filters[district]', district)
  if (commodity) baseParams.append('filters[commodity]', commodity)

  const firstPage = await fetchOnePage(baseParams)
  const total = firstPage.total || 0
  let allRecords = Array.isArray(firstPage.records) ? firstPage.records : []

  if (total > PER_PAGE) {
    // Cap total pages to prevent 429 and slow loads
    const maxPossiblePages = Math.ceil(total / PER_PAGE)
    const requestedPages = Math.ceil(limit / PER_PAGE)
    const maxPages = Math.min(maxPossiblePages, requestedPages, 10) // HARD CAP at 10 pages (1000 records)

    console.log(`[API] Fetching ${maxPages - 1} more pages (Total available: ${total})`)

    for (let i = 1; i < maxPages; i++) {
      const p = new URLSearchParams(baseParams)
      p.set('offset', String(i * PER_PAGE))
      try {
        const page = await fetchOnePage(p)
        if (Array.isArray(page.records)) {
          allRecords = allRecords.concat(page.records)
        }
      } catch (err) {
        // Queue handles 429 retries, but if it still fails or we want to stop
        console.warn('[API] Stopping pagination due to error:', err.message)
        break
      }
    }
  }

  const result = { records: allRecords, total, count: allRecords.length }
  cache.set(cacheKey, { data: result, ts: Date.now() })
  return result
}
