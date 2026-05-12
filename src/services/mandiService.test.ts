import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchMandiData, searchMandi } from './mandiService'
import * as apiClient from './apiClient'

vi.mock('./apiClient', () => ({
  queuedFetch: vi.fn(),
  default: {
    create: vi.fn(),
  },
}))

describe('mandiService: fetchMandiData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch data with correct params', async () => {
    const mockResponse = {
      data: {
        total: 1, // Match length to avoid extra page fetch
        records: [{ state: 'Telangana', commodity: 'Paddy' }],
      },
    }
    ;(apiClient.queuedFetch as any).mockResolvedValue(mockResponse)

    const result = await fetchMandiData({ state: 'Telangana', limit: 10 })

    expect(apiClient.queuedFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          'filters[state]': 'Telangana',
          limit: 10,
        }),
      })
    )
    expect(result.records).toHaveLength(1)
    expect(result.total).toBe(1)
  })

  it('should handle pagination if total is more than first page', async () => {
    const firstPage = {
      data: {
        total: 1000,
        records: new Array(500).fill({
          state: 'TS',
          district: 'D1',
          market: 'M1',
          commodity: 'C1',
          variety: 'V1',
        }),
      },
    }
    const secondPage = {
      data: {
        total: 1000,
        records: new Array(500).fill({
          state: 'TS',
          district: 'D2',
          market: 'M2',
          commodity: 'C2',
          variety: 'V2',
        }),
      },
    }
    ;(apiClient.queuedFetch as any)
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage)

    const result = await fetchMandiData({ limit: 1000 })

    expect(apiClient.queuedFetch).toHaveBeenCalledTimes(2)
    expect(result.records).toHaveLength(1000)
  })
})

describe('mandiService: searchMandi', () => {
  it('should return empty result for empty query', async () => {
    const result = await searchMandi('')
    expect(result.records).toEqual([])
  })

  it('should parse query and fetch data', async () => {
    const mockResponse = {
      data: {
        total: 1,
        records: [
          {
            state: 'Telangana',
            commodity: 'Paddy(Common)',
            district: 'D1',
            market: 'M1',
            variety: 'V1',
          },
        ],
      },
    }
    ;(apiClient.queuedFetch as any).mockResolvedValue(mockResponse)

    const result = (await searchMandi('Paddy in Telangana')) as any

    expect(result.filters.state).toBe('Telangana')
    expect(result.records).toHaveLength(1)
  })
})
