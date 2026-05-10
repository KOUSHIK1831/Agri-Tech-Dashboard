import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Mic, MicOff } from 'lucide-react'
import { askMandiBot } from '../services/aiService'
import { useVoiceSearch } from '../hooks/useVoiceSearch'

export default function BotAssistant({ activeData, lang, t }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: t.botGreeting }
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const wasVoiceUsed = useRef(false)
  const handleSendRef = useRef(null)
  const isSpeakingRef = useRef(false)

  // Sync initial message with language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'bot') {
        return [{ role: 'bot', text: t.botGreeting }]
      }
      return prev
    })
  }, [t.botGreeting])

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    
    // Don't start new speech if already speaking
    if (isSpeakingRef.current) {
      window.speechSynthesis.cancel()
    }
    
    isSpeakingRef.current = true
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'te': 'te-IN' }
    utterance.lang = langMap[lang] || 'en-IN'
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    utterance.onstart = () => {
      console.log('[Speech] Speaking started')
      isSpeakingRef.current = true
    }
    
    utterance.onend = () => {
      console.log('[Speech] Speaking ended')
      isSpeakingRef.current = false
    }
    
    utterance.onerror = (e) => {
      console.error('[Speech] Error:', e.error)
      isSpeakingRef.current = false
    }
    
    window.speechSynthesis.speak(utterance)
  }, [lang])

  const handleSend = useCallback(async (e, manualMsg) => {
    if (e) e.preventDefault()
    
    const msgToSend = manualMsg || query
    const trimmed = msgToSend.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', text: trimmed }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setLoading(true)

    try {
      const response = await askMandiBot(trimmed, activeData)
      setMessages(prev => [...prev, { role: 'bot', text: response }])
      
      if (wasVoiceUsed.current) {
        speak(response)
        wasVoiceUsed.current = false
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: err.message, isError: true }])
    } finally {
      setLoading(false)
    }
  }, [loading, activeData, speak, query])

  useEffect(() => {
    handleSendRef.current = handleSend
  }, [handleSend])

  const { isListening, toggleListening, isSupported } = useVoiceSearch(useCallback((text) => {
    console.log('[BotAssistant] Voice text received:', text)
    // Don't process voice input while bot is speaking
    if (isSpeakingRef.current) {
      console.log('[BotAssistant] Bot is speaking, ignoring voice input')
      return
    }
    wasVoiceUsed.current = true
    if (handleSendRef.current) {
      handleSendRef.current(null, text)
    }
  }, []), lang)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 group ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-green-600 hover:bg-green-700 scale-110'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : (
          <div className="relative">
            <MessageSquare className="text-white w-6 h-6" />
            <Sparkles className="absolute -top-2 -right-2 w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-green-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{t.botName}</h3>
              <p className="text-green-100 text-[10px]">AI Market Assistant</p>
            </div>
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all shadow-lg ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                    : 'bg-white text-green-600 hover:bg-green-50'
                }`}
                title={isListening ? t.stopListeningTooltip : t.clickToSpeak}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : m.isError
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-800'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={isListening ? "Listening..." : t.botPlaceholder}
                className={`w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 dark:text-white transition-all ${
                  isListening ? 'ring-2 ring-red-400 animate-pulse' : ''
                }`}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-400 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              {t.botPower}
            </p>
          </form>
        </div>
      )}
    </>
  )
}
