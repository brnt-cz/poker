# Poker Timer

Turnajovy casovac pro domaci pokerove turnaje. Mobilne optimalizovany s podporou Wake Lock API.

## Funkce

- Countdown timer s nastavitelnou strukturou blindu
- Zobrazeni aktualnich a pristich blindu (SB/BB/Ante)
- Ovladani: Start/Pause, predchozi/dalsi level, uprava casu
- Zvukova upozorneni na konec levelu (Web Audio API)
- Vibrace na mobilech
- Wake Lock - obrazovka nezhasne behem hry
- Statistiky: pocet hracu, prumerny stack, prize pool

## Technologie

- Vue 3 + Composition API
- Vite
- TypeScript
- Pinia (state management)
- Tailwind CSS
- VueUse

## Instalace

```bash
npm install
```

## Vyvoj

```bash
npm run dev
```

Aplikace bezi na `http://localhost:5173`

## Build

```bash
npm run build
```

Vystup je v adresari `dist/`.

## Struktura projektu

```
src/
├── components/
│   ├── Timer.vue           # Countdown displej
│   ├── BlindDisplay.vue    # Zobrazeni blindu
│   ├── ControlPanel.vue    # Ovladaci tlacitka
│   ├── Stats.vue           # Statistiky turnaje
│   └── WakeLockToggle.vue  # Prepinac wake lock
├── composables/
│   ├── useTimer.ts         # Timer logika
│   ├── useWakeLock.ts      # Screen Wake Lock API
│   └── useNotifications.ts # Zvuky a vibrace
├── stores/
│   └── tournament.ts       # Pinia store
├── types/
│   └── poker.ts            # TypeScript typy
└── App.vue
```

## Konfigurace turnaje

Vychozi struktura blindu je v `src/types/poker.ts`. Muzete upravit:

- `smallBlind` / `bigBlind` / `ante` - vyse sazek
- `duration` - delka levelu v sekundach (1200 = 20 minut)
- `isBreak` - oznaceni prestavky

## License

MIT
