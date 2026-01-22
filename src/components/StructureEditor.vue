<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import type { BlindLevel } from '@/types/poker'
import ConfirmDialog from './ConfirmDialog.vue'
import draggable from 'vuedraggable'

const store = useTournamentStore()

const structureList = computed({
  get: () => store.structure,
  set: (value: BlindLevel[]) => store.setStructure(value)
})
const editingLevel = ref<number | null>(null)
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

const editForm = ref({
  smallBlind: 0,
  bigBlind: 0,
  ante: 0,
  duration: 20,
  isBreak: false,
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  return `${mins} min`
}

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000) + 'K'
  return num.toString()
}

function startEdit(index: number) {
  const level = store.structure[index]
  if (!level) return
  editForm.value = {
    smallBlind: level.smallBlind,
    bigBlind: level.bigBlind,
    ante: level.ante,
    duration: level.duration / 60,
    isBreak: level.isBreak || false,
  }
  editingLevel.value = index
}

function saveEdit() {
  if (editingLevel.value === null) return

  const currentLevel = store.structure[editingLevel.value]
  if (!currentLevel) return

  const newStructure = [...store.structure]
  newStructure[editingLevel.value] = {
    id: currentLevel.id,
    smallBlind: editForm.value.smallBlind,
    bigBlind: editForm.value.bigBlind,
    ante: editForm.value.ante,
    duration: editForm.value.duration * 60,
    isBreak: editForm.value.isBreak,
  }
  store.setStructure(newStructure)
  editingLevel.value = null
}

function cancelEdit() {
  editingLevel.value = null
}

function adjustSmallBlind(amount: number) {
  editForm.value.smallBlind = Math.max(0, editForm.value.smallBlind + amount)
}

function adjustBigBlind(amount: number) {
  editForm.value.bigBlind = Math.max(0, editForm.value.bigBlind + amount)
}

function adjustAnte(amount: number) {
  editForm.value.ante = Math.max(0, editForm.value.ante + amount)
}

function adjustDuration(amount: number) {
  editForm.value.duration = Math.max(1, editForm.value.duration + amount)
}

function addLevel() {
  const lastLevel = store.structure[store.structure.length - 1]
  const newLevel: BlindLevel = {
    id: store.structure.length + 1,
    smallBlind: lastLevel ? Math.round(lastLevel.smallBlind * 1.5) : 25,
    bigBlind: lastLevel ? Math.round(lastLevel.bigBlind * 1.5) : 50,
    ante: lastLevel ? Math.round(lastLevel.ante * 1.5) : 0,
    duration: 1200,
  }
  store.setStructure([...store.structure, newLevel])
}

function addBreak() {
  const newBreak: BlindLevel = {
    id: store.structure.length + 1,
    smallBlind: 0,
    bigBlind: 0,
    ante: 0,
    duration: 600,
    isBreak: true,
    breakMessage: 'Přestávka',
  }
  store.setStructure([...store.structure, newBreak])
}

async function removeLevel(index: number) {
  const level = store.structure[index]
  const levelName = level?.isBreak ? 'přestávku' : `level ${index + 1}`

  const confirmed = await confirmDialog.value?.open({
    title: 'Odebrat level',
    message: `Opravdu chceš odebrat ${levelName}?`,
    confirmText: 'Odebrat',
    cancelText: 'Zrušit',
    danger: true,
  })
  if (confirmed) {
    const newStructure = store.structure.filter((_, i) => i !== index)
    store.setStructure(newStructure)
  }
}

async function resetStructure() {
  const confirmed = await confirmDialog.value?.open({
    title: 'Obnovit výchozí strukturu',
    message: 'Opravdu chceš obnovit výchozí strukturu blindů? Všechny úpravy budou ztraceny.',
    confirmText: 'Obnovit',
    cancelText: 'Zrušit',
    danger: true,
  })
  if (confirmed) {
    store.resetStructure()
  }
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span class="font-medium">Blindy</span>
        <span class="text-gray-400">({{ store.structure.length }})</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 cursor-pointer" title="Přestávky">
          <div class="relative inline-flex items-center">
            <input
              type="checkbox"
              v-model="store.useBreaks"
              class="sr-only peer"
            />
            <div class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
          </div>
          <span class="text-sm text-white">Přestávky</span>
        </label>
        <button
          @click="resetStructure"
          class="px-2 py-1 text-sm bg-red-800 hover:bg-red-700 rounded transition-colors"
          title="Obnovit výchozí"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Level List -->
    <draggable
      v-model="structureList"
      item-key="id"
      handle=".drag-handle"
      class="flex-1 overflow-y-auto"
      ghost-class="opacity-50"
    >
      <template #item="{ element: level, index }">
        <div
          v-show="!level.isBreak || store.useBreaks"
          class="border-b border-gray-700 last:border-b-0"
          :class="{
            'bg-gray-700/50': index === store.currentLevelIndex,
            'bg-green-900/20': level.isBreak
          }"
        >
          <!-- View Mode -->
          <div v-if="editingLevel !== index" class="flex items-center justify-between p-3">
            <div class="flex items-center gap-3">
              <!-- Drag Handle -->
              <div class="drag-handle cursor-grab active:cursor-grabbing p-1 -m-1 text-gray-500 hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>
              <span class="text-gray-500 text-sm w-6">{{ index + 1 }}.</span>
              <div v-if="level.isBreak" class="text-green-400">
                PŘESTÁVKA ({{ formatTime(level.duration) }})
              </div>
              <div v-else>
                <span class="font-medium">{{ formatNumber(level.smallBlind) }}/{{ formatNumber(level.bigBlind) }}</span>
                <span v-if="store.useAnte && level.ante" class="text-yellow-500 text-sm ml-2">A:{{ formatNumber(level.ante) }}</span>
                <span class="text-gray-500 text-sm ml-2">({{ formatTime(level.duration) }})</span>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button @click="startEdit(index)" class="p-1 text-gray-400 hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="removeLevel(index)" class="p-1 text-gray-400 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="p-4 bg-gray-700">
            <div class="grid grid-cols-3 gap-3 mb-4" :class="{ 'grid-cols-4': store.useAnte }">
              <!-- Small Blind -->
              <div>
                <label class="block text-sm text-gray-400 mb-1 text-center">SB</label>
                <div class="flex items-stretch bg-gray-600 rounded-lg overflow-hidden">
                  <button @click="adjustSmallBlind(-25)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">&minus;</button>
                  <input v-model.number="editForm.smallBlind" type="number" class="w-full py-2 bg-gray-600 text-white text-center text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button @click="adjustSmallBlind(25)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">+</button>
                </div>
              </div>
              <!-- Big Blind -->
              <div>
                <label class="block text-sm text-gray-400 mb-1 text-center">BB</label>
                <div class="flex items-stretch bg-gray-600 rounded-lg overflow-hidden">
                  <button @click="adjustBigBlind(-50)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">&minus;</button>
                  <input v-model.number="editForm.bigBlind" type="number" class="w-full py-2 bg-gray-600 text-white text-center text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button @click="adjustBigBlind(50)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">+</button>
                </div>
              </div>
              <!-- Ante -->
              <div v-if="store.useAnte">
                <label class="block text-sm text-gray-400 mb-1 text-center">Ante</label>
                <div class="flex items-stretch bg-gray-600 rounded-lg overflow-hidden">
                  <button @click="adjustAnte(-25)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">&minus;</button>
                  <input v-model.number="editForm.ante" type="number" class="w-full py-2 bg-gray-600 text-white text-center text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button @click="adjustAnte(25)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">+</button>
                </div>
              </div>
              <!-- Délka -->
              <div>
                <label class="block text-sm text-gray-400 mb-1 text-center">Čas</label>
                <div class="flex items-stretch bg-gray-600 rounded-lg overflow-hidden">
                  <button @click="adjustDuration(-5)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">&minus;</button>
                  <input v-model.number="editForm.duration" type="number" class="w-full py-2 bg-gray-600 text-white text-center text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button @click="adjustDuration(5)" class="w-10 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-base font-bold transition-colors">+</button>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button @click="cancelEdit" class="px-5 py-2 bg-gray-600 hover:bg-gray-500 active:bg-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all">Zrušit</button>
              <button @click="saveEdit" class="px-5 py-2 bg-green-700 hover:bg-green-600 active:bg-green-800 rounded-lg font-medium shadow-md hover:shadow-lg transition-all">Uložit</button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <!-- Actions -->
    <div class="p-3 border-t border-gray-700 flex gap-2">
      <button @click="addLevel" class="flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors">
        + Level
      </button>
      <button @click="addBreak" class="flex-1 px-3 py-2 text-sm bg-green-800 hover:bg-green-700 rounded transition-colors">
        + Přestávka
      </button>
    </div>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
