import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const BASE = import.meta.env.VITE_API_BASE
const API_KEY = import.meta.env.VITE_API_KEY

class RequestQueue {
  private queue: Array<{
    fn: () => Promise<any>
    resolve: (v: any) => void
    reject: (e: any) => void
  }> = []
  private processing = false
  private delayMs: number
  private lastRequestTime = 0
  private pausedUntil = 0

  constructor(delayMs = 500) {
    this.delayMs = delayMs
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return
    this.processing = true

    while (this.queue.length > 0) {
      const now = Date.now()
      if (now < this.pausedUntil) {
        await new Promise((r) => setTimeout(r, this.pausedUntil - now))
      }

      const timeSinceLast = Date.now() - this.lastRequestTime
      if (timeSinceLast < this.delayMs) {
        await new Promise((r) => setTimeout(r, this.delayMs - timeSinceLast))
      }

      const item = this.queue.shift()
      if (!item) continue
      const { fn, resolve, reject } = item

      try {
        this.lastRequestTime = Date.now()
        const result = await fn()
        resolve(result)
      } catch (err: any) {
        if (err.response?.status === 429) {
          const retryAfter = err.response.headers['retry-after']
          const pauseSec = retryAfter ? parseInt(retryAfter, 10) || 5 : 5
          console.warn(`[Queue] 429 detected, pausing for ${pauseSec}s`)
          this.pausedUntil = Date.now() + pauseSec * 1000
          this.queue.unshift({ fn, resolve, reject })
        } else {
          reject(err)
        }
      }
    }

    this.processing = false
  }
}

const queue = new RequestQueue(400)

const client = axios.create({
  baseURL: BASE,
  params: {
    'api-key': API_KEY,
    format: 'json',
  },
})

export async function queuedFetch<T = any>(
  config: AxiosRequestConfig
): Promise<{ data: T }> {
  return queue.add(() => client(config))
}

export default client
