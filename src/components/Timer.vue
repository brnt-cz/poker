<script setup lang="ts">
import { computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'

const store = useTournamentStore()

const timeClass = computed(() => {
  if (store.remainingSeconds <= 10) return 'text-red-500 animate-pulse'
  if (store.remainingSeconds <= 60) return 'text-yellow-400'
  return 'text-white'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      :class="[
        'font-mono text-[5.5rem] lg:text-9xl font-bold tracking-wider transition-colors duration-300',
        timeClass
      ]"
    >
      {{ store.formattedTime }}
    </div>
    <div class="mt-1 sm:mt-2 text-base lg:text-2xl text-gray-400">
      Level {{ store.currentLevelIndex + 1 }} / {{ store.totalLevels }}
    </div>
  </div>
</template>
