<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTournamentStore } from '@/stores/tournament'
import { useCurrency } from '@/composables/useCurrency'
import ConfirmDialog from './ConfirmDialog.vue'

const store = useTournamentStore()
const { t } = useI18n()
const { format } = useCurrency()
const newPlayerName = ref('')
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

function addPlayer() {
  if (newPlayerName.value.trim()) {
    store.addPlayer(newPlayerName.value.trim())
    newPlayerName.value = ''
  }
}

async function removePlayer(id: string, name: string) {
  const confirmed = await confirmDialog.value?.open({
    title: t('players.removeTitle'),
    message: t('players.removeConfirm', { name }),
    confirmText: t('common.remove'),
    cancelText: t('common.cancel'),
    danger: true,
  })
  if (confirmed) {
    store.removePlayer(id)
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString('cs-CZ')
}

// Rebuy allowed only in first hour and if enabled
const canRebuy = computed(() => {
  return store.allowRebuy && store.elapsedSeconds < 3600
})

// Prize distribution based on number of players
const prizeDistribution = computed(() => {
  const playerCount = store.totalPlayers
  const pool = store.prizePool

  if (playerCount < 2 || pool === 0) return []

  // Define payout percentages based on player count
  let percentages: number[] = []

  if (playerCount === 2) {
    percentages = [100]
  } else if (playerCount <= 4) {
    percentages = [65, 35]
  } else if (playerCount <= 6) {
    percentages = [50, 30, 20]
  } else if (playerCount <= 10) {
    percentages = [50, 25, 15, 10]
  } else {
    percentages = [45, 25, 15, 10, 5]
  }

  return percentages.map((pct, index) => {
    const place = index + 1
    // Find player who finished in this position
    const finisher = store.finishOrder.find(f => f.position === place)
    return {
      place,
      percentage: pct,
      amount: Math.round(pool * pct / 100),
      playerName: finisher?.name || null
    }
  })
})
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b border-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span class="font-medium">{{ $t('players.title') }}</span>
      <span class="text-gray-400 text-sm">({{ store.activePlayers }}/{{ store.totalPlayers }})</span>
    </div>

    <!-- Add Player -->
    <div class="p-4 border-b border-gray-700 shrink-0">
      <form @submit.prevent="addPlayer" class="flex gap-2">
        <input
          v-model="newPlayerName"
          type="text"
          :placeholder="$t('players.namePlaceholder')"
          class="flex-1 px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
        />
        <button
          type="submit"
          :disabled="!newPlayerName.trim()"
          class="px-5 py-2 bg-green-700 hover:bg-green-600 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          {{ $t('common.add') }}
        </button>
      </form>
    </div>

    <!-- Content wrapper -->
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- Player List -->
      <div class="overflow-y-auto" style="flex: 1 1 auto; min-height: 80px;">
        <div
          v-for="player in store.players"
          :key="player.id"
          class="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0"
        >
          <div class="flex-1" :class="{ 'opacity-50': player.isBusted }">
            <div class="font-medium" :class="{ 'line-through': player.isBusted }">
              {{ player.name }}
            </div>
            <div class="text-sm text-gray-400">
              {{ formatNumber(player.stack) }} {{ $t('players.chips') }}
              <span v-if="player.buyinCount > 1" class="text-yellow-500">
                ({{ $t('players.buyinCount', { count: player.buyinCount }) }})
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Bust/Rebuy -->
            <button
              v-if="!player.isBusted"
              @click="store.bustPlayer(player.id)"
              class="px-2 py-1 text-xs bg-red-700 hover:bg-red-600 rounded transition-colors"
              :title="$t('players.bust')"
            >
              {{ $t('players.bust') }}
            </button>
            <button
              v-else-if="canRebuy"
              @click="store.rebuyPlayer(player.id)"
              class="px-2 py-1 text-xs bg-green-700 hover:bg-green-600 rounded transition-colors"
              :title="$t('players.rebuy')"
            >
              {{ $t('players.rebuy') }}
            </button>

            <!-- Remove -->
            <button
              @click="removePlayer(player.id, player.name)"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              :title="$t('players.removeTitle')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="store.players.length === 0" class="p-4 text-center text-gray-500">
          {{ $t('players.noPlayers') }}
        </div>
      </div>

      <!-- Prize Distribution -->
      <div class="border-t border-gray-700 flex flex-col bg-gray-800" style="flex: 0 1 auto; max-height: 50%;">
        <div class="flex items-center gap-2 text-sm text-gray-400 p-3 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ $t('payouts.title') }} ({{ format(store.prizePool, store.currency) }})</span>
        </div>
        <div v-if="prizeDistribution.length > 0" class="overflow-y-auto px-3 pb-3 space-y-1.5">
          <div
            v-for="prize in prizeDistribution"
            :key="prize.place"
            class="flex items-center justify-between text-sm"
            :class="{ 'bg-gray-700/50 -mx-2 px-2 py-1 rounded': prize.playerName }"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                :class="{
                  'bg-yellow-500 text-black': prize.place === 1,
                  'bg-gray-400 text-black': prize.place === 2,
                  'bg-amber-700 text-white': prize.place === 3,
                  'bg-gray-600 text-white': prize.place > 3
                }"
              >
                {{ prize.place }}.
              </span>
              <span v-if="prize.playerName" class="text-white font-medium">{{ prize.playerName }}</span>
              <span v-else class="text-gray-500">{{ prize.percentage }}%</span>
            </div>
            <span class="text-white font-medium">{{ format(prize.amount, store.currency) }}</span>
          </div>
        </div>
        <div v-else class="px-3 pb-3 text-sm text-gray-500">
          {{ $t('payouts.minPlayers') }}
        </div>
      </div>
    </div>
  </div>
  <ConfirmDialog ref="confirmDialog" />
</template>
