import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Mic,
  MicOff,
  Zap,
  TrendingUp,
  History,
  AlertCircle,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { askMandiBot } from '../services/aiService'
import { useVoiceSearch } from '../hooks/useVoiceSearch'

export default function BotAssistant({ activeData, lang, t }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: t.botGreeting },
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wasVoiceUsed = useRef(false)
  const handleSendRef = useRef<any>(null)

  const SUGGESTIONS = [
    { text: t('highestMarket'), icon: TrendingUp },
    { text: 'Green Chilli price?', icon: Zap },
    { text: 'Market summary', icon: History },
  ]

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'bot') {
        return [{ role: 'bot', text: t.botGreeting }]
      }
      return prev
    })
  }, [t.botGreeting])

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const langMap: any = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' }
      utterance.lang = langMap[lang] || 'en-IN'
      utterance.rate = 1.0
      window.speechSynthesis.speak(utterance)
    },
    [lang]
  )

  const handleSend = useCallback(
    async (e?: React.FormEvent, manualMsg?: string) => {
      if (e) e.preventDefault()

      const msgToSend = manualMsg || query
      const trimmed = msgToSend.trim()
      if (!trimmed || loading) return

      const userMsg = { role: 'user', text: trimmed }
      setMessages((prev) => [...prev, userMsg])
      setQuery('')
      setLoading(true)

      try {
        if (!activeData || activeData.length === 0) {
          const fallbackMsg =
            'I am still loading the latest market data. Please try again in a few seconds!'
          setMessages((prev) => [...prev, { role: 'bot', text: fallbackMsg }])
          setLoading(false)
          return
        }

        const response = await askMandiBot(trimmed, activeData)
        setMessages((prev) => [...prev, { role: 'bot', text: response }])

        if (wasVoiceUsed.current) {
          speak(response)
          wasVoiceUsed.current = false
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: err.message, isError: true },
        ])
      } finally {
        setLoading(false)
      }
    },
    [loading, activeData, speak, query]
  )

  useEffect(() => {
    handleSendRef.current = handleSend
  }, [handleSend])

  const { isListening, toggleListening, isSupported } = useVoiceSearch(
    useCallback((text: string) => {
      wasVoiceUsed.current = true
      if (handleSendRef.current) {
        handleSendRef.current(undefined, text)
      }
    }, []),
    lang
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, loading])

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {!isOpen && (
          <div
            className="bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-xl border border-green-100 dark:border-green-900/30 animate-bounce cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Ask {t.botName}
            </p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-500 transform ${
            isOpen
              ? 'bg-red-500 rotate-90 scale-90'
              : 'bg-green-600 hover:bg-green-700 hover:scale-110'
          }`}
        >
          {isOpen ? (
            <X className="text-white w-6 h-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="text-white w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Modern Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[95vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5 flex items-center gap-4 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Bot className="w-32 h-32 text-white rotate-12" />
            </div>

            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-inner">
              <Bot className="text-white w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-extrabold text-base tracking-tight">
                  {t.botName}
                </h3>
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              </div>
              <p className="text-green-50 text-[10px] font-medium opacity-80">
                AI Market Intelligence Assistant
              </p>
            </div>

            {/* HEADER VOICE BUTTON - HIGH VISIBILITY */}
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`p-3 rounded-2xl transition-all shadow-xl font-bold flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/40'
                    : 'bg-white text-green-600 hover:bg-green-50 border-none'
                }`}
                title={t.voiceSearchTooltip}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50 dark:bg-gray-950/40"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : m.isError
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-800 rounded-tl-none'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-white dark:border-gray-700 rounded-tl-none prose dark:prose-invert prose-p:my-0 prose-headings:my-2 prose-ul:my-2'
                    }`}
                  >
                    {m.role === 'bot' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.text}
                      </ReactMarkdown>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 max-w-[90%]">
                  <div className="w-9 h-9 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                    <Bot className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-white dark:border-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="px-5 py-3 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(undefined, s.text)}
                  className="whitespace-nowrap px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <s.icon className="w-3 h-3" />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Interface */}
          <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
            {!isSupported && (
              <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 flex items-center gap-2 text-[10px] text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-3 h-3" />
                <span>
                  Voice input not supported in this browser. Please use Chrome
                  or Edge.
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <form
                onSubmit={(e) => handleSend(e)}
                className="relative group flex-1"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isListening ? 'Listening...' : t.botPlaceholder}
                  className={`w-full pl-5 pr-14 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-[20px] text-sm focus:ring-2 focus:ring-green-500/50 dark:text-white transition-all shadow-inner ${
                    isListening ? 'ring-2 ring-red-500 bg-red-50/30' : ''
                  }`}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-400 transition-all shadow-lg active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

              {/* SECONDARY BIG VOICE BUTTON FOR BETTER UX */}
              {isSupported && (
                <button
                  onClick={toggleListening}
                  className={`w-full py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 font-extrabold text-sm border-2 ${
                    isListening
                      ? 'bg-red-500 text-white border-red-600 animate-pulse ring-4 ring-red-500/20'
                      : 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-green-100 dark:border-gray-700 hover:border-green-500'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>{t.clickToSpeak}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <Zap className="w-3 h-3 text-orange-400" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t.botPower}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
