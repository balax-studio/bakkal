/**
 * Mini Mart Neo - Game State Manager
 * Fully customizable and reactive
 * Strictly ZERO Emojis
 */

import { GAME_CONFIG } from './mart-config.js';

export class MartState {
  constructor() {
    this.cash = GAME_CONFIG.player.initialCash;
    this.inventory = []; // Array of carried items { type: 'tomato' | 'egg', id: number }
    this.maxCapacity = GAME_CONFIG.player.initialCapacity;
    this.playerSpeed = GAME_CONFIG.player.baseSpeed;
    this.speedBoostActive = false;
    this.level = 1;
    this.xp = 100;
    this.scrapParts = 0;
    this.marketShare = 35;
    this.soundEnabled = true;

    // Shelves configuration
    this.shelves = [
      { id: 1, type: 'tomato', unlocked: true, items: 0, maxItems: 12, price: GAME_CONFIG.items.tomato.price },
      { id: 2, type: 'tomato', unlocked: false, cost: GAME_CONFIG.unlocks.shelf2.cost, items: 0, maxItems: 12, price: GAME_CONFIG.items.tomato.price },
      { id: 3, type: 'egg', unlocked: false, cost: GAME_CONFIG.unlocks.eggShelf.cost, items: 0, maxItems: 8, price: GAME_CONFIG.items.egg.price }
    ];

    // Unlocks state
    this.unlockedCoop = false;
    this.hasCashier = false;
    this.hasHelper = false;

    // Objectives progression
    this.currentObjectiveIndex = 0;
    this.objectives = [
      { id: 1, text: "Tarladan domates topla ve sirtina yukle", target: 4, current: 0, completed: false },
      { id: 2, text: "Topladigin domatesleri market raflarina yerlestir", target: 4, current: 0, completed: false },
      { id: 3, text: "Musterilerin alisveris yapmasini bekle ve paralari topla", target: 30, current: 0, completed: false },
      { id: 4, text: "Yeni raf alanina basarak 2. Rafi satin al (50 TL)", target: 50, current: 0, completed: false },
      { id: 5, text: "Tavuk Kumesi alanina basarak kumesi ac (90 TL)", target: 90, current: 0, completed: false },
      { id: 6, text: "Otomatik Kasiyer personeli ise al (180 TL)", target: 180, current: 0, completed: false },
      { id: 7, text: "Market Ciragi personeli ise al (250 TL)", target: 250, current: 0, completed: false }
    ];

    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  addCash(amount) {
    this.cash += amount;
    this.checkObjectiveProgress('cash', amount);
    this.notify();
  }

  spendCash(amount) {
    if (this.cash >= amount) {
      this.cash -= amount;
      this.notify();
      return true;
    }
    return false;
  }

  canPickItem() {
    return this.inventory.length < this.maxCapacity;
  }

  pushItem(item) {
    if (this.canPickItem()) {
      this.inventory.push(item);
      this.checkObjectiveProgress('harvest', 1);
      this.notify();
      return true;
    }
    return false;
  }

  popItemForShelf(shelfType) {
    // Find the topmost matching item in inventory
    for (let i = this.inventory.length - 1; i >= 0; i--) {
      if (this.inventory[i].type === shelfType) {
        const item = this.inventory.splice(i, 1)[0];
        this.checkObjectiveProgress('stock', 1);
        this.notify();
        return item;
      }
    }
    return null;
  }

  checkObjectiveProgress(type, val) {
    const current = this.objectives[this.currentObjectiveIndex];
    if (!current || current.completed) return;

    if (this.currentObjectiveIndex === 0 && type === 'harvest') {
      current.current += val;
    } else if (this.currentObjectiveIndex === 1 && type === 'stock') {
      current.current += val;
    } else if (this.currentObjectiveIndex === 2 && type === 'cash') {
      current.current += val;
    }

    if (current.current >= current.target) {
      current.completed = true;
      if (this.currentObjectiveIndex < this.objectives.length - 1) {
        this.currentObjectiveIndex++;
      }
    }
  }

  get currentObjective() {
    return this.objectives[this.currentObjectiveIndex] || { text: "Tebrikler! Marketi buyutmeye devam et!", current: 1, target: 1 };
  }
}
