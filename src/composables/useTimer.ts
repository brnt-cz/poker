import { ref, watch, onUnmounted } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useNotifications } from './useNotifications'

export function useTimer() {
  const store = useTournamentStore()
  const notifications = useNotifications()

  const intervalId = ref<number | null>(null)
  const warningPlayed = ref(false)

  const WARNING_THRESHOLD = 60 // 1 minuta před koncem
  const COUNTDOWN_START = 6 // odpočet posledních 6 sekund (první je tichý warmup)

  const startInterval = () => {
    if (intervalId.value) return

    intervalId.value = window.setInterval(() => {
      if (store.isRunning && store.remainingSeconds > 0) {
        store.tick()

        // Upozornění 1 minuta před koncem
        if (store.remainingSeconds === WARNING_THRESHOLD && !warningPlayed.value) {
          notifications.notifyWarning()
          warningPlayed.value = true
        }

        // Odpočet posledních 6 sekund (první je tichý warmup)
        if (store.remainingSeconds <= COUNTDOWN_START && store.remainingSeconds > 0) {
          if (store.remainingSeconds === 6) {
            notifications.warmup()
          } else if (store.remainingSeconds === 1) {
            notifications.notifyLevelEnd()
          } else {
            notifications.notifyCountdown()
          }
        }

        // Konec levelu
        if (store.remainingSeconds === 0) {
          // Auto-advance na další level
          store.goToNextLevel()
          warningPlayed.value = false

          // Pokud nový level je přestávka, oznámit přestávku (se zpožděním 1s)
          if (store.isBreak) {
            setTimeout(() => {
              notifications.notifyBreak()
            }, 1000)
          }
        }
      }
    }, 1000)
  }

  const stopInterval = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  // Sleduj změny isRunning
  watch(
    () => store.isRunning,
    (running) => {
      if (running) {
        startInterval()
      } else {
        stopInterval()
      }
    },
    { immediate: true }
  )

  // Resetuj warning flag při změně levelu
  watch(
    () => store.currentLevelIndex,
    () => {
      warningPlayed.value = false
    }
  )

  onUnmounted(() => {
    stopInterval()
  })

  return {
    notifications,
  }
}
