import axios from 'axios'

const XAI_KEY = import.meta.env.VITE_XAI_API_KEY

/**
 * Compresses market data to fit within prompt limits and focus on relevant info.
 */
function formatMarketContext(data) {
  if (!data || data.length === 0) return 'No market data available currently.'

  const sorted = [...data].sort((a, b) => Number(b.modal_price) - Number(a.modal_price))

  const summary = {
    totalRecords: data.length,
    highest: sorted[0],
    lowest: sorted[sorted.length - 1],
    top5: sorted.slice(0, 5),
    states: [...new Set(data.map(r => r.state))],
    commodities: [...new Set(data.map(r => r.commodity))]
  }

  return `
Current Market Context:
- Total Records: ${summary.totalRecords}
- States Covered: ${summary.states.join(', ')}
- Commodities Available: ${summary.commodities.join(', ')}
- Highest Price: ${summary.highest.modal_price} for ${summary.highest.commodity} in ${summary.highest.market}, ${summary.highest.district} (${summary.highest.state})
- Lowest Price: ${summary.lowest.modal_price} for ${summary.lowest.commodity} in ${summary.lowest.market}, ${summary.lowest.district} (${summary.lowest.state})

Sample of Top Prices:
${summary.top5.map(r => `- ${r.commodity}: ${r.modal_price} (${r.market}, ${r.state})`).join('\n')}
  `.trim()
}

async function askAI(prompt) {
  if (!XAI_KEY) throw new Error('API key is missing in .env file.')
  
  const cleanKey = XAI_KEY.trim().replace(/^["'](.+)["']$/, '$1')
  
  // Detect if it's a Groq key (starts with gsk_) or an xAI key (starts with xai-)
  const isGroq = cleanKey.startsWith('gsk_')
  const baseURL = isGroq ? 'https://api.groq.com/openai/v1' : 'https://api.x.ai/v1'
  const modelId = isGroq ? 'llama-3.3-70b-versatile' : 'grok-latest'

  console.log(`[aiService] Using ${isGroq ? 'Groq' : 'xAI'} with model: ${modelId}`)

  try {
    const { data } = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model: modelId,
        messages: [
          { 
            role: 'user', 
            content: `System: You are Kisan Sahayak, an Indian Agriculture assistant.\n\nUser Question: ${prompt}` 
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return data.choices[0].message.content
  } catch (err) {
    const apiError = err.response?.data?.error || err.response?.data || {}
    const errorMessage = typeof apiError === 'string' ? apiError : (apiError.message || JSON.stringify(apiError))
    
    if (err.message === 'Network Error') throw new Error('API blocked by browser (CORS).')
    throw new Error(`${isGroq ? 'Groq' : 'xAI'} failed: ${errorMessage}`)
  }
}

export async function askMandiBot(query, currentData) {
  const context = formatMarketContext(currentData)
  const prompt = `
You are "Kisan Sahayak", an intelligent AI assistant for an Indian Agriculture Market (Mandi) app.
Your goal is to help users understand market prices and trends based on provided data.

${context}

User Question: "${query}"

Answer in the language of the user's question (English/Hindi/Telugu). Be concise and helpful.`.trim()

  return await askAI(prompt)
}
