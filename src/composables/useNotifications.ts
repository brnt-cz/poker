import { ref } from 'vue'

// Cachovaný AudioContext pro konzistentní timing
let cachedAudioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!cachedAudioContext || cachedAudioContext.state === 'closed') {
    cachedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  // Resume pokud je suspended (vyžadováno po user interaction)
  if (cachedAudioContext.state === 'suspended') {
    cachedAudioContext.resume()
  }
  return cachedAudioContext
}

export function useNotifications() {
  const isSoundEnabled = ref(true)
  const isVibrationEnabled = ref(true)
  const isVibrationSupported = ref(false)

  // Kontrola podpory vibrace
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    isVibrationSupported.value = true
  }

  const playSound = async (type: 'levelEnd' | 'levelWarning' | 'break' | 'countdown' | 'countdownFinal' | 'levelStart' = 'levelEnd') => {
    if (!isSoundEnabled.value) return

    try {
      // Použití cachovaného AudioContextu
      const audioContext = getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Nastavení podle typu
      switch (type) {
        case 'levelEnd':
          oscillator.frequency.value = 440 // A1
          oscillator.type = 'triangle'
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
            osc2.frequency.value = 554 // D2
            osc2.type = 'triangle'
            gain2.gain.setValueAtTime(0.5, audioContext.currentTime)
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
            osc2.start()
            osc2.stop(audioContext.currentTime + 0.8)
          }, 200)
          break

        case 'levelWarning':
          // Výrazný akord C-E-G (C dur)
          oscillator.frequency.value = 523.25 // C5
          oscillator.type = 'triangle'
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.8)

          // E5
          setTimeout(() => {
            const osc2 = audioContext.createOscillator()
            const gain2 = audioContext.createGain()
            osc2.connect(gain2)
            gain2.connect(audioContext.destination)
            osc2.frequency.value = 659.25 // E5
            osc2.type = 'triangle'
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7)
            osc2.start()
            osc2.stop(audioContext.currentTime + 0.7)
          }, 50)

          // G5
          setTimeout(() => {
            const osc3 = audioContext.createOscillator()
            const gain3 = audioContext.createGain()
            osc3.connect(gain3)
            gain3.connect(audioContext.destination)
            osc3.frequency.value = 783.99 // G5
            osc3.type = 'triangle'
            gain3.gain.setValueAtTime(0.3, audioContext.currentTime)
            gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
            osc3.start()
            osc3.stop(audioContext.currentTime + 0.6)
          }, 100)
          break

        case 'break':
          // Ambient zvuk pro přestávku - měkký akord s fade in/out
          const ambientChord = [
            { freq: 261.63, detune: 0 },    // C4
            { freq: 329.63, detune: 5 },    // E4 (lehce rozladěno pro warmth)
            { freq: 392.00, detune: -3 },   // G4
            { freq: 523.25, detune: 2 },    // C5
          ]

          ambientChord.forEach(note => {
            const osc = audioContext.createOscillator()
            const gain = audioContext.createGain()
            osc.connect(gain)
            gain.connect(audioContext.destination)
            osc.frequency.value = note.freq
            osc.detune.value = note.detune
            osc.type = 'sine'
            // Fade in
            gain.gain.setValueAtTime(0, audioContext.currentTime)
            gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.5)
            // Fade out
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2.5)
            osc.start()
            osc.stop(audioContext.currentTime + 2.5)
          })

          // Druhý akord (Fmaj7) - po 1s
          setTimeout(() => {
            const chord2 = [
              { freq: 174.61, detune: 0 },   // F3
              { freq: 261.63, detune: 3 },   // C4
              { freq: 329.63, detune: -2 },  // E4
              { freq: 440.00, detune: 4 },   // A4
            ]
            chord2.forEach(note => {
              const osc = audioContext.createOscillator()
              const gain = audioContext.createGain()
              osc.connect(gain)
              gain.connect(audioContext.destination)
              osc.frequency.value = note.freq
              osc.detune.value = note.detune
              osc.type = 'sine'
              gain.gain.setValueAtTime(0, audioContext.currentTime)
              gain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.4)
              gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2)
              osc.start()
              osc.stop(audioContext.currentTime + 2)
            })
          }, 1000)

          // Prázdný oscilátor aby se nevyhodila chyba
          oscillator.frequency.value = 0
          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.01)
          break

        case 'countdown':
          // Krátký beep pro odpočet 5-2
          oscillator.frequency.value = 1046.50 // C6 - vyšší tón
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0.35, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.08)
          break

        case 'countdownFinal':
          // Delší tón pro poslední sekundu
          oscillator.frequency.value = 1046.50 // C6
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.6)
          break

        case 'levelStart':
          // Vzestupná melodie pro začátek levelu
          oscillator.frequency.value = 523.25 // C5
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.15)

          // Druhý tón - vyšší
          setTimeout(() => {
            const osc2 = audioContext.createOscillator()
            const gain2 = audioContext.createGain()
            osc2.connect(gain2)
            gain2.connect(audioContext.destination)
            osc2.frequency.value = 659.25 // E5
            osc2.type = 'sine'
            gain2.gain.setValueAtTime(0.4, audioContext.currentTime)
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
            osc2.start()
            osc2.stop(audioContext.currentTime + 0.15)
          }, 150)

          // Třetí tón - nejvyšší
          setTimeout(() => {
            const osc3 = audioContext.createOscillator()
            const gain3 = audioContext.createGain()
            osc3.connect(gain3)
            gain3.connect(audioContext.destination)
            osc3.frequency.value = 783.99 // G5
            osc3.type = 'sine'
            gain3.gain.setValueAtTime(0.5, audioContext.currentTime)
            gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
            osc3.start()
            osc3.stop(audioContext.currentTime + 0.3)
          }, 300)
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

  const notifyCountdown = () => {
    playSound('countdown')
    vibrate(50)
  }

  const notifyCountdownFinal = () => {
    playSound('countdownFinal')
    vibrate([100, 50, 100])
  }

  const notifyLevelStart = () => {
    playSound('levelStart')
    vibrate([100, 50, 100])
  }

  // Tichý warmup pro inicializaci AudioContextu
  const warmup = () => {
    if (!isSoundEnabled.value) return
    try {
      const audioContext = getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 20000 // Neslyšitelná frekvence
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime) // Téměř nulová hlasitost
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.01)
    } catch (err) {
      // Tiše ignorovat
    }
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
    notifyCountdown,
    notifyCountdownFinal,
    notifyLevelStart,
    warmup,
    toggleSound,
    toggleVibration,
  }
}
