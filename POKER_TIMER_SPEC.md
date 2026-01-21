# Poker Timer - Specifikace

## Struktura turnaje (Blinds/Levels)

| Komponenta | Popis |
|------------|-------|
| **Small Blind (SB)** | Povinná sázka menšího hráče |
| **Big Blind (BB)** | Typicky 2× SB |
| **Ante** | Malá sázka od všech (10-15% BB), nebo Big Blind Ante |
| **Délka levelu** | 10-60 min dle typu turnaje |
| **Přestávky** | Po 2-4 levelech, 5-15 min |

### Typy turnajů

| Typ | Délka levelů | Celková doba |
|-----|--------------|--------------|
| **Turbo** | 10-15 min | 2-3 hodiny |
| **Standard** | 20-30 min | 4-6 hodin |
| **Deep Stack** | 45-60 min | 7+ hodin |

---

## Funkce k implementaci

### Fáze 1 - MVP

- [ ] Countdown timer s přesností (setInterval)
- [ ] Zobrazení aktuálních blindů (SB/BB/Ante)
- [ ] Zobrazení příštího levelu
- [ ] Start/Pause/Next level ovládání
- [ ] Zvukové upozornění na konec levelu
- [ ] Customizable blind struktura

### Fáze 2 - Core Features

- [ ] Správa hráčů (přidání, vyřazení)
- [ ] Prize pool kalkulátor
- [ ] Přestávky (breaks) v rozvrhu
- [ ] Vibrace na mobilech
- [ ] Ukládání/načítání struktur turnajů
- [ ] localStorage persistence

### Fáze 3 - Advanced

- [ ] PWA (offline + instalace)
- [ ] Wake Lock API (nezhasínání obrazovky)
- [ ] Desktop notifikace
- [ ] Statistiky (průměrný stack, celkové chipy)
- [ ] Custom themes/barvy

---

## Upozornění

| Typ | API | Podpora |
|-----|-----|---------|
| **Zvuk** | HTML5 Audio / Web Audio API | Všechny prohlížeče |
| **Vibrace** | Vibration API | Android (ne iOS Safari) |
| **Notifikace** | Notifications API | Všechny (vyžaduje HTTPS) |

---

## Wake Lock API

Zabraňuje zhasnutí obrazovky na mobilech.

```typescript
// composables/useWakeLock.ts
export function useWakeLock() {
  const isActive = ref(false);
  let wakeLock: WakeLockSentinel | null = null;

  const request = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      isActive.value = true;

      wakeLock.addEventListener('release', () => {
        isActive.value = false;
      });
    } catch (err) {
      console.error('Wake Lock error:', err);
    }
  };

  const release = async () => {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  };

  return { isActive, request, release };
}
```

✅ Podporováno: Chrome, Firefox, Safari (iOS/macOS)

---

## Tech Stack

```
Vue 3 + Composition API
Vite
TypeScript
Pinia (state management)
VueUse (useInterval, useStorage)
vite-plugin-pwa (offline, instalace)
Tailwind CSS
```

---

## Struktura projektu

```
src/
├── components/
│   ├── Timer.vue              # Hlavní countdown displej
│   ├── BlindDisplay.vue       # Zobrazení aktuálních blindů
│   ├── LevelInfo.vue          # Info o levelu (číslo, další)
│   ├── PlayerStats.vue        # Statistiky turnaje
│   ├── ControlPanel.vue       # Start/Pause/Next
│   └── BreakAnnouncer.vue     # Oznámení přestávky
├── composables/
│   ├── useTimer.ts            # Timer logika
│   ├── useWakeLock.ts         # Screen wake lock
│   ├── useNotifications.ts    # Audio/vibrace
│   └── useStorage.ts          # Persistence
├── stores/
│   ├── tournament.ts          # Turnajový stav (Pinia)
│   └── settings.ts            # Uživatelská nastavení
├── types/
│   └── poker.ts               # TypeScript typy
├── assets/
│   └── sounds/                # Audio soubory
└── App.vue
```

---

## Datový model

```typescript
interface BlindLevel {
  id: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // v sekundách
  isBreak?: boolean;
  breakDuration?: number;
}

interface Player {
  id: string;
  name: string;
  stack: number;
  isBusted: boolean;
}

interface TournamentConfig {
  name: string;
  structure: BlindLevel[];
  startingStack: number;
  buyinAmount: number;
  rebuysAllowed: boolean;
}

interface TournamentState {
  config: TournamentConfig;
  players: Player[];
  currentLevelIndex: number;
  remainingSeconds: number;
  isRunning: boolean;
}
```

---

## Zdroje

- [MDN Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [VueUse Documentation](https://vueuse.org/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/guide/)
- [Pinia Documentation](https://pinia.vuejs.org/)