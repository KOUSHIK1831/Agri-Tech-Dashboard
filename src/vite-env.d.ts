/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_API_KEY: string
  readonly VITE_XAI_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface Window {
  SpeechRecognition: any
  webkitSpeechRecognition: any
}
