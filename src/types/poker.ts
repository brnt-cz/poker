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
  { id: 1, smallBlind: 25, bigBlind: 50, ante: 0, duration: 1200 },
  { id: 2, smallBlind: 50, bigBlind: 100, ante: 0, duration: 1200 },
  { id: 3, smallBlind: 75, bigBlind: 150, ante: 0, duration: 1200 },
  { id: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 1200 },
  { id: 5, smallBlind: 0, bigBlind: 0, ante: 0, duration: 600, isBreak: true, breakMessage: 'Prestavka 10 minut' },
  { id: 6, smallBlind: 150, bigBlind: 300, ante: 50, duration: 1200 },
  { id: 7, smallBlind: 200, bigBlind: 400, ante: 50, duration: 1200 },
  { id: 8, smallBlind: 300, bigBlind: 600, ante: 75, duration: 1200 },
  { id: 9, smallBlind: 400, bigBlind: 800, ante: 100, duration: 1200 },
  { id: 10, smallBlind: 0, bigBlind: 0, ante: 0, duration: 600, isBreak: true, breakMessage: 'Prestavka 10 minut' },
  { id: 11, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 1200 },
  { id: 12, smallBlind: 600, bigBlind: 1200, ante: 200, duration: 1200 },
  { id: 13, smallBlind: 800, bigBlind: 1600, ante: 200, duration: 1200 },
  { id: 14, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 1200 },
  { id: 15, smallBlind: 1500, bigBlind: 3000, ante: 400, duration: 1200 },
]
