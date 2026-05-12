import { describe, it, expect } from 'vitest'
import { fmt, uniqueValues, trend } from './helpers'

describe('Helpers: fmt (formatCurrency)', () => {
  it('should format numbers correctly as INR', () => {
    // Note: Depending on environment, result might have non-breaking spaces
    const result = fmt(1500).replace(/\u00A0/g, ' ')
    expect(result).toMatch(/₹\s?1,500/)
  })

  it('should handle zero', () => {
    const result = fmt(0).replace(/\u00A0/g, ' ')
    expect(result).toMatch(/₹\s?0/)
  })
})

describe('Helpers: uniqueValues', () => {
  const mockData = [
    { id: 1, state: 'Telangana', crop: 'Paddy' },
    { id: 2, state: 'Andhra Pradesh', crop: 'Paddy' },
    { id: 3, state: 'Telangana', crop: 'Cotton' },
  ]

  it('should extract unique values for a key', () => {
    const states = uniqueValues(mockData, 'state')
    expect(states).toHaveLength(2)
    expect(states).toContain('Telangana')
    expect(states).toContain('Andhra Pradesh')
  })

  it('should handle empty data', () => {
    expect(uniqueValues([], 'state')).toEqual([])
  })
})

describe('Helpers: trend', () => {
  it('should return up when modal is above mid', () => {
    // mid = (100 + 200) / 2 = 150. Modal 160 > 150
    expect(trend(100, 200, 160)).toBe('up')
  })

  it('should return down when modal is below mid', () => {
    // mid = (100 + 200) / 2 = 150. Modal 140 < 150
    expect(trend(100, 200, 140)).toBe('down')
  })

  it('should return stable when modal is at mid', () => {
    expect(trend(100, 200, 150)).toBe('stable')
  })
})
