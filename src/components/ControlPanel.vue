<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'

const store = useTournamentStore()
</script>

<template>
  <div class="flex flex-col items-center gap-3 lg:gap-4">
    <!-- Main Controls -->
    <div class="flex items-center gap-4 lg:gap-6">
      <!-- Previous Level -->
      <button
        @click="store.goToPreviousLevel"
        :disabled="store.currentLevelIndex === 0"
        class="p-3 lg:p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        :title="$t('controls.prevLevel')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 lg:h-8 lg:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Play/Pause -->
      <button
        @click="store.toggle"
        class="p-6 lg:p-8 rounded-full bg-green-600 hover:bg-green-500 transition-colors"
        :title="store.isRunning ? $t('controls.pause') : $t('controls.start')"
      >
        <!-- Play Icon (rounded triangle) -->
        <svg v-if="!store.isRunning" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 lg:h-14 lg:w-14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.14v13.72c0 1.04 1.13 1.69 2.03 1.17l10.84-6.86c.87-.55.87-1.79 0-2.34L10.03 3.97C9.13 3.45 8 4.1 8 5.14z" />
        </svg>
        <!-- Pause Icon (rounded bars) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 lg:h-14 lg:w-14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4a2 2 0 0 1 2 2v12a2 2 0 1 1-4 0V6a2 2 0 0 1 2-2zm12 0a2 2 0 0 1 2 2v12a2 2 0 1 1-4 0V6a2 2 0 0 1 2-2z" />
        </svg>
      </button>

      <!-- Next Level -->
      <button
        @click="store.goToNextLevel"
        :disabled="store.currentLevelIndex >= store.totalLevels - 1"
        class="p-3 lg:p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        :title="$t('controls.nextLevel')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 lg:h-8 lg:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Time Adjustments -->
    <div class="flex items-center gap-2 lg:gap-3 mt-6 lg:mt-4">
      <button
        @click="store.adjustTime(-60)"
        class="px-3 lg:px-4 py-2 lg:py-2 text-base lg:text-lg rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-colors"
      >
        &minus;1 min
      </button>
      <button
        @click="store.adjustTime(-10)"
        class="px-3 lg:px-4 py-2 lg:py-2 text-base lg:text-lg rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-colors"
      >
        &minus;10s
      </button>
      <button
        @click="store.adjustTime(10)"
        class="px-3 lg:px-4 py-2 lg:py-2 text-base lg:text-lg rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-colors"
      >
        +10s
      </button>
      <button
        @click="store.adjustTime(60)"
        class="px-3 lg:px-4 py-2 lg:py-2 text-base lg:text-lg rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-colors"
      >
        +1 min
      </button>
    </div>
  </div>
</template>
