export interface BlindLevel {
  id: number
  smallBlind: number
  bigBlind: number
  ante: number
  duration: number // v sekundách
  isBreak?: boolean
  breakMessage?: string
}

export interface Player {
  id: string
  name: string
  stack: number
  isBusted: boolean
  buyinCount: number
}

export interface ChipDenomination {
  id: string
  value: number
  color: string
  label: string
}

export const defaultChips: ChipDenomination[] = [
  { id: '1', value: 5, color: '#ffffff', label: 'Bílá' },
  { id: '2', value: 10, color: '#ef4444', label: 'Červená' },
  { id: '3', value: 25, color: '#16a34a', label: 'Zelená' },
  { id: '4', value: 100, color: '#181a1c', label: 'Černá' },
  { id: '5', value: 500, color: '#9333ea', label: 'Fialová' },
  { id: '6', value: 1000, color: '#eab308', label: 'Žlutá' },
  { id: '7', value: 5000, color: '#f97316', label: 'Oranžová' },
]

export interface TournamentConfig {
  name: string
  structure: BlindLevel[]
  startingStack: number
  buyinAmount: number
  rebuysAllowed: boolean
}

export interface TournamentState {
  config: TournamentConfig
  players: Player[]
  currentLevelIndex: number
  remainingSeconds: number
  isRunning: boolean
  isPaused: boolean
}

// Výchozí turnajová struktura
export const defaultStructure: BlindLevel[] = [
  { id: 1, smallBlind: 5, bigBlind: 10, ante: 0, duration: 1200 },
  { id: 2, smallBlind: 10, bigBlind: 20, ante: 0, duration: 1200 },
  { id: 3, smallBlind: 25, bigBlind: 50, ante: 0, duration: 1200 },
  { id: 4, smallBlind: 0, bigBlind: 0, ante: 0, duration: 600, isBreak: true, breakMessage: 'Přestávka' },
  { id: 5, smallBlind: 50, bigBlind: 100, ante: 0, duration: 1200 },
  { id: 6, smallBlind: 75, bigBlind: 150, ante: 0, duration: 1200 },
  { id: 7, smallBlind: 100, bigBlind: 200, ante: 25, duration: 1200 },
  { id: 8, smallBlind: 0, bigBlind: 0, ante: 0, duration: 600, isBreak: true, breakMessage: 'Přestávka' },
  { id: 9, smallBlind: 150, bigBlind: 300, ante: 50, duration: 1200 },
  { id: 10, smallBlind: 200, bigBlind: 400, ante: 50, duration: 1200 },
  { id: 11, smallBlind: 300, bigBlind: 600, ante: 75, duration: 1200 },
  { id: 12, smallBlind: 0, bigBlind: 0, ante: 0, duration: 600, isBreak: true, breakMessage: 'Přestávka' },
  { id: 13, smallBlind: 400, bigBlind: 800, ante: 100, duration: 1200 },
  { id: 14, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 1200 },
  { id: 15, smallBlind: 600, bigBlind: 1200, ante: 200, duration: 1200 },
  { id: 16, smallBlind: 0, bigBlind: 0, ante: 0, duration: 600, isBreak: true, breakMessage: 'Přestávka' },
  { id: 17, smallBlind: 800, bigBlind: 1600, ante: 200, duration: 1200 },
  { id: 18, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 1200 },
  { id: 19, smallBlind: 1500, bigBlind: 3000, ante: 400, duration: 1200 },
]
