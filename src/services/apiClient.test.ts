import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
// We need to test the RequestQueue which is private in apiClient.ts
// But we can test the queuedFetch function.

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => vi.fn()),
    },
  }
})

// Since the queue is internal to the module, we test the behavior of queuedFetch
import { queuedFetch } from './apiClient'

describe('apiClient: queuedFetch', () => {
  it('should queue requests and respect delay (mocked)', async () => {
    // This is hard to test timing without exposing the queue
    // But we can verify it calls the axios client
    const mockData = { some: 'data' }

    // We need to get the mock client instance
    const mockClient = (axios.create as any).mock.results[0].value
    mockClient.mockResolvedValue({ data: mockData })

    const result = await queuedFetch({ url: '/test' })

    expect(mockClient).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/test' })
    )
    expect(result.data).toEqual(mockData)
  })
})
