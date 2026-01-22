<script setup lang="ts">
import Timer from '@/components/Timer.vue'
import BlindDisplay from '@/components/BlindDisplay.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import Stats from '@/components/Stats.vue'
import WakeLockToggle from '@/components/WakeLockToggle.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import { useTimer } from '@/composables/useTimer'

// Inicializace timeru (spustí interval sledování)
useTimer()
</script>

<template>
  <div class="min-h-dvh bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between p-3 md:p-4 bg-gray-800 shrink-0">
      <h1 class="text-lg md:text-xl font-bold flex items-center gap-2">
        <img src="/favicon.svg" alt="" class="h-7 w-7" />
        Poker Timer
      </h1>
      <div class="flex items-center gap-2">
        <WakeLockToggle />
        <SettingsDrawer />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-4 gap-6">
      <Timer />
      <BlindDisplay />
      <ControlPanel />
    </main>

    <!-- Footer Stats -->
    <footer class="p-3 md:p-4 bg-gray-800 shrink-0">
      <Stats />
    </footer>
  </div>
</template>
