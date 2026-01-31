export default {
  common: {
    confirm: 'Potvrdit',
    cancel: 'Zrušit',
    reset: 'Reset',
    save: 'Uložit',
    add: 'Přidat',
    remove: 'Odebrat',
    restore: 'Obnovit'
  },
  timer: {
    level: 'Level',
    break: 'PŘESTÁVKA'
  },
  blinds: {
    title: 'Blindy',
    nextLevel: 'Další level',
    next: 'Další',
    ante: 'Ante',
    sb: 'SB',
    bb: 'BB',
    breaks: 'Přestávky',
    addLevel: '+ Level',
    addBreak: '+ Přestávka'
  },
  players: {
    title: 'Hráči',
    namePlaceholder: 'Jméno hráče',
    noPlayers: 'Žádní hráči',
    chips: 'chips',
    bust: 'Bust',
    rebuy: 'Rebuy',
    buyinCount: '{count}x buyin',
    removeTitle: 'Odebrat hráče',
    removeConfirm: 'Opravdu chceš odebrat hráče "{name}"?'
  },
  payouts: {
    title: 'Výplaty',
    minPlayers: 'Min. 2 hráči pro výpočet'
  },
  settings: {
    title: 'Nastavení',
    tournament: 'Turnaj',
    buyin: 'Buy-in',
    bounty: 'Bounty',
    startingStack: 'Startovací stack',
    levelDuration: 'Délka levelu (min)',
    breakDuration: 'Délka pauzy (min)',
    ante: 'Ante',
    rebuy: 'Rebuy',
    chipBreakdown: 'Rozložení žetonů',
    total: 'Celkem',
    language: 'Jazyk',
    currency: 'Měna'
  },
  chips: {
    title: 'Žetony',
    addChip: 'Přidat žeton',
    restoreDefault: 'Obnovit výchozí',
    removeTitle: 'Odebrat žeton',
    removeConfirm: 'Opravdu chceš odebrat žeton "{label}"?',
    restoreTitle: 'Obnovit výchozí žetony',
    restoreConfirm: 'Opravdu chceš obnovit výchozí nastavení žetonů?'
  },
  colors: {
    white: 'Bílá',
    red: 'Červená',
    blue: 'Modrá',
    green: 'Zelená',
    black: 'Černá',
    purple: 'Fialová',
    yellow: 'Žlutá',
    orange: 'Oranžová',
    pink: 'Růžová',
    gray: 'Šedá',
    turquoise: 'Tyrkysová',
    brown: 'Hnědá'
  },
  structure: {
    title: 'Blindy',
    resetTitle: 'Obnovit výchozí strukturu',
    resetConfirm: 'Opravdu chceš obnovit výchozí strukturu blindů? Všechny úpravy budou ztraceny.',
    removeLevel: 'Odebrat level',
    removeBreak: 'přestávku'
  },
  resetAll: {
    title: 'Resetovat vše',
    confirm: 'Opravdu chceš resetovat celý turnaj? Všichni hráči, nastavení a struktura budou smazány.'
  },
  stats: {
    players: 'Hráči',
    avgStack: 'Ø Stack',
    chips: 'Chipy',
    prize: 'Prize'
  },
  wakeLock: {
    enabled: 'Obrazovka zůstane zapnutá',
    disabled: 'Povolit zámek obrazovky'
  },
  controls: {
    prevLevel: 'Předchozí level',
    nextLevel: 'Další level',
    start: 'Start',
    pause: 'Pauza'
  },
  debug: {
    title: 'Debug zvuků'
  },
  help: {
    title: 'Pokerové kombinace',
    hands: {
      royalFlush: { name: 'Královská postupka', desc: 'A, K, Q, J, 10 stejné barvy' },
      straightFlush: { name: 'Postupka v barvě', desc: '5 karet v řadě stejné barvy' },
      fourOfAKind: { name: 'Poker (čtveřice)', desc: '4 karty stejné hodnoty' },
      fullHouse: { name: 'Full house', desc: 'Trojice + dvojice' },
      flush: { name: 'Barva (flush)', desc: '5 karet stejné barvy' },
      straight: { name: 'Postupka', desc: '5 karet v řadě' },
      threeOfAKind: { name: 'Trojice', desc: '3 karty stejné hodnoty' },
      twoPair: { name: 'Dva páry', desc: '2 různé dvojice' },
      onePair: { name: 'Pár', desc: '2 karty stejné hodnoty' },
      highCard: { name: 'Vysoká karta', desc: 'Žádná kombinace' }
    }
  }
}
