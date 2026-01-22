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
  <div class="h-svh lg:h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
    <!-- Header + Main -->
    <div class="h-[88svh] landscape:h-[84svh] lg:flex-1 flex flex-col">
      <!-- Header -->
      <header class="absolute lg:top-0 lg:right-0 flex items-center justify-between lg:justify-end px-2 py-1 sm:px-3 sm:py-2 lg:p-4 shrink-0 lg:z-10">
        <h1 class="text-base md:text-xl font-bold flex items-center gap-2 landscape:hidden lg:hidden">
          <img src="/favicon.svg" alt="" class="hidden sm:flex h-8 w-8 md:h-9 md:w-9" />
          <span class="hidden sm:inline">Poker Timer</span>
        </h1>
        <div class="flex items-center gap-1 sm:gap-2 landscape:ml-0">
          <WakeLockToggle class="lg:hidden" />
          <SettingsDrawer />
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col items-center justify-center px-1 gap-1 sm:gap-3 lg:gap-4 min-h-0 landscape:flex-row landscape:gap-4 lg:landscape:gap-8">
        <div class="flex flex-col items-center landscape:flex-1 landscape:justify-center">
          <Timer />
        </div>
        <div class="flex flex-col items-center gap-1 sm:gap-3 lg:gap-2 landscape:flex-1 landscape:justify-center">
          <BlindDisplay />
          <ControlPanel />
        </div>
      </main>
    </div>

    <!-- Footer Stats -->
    <footer class="h-[12svh] landscape:h-[16svh] lg:h-auto flex items-center px-1 pb-3 sm:p-2 md:p-1 bg-gray-800 shrink-0">
      <Stats class="w-full" />
    </footer>
  </div>
</template>
