import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { te } from './te'
import { hi } from './hi'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    te: { translation: te },
    hi: { translation: hi },
  },
  lng: 'te', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
