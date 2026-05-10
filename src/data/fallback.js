const today = new Date().toLocaleDateString('en-GB')

const MARKETS = {
  'Adilabad': ['Adilabad APMC', 'Basar APMC', 'Boath APMC', 'Utnoor APMC', 'Laxmanchanda APMC'],
  'Bhadradri Kothagudem': ['Kothagudem APMC', 'Bhadrachalam APMC', 'Palvancha APMC', 'Manugur APMC', 'Julurpad APMC'],
  'Hanumakonda': ['Hanumakonda APMC', 'Kazipet APMC', 'Parkal APMC', 'Jangaon APMC', 'Ghanpur APMC'],
  'Hyderabad': ['Bowenpally APMC', 'Gaddiannaram APMC', 'Kothapet APMC', 'Jeedimetla APMC', 'Shamshabad APMC'],
  'Jagitial': ['Jagitial APMC', 'Mallapur APMC', 'Koratla APMC', 'Metpally APMC', 'Dharmapuri APMC'],
  'Jangaon': ['Jangaon APMC', 'Ghanpur Station APMC', 'Palakurthy APMC', 'Bachannapet APMC', 'Devaruppula APMC'],
  'Jayashankar Bhupalapally': ['Bhupalapally APMC', 'Mahadevpur APMC', 'Kataram APMC', 'Mutharam APMC', 'Regonda APMC'],
  'Jogulamba Gadwal': ['Gadwal APMC', 'Alampur APMC', 'Wanaparthy APMC', 'Kollapur APMC', 'Itikyal APMC'],
  'Kamareddy': ['Kamareddy APMC', 'Banswada APMC', 'Ellareddy APMC', 'Yellareddy APMC', 'Tadwai APMC'],
  'Karimnagar': ['Karimnagar APMC', 'Sircilla APMC', 'Choppadandi APMC', 'Husnabad APMC', 'Timmapur APMC'],
  'Khammam': ['Khammam APMC', 'Sathupally APMC', 'Madhira APMC', 'Wyra APMC', 'Kallur APMC'],
  'Mahabubabad': ['Mahabubabad APMC', 'Kesamudram APMC', 'Dornakal APMC', 'Narsimhulapet APMC', 'Kuravi APMC'],
  'Mahabubnagar': ['Mahabubnagar APMC', 'Badepalli APMC', 'Jadcherla APMC', 'Kollapur APMC', 'Devarkadra APMC'],
  'Mancherial': ['Mancherial APMC', 'Bellampalli APMC', 'Chennur APMC', 'Luxettipet APMC', 'Jaipur APMC'],
  'Medak': ['Medak APMC', 'Narsingi APMC', 'Ramayampet APMC', 'Siddipet APMC', 'Dubbaka APMC'],
  'Medchal Malkajgiri': ['Malkajgiri APMC', 'Medchal APMC', 'Shameerpet APMC', 'Quthbullapur APMC', 'Keesara APMC'],
  'Mulugu': ['Mulugu APMC', 'Wajedu APMC', 'Eturnagaram APMC', 'Mangapet APMC', 'Tadvai APMC'],
  'Nagarkurnool': ['Nagarkurnool APMC', 'Achampet APMC', 'Kalwakurthy APMC', 'Kodair APMC', 'Tadoor APMC'],
  'Nalgonda': ['Nalgonda APMC', 'Miryalaguda APMC', 'Bhongir APMC', 'Suryapet APMC', 'Devarakonda APMC'],
  'Nirmal': ['Nirmal APMC', 'Khanapur APMC', 'Mudhol APMC', 'Sarampally APMC', 'Bazarhatnoor APMC'],
  'Nizamabad': ['Nizamabad APMC', 'Armoor APMC', 'Bodhan APMC', 'Balkonda APMC', 'Kamareddy APMC'],
  'Peddapalli': ['Peddapalli APMC', 'Ramagundam APMC', 'Sultanabad APMC', 'Manthani APMC', 'Julapalli APMC'],
  'Rajanna Sircilla': ['Sircilla APMC', 'Vemulawada APMC', 'Konaraopet APMC', 'Chandurthi APMC', 'Boinpally APMC'],
  'Ranga Reddy': ['L B Nagar APMC', 'Shamshabad APMC', 'Moinabad APMC', 'Vikarabad APMC', 'Tandur APMC'],
  'Sangareddy': ['Sangareddy APMC', 'Zaheerabad APMC', 'Narayankhed APMC', 'Patancheru APMC', 'Ramachandrapuram APMC'],
  'Siddipet': ['Siddipet APMC', 'Mirdoddi APMC', 'Husnabad APMC', 'Jagdevpur APMC', 'Nangnoor APMC'],
  'Suryapet': ['Suryapet APMC', 'Kodad APMC', 'Huzurnagar APMC', 'Nereducharla APMC', 'Thirumalagiri APMC'],
  'Vikarabad': ['Vikarabad APMC', 'Tandur APMC', 'Parigi APMC', 'Kodangal APMC', 'Doma APMC'],
  'Wanaparthy': ['Wanaparthy APMC', 'Kothakota APMC', 'Pebbair APMC', 'Amarchintha APMC', 'Veepangandla APMC'],
  'Warangal': ['Warangal APMC', 'Narsampet APMC', 'Wardhannapet APMC', 'Geethanagar APMC', 'Chennaraopet APMC'],
  'Yadadri Bhuvanagiri': ['Bhuvanagiri APMC', 'Choutuppal APMC', 'Mothkur APMC', 'Ramannapet APMC', 'Pochampally APMC'],
}

const COMMODITIES = [
  { name: 'Paddy(Common)', variety: 'Common', minPrice: 2100, maxPrice: 2400, modalPrice: 2250 },
  { name: 'Paddy(Basmati)', variety: 'Basmati', minPrice: 3200, maxPrice: 3800, modalPrice: 3500 },
  { name: 'Wheat', variety: 'Local', minPrice: 2200, maxPrice: 2600, modalPrice: 2400 },
  { name: 'Maize', variety: 'Local', minPrice: 1950, maxPrice: 2250, modalPrice: 2100 },
  { name: 'Tur/Arhar', variety: 'Local', minPrice: 6500, maxPrice: 7200, modalPrice: 6800 },
  { name: 'Moong', variety: 'Local', minPrice: 7200, maxPrice: 8000, modalPrice: 7600 },
  { name: 'Urad', variety: 'Local', minPrice: 6800, maxPrice: 7500, modalPrice: 7100 },
  { name: 'Groundnut', variety: 'Pod', minPrice: 5200, maxPrice: 5800, modalPrice: 5500 },
  { name: 'Sunflower', variety: 'Local', minPrice: 4500, maxPrice: 5100, modalPrice: 4800 },
  { name: 'Soyabean', variety: 'Local', minPrice: 4200, maxPrice: 4800, modalPrice: 4500 },
  { name: 'Cotton', variety: 'Local', minPrice: 6200, maxPrice: 7100, modalPrice: 6650 },
  { name: 'Sugarcane', variety: 'Local', minPrice: 3200, maxPrice: 3700, modalPrice: 3450 },
  { name: 'Tomato', variety: 'Local', minPrice: 1200, maxPrice: 2800, modalPrice: 1800 },
  { name: 'Onion', variety: 'Local', minPrice: 1500, maxPrice: 3200, modalPrice: 2200 },
  { name: 'Potato', variety: 'Local', minPrice: 1400, maxPrice: 2200, modalPrice: 1800 },
  { name: 'Chilli(Green)', variety: 'Local', minPrice: 3500, maxPrice: 5200, modalPrice: 4200 },
  { name: 'Turmeric', variety: 'Local', minPrice: 5800, maxPrice: 6800, modalPrice: 6300 },
  { name: 'Coriander', variety: 'Local', minPrice: 5200, maxPrice: 6500, modalPrice: 5800 },
  { name: 'Brinjal', variety: 'Local', minPrice: 1800, maxPrice: 2800, modalPrice: 2200 },
  { name: 'Cabbage', variety: 'Local', minPrice: 1200, maxPrice: 2000, modalPrice: 1600 },
  { name: 'Cauliflower', variety: 'Local', minPrice: 1800, maxPrice: 3000, modalPrice: 2400 },
  { name: 'Banana - Green', variety: 'Green', minPrice: 2800, maxPrice: 3600, modalPrice: 3200 },
  { name: 'Mango', variety: 'Local', minPrice: 3500, maxPrice: 8000, modalPrice: 5000 },
  { name: 'Orange', variety: 'Local', minPrice: 3000, maxPrice: 5000, modalPrice: 3800 },
  { name: 'Grapes', variety: 'Local', minPrice: 4000, maxPrice: 6000, modalPrice: 5000 },
  { name: 'Papaya', variety: 'Local', minPrice: 2000, maxPrice: 3000, modalPrice: 2500 },
  { name: 'Coconut', variety: 'Local', minPrice: 2500, maxPrice: 3500, modalPrice: 3000 },
]

function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function generateFallbackRecords() {
  const rng = seededRandom(42)
  const records = []
  const districts = Object.keys(MARKETS)

  for (const district of districts) {
    const markets = MARKETS[district]
    // each district gets 4-7 commodities
    const numCommodities = 4 + Math.floor(rng() * 4)
    const shuffled = [...COMMODITIES].sort(() => rng() - 0.5).slice(0, numCommodities)

    for (const commodity of shuffled) {
      // assign 1-2 markets per commodity
      const numMarkets = 1 + Math.floor(rng() * Math.min(2, markets.length))
      const marketChoices = [...markets].sort(() => rng() - 0.5).slice(0, numMarkets)

      for (const market of marketChoices) {
        const priceVariation = 0.85 + rng() * 0.3
        records.push({
          state: 'Telangana',
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
