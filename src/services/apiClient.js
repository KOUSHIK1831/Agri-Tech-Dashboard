import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE
const API_KEY = import.meta.env.VITE_API_KEY

// Global request queue to prevent 429
class RequestQueue {
  constructor(delayMs = 500) {
    this.queue = []
    this.processing = false
    this.delayMs = delayMs
    this.lastRequestTime = 0
    this.pausedUntil = 0
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
      this.process()
    })
  }

  async process() {
    if (this.processing || this.queue.length === 0) return
    this.processing = true

    while (this.queue.length > 0) {
      // Respect pause (from 429)
      const now = Date.now()
      if (now < this.pausedUntil) {
        await new Promise(r => setTimeout(r, this.pausedUntil - now))
      }

      // Respect inter-request delay
      const timeSinceLast = Date.now() - this.lastRequestTime
      if (timeSinceLast < this.delayMs) {
        await new Promise(r => setTimeout(r, this.delayMs - timeSinceLast))
      }

      const { fn, resolve, reject } = this.queue.shift()
      try {
        this.lastRequestTime = Date.now()
        const result = await fn()
        resolve(result)
      } catch (err) {
        if (err.response?.status === 429) {
          const retryAfter = err.response.headers['retry-after']
          const pauseSec = retryAfter ? parseInt(retryAfter, 10) || 5 : 5
          console.warn(`[Queue] 429 detected, pausing for ${pauseSec}s`)
          this.pausedUntil = Date.now() + (pauseSec * 1000)
          // Re-queue this request at the front
          this.queue.unshift({ fn, resolve, reject })
        } else {
          reject(err)
        }
      }
    }

    this.processing = false
  }
}

const queue = new RequestQueue(600) // 0.6s delay between requests

const client = axios.create({
  baseURL: BASE,
  params: {
    'api-key': API_KEY,
    format: 'json'
  }
})

export async function queuedFetch(config) {
  return queue.add(() => client(config))
}

export default client
