const today = new Date().toLocaleDateString('en-GB')

const MARKETS: Record<string, string[]> = {
  // Telangana Districts
  Adilabad: ['Adilabad APMC', 'Basar APMC', 'Boath APMC'],
  Hyderabad: ['Bowenpally APMC', 'Gaddiannaram APMC', 'Jeedimetla APMC'],
  Karimnagar: ['Karimnagar APMC', 'Sircilla APMC', 'Choppadandi APMC'],
  Khammam: ['Khammam APMC', 'Sathupally APMC', 'Madhira APMC'],
  Mahabubnagar: ['Mahabubnagar APMC', 'Badepalli APMC', 'Jadcherla APMC'],
  Nizamabad: ['Nizamabad APMC', 'Armoor APMC', 'Bodhan APMC'],
  Warangal: ['Warangal APMC', 'Narsampet APMC', 'Wardhannapet APMC'],
  Siddipet: ['Siddipet APMC', 'Husnabad APMC', 'Gajwel APMC'],

  // Andhra Pradesh Districts
  Anantapur: ['Anantapur APMC', 'Hindupur APMC', 'Gooty APMC'],
  Chittoor: ['Chittoor APMC', 'Madanapalle APMC', 'Palamaner APMC'],
  'East Godavari': ['Kakinada APMC', 'Rajahmundry APMC', 'Amalapuram APMC'],
  Guntur: ['Guntur APMC', 'Tenali APMC', 'Narasaraopet APMC'],
  Krishna: ['Vijayawada APMC', 'Machilipatnam APMC', 'Gudivada APMC'],
  Kurnool: ['Kurnool APMC', 'Adoni APMC', 'Nandyal APMC'],
  Nellore: ['Nellore APMC', 'Gudur APMC', 'Kavali APMC'],
  Prakasam: ['Ongole APMC', 'Chirala APMC', 'Markapur APMC'],
  Srikakulam: ['Srikakulam APMC', 'Palasa APMC', 'Ichapuram APMC'],
  Visakhapatnam: [
    'Visakhapatnam APMC',
    'Anakapalle APMC',
    'Bheemunipatnam APMC',
  ],
  Vizianagaram: [
    'Visakhapatnam APMC',
    'Anakapalle APMC',
    'Bheemunipatnam APMC',
  ],
  'West Godavari': ['Eluru APMC', 'Bhimavaram APMC', 'Tadepalligudem APMC'],
  'YSR Kadapa': ['Kadapa APMC', 'Proddatur APMC', 'Rayachoti APMC'],
}

// Map districts to states
const STATE_MAP: Record<string, string> = {
  Anantapur: 'Andhra Pradesh',
  Chittoor: 'Andhra Pradesh',
  'East Godavari': 'Andhra Pradesh',
  Guntur: 'Andhra Pradesh',
  Krishna: 'Andhra Pradesh',
  Kurnool: 'Andhra Pradesh',
  Nellore: 'Andhra Pradesh',
  Prakasam: 'Andhra Pradesh',
  Srikakulam: 'Andhra Pradesh',
  Visakhapatnam: 'Andhra Pradesh',
  Vizianagaram: 'Andhra Pradesh',
  'West Godavari': 'Andhra Pradesh',
  'YSR Kadapa': 'Andhra Pradesh',
}

const COMMODITIES = [
  {
    name: 'Paddy(Common)',
    variety: 'Common',
    minPrice: 2100,
    maxPrice: 2400,
    modalPrice: 2250,
  },
  {
    name: 'Paddy(Basmati)',
    variety: 'Basmati',
    minPrice: 3200,
    maxPrice: 3800,
    modalPrice: 3500,
  },
  {
    name: 'Wheat',
    variety: 'Local',
    minPrice: 2200,
    maxPrice: 2600,
    modalPrice: 2400,
  },
  {
    name: 'Maize',
    variety: 'Local',
    minPrice: 1950,
    maxPrice: 2250,
    modalPrice: 2100,
  },
  {
    name: 'Tur/Arhar',
    variety: 'Local',
    minPrice: 6500,
    maxPrice: 7200,
    modalPrice: 6800,
  },
  {
    name: 'Moong',
    variety: 'Local',
    minPrice: 7200,
    maxPrice: 8000,
    modalPrice: 7600,
  },
  {
    name: 'Urad',
    variety: 'Local',
    minPrice: 6800,
    maxPrice: 7500,
    modalPrice: 7100,
  },
  {
    name: 'Groundnut',
    variety: 'Pod',
    minPrice: 5200,
    maxPrice: 5800,
    modalPrice: 5500,
  },
  {
    name: 'Sunflower',
    variety: 'Local',
    minPrice: 4500,
    maxPrice: 5100,
    modalPrice: 4800,
  },
  {
    name: 'Soyabean',
    variety: 'Local',
    minPrice: 4200,
    maxPrice: 4800,
    modalPrice: 4500,
  },
  {
    name: 'Cotton',
    variety: 'Local',
    minPrice: 6200,
    maxPrice: 7100,
    modalPrice: 6650,
  },
  {
    name: 'Tomato',
    variety: 'Local',
    minPrice: 1200,
    maxPrice: 2800,
    modalPrice: 1800,
  },
  {
    name: 'Onion',
    variety: 'Local',
    minPrice: 1500,
    maxPrice: 3200,
    modalPrice: 2200,
  },
  {
    name: 'Potato',
    variety: 'Local',
    minPrice: 1400,
    maxPrice: 2200,
    modalPrice: 1800,
  },
  {
    name: 'Chilli(Green)',
    variety: 'Local',
    minPrice: 3500,
    maxPrice: 5200,
    modalPrice: 4200,
  },
]

function seededRandom(seed: number) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function generateFallbackRecords() {
  const rng = seededRandom(42)
  const records: any[] = []
  const districts = Object.keys(MARKETS)

  for (const district of districts) {
    const markets = MARKETS[district]!
    const numCommodities = 4 + Math.floor(rng() * 4)
    const shuffled = [...COMMODITIES]
      .sort(() => rng() - 0.5)
      .slice(0, numCommodities)

    for (const commodity of shuffled) {
      const numMarkets = 1 + Math.floor(rng() * Math.min(2, markets.length))
      const marketChoices = [...markets]
        .sort(() => rng() - 0.5)
        .slice(0, numMarkets)

      for (const market of marketChoices) {
        const priceVariation = 0.85 + rng() * 0.3
        records.push({
          state: STATE_MAP[district] || 'Telangana',
          district,
          market,
          commodity: commodity.name,
          variety: commodity.variety,
          grade: 'FAQ',
          arrival_date: today,
          min_price: Math.round(commodity.minPrice * priceVariation),
          max_price: Math.round(commodity.maxPrice * (priceVariation + 0.1)),
          modal_price: Math.round(commodity.modalPrice * priceVariation),
        })
      }
    }
  }

  return records
}
