<script setup lang="ts">
import { onMounted } from 'vue'
import Timer from '@/components/Timer.vue'
import BlindDisplay from '@/components/BlindDisplay.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import Stats from '@/components/Stats.vue'
import WakeLockToggle from '@/components/WakeLockToggle.vue'
import { useTimer } from '@/composables/useTimer'
import { useTournamentStore } from '@/stores/tournament'

const store = useTournamentStore()

// Inicializace timeru (spustí interval sledování)
useTimer()

// Pro testování přidáme pár hráčů
onMounted(() => {
  if (store.players.length === 0) {
    store.addPlayer('Hrac 1')
    store.addPlayer('Hrac 2')
    store.addPlayer('Hrac 3')
    store.addPlayer('Hrac 4')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between p-4 bg-gray-800">
      <h1 class="text-xl font-bold">Poker Timer</h1>
      <WakeLockToggle />
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-4 gap-8">
      <!-- Timer -->
      <Timer />

      <!-- Blinds -->
      <BlindDisplay />

      <!-- Controls -->
      <ControlPanel />
    </main>

    <!-- Footer Stats -->
    <footer class="p-4 bg-gray-800">
      <Stats />
    </footer>
  </div>
</template>
