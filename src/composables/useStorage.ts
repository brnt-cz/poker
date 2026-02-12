import type { BlindLevel, Player, ChipDenomination } from '@/types/poker'
import type { CurrencyCode } from './useCurrency'
import type { SupportedLocale } from '@/i18n'

const STORAGE_KEYS = {
  STRUCTURE: 'poker-timer-structure',
  PLAYERS: 'poker-timer-players',
  SETTINGS: 'poker-timer-settings',
  STATE: 'poker-timer-state',
  CHIPS: 'poker-timer-chips',
} as const

interface StoredSettings {
  startingStack: number
  buyinAmount: number
  useAnte?: boolean
  allowRebuy?: boolean
  useBounty?: boolean
  bountyAmount?: number
  useBreaks?: boolean
  maxRebuys?: number
  levelDuration?: number
  breakDuration?: number
  language?: SupportedLocale
  currency?: CurrencyCode
}

interface StoredState {
  currentLevelIndex: number
  remainingSeconds: number
  isRunning: boolean
  finishOrder?: { id: string; name: string; position: number }[]
  levelEndTimestamp?: number | null  // Fallback timestamp when level should end
}

export function useStorage() {
  // Save structure
  function saveStructure(structure: BlindLevel[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.STRUCTURE, JSON.stringify(structure))
    } catch (e) {
      console.error('Failed to save structure:', e)
    }
  }

  // Load structure
  function loadStructure(): BlindLevel[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STRUCTURE)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load structure:', e)
      return null
    }
  }

  // Save players
  function savePlayers(players: Player[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players))
    } catch (e) {
      console.error('Failed to save players:', e)
    }
  }

  // Load players
  function loadPlayers(): Player[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYERS)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load players:', e)
      return null
    }
  }

  // Save settings
  function saveSettings(settings: StoredSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  // Load settings
  function loadSettings(): StoredSettings | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load settings:', e)
      return null
    }
  }

  // Save state (for resuming)
  function saveState(state: StoredState) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save state:', e)
    }
  }

  // Load state
  function loadState(): StoredState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATE)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load state:', e)
      return null
    }
  }

  // Save chips
  function saveChips(chips: ChipDenomination[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHIPS, JSON.stringify(chips))
    } catch (e) {
      console.error('Failed to save chips:', e)
    }
  }

  // Load chips
  function loadChips(): ChipDenomination[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHIPS)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load chips:', e)
      return null
    }
  }

  // Clear all
  function clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  return {
    saveStructure,
    loadStructure,
    savePlayers,
    loadPlayers,
    saveSettings,
    loadSettings,
    saveState,
    loadState,
    saveChips,
    loadChips,
    clearAll,
  }
}
