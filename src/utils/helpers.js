export const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export const trend = (min, max, modal) => {
  const mid = (Number(min) + Number(max)) / 2
  const m = Number(modal)
  return m > mid ? 'up' : m < mid ? 'down' : 'stable'
}

export const uniqueValues = (arr, key) =>
  [...new Set(arr.map(r => r[key]).filter(Boolean))].sort()

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key] || 'Unknown'
    acc[k] = acc[k] || []
    acc[k].push(item)
    return acc
  }, {})

export const topN = (arr, key, n = 5) =>
  [...arr].sort((a, b) => Number(b[key]) - Number(a[key])).slice(0, n)

export const colorForState = (state) => {
  const map = { Telangana: '#16a34a', 'Andhra Pradesh': '#2563eb' }
  return map[state] || '#6b7280'
}
