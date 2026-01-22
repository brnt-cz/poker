<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'

const store = useTournamentStore()
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Main Controls -->
    <div class="flex items-center gap-4">
      <!-- Previous Level -->
      <button
        @click="store.goToPreviousLevel"
        :disabled="store.currentLevelIndex === 0"
        class="p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Predchozi level"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Play/Pause -->
      <button
        @click="store.toggle"
        class="p-6 rounded-full bg-green-600 hover:bg-green-500 transition-colors"
        :title="store.isRunning ? 'Pauza' : 'Start'"
      >
        <!-- Play Icon -->
        <svg v-if="!store.isRunning" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Pause Icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <!-- Next Level -->
      <button
        @click="store.goToNextLevel"
        :disabled="store.currentLevelIndex >= store.totalLevels - 1"
        class="p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Dalsi level"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Time Adjustments -->
    <div class="flex items-center gap-2 mt-2">
      <button
        @click="store.adjustTime(-60)"
        class="px-3 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        -1 min
      </button>
      <button
        @click="store.adjustTime(-10)"
        class="px-3 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        -10s
      </button>
      <button
        @click="store.adjustTime(10)"
        class="px-3 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        +10s
      </button>
      <button
        @click="store.adjustTime(60)"
        class="px-3 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        +1 min
      </button>
    </div>
  </div>
</template>
