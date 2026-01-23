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
    <div v-if="store.isBreak" class="text-center py-2 sm:py-4 md:py-8">
      <div class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-green-400 mb-1 sm:mb-2 md:mb-4">
        {{ $t('timer.break') }}
      </div>
      <div v-if="store.currentLevel?.breakMessage" class="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300">
        {{ store.currentLevel.breakMessage }}
      </div>
    </div>

    <!-- Blinds -->
    <div v-else class="space-y-1 sm:space-y-3 lg:space-y-4">
      <!-- Current Blinds -->
      <div class="text-center">
        <div class="text-gray-400 text-sm lg:text-base uppercase tracking-wider mb-1">{{ $t('blinds.title') }}</div>
        <div class="text-4xl lg:text-5xl font-bold text-white">
          {{ formatNumber(store.currentLevel?.smallBlind ?? 0) }} / {{ formatNumber(store.currentLevel?.bigBlind ?? 0) }}
        </div>
        <div v-if="store.useAnte && store.currentLevel?.ante" class="text-xl lg:text-2xl text-yellow-400 mt-1">
          {{ $t('blinds.ante') }}: {{ formatNumber(store.currentLevel.ante) }}
        </div>
      </div>

      <!-- Next Level -->
      <div v-if="store.nextLevel && !store.nextLevel.isBreak" class="text-center pt-1 sm:pt-3 lg:pt-4 border-t border-gray-700">
        <div class="text-gray-500 text-xs lg:text-sm uppercase tracking-wider mb-0.5">{{ $t('blinds.nextLevel') }}</div>
        <div class="text-lg lg:text-xl text-gray-400">
          {{ formatNumber(store.nextLevel.smallBlind) }} / {{ formatNumber(store.nextLevel.bigBlind) }}
          <span v-if="store.useAnte && store.nextLevel.ante" class="text-yellow-600">
            ({{ $t('blinds.ante') }}: {{ formatNumber(store.nextLevel.ante) }})
          </span>
        </div>
      </div>
      <div v-else-if="store.nextLevel?.isBreak" class="text-center pt-1 sm:pt-3 lg:pt-4 border-t border-gray-700">
        <div class="text-gray-500 text-xs lg:text-sm uppercase tracking-wider mb-0.5">{{ $t('blinds.next') }}</div>
        <div class="text-lg lg:text-xl text-green-500">{{ $t('timer.break') }}</div>
      </div>
    </div>
  </div>
</template>
