<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

const isOpen = ref(false)
const options = ref<ConfirmOptions>({
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  danger: false,
})

let resolvePromise: ((value: boolean) => void) | null = null

function open(opts: ConfirmOptions): Promise<boolean> {
  options.value = {
    title: opts.title ?? t('common.confirm'),
    message: opts.message,
    confirmText: opts.confirmText ?? t('common.confirm'),
    cancelText: opts.cancelText ?? t('common.cancel'),
    danger: opts.danger ?? false,
  }
  isOpen.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

function confirm() {
  isOpen.value = false
  resolvePromise?.(true)
  resolvePromise = null
}

function cancel() {
  isOpen.value = false
  resolvePromise?.(false)
  resolvePromise = null
}

defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
        @click.self="cancel"
      >
        <Transition name="modal">
          <div
            v-if="isOpen"
            class="bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <!-- Header -->
            <div class="p-4 border-b border-gray-700">
              <h3 class="text-lg font-bold text-white">{{ options.title }}</h3>
            </div>

            <!-- Content -->
            <div class="p-4">
              <p class="text-gray-300">{{ options.message }}</p>
            </div>

            <!-- Actions -->
            <div class="p-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                @click="cancel"
                class="px-5 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                {{ options.cancelText }}
              </button>
              <button
                @click="confirm"
                class="px-5 py-2 rounded-lg font-medium transition-colors"
                :class="options.danger
                  ? 'bg-red-700 hover:bg-red-600 active:bg-red-800'
                  : 'bg-green-700 hover:bg-green-600 active:bg-green-800'"
              >
                {{ options.confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
