# Poker Timer

Turnajový časovač pro domácí pokerové turnaje. Optimalizováno pro mobily s podporou PWA a Wake Lock API.

## Funkce

### Časovač a blindy
- Odpočítávací časovač s nastavitelnou strukturou blindů
- Zobrazení aktuálních a následujících blindů (SB/BB/Ante)
- Ovládání: Start/Pause, předchozí/další level, úprava času (+/- 10s, 1min)
- Zvuková upozornění (Web Audio API):
  - Varování 1 minutu před koncem levelu
  - Odpočet posledních 5 sekund
  - Oznámení konce levelu
  - Ambientní zvuk pro přestávku
- Vibrace na mobilech
- Wake Lock - obrazovka nezhasne během hry

### Správa hráčů
- Přidání/odebrání hráčů
- Sledování Bust/Rebuy
- Rebuy povolen pouze v první hodině (nastavitelné)
- Sledování pořadí vyřazení pro výplaty
- Výpočet prize poolu s automatickým rozdělením výher
- Automatická aktualizace stacků při změně startovacího stacku

### Nastavení turnaje
- Výše buy-inu (výchozí 100 Kč)
- Startovací stack (výchozí 10 000 žetonů)
- Délka levelu (výchozí 20 minut)
- Délka přestávky (výchozí 10 minut)
- Přepínač ante
- Přepínač rebuy
- Přepínač bounty s nastavitelnou částkou
- Přepínač přestávek

### Správa žetonů
- Nastavitelné hodnoty a barvy žetonů
- 12 barevných možností
- Automatický rozpis žetonů pro startovací stack

### Struktura blindů
- Editovatelné levely s +/- ovládáním
- Globální nastavení délky levelů a přestávek
- Drag & drop pro změnu pořadí levelů
- Přidání/odebrání levelů a přestávek
- Přepínač přestávek
- Reset na výchozí strukturu

### Ukládání dat
- Všechna nastavení ukládána do localStorage
- Obnovení turnaje po refreshi stránky
- Možnost kompletního resetu

### PWA
- Instalovatelné jako aplikace na mobilu
- Funguje offline
- Vlastní ikony
- Maskable ikona pro Android (adaptivní ikony)

### Responzivní design
- Optimalizováno pro mobily (portrait i landscape)
- Fullscreen zobrazení bez scrollování
- Použití `svh` jednotek pro správnou výšku na mobilech
- Zakázán pull-to-refresh gesture
- Desktop zobrazení s většími fonty
- Wake Lock tlačítko pouze na mobilech

## Technologie

- Vue 3 + Composition API
- Vite
- TypeScript
- Pinia (state management)
- Tailwind CSS 4
- VueUse

## Instalace

```bash
npm install
```

## Vývoj

```bash
npm run dev
```

Aplikace běží na `http://localhost:5173`

## Build

```bash
npm run build
```

Výstup v adresáři `dist/`.

## Struktura projektu

```
src/
├── components/
│   ├── Timer.vue              # Odpočítávací displej
│   ├── BlindDisplay.vue       # Zobrazení blindů
│   ├── ControlPanel.vue       # Ovládací tlačítka
│   ├── Stats.vue              # Statistiky turnaje
│   ├── WakeLockToggle.vue     # Přepínač wake lock
│   ├── SettingsDrawer.vue     # Modální okno nastavení
│   ├── PlayerManager.vue      # Seznam hráčů a výplaty
│   ├── ChipSettings.vue       # Nastavení žetonů
│   ├── TournamentSettings.vue # Nastavení turnaje
│   ├── StructureEditor.vue    # Editor struktury blindů
│   └── ConfirmDialog.vue      # Potvrzovací dialog
├── composables/
│   ├── useTimer.ts            # Logika časovače
│   ├── useWakeLock.ts         # Screen Wake Lock API
│   ├── useNotifications.ts    # Zvuky a vibrace
│   └── useStorage.ts          # Persistence do localStorage
├── stores/
│   └── tournament.ts          # Pinia store
├── types/
│   └── poker.ts               # TypeScript typy a výchozí hodnoty
└── App.vue
```

## Výchozí konfigurace

### Struktura blindů (19 levelů)
Začíná na 5/10, přestávky každé 3 levely.

### Hodnoty žetonů
- 5 (Bílá), 10 (Červená), 25 (Zelená), 100 (Černá), 500 (Fialová), 1000 (Žlutá), 5000 (Oranžová)

### Výchozí nastavení turnaje
- Buy-in: 100 Kč
- Startovací stack: 10 000
- Délka levelu: 20 minut
- Délka přestávky: 10 minut
- Bounty: 50 Kč
- Ante: zapnuto
- Rebuy: zapnuto (pouze první hodinu)
- Přestávky: zapnuto

## Licence

MIT
