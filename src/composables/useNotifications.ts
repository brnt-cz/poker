import { ref } from 'vue'

export function useNotifications() {
  const isSoundEnabled = ref(true)
  const isVibrationEnabled = ref(true)
  const isVibrationSupported = ref(false)

  // Kontrola podpory vibrace
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    isVibrationSupported.value = true
  }

  const playSound = async (type: 'levelEnd' | 'levelWarning' | 'break' = 'levelEnd') => {
    if (!isSoundEnabled.value) return

    try {
      // Generování zvuku pomocí Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Nastavení podle typu
      switch (type) {
        case 'levelEnd':
          oscillator.frequency.value = 880 // A5
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.5)

          // Druhý tón
          setTimeout(() => {
            const osc2 = audioContext.createOscillator()
            const gain2 = audioContext.createGain()
            osc2.connect(gain2)
            gain2.connect(audioContext.destination)
            osc2.frequency.value = 1174.66 // D6
            osc2.type = 'sine'
            gain2.gain.setValueAtTime(0.5, audioContext.currentTime)
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
            osc2.start()
            osc2.stop(audioContext.currentTime + 0.8)
          }, 200)
          break

        case 'levelWarning':
          oscillator.frequency.value = 523.25 // C5
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.2)
          break

        case 'break':
          oscillator.frequency.value = 659.25 // E5
          oscillator.type = 'triangle'
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 1)
          break
      }
    } catch (err) {
      console.error('Audio playback failed:', err)
    }
  }

  const vibrate = (pattern: number | number[] = 200) => {
    if (!isVibrationEnabled.value || !isVibrationSupported.value) return

    try {
      navigator.vibrate(pattern)
    } catch (err) {
      console.error('Vibration failed:', err)
    }
  }

  const notifyLevelEnd = () => {
    playSound('levelEnd')
    vibrate([200, 100, 200, 100, 400])
  }

  const notifyWarning = () => {
    playSound('levelWarning')
    vibrate(100)
  }

  const notifyBreak = () => {
    playSound('break')
    vibrate([300, 100, 300])
  }

  const toggleSound = () => {
    isSoundEnabled.value = !isSoundEnabled.value
  }

  const toggleVibration = () => {
    isVibrationEnabled.value = !isVibrationEnabled.value
  }

  return {
    isSoundEnabled,
    isVibrationEnabled,
    isVibrationSupported,
    playSound,
    vibrate,
    notifyLevelEnd,
    notifyWarning,
    notifyBreak,
    toggleSound,
    toggleVibration,
  }
}
