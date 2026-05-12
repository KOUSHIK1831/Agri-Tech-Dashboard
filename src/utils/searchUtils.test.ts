import { describe, it, expect, vi } from 'vitest'
import {
  parseSearchQuery,
  getSuggestions,
  removeDuplicates,
  debounce,
} from './searchUtils'

describe('searchUtils: parseSearchQuery', () => {
  it('should return empty object for empty query', () => {
    expect(parseSearchQuery('')).toEqual({})
  })

  it('should extract state correctly', () => {
    const result = parseSearchQuery('Paddy in Telangana') as any
    expect(result.state).toBe('Telangana')
    expect(result.commodity).toBe('Paddy(Common)') // 'Paddy' matches 'Paddy(Common)' via matchBest
  })

  it('should extract district correctly', () => {
    const result = parseSearchQuery('Onion in Warangal') as any
    expect(result.district).toBe('Warangal')
    expect(result.commodity).toBe('Onion')
  })

  it('should extract price sort keywords', () => {
    const result = parseSearchQuery('cheapest Tomato in Adilabad') as any
    expect(result.sort).toBe('min_price')
    expect(result.commodity).toBe('Tomato')
    expect(result.district).toBe('Adilabad')
  })

  it('should handle raw commodity queries', () => {
    const result = parseSearchQuery('Sugarcane') as any
    expect(result.commodity).toBe('Sugarcane')
  })
})

describe('searchUtils: getSuggestions', () => {
  it('should return empty array for short/empty query', () => {
    expect(getSuggestions('')).toEqual([])
    expect(getSuggestions(' ')).toEqual([])
  })

  it('should return matching commodities', () => {
    const suggestions = getSuggestions('Paddy')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions[0].type).toBe('commodity')
    expect(suggestions[0].text).toContain('Paddy')
  })

  it('should return matching states', () => {
    const suggestions = getSuggestions('Telan')
    expect(suggestions.some((s) => s.text === 'Telangana')).toBe(true)
  })
})

describe('searchUtils: removeDuplicates', () => {
  it('should remove identical records based on key fields', () => {
    const records = [
      {
        state: 'TS',
        district: 'WGL',
        market: 'M1',
        commodity: 'C1',
        variety: 'V1',
        price: 100,
      },
      {
        state: 'TS',
        district: 'WGL',
        market: 'M1',
        commodity: 'C1',
        variety: 'V1',
        price: 200,
      }, // duplicate
      {
        state: 'TS',
        district: 'HYD',
        market: 'M1',
        commodity: 'C1',
        variety: 'V1',
        price: 100,
      }, // unique
    ]
    const cleaned = removeDuplicates(records)
    expect(cleaned).toHaveLength(2)
    expect(cleaned[0].price).toBe(100)
    expect(cleaned[1].district).toBe('HYD')
  })
})

describe('searchUtils: debounce', () => {
  it('should debounce function calls', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(fn).not.toBeCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toBeCalledTimes(1)
    vi.useRealTimers()
  })
})
