<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'
import { useCurrency } from '@/composables/useCurrency'

const store = useTournamentStore()
const { format } = useCurrency()

function formatNumber(num: number): string {
  return num.toLocaleString('cs-CZ')
}
</script>

<template>
  <div class="grid grid-cols-4 gap-1 sm:gap-2 lg:gap-4 text-center h-full">
    <div class="bg-gray-700 lg:bg-gray-800 rounded flex flex-col justify-center p-1 sm:p-2 landscape:p-1 lg:p-3">
      <div class="text-gray-400 text-[10px] lg:text-sm uppercase tracking-wider leading-tight">{{ $t('stats.players') }}</div>
      <div class="text-2xl lg:text-2xl font-bold leading-tight">
        {{ store.activePlayers }}/{{ store.totalPlayers }}
      </div>
    </div>

    <div class="bg-gray-700 lg:bg-gray-800 rounded flex flex-col justify-center p-1 sm:p-2 landscape:p-1 lg:p-3">
      <div class="text-gray-400 text-[10px] lg:text-sm uppercase tracking-wider leading-tight">{{ $t('stats.avgStack') }}</div>
      <div class="text-2xl lg:text-2xl font-bold leading-tight">
        {{ formatNumber(store.averageStack) }}
      </div>
    </div>

    <div class="bg-gray-700 lg:bg-gray-800 rounded flex flex-col justify-center p-1 sm:p-2 landscape:p-1 lg:p-3">
      <div class="text-gray-400 text-[10px] lg:text-sm uppercase tracking-wider leading-tight">{{ $t('stats.chips') }}</div>
      <div class="text-2xl lg:text-2xl font-bold leading-tight">
        {{ formatNumber(store.totalChips) }}
      </div>
    </div>

    <div class="bg-gray-700 lg:bg-gray-800 rounded flex flex-col justify-center p-1 sm:p-2 landscape:p-1 lg:p-3">
      <div class="text-gray-400 text-[10px] lg:text-sm uppercase tracking-wider leading-tight">{{ $t('stats.prize') }}</div>
      <div class="text-2xl lg:text-2xl font-bold text-green-400 leading-tight">
        {{ format(store.prizePool, store.currency) }}
      </div>
    </div>
  </div>
</template>
