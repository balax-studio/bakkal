/**
 * Mini Mart Neo - Main Bootstrap Script
 * Strictly ZERO Emojis Used
 */

import { MartState } from './game/mart-state.js';
import { VirtualJoystick } from './game/joystick.js';
import { ThreeMart } from './game/three-mart.js';
import { sound } from './game/sound-effects.js';

window.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize State
  const state = new MartState();

  // 2. Initialize Virtual Analog Joystick
  const joystick = new VirtualJoystick('joystick-zone', 'joystick-thumb');

  // 3. Initialize 3D Engine
  const canvas = document.getElementById('mart-canvas');
  const world = new ThreeMart(canvas, state, joystick);

  // 4. UI Elements Cache
  const hudCashVal = document.getElementById('hud-cash-val');
  const hudInvVal = document.getElementById('hud-inv-val');
  const hudInvBadge = document.getElementById('hud-inv-badge');
  const objectiveText = document.getElementById('objective-text');
  const objectiveProgress = document.getElementById('objective-progress');
  const toastContainer = document.getElementById('toast-container');

  // Drawer Elements
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawer = document.getElementById('services-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  // Sound & Boost Controls
  const btnSound = document.getElementById('btn-sound');
  const soundOn = document.getElementById('sound-icon-on');
  const soundOff = document.getElementById('sound-icon-off');
  const btnTurbo = document.getElementById('btn-speed-boost');

  // 5. Toast Notification Helper
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'neo-toast';
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2300);
  }

  // 6. Bind State Changes to HUD
  function renderHUD() {
    hudCashVal.textContent = `${state.cash} ₺`;
    hudInvVal.textContent = `${state.inventory.length} / ${state.maxCapacity}`;

    if (state.inventory.length === 0) {
      hudInvBadge.textContent = "BOŞ";
      hudInvBadge.style.background = "#f1f5f9";
      hudInvBadge.style.color = "#64748b";
    } else if (state.inventory.length >= state.maxCapacity) {
      hudInvBadge.textContent = "DOLU";
      hudInvBadge.style.background = "#ef4444";
      hudInvBadge.style.color = "#ffffff";
    } else {
      hudInvBadge.textContent = "YÜKLÜ";
      hudInvBadge.style.background = "#10b981";
      hudInvBadge.style.color = "#ffffff";
    }

    const obj = state.currentObjective;
    objectiveText.textContent = obj.text;
    const pct = Math.min(100, Math.round((obj.current / (obj.target || 1)) * 100));
    objectiveProgress.style.width = `${pct}%`;
  }

  state.subscribe(renderHUD);
  renderHUD();

  // 7. Drawer Toggle
  function openDrawer() {
    sound.playClick();
    drawer.classList.remove('hidden');
    backdrop.classList.remove('hidden');
  }

  function closeDrawer() {
    sound.playClick();
    drawer.classList.add('hidden');
    backdrop.classList.add('hidden');
  }

  btnOpenDrawer.addEventListener('click', openDrawer);
  btnCloseDrawer.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // 8. Sound Toggle
  btnSound.addEventListener('click', () => {
    sound.enabled = !sound.enabled;
    if (sound.enabled) {
      soundOn.classList.remove('hidden');
      soundOff.classList.add('hidden');
      sound.playClick();
      showToast("Ses Acildi");
    } else {
      soundOn.classList.add('hidden');
      soundOff.classList.remove('hidden');
    }
  });

  // 9. Speed Boost Turbo
  let turboTimeout = null;
  btnTurbo.addEventListener('click', () => {
    if (state.speedBoostActive) return;
    sound.playPop();
    state.speedBoostActive = true;
    btnTurbo.style.background = '#ef4444';
    btnTurbo.style.color = '#ffffff';
    showToast("TURBO AKTIF: Hiz +%60!");

    clearTimeout(turboTimeout);
    turboTimeout = setTimeout(() => {
      state.speedBoostActive = false;
      btnTurbo.style.background = '#f59e0b';
      btnTurbo.style.color = '#09090b';
    }, 6000);
  });

  // 10. Neo-Brutalist Drawer Cards Interactivity
  const cards = document.querySelectorAll('.neo-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;
      sound.playClick();

      switch (action) {
        case 'scrap':
          state.scrapParts += 5;
          state.addCash(25);
          document.getElementById('badge-scrap').textContent = `${state.scrapParts} Parça`;
          showToast("Hurdalik Temizlendi: +25 TL ve 5 Parca Geliri!");
          break;

        case 'reviews':
          state.xp += 50;
          document.getElementById('badge-xp').textContent = `${state.xp} XP`;
          showToast("Musteri Yorumlari Olumlu: +50 XP!");
          break;

        case 'decor':
          document.getElementById('badge-decor').textContent = "Luks Floor";
          showToast("Showroom Mimari Guncellendi: Zemin Parlatildi!");
          break;

        case 'rent':
          world.customerManager.spawnInterval = 2.0;
          showToast("Rent-a-Car Devrede: Musteri Gelis Hizi 2 Katina Cikti!");
          break;

        case 'passive':
          state.addCash(15);
          showToast("Yan Isletmeler Otomat Geliri: +15 TL Tahsil Edildi!");
          break;

        case 'marketshare':
          state.marketShare = Math.min(100, state.marketShare + 10);
          document.getElementById('badge-share').textContent = `%${state.marketShare}`;
          showToast(`Semt Hakimiyeti Artti: Pazar Payi %${state.marketShare}!`);
          break;

        case 'intel':
          showToast("Dedikodu Istihbarati: Domates talebi bugun cok yuksek!");
          break;

        case 'consignment':
          // Restock all unlocked shelves instantly
          state.shelves.forEach(s => {
            if (s.unlocked) s.items = s.maxItems;
          });
          world.updateShelfMeshes();
          sound.playUnlock();
          showToast("Konsinye Sevkiyat: Tum Raflar Tiklim Tiklim Dolduruldu!");
          break;

        case 'modding':
          state.maxCapacity += 2;
          document.getElementById('badge-speed').textContent = `Kapasite ${state.maxCapacity}`;
          renderHUD();
          showToast(`Gece Sanayisi Modifiyesi: Canta Kapasitesi ${state.maxCapacity} Oldu!`);
          break;

        case 'casino':
          const reward = [50, 75, 100, 150][Math.floor(Math.random() * 4)];
          state.addCash(reward);
          sound.playCash();
          showToast(`Yeralti Casino VIP Kazanci: +${reward} TL Ikramiye!`);
          break;
      }
    });
  });

  // Periodic passive income ticker (every 12 seconds: +5 TL)
  setInterval(() => {
    state.addCash(5);
  }, 12000);
});
