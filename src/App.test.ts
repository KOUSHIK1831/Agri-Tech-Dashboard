import { describe, it, expect } from 'vitest'

describe('Basic Math Test', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2)
  })
})

describe('Environment Test', () => {
  it('should have access to project name', () => {
    expect(true).toBe(true)
  })
})
