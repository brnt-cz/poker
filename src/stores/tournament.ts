import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { BlindLevel, Player, ChipDenomination } from '@/types/poker'
import { defaultStructure, defaultChips } from '@/types/poker'
import { useStorage } from '@/composables/useStorage'

export const useTournamentStore = defineStore('tournament', () => {
  const storage = useStorage()

  // Load from storage or use defaults
  const savedStructure = storage.loadStructure()
  const savedPlayers = storage.loadPlayers()
  const savedSettings = storage.loadSettings()
  const savedState = storage.loadState()
  const savedChips = storage.loadChips()

  // State
  const structure = ref<BlindLevel[]>(savedStructure || [...defaultStructure])
  const currentLevelIndex = ref(savedState?.currentLevelIndex ?? 0)
  const remainingSeconds = ref(savedState?.remainingSeconds ?? 0)
  const isRunning = ref(false) // Always start paused
  const players = ref<Player[]>(savedPlayers || [])
  const startingStack = ref(savedSettings?.startingStack ?? 10000)
  const buyinAmount = ref(savedSettings?.buyinAmount ?? 100)
  const useAnte = ref(savedSettings?.useAnte ?? true)
  const allowRebuy = ref(savedSettings?.allowRebuy ?? true)
  const useBounty = ref(savedSettings?.useBounty ?? false)
  const bountyAmount = ref(savedSettings?.bountyAmount ?? 50)
  const useBreaks = ref(savedSettings?.useBreaks ?? true)
  const levelDuration = ref(savedSettings?.levelDuration ?? 1200) // 20 minut v sekundách
  const breakDuration = ref(savedSettings?.breakDuration ?? 600) // 10 minut v sekundách
  const chips = ref<ChipDenomination[]>(savedChips || [...defaultChips])
  // Track finish order - players who busted (last element = last to bust = 2nd place)
  const finishOrder = ref<{ id: string; name: string; position: number }[]>(savedState?.finishOrder ?? [])

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

  // Calculate elapsed time in seconds (sum of all previous levels + time spent in current level)
  const elapsedSeconds = computed(() => {
    let elapsed = 0
    // Add all completed levels
    for (let i = 0; i < currentLevelIndex.value; i++) {
      const level = structure.value[i]
      if (level) {
        elapsed += level.isBreak ? breakDuration.value : levelDuration.value
      }
    }
    // Add time spent in current level
    const currentLevelDur = currentLevel.value?.isBreak ? breakDuration.value : levelDuration.value
    elapsed += currentLevelDur - remainingSeconds.value
    return elapsed
  })

  // Watch for changes and save to storage
  watch(structure, (newVal) => storage.saveStructure(newVal), { deep: true })
  watch(players, (newVal) => storage.savePlayers(newVal), { deep: true })
  watch(chips, (newVal) => storage.saveChips(newVal), { deep: true })

  // Update all active players' stacks when startingStack changes
  watch(startingStack, (newStack) => {
    players.value.forEach(player => {
      if (!player.isBusted) {
        player.stack = newStack
      }
    })
  })
  watch([startingStack, buyinAmount, useAnte, allowRebuy, useBounty, bountyAmount, useBreaks, levelDuration, breakDuration], () => {
    storage.saveSettings({
      startingStack: startingStack.value,
      buyinAmount: buyinAmount.value,
      useAnte: useAnte.value,
      allowRebuy: allowRebuy.value,
      useBounty: useBounty.value,
      bountyAmount: bountyAmount.value,
      useBreaks: useBreaks.value,
      levelDuration: levelDuration.value,
      breakDuration: breakDuration.value,
    })
  })
  watch([currentLevelIndex, remainingSeconds, isRunning, finishOrder], () => {
    storage.saveState({
      currentLevelIndex: currentLevelIndex.value,
      remainingSeconds: remainingSeconds.value,
      isRunning: isRunning.value,
      finishOrder: finishOrder.value,
    })
  }, { deep: true })

  // Actions
  function initializeLevel() {
    if (currentLevel.value) {
      // Použít globální délku podle typu levelu
      remainingSeconds.value = currentLevel.value.isBreak ? breakDuration.value : levelDuration.value
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
      // Also remove from finishOrder if present
      const finishIndex = finishOrder.value.findIndex(f => f.id === id)
      if (finishIndex !== -1) {
        finishOrder.value.splice(finishIndex, 1)
      }
    }
  }

  function bustPlayer(id: string) {
    const player = players.value.find(p => p.id === id)
    if (player) {
      // Position = number of active players (after this bust)
      const position = activePlayers.value
      player.isBusted = true
      player.stack = 0
      // Add to finish order
      finishOrder.value.push({
        id: player.id,
        name: player.name,
        position
      })
    }
  }

  function rebuyPlayer(id: string) {
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.isBusted = false
      player.stack = startingStack.value
      player.buyinCount++
      // Remove from finish order
      const finishIndex = finishOrder.value.findIndex(f => f.id === id)
      if (finishIndex !== -1) {
        finishOrder.value.splice(finishIndex, 1)
      }
    }
  }

  function setStructure(newStructure: BlindLevel[]) {
    structure.value = newStructure
  }

  function setChips(newChips: ChipDenomination[]) {
    chips.value = newChips
  }

  function updateChip(id: string, updates: Partial<ChipDenomination>) {
    const chip = chips.value.find(c => c.id === id)
    if (chip) {
      Object.assign(chip, updates)
    }
  }

  function addChip() {
    const maxValue = Math.max(...chips.value.map(c => c.value), 0)
    chips.value.push({
      id: crypto.randomUUID(),
      value: maxValue * 2 || 10000,
      color: '#6b7280',
      label: 'Nový',
    })
  }

  function removeChip(id: string) {
    const index = chips.value.findIndex(c => c.id === id)
    if (index !== -1) {
      chips.value.splice(index, 1)
    }
  }

  function resetChips() {
    chips.value = [...defaultChips]
  }

  function resetStructure() {
    structure.value = JSON.parse(JSON.stringify(defaultStructure))
    currentLevelIndex.value = 0
    isRunning.value = false
    initializeLevel()
  }

  function reset() {
    currentLevelIndex.value = 0
    isRunning.value = false
    initializeLevel()
  }

  function resetAll() {
    structure.value = [...defaultStructure]
    players.value = []
    finishOrder.value = []
    currentLevelIndex.value = 0
    isRunning.value = false
    startingStack.value = 10000
    buyinAmount.value = 100
    useAnte.value = true
    allowRebuy.value = true
    useBounty.value = false
    bountyAmount.value = 50
    useBreaks.value = true
    levelDuration.value = 1200
    breakDuration.value = 600
    storage.clearAll()
    initializeLevel()
  }

  function adjustTime(seconds: number) {
    remainingSeconds.value = Math.max(0, remainingSeconds.value + seconds)
  }

  // Initialize level time if not restored from storage
  if (remainingSeconds.value === 0 && currentLevel.value) {
    initializeLevel()
  }

  return {
    // State
    structure,
    currentLevelIndex,
    remainingSeconds,
    isRunning,
    players,
    startingStack,
    buyinAmount,
    useAnte,
    allowRebuy,
    useBounty,
    bountyAmount,
    useBreaks,
    levelDuration,
    breakDuration,
    chips,
    finishOrder,
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
    elapsedSeconds,
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
    setChips,
    updateChip,
    addChip,
    removeChip,
    resetChips,
    resetStructure,
    reset,
    resetAll,
    adjustTime,
  }
})
