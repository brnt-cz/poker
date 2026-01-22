<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'

const store = useTournamentStore()

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K'
  return num.toString()
}
</script>

<template>
  <div class="w-full">
    <!-- Break -->
    <div v-if="store.isBreak" class="text-center py-8">
      <div class="text-4xl md:text-6xl font-bold text-green-400 mb-4">
        PŘESTÁVKA
      </div>
      <div v-if="store.currentLevel?.breakMessage" class="text-xl text-gray-300">
        {{ store.currentLevel.breakMessage }}
      </div>
    </div>

    <!-- Blinds -->
    <div v-else class="space-y-6">
      <!-- Current Blinds -->
      <div class="text-center">
        <div class="text-gray-400 text-sm uppercase tracking-wider mb-2">Blindy</div>
        <div class="text-4xl md:text-6xl font-bold text-white">
          {{ formatNumber(store.currentLevel?.smallBlind ?? 0) }} / {{ formatNumber(store.currentLevel?.bigBlind ?? 0) }}
        </div>
        <div v-if="store.useAnte && store.currentLevel?.ante" class="text-2xl text-yellow-400 mt-2">
          Ante: {{ formatNumber(store.currentLevel.ante) }}
        </div>
      </div>

      <!-- Next Level -->
      <div v-if="store.nextLevel && !store.nextLevel.isBreak" class="text-center pt-4 border-t border-gray-700">
        <div class="text-gray-500 text-sm uppercase tracking-wider mb-1">Další level</div>
        <div class="text-xl text-gray-400">
          {{ formatNumber(store.nextLevel.smallBlind) }} / {{ formatNumber(store.nextLevel.bigBlind) }}
          <span v-if="store.useAnte && store.nextLevel.ante" class="text-yellow-600">
            (Ante: {{ formatNumber(store.nextLevel.ante) }})
          </span>
        </div>
      </div>
      <div v-else-if="store.nextLevel?.isBreak" class="text-center pt-4 border-t border-gray-700">
        <div class="text-gray-500 text-sm uppercase tracking-wider mb-1">Další</div>
        <div class="text-xl text-green-500">PŘESTÁVKA</div>
      </div>
    </div>
  </div>
</template>
