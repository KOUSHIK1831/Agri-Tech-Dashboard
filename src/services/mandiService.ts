import axios from 'axios'
import { queuedFetch } from './apiClient'
import { parseSearchQuery, removeDuplicates } from '../utils/searchUtils'

const PER_PAGE = 500

export const fetchMandiData = async ({
  state = '',
  district = '',
  commodity = '',
  limit = 500,
} = {}) => {
  const params: any = {
    limit: Math.min(limit, PER_PAGE),
    offset: 0,
  }
  if (state) params['filters[state]'] = state
  if (district) params['filters[district]'] = district
  if (commodity) params['filters[commodity]'] = commodity

  const { data: firstPage } = await queuedFetch({ params })
  const total = firstPage.total || 0
  let records = Array.isArray(firstPage.records) ? firstPage.records : []

  if (total > records.length && records.length < limit) {
    const remainingToFetch = limit - records.length
    const additionalPages = Math.min(Math.ceil(remainingToFetch / PER_PAGE), 2) // Cap at 2 more pages for speed

    for (let i = 1; i <= additionalPages; i++) {
      const { data: page } = await queuedFetch({
        params: { ...params, offset: i * PER_PAGE, limit: PER_PAGE },
      })
      if (Array.isArray(page.records)) {
        records = [...records, ...page.records]
      }
    }
  }

  return { records, total, count: records.length }
}

export const searchMandi = async (query: string) => {
  if (!query || !query.trim()) {
    return { records: [], total: 0, count: 0, filters: {}, query: '' }
  }

  const filters = parseSearchQuery(query.trim())
  const data = await fetchMandiData({ ...filters, limit: 1000 })
  const records = removeDuplicates(data.records)

  return {
    ...data,
    records,
    count: records.length,
    filters,
    query: query.trim(),
  }
}
