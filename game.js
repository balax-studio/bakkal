/**
 * PIXELOIL 3D - 16-BIT LOW-POLY NEO-BRUTALIST WEBGL ENGINE
 * Powered by Three.js & Web Audio API
 */

// =========================================================
// 1. I18N DYNAMIC MULTI-LANGUAGE SYSTEM (TR / EN)
// =========================================================

const I18N = {
  tr: {
    cash: 'KASA',
    day: 'GÜN',
    reputation: 'İTİBAR',
    gasoline: 'BENZİN',
    diesel: 'DİZEL',
    lpg: 'LPG',
    electric: 'ELEKTRİK',
    fab_build: 'İnşaat',
    fab_order: 'Sipariş',
    fab_office: 'Ofis',
    liters_label: 'LİTRE (L)',
    cost_label: 'TUTAR (TL)',
    fill_full: 'FULLE',
    btn_start_pump: 'POMPAYI BAŞLAT',
    btn_finish_pump: 'TAMAMLA & UĞURLA',
    btn_wash_tip: 'Camları Sil (+₺25 Bahşiş)',
    build_title: 'İstasyon Yatırımları & Geliştirme',
    tab_custom: 'Özelleştirme',
    tab_fac: 'Tesis & Personel',
    tab_energy: 'Yeşil Enerji & EV',
    tab_land: 'Arsa Genişletme',
    themes_title: 'İstasyon Teması',
    visual_addons_title: 'Görsel Eklentiler',
    addon_totem_title: 'LED Dijital Fiyat Totemi',
    addon_totem_desc: 'Yoldan geçen araçların istasyona sapma oranını artırır.',
    addon_garden_title: 'Peyzaj & Çiçek Bahçeleri',
    addon_garden_desc: 'Müşteri memnuniyetini ve bahşiş miktarını yükseltir.',
    fac_title: 'Yan Gelir Tesisleri',
    upgrade_pump_title: 'Pompa Adası Ekle',
    upgrade_pump_desc: 'Aynı anda daha fazla araca dolum yapın.',
    upgrade_wash_title: 'Otomatik Tünel Oto Yıkama',
    upgrade_wash_desc: 'Her araçtan otomatik ₺45 yıkama ücreti tahsil eder.',
    upgrade_market_title: '7/24 Mini Market & Kahve',
    upgrade_market_desc: 'Akaryakıt alan sürücülere atıştırmalık ve kahve satar (+₺35/araç).',
    staff_title: 'Personel İstihdamı & Eğitimi',
    staff_attendant: 'Pompacı',
    staff_attendant_desc: 'Dolumu otomatikleştirir, seviye arttıkça hızlanır.',
    staff_cashier: 'Kasiyer',
    staff_cashier_desc: 'Market ve kasa işlem hızını ikiye katlar.',
    staff_manager: 'Vardiya Müdürü',
    staff_manager_desc: 'Dolum ve tanker siparişlerini tamamen otomatikleştirir.',
    energy_title: 'Yeşil Enerji Altyapısı',
    ev_title: 'EV Ultra Şarj Ağı',
    ev_charger_title: '350kW DC Ultra Hızlı EV Şarj Yuvası',
    ev_charger_desc: 'Elektrikli araçları 15 saniyede doldurur (+₺120 şarj ücreti).',
    land_title: 'İmar İzinleri & Parsel Alımı',
    btn_bought: 'ALINDI',
    btn_active: 'AKTİF',
    btn_working: 'ÇALIŞIYOR',
    btn_in_progress: 'İNŞA EDİLİYOR',
    btn_training: 'EĞİTİLİYOR',
    order_title: 'Yakıt Siparişi (Tanker)',
    tank_status: 'Depo',
    office_title: 'İstasyon Yönetim & Finans',
    tab_finance: 'Muhasebe & Kar/Zarar',
    tab_tenders: 'B2B Filo İhaleleri',
    tab_tariffs: 'Satış Tarifesi',
    daily_ledger_title: 'Günlük Mali Durum Tablosu',
    ledger_fuel_rev: 'Akaryakıt Brüt Satış:',
    ledger_fuel_cost: 'Akaryakıt Toptan Alım:',
    ledger_fac_rev: 'Tesis & Market Gelirleri:',
    ledger_salaries: 'Personel Maaş Giderleri:',
    ledger_energy: 'Güneş Enerjisi Şebeke Katkısı:',
    ledger_net_profit: 'GÜNLÜK NET KAR:',
    bank_loan_title: 'Banka İthalat Kredisi (₺25.000)',
    bank_loan_desc: 'Acil nakit akışı sağlar (Günlük %2 faiz kesilir).',
    tenders_title: 'Kurumsal Akaryakıt İhaleleri',
    tariff_title: 'Litre / Birim Satış Tarifesi',
    cost_prefix: 'Maliyet',
    no_waiting_car: '(Bekleyen Araç Yok)',
    toast_welcome: 'PixelOil 3D İstasyonuna Hoş Geldiniz!',
    toast_car_docked: 'Araç #{0} pompasına yanaştı. (Manuel doldurmak için tıklayın)',
    toast_fuel_empty: 'UYARI: Depoda {0} kalmadı!',
    toast_collected: '+₺{0} tahsil edildi.',
    toast_tip: 'Camlar temizlendi (+₺25 Bahşiş).',
    toast_mgr: 'Pompacı: Pompa #{0} dolduruldu (+₺{1})',
    toast_speed: 'Zaman Hızı: {0}x',
    toast_max_pumps: 'Maksimum pompa sayısına ulaşıldı (4).',
    toast_insufficient_funds: 'Yetersiz bakiye! (Gereken: ₺{0})',
    toast_construction_started: '{0} inşaatı başladı! ({1} sn)',
    toast_construction_finished: '{0} inşaatı tamamlandı!',
    toast_training_started: '{0} eğitimi başladı! ({1} sn)',
    toast_training_finished: '{0} eğitimi tamamlandı (Seviye {1})!',
    toast_wash_active: 'Otomatik Oto Yıkama kuruldu (+₺45/araç).',
    toast_market_active: '7/24 Mini Market ve Cafe açıldı (+₺35/araç).',
    toast_solar_built: 'Çatı GES panelleri kuruldu. Elektrik faturası ₺0.',
    toast_turbine_built: 'Mikro Rüzgar Türbini kuruldu (+₺180/saat).',
    toast_ev_built: '350kW DC EV Ultra Şarj istasyonu kuruldu.',
    toast_land_expanded: 'Parsel {0} satın alındı. İstasyon arazisi genişletildi!',
    toast_loan_taken: '₺25.000 banka kredisi hesaba geçti.',
    toast_tender_signed: '{0} ihalesi imzalandı. Günlük ödeme bağlandı.',
    toast_theme_applied: '{0} teması başarıyla uygulandı.',
    toast_tanker_arrived: '{0}L {1} tankeri ikmal yaptı.',
    toast_tank_overflow: 'Depo kapasitesi aşılıyor! (Boş yer: {0} L)',
    toast_tariff_updated: '{0} tarifesi güncellendi: ₺{1}',
    toast_new_day: 'GÜN {0} BAŞLADI (Gece Raporu İşlendi)',
    toast_target: 'Hedef dolum: {0}',
    plot_click_prompt: '{0} inşa etmek için tıklayın (₺{1})',
    plot_pump2: 'Pompa #2',
    plot_pump3: 'Pompa #3',
    plot_pump4: 'Pompa #4',
    plot_wash: 'Oto Yıkama',
    plot_market: 'Mini Market',
    plot_solar: 'Çatı GES',
    plot_turbine: 'Rüzgar Türbini',
    plot_ev: 'EV Şarj',
    settings_title: 'Ayarlar & Sistem',
    tab_settings_audio: 'Ses & Dil',
    tab_settings_graphics: 'Grafik',
    tab_settings_legal: 'Mağaza & Yasal',
    settings_audio_title: 'Ses ve Efekt Ayarları',
    settings_sfx_title: 'Ses Efektleri (SFX)',
    settings_sfx_desc: 'Pompa, dolum, araç motoru ve tıklama sesleri.',
    settings_ambience_title: 'Çevre & Doğa Sesleri',
    settings_ambience_desc: 'Kuş sesleri, rüzgar esintisi ve gece cırcır böcekleri.',
    settings_volume_title: 'Ana Ses Düzeyi',
    settings_volume_desc: 'Oyun içi tüm seslerin seviyesi.',
    settings_lang_title: 'Arayüz Dili',
    settings_lang_select: 'Dil / Language',
    settings_lang_desc: 'Türkçe ve İngilizce arasında anında geçiş yapın.',
    settings_graphics_title: 'Görsel & 60 FPS Optimizasyon',
    settings_shadows_title: 'Gerçek Zamanlı Gölgeler',
    settings_shadows_desc: 'Düşük donanımlı cihazlarda performansı artırmak için kapatabilirsiniz.',
    settings_quality_title: 'Render Kalite Profili',
    settings_quality_desc: 'Piksel çözünürlük ölçeği ve doku filtreleme kalitesi.',
    settings_fps_title: 'Hedef Kare Hızı (FPS)',
    settings_fps_desc: 'Mobil pil tasarrufu için 30 veya 60 FPS sabitleyebilirsiniz.',
    settings_legal_title: 'App Store & Google Play Standartları',
    compliance_desc: 'PixelOil 3D, Apple App Store Guidelines (§5.1.1 Veri Gizliliği, §3.1.1 IAP Standartları) ve Google Play Geliştirici Politikaları ile tam uyumludur.',
    legal_privacy_btn: 'Gizlilik Politikası',
    legal_terms_btn: 'Kullanım Koşulları',
    legal_restore_btn: 'Satın Alımları Geri Yükle',
    legal_support_btn: 'Destek & Geri Bildirim',
    legal_reset_title: 'Oyun Verilerini Sıfırla (GDPR)',
    legal_reset_desc: 'Yerel kayıtlı tüm istasyon ve finansal verilerini temizler.',
    legal_reset_btn: 'Verileri Sıfırla',
    toast_restore_success: 'Önceki mağaza satın alımları başarıyla geri yüklendi.',
    toast_data_reset: 'Tüm oyun verileri sıfırlandı ve oyun yeniden başlatıldı.',
    toast_debug_money: 'Debug: Kasa ₺{0} artırıldı.',
    toast_debug_tanks: 'Debug: Tüm depolar dolduruldu (%100).',
    toast_debug_timers: 'Debug: Tüm aktif süreler tamamlandı.',
    toast_debug_unlock: 'Debug: Tüm tesisler ve arsalar açıldı!',
    cam_center: 'Odak',
    cam_hint: 'Sol Tık: Kaydır · Sağ Tık: Döndür · WASD',
    toast_cam_reset: 'Kamera istasyon merkezine odaklandı.'
  },
  en: {
    cash: 'CASH',
    day: 'DAY',
    reputation: 'RATING',
    gasoline: 'GASOLINE',
    diesel: 'DIESEL',
    lpg: 'LPG',
    electric: 'ELECTRIC',
    fab_build: 'Build',
    fab_order: 'Order',
    fab_office: 'Office',
    liters_label: 'LITERS (L)',
    cost_label: 'COST (TL)',
    fill_full: 'FILL UP',
    btn_start_pump: 'START PUMP',
    btn_finish_pump: 'COMPLETE & DISMISS',
    btn_wash_tip: 'Wash Windshield (+₺25 Tip)',
    build_title: 'Station Investments & Upgrades',
    tab_custom: 'Customization',
    tab_fac: 'Facility & Staff',
    tab_energy: 'Green Energy & EV',
    tab_land: 'Land Expansion',
    themes_title: 'Station Theme',
    visual_addons_title: 'Visual Addons',
    addon_totem_title: 'LED Digital Price Totem',
    addon_totem_desc: 'Increases highway bypass vehicle turn-in rate.',
    addon_garden_title: 'Landscape & Flower Gardens',
    addon_garden_desc: 'Increases customer satisfaction and tip rates.',
    fac_title: 'Secondary Revenue Facilities',
    upgrade_pump_title: 'Add Pump Island',
    upgrade_pump_desc: 'Service more vehicles simultaneously.',
    upgrade_wash_title: 'Automatic Tunnel Car Wash',
    upgrade_wash_desc: 'Charges ₺45 automatic wash fee per serviced car.',
    upgrade_market_title: '24/7 Mini Market & Cafe',
    upgrade_market_desc: 'Sells coffee & snacks to fuel customers (+₺35/car).',
    staff_title: 'Staff Hiring & Training',
    staff_attendant: 'Pump Attendant',
    staff_attendant_desc: 'Automates refueling, speed increases per level.',
    staff_cashier: 'Cashier',
    staff_cashier_desc: 'Doubles market and checkout register speed.',
    staff_manager: 'Shift Manager',
    staff_manager_desc: 'Fully automates refueling and tanker replenishments.',
    energy_title: 'Green Energy Infrastructure',
    ev_title: 'EV Ultra Fast Charging Network',
    ev_charger_title: '350kW DC Ultra Fast EV Charger',
    ev_charger_desc: 'Charges EVs in 15 seconds (+₺120 charging fee).',
    land_title: 'Zoning Permits & Parcel Acquisition',
    btn_bought: 'PURCHASED',
    btn_active: 'ACTIVE',
    btn_working: 'WORKING',
    btn_in_progress: 'BUILDING',
    btn_training: 'TRAINING',
    order_title: 'Fuel Tanker Order',
    tank_status: 'Tank',
    office_title: 'Station Management & Finance',
    tab_finance: 'Accounting & P/L',
    tab_tenders: 'B2B Fleet Tenders',
    tab_tariffs: 'Price Tariffs',
    daily_ledger_title: 'Daily Financial Balance Sheet',
    ledger_fuel_rev: 'Gross Fuel Revenue:',
    ledger_fuel_cost: 'Wholesale Fuel Cost:',
    ledger_fac_rev: 'Facility & Market Revenue:',
    ledger_salaries: 'Staff Payroll Expenses:',
    ledger_energy: 'Solar Grid Contribution:',
    ledger_net_profit: 'DAILY NET PROFIT:',
    bank_loan_title: 'Bank Commercial Loan (₺25,000)',
    bank_loan_desc: 'Provides immediate liquidity (Daily 2% interest).',
    tenders_title: 'Corporate Fuel Tenders',
    tariff_title: 'Fuel Unit Price Tariff',
    cost_prefix: 'Cost',
    no_waiting_car: '(No Waiting Vehicle)',
    toast_welcome: 'Welcome to PixelOil 3D Station!',
    toast_car_docked: 'Vehicle docked at Pump #{0}. (Click to manually refuel)',
    toast_fuel_empty: 'WARNING: Out of {0} fuel in storage!',
    toast_collected: '+₺{0} collected.',
    toast_tip: 'Windshield cleaned (+₺25 Tip).',
    toast_mgr: 'Attendant: Filled Pump #{0} (+₺{1})',
    toast_speed: 'Time Speed: {0}x',
    toast_max_pumps: 'Maximum pump count reached (4).',
    toast_insufficient_funds: 'Insufficient funds! (Required: ₺{0})',
    toast_construction_started: '{0} construction started! ({1}s)',
    toast_construction_finished: '{0} construction completed!',
    toast_training_started: '{0} training started! ({1}s)',
    toast_training_finished: '{0} training complete (Level {1})!',
    toast_wash_active: 'Automatic Car Wash installed (+₺45/car).',
    toast_market_active: '24/7 Mini Market & Cafe opened (+₺35/car).',
    toast_solar_built: 'Solar panels installed. Power cost ₺0.',
    toast_turbine_built: 'Micro Wind Turbine installed (+₺180/hr).',
    toast_ev_built: '350kW DC EV Ultra Charger installed.',
    toast_land_expanded: 'Parcel {0} purchased. Station island expanded!',
    toast_loan_taken: '₺25,000 bank loan credited to balance.',
    toast_tender_signed: '{0} tender signed. Daily recurring payout active.',
    toast_theme_applied: '{0} theme applied successfully.',
    toast_tanker_arrived: '{0}L {1} tanker delivery completed.',
    toast_tank_overflow: 'Tank capacity exceeded! (Available: {0} L)',
    toast_tariff_updated: '{0} tariff updated: ₺{1}',
    toast_new_day: 'DAY {0} HAS BEGUN (Daily summary processed)',
    toast_target: 'Target fill: {0}',
    plot_click_prompt: 'Click to build {0} (₺{1})',
    plot_pump2: 'Pump #2',
    plot_pump3: 'Pump #3',
    plot_pump4: 'Pump #4',
    plot_wash: 'Car Wash',
    plot_market: 'Mini Market',
    plot_solar: 'Solar Roof',
    plot_turbine: 'Wind Turbine',
    plot_ev: 'EV Charging',
    settings_title: 'Settings & System',
    tab_settings_audio: 'Audio & Lang',
    tab_settings_graphics: 'Graphics',
    tab_settings_legal: 'Store & Legal',
    settings_audio_title: 'Sound & Audio Settings',
    settings_sfx_title: 'Sound Effects (SFX)',
    settings_sfx_desc: 'Pumps, refueling, vehicle engine and click sounds.',
    settings_ambience_title: 'Ambience & Nature Sounds',
    settings_ambience_desc: 'Bird chirping, wind breeze and night crickets.',
    settings_volume_title: 'Master Volume',
    settings_volume_desc: 'Volume level of all in-game sounds.',
    settings_lang_title: 'UI Language',
    settings_lang_select: 'Language',
    settings_lang_desc: 'Switch instantly between Turkish and English.',
    settings_graphics_title: 'Graphics & 60 FPS Optimization',
    settings_shadows_title: 'Real-time Shadows',
    settings_shadows_desc: 'Turn off to maximize performance on lower-end devices.',
    settings_quality_title: 'Render Quality Profile',
    settings_quality_desc: 'Pixel resolution scale and texture filtering quality.',
    settings_fps_title: 'Target Frame Rate (FPS)',
    settings_fps_desc: 'Cap frame rate at 30 or 60 FPS for battery optimization.',
    settings_legal_title: 'App Store & Google Play Standards',
    compliance_desc: 'PixelOil 3D fully complies with Apple App Store Guidelines (§5.1.1 Privacy, §3.1.1 IAP) and Google Play Policies.',
    legal_privacy_btn: 'Privacy Policy',
    legal_terms_btn: 'Terms of Service',
    legal_restore_btn: 'Restore Purchases',
    legal_support_btn: 'Support & Feedback',
    legal_reset_title: 'Reset Game Data (GDPR)',
    legal_reset_desc: 'Clears all locally saved station and financial data.',
    legal_reset_btn: 'Reset Data',
    toast_restore_success: 'Previous store purchases restored successfully.',
    toast_data_reset: 'All game data reset and game re-initialized.',
    toast_debug_money: 'Debug: Added ₺{0} to balance.',
    toast_debug_tanks: 'Debug: All fuel tanks filled (100%).',
    toast_debug_timers: 'Debug: Completed all active timers.',
    toast_debug_unlock: 'Debug: All facilities and land unlocked!',
    cam_center: 'Focus',
    cam_hint: 'Left Click: Pan · Right Click: Rotate · WASD',
    toast_cam_reset: 'Camera centered on station.'
  }
};

let currentLang = localStorage.getItem('pixeloil_lang') || 'tr';

function t(key, ...args) {
  const dict = I18N[currentLang] || I18N.tr;
  let str = dict[key] || key;
  args.forEach((val, idx) => {
    str = str.replace(`{${idx}}`, val);
  });
  return str;
}

function toggleLanguage() {
  currentLang = currentLang === 'tr' ? 'en' : 'tr';
  localStorage.setItem('pixeloil_lang', currentLang);
  const ind = document.getElementById('lang-indicator');
  if (ind) ind.textContent = currentLang.toUpperCase();
  document.documentElement.lang = currentLang;
  updateI18nDOM();
  updateTotemSign();
  updateAllPlotSigns();
}

function updateI18nDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  const ind = document.getElementById('lang-indicator');
  if (ind) ind.textContent = currentLang.toUpperCase();
  updateHUD();
  updateOrderModalStatus();
  updateDailyLedger();
}

// =========================================================
// 2. GAME STATE & SIMULATION CONSTANTS
// =========================================================

const State = {
  money: 8500, // Balanced starting capital
  day: 1,
  hour: 8,
  minute: 0,
  timeSpeed: 1,
  rep: 4.8,
  totalRev: 0,
  totalCars: 0,

  // Storage Tanks (Current / Max)
  tanks: {
    benzin: { current: 3200, max: 5000, cost: 38.50, price: 44.90, color: 0xD64545 },
    dizel:  { current: 3800, max: 5000, cost: 39.20, price: 45.40, color: 0x27A05A },
    lpg:    { current: 1800, max: 3000, cost: 21.80, price: 26.20, color: 0xE8862E },
    ev:     { current: 100,  max: 100,  cost: 4.50,  price: 9.80,  color: 0x2F6FED }
  },

  // Upgrades & Facilities
  upgrades: {
    pumps: 1, // Start with ONLY 1 PUMP
    hasCarWash: false,
    hasMarket: false,
    hasSolar: false,
    hasTurbine: false,
    hasEvCharger: false,
    hasManager: false
  },

  // Themes
  theme: 'standard',
  unlockedThemes: ['standard'],

  // Visual Addons
  addons: {
    totem: false,
    garden: false
  },

  // Staff levels (Start with 0 - requires manual pumping initially!)
  staff: {
    attendant: 0,
    cashier: 0,
    manager: 0
  },

  // Land Parcels
  land: {
    size: 80,
    parcelA: false,
    parcelB: false,
    parcelC: false
  },

  // Active Asynchronous Timers (Construction & Staff Training)
  activeTimers: [],

  // Financials & Ledger
  finance: {
    fuelRev: 0,
    fuelCost: 0,
    facRev: 0,
    salaries: 0,
    energyNet: 0,
    netProfit: 0,
    loan: 0
  },

  // Contracts & B2B Tenders
  contracts: {
    bus: false,
    courier: false,
    taxi: false
  },

  // Order quantities for tanker modal
  orderQtys: {
    benzin: 1000,
    dizel: 1500,
    lpg: 800
  },

  // Active Refueling Interaction
  activePump: null,
  activeCar: null,
  isPumping: false,
  pumpedLiters: 0,
  pumpedCost: 0,
  targetCost: 'FULL',

  // System Settings & Audio / Graphics Options
  settings: {
    sfx: localStorage.getItem('pixeloil_sfx') !== 'false',
    ambience: localStorage.getItem('pixeloil_ambience') !== 'false',
    volume: parseInt(localStorage.getItem('pixeloil_vol') || '80', 10),
    shadows: localStorage.getItem('pixeloil_shadows') !== 'false',
    quality: localStorage.getItem('pixeloil_quality') || 'high',
    targetFps: parseInt(localStorage.getItem('pixeloil_fps') || '60', 10)
  }
};

// =========================================================
// 3. WEB AUDIO 16-BIT SYNTHESIZER
// =========================================================

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  getVolumeScale() {
    return (State.settings.volume / 100);
  }

  playCoin() {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
    const vol = 0.12 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playPumpTick() {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    const vol = 0.05 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playHammer() {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
    const vol = 0.12 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playFanfare() {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = 0.08 * this.getVolumeScale();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(vol, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.25);
    });
  }

  playHonk() {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    const vol = 0.08 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playBirdChirp() {
    if (!State.settings.ambience) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
    const vol = 0.03 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playCricket() {
    if (!State.settings.ambience) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(4500, now);
    const vol = 0.015 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }
}
const sfx = new SoundFX();

// =========================================================
// 4. THREE.JS 3D SCENE SETUP & LIVING DIORAMA
// =========================================================

let scene, camera, renderer, controls;
let sunLight, ambientLight;
let shopInteriorLight = null;
let totemGlowLight = null;
const cars = [];
const animatedTrees = [];
const clouds = [];
const nightLights = [];
const bgVehicles = [];
const particles = [];
const birds = [];
const sheepList = [];
let dogMesh = null;
let catMesh = null;

// Dynamic Building Mesh References
let carWashGroup = null;
let marketBayGroup = null;
let solarPanelsGroup = null;
let turbineGroup = null;
let turbineRotor = null;
let evChargerGroup = null;
let islandGrassMesh = null;
let islandDirtMesh = null;
let islandSlabMesh = null;

const pumpSlots = [
  { id: 0, pos: new THREE.Vector3(-4, 0, -2), occupiedBy: null, mesh: null, isBuilt: true },
  { id: 1, pos: new THREE.Vector3(4, 0, -2),  occupiedBy: null, mesh: null, isBuilt: false },
  { id: 2, pos: new THREE.Vector3(-4, 0, 4),  occupiedBy: null, mesh: null, isBuilt: false },
  { id: 3, pos: new THREE.Vector3(4, 0, 4),   occupiedBy: null, mesh: null, isBuilt: false }
];

// Pre-designated 3D Construction Plots
const PLOTS = {
  pump2:   { id: 'pump2',   type: 'pump',    slotId: 1, pos: new THREE.Vector3(4, 0, -2),   cost: 6000,  duration: 45, name: 'Pompa #2',   tab: 'fac' },
  pump3:   { id: 'pump3',   type: 'pump',    slotId: 2, pos: new THREE.Vector3(-4, 0, 4),   cost: 8000,  duration: 45, name: 'Pompa #3',   tab: 'fac' },
  pump4:   { id: 'pump4',   type: 'pump',    slotId: 3, pos: new THREE.Vector3(4, 0, 4),    cost: 10000, duration: 45, name: 'Pompa #4',   tab: 'fac' },
  wash:    { id: 'wash',    type: 'wash',    pos: new THREE.Vector3(16, 0.04, -2),          cost: 12000, duration: 90, name: 'Oto Yıkama', tab: 'fac' },
  market:  { id: 'market',  type: 'market',  pos: new THREE.Vector3(-14, 0.04, -8),         cost: 14000, duration: 90, name: 'Mini Market',tab: 'fac' },
  solar:   { id: 'solar',   type: 'solar',   pos: new THREE.Vector3(0, 4.55, -9.5),         cost: 8500,  duration: 60, name: 'Çatı GES',   tab: 'energy' },
  turbine: { id: 'turbine', type: 'turbine', pos: new THREE.Vector3(-22, 0.04, -8),         cost: 11000, duration: 60, name: 'Rüzgar Türbini', tab: 'energy' },
  ev:      { id: 'ev',      type: 'ev',      pos: new THREE.Vector3(-8, 0.04, 4),           cost: 18000, duration: 60, name: 'EV Şarj',    tab: 'energy' }
};

const plotSignMeshes = {};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Calibrated Low-Poly Materials Palette (Cozy Warm Pastel Tycoon)
const Mat = {
  grass: new THREE.MeshLambertMaterial({ color: 0x7DA468 }),
  dirt: new THREE.MeshLambertMaterial({ color: 0xA87C58 }),
  asphalt: new THREE.MeshLambertMaterial({ color: 0x38414B }),
  concrete: new THREE.MeshLambertMaterial({ color: 0xE5DFD0 }),
  roadYellow: new THREE.MeshLambertMaterial({ color: 0xE5B242 }),
  roadWhite: new THREE.MeshLambertMaterial({ color: 0xDCD8CF }),
  buildingWall: new THREE.MeshLambertMaterial({ color: 0xF7F2E4 }),
  buildingRoof: new THREE.MeshLambertMaterial({ color: 0x4A5568 }),
  redTrim: new THREE.MeshLambertMaterial({ color: 0xD45D56 }),
  greenAccent: new THREE.MeshLambertMaterial({ color: 0x4E9B66 }),
  orangeAccent: new THREE.MeshLambertMaterial({ color: 0xDC7E34 }),
  blueAccent: new THREE.MeshLambertMaterial({ color: 0x4879D6 }),
  darkInk: new THREE.MeshLambertMaterial({ color: 0x242D35 }),
  glass: new THREE.MeshLambertMaterial({ color: 0x8CBAD6, transparent: true, opacity: 0.80 }),
  wood: new THREE.MeshLambertMaterial({ color: 0x7E5A3D }),
  foliage: new THREE.MeshLambertMaterial({ color: 0x5E8B4E }),
  foliageDark: new THREE.MeshLambertMaterial({ color: 0x446B38 }),
  metalTank: new THREE.MeshLambertMaterial({ color: 0xE8E3D7 }),
  chrome: new THREE.MeshLambertMaterial({ color: 0xB4BDC5 }),
  rockGrey: new THREE.MeshLambertMaterial({ color: 0x86929F }),
  rockDark: new THREE.MeshLambertMaterial({ color: 0x586472 }),
  grassHill: new THREE.MeshLambertMaterial({ color: 0x6E955A }),
  // Rich Flora & Fauna
  flowerRed: new THREE.MeshLambertMaterial({ color: 0xD85A65 }),
  flowerYellow: new THREE.MeshLambertMaterial({ color: 0xEDC364 }),
  flowerPink: new THREE.MeshLambertMaterial({ color: 0xEB8BA7 }),
  flowerStem: new THREE.MeshLambertMaterial({ color: 0x5F8E3C }),
  planterWood: new THREE.MeshLambertMaterial({ color: 0x6E4C33 }),
  benchWood: new THREE.MeshLambertMaterial({ color: 0x936647 }),
  benchIron: new THREE.MeshLambertMaterial({ color: 0x333C48 }),
  dogFur: new THREE.MeshLambertMaterial({ color: 0xC8A253 }),
  dogMuzzle: new THREE.MeshLambertMaterial({ color: 0x4A3528 }),
  dogCollar: new THREE.MeshLambertMaterial({ color: 0xD45D56 }),
  dogMat: new THREE.MeshLambertMaterial({ color: 0x4F6D8C }),
  catFur: new THREE.MeshLambertMaterial({ color: 0xF4E7D0 }),
  catSpot: new THREE.MeshLambertMaterial({ color: 0xC29577 }),
  birdBlue: new THREE.MeshLambertMaterial({ color: 0x64B8D8 }),
  birdBeak: new THREE.MeshLambertMaterial({ color: 0xE89E2E }),
  lampPost: new THREE.MeshLambertMaterial({ color: 0x2D3742 }),
  lampGlow: new THREE.MeshBasicMaterial({ color: 0xFFE082 }),
  cloud: new THREE.MeshLambertMaterial({ color: 0xF9F9FB, transparent: true, opacity: 0.92 }),
  oilStain: new THREE.MeshLambertMaterial({ color: 0x222A33, transparent: true, opacity: 0.55 }),
  trashGreen: new THREE.MeshLambertMaterial({ color: 0x3B7A5C }),
  airTowerBlue: new THREE.MeshLambertMaterial({ color: 0x355577 }),
  fireRed: new THREE.MeshLambertMaterial({ color: 0xD45D56 }),
  solarCell: new THREE.MeshLambertMaterial({ color: 0x243556 }),
  solarFrame: new THREE.MeshLambertMaterial({ color: 0xC6CED6 }),
  evGlow: new THREE.MeshBasicMaterial({ color: 0x4EE4EA }),
  // Scaffolding & Custom Construction Plots
  hazardCone: new THREE.MeshLambertMaterial({ color: 0xF37A20 }),
  hazardStripe: new THREE.MeshLambertMaterial({ color: 0xF2BA36 }),
  palletWood: new THREE.MeshLambertMaterial({ color: 0x966F48 }),
  brickClay: new THREE.MeshLambertMaterial({ color: 0xB55239 }),
  sandPile: new THREE.MeshLambertMaterial({ color: 0xD6B88D }),
  scaffoldWood: new THREE.MeshLambertMaterial({ color: 0xB89369 }),
  plotDashed: new THREE.MeshBasicMaterial({ color: 0xE5A93C, wireframe: true }),
  plotSignBg: new THREE.MeshLambertMaterial({ color: 0x242D35 })
};

function initThree() {
  const container = document.getElementById('canvas-container');
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCE0ED);

  // Orthographic Camera (Isometric 2:1)
  const aspect = width / height;
  const d = 18;
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(26, 24, 26);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Controls with Smooth Isometric Tycoon Ground Pan
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.screenSpacePanning = false; // Smooth horizontal ground-plane panning (Tycoon standard)
  controls.panSpeed = 1.35;
  controls.rotateSpeed = 0.85;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minPolarAngle = Math.PI / 10;
  controls.minZoom = 0.35;
  controls.maxZoom = 4.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,      // Sol tık ile haritada serbestçe gezinme / kaydırma
    MIDDLE: THREE.MOUSE.DOLLY,  // Orta tekerlek ile yakınlaştırma / uzaklaştırma
    RIGHT: THREE.MOUSE.ROTATE   // Sağ tık ile 360 izometrik açıyı döndürme
  };
  controls.touches = {
    ONE: THREE.TOUCH.PAN,       // Mobil tek parmak: kaydır
    TWO: THREE.TOUCH.DOLLY_PAN  // Mobil iki parmak: yakınlaştır ve kaydır
  };

  // Lights - Warm Soft Sunlight & Balanced Pastel Ambient
  ambientLight = new THREE.AmbientLight(0xE4EBF2, 0.65);
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0xFFF6E8, 0.95);
  sunLight.position.set(18, 30, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 120;
  const shadowDist = 30;
  sunLight.shadow.camera.left = -shadowDist;
  sunLight.shadow.camera.right = shadowDist;
  sunLight.shadow.camera.top = shadowDist;
  sunLight.shadow.camera.bottom = -shadowDist;
  scene.add(sunLight);

  // Build Living Environment
  buildDiorama();

  // Events
  window.addEventListener('resize', onWindowResize);
  initPointerAndKeyboard();

  // Start Loop
  animate();
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  const d = 18;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// =========================================================
// 5. LIVING 3D DIORAMA MESH BUILDERS
// =========================================================

function buildDiorama() {
  const diorama = new THREE.Group();

  // 1. Extended Island Ground Base (80x80 Floating Neo-Brutalist Diorama)
  const grassGeo = new THREE.BoxGeometry(80, 1.5, 80);
  islandGrassMesh = new THREE.Mesh(grassGeo, Mat.grass);
  islandGrassMesh.position.y = -0.75;
  islandGrassMesh.receiveShadow = true;
  diorama.add(islandGrassMesh);

  // Stepped Earth Soil Layer
  const dirtGeo = new THREE.BoxGeometry(80, 2.2, 80);
  islandDirtMesh = new THREE.Mesh(dirtGeo, Mat.dirt);
  islandDirtMesh.position.y = -2.6;
  diorama.add(islandDirtMesh);

  // Dark Ink Floating Base Rim Slab
  const baseSlabGeo = new THREE.BoxGeometry(82, 0.6, 82);
  islandSlabMesh = new THREE.Mesh(baseSlabGeo, Mat.darkInk);
  islandSlabMesh.position.y = -3.8;
  diorama.add(islandSlabMesh);

  // 2. Asphalt Highway Road (80 Units Full Width)
  const roadGeo = new THREE.BoxGeometry(80, 0.06, 7.5);
  const roadMesh = new THREE.Mesh(roadGeo, Mat.asphalt);
  roadMesh.position.set(0, 0.03, 11.5);
  roadMesh.receiveShadow = true;
  diorama.add(roadMesh);

  // Double Yellow Lines across full 80-unit highway
  for (let i = -38; i <= 38; i += 3) {
    const lineGeo = new THREE.BoxGeometry(1.8, 0.02, 0.15);
    const line1 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    line1.position.set(i, 0.07, 11.35);
    const line2 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    line2.position.set(i, 0.07, 11.65);
    diorama.add(line1, line2);
  }

  // 3. Station Concrete Forecourt Apron
  const apronGeo = new THREE.BoxGeometry(22, 0.08, 18);
  const apronMesh = new THREE.Mesh(apronGeo, Mat.concrete);
  apronMesh.position.set(0, 0.04, 0);
  apronMesh.receiveShadow = true;
  diorama.add(apronMesh);

  // Forecourt Driveway Curb Trim
  const curbGeo = new THREE.BoxGeometry(22.4, 0.14, 0.3);
  const curbFront = new THREE.Mesh(curbGeo, Mat.darkInk);
  curbFront.position.set(0, 0.07, 7.8);
  diorama.add(curbFront);

  // Oil Stain on Station Forecourt
  const stain1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.01, 8), Mat.oilStain);
  stain1.position.set(-4, 0.09, -2);
  diorama.add(stain1);

  // 4. Main Minimarket Building
  const shopGroup = new THREE.Group();
  const shopBody = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 5.5), Mat.buildingWall);
  shopBody.position.set(0, 2.1, -9.5);
  shopBody.castShadow = true;
  shopBody.receiveShadow = true;
  shopGroup.add(shopBody);

  // Shop Flat Roof Trim
  const shopRoof = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.4, 6.1), Mat.buildingRoof);
  shopRoof.position.set(0, 4.3, -9.5);
  shopRoof.castShadow = true;
  shopGroup.add(shopRoof);

  // Red Parapet Accent Strip
  const shopTrim = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.25, 0.1), Mat.redTrim);
  shopTrim.position.set(0, 4.0, -6.4);
  shopGroup.add(shopTrim);

  // Large Front Showcase Windows
  const win1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.1), Mat.glass);
  win1.position.set(-2.5, 1.8, -6.7);
  const win2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.1), Mat.glass);
  win2.position.set(2.5, 1.8, -6.7);
  shopGroup.add(win1, win2);

  // Entrance Double Sliding Doors
  const doorGeo = new THREE.BoxGeometry(1.6, 2.6, 0.12);
  const doorMesh = new THREE.Mesh(doorGeo, Mat.darkInk);
  doorMesh.position.set(0, 1.8, -6.68);
  shopGroup.add(doorMesh);

  // Minimarket Roof Signboard
  const signGeo = new THREE.BoxGeometry(5.2, 1.1, 0.2);
  const signMesh = new THREE.Mesh(signGeo, Mat.redTrim);
  signMesh.position.set(0, 4.9, -6.4);
  shopGroup.add(signMesh);

  // Warm Shop Interior Glow Light
  shopInteriorLight = new THREE.PointLight(0xFFE082, 0.9, 14);
  shopInteriorLight.position.set(0, 2.5, -8);
  nightLights.push({ light: shopInteriorLight, targetIntensity: 0.9 });
  shopGroup.add(shopInteriorLight);

  diorama.add(shopGroup);

  // 5. Initial Pump #1 ONLY
  const pump0Mesh = createPumpMesh(0);
  pump0Mesh.position.copy(pumpSlots[0].pos);
  pumpSlots[0].mesh = pump0Mesh;
  diorama.add(pump0Mesh);

  // 6. Spawn 3D Pre-marked Construction Plots for all Unbuilt Facilities
  Object.values(PLOTS).forEach(plot => {
    const plotSign = createPlotSignMesh(plot);
    plotSign.position.copy(plot.pos);
    plotSignMeshes[plot.id] = plotSign;
    diorama.add(plotSign);
  });

  // 7. Underground Storage Manhole Hatches (Neatly positioned behind the shop service area)
  const hatchGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 12);
  const hatchBenzin = new THREE.Mesh(hatchGeo, Mat.redTrim);
  hatchBenzin.position.set(-8.5, 0.08, -8);
  const hatchDizel = new THREE.Mesh(hatchGeo, Mat.greenAccent);
  hatchDizel.position.set(-7.0, 0.08, -8);
  const hatchLpg = new THREE.Mesh(hatchGeo, Mat.orangeAccent);
  hatchLpg.position.set(-5.5, 0.08, -8);
  diorama.add(hatchBenzin, hatchDizel, hatchLpg);

  // 8. Highway LED Price Totem Sign
  const totem = createTotemMesh();
  totem.position.set(-10, 0, 8.5);
  diorama.add(totem);

  // 9. Station Perimeters, Rocks, Hills & Pine Trees
  buildPerimeterFloraAndTerrain(diorama);

  // 10. Foreground Living Props & Animals
  const bench = createParkBench();
  bench.position.set(-6.5, 0.04, -7.5);
  bench.rotation.y = Math.PI / 4;
  diorama.add(bench);

  const bin = createTrashBin();
  bin.position.set(-4.8, 0.04, -7.2);
  diorama.add(bin);

  const airTower = createAirWaterStation();
  airTower.position.set(8.5, 0.04, -5);
  diorama.add(airTower);

  const fireCab = createFireCabinet();
  fireCab.position.set(8.5, 0.04, -8);
  diorama.add(fireCab);

  // Cozy Fauna
  dogMesh = createDogMesh();
  dogMesh.position.set(5.5, 0.04, -7.2);
  diorama.add(dogMesh);

  catMesh = createCatMesh();
  catMesh.position.set(0.2, 4.5, -9.5);
  diorama.add(catMesh);

  // Roaming Sheep in Grassy Meadow
  const sheepPos = [
    new THREE.Vector3(-22, 0.04, -18),
    new THREE.Vector3(-26, 0.04, -12),
    new THREE.Vector3(24, 0.04, -20),
    new THREE.Vector3(28, 0.04, -14)
  ];
  sheepPos.forEach(sp => {
    const s = new Sheep(sp);
    sheepList.push(s);
    diorama.add(s.mesh);
  });

  // Perched Bluebirds
  for (let i = 0; i < 4; i++) {
    const bird = createBirdMesh();
    bird.position.set(-7 + i * 4.5, 4.5, -6.4);
    birds.push(bird);
    diorama.add(bird);
  }

  // 11. Drifting Low-Poly Clouds
  for (let c = 0; c < 8; c++) {
    const cloud = createVoxelCloud();
    cloud.position.set(
      -36 + Math.random() * 72,
      18 + Math.random() * 8,
      -36 + Math.random() * 72
    );
    clouds.push(cloud);
    scene.add(cloud);
  }

  // Initialize Background Traffic
  initBypassTraffic();

  scene.add(diorama);
}

// ---------------------------------------------------------
// 3D Construction Plots, Signboards & Scaffolding
// ---------------------------------------------------------

function createSafetyConeMesh() {
  const coneGroup = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.28), Mat.darkInk);
  base.position.y = 0.015;
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.12, 0.38, 8), Mat.hazardCone);
  cone.position.y = 0.20;
  cone.castShadow = true;
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.10, 8), Mat.roadWhite);
  stripe.position.y = 0.18;
  coneGroup.add(base, cone, stripe);
  return coneGroup;
}

function drawPlotBadgeCanvas(canvas, plot) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 100);

  // Rounded pill background
  const r = 22;
  ctx.beginPath();
  ctx.moveTo(r + 6, 6);
  ctx.lineTo(256 - r - 6, 6);
  ctx.arcTo(256 - 6, 6, 256 - 6, 100 - 6, r);
  ctx.arcTo(256 - 6, 100 - 6, 6, 100 - 6, r);
  ctx.arcTo(6, 100 - 6, 6, 6, r);
  ctx.arcTo(6, 6, 256 - 6, 6, r);
  ctx.closePath();

  ctx.fillStyle = 'rgba(28, 36, 43, 0.95)';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#E5A93C';
  ctx.stroke();

  // Dynamic localized plot name
  const localizedName = t('plot_' + plot.id, plot.name);

  // Plus icon & plot name
  ctx.fillStyle = '#E5A93C';
  ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`+ ${localizedName}`, 128, 38);

  // Price & Duration
  ctx.fillStyle = '#FAF7EE';
  ctx.font = 'bold 20px JetBrains Mono, monospace';
  ctx.fillText(`₺${plot.cost.toLocaleString()}`, 96, 76);

  ctx.fillStyle = '#78CADC';
  ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
  ctx.fillText(`${plot.duration}s`, 198, 76);
}

function createPlotBadgeMesh(plot, floatY = 1.0) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 100;
  drawPlotBadgeCanvas(canvas, plot);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.62), mat);
  badge.position.set(0, floatY, 0);
  badge.rotation.x = -Math.PI / 6;
  badge.userData = { isPlotSign: true, isBadge: true, plotId: plot.id, plot: plot, baseY: floatY };
  return { badge, canvas, texture };
}

function createPumpPlotMesh(plot) {
  const group = new THREE.Group();
  group.userData = { isPlotSign: true, plotId: plot.id, plot: plot };

  // Concrete Fuel Island Base Curb
  const curb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.2), Mat.concrete);
  curb.position.y = 0.06;
  curb.receiveShadow = true;
  curb.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
  group.add(curb);

  // Steel Mounting Baseplate
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.6), Mat.darkInk);
  basePlate.position.y = 0.13;
  basePlate.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
  group.add(basePlate);

  // Steel Conduit Stub Pipes
  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8), Mat.chrome);
  p1.position.set(-0.22, 0.22, 0);
  const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8), Mat.chrome);
  p2.position.set(0.22, 0.22, 0);
  group.add(p1, p2);

  // 4 Traffic Safety Cones at corners
  const coneOffsets = [[-0.95, -0.42], [0.95, -0.42], [-0.95, 0.42], [0.95, 0.42]];
  coneOffsets.forEach(([cx, cz]) => {
    const cGroup = createSafetyConeMesh();
    cGroup.position.set(cx, 0.12, cz);
    cGroup.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
    group.add(cGroup);
  });

  // Floating Pill Badge
  const { badge, canvas, texture } = createPlotBadgeMesh(plot, 0.95);
  group.userData.signCanvas = canvas;
  group.userData.signTexture = texture;
  group.userData.badgeMesh = badge;
  group.add(badge);

  return group;
}

function createWashPlotMesh(plot) {
  const group = new THREE.Group();
  group.userData = { isPlotSign: true, plotId: plot.id, plot: plot };

  // Concrete Wash Bay Slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.06, 8.4), Mat.concrete);
  slab.position.y = 0.03;
  slab.receiveShadow = true;
  slab.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
  group.add(slab);

  // Central Drainage Steel Grating Trench
  const trench = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 7.2), Mat.darkInk);
  trench.position.y = 0.065;
  group.add(trench);
  for (let z = -3.2; z <= 3.2; z += 0.8) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.02, 0.12), Mat.rockDark);
    bar.position.set(0, 0.075, z);
    group.add(bar);
  }

  // 4 Corner Safety Bollards / Stanchions
  const corners = [[-2.4, -3.8], [2.4, -3.8], [-2.4, 3.8], [2.4, 3.8]];
  corners.forEach(([cx, cz]) => {
    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.65, 8), Mat.hazardStripe);
    bollard.position.set(cx, 0.35, cz);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), Mat.darkInk);
    top.position.set(cx, 0.7, cz);
    group.add(bollard, top);
  });

  // Pallet with Coiled Hoses & Piping
  const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.2), Mat.palletWood);
  pallet.position.set(1.8, 0.09, 2.8);
  const hose = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 6, 12), Mat.blueAccent);
  hose.rotation.x = Math.PI / 2;
  hose.position.set(1.8, 0.22, 2.8);
  group.add(pallet, hose);

  // Floating Pill Badge
  const { badge, canvas, texture } = createPlotBadgeMesh(plot, 1.35);
  group.userData.signCanvas = canvas;
  group.userData.signTexture = texture;
  group.userData.badgeMesh = badge;
  group.add(badge);

  return group;
}

function createMarketPlotMesh(plot) {
  const group = new THREE.Group();
  group.userData = { isPlotSign: true, plotId: plot.id, plot: plot };

  // Concrete Foundation Floor Slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.08, 5.2), Mat.concrete);
  slab.position.y = 0.04;
  slab.receiveShadow = true;
  slab.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
  group.add(slab);

  // Perimeter Concrete Foundation Footing Beams
  const bFront = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.16, 0.24), Mat.dirt);
  bFront.position.set(0, 0.12, 2.48);
  const bBack = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.16, 0.24), Mat.dirt);
  bBack.position.set(0, 0.12, -2.48);
  const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 4.8), Mat.dirt);
  bLeft.position.set(-3.18, 0.12, 0);
  const bRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 4.8), Mat.dirt);
  bRight.position.set(3.18, 0.12, 0);
  group.add(bFront, bBack, bLeft, bRight);

  // 2 Wooden Pallets with Terracotta Bricks
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1.1), Mat.palletWood);
  p1.position.set(-1.8, 0.09, 0.8);
  const bricks1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), Mat.brickClay);
  bricks1.position.set(-1.8, 0.42, 0.8);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1.1), Mat.palletWood);
  p2.position.set(-0.4, 0.09, 0.8);
  const bricks2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.9), Mat.concrete);
  bricks2.position.set(-0.4, 0.35, 0.8);
  group.add(p1, bricks1, p2, bricks2);

  // Surveying Stakes
  const stakeGeo = new THREE.BoxGeometry(0.06, 0.55, 0.06);
  [[-3.18, -2.48], [3.18, -2.48], [-3.18, 2.48], [3.18, 2.48]].forEach(([sx, sz]) => {
    const stake = new THREE.Mesh(stakeGeo, Mat.wood);
    stake.position.set(sx, 0.3, sz);
    group.add(stake);
  });

  // Floating Pill Badge
  const { badge, canvas, texture } = createPlotBadgeMesh(plot, 1.4);
  group.userData.signCanvas = canvas;
  group.userData.signTexture = texture;
  group.userData.badgeMesh = badge;
  group.add(badge);

  return group;
}

function createSolarPlotMesh(plot) {
  const group = new THREE.Group();
  group.userData = { isPlotSign: true, plotId: plot.id, plot: plot };

  // Solar Mounting Aluminum Strut Rails on Canopy Roof
  for (let z = -1.6; z <= 1.6; z += 1.6) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.05, 0.08), Mat.solarFrame);
    rail.position.set(0, 0.03, z);
    group.add(rail);
  }
  for (let x = -3.2; x <= 3.2; x += 1.6) {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 3.4), Mat.solarFrame);
    bracket.position.set(x, 0.03, 0);
    group.add(bracket);
  }

  // Industrial Weatherproof Junction / Inverter Box
  const jBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.25), Mat.darkInk);
  jBox.position.set(3.5, 0.18, 1.5);
  const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), Mat.chrome);
  conduit.rotation.z = Math.PI / 2;
  conduit.position.set(2.9, 0.15, 1.5);
  group.add(jBox, conduit);

  // Floating Pill Badge on Canopy Roof
  const { badge, canvas, texture } = createPlotBadgeMesh(plot, 0.85);
  group.userData.signCanvas = canvas;
  group.userData.signTexture = texture;
  group.userData.badgeMesh = badge;
  group.add(badge);

  return group;
}

function createTurbinePlotMesh(plot) {
  const group = new THREE.Group();
  group.userData = { isPlotSign: true, plotId: plot.id, plot: plot };

  // Heavy Reinforced Circular Concrete Foundation Pedestal
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.16, 16), Mat.concrete);
  pedestal.position.y = 0.08;
  pedestal.receiveShadow = true;
  pedestal.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
  group.add(pedestal);

  // Center Steel Flange Base Plate
  const centerFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.04, 16), Mat.darkInk);
  centerFlange.position.y = 0.17;
  group.add(centerFlange);

  // 8 Heavy Steel Foundation Anchor Bolts / Studs
  const boltGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.22, 6);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const bx = Math.cos(angle) * 0.7;
    const bz = Math.sin(angle) * 0.7;
    const bolt = new THREE.Mesh(boltGeo, Mat.chrome);
    bolt.position.set(bx, 0.26, bz);
    group.add(bolt);
  }

  // Cable Trench
  const trench = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 2.4), Mat.darkInk);
  trench.position.set(0, 0.08, 1.8);
  group.add(trench);

  // 3 Safety Cones around foundation
  const conePositions = [[-1.8, -1.2], [1.8, -1.2], [0, 2.2]];
  conePositions.forEach(([cx, cz]) => {
    const c = createSafetyConeMesh();
    c.position.set(cx, 0.02, cz);
    group.add(c);
  });

  // Floating Pill Badge
  const { badge, canvas, texture } = createPlotBadgeMesh(plot, 1.4);
  group.userData.signCanvas = canvas;
  group.userData.signTexture = texture;
  group.userData.badgeMesh = badge;
  group.add(badge);

  return group;
}

function createEvPlotMesh(plot) {
  const group = new THREE.Group();
  group.userData = { isPlotSign: true, plotId: plot.id, plot: plot };

  // Green Painted Asphalt EV Bay Marking Pad
  const bay = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 2.4), Mat.greenAccent);
  bay.position.y = 0.015;
  bay.receiveShadow = true;
  bay.userData = { isPlotSign: true, plotId: plot.id, plot: plot };
  group.add(bay);

  // 2 Concrete Wheel Stops / Parking Curbs
  const curb1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.18), Mat.concrete);
  curb1.position.set(-0.8, 0.07, -0.9);
  const curb2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.18), Mat.concrete);
  curb2.position.set(0.8, 0.07, -0.9);
  group.add(curb1, curb2);

  // Electrical Station Mounting Baseplate
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.5), Mat.darkInk);
  base.position.set(0, 0.04, -1.1);
  const cautionPlate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.2), Mat.hazardStripe);
  cautionPlate.position.set(0, 0.065, -1.1);
  group.add(base, cautionPlate);

  // 2 Safety Cones
  const c1 = createSafetyConeMesh();
  c1.position.set(-1.4, 0.02, 0.8);
  const c2 = createSafetyConeMesh();
  c2.position.set(1.4, 0.02, 0.8);
  group.add(c1, c2);

  // Floating Pill Badge
  const { badge, canvas, texture } = createPlotBadgeMesh(plot, 1.05);
  group.userData.signCanvas = canvas;
  group.userData.signTexture = texture;
  group.userData.badgeMesh = badge;
  group.add(badge);

  return group;
}

function createPlotSignMesh(plot) {
  switch (plot.type) {
    case 'pump':
      return createPumpPlotMesh(plot);
    case 'wash':
      return createWashPlotMesh(plot);
    case 'market':
      return createMarketPlotMesh(plot);
    case 'solar':
      return createSolarPlotMesh(plot);
    case 'turbine':
      return createTurbinePlotMesh(plot);
    case 'ev':
      return createEvPlotMesh(plot);
    default:
      return createPumpPlotMesh(plot);
  }
}

function updateAllPlotSigns() {
  Object.values(PLOTS).forEach(plot => {
    const mesh = plotSignMeshes[plot.id];
    if (mesh && mesh.userData && mesh.userData.signCanvas) {
      drawPlotBadgeCanvas(mesh.userData.signCanvas, plot);
      if (mesh.userData.signTexture) {
        mesh.userData.signTexture.needsUpdate = true;
      }
    }
  });
}

function updatePlotBadges(totalSeconds) {
  Object.values(plotSignMeshes).forEach(mesh => {
    if (mesh && mesh.userData && mesh.userData.badgeMesh) {
      const badge = mesh.userData.badgeMesh;
      const baseY = badge.userData.baseY || 1.0;
      badge.position.y = baseY + Math.sin(totalSeconds * 2.5 + (badge.id || 0)) * 0.035;
    }
  });
}

function createScaffoldingMesh(plot) {
  const group = new THREE.Group();
  group.position.copy(plot.pos);

  // Scaffolding lattice posts
  const postGeo = new THREE.BoxGeometry(0.12, 3.2, 0.12);
  const corners = [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]];
  corners.forEach(([cx, cz]) => {
    const p = new THREE.Mesh(postGeo, Mat.scaffoldWood);
    p.position.set(cx, 1.6, cz);
    group.add(p);
  });

  // Crossbeams
  for (let y = 0.8; y <= 3.0; y += 1.1) {
    const beam1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.08), Mat.scaffoldWood);
    beam1.position.set(0, y, 1.2);
    const beam2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.08), Mat.scaffoldWood);
    beam2.position.set(0, y, -1.2);
    const beam3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.5), Mat.scaffoldWood);
    beam3.position.set(1.2, y, 0);
    const beam4 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.5), Mat.scaffoldWood);
    beam4.position.set(-1.2, y, 0);
    group.add(beam1, beam2, beam3, beam4);
  }

  // Floating Progress Bar Canvas Billboard
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const tex = new THREE.CanvasTexture(canvas);
  const barMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.8), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  barMesh.position.set(0, 3.8, 0);
  group.add(barMesh);

  group.userData = {
    canvas,
    texture: tex,
    plot
  };

  scene.add(group);
  return group;
}

// ---------------------------------------------------------
// Procedural Props, Plants & Rocks
// ---------------------------------------------------------

function createPumpMesh(id) {
  const pumpGroup = new THREE.Group();
  pumpGroup.userData = { isPump: true, pumpId: id };

  // Concrete Island Curb Slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.4), Mat.concrete);
  slab.position.y = 0.175;
  slab.castShadow = true;
  slab.receiveShadow = true;
  slab.userData = { isPump: true, pumpId: id };
  pumpGroup.add(slab);

  // Dual Yellow Protective Bollards
  const bollardGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
  const b1 = new THREE.Mesh(bollardGeo, Mat.roadYellow);
  b1.position.set(-1.0, 0.4, 0);
  const b2 = new THREE.Mesh(bollardGeo, Mat.roadYellow);
  b2.position.set(1.0, 0.4, 0);
  pumpGroup.add(b1, b2);

  // Pump Main Pillar Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.9, 0.7), Mat.buildingWall);
  body.position.y = 1.1;
  body.castShadow = true;
  body.userData = { isPump: true, pumpId: id };
  pumpGroup.add(body);

  // Red Header Trim
  const header = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.35, 0.74), Mat.redTrim);
  header.position.y = 1.9;
  header.userData = { isPump: true, pumpId: id };
  pumpGroup.add(header);

  // Digital LCD Dispenser Screen
  const lcd = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.05), Mat.darkInk);
  lcd.position.set(0, 1.35, 0.36);
  pumpGroup.add(lcd);

  // Fuel Hose and Nozzle Holster
  const hoseGeo = new THREE.TorusGeometry(0.28, 0.04, 6, 12);
  const hose = new THREE.Mesh(hoseGeo, Mat.darkInk);
  hose.position.set(0.62, 1.0, 0);
  hose.rotation.y = Math.PI / 2;
  pumpGroup.add(hose);

  return pumpGroup;
}

function createTotemMesh() {
  const totem = new THREE.Group();

  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7.0, 0.6), Mat.darkInk);
  pole.position.y = 3.5;
  pole.castShadow = true;
  totem.add(pole);

  const box = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 0.6), Mat.redTrim);
  box.position.y = 6.2;
  box.castShadow = true;
  totem.add(box);

  const canvas = updateTotemSign();
  totemSignTex = new THREE.CanvasTexture(canvas);
  const faceMat = new THREE.MeshBasicMaterial({ map: totemSignTex });

  const faceFront = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), faceMat);
  faceFront.position.set(0, 6.2, 0.31);
  const faceBack = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), faceMat);
  faceBack.position.set(0, 6.2, -0.31);
  faceBack.rotation.y = Math.PI;
  totem.add(faceFront, faceBack);

  totemGlowLight = new THREE.PointLight(0xFFE580, 0.8, 12);
  totemGlowLight.position.set(0, 6.2, 0.8);
  nightLights.push({ light: totemGlowLight, targetIntensity: 0.8 });
  totem.add(totemGlowLight);

  return totem;
}

function buildPerimeterFloraAndTerrain(diorama) {
  const hillPositions = [
    [-24, 0, -22, 12, 3.0, 12],
    [24, 0, -22, 14, 3.5, 12],
    [-28, 0, 4, 10, 2.5, 10],
    [28, 0, 4, 10, 2.5, 10],
    [-20, 0, 24, 12, 2.8, 8],
    [20, 0, 24, 12, 2.8, 8]
  ];
  hillPositions.forEach(([x, y, z, sx, sy, sz]) => {
    const hill = createGrassMound(sx, sy, sz);
    hill.position.set(x, y, z);
    diorama.add(hill);
  });

  const rockPositions = [
    [-18, 0.3, -12], [-14, 0.3, 18], [16, 0.3, 18],
    [20, 0.3, -14], [-28, 0.4, -6], [28, 0.4, -6]
  ];
  rockPositions.forEach(p => {
    const rocks = createRockCluster();
    rocks.position.set(...p);
    diorama.add(rocks);
  });

  const treeCoords = [
    [-32, -30], [-26, -32], [-20, -31], [-14, -33], [-8, -32], [0, -34],
    [8, -32], [14, -33], [20, -31], [26, -32], [32, -30],
    [-34, -20], [-33, -10], [-34, 0], [-33, 10], [-34, 20], [-32, 28],
    [34, -20], [33, -10], [34, 0], [33, 10], [34, 20], [32, 28],
    [-26, 29], [-16, 28], [16, 28], [26, 29]
  ];
  treeCoords.forEach(([x, z], idx) => {
    const tree = createLowPolyTree(idx);
    tree.position.set(x, 0.04, z);
    const scale = 0.85 + Math.random() * 0.45;
    tree.scale.set(scale, scale, scale);
    diorama.add(tree);
  });

  const planter1 = createFlowerPlanter();
  planter1.position.set(-6, 0.04, -5.8);
  const planter2 = createFlowerPlanter();
  planter2.position.set(6, 0.04, -5.8);
  diorama.add(planter1, planter2);
}

function createGrassMound(sx, sy, sz) {
  const mound = new THREE.Mesh(new THREE.ConeGeometry(sx * 0.5, sy, 7), Mat.grassHill);
  mound.position.y = sy * 0.5;
  mound.castShadow = true;
  mound.receiveShadow = true;
  return mound;
}

function createRockCluster() {
  const group = new THREE.Group();
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const rGeo = new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.5, 0);
    const rMesh = new THREE.Mesh(rGeo, Math.random() > 0.5 ? Mat.rockGrey : Mat.rockDark);
    rMesh.position.set(
      (Math.random() - 0.5) * 1.5,
      0.3,
      (Math.random() - 0.5) * 1.5
    );
    rMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    rMesh.castShadow = true;
    group.add(rMesh);
  }
  return group;
}

function createFlowerPlanter() {
  const group = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.7), Mat.planterWood);
  box.position.y = 0.225;
  box.castShadow = true;
  group.add(box);

  const colors = [Mat.flowerRed, Mat.flowerYellow, Mat.flowerPink];
  for (let i = -0.9; i <= 0.9; i += 0.45) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 5), Mat.flowerStem);
    stem.position.set(i, 0.55, 0);
    const blossom = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), colors[Math.floor(Math.random() * colors.length)]);
    blossom.position.set(i, 0.75, 0);
    group.add(stem, blossom);
  }
  return group;
}

function createParkBench() {
  const bench = new THREE.Group();
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.8), Mat.benchIron);
  leg1.position.set(-0.8, 0.3, 0);
  const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.8), Mat.benchIron);
  leg2.position.set(0.8, 0.3, 0);
  bench.add(leg1, leg2);

  for (let z = -0.3; z <= 0.3; z += 0.2) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.14), Mat.benchWood);
    slat.position.set(0, 0.6, z);
    slat.castShadow = true;
    bench.add(slat);
  }
  for (let y = 0.8; y <= 1.2; y += 0.2) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.14, 0.06), Mat.benchWood);
    back.position.set(0, y, -0.35);
    back.castShadow = true;
    bench.add(back);
  }
  return bench;
}

function createTrashBin() {
  const bin = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.9, 10), Mat.trashGreen);
  body.position.y = 0.45;
  body.castShadow = true;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.15, 10), Mat.darkInk);
  lid.position.y = 0.95;
  bin.add(body, lid);
  return bin;
}

function createAirWaterStation() {
  const station = new THREE.Group();
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.5), Mat.airTowerBlue);
  pillar.position.y = 0.9;
  pillar.castShadow = true;

  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 12), Mat.roadWhite);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0, 1.3, 0.28);

  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.02), Mat.redTrim);
  needle.position.set(0, 1.3, 0.34);

  const hose = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 12), Mat.darkInk);
  hose.position.set(0.32, 0.8, 0);
  hose.rotation.y = Math.PI / 2;

  station.add(pillar, dial, needle, hose);
  return station;
}

function createFireCabinet() {
  const cab = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.45), Mat.fireRed);
  box.position.y = 0.6;
  box.castShadow = true;

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), Mat.glass);
  glass.position.set(0, 0.6, 0.23);

  const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), Mat.redTrim);
  ext.position.set(0, 0.5, 0.08);

  cab.add(box, glass, ext);
  return cab;
}

function createDogMesh() {
  const dog = new THREE.Group();
  const rug = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 1.2), Mat.dogMat);
  rug.position.y = 0.02;
  dog.add(rug);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.6), Mat.dogFur);
  body.position.set(0, 0.25, 0);
  body.castShadow = true;
  dog.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.4), Mat.dogFur);
  head.position.set(0.5, 0.22, 0.1);
  head.castShadow = true;

  const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.25), Mat.dogMuzzle);
  muzzle.position.set(0.7, 0.15, 0.1);

  const ear1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.1), Mat.dogMuzzle);
  ear1.position.set(0.45, 0.35, -0.1);
  const ear2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.1), Mat.dogMuzzle);
  ear2.position.set(0.45, 0.35, 0.3);

  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.42), Mat.dogCollar);
  collar.position.set(0.35, 0.22, 0.1);

  dog.add(head, muzzle, ear1, ear2, collar);
  return dog;
}

function createCatMesh() {
  const cat = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.5), Mat.catFur);
  body.position.y = 0.2;
  body.castShadow = true;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.28), Mat.catFur);
  head.position.set(0, 0.38, 0.26);

  const ear1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 4), Mat.catSpot);
  ear1.position.set(-0.1, 0.56, 0.26);
  const ear2 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 4), Mat.catSpot);
  ear2.position.set(0.1, 0.56, 0.26);

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), Mat.catSpot);
  tail.position.set(0, 0.25, -0.35);
  tail.rotation.x = -0.6;
  cat.userData = { tail };

  cat.add(body, head, ear1, ear2, tail);
  return cat;
}

function createBirdMesh() {
  const bird = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.3), Mat.birdBlue);
  body.position.y = 0.12;
  body.castShadow = true;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), Mat.birdBlue);
  head.position.set(0, 0.22, 0.12);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 4), Mat.birdBeak);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.22, 0.24);

  bird.userData = { head };
  bird.add(body, head, beak);
  return bird;
}

class Sheep {
  constructor(pos) {
    this.pos = pos;
    this.mesh = this.buildMesh();
    this.mesh.position.copy(pos);
    this.targetPos = pos.clone();
    this.walkTimer = 0;
    this.grazeTimer = 2 + Math.random() * 4;
    this.isWalking = false;
  }

  buildMesh() {
    const sheep = new THREE.Group();
    const wool = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.4), new THREE.MeshLambertMaterial({ color: 0xF8F9FA }));
    wool.position.y = 0.65;
    wool.castShadow = true;
    sheep.add(wool);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.6), Mat.darkInk);
    head.position.set(0, 0.9, 0.85);
    head.castShadow = true;
    sheep.add(head);

    const legGeo = new THREE.BoxGeometry(0.18, 0.45, 0.18);
    [[-0.35, 0.22, -0.4], [0.35, 0.22, -0.4], [-0.35, 0.22, 0.4], [0.35, 0.22, 0.4]].forEach(lp => {
      const leg = new THREE.Mesh(legGeo, Mat.darkInk);
      leg.position.set(...lp);
      sheep.add(leg);
    });
    return sheep;
  }

  update(delta, time) {
    this.grazeTimer -= delta;
    if (this.grazeTimer <= 0) {
      this.grazeTimer = 5 + Math.random() * 7;
      this.isWalking = Math.random() > 0.4;
      if (this.isWalking) {
        this.targetPos.set(
          this.pos.x + (Math.random() - 0.5) * 8,
          0.04,
          this.pos.z + (Math.random() - 0.5) * 8
        );
      }
    }
    if (this.isWalking) {
      this.mesh.position.lerp(this.targetPos, 0.02);
      const angle = Math.atan2(this.targetPos.x - this.mesh.position.x, this.targetPos.z - this.mesh.position.z);
      this.mesh.rotation.y = angle;
    } else {
      this.mesh.rotation.x = Math.sin(time * 2.5) * 0.06;
    }
  }
}

function createVoxelCloud() {
  const cloud = new THREE.Group();
  const count = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const sx = 2.0 + Math.random() * 2.5;
    const sy = 1.2 + Math.random() * 1.0;
    const sz = 1.8 + Math.random() * 2.0;
    const box = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), Mat.cloud);
    box.position.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 1.2,
      (Math.random() - 0.5) * 3
    );
    cloud.add(box);
  }
  cloud.userData = { speed: 0.35 + Math.random() * 0.35 };
  return cloud;
}

function createLowPolyTree(id = 0) {
  const tree = new THREE.Group();
  tree.userData = { treeId: id };

  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.0, 0.7), Mat.wood);
  trunk.position.y = 1.0;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown = new THREE.Group();
  crown.position.y = 2.0;

  const l1 = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.0, 6), Mat.foliage);
  l1.position.y = 0.2;
  l1.castShadow = true;

  const l2 = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.8, 6), Mat.foliageDark);
  l2.position.y = 1.3;
  l2.castShadow = true;

  const l3 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.4, 6), Mat.foliage);
  l3.position.y = 2.3;
  l3.castShadow = true;

  crown.add(l1, l2, l3);
  tree.add(crown);
  tree.userData.crown = crown;
  animatedTrees.push(tree);

  return tree;
}

// ---------------------------------------------------------
// Dynamic 3D Upgrades (Finished Meshes)
// ---------------------------------------------------------

function spawnCarWashMesh() {
  if (carWashGroup) return;
  carWashGroup = new THREE.Group();
  carWashGroup.position.set(16, 0.04, -2);

  const arch = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.8, 8.0), Mat.blueAccent);
  arch.position.y = 1.9;
  arch.castShadow = true;
  carWashGroup.add(arch);

  const tunnelHole = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 8.2), Mat.darkInk);
  tunnelHole.position.y = 1.6;
  carWashGroup.add(tunnelHole);

  const brushGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.2, 8);
  const brushMat = new THREE.MeshLambertMaterial({ color: 0x00E5FF });
  const b1 = new THREE.Mesh(brushGeo, brushMat);
  b1.position.set(-1.2, 1.6, 0);
  const b2 = new THREE.Mesh(brushGeo, brushMat);
  b2.position.set(1.2, 1.6, 0);
  carWashGroup.add(b1, b2);

  scene.add(carWashGroup);
}

function spawnMarketBayMesh() {
  if (marketBayGroup) return;
  marketBayGroup = new THREE.Group();
  marketBayGroup.position.set(-14, 0.04, -8);

  const bay = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.6, 5.0), Mat.buildingWall);
  bay.position.y = 1.8;
  bay.castShadow = true;
  marketBayGroup.add(bay);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.35, 5.4), Mat.greenAccent);
  roof.position.y = 3.75;
  marketBayGroup.add(roof);

  const glassFront = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.2, 0.1), Mat.glass);
  glassFront.position.set(0, 1.6, 2.52);
  marketBayGroup.add(glassFront);

  scene.add(marketBayGroup);
}

function spawnSolarPanelsMesh() {
  if (solarPanelsGroup) return;
  solarPanelsGroup = new THREE.Group();
  solarPanelsGroup.position.set(0, 4.55, -9.5);

  for (let x = -3.6; x <= 3.6; x += 1.8) {
    for (let z = -1.6; z <= 1.6; z += 1.6) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1.2), Mat.solarCell);
      panel.position.set(x, 0.05, z);
      panel.rotation.x = -0.15;
      solarPanelsGroup.add(panel);
    }
  }
  scene.add(solarPanelsGroup);
}

function spawnTurbineMesh() {
  if (turbineGroup) return;
  turbineGroup = new THREE.Group();
  turbineGroup.position.set(-22, 0.04, -8);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 12, 8), Mat.solarFrame);
  mast.position.y = 6.0;
  mast.castShadow = true;
  turbineGroup.add(mast);

  const nacelle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 2.2), Mat.darkInk);
  nacelle.position.set(0, 12.2, 0);
  turbineGroup.add(nacelle);

  turbineRotor = new THREE.Group();
  turbineRotor.position.set(0, 12.2, 1.2);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.2, 0.08), Mat.roadWhite);
    blade.position.y = 2.1;
    const holder = new THREE.Group();
    holder.rotation.z = (i * 2 * Math.PI) / 3;
    holder.add(blade);
    turbineRotor.add(holder);
  }
  turbineGroup.add(turbineRotor);

  scene.add(turbineGroup);
}

function spawnEvChargerMesh() {
  if (evChargerGroup) return;
  evChargerGroup = new THREE.Group();
  evChargerGroup.position.set(-8, 0.04, 4);

  const pad = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 2.0), Mat.concrete);
  pad.position.y = 0.1;
  evChargerGroup.add(pad);

  [-0.8, 0.8].forEach(x => {
    const totem = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.4), Mat.darkInk);
    totem.position.set(x, 1.0, 0);
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.05), Mat.evGlow);
    led.position.set(x, 1.1, 0.22);
    evChargerGroup.add(totem, led);
  });

  scene.add(evChargerGroup);
}

// =========================================================
// 6. PROCEDURAL CAR VEHICLE GENERATOR & PHYSICS
// =========================================================

const CAR_COLORS = [0x5E8CB8, 0xD46A5E, 0x6FA57D, 0xEADEBA, 0xDC7E34, 0x4A5868, 0xC97589];
const FUEL_TYPES = ['benzin', 'dizel', 'lpg', 'ev'];

class Vehicle {
  constructor(modelType, fuelType, colorHex) {
    this.modelType = modelType;
    this.fuelType = fuelType;
    this.colorHex = colorHex;
    this.reqLiters = Math.floor(Math.random() * 35) + 20;
    this.targetPumpSlot = null;
    this.state = 'APPROACHING'; // APPROACHING, PARKING, WAITING, REFUELING, DEPARTING, DONE
    this.mesh = this.buildMesh();
    this.mesh.userData = { vehicle: this };
    this.speed = 0.14;
    this.progress = 0;
    this.bounceTime = 0;
  }

  buildMesh() {
    const car = new THREE.Group();

    const carMat = new THREE.MeshLambertMaterial({ color: this.colorHex });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 3.4), carMat);
    body.position.y = 0.55;
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 1.8), Mat.glass);
    cabin.position.set(0, 1.05, -0.2);
    cabin.castShadow = true;
    car.add(cabin);

    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 8);
    const wheelMat = Mat.darkInk;
    const wheelPos = [
      [-0.95, 0.32, -1.0], [0.95, 0.32, -1.0],
      [-0.95, 0.32, 1.0],  [0.95, 0.32, 1.0]
    ];
    wheelPos.forEach(wp => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(...wp);
      car.add(w);
    });

    const hlGeo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xFFF9C4 });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.6, 0.6, 1.71);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.6, 0.6, 1.71);
    car.add(hl1, hl2);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FAF7EE';
    ctx.fillRect(0, 0, 256, 80);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#242D35';
    ctx.strokeRect(3, 3, 250, 74);
    ctx.fillStyle = '#242D35';
    ctx.font = 'bold 26px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`[ ${this.fuelType.toUpperCase()} ${this.reqLiters}L ]`, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.75, 1);
    sprite.position.set(0, 2.2, 0);
    car.add(sprite);

    car.position.set(-28, 0, 11.5);
    car.rotation.y = Math.PI / 2;
    return car;
  }

  update() {
    if (this.state === 'APPROACHING') {
      this.mesh.position.x += this.speed * State.timeSpeed;
      if (this.targetPumpSlot && this.mesh.position.x >= this.targetPumpSlot.pos.x - 3.2) {
        this.state = 'PARKING';
        this.bounceTime = 0;
      } else if (this.mesh.position.x > 38) {
        this.destroy();
      }
    } else if (this.state === 'PARKING') {
      const targetZ = this.targetPumpSlot.pos.z + 1.8;
      const targetX = this.targetPumpSlot.pos.x;
      this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, targetX, 0.06 * State.timeSpeed);
      this.mesh.position.z = THREE.MathUtils.lerp(this.mesh.position.z, targetZ, 0.06 * State.timeSpeed);
      this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, 0, 0.07 * State.timeSpeed);

      this.bounceTime += 0.05 * State.timeSpeed;
      const spring = Math.sin(this.bounceTime * 8) * Math.exp(-this.bounceTime * 3) * 0.08;
      this.mesh.position.y = spring;

      if (Math.abs(this.mesh.position.x - targetX) < 0.12 && Math.abs(this.mesh.position.z - targetZ) < 0.12) {
        this.mesh.position.y = 0;
        this.state = 'WAITING';
        this.targetPumpSlot.occupiedBy = this;
        showToast(t('toast_car_docked', this.targetPumpSlot.id + 1));
        sfx.playHonk();

        // If Attendant or Manager is hired, automatically refuel!
        if (State.staff.attendant >= 1 || State.upgrades.hasManager) {
          const waitTime = Math.max(600, 1800 / (1 + (State.staff.attendant - 1) * 0.25));
          setTimeout(() => autoServiceCar(this), waitTime / State.timeSpeed);
        }
      }
    } else if (this.state === 'DEPARTING') {
      this.mesh.position.z = THREE.MathUtils.lerp(this.mesh.position.z, 11.5, 0.05 * State.timeSpeed);
      this.mesh.position.x += this.speed * 1.15 * State.timeSpeed;
      this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, Math.PI / 2, 0.07 * State.timeSpeed);

      if (this.mesh.position.x > 38) {
        this.destroy();
      }
    }
  }

  destroy() {
    if (this.targetPumpSlot && this.targetPumpSlot.occupiedBy === this) {
      this.targetPumpSlot.occupiedBy = null;
    }
    scene.remove(this.mesh);
    const idx = cars.indexOf(this);
    if (idx !== -1) cars.splice(idx, 1);
  }
}

function spawnCar() {
  const availableSlots = pumpSlots.filter(s => s.isBuilt && !s.occupiedBy);
  if (availableSlots.length === 0) return;

  const randomFuel = FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)];
  const randomColor = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];

  const car = new Vehicle('sedan', randomFuel, randomColor);
  car.targetPumpSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
  car.targetPumpSlot.occupiedBy = car;

  cars.push(car);
  scene.add(car.mesh);
}

let spawnTimer = 0;
function updateSpawner(delta) {
  spawnTimer += delta * State.timeSpeed;
  if (spawnTimer >= 5.0) {
    spawnTimer = 0;
    if (cars.length < State.upgrades.pumps + 1) {
      spawnCar();
    }
  }
}

// =========================================================
// 7. INTERACTIVE RAYCASTING, KEYBOARD & CAMERA CONTROLLERS
// =========================================================

let pointerDownPos = { x: 0, y: 0, time: 0 };
const keysPressed = {};

function initPointerAndKeyboard() {
  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
  });

  renderer.domElement.addEventListener('pointerup', (e) => {
    const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    const elapsed = performance.now() - pointerDownPos.time;
    // Only treat as an intentional interactive click if mouse didn't drag
    if (dist < 6 && elapsed < 500) {
      onCanvasClick(e);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    keysPressed[e.code] = true;
    if (e.code === 'KeyR' || e.code === 'Space') {
      resetCameraView();
    } else if (e.code === 'KeyQ') {
      rotateCameraBy(Math.PI / 4);
    } else if (e.code === 'KeyE') {
      rotateCameraBy(-Math.PI / 4);
    } else if (e.code === 'Equal' || e.code === 'NumpadAdd') {
      zoomCamera(1.25);
    } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
      zoomCamera(0.8);
    }
  });

  window.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
  });
}

function resetCameraView() {
  if (!controls || !camera) return;
  controls.target.set(0, 0, 0);
  camera.position.set(26, 24, 26);
  camera.zoom = 1.0;
  camera.updateProjectionMatrix();
  controls.update();
  showToast(t('toast_cam_reset'));
}

function rotateCameraBy(angle) {
  if (!controls || !camera) return;
  const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
  const radius = Math.hypot(offset.x, offset.z);
  const currentAngle = Math.atan2(offset.z, offset.x);
  const newAngle = currentAngle + angle;
  camera.position.x = controls.target.x + radius * Math.cos(newAngle);
  camera.position.z = controls.target.z + radius * Math.sin(newAngle);
  controls.update();
}

function zoomCamera(factor) {
  if (!camera || !controls) return;
  camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, 0.35, 4.0);
  camera.updateProjectionMatrix();
  controls.update();
}

function updateKeyboardCamera(delta) {
  if (!controls || !camera) return;
  const moveSpeed = 32 * delta;

  // View forward vector projected on horizontal X-Z plane
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  // Right vector on horizontal X-Z plane
  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  const moveDelta = new THREE.Vector3();
  if (keysPressed['KeyW'] || keysPressed['ArrowUp']) {
    moveDelta.addScaledVector(forward, moveSpeed);
  }
  if (keysPressed['KeyS'] || keysPressed['ArrowDown']) {
    moveDelta.addScaledVector(forward, -moveSpeed);
  }
  if (keysPressed['KeyD'] || keysPressed['ArrowRight']) {
    moveDelta.addScaledVector(right, moveSpeed);
  }
  if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) {
    moveDelta.addScaledVector(right, -moveSpeed);
  }

  if (moveDelta.lengthSq() > 0) {
    camera.position.add(moveDelta);
    controls.target.add(moveDelta);
  }

  // Smooth island bounding box limit with generous navigation freedom
  const maxPan = Math.max(45, State.land.size * 0.7);
  const clampedX = THREE.MathUtils.clamp(controls.target.x, -maxPan, maxPan);
  const clampedZ = THREE.MathUtils.clamp(controls.target.z, -maxPan, maxPan);
  const diffX = clampedX - controls.target.x;
  const diffZ = clampedZ - controls.target.z;

  if (Math.abs(diffX) > 0.0001 || Math.abs(diffZ) > 0.0001) {
    controls.target.x = clampedX;
    controls.target.z = clampedZ;
    camera.position.x += diffX;
    camera.position.z += diffZ;
  }
}

function onCanvasClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  for (let hit of intersects) {
    let curr = hit.object;
    while (curr) {
      // 1. Click on 3D Pre-marked Construction Plot Sign
      if (curr.userData && curr.userData.isPlotSign) {
        const plot = curr.userData.plot;
        handlePlotSignClick(plot);
        return;
      }
      // 2. Click on Fuel Pump
      if (curr.userData && curr.userData.isPump !== undefined) {
        openPumpServiceForSlot(curr.userData.pumpId);
        return;
      }
      // 3. Click on Car
      if (curr.userData && curr.userData.vehicle) {
        const v = curr.userData.vehicle;
        if (v.targetPumpSlot) {
          openPumpServiceForSlot(v.targetPumpSlot.id);
          return;
        }
      }
      curr = curr.parent;
    }
  }
}

function handlePlotSignClick(plot) {
  sfx.playHammer();
  toggleModal('build-modal', true);
  switchBuildTab(plot.tab);
  showToast(t('plot_click_prompt', plot.name, plot.cost.toLocaleString()));
}

let totemSignTex = null;
function updateTotemSign() {
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 256;
  const sctx = signCanvas.getContext('2d');
  sctx.fillStyle = '#D64545';
  sctx.fillRect(0, 0, 256, 256);
  sctx.lineWidth = 8;
  sctx.strokeStyle = '#1C242B';
  sctx.strokeRect(4, 4, 248, 248);
  sctx.fillStyle = '#FAF6EC';
  sctx.font = 'bold 36px Plus Jakarta Sans, sans-serif';
  sctx.textAlign = 'center';
  sctx.textBaseline = 'middle';
  sctx.fillText('PIXELOIL', 128, 60);

  sctx.fillStyle = '#1C242B';
  sctx.fillRect(16, 95, 224, 4);

  sctx.font = 'bold 22px JetBrains Mono, monospace';
  sctx.fillStyle = '#FAF6EC';
  const bP = State.tanks.benzin.price.toFixed(2);
  const dP = State.tanks.dizel.price.toFixed(2);
  const lP = State.tanks.lpg.price.toFixed(2);
  const bPfx = currentLang === 'en' ? 'G' : 'B';
  sctx.fillText(`${bPfx} ₺${bP}`, 128, 130);
  sctx.fillText(`D ₺${dP}`, 128, 170);
  sctx.fillText(`L ₺${lP}`, 128, 210);

  if (totemSignTex) {
    totemSignTex.image = signCanvas;
    totemSignTex.needsUpdate = true;
  }
  return signCanvas;
}

function openPumpServiceForSlot(pumpId) {
  const slot = pumpSlots[pumpId];
  if (!slot || !slot.isBuilt) return;
  State.activePump = slot;
  State.activeCar = slot.occupiedBy;

  const modal = document.getElementById('pump-modal');
  const title = document.getElementById('pump-modal-title');
  const btnStart = document.getElementById('btn-start-pump');
  const btnFinish = document.getElementById('btn-finish-pump');

  if (slot.occupiedBy && slot.occupiedBy.state === 'WAITING') {
    const c = slot.occupiedBy;
    title.textContent = `${t(c.fuelType)} · (Pompa #${pumpId + 1})`;
    btnStart.classList.remove('hidden');
    btnFinish.classList.add('hidden');
  } else {
    title.textContent = `Pompa #${pumpId + 1} ${t('no_waiting_car')}`;
    btnStart.classList.add('hidden');
    btnFinish.classList.add('hidden');
  }

  State.pumpedLiters = 0;
  State.pumpedCost = 0;
  State.isPumping = false;
  updatePumpModalLCD();
  modal.classList.remove('hidden');
}

function closePumpModal() {
  document.getElementById('pump-modal').classList.add('hidden');
  State.isPumping = false;
}

function setRefuelTarget(target) {
  State.targetCost = target;
  showToast(t('toast_target', target === 'FULL' ? t('fill_full') : target + ' ₺'));
}

function startActivePumping() {
  if (!State.activeCar || State.isPumping) return;
  State.isPumping = true;
  document.getElementById('btn-start-pump').classList.add('hidden');

  const car = State.activeCar;
  const fuel = State.tanks[car.fuelType];
  const unitPrice = fuel.price;

  const fillRate = 1.5 * (1 + State.staff.attendant * 0.25);

  const interval = setInterval(() => {
    if (!State.isPumping || !State.activeCar) {
      clearInterval(interval);
      return;
    }

    if (fuel.current <= 0) {
      showToast(t('toast_fuel_empty', t(car.fuelType)), 'error');
      State.isPumping = false;
      clearInterval(interval);
      document.getElementById('btn-finish-pump').classList.remove('hidden');
      return;
    }

    State.pumpedLiters += fillRate;
    fuel.current = Math.max(0, fuel.current - fillRate);
    State.pumpedCost = State.pumpedLiters * unitPrice;
    sfx.playPumpTick();
    updatePumpModalLCD();
    updateHUD();

    const reachedTarget = State.targetCost === 'FULL'
      ? State.pumpedLiters >= car.reqLiters
      : State.pumpedCost >= State.targetCost;

    if (reachedTarget) {
      State.isPumping = false;
      clearInterval(interval);
      document.getElementById('btn-finish-pump').classList.remove('hidden');
      sfx.playCoin();
    }
  }, 100);
}

function finishAndDismissCar() {
  if (!State.activeCar) {
    closePumpModal();
    return;
  }
  const car = State.activeCar;
  let revenue = State.pumpedCost;
  State.finance.fuelRev += State.pumpedCost;
  State.finance.fuelCost += State.pumpedLiters * State.tanks[car.fuelType].cost;

  if (State.upgrades.hasCarWash) {
    revenue += 45;
    State.finance.facRev += 45;
  }
  if (State.upgrades.hasMarket) {
    const marketGain = 35 * Math.max(1, State.staff.cashier);
    revenue += marketGain;
    State.finance.facRev += marketGain;
  }

  State.money += revenue;
  State.totalRev += revenue;
  State.totalCars += 1;

  showToast(t('toast_collected', revenue.toFixed(2)));
  sfx.playCoin();

  car.state = 'DEPARTING';
  State.activePump.occupiedBy = null;
  State.activeCar = null;
  closePumpModal();
  updateHUD();
  updateDailyLedger();
}

function applyWindshieldWash() {
  State.money += 25;
  State.finance.facRev += 25;
  showToast(t('toast_tip'));
  sfx.playCoin();
  updateHUD();
  updateDailyLedger();
}

function autoServiceCar(car) {
  if (car.state !== 'WAITING') return;
  const fuel = State.tanks[car.fuelType];
  const liters = Math.min(car.reqLiters, fuel.current);
  let cost = liters * fuel.price;

  fuel.current = Math.max(0, fuel.current - liters);
  State.finance.fuelRev += cost;
  State.finance.fuelCost += liters * fuel.cost;

  if (State.upgrades.hasCarWash) {
    cost += 45;
    State.finance.facRev += 45;
  }
  if (State.upgrades.hasMarket) {
    cost += 35 * Math.max(1, State.staff.cashier);
    State.finance.facRev += 35 * Math.max(1, State.staff.cashier);
  }

  State.money += cost;
  State.totalRev += cost;
  State.totalCars += 1;

  showToast(t('toast_mgr', car.targetPumpSlot.id + 1, cost.toFixed(0)));
  sfx.playCoin();
  car.state = 'DEPARTING';
  car.targetPumpSlot.occupiedBy = null;
  updateHUD();
  updateDailyLedger();
}

function updatePumpModalLCD() {
  document.getElementById('lcd-liters').textContent = `${State.pumpedLiters.toFixed(1)} L`;
  document.getElementById('lcd-cost').textContent = `₺ ${State.pumpedCost.toFixed(2)}`;
}

// =========================================================
// 8. ASYNC CONSTRUCTION TIMERS & UPGRADES
// =========================================================

function toggleModal(modalId, open) {
  const m = document.getElementById(modalId);
  if (open) m.classList.remove('hidden');
  else m.classList.add('hidden');
}

function switchBuildTab(tabKey) {
  const tabs = ['custom', 'fac', 'energy', 'land'];
  tabs.forEach(tKey => {
    const pane = document.getElementById(`build-tab-${tKey}`);
    const btn = document.getElementById(`tab-btn-build-${tKey}`);
    if (pane) {
      if (tKey === tabKey) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (btn) {
      if (tKey === tabKey) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

function switchOfficeTab(tabKey) {
  const tabs = ['finance', 'tenders', 'tariffs'];
  tabs.forEach(tKey => {
    const pane = document.getElementById(`office-tab-${tKey}`);
    const btn = document.getElementById(`tab-btn-off-${tKey}`);
    if (pane) {
      if (tKey === tabKey) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (btn) {
      if (tKey === tabKey) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  updateDailyLedger();
}

// FAB Button Event Listeners
document.getElementById('btn-open-build').addEventListener('click', () => toggleModal('build-modal', true));
document.getElementById('btn-open-order').addEventListener('click', () => toggleModal('order-modal', true));
document.getElementById('btn-open-office').addEventListener('click', () => toggleModal('office-modal', true));
document.getElementById('btn-speed-toggle').addEventListener('click', () => {
  State.timeSpeed = State.timeSpeed === 1 ? 2 : (State.timeSpeed === 2 ? 4 : 1);
  document.getElementById('speed-indicator').textContent = `${State.timeSpeed}x`;
  showToast(t('toast_speed', State.timeSpeed));
});

// Construction Timer Queue
function startConstructionTimer(id, name, durationSec, onComplete, plot = null, btnId = null) {
  if (State.activeTimers.some(t => t.id === id)) return;

  // If there's a 3D plot sign, hide the sign and spawn scaffolding
  let scaffoldMesh = null;
  if (plot) {
    if (plotSignMeshes[plot.id]) {
      plotSignMeshes[plot.id].visible = false;
    }
    scaffoldMesh = createScaffoldingMesh(plot);
  }

  const timerObj = {
    id,
    name,
    total: durationSec,
    remaining: durationSec,
    onComplete,
    plot,
    scaffoldMesh,
    btnId
  };

  State.activeTimers.push(timerObj);
  sfx.playHammer();
  showToast(t('toast_construction_started', name, durationSec));

  if (btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.disabled = true;
      btn.textContent = `${t('btn_in_progress')} (${durationSec}s)`;
    }
  }
}

function startTrainingTimer(staffType, name, durationSec, cost, btnId) {
  if (State.activeTimers.some(t => t.id === staffType)) return;
  if (State.money < cost) {
    showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
    return;
  }
  State.money -= cost;
  updateHUD();

  const timerObj = {
    id: staffType,
    name,
    total: durationSec,
    remaining: durationSec,
    staffType,
    btnId,
    onComplete: () => {
      State.staff[staffType] += 1;
      if (staffType === 'manager') State.upgrades.hasManager = true;
      showToast(t('toast_training_finished', t(`staff_${staffType}`), State.staff[staffType]));
      sfx.playFanfare();
      const lvlBadge = document.getElementById(`staff-lvl-${staffType}`);
      if (lvlBadge) lvlBadge.textContent = `${currentLang === 'tr' ? 'Seviye' : 'Level'} ${State.staff[staffType]}`;
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.disabled = false;
        btn.textContent = `${currentLang === 'tr' ? 'Eğit' : 'Train'} (₺${(cost * 1.5).toFixed(0)})`;
      }
    }
  };

  State.activeTimers.push(timerObj);
  sfx.playCoin();
  showToast(t('toast_training_started', name, durationSec));

  const btn = document.getElementById(btnId);
  if (btn) {
    btn.disabled = true;
    btn.textContent = `${t('btn_training')} (${durationSec}s)`;
  }
}

function updateActiveTimers(delta) {
  for (let i = State.activeTimers.length - 1; i >= 0; i--) {
    const timer = State.activeTimers[i];
    timer.remaining -= delta * State.timeSpeed;

    // Update 3D Scaffolding Billboard
    if (timer.scaffoldMesh && timer.scaffoldMesh.userData) {
      const { canvas, texture } = timer.scaffoldMesh.userData;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 256, 96);
      ctx.fillStyle = 'rgba(28, 36, 43, 0.9)';
      ctx.fillRect(0, 0, 256, 96);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F2C94C';
      ctx.strokeRect(2, 2, 252, 92);

      ctx.fillStyle = '#FAF6EC';
      ctx.font = 'bold 20px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(timer.name, 128, 32);

      // Progress bar
      const pct = Math.max(0, Math.min(1, (timer.total - timer.remaining) / timer.total));
      ctx.fillStyle = '#3E4957';
      ctx.fillRect(16, 48, 224, 16);
      ctx.fillStyle = '#27A05A';
      ctx.fillRect(16, 48, 224 * pct, 16);

      ctx.fillStyle = '#F2C94C';
      ctx.font = 'bold 16px JetBrains Mono, monospace';
      ctx.fillText(`${Math.ceil(Math.max(0, timer.remaining))}s`, 128, 84);

      texture.needsUpdate = true;
    }

    // Update UI Button Text if applicable
    if (timer.btnId) {
      const btn = document.getElementById(timer.btnId);
      if (btn && btn.disabled) {
        const prefix = timer.staffType ? t('btn_training') : t('btn_in_progress');
        btn.textContent = `${prefix} (${Math.ceil(Math.max(0, timer.remaining))}s)`;
      }
    }

    // Finished
    if (timer.remaining <= 0) {
      if (timer.scaffoldMesh) {
        scene.remove(timer.scaffoldMesh);
      }
      if (timer.plot && plotSignMeshes[timer.plot.id]) {
        scene.remove(plotSignMeshes[timer.plot.id]);
        delete plotSignMeshes[timer.plot.id];
      }
      timer.onComplete();
      State.activeTimers.splice(i, 1);
    }
  }
}

// Facility Purchase Handlers (with Timers)
function buyPumpUpgrade() {
  if (State.upgrades.pumps >= 4) {
    showToast(t('toast_max_pumps'));
    return;
  }
  const nextSlotId = State.upgrades.pumps;
  const nextPumpKey = `pump${nextSlotId + 1}`;
  const plot = PLOTS[nextPumpKey];
  const cost = plot ? plot.cost : 6000;

  if (State.money < cost) {
    showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
    return;
  }
  State.money -= cost;
  updateHUD();

  startConstructionTimer(
    nextPumpKey,
    plot ? plot.name : `Pompa #${nextSlotId + 1}`,
    plot ? plot.duration : 45,
    () => {
      State.upgrades.pumps += 1;
      pumpSlots[nextSlotId].isBuilt = true;
      const pumpMesh = createPumpMesh(nextSlotId);
      pumpMesh.position.copy(pumpSlots[nextSlotId].pos);
      pumpSlots[nextSlotId].mesh = pumpMesh;
      scene.add(pumpMesh);

      document.getElementById('upgrade-pump-count').textContent = State.upgrades.pumps;
      showToast(t('toast_construction_finished', `Pompa #${nextSlotId + 1}`));
      sfx.playFanfare();
      const btn = document.getElementById('btn-buy-pump');
      if (btn) {
        btn.disabled = false;
        if (State.upgrades.pumps >= 4) {
          btn.textContent = t('btn_bought');
          btn.disabled = true;
        } else {
          btn.textContent = `₺ ${(cost + 2000).toLocaleString()}`;
        }
      }
      updateHUD();
    },
    plot,
    'btn-buy-pump'
  );
}

function buyWashUpgrade() {
  if (State.upgrades.hasCarWash) return;
  const plot = PLOTS.wash;
  if (State.money < plot.cost) {
    showToast(t('toast_insufficient_funds', plot.cost.toLocaleString()), 'error');
    return;
  }
  State.money -= plot.cost;
  updateHUD();

  startConstructionTimer(
    'wash',
    plot.name,
    plot.duration,
    () => {
      State.upgrades.hasCarWash = true;
      spawnCarWashMesh();
      document.getElementById('btn-buy-wash').textContent = t('btn_bought');
      document.getElementById('btn-buy-wash').disabled = true;
      showToast(t('toast_wash_active'));
      sfx.playFanfare();
      updateHUD();
    },
    plot,
    'btn-buy-wash'
  );
}

function buyMarketUpgrade() {
  if (State.upgrades.hasMarket) return;
  const plot = PLOTS.market;
  if (State.money < plot.cost) {
    showToast(t('toast_insufficient_funds', plot.cost.toLocaleString()), 'error');
    return;
  }
  State.money -= plot.cost;
  updateHUD();

  startConstructionTimer(
    'market',
    plot.name,
    plot.duration,
    () => {
      State.upgrades.hasMarket = true;
      spawnMarketBayMesh();
      document.getElementById('btn-buy-market').textContent = t('btn_bought');
      document.getElementById('btn-buy-market').disabled = true;
      showToast(t('toast_market_active'));
      sfx.playFanfare();
      updateHUD();
    },
    plot,
    'btn-buy-market'
  );
}

function buySolarUpgrade() {
  if (State.upgrades.hasSolar) return;
  const plot = PLOTS.solar;
  if (State.money < plot.cost) {
    showToast(t('toast_insufficient_funds', plot.cost.toLocaleString()), 'error');
    return;
  }
  State.money -= plot.cost;
  updateHUD();

  startConstructionTimer(
    'solar',
    plot.name,
    plot.duration,
    () => {
      State.upgrades.hasSolar = true;
      spawnSolarPanelsMesh();
      document.getElementById('btn-buy-solar').textContent = t('btn_bought');
      document.getElementById('btn-buy-solar').disabled = true;
      const status = document.getElementById('energy-solar-status');
      if (status) {
        status.textContent = t('btn_active');
        status.className = 'badge-chip green';
      }
      showToast(t('toast_solar_built'));
      sfx.playFanfare();
      updateHUD();
    },
    plot,
    'btn-buy-solar'
  );
}

function buyTurbineUpgrade() {
  if (State.upgrades.hasTurbine) return;
  const plot = PLOTS.turbine;
  if (State.money < plot.cost) {
    showToast(t('toast_insufficient_funds', plot.cost.toLocaleString()), 'error');
    return;
  }
  State.money -= plot.cost;
  updateHUD();

  startConstructionTimer(
    'turbine',
    plot.name,
    plot.duration,
    () => {
      State.upgrades.hasTurbine = true;
      spawnTurbineMesh();
      document.getElementById('btn-buy-turbine').textContent = t('btn_bought');
      document.getElementById('btn-buy-turbine').disabled = true;
      const status = document.getElementById('energy-turbine-status');
      if (status) {
        status.textContent = t('btn_active');
        status.className = 'badge-chip green';
      }
      showToast(t('toast_turbine_built'));
      sfx.playFanfare();
      updateHUD();
    },
    plot,
    'btn-buy-turbine'
  );
}

function buyEvChargerUpgrade() {
  if (State.upgrades.hasEvCharger) return;
  const plot = PLOTS.ev;
  if (State.money < plot.cost) {
    showToast(t('toast_insufficient_funds', plot.cost.toLocaleString()), 'error');
    return;
  }
  State.money -= plot.cost;
  updateHUD();

  startConstructionTimer(
    'ev',
    plot.name,
    plot.duration,
    () => {
      State.upgrades.hasEvCharger = true;
      spawnEvChargerMesh();
      document.getElementById('btn-buy-ev-charger').textContent = t('btn_bought');
      document.getElementById('btn-buy-ev-charger').disabled = true;
      showToast(t('toast_ev_built'));
      sfx.playFanfare();
      updateHUD();
    },
    plot,
    'btn-buy-ev-charger'
  );
}

// Staff Training
function trainStaff(staffType, cost) {
  const btnId = `btn-train-${staffType}`;
  startTrainingTimer(staffType, t(`staff_${staffType}`), 30, cost, btnId);
}

// Themes & Visual Addons
function applyTheme(themeKey) {
  State.theme = themeKey;
  if (themeKey === 'retro') {
    Mat.grass.color.setHex(0x8FA852);
    Mat.buildingWall.color.setHex(0xEBD8B8);
    Mat.redTrim.color.setHex(0xE8862E);
    Mat.buildingRoof.color.setHex(0x735738);
  } else if (themeKey === 'eco') {
    Mat.grass.color.setHex(0x5B8C3E);
    Mat.buildingWall.color.setHex(0xD5C7A3);
    Mat.redTrim.color.setHex(0x2D6A4F);
    Mat.buildingRoof.color.setHex(0x3C4A3E);
  } else if (themeKey === 'cyber') {
    Mat.grass.color.setHex(0x1E3A34);
    Mat.buildingWall.color.setHex(0x2A313A);
    Mat.redTrim.color.setHex(0x2F6FED);
    Mat.buildingRoof.color.setHex(0x14181E);
  } else {
    Mat.grass.color.setHex(0x6FA83B);
    Mat.buildingWall.color.setHex(0xF8F4EB);
    Mat.redTrim.color.setHex(0xD3524B);
    Mat.buildingRoof.color.setHex(0x48525D);
  }

  ['standard', 'retro', 'eco', 'cyber'].forEach(k => {
    const badge = document.getElementById(`badge-theme-${k}`);
    if (badge) {
      if (k === themeKey) {
        badge.textContent = t('btn_active');
        badge.className = 'badge-chip green';
      }
    }
  });
  showToast(t('toast_theme_applied', themeKey.toUpperCase()));
}

function unlockOrApplyTheme(themeKey, cost) {
  if (State.unlockedThemes.includes(themeKey)) {
    applyTheme(themeKey);
    return;
  }
  if (State.money < cost) {
    showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
    return;
  }
  State.money -= cost;
  State.unlockedThemes.push(themeKey);
  const btn = document.getElementById(`btn-theme-${themeKey}`);
  if (btn) {
    btn.textContent = currentLang === 'tr' ? 'Seç' : 'Select';
    btn.className = 'neo-btn';
  }
  applyTheme(themeKey);
  sfx.playCoin();
  updateHUD();
}

function buyVisualAddon(addonKey, cost) {
  if (State.addons[addonKey]) return;
  if (State.money < cost) {
    showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
    return;
  }
  State.money -= cost;
  State.addons[addonKey] = true;
  State.rep = Math.min(5.0, State.rep + 0.1);
  const btn = document.getElementById(`btn-buy-${addonKey}-addon`);
  if (btn) {
    btn.textContent = t('btn_bought');
    btn.disabled = true;
  }
  sfx.playCoin();
  updateHUD();
}

function buyLandParcel(letter, cost) {
  const pKey = `parcel${letter}`;
  if (State.land[pKey]) return;
  if (State.money < cost) {
    showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
    return;
  }
  State.money -= cost;
  State.land[pKey] = true;

  if (letter === 'A') State.land.size = 100;
  else if (letter === 'B') State.land.size = 115;
  else if (letter === 'C') State.land.size = 130;

  const s = State.land.size / 80;
  if (islandGrassMesh) islandGrassMesh.scale.set(s, 1, s);
  if (islandDirtMesh) islandDirtMesh.scale.set(s, 1, s);
  if (islandSlabMesh) islandSlabMesh.scale.set(s, 1, s);

  const badge = document.getElementById(`badge-parcel-${letter.toLowerCase()}`);
  if (badge) {
    badge.textContent = t('btn_bought');
    badge.className = 'badge-chip green';
  }
  const btn = document.getElementById(`btn-buy-parcel-${letter.toLowerCase()}`);
  if (btn) btn.disabled = true;

  showToast(t('toast_land_expanded', letter));
  sfx.playCoin();
  updateHUD();
}

function takeBankLoan() {
  State.money += 25000;
  State.finance.loan += 25000;
  showToast(t('toast_loan_taken'));
  sfx.playCoin();
  updateHUD();
  updateDailyLedger();
}

function signContract(tenderKey, collateral) {
  if (State.contracts[tenderKey]) return;
  if (State.money < collateral) {
    showToast(t('toast_insufficient_funds', collateral.toLocaleString()), 'error');
    return;
  }
  State.money -= collateral;
  State.contracts[tenderKey] = true;
  const badge = document.getElementById(`badge-tender-${tenderKey}`);
  if (badge) {
    badge.textContent = t('btn_active');
    badge.className = 'badge-chip green';
  }
  const btn = document.getElementById(`btn-sign-${tenderKey}`);
  if (btn) btn.disabled = true;

  showToast(t('toast_tender_signed', tenderKey.toUpperCase()));
  sfx.playCoin();
  updateHUD();
  updateDailyLedger();
}

function updateDailyLedger() {
  const fRev = document.getElementById('ledger-fuel-rev');
  const fCost = document.getElementById('ledger-fuel-cost');
  const facRev = document.getElementById('ledger-fac-rev');
  const sal = document.getElementById('ledger-salaries');
  const enrg = document.getElementById('ledger-energy');
  const net = document.getElementById('ledger-net-profit');

  State.finance.salaries = (State.staff.attendant * 120) + (State.staff.cashier * 140) + (State.staff.manager * 250);
  if (State.upgrades.hasTurbine) State.finance.energyNet = 180 * 24;

  const netVal = (State.finance.fuelRev + State.finance.facRev + State.finance.energyNet) - (State.finance.fuelCost + State.finance.salaries);
  State.finance.netProfit = netVal;

  if (fRev) fRev.textContent = `+ ₺ ${State.finance.fuelRev.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  if (fCost) fCost.textContent = `- ₺ ${State.finance.fuelCost.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  if (facRev) facRev.textContent = `+ ₺ ${State.finance.facRev.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  if (sal) sal.textContent = `- ₺ ${State.finance.salaries.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  if (enrg) enrg.textContent = `+ ₺ ${State.finance.energyNet.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  if (net) net.textContent = `₺ ${netVal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
}

function adjustOrderQty(fuelKey, delta) {
  const qty = State.orderQtys[fuelKey] + delta;
  if (qty < 500 || qty > 4000) return;
  State.orderQtys[fuelKey] = qty;
  document.getElementById(`order-qty-${fuelKey}`).textContent = `${qty} L`;
  const cost = qty * State.tanks[fuelKey].cost;
  document.getElementById(`btn-order-${fuelKey}`).textContent = `₺ ${cost.toLocaleString()}`;
}

function orderFuelTanker(fuelKey) {
  const qty = State.orderQtys[fuelKey];
  const fuel = State.tanks[fuelKey];
  const totalCost = qty * fuel.cost;

  if (State.money < totalCost) {
    showToast(t('toast_insufficient_funds', totalCost.toLocaleString()), 'error');
    return;
  }
  if (fuel.current + qty > fuel.max) {
    showToast(t('toast_tank_overflow', fuel.max - fuel.current));
    return;
  }

  State.money -= totalCost;
  fuel.current += qty;
  showToast(t('toast_tanker_arrived', qty, t(fuelKey)));
  sfx.playCoin();
  updateHUD();
  updateOrderModalStatus();
}

function updateOrderModalStatus() {
  ['benzin', 'dizel', 'lpg'].forEach(k => {
    const f = State.tanks[k];
    const el = document.getElementById(`order-tank-${k}`);
    if (el) el.textContent = `${t('tank_status')}: ${f.current.toFixed(0)}/${f.max} L`;
  });
}

function adjustPrice(fuelKey, delta) {
  const f = State.tanks[fuelKey];
  f.price = Math.max(f.cost + 1, Math.min(80, f.price + delta));
  document.getElementById(`tariff-${fuelKey}`).textContent = `₺ ${f.price.toFixed(2)}`;
  showToast(t('toast_tariff_updated', t(fuelKey), f.price.toFixed(2)));
  updateTotemSign();
}

// =========================================================
// 9. BACKGROUND HIGHWAY TRAFFIC & 16-BIT PARTICLES
// =========================================================

class BypassVehicle {
  constructor() {
    this.mesh = this.buildMesh();
    this.reset();
    scene.add(this.mesh);
  }

  buildMesh() {
    const group = new THREE.Group();
    const types = ['beetle', 'van', 'bus'];
    const chosen = types[Math.floor(Math.random() * types.length)];
    const colors = [0xD64545, 0x2F6FED, 0x27A05A, 0xE8862E, 0xF2C94C, 0x5C381E];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const bodyMat = new THREE.MeshLambertMaterial({ color });

    if (chosen === 'beetle') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.6), bodyMat);
      body.position.y = 0.5;
      body.castShadow = true;
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 1.4), Mat.glass);
      roof.position.set(0, 0.95, -0.2);
      group.add(body, roof);
    } else if (chosen === 'van') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 3.4), bodyMat);
      body.position.y = 0.8;
      body.castShadow = true;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 1.0), Mat.glass);
      cabin.position.set(0, 0.9, 0.9);
      group.add(body, cabin);
    } else {
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 5.0), bodyMat);
      body.position.y = 1.0;
      body.castShadow = true;
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.4, 4.4), Mat.glass);
      win.position.set(0, 1.3, 0);
      group.add(body, win);
    }

    const wMat = Mat.darkInk;
    const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8), wMat);
    w1.rotation.z = Math.PI / 2;
    w1.position.set(-0.9, 0.28, -0.9);
    const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8), wMat);
    w2.rotation.z = Math.PI / 2;
    w2.position.set(0.9, 0.28, -0.9);
    const w3 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8), wMat);
    w3.rotation.z = Math.PI / 2;
    w3.position.set(-0.9, 0.28, 0.9);
    const w4 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8), wMat);
    w4.rotation.z = Math.PI / 2;
    w4.position.set(0.9, 0.28, 0.9);
    group.add(w1, w2, w3, w4);

    return group;
  }

  reset() {
    this.speed = 10 + Math.random() * 8;
    this.mesh.position.set(-48 - Math.random() * 15, 0, 13.4);
    this.mesh.rotation.y = Math.PI / 2;
  }

  update(delta) {
    this.mesh.position.x += this.speed * delta;
    if (this.mesh.position.x > 48) {
      this.reset();
    }
  }
}

function initBypassTraffic() {
  for (let i = 0; i < 4; i++) {
    const bgCar = new BypassVehicle();
    bgCar.mesh.position.x = -40 + i * 22;
    bgVehicles.push(bgCar);
  }
}

function updateBypassTraffic(delta) {
  bgVehicles.forEach(v => v.update(delta));
}

function spawnParticle(pos, colorHex = 0xDCD6C8, scale = 0.25) {
  if (particles.length > 40) return;
  const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(scale, scale, scale), mat);
  mesh.position.copy(pos);
  mesh.position.x += (Math.random() - 0.5) * 0.2;
  mesh.position.z += (Math.random() - 0.5) * 0.2;

  scene.add(mesh);
  particles.push({
    mesh,
    mat,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.6 + Math.random() * 0.6,
    vz: (Math.random() - 0.5) * 0.3,
    life: 1.0,
    maxLife: 1.0 + Math.random() * 0.5
  });
}

function updateParticles(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= delta;
    p.mesh.position.x += p.vx * delta;
    p.mesh.position.y += p.vy * delta;
    p.mesh.position.z += p.vz * delta;
    p.mesh.rotation.x += delta;
    p.mesh.rotation.y += delta;
    const progress = p.life / p.maxLife;
    p.mat.opacity = Math.max(0, progress * 0.85);
    p.mesh.scale.setScalar(1 + (1 - progress) * 0.8);

    if (p.life <= 0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mat.dispose();
      particles.splice(i, 1);
    }
  }
}

function updateClouds(delta) {
  clouds.forEach(c => {
    c.position.x += c.userData.speed * delta;
    if (c.position.x > 46) {
      c.position.x = -46;
    }
  });
}

let lastBirdSoundTime = 0;
let lastCricketSoundTime = 0;

function updateWindAndCreatures(delta, time) {
  animatedTrees.forEach(t => {
    if (t.userData.crown) {
      t.userData.crown.rotation.z = Math.sin(time * 2.2 + t.userData.treeId) * 0.035;
      t.userData.crown.rotation.x = Math.cos(time * 1.8 + t.userData.treeId) * 0.025;
    }
  });

  if (dogMesh) {
    const breath = 1.0 + Math.sin(time * 2.8) * 0.04;
    dogMesh.scale.set(1.0, breath, 1.0);
  }

  if (catMesh && catMesh.userData.tail) {
    catMesh.userData.tail.rotation.z = Math.sin(time * 4.0) * 0.15;
  }

  birds.forEach((b, idx) => {
    if (b.userData.head && Math.sin(time * 0.8 + idx * 3.0) > 0.85) {
      b.userData.head.rotation.y = (Math.sin(time * 6.0) > 0 ? 0.3 : -0.3);
    }
  });

  sheepList.forEach(s => s.update(delta, time));

  if (turbineRotor) {
    turbineRotor.rotation.z += 2.5 * delta * State.timeSpeed;
  }

  const h = Math.floor(State.hour);
  if (h >= 6 && h <= 19) {
    if (time - lastBirdSoundTime > 12 + Math.random() * 8) {
      lastBirdSoundTime = time;
      sfx.playBirdChirp();
    }
  } else {
    if (time - lastCricketSoundTime > 6 + Math.random() * 4) {
      lastCricketSoundTime = time;
      sfx.playCricket();
    }
  }
}

// =========================================================
// 10. EXACT 7-MINUTE DAY/NIGHT SIMULATION CALIBRATION
// =========================================================

// 7 real minutes (420 seconds) = 1 in-game day (1440 game minutes)
// Rate = 1440 / 420 = 3.4285714 in-game minutes per real second
const INGAME_MINUTES_PER_REAL_SECOND = 1440.0 / 420.0;

function updateDayNightCycle(delta) {
  // Advance in-game minutes continuously
  const gameMinutesAdvance = delta * INGAME_MINUTES_PER_REAL_SECOND * State.timeSpeed;
  State.minute += gameMinutesAdvance;

  while (State.minute >= 60) {
    State.minute -= 60;
    State.hour += 1;

    // Hourly turbine income (+₺180)
    if (State.upgrades.hasTurbine) {
      State.money += 180;
      State.totalRev += 180;
    }

    if (State.hour >= 24) {
      State.hour = 0;
      State.day += 1;
      showToast(t('toast_new_day', State.day));

      // Daily Contract Payouts
      if (State.contracts.bus) { State.money += 5500; State.totalRev += 5500; }
      if (State.contracts.courier) { State.money += 3800; State.totalRev += 3800; }
      if (State.contracts.taxi) { State.money += 2900; State.totalRev += 2900; }

      // Daily Loan Interest (%2)
      if (State.finance.loan > 0) {
        const interest = State.finance.loan * 0.02;
        State.money = Math.max(0, State.money - interest);
      }
    }
  }

  updateHUD();
  updateSkyLighting();
}

function updateSkyLighting() {
  const h = State.hour + (State.minute / 60.0);
  let skyColor, sunColor, sunEnergy;
  let nightAlpha = 0.0;

  if (h >= 21 || h < 5) {
    skyColor = new THREE.Color(0x131B26);
    sunColor = new THREE.Color(0x647696);
    sunEnergy = 0.28;
    ambientLight.intensity = 0.38;
    nightAlpha = 1.0;
  } else if (h >= 5 && h < 8) {
    skyColor = new THREE.Color(0xF0BE9D);
    sunColor = new THREE.Color(0xF7A884);
    sunEnergy = 0.75;
    ambientLight.intensity = 0.55;
    nightAlpha = 0.2;
  } else if (h >= 8 && h < 18) {
    skyColor = new THREE.Color(0xCCE0ED); // Soft pastel daylight sky
    sunColor = new THREE.Color(0xFFF6E8); // Warm gentle sunlight
    sunEnergy = 0.95;
    ambientLight.intensity = 0.65;
    nightAlpha = 0.0;
  } else {
    skyColor = new THREE.Color(0xDE8B68);
    sunColor = new THREE.Color(0xEE8E3B);
    sunEnergy = 0.70;
    ambientLight.intensity = 0.50;
    nightAlpha = (h - 18) / 3.0;
  }

  scene.background.lerp(skyColor, 0.08);
  sunLight.color.lerp(sunColor, 0.08);
  sunLight.intensity = THREE.MathUtils.lerp(sunLight.intensity, sunEnergy, 0.08);

  nightLights.forEach(nl => {
    const target = nightAlpha * nl.targetIntensity;
    nl.light.intensity = THREE.MathUtils.lerp(nl.light.intensity, target, 0.08);
  });
}

function updateHUD() {
  document.getElementById('stat-money').textContent = `₺ ${State.money.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  document.getElementById('stat-day').textContent = State.day;
  const mm = Math.floor(State.minute).toString().padStart(2, '0');
  const hh = Math.floor(State.hour).toString().padStart(2, '0');
  document.getElementById('stat-clock').textContent = `${hh}:${mm}`;
  document.getElementById('stat-rep').textContent = `${State.rep.toFixed(1)} / 5.0`;

  ['benzin', 'dizel', 'lpg', 'ev'].forEach(k => {
    const f = State.tanks[k];
    const pct = Math.round((f.current / f.max) * 100);
    const bar = document.getElementById(`bar-${k}`);
    const lbl = document.getElementById(`gauge-val-${k}`);
    if (bar) bar.style.width = `${pct}%`;
    if (lbl) lbl.textContent = `${pct}%`;
  });
}

function showToast(msg, type = 'normal') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// =========================================================
// 11. ANIMATION & RENDER LOOP
// =========================================================

let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;
  const totalSeconds = now * 0.001;

  // Camera Navigation & Smooth Pan Clamping
  updateKeyboardCamera(delta);
  controls.update();

  updateDayNightCycle(delta);
  updateActiveTimers(delta);
  updateSpawner(delta);
  updateClouds(delta);
  updateBypassTraffic(delta);
  updateParticles(delta);
  updateWindAndCreatures(delta, totalSeconds);
  updatePlotBadges(totalSeconds);

  for (let i = cars.length - 1; i >= 0; i--) {
    cars[i].update();
    if (cars[i].state === 'APPROACHING' || cars[i].state === 'DEPARTING') {
      if (Math.random() < 0.15) {
        spawnParticle(cars[i].mesh.position, 0xB0B8C0, 0.2);
      }
    }
  }

  renderer.render(scene, camera);
}

// =========================================================
// 12. SETTINGS, GRAPHICS & GREENLIGHT COMPLIANCE
// =========================================================

function openSettingsModal() {
  toggleModal('settings-modal', true);
  updateSettingsUI();
}

function switchSettingsTab(tabId) {
  ['audio', 'graphics', 'legal'].forEach(t => {
    const pane = document.getElementById(`settings-tab-${t}`);
    const btn = document.getElementById(`tab-btn-settings-${t}`);
    if (pane) pane.classList.toggle('hidden', t !== tabId);
    if (btn) btn.classList.toggle('active', t === tabId);
  });
}

function updateSettingsUI() {
  const btnSfx = document.getElementById('btn-toggle-sfx');
  if (btnSfx) {
    btnSfx.textContent = State.settings.sfx ? (currentLang === 'tr' ? 'AÇIK' : 'ON') : (currentLang === 'tr' ? 'KAPALI' : 'OFF');
    btnSfx.className = `neo-btn toggle-btn ${State.settings.sfx ? 'success' : 'danger'}`;
  }

  const btnAmb = document.getElementById('btn-toggle-ambience');
  if (btnAmb) {
    btnAmb.textContent = State.settings.ambience ? (currentLang === 'tr' ? 'AÇIK' : 'ON') : (currentLang === 'tr' ? 'KAPALI' : 'OFF');
    btnAmb.className = `neo-btn toggle-btn ${State.settings.ambience ? 'success' : 'danger'}`;
  }

  const sliderVol = document.getElementById('slider-volume');
  const labelVol = document.getElementById('label-volume');
  if (sliderVol) sliderVol.value = State.settings.volume;
  if (labelVol) labelVol.textContent = `${State.settings.volume}%`;

  const btnShadows = document.getElementById('btn-toggle-shadows');
  if (btnShadows) {
    btnShadows.textContent = State.settings.shadows ? (currentLang === 'tr' ? 'AÇIK' : 'ON') : (currentLang === 'tr' ? 'KAPALI' : 'OFF');
    btnShadows.className = `neo-btn toggle-btn ${State.settings.shadows ? 'success' : 'danger'}`;
  }

  const btnLang = document.getElementById('btn-settings-lang');
  if (btnLang) {
    btnLang.textContent = currentLang === 'tr' ? 'Türkçe (TR)' : 'English (EN)';
  }
}

function toggleSFXSetting() {
  State.settings.sfx = !State.settings.sfx;
  localStorage.setItem('pixeloil_sfx', State.settings.sfx);
  if (State.settings.sfx) sfx.playCoin();
  updateSettingsUI();
}

function toggleAmbienceSetting() {
  State.settings.ambience = !State.settings.ambience;
  localStorage.setItem('pixeloil_ambience', State.settings.ambience);
  updateSettingsUI();
}

function updateVolumeSetting(val) {
  State.settings.volume = parseInt(val, 10);
  localStorage.setItem('pixeloil_vol', State.settings.volume);
  const labelVol = document.getElementById('label-volume');
  if (labelVol) labelVol.textContent = `${val}%`;
}

function toggleShadowsSetting() {
  State.settings.shadows = !State.settings.shadows;
  localStorage.setItem('pixeloil_shadows', State.settings.shadows);
  if (renderer) {
    renderer.shadowMap.enabled = State.settings.shadows;
    scene.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = State.settings.shadows;
        obj.receiveShadow = State.settings.shadows;
      }
    });
  }
  updateSettingsUI();
}

function setGraphicsQuality(q) {
  State.settings.quality = q;
  localStorage.setItem('pixeloil_quality', q);
  if (renderer) {
    if (q === 'low') {
      renderer.setPixelRatio(1);
    } else if (q === 'med') {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }
  document.querySelectorAll('#settings-tab-graphics .segmented-control:nth-of-type(1) .segment-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', (q === 'low' && idx === 0) || (q === 'med' && idx === 1) || (q === 'high' && idx === 2));
  });
}

function setTargetFps(fps) {
  State.settings.targetFps = fps;
  localStorage.setItem('pixeloil_fps', fps);
  document.querySelectorAll('#settings-tab-graphics .segmented-control:nth-of-type(2) .segment-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', (fps === 30 && idx === 0) || (fps === 60 && idx === 1) || (fps === 0 && idx === 2));
  });
}

function restorePurchases() {
  sfx.playFanfare();
  showToast(t('toast_restore_success'));
}

function contactSupport() {
  window.open('mailto:destek@balaxstudio.com?subject=PixelOil%203D%20Destek%20Talebi', '_blank');
}

function resetGameData() {
  const confirmMsg = currentLang === 'tr' 
    ? 'Tüm istasyon ilerlemeniz, paranız ve binalarınız sıfırlanacaktır. Emin misiniz?'
    : 'All station progress, cash, and facilities will be permanently cleared. Are you sure?';
  if (confirm(confirmMsg)) {
    localStorage.clear();
    showToast(t('toast_data_reset'));
    setTimeout(() => window.location.reload(), 600);
  }
}

function openLegalModal(docType) {
  const titleEl = document.getElementById('legal-modal-title');
  const bodyEl = document.getElementById('legal-modal-body');
  if (!bodyEl) return;

  if (docType === 'privacy') {
    titleEl.textContent = currentLang === 'tr' ? 'Gizlilik Politikası (Privacy Policy)' : 'Privacy Policy';
    bodyEl.innerHTML = currentLang === 'tr' ? `
      <h4>1. Veri Sorumlusu ve Toplanan Bilgiler</h4>
      <p>PixelOil 3D, kullanıcı gizliliğine tam saygı duyar. Oyunumuz cihazınızdan kişisel tanımlayıcı bilgi (ad, soyad, konum, rehber vb.) toplamaz ve sunuculara göndermez.</p>
      <h4>2. Yerel Depolama (Local Storage)</h4>
      <p>Oyun içi istasyon kayıtları, tema tercihleri ve ses ayarları yalnızca cihazınızın yerel depolama alanında (Local Storage) saklanır.</p>
      <h4>3. Apple App Store & Google Play Uyumluluğu</h4>
      <p>Oyunumuz Apple App Store Review Guidelines §5.1.1 (Veri Toplama ve Gizlilik) ve Google Play Geliştirici Standartları ile %100 uyumludur. Verilerinizi silme hakkınız (GDPR) Ayarlar menüsünden her zaman erişilebilirdir.</p>
      <h4>4. İletişim</h4>
      <p>Gizlilik ile ilgili tüm soru ve talepleriniz için: <strong>destek@balaxstudio.com</strong></p>
    ` : `
      <h4>1. Data Controller & Information Collected</h4>
      <p>PixelOil 3D respects player privacy. We do not collect, transmit, or monetize personal identifiable information (PII).</p>
      <h4>2. Local Storage Usage</h4>
      <p>Station progression, audio preferences, and unlocked themes are stored purely within your local device memory (Local Storage).</p>
      <h4>3. App Store & Google Play Standards</h4>
      <p>Compliant with Apple App Store Review Guidelines §5.1.1 (Data Collection & Storage) and Google Play Developer Policies. Full right-to-be-forgotten data deletion is supported via in-game settings.</p>
      <h4>4. Contact</h4>
      <p>For any privacy inquiries: <strong>destek@balaxstudio.com</strong></p>
    `;
  } else {
    titleEl.textContent = currentLang === 'tr' ? 'Kullanım Koşulları (Terms of Service)' : 'Terms of Service';
    bodyEl.innerHTML = currentLang === 'tr' ? `
      <h4>1. Hizmet Şartları ve Lisans</h4>
      <p>PixelOil 3D benzin istasyonu simülasyon oyunu, kişisel eğlence amacıyla Balax Studio tarafından sunulmaktadır.</p>
      <h4>2. Oyun İçi Para ve Tesisler</h4>
      <p>Oyun içerisindeki '₺' (TL) para birimi, akaryakıt depoları, tesisler ve ihaleler tamamen sanal simülasyon mekanikleridir ve gerçek finansal değer taşımaz.</p>
      <h4>3. Mağaza Satın Alımları ve Haklar</h4>
      <p>Uygulama içi satın alımlar (IAP) Apple App Store ve Google Play faturalandırma sistemleri üzerinden güvence altına alınmıştır. İstediğiniz zaman 'Satın Alımları Geri Yükle' butonunu kullanabilirsiniz.</p>
      <h4>4. Fikri Mülkiyet</h4>
      <p>Tüm 3D modeller, brutalist vektör ikonlar, ses efektleri ve kaynak kodları Balax Studio'ya aittir.</p>
    ` : `
      <h4>1. License & Service Terms</h4>
      <p>PixelOil 3D is a station management simulation game provided for entertainment by Balax Studio.</p>
      <h4>2. Virtual Economy & Assets</h4>
      <p>All in-game currency, fuel storage, station plots, and tenders are purely fictional simulation tokens without real-world monetary value.</p>
      <h4>3. In-App Purchases & Restoration</h4>
      <p>In-app purchases are handled securely via Apple App Store and Google Play billing APIs. You can restore previous non-consumables at any time.</p>
      <h4>4. Intellectual Property</h4>
      <p>All 3D assets, procedural audio, brutalist iconography, and source code are copyrighted by Balax Studio.</p>
    `;
  }

  toggleModal('legal-modal', true);
}

// =========================================================
// 13. WEB TEST & DEVELOPER DEBUG SANDBOX
// =========================================================

function openDebugModal() {
  toggleModal('debug-modal', true);
}

function debugAddMoney(amount) {
  State.money += amount;
  State.totalRev += amount;
  sfx.playCoin();
  updateHUD();
  showToast(t('toast_debug_money', amount.toLocaleString('tr-TR')));
}

function debugSetMoney(amount) {
  State.money = amount;
  updateHUD();
  showToast(`Debug: Kasa ₺${amount} olarak ayarlandı.`);
}

function debugRefillTanks() {
  ['benzin', 'dizel', 'lpg', 'ev'].forEach(k => {
    State.tanks[k].current = State.tanks[k].max;
  });
  sfx.playFanfare();
  updateHUD();
  updateOrderModalStatus();
  showToast(t('toast_debug_tanks'));
}

function debugEmptyTanks() {
  ['benzin', 'dizel', 'lpg', 'ev'].forEach(k => {
    State.tanks[k].current = 0;
  });
  updateHUD();
  updateOrderModalStatus();
  showToast('Debug: Tüm depolar boşaltıldı (%0).');
}

function debugFinishTimers() {
  if (State.activeTimers.length === 0) {
    showToast('Debug: Aktif inşaat veya eğitim süresi yok.');
    return;
  }
  // Process all remaining active timers immediately
  while (State.activeTimers.length > 0) {
    const timer = State.activeTimers.shift();
    if (timer.scaffoldingMesh) {
      scene.remove(timer.scaffoldingMesh);
    }
    if (typeof timer.callback === 'function') {
      timer.callback();
    }
  }
  sfx.playFanfare();
  updateHUD();
  updateAllPlotSigns();
  showToast(t('toast_debug_timers'));
}

function debugUnlockAllFacilities() {
  State.upgrades.pumps = 4;
  for (let i = 0; i < 4; i++) {
    pumpSlots[i].isBuilt = true;
    if (!pumpSlots[i].mesh) buildSinglePump(pumpSlots[i]);
  }
  State.upgrades.hasCarWash = true;
  if (!carWashGroup) buildCarWash();
  State.upgrades.hasMarket = true;
  if (!marketBayGroup) buildMarketBay();
  State.upgrades.hasSolar = true;
  if (!solarPanelsGroup) buildSolarPanels();
  State.upgrades.hasTurbine = true;
  if (!turbineGroup) buildTurbine();
  State.upgrades.hasEvCharger = true;
  if (!evChargerGroup) buildEvCharger();

  sfx.playFanfare();
  updateAllPlotSigns();
  updateHUD();
  showToast('Debug: Tüm tesisler inşa edildi!');
}

function debugMaxStaff() {
  State.staff.attendant = 3;
  State.staff.cashier = 3;
  State.staff.manager = 1;
  State.upgrades.hasManager = true;
  
  const elAtt = document.getElementById('staff-lvl-attendant');
  const elCash = document.getElementById('staff-lvl-cashier');
  const elMgr = document.getElementById('staff-lvl-manager');
  if (elAtt) { elAtt.textContent = 'Seviye 3'; elAtt.className = 'badge-chip gold'; }
  if (elCash) { elCash.textContent = 'Seviye 3'; elCash.className = 'badge-chip gold'; }
  if (elMgr) { elMgr.textContent = 'Seviye 1'; elMgr.className = 'badge-chip gold'; }

  sfx.playFanfare();
  showToast('Debug: Tüm personel maksimum seviyeye yükseltildi!');
}

function debugUnlockAllLand() {
  State.land.parcelA = true;
  State.land.parcelB = true;
  State.land.parcelC = true;
  applyLandExpansion();
  sfx.playFanfare();
  showToast(t('toast_debug_unlock'));
}

function debugAdvanceDay() {
  State.day += 1;
  State.hour = 8;
  State.minute = 0;
  sfx.playFanfare();
  updateHUD();
  updateSkyLighting();
  showToast(t('toast_new_day', State.day));
}

function debugAdvanceHour() {
  State.hour = (State.hour + 1) % 24;
  updateHUD();
  updateSkyLighting();
  showToast(`Debug: Saat ${Math.floor(State.hour)}:00 yapıldı.`);
}

function debugToggleDayNight() {
  if (State.hour >= 8 && State.hour < 20) {
    State.hour = 22; // Night
  } else {
    State.hour = 12; // Noon
  }
  updateHUD();
  updateSkyLighting();
  showToast(`Debug: Saat ${Math.floor(State.hour)}:00 yapıldı.`);
}

function debugMaxReputation() {
  State.rep = 5.0;
  updateHUD();
  showToast('Debug: İtibar 5.0 / 5.0 yapıldı.');
}

function debugSpawnCar() {
  const freeSlot = pumpSlots.find(s => s.isBuilt && !s.occupiedBy);
  if (!freeSlot) {
    showToast('Debug: Boş pompa yuvası yok!');
    return;
  }
  const car = new Vehicle(freeSlot);
  cars.push(car);
  sfx.playHonk();
  showToast('Debug: Yeni müşteri aracı çağrıldı.');
}

// Start Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  updateI18nDOM();
  updateHUD();
  updateOrderModalStatus();
  updateDailyLedger();
  showToast(t('toast_welcome'));
});
