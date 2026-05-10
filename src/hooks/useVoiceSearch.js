import { useState, useCallback, useRef, useEffect } from 'react'

export function useVoiceSearch(onResult, lang = 'en') {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const onResultRef = useRef(onResult)
  const isListeningRef = useRef(false)

  // Update the ref when onResult changes
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  // Mapping lang to recognition code
  const langMap = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'te': 'te-IN'
  }

  // Initialize recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = langMap[lang] || 'en-IN'

    recognition.onstart = () => {
      console.log('[VoiceSearch] Recording started')
      isListeningRef.current = true
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i][0].transcript) {
          transcript += event.results[i][0].transcript
        }
      }
      
      if (transcript) {
        console.log('[VoiceSearch] Got transcript:', transcript)
        if (onResultRef.current) {
          onResultRef.current(transcript)
        }
      }
    }

    recognition.onerror = (event) => {
      console.error('[VoiceSearch] Error:', event.error)
      setError(`Error: ${event.error}`)
      isListeningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log('[VoiceSearch] Recording ended')
      isListeningRef.current = false
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.error('[VoiceSearch] Abort error:', e)
        }
      }
    }
  }, [lang])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('[VoiceSearch] Recognition not initialized')
      return
    }
    
    if (isListeningRef.current) {
      console.log('[VoiceSearch] Already listening')
      return
    }

    try {
      console.log('[VoiceSearch] Starting listening...')
      recognitionRef.current.start()
    } catch (e) {
      console.error('[VoiceSearch] Start error:', e)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    
    if (!isListeningRef.current) {
      console.log('[VoiceSearch] Not listening, nothing to stop')
      return
    }

    try {
      console.log('[VoiceSearch] Stopping listening...')
      recognitionRef.current.stop()
    } catch (e) {
      console.error('[VoiceSearch] Stop error:', e)
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening()
    } else {
      startListening()
    }
  }, [startListening, stopListening])

  return {
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }
}
