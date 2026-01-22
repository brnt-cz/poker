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

- [x] Countdown timer s přesností (setInterval)
- [x] Zobrazení aktuálních blindů (SB/BB/Ante)
- [x] Zobrazení příštího levelu
- [x] Start/Pause/Next level ovládání
- [x] Zvukové upozornění na konec levelu (Web Audio API)
- [x] Customizable blind struktura

### Fáze 2 - Core Features

- [x] Správa hráčů (přidání, vyřazení, bust, rebuy)
- [x] Prize pool kalkulátor
- [x] Přestávky (breaks) v rozvrhu
- [x] Vibrace na mobilech
- [ ] Ukládání/načítání struktur turnajů
- [ ] localStorage persistence

### Fáze 3 - Advanced

- [ ] PWA (offline + instalace)
- [x] Wake Lock API (nezhasínání obrazovky)
- [ ] Desktop notifikace
- [x] Statistiky (průměrný stack, celkové chipy, aktivní hráči)
- [x] Custom themes/barvy (primary color palette)

---

## Upozornění

| Typ | API | Stav |
|-----|-----|------|
| **Zvuk** | Web Audio API | Implementováno |
| **Vibrace** | Vibration API | Implementováno |
| **Notifikace** | Notifications API | TODO |

---

## Tech Stack

```
Vue 3 + Composition API
Vite
TypeScript
Pinia (state management)
VueUse
Tailwind CSS 4
```

---

## Struktura projektu (aktuální)

```
src/
├── components/
│   ├── Timer.vue              # Countdown displej
│   ├── BlindDisplay.vue       # Zobrazení blindů + přestávek
│   ├── ControlPanel.vue       # Start/Pause/Next + úprava času
│   ├── Stats.vue              # Statistiky turnaje
│   └── WakeLockToggle.vue     # Přepínač wake lock
├── composables/
│   ├── useTimer.ts            # Timer logika + auto-advance
│   ├── useWakeLock.ts         # Screen Wake Lock API
│   └── useNotifications.ts    # Zvuky (Web Audio) + vibrace
├── stores/
│   └── tournament.ts          # Pinia store
├── types/
│   └── poker.ts               # TypeScript typy + výchozí struktura
└── App.vue
```

---

## Datový model

```typescript
interface BlindLevel {
  id: number
  smallBlind: number
  bigBlind: number
  ante: number
  duration: number // v sekundách
  isBreak?: boolean
  breakMessage?: string
}

interface Player {
  id: string
  name: string
  stack: number
  isBusted: boolean
  buyinCount: number
}
```

---

## Barvy (Tailwind)

```javascript
primary: {
  500: '#35654d',  // felt
  700: '#1a472a',  // poker green
}
poker: {
  green: '#1a472a',
  felt: '#35654d',
  gold: '#d4af37',
  red: '#8b0000',
}
```

---

## TODO

- [ ] UI pro správu hráčů (přidání/odebrání)
- [ ] UI pro editaci blind struktury
- [ ] Persistence do localStorage
- [ ] PWA manifest + service worker
- [ ] Landscape mode optimalizace
