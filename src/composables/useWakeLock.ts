import { ref, onMounted, onUnmounted } from 'vue'

export function useWakeLock() {
  const isSupported = ref(false)
  const isActive = ref(false)
  let wakeLock: WakeLockSentinel | null = null

  const request = async () => {
    if (!isSupported.value) return false

    try {
      wakeLock = await navigator.wakeLock.request('screen')
      isActive.value = true

      wakeLock.addEventListener('release', () => {
        isActive.value = false
      })

      return true
    } catch (err) {
      console.error('Wake Lock error:', err)
      isActive.value = false
      return false
    }
  }

  const release = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release()
        wakeLock = null
        isActive.value = false
      } catch (err) {
        console.error('Wake Lock release error:', err)
      }
    }
  }

  // Znovu aktivovat po návratu na stránku
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && isActive.value) {
      await request()
    }
  }

  onMounted(() => {
    isSupported.value = 'wakeLock' in navigator
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(async () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    await release()
  })

  return {
    isSupported,
    isActive,
    request,
    release,
  }
}
