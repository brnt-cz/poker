<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTournamentStore } from '@/stores/tournament'
import ConfirmDialog from './ConfirmDialog.vue'

const store = useTournamentStore()
const { t } = useI18n()
const editingChipId = ref<string | null>(null)
const dropdownPosition = ref({ top: 0, left: 0 })
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)

async function removeChip(id: string, label: string) {
  const confirmed = await confirmDialog.value?.open({
    title: t('chips.removeTitle'),
    message: t('chips.removeConfirm', { label }),
    confirmText: t('common.remove'),
    cancelText: t('common.cancel'),
    danger: true,
  })
  if (confirmed) {
    store.removeChip(id)
  }
}

async function resetChips() {
  const confirmed = await confirmDialog.value?.open({
    title: t('chips.restoreTitle'),
    message: t('chips.restoreConfirm'),
    confirmText: t('common.restore'),
    cancelText: t('common.cancel'),
    danger: true,
  })
  if (confirmed) {
    store.resetChips()
  }
}

function startEditChip(id: string, event: MouseEvent) {
  if (editingChipId.value === id) {
    editingChipId.value = null
  } else {
    const button = event.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    }
    editingChipId.value = id
  }
}

function stopEditChip() {
  editingChipId.value = null
}

const availableColors = computed(() => [
  { value: '#ffffff', label: t('colors.white') },
  { value: '#ef4444', label: t('colors.red') },
  { value: '#3b82f6', label: t('colors.blue') },
  { value: '#16a34a', label: t('colors.green') },
  { value: '#181a1c', label: t('colors.black') },
  { value: '#9333ea', label: t('colors.purple') },
  { value: '#eab308', label: t('colors.yellow') },
  { value: '#f97316', label: t('colors.orange') },
  { value: '#ec4899', label: t('colors.pink') },
  { value: '#6b7280', label: t('colors.gray') },
  { value: '#06b6d4', label: t('colors.turquoise') },
  { value: '#92400e', label: t('colors.brown') },
])
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="3" x2="12" y2="7" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="3" y1="12" x2="7" y2="12" />
          <line x1="17" y1="12" x2="21" y2="12" />
        </svg>
        <span class="font-medium">{{ $t('chips.title') }}</span>
      </div>
      <div class="flex gap-1">
        <button
          @click="store.addChip"
          class="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-bold rounded transition-colors"
          :title="$t('chips.addChip')"
        >
          +
        </button>
        <button
          @click="resetChips"
          class="px-2 py-1 text-sm bg-red-800 hover:bg-red-700 rounded transition-colors"
          :title="$t('chips.restoreDefault')"
        >
          {{ $t('common.reset') }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 overflow-y-auto">
      <div class="space-y-3">
        <div
          v-for="chip in store.chips"
          :key="chip.id"
          class="flex items-center gap-3"
        >
          <!-- Color picker -->
          <div class="shrink-0">
            <button
              @click="startEditChip(chip.id, $event)"
              class="w-8 h-8 rounded-full hover:scale-110 transition-transform"
              :style="{ backgroundColor: chip.color, outline: (chip.color === '#ffffff' ? '#3b82f6' : 'white') + ' dashed 4px', outlineOffset: '-4px' }"
              :title="chip.label"
            />
          </div>

          <!-- Value input -->
          <input
            :value="chip.value"
            @change="(e) => store.updateChip(chip.id, { value: parseInt((e.target as HTMLInputElement).value) || chip.value })"
            type="number"
            min="1"
            class="w-20 px-2 py-1.5 bg-gray-700 text-white text-center rounded border border-gray-600 focus:border-primary-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <!-- Remove button -->
          <button
            @click="removeChip(chip.id, chip.label)"
            class="p-1 text-gray-500 hover:text-red-500 transition-colors ml-auto"
            :title="$t('common.remove')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Color dropdown (teleported to body) -->
    <Teleport to="body">
      <template v-if="editingChipId">
        <div class="fixed inset-0 z-[60]" @click="stopEditChip" />
        <div
          class="fixed z-[70] bg-gray-700 rounded-lg p-3 shadow-xl grid grid-cols-4 gap-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:left-auto sm:translate-x-0 sm:translate-y-0 sm:-translate-x-1/2"
          :style="{ '--dropdown-top': dropdownPosition.top + 'px', '--dropdown-left': dropdownPosition.left + 'px' }"
          :class="{ 'sm:!top-[var(--dropdown-top)] sm:!left-[var(--dropdown-left)]': true }"
        >
          <button
            v-for="color in availableColors"
            :key="color.value"
            @click="store.updateChip(editingChipId!, { color: color.value, label: color.label }); stopEditChip()"
            class="w-12 h-12 sm:w-10 sm:h-10 rounded-full border-2 border-gray-500 hover:border-white active:scale-95 transition-all"
            :style="{ backgroundColor: color.value }"
            :title="color.label"
          />
        </div>
      </template>
    </Teleport>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
