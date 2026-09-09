/**
 * Mini Mart Neo - Game State Manager
 * Zero Emojis Used
 */

export class MartState {
  constructor() {
    this.cash = 60; // Starting money
    this.inventory = []; // Array of carried items { type: 'tomato', id: number }
    this.maxCapacity = 6;
    this.playerSpeed = 7.5;
    this.speedBoostActive = false;
    this.level = 1;
    this.xp = 100;
    this.scrapParts = 0;
    this.marketShare = 35;
    this.soundEnabled = true;

    // Shelves state: Shelf 1 (default unlocked), Shelf 2 (unlockable), Shelf 3
    this.shelves = [
      { id: 1, type: 'tomato', unlocked: true, items: 0, maxItems: 12, price: 5 },
      { id: 2, type: 'tomato', unlocked: false, cost: 50, items: 0, maxItems: 12, price: 6 },
      { id: 3, type: 'special', unlocked: false, cost: 120, items: 0, maxItems: 12, price: 10 }
    ];

    // Staff state
    this.hasCashier = false;
    this.cashierCost = 150;

    // Cash register accumulated earnings waiting for pickup
    this.registerCash = 0;

    // Current Active Objective
    this.currentObjectiveIndex = 0;
    this.objectives = [
      { id: 1, text: "Tarladan domates topla ve sirtina yukle", target: 4, current: 0, completed: false },
      { id: 2, text: "Topladigin domatesleri market raflarina yerlestir", target: 4, current: 0, completed: false },
      { id: 3, text: "Musterilerin kasadan alisveris yapmasini bekle ve paralari al", target: 30, current: 0, completed: false },
      { id: 4, text: "Yeni raf alanina basarak 2. Rafi satin al (50 TL)", target: 50, current: 0, completed: false },
      { id: 5, text: "Otomatik Kasiyer personeli ise al (150 TL)", target: 150, current: 0, completed: false }
    ];

    // Event listeners
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

  popItem() {
    if (this.inventory.length > 0) {
      const item = this.inventory.pop();
      this.checkObjectiveProgress('stock', 1);
      this.notify();
      return item;
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
    return this.objectives[this.currentObjectiveIndex] || { text: "Harika! Marketi buyutmeyi surdur!", current: 1, target: 1 };
  }
}
