<script setup lang="ts">
import { ref } from 'vue'
import PlayerManager from './PlayerManager.vue'
import ChipSettings from './ChipSettings.vue'
import TournamentSettings from './TournamentSettings.vue'
import StructureEditor from './StructureEditor.vue'
import { useNotifications } from '@/composables/useNotifications'

const isOpen = ref(false)
const showDebug = ref(false)
const debugEnabled = ref(localStorage.getItem('pokerDebug') === 'true')
const notifications = useNotifications()

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <!-- Toggle Button -->
  <button
    @click="toggle"
    class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
    title="Nastavení"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </button>

  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="close"
      />
    </Transition>

    <!-- Modal -->
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 lg:inset-10 xl:inset-20 bg-gray-900 text-white z-50 shadow-2xl lg:rounded-xl flex flex-col max-h-dvh lg:max-h-[calc(100vh-5rem)]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 shrink-0">
          <h2 class="text-lg sm:text-xl font-bold">Nastavení</h2>
          <button
            @click="close"
            class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto">
          <div class="flex flex-col lg:grid lg:grid-cols-3 gap-3 lg:h-full lg:max-h-full lg:overflow-hidden">
            <!-- 2/3: Players + Chips + Tournament -->
            <div class="lg:col-span-2 flex flex-col lg:grid lg:grid-cols-3 gap-3 lg:min-h-0 lg:max-h-full">
              <PlayerManager class="min-h-[280px] lg:min-h-0 lg:max-h-full" />
              <ChipSettings class="min-h-[230px] lg:min-h-0 lg:max-h-full" />
              <TournamentSettings class="min-h-[280px] lg:min-h-0 lg:max-h-full" />
            </div>
            <!-- 1/3: Structure -->
            <StructureEditor class="min-h-[320px] lg:min-h-0 lg:max-h-full" />
          </div>

          <!-- Debug zvuků (zapnout: localStorage.setItem('pokerDebug', 'true')) -->
          <div v-if="debugEnabled" class="mt-4 pt-4 border-t border-gray-700">
            <button
              @click="showDebug = !showDebug"
              class="text-sm text-gray-500 hover:text-gray-300"
            >
              {{ showDebug ? '▼' : '▶' }} Debug zvuků
            </button>
            <div v-if="showDebug" class="mt-2 flex flex-wrap gap-2">
              <button
                @click="notifications.notifyWarning()"
                class="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-500 rounded"
              >
                Warning (1 min)
              </button>
              <button
                @click="notifications.notifyCountdown()"
                class="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded"
              >
                Countdown
              </button>
              <button
                @click="notifications.notifyBreak()"
                class="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-500 rounded"
              >
                Break
              </button>
              <button
                @click="notifications.notifyLevelEnd()"
                class="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-500 rounded"
              >
                Level End
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
