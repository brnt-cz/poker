import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlindLevel, Player } from '@/types/poker'
import { defaultStructure } from '@/types/poker'

export const useTournamentStore = defineStore('tournament', () => {
  // State
  const structure = ref<BlindLevel[]>([...defaultStructure])
  const currentLevelIndex = ref(0)
  const remainingSeconds = ref(0)
  const isRunning = ref(false)
  const players = ref<Player[]>([])
  const startingStack = ref(10000)
  const buyinAmount = ref(500)

  // Getters
  const currentLevel = computed(() => structure.value[currentLevelIndex.value])

  const nextLevel = computed(() => {
    const nextIndex = currentLevelIndex.value + 1
    return nextIndex < structure.value.length ? structure.value[nextIndex] : null
  })

  const isBreak = computed(() => currentLevel.value?.isBreak ?? false)

  const totalPlayers = computed(() => players.value.length)

  const activePlayers = computed(() => players.value.filter(p => !p.isBusted).length)

  const totalChips = computed(() => {
    return players.value.reduce((sum, p) => sum + (p.isBusted ? 0 : p.stack), 0)
  })

  const averageStack = computed(() => {
    const active = activePlayers.value
    return active > 0 ? Math.round(totalChips.value / active) : 0
  })

  const prizePool = computed(() => {
    return players.value.reduce((sum, p) => sum + (p.buyinCount * buyinAmount.value), 0)
  })

  const totalLevels = computed(() => structure.value.length)

  const formattedTime = computed(() => {
    const mins = Math.floor(remainingSeconds.value / 60)
    const secs = remainingSeconds.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  // Actions
  function initializeLevel() {
    if (currentLevel.value) {
      remainingSeconds.value = currentLevel.value.duration
    }
  }

  function start() {
    if (remainingSeconds.value === 0) {
      initializeLevel()
    }
    isRunning.value = true
  }

  function pause() {
    isRunning.value = false
  }

  function toggle() {
    if (isRunning.value) {
      pause()
    } else {
      start()
    }
  }

  function tick() {
    if (isRunning.value && remainingSeconds.value > 0) {
      remainingSeconds.value--
    }
  }

  function goToNextLevel() {
    if (currentLevelIndex.value < structure.value.length - 1) {
      currentLevelIndex.value++
      initializeLevel()
    }
  }

  function goToPreviousLevel() {
    if (currentLevelIndex.value > 0) {
      currentLevelIndex.value--
      initializeLevel()
    }
  }

  function goToLevel(index: number) {
    if (index >= 0 && index < structure.value.length) {
      currentLevelIndex.value = index
      initializeLevel()
    }
  }

  function addPlayer(name: string) {
    const player: Player = {
      id: crypto.randomUUID(),
      name,
      stack: startingStack.value,
      isBusted: false,
      buyinCount: 1,
    }
    players.value.push(player)
  }

  function removePlayer(id: string) {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value.splice(index, 1)
    }
  }

  function bustPlayer(id: string) {
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.isBusted = true
      player.stack = 0
    }
  }

  function rebuyPlayer(id: string) {
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.isBusted = false
      player.stack = startingStack.value
      player.buyinCount++
    }
  }

  function setStructure(newStructure: BlindLevel[]) {
    structure.value = newStructure
    currentLevelIndex.value = 0
    initializeLevel()
  }

  function reset() {
    currentLevelIndex.value = 0
    isRunning.value = false
    initializeLevel()
  }

  function adjustTime(seconds: number) {
    remainingSeconds.value = Math.max(0, remainingSeconds.value + seconds)
  }

  // Initialize
  initializeLevel()

  return {
    // State
    structure,
    currentLevelIndex,
    remainingSeconds,
    isRunning,
    players,
    startingStack,
    buyinAmount,
    // Getters
    currentLevel,
    nextLevel,
    isBreak,
    totalPlayers,
    activePlayers,
    totalChips,
    averageStack,
    prizePool,
    totalLevels,
    formattedTime,
    // Actions
    initializeLevel,
    start,
    pause,
    toggle,
    tick,
    goToNextLevel,
    goToPreviousLevel,
    goToLevel,
    addPlayer,
    removePlayer,
    bustPlayer,
    rebuyPlayer,
    setStructure,
    reset,
    adjustTime,
  }
})
