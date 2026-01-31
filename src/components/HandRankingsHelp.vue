<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

// Hand rankings from highest to lowest
const handRankings = [
  { key: 'royalFlush', cards: ['A♠', 'K♠', 'Q♠', 'J♠', '10♠'] },
  { key: 'straightFlush', cards: ['9♥', '8♥', '7♥', '6♥', '5♥'] },
  { key: 'fourOfAKind', cards: ['K♣', 'K♦', 'K♥', 'K♠', '2♦'] },
  { key: 'fullHouse', cards: ['Q♠', 'Q♥', 'Q♦', '7♣', '7♠'] },
  { key: 'flush', cards: ['A♦', 'J♦', '8♦', '6♦', '3♦'] },
  { key: 'straight', cards: ['10♠', '9♦', '8♥', '7♣', '6♠'] },
  { key: 'threeOfAKind', cards: ['8♠', '8♥', '8♦', 'K♣', '4♠'] },
  { key: 'twoPair', cards: ['J♥', 'J♠', '5♦', '5♣', 'A♠'] },
  { key: 'onePair', cards: ['10♦', '10♠', 'A♥', '7♣', '3♦'] },
  { key: 'highCard', cards: ['A♠', 'Q♦', '9♥', '6♣', '3♠'] },
]

function getCardColor(card: string): string {
  return card.includes('♥') || card.includes('♦') ? 'text-red-500' : 'text-gray-900'
}
</script>

<template>
  <!-- Toggle Button -->
  <button
    @click="open"
    class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
    :title="t('help.title')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="close"
      />
    </Transition>

    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-4 sm:inset-10 lg:inset-20 bg-gray-900 text-white z-50 shadow-2xl rounded-xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-5rem)]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 shrink-0">
          <h2 class="text-lg sm:text-xl font-bold">{{ t('help.title') }}</h2>
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
        <div class="flex-1 overflow-y-auto p-3 sm:p-4">
          <div class="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <div
              v-for="(hand, index) in handRankings"
              :key="hand.key"
              class="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-gray-800 rounded-lg"
            >
              <!-- Rank number -->
              <div class="w-6 sm:w-8 text-center text-gray-500 font-bold text-base sm:text-xl">
                {{ index + 1 }}.
              </div>

              <!-- Cards -->
              <div class="flex gap-0.5 sm:gap-1 shrink-0">
                <div
                  v-for="(card, cardIndex) in hand.cards"
                  :key="cardIndex"
                  class="w-8 h-11 sm:w-10 sm:h-14 bg-white rounded flex items-center justify-center text-lg sm:text-2xl font-bold shadow-md"
                  :class="getCardColor(card)"
                >
                  {{ card }}
                </div>
              </div>

              <!-- Name -->
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm sm:text-base truncate">{{ t(`help.hands.${hand.key}.name`) }}</div>
                <div class="text-xs sm:text-sm text-gray-400 truncate">{{ t(`help.hands.${hand.key}.desc`) }}</div>
              </div>
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
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
