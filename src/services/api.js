import axios from 'axios'
import { generateFallbackRecords } from '../data/fallback.js'

const BASE = import.meta.env.VITE_API_BASE
const API_KEY = import.meta.env.VITE_API_KEY

const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000
const PER_PAGE = 10

async function fetchOnePage(params) {
  const url = `${BASE}?${params.toString()}`
  console.log('[API] Fetching:', url)

  let attempts = 0
  while (attempts < 2) {
    try {
      const { data } = await axios.get(url)
      return data
    } catch (err) {
      attempts++
      console.error(`[API] Attempt ${attempts}/2 failed:`, err.message)
      if (err.response) console.error('[API] Status:', err.response.status, err.response.data)
      else if (err.request) console.error('[API] No response - possible CORS/network issue')
      if (attempts >= 2) throw new Error(`API failed: ${err.message}`, { cause: err })
      await new Promise(r => setTimeout(r, 1000))
    }
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
    'api-key': API_KEY,
    format: 'json',
    limit: PER_PAGE,
    offset: 0,
  })
  if (state) baseParams.append('filters[state]', state)
  if (district) baseParams.append('filters[district]', district)
  if (commodity) baseParams.append('filters[commodity]', commodity)

  const firstPage = await fetchOnePage(baseParams)
  console.log('[API] First page raw:', JSON.stringify(firstPage, null, 2).slice(0, 500))

  const total = firstPage.total || 0
  let allRecords = Array.isArray(firstPage.records) ? firstPage.records : []

  if (total > PER_PAGE) {
    const maxPages = Math.min(Math.ceil(total / PER_PAGE), Math.ceil(limit / PER_PAGE), 30)
    const offsets = []
    for (let i = 1; i < maxPages; i++) offsets.push(i * PER_PAGE)

    console.log(`[API] Fetching ${offsets.length} more pages (total: ${total}, max: ${maxPages * PER_PAGE})`)

    const pages = await Promise.allSettled(
      offsets.map(async (off) => {
        const p = new URLSearchParams(baseParams)
        p.set('offset', String(off))
        return fetchOnePage(p)
      })
    )

    for (const result of pages) {
      if (result.status === 'fulfilled' && Array.isArray(result.value.records)) {
        allRecords = allRecords.concat(result.value.records)
      } else if (result.status === 'rejected') {
        console.error('[API] Page failed:', result.reason?.message)
      }
    }
  }

  const result = { records: allRecords, total, count: allRecords.length }
  console.log(`[API] Final: ${result.count} records (total in dataset: ${result.total})`)
  cache.set(cacheKey, { data: result, ts: Date.now() })
  return result
}

export async function fetchMultipleStates(states = ['Telangana', 'Andhra Pradesh']) {
  const results = await Promise.allSettled(
    states.map(s => fetchCropPrices({ state: s, limit: 200 }))
  )
  return results.reduce((acc, r, i) => {
    const stateName = states[i]
    if (r.status === 'fulfilled') {
      let records = r.value.records
      console.log(`[API] ${stateName}: ${records.length} API records`)
      if (records.length < 20 && stateName === 'Telangana') {
        const fallback = generateFallbackRecords()
        const existing = new Set(records.map(x => `${x.district}|${x.market}|${x.commodity}`))
        for (const f of fallback) {
          const key = `${f.district}|${f.market}|${f.commodity}`
          if (!existing.has(key)) {
            records.push(f)
            existing.add(key)
          }
        }
        console.log(`[API] Supplemented Telangana fallback -> ${records.length} records`)
      }
      acc[stateName] = records
    } else {
      console.error(`[API] Failed for ${stateName}:`, r.reason)
      if (stateName === 'Telangana') {
        acc[stateName] = generateFallbackRecords()
        console.log(`[API] Used fallback data for Telangana: ${acc[stateName].length} records`)
      } else {
        acc[stateName] = []
      }
    }
    return acc
  }, {})
}
