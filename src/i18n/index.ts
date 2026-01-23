import { createI18n } from 'vue-i18n'
import cs from './cs'
import en from './en'

export type SupportedLocale = 'cs' | 'en'

export function detectBrowserLanguage(): SupportedLocale {
  const lang = navigator.language.split('-')[0] ?? ''
  return ['cs', 'en'].includes(lang) ? (lang as SupportedLocale) : 'cs'
}

// Load saved language from localStorage or detect from browser
function getInitialLocale(): SupportedLocale {
  try {
    const savedSettings = localStorage.getItem('poker-timer-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      if (settings.language && ['cs', 'en'].includes(settings.language)) {
        return settings.language as SupportedLocale
      }
    }
  } catch {
    // Ignore parse errors
  }
  return detectBrowserLanguage()
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'cs',
  messages: {
    cs,
    en
  }
})

export default i18n
