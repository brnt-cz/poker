<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'

const store = useTournamentStore()

function formatNumber(num: number): string {
  return num.toLocaleString('cs-CZ')
}
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-gray-400 text-xs uppercase tracking-wider">Hraci</div>
      <div class="text-2xl font-bold">
        {{ store.activePlayers }} / {{ store.totalPlayers }}
      </div>
    </div>

    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-gray-400 text-xs uppercase tracking-wider">Prumerny stack</div>
      <div class="text-2xl font-bold">
        {{ formatNumber(store.averageStack) }}
      </div>
    </div>

    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-gray-400 text-xs uppercase tracking-wider">Celkem chipu</div>
      <div class="text-2xl font-bold">
        {{ formatNumber(store.totalChips) }}
      </div>
    </div>

    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-gray-400 text-xs uppercase tracking-wider">Prize pool</div>
      <div class="text-2xl font-bold text-green-400">
        {{ formatNumber(store.prizePool) }} Kc
      </div>
    </div>
  </div>
</template>
