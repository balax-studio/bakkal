/**
 * Mini Mart Neo - Global Game Configuration
 * Easily revizable and customizable game constants
 * Strictly ZERO Emojis
 */

export const GAME_CONFIG = {
  // Player Configuration
  player: {
    baseSpeed: 7.5,
    boostSpeedMultiplier: 1.6,
    initialCapacity: 6,
    initialCash: 75,
    tiltSensitivity: 0.04,
    tiltDamping: 12
  },

  // Item Types & Economics
  items: {
    tomato: {
      id: 'tomato',
      name: 'Domates',
      color: 0xef4444,
      capColor: 0x15803d,
      price: 6,
      growDuration: 2.2
    },
    egg: {
      id: 'egg',
      name: 'Yumurta',
      color: 0xffedd5,
      yolkColor: 0xf59e0b,
      price: 12,
      layDuration: 3.2
    }
  },

  // Unlockable Stations & Staff
  unlocks: {
    shelf2: {
      id: 'shelf_2',
      cost: 50,
      label: 'YENI RAF 2: 50 TL',
      pos: { x: -10, z: -4 }
    },
    chickenCoop: {
      id: 'coop',
      cost: 90,
      label: 'TAVUK KUMESI: 90 TL',
      pos: { x: 10, z: 6 }
    },
    eggShelf: {
      id: 'shelf_egg',
      cost: 140,
      label: 'YUMURTA RAFI: 140 TL',
      pos: { x: -10, z: 1.5 }
    },
    cashierStaff: {
      id: 'cashier',
      cost: 180,
      label: 'OTO KASIYER: 180 TL',
      pos: { x: -8, z: 4.2 }
    },
    helperWorker: {
      id: 'helper',
      cost: 250,
      label: 'MARKET CIKRAGI: 250 TL',
      pos: { x: 4, z: -2 }
    }
  },

  // Customer Spawning
  customers: {
    maxInStore: 5,
    baseSpawnInterval: 3.2,
    walkSpeed: 3.2,
    shirtColors: [0x06b6d4, 0xef4444, 0x10b981, 0x8b5cf6, 0xf59e0b, 0xec4899]
  },

  // Neo-Brutalist Colors
  palette: {
    black: 0x09090b,
    white: 0xffffff,
    soil: 0x78350f,
    grass: 0x86efac,
    wood: 0xfef08a,
    cyan: 0x06b6d4,
    emerald: 0x10b981,
    amber: 0xf59e0b,
    cashGreen: 0x22c55e
  }
};
