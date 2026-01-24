<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTournamentStore } from '@/stores/tournament'
import { useCurrency } from '@/composables/useCurrency'
import ConfirmDialog from './ConfirmDialog.vue'

const store = useTournamentStore()
const { t } = useI18n()
const { getBuyinStep, getBountyStep } = useCurrency()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

async function resetAll() {
  const confirmed = await confirmDialog.value?.open({
    title: t('resetAll.title'),
    message: t('resetAll.confirm'),
    confirmText: t('common.reset'),
    cancelText: t('common.cancel'),
    danger: true,
  })
  if (confirmed) {
    store.resetAll()
  }
}

// Calculate optimal chip distribution based on blind structure
const chipBreakdown = computed(() => {
  const stack = store.startingStack
  const sortedChips = [...store.chips].sort((a, b) => a.value - b.value)
  const breakdown: { id: string; value: number; count: number; color: string; label: string }[] = []

  // Get early blind levels (first 3 non-break levels)
  const earlyBlinds = store.structure
    .filter(l => !l.isBreak)
    .slice(0, 3)
    .flatMap(l => [l.smallBlind, l.bigBlind, l.ante])
    .filter(v => v > 0)

  // Find which chip denominations are needed for early blinds
  const neededDenominations = new Set<number>()
  for (const blind of earlyBlinds) {
    for (const chip of sortedChips) {
      if (blind % chip.value === 0 || chip.value <= blind) {
        neededDenominations.add(chip.value)
      }
    }
  }

  let remaining = stack
  const distributions: Record<string, number> = {}

  // Scale chip counts based on stack size (base counts for 10,000 stack)
  const scaleFactor = Math.max(1, stack / 10000)

  // Ensure enough small chips for early game (scales with stack)
  // Give more chips to smaller denominations needed for blinds
  for (let i = 0; i < sortedChips.length; i++) {
    const chip = sortedChips[i]
    if (!chip) continue

    let baseCount = 0
    if (i === 0) {
      // Smallest denomination: base 12 chips for SB payments
      baseCount = 12
    } else if (i === 1) {
      // Second smallest: base 10 chips
      baseCount = 10
    } else if (i === 2) {
      // Third smallest: base 8 chips
      baseCount = 8
    } else if (neededDenominations.has(chip.value)) {
      // Other denominations needed for blinds: base 4 chips
      baseCount = 4
    }

    // Scale with stack size
    const minCount = Math.round(baseCount * scaleFactor)

    // Don't exceed what we can afford
    const maxAffordable = Math.floor(remaining / chip.value)
    const count = Math.min(minCount, maxAffordable)

    if (count > 0) {
      distributions[chip.id] = count
      remaining -= count * chip.value
    }
  }

  // Fill rest with highest denominations first
  for (let i = sortedChips.length - 1; i >= 0; i--) {
    const chip = sortedChips[i]
    if (!chip) continue
    const additionalCount = Math.floor(remaining / chip.value)
    if (additionalCount > 0) {
      distributions[chip.id] = (distributions[chip.id] || 0) + additionalCount
      remaining -= additionalCount * chip.value
    }
  }

  for (const chip of sortedChips) {
    const count = distributions[chip.id] || 0
    if (count > 0) {
      breakdown.push({
        id: chip.id,
        value: chip.value,
        count,
        color: chip.color,
        label: chip.label,
      })
    }
  }

  return breakdown
})

const totalFromBreakdown = computed(() => {
  return chipBreakdown.value.reduce((sum, chip) => sum + chip.value * chip.count, 0)
})

function formatNumber(num: number): string {
  return num.toLocaleString('cs-CZ')
}

function formatChipValue(value: number): string {
  if (value >= 1000) return (value / 1000) + 'K'
  return value.toString()
}

const buyinStep = computed(() => getBuyinStep(store.currency))
const bountyStep = computed(() => getBountyStep(store.currency))

function adjustBuyin(amount: number) {
  store.buyinAmount = Math.max(0, store.buyinAmount + amount)
}

function adjustStack(amount: number) {
  store.startingStack = Math.max(1000, store.startingStack + amount)
}

function adjustBounty(amount: number) {
  store.bountyAmount = Math.max(0, store.bountyAmount + amount)
}

function adjustLevelDuration(amount: number) {
  store.levelDuration = Math.max(60, store.levelDuration + amount)
}

function adjustBreakDuration(amount: number) {
  store.breakDuration = Math.max(60, store.breakDuration + amount)
}

function formatDuration(seconds: number): number {
  return Math.floor(seconds / 60)
}

function setLevelDuration(minutes: number) {
  store.levelDuration = Math.max(1, minutes) * 60
}

function setBreakDuration(minutes: number) {
  store.breakDuration = Math.max(1, minutes) * 60
}

</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="font-medium">{{ $t('settings.tournament') }}</span>
      </div>
      <button
        @click="resetAll"
        class="px-2 py-1 text-sm bg-red-800 hover:bg-red-700 rounded transition-colors"
        :title="$t('resetAll.title')"
      >
        {{ $t('common.reset') }}
      </button>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-4 flex-1 overflow-y-auto">
      <!-- Buy-in & Bounty -->
      <div class="grid gap-3" :class="store.useBounty ? 'grid-cols-2' : 'grid-cols-1'">
        <!-- Buy-in -->
        <div>
          <label class="block text-sm text-gray-400 mb-2">{{ $t('settings.buyin') }}</label>
          <div class="flex items-stretch bg-gray-700 rounded-lg overflow-hidden">
            <button
              @click="adjustBuyin(-buyinStep)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              &minus;
            </button>
            <input
              v-model.number="store.buyinAmount"
              type="number"
              min="0"
              :step="buyinStep"
              class="flex-1 min-w-0 px-2 py-2 bg-gray-700 text-white text-center font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              @click="adjustBuyin(buyinStep)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              +
            </button>
          </div>
        </div>

        <!-- Bounty Amount -->
        <div v-if="store.useBounty">
          <label class="block text-sm text-gray-400 mb-2">{{ $t('settings.bounty') }}</label>
          <div class="flex items-stretch bg-gray-700 rounded-lg overflow-hidden">
            <button
              @click="adjustBounty(-bountyStep)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              &minus;
            </button>
            <input
              v-model.number="store.bountyAmount"
              type="number"
              min="0"
              :step="bountyStep"
              class="flex-1 min-w-0 px-2 py-2 bg-gray-700 text-white text-center font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              @click="adjustBounty(bountyStep)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Starting Stack -->
      <div>
        <label class="block text-sm text-gray-400 mb-2">{{ $t('settings.startingStack') }}</label>
        <div class="flex items-stretch bg-gray-700 rounded-lg overflow-hidden">
          <button
            @click="adjustStack(-1000)"
            class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors"
          >
            &minus;
          </button>
          <input
            v-model.number="store.startingStack"
            type="number"
            min="1000"
            step="1000"
            class="flex-1 px-3 py-2 bg-gray-700 text-white text-center font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            @click="adjustStack(1000)"
            class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <!-- Level & Break Duration -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Level Duration -->
        <div>
          <label class="block text-sm text-gray-400 mb-2">{{ $t('settings.levelDuration') }}</label>
          <div class="flex items-stretch bg-gray-700 rounded-lg overflow-hidden">
            <button
              @click="adjustLevelDuration(-60)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              &minus;
            </button>
            <input
              :value="formatDuration(store.levelDuration)"
              @input="setLevelDuration(Number(($event.target as HTMLInputElement).value))"
              type="number"
              min="1"
              class="flex-1 min-w-0 px-2 py-2 bg-gray-700 text-white text-center font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              @click="adjustLevelDuration(60)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              +
            </button>
          </div>
        </div>

        <!-- Break Duration -->
        <div>
          <label class="block text-sm text-gray-400 mb-2">{{ $t('settings.breakDuration') }}</label>
          <div class="flex items-stretch bg-gray-700 rounded-lg overflow-hidden">
            <button
              @click="adjustBreakDuration(-60)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              &minus;
            </button>
            <input
              :value="formatDuration(store.breakDuration)"
              @input="setBreakDuration(Number(($event.target as HTMLInputElement).value))"
              type="number"
              min="1"
              class="flex-1 min-w-0 px-2 py-2 bg-gray-700 text-white text-center font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              @click="adjustBreakDuration(60)"
              class="w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-xl font-bold transition-colors shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <!-- Use Ante -->
        <label class="flex items-center gap-2 cursor-pointer">
          <div class="relative inline-flex items-center">
            <input
              type="checkbox"
              v-model="store.useAnte"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </div>
          <span class="text-sm text-gray-300">{{ $t('settings.ante') }}</span>
        </label>

        <!-- Allow Rebuy -->
        <label class="flex items-center gap-2 cursor-pointer">
          <div class="relative inline-flex items-center">
            <input
              type="checkbox"
              v-model="store.allowRebuy"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </div>
          <span class="text-sm text-gray-300">{{ $t('settings.rebuy') }}</span>
        </label>

        <!-- Bounty -->
        <label class="flex items-center gap-2 cursor-pointer">
          <div class="relative inline-flex items-center">
            <input
              type="checkbox"
              v-model="store.useBounty"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </div>
          <span class="text-sm text-gray-300">{{ $t('settings.bounty') }}</span>
        </label>
      </div>

      <!-- Chip Breakdown -->
      <div class="pt-3 border-t border-gray-700">
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="3" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="3" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="21" y2="12" />
          </svg>
          <span>{{ $t('settings.chipBreakdown') }}</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="chip in chipBreakdown"
            :key="chip.id"
            class="flex items-center justify-between text-sm"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full grid place-items-center text-[10px] font-bold shadow-md"
                :style="{ backgroundColor: chip.color, color: chip.color === '#ffffff' || chip.color === '#eab308' ? '#000' : '#fff', outline: (chip.color === '#ffffff' ? '#3b82f6' : 'white') + ' dashed 3px', outlineOffset: '-3px' }"
              >
                <span class="leading-none mt-px">{{ formatChipValue(chip.value) }}</span>
              </div>
              <span class="text-gray-300">{{ chip.label }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-white font-medium">{{ chip.count }}×</span>
              <span class="text-gray-500 w-14 text-right">{{ formatNumber(chip.value * chip.count) }}</span>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
          <span class="text-gray-400">{{ $t('settings.total') }}</span>
          <span class="text-white font-bold">{{ formatNumber(totalFromBreakdown) }}</span>
        </div>
      </div>

    </div>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
