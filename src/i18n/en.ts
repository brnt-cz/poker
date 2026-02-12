export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    reset: 'Reset',
    save: 'Save',
    add: 'Add',
    remove: 'Remove',
    restore: 'Restore'
  },
  timer: {
    level: 'Level',
    break: 'BREAK'
  },
  blinds: {
    title: 'Blinds',
    nextLevel: 'Next level',
    next: 'Next',
    ante: 'Ante',
    sb: 'SB',
    bb: 'BB',
    breaks: 'Breaks',
    addLevel: '+ Level',
    addBreak: '+ Break'
  },
  players: {
    title: 'Players',
    namePlaceholder: 'Player name',
    noPlayers: 'No players',
    chips: 'chips',
    bust: 'Bust',
    rebuy: 'Rebuy',
    buyinCount: '{count}x buyin',
    removeTitle: 'Remove player',
    removeConfirm: 'Are you sure you want to remove player "{name}"?'
  },
  payouts: {
    title: 'Payouts',
    minPlayers: 'Min. 2 players to calculate'
  },
  settings: {
    title: 'Settings',
    tournament: 'Tournament',
    buyin: 'Buy-in',
    bounty: 'Bounty',
    startingStack: 'Starting stack',
    levelDuration: 'Level duration (min)',
    breakDuration: 'Break duration (min)',
    ante: 'Ante',
    rebuy: 'Rebuy',
    maxRebuys: 'Max rebuys',
    chipBreakdown: 'Chip breakdown',
    total: 'Total',
    language: 'Language',
    currency: 'Currency'
  },
  chips: {
    title: 'Chips',
    addChip: 'Add chip',
    restoreDefault: 'Restore default',
    removeTitle: 'Remove chip',
    removeConfirm: 'Are you sure you want to remove chip "{label}"?',
    restoreTitle: 'Restore default chips',
    restoreConfirm: 'Are you sure you want to restore default chip settings?'
  },
  colors: {
    white: 'White',
    red: 'Red',
    blue: 'Blue',
    green: 'Green',
    black: 'Black',
    purple: 'Purple',
    yellow: 'Yellow',
    orange: 'Orange',
    pink: 'Pink',
    gray: 'Gray',
    turquoise: 'Turquoise',
    brown: 'Brown'
  },
  structure: {
    title: 'Blinds',
    resetTitle: 'Restore default structure',
    resetConfirm: 'Are you sure you want to restore default blind structure? All changes will be lost.',
    removeLevel: 'Remove level',
    removeBreak: 'break'
  },
  resetAll: {
    title: 'Reset all',
    confirm: 'Are you sure you want to reset the entire tournament? All players, settings and structure will be deleted.'
  },
  stats: {
    players: 'Players',
    avgStack: 'Avg Stack',
    chips: 'Chips',
    prize: 'Prize'
  },
  wakeLock: {
    enabled: 'Screen will stay on',
    disabled: 'Allow screen lock'
  },
  controls: {
    prevLevel: 'Previous level',
    nextLevel: 'Next level',
    start: 'Start',
    pause: 'Pause'
  },
  debug: {
    title: 'Debug sounds'
  },
  help: {
    title: 'Poker Hand Rankings',
    hands: {
      royalFlush: { name: 'Royal Flush', desc: 'A, K, Q, J, 10 of the same suit' },
      straightFlush: { name: 'Straight Flush', desc: '5 cards in sequence, same suit' },
      fourOfAKind: { name: 'Four of a Kind', desc: '4 cards of the same rank' },
      fullHouse: { name: 'Full House', desc: 'Three of a kind + a pair' },
      flush: { name: 'Flush', desc: '5 cards of the same suit' },
      straight: { name: 'Straight', desc: '5 cards in sequence' },
      threeOfAKind: { name: 'Three of a Kind', desc: '3 cards of the same rank' },
      twoPair: { name: 'Two Pair', desc: '2 different pairs' },
      onePair: { name: 'One Pair', desc: '2 cards of the same rank' },
      highCard: { name: 'High Card', desc: 'No combination' }
    }
  }
}
