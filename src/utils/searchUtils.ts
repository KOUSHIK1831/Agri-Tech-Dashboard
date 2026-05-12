export function debounce(fn, delay) {
  let timer
  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

const SUGGEST_COMMODITIES = [
  'Paddy(Common)',
  'Paddy(Basmati)',
  'Wheat',
  'Maize',
  'Jowar',
  'Bajra',
  'Tur/Arhar',
  'Moong',
  'Urad',
  'Masur Dal',
  'Gram',
  'Groundnut',
  'Mustard',
  'Sunflower',
  'Soyabean',
  'Sesame',
  'Cotton',
  'Sugarcane',
  'Tomato',
  'Onion',
  'Potato',
  'Chilli(Green)',
  'Turmeric',
  'Ginger',
  'Coriander',
  'Garlic',
  'Brinjal',
  'Cabbage',
  'Cauliflower',
  'Lady Finger',
  'Green Peas',
  'Banana - Green',
  'Mango',
  'Orange',
  'Grapes',
  'Apple',
  'Papaya',
  'Coconut',
  'Lemon',
  'Beetroot',
  'Carrot',
  'Rice',
  'Masoor',
  'Rajma',
  'Cucumbar(Kheera)',
  'Bitter Gourd',
  'Pumpkin',
  'Spinach',
  'Drumstick',
  'Amaranthus',
]

const SUGGEST_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Rajasthan',
  'Gujarat',
  'Punjab',
  'Haryana',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Jharkhand',
  'Chhattisgarh',
  'Assam',
]

const SUGGEST_MARKETS = [
  'Bowenpally APMC',
  'Gaddiannaram APMC',
  'Kothapet APMC',
  'Shamshabad APMC',
  'Mahabubnagar APMC',
  'Warangal APMC',
  'Karimnagar APMC',
  'Nizamabad APMC',
  'Khammam APMC',
  'Nalgonda APMC',
  'Siddipet APMC',
  'Sangareddy APMC',
  'L B Nagar APMC',
  'Zaheerabad APMC',
  'Jeedimetla APMC',
  'Kukatpally APMC',
  'Perumbavoor APMC',
  'Kozhikode(Calicut) APMC',
  'Chennai APMC',
  'Kurnool APMC',
  'Guntur APMC',
  'Vijayawada APMC',
  'Visakhapatnam APMC',
]

const SUGGEST_DISTRICTS = [
  'Adilabad',
  'Bhadradri Kothagudem',
  'Hanumakonda',
  'Hyderabad',
  'Jagitial',
  'Jangaon',
  'Jayashankar Bhupalapally',
  'Jogulamba Gadwal',
  'Kamareddy',
  'Karimnagar',
  'Khammam',
  'Mahabubabad',
  'Mahabubnagar',
  'Mancherial',
  'Medak',
  'Medchal Malkajgiri',
  'Mulugu',
  'Nagarkurnool',
  'Nalgonda',
  'Nirmal',
  'Nizamabad',
  'Peddapalli',
  'Rajanna Sircilla',
  'Ranga Reddy',
  'Sangareddy',
  'Siddipet',
  'Suryapet',
  'Vikarabad',
  'Wanaparthy',
  'Warangal',
  'Yadadri Bhuvanagiri',
]

const PRICE_KEYWORDS = [
  'lowest',
  'cheapest',
  'minimum',
  'highest',
  'costliest',
  'maximum',
  'expensive',
]
const LOCATION_KEYWORDS = ['in', 'at', 'from', 'of', 'near', 'nearby']

export {
  SUGGEST_COMMODITIES,
  SUGGEST_STATES,
  SUGGEST_MARKETS,
  SUGGEST_DISTRICTS,
}

export function parseSearchQuery(query) {
  const q = query.trim().toLowerCase()
  if (!q) return {}

  const result = {
    commodity: '',
    state: '',
    district: '',
    market: '',
    sort: '',
  }

  // location extraction: "X in Y" or "X from Y" or "X Y"
  let text = q

  for (const kw of LOCATION_KEYWORDS) {
    const parts = text.split(new RegExp(`\\b${kw}\\b`, 'i'))
    if (parts.length > 1) {
      const locationPart = parts.slice(1).join(' ').trim()
      text = parts[0].trim()

      // check if location part matches state/district/market
      const matchedLocation =
        matchBest(locationPart, SUGGEST_STATES) ||
        matchBest(locationPart, SUGGEST_DISTRICTS) ||
        matchBest(locationPart, SUGGEST_MARKETS)
      if (matchedLocation) {
        if (SUGGEST_STATES.includes(matchedLocation))
          result.state = matchedLocation
        else if (SUGGEST_DISTRICTS.includes(matchedLocation))
          result.district = matchedLocation
        else result.market = matchedLocation
      }
      break
    }
  }

  // price keyword extraction
  for (const kw of PRICE_KEYWORDS) {
    if (text.includes(kw)) {
      if (['lowest', 'cheapest', 'minimum'].includes(kw))
        result.sort = 'min_price'
      else result.sort = 'max_price'
      text = text.replace(kw, '').trim()
      break
    }
  }

  // commodity/market/district matching from remaining text
  const remaining = text || q

  // try exact commodity match first
  const matchedCommodity = matchBest(remaining, SUGGEST_COMMODITIES)
  if (matchedCommodity) {
    result.commodity = matchedCommodity
    return result
  }

  const matchedMarket = matchBest(remaining, SUGGEST_MARKETS)
  if (matchedMarket) {
    result.market = matchedMarket
    return result
  }

  const matchedDistrict = matchBest(remaining, SUGGEST_DISTRICTS)
  if (matchedDistrict) {
    result.district = matchedDistrict
    return result
  }

  const matchedState = matchBest(remaining, SUGGEST_STATES)
  if (matchedState) {
    result.state = matchedState
    return result
  }

  // no specific match - use raw query as commodity fuzzy search
  result.commodity = q
  return result
}

function matchBest(input, list) {
  const words = input.split(/\s+/).filter(Boolean)
  let best = ''
  let bestScore = 0

  for (const item of list) {
    const lower = item.toLowerCase()
    let score = 0
    for (const word of words) {
      if (lower === word) score += 10
      else if (lower.startsWith(word)) score += 5
      else if (lower.includes(word)) score += 3
    }
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }
  return bestScore > 2 ? best : ''
}

export function getSuggestions(query) {
  if (!query || query.trim().length < 1) return []
  const q = query.toLowerCase().trim()

  const results = []

  const score = (val) => {
    const l = val.toLowerCase()
    if (l === q) return 100
    if (l.startsWith(q)) return 50
    if (l.includes(q)) return 20
    const words = q.split(/\s+/)
    for (const w of words) if (l.includes(w)) return 10
    return 0
  }

  const seen = new Set()
  const addIf = (item, type, s) => {
    if (s > 0 && !seen.has(item)) {
      seen.add(item)
      results.push({ text: item, type, score: s })
    }
  }

  for (const c of SUGGEST_COMMODITIES) addIf(c, 'commodity', score(c))
  for (const s of SUGGEST_STATES) addIf(s, 'state', score(s))
  for (const d of SUGGEST_DISTRICTS) addIf(d, 'district', score(d))
  for (const m of SUGGEST_MARKETS) addIf(m, 'market', score(m))

  return results.sort((a, b) => b.score - a.score).slice(0, 8)
}

export function removeDuplicates(records) {
  const seen = new Set()
  return records.filter((r) => {
    const key = `${r.state}|${r.district}|${r.market}|${r.commodity}|${r.variety}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
