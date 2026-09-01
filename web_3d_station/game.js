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
    settings_canopy_title: 'Kanopi / Çatı Görünürlüğü',
    settings_canopy_desc: 'Pompaların üstündeki çatıyı gizler veya gösterir.',
    toast_canopy_toggled: 'Kanopi görünürlüğü güncellendi.',
    btn_canopy_short: 'Çatı',
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
    settings_canopy_title: 'Canopy Roof Visibility',
    settings_canopy_desc: 'Show or hide the roof canopy above the pumps.',
    toast_canopy_toggled: 'Canopy visibility toggled.',
    btn_canopy_short: 'Canopy',
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

  // Upgrades & Facilities (with Tier Levels 1-3)
  upgrades: {
    pumps: 1, // Start with ONLY 1 PUMP
    pumpLevels: [1, 1, 1, 1], // Tier Level (1, 2, 3) per pump slot
    hasCarWash: false,
    washLevel: 1,
    hasMarket: false,
    marketLevel: 1,
    hasSolar: false,
    solarLevel: 1,
    hasTurbine: false,
    turbineLevel: 1,
    hasEvCharger: false,
    evLevel: 1,
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
    targetFps: parseInt(localStorage.getItem('pixeloil_fps') || '60', 10),
    showCanopy: localStorage.getItem('pixeloil_canopy_vis') !== 'false'
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

  playCanopyMove(isOpening) {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const startFreq = isOpening ? 180 : 380;
    const endFreq = isOpening ? 380 : 180;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.35);
    const vol = 0.08 * this.getVolumeScale();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.40);
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

// Living World & Environmental Storytelling Collections
const roadPuddles = [];
const manholeSteamEmitters = [];
const skyFlockBirds = [];
const perchedPigeons = [];
const nightMoths = [];
const cafePatrons = [];
let acFanMesh = null;
let acDripTimer = 0;
let windowTVLight = null;
let faultyLamp = null;
let faultyLampTimer = 0;
let skyJetMesh = null;
let skyJetTrail = [];
let rollingCanMesh = null;
let rollingCanVelocity = 0;

// Dynamic Building Mesh References
let canopyGroup = null;
let canopyRoofMesh = null;
let canopyAnimProgress = localStorage.getItem('pixeloil_canopy_vis') !== 'false' ? 1.0 : 0.0;
let canopyTargetProgress = canopyAnimProgress;
let carWashGroup = null;
let marketBayGroup = null;
let solarPanelsGroup = null;
let turbineGroup = null;
let turbineRotor = null;
let secondaryTurbineRotor = null;
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

// Calibrated Low-Poly Materials Palette (Cozy Warm Pastel Tycoon & Neo-Brutalist Grid)
function createStationGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Dark Anthracite / Charcoal Asphalt Base
  ctx.fillStyle = '#20252D';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle asphalt micro-texture grain
  for (let i = 0; i < 3500; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1024;
    const alpha = 0.03 + Math.random() * 0.05;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(gx, gy, 2, 2);
  }

  // 2. High-Precision Neo-Brutalist Grid (16x16 modular square tiles)
  const tileSize = 1024 / 16; // 64px per grid tile
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#2D3542';
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Intersection Crosshair Dots
  ctx.fillStyle = '#475366';
  for (let x = 0; x <= 1024; x += tileSize) {
    for (let y = 0; y <= 1024; y += tileSize) {
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  // 3. Safety Hazard Curb Edge (Bottom Edge / Z+ facing highway)
  const stripeWidth = 24;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 978, 1024, 46);
  ctx.clip();
  ctx.fillStyle = '#E5B242';
  ctx.fillRect(0, 978, 1024, 46);
  ctx.fillStyle = '#1A2028';
  for (let x = -100; x < 1100; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 1024);
    ctx.lineTo(x + stripeWidth, 1024);
    ctx.lineTo(x + stripeWidth + 46, 978);
    ctx.lineTo(x + 46, 978);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 4. Pump Bay Demarcation Zones (Pumps 1, 2, 3, 4)
  const drawBay = (cx, cy, label) => {
    const bw = 170;
    const bh = 220;
    const bx = cx - bw / 2;
    const by = cy - bh / 2;

    // Dark bay background contrast plate
    ctx.fillStyle = '#1B1F26';
    ctx.fillRect(bx, by, bw, bh);

    // Inner subtle tile pattern inside bay
    ctx.strokeStyle = '#272E3A';
    ctx.lineWidth = 1;
    for (let gx = bx + 20; gx < bx + bw; gx += 20) {
      ctx.beginPath(); ctx.moveTo(gx, by); ctx.lineTo(gx, by + bh); ctx.stroke();
    }

    // Outer white/yellow guide box
    ctx.strokeStyle = '#DCD8CF';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);

    // Corner yellow brackets
    ctx.strokeStyle = '#E5B242';
    ctx.lineWidth = 4;
    const cLen = 22;
    // Top-Left
    ctx.beginPath(); ctx.moveTo(bx, by + cLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cLen, by); ctx.stroke();
    // Top-Right
    ctx.beginPath(); ctx.moveTo(bx + bw - cLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cLen); ctx.stroke();
    // Bottom-Left
    ctx.beginPath(); ctx.moveTo(bx, by + bh - cLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cLen, by + bh); ctx.stroke();
    // Bottom-Right
    ctx.beginPath(); ctx.moveTo(bx + bw - cLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cLen); ctx.stroke();

    // Stencil Bay Text
    ctx.fillStyle = '#E5B242';
    ctx.font = '900 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`P-${label}`, cx, by + 24);

    // Directional entry arrow (pointing into bay)
    ctx.fillStyle = '#DCD8CF';
    ctx.beginPath();
    ctx.moveTo(cx, by + bh - 36);
    ctx.lineTo(cx - 14, by + bh - 16);
    ctx.lineTo(cx - 6, by + bh - 16);
    ctx.lineTo(cx - 6, by + bh - 6);
    ctx.lineTo(cx + 6, by + bh - 6);
    ctx.lineTo(cx + 6, by + bh - 16);
    ctx.lineTo(cx + 14, by + bh - 16);
    ctx.closePath();
    ctx.fill();
  };

  drawBay(325, 398, '01');
  drawBay(698, 398, '02');
  drawBay(325, 739, '03');
  drawBay(698, 739, '04');

  // 5. White dashed lane lines for entrance & exit
  ctx.strokeStyle = '#DCD8CF';
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.moveTo(512, 100);
  ctx.lineTo(512, 978);
  ctx.stroke();
  ctx.setLineDash([]);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

let stationGridTextureInstance = null;
function getStationGridTexture() {
  if (!stationGridTextureInstance) {
    stationGridTextureInstance = createStationGridTexture();
  }
  return stationGridTextureInstance;
}

const Mat = {
  grass: new THREE.MeshLambertMaterial({ color: 0x6E955A }),
  dirt: new THREE.MeshLambertMaterial({ color: 0x8C6544 }),
  asphalt: new THREE.MeshLambertMaterial({ color: 0x2A323D }),
  concrete: new THREE.MeshLambertMaterial({ color: 0x8A94A0 }),
  apronGrid: new THREE.MeshLambertMaterial({ map: getStationGridTexture() }),
  roadYellow: new THREE.MeshLambertMaterial({ color: 0xE5B242 }),
  roadWhite: new THREE.MeshLambertMaterial({ color: 0xDCD8CF }),
  buildingWall: new THREE.MeshLambertMaterial({ color: 0xEDEEF2 }),
  buildingRoof: new THREE.MeshLambertMaterial({ color: 0x333C48 }),
  redTrim: new THREE.MeshLambertMaterial({ color: 0xD45D56 }),
  greenAccent: new THREE.MeshLambertMaterial({ color: 0x4E9B66 }),
  orangeAccent: new THREE.MeshLambertMaterial({ color: 0xDC7E34 }),
  blueAccent: new THREE.MeshLambertMaterial({ color: 0x4879D6 }),
  darkInk: new THREE.MeshLambertMaterial({ color: 0x1E242B }),
  glass: new THREE.MeshLambertMaterial({ color: 0x8CBAD6, transparent: true, opacity: 0.80 }),
  wood: new THREE.MeshLambertMaterial({ color: 0x7E5A3D }),
  foliage: new THREE.MeshLambertMaterial({ color: 0x5E8B4E }),
  foliageDark: new THREE.MeshLambertMaterial({ color: 0x446B38 }),
  metalTank: new THREE.MeshLambertMaterial({ color: 0xE8E3D7 }),
  chrome: new THREE.MeshLambertMaterial({ color: 0xB4BDC5 }),
  rockGrey: new THREE.MeshLambertMaterial({ color: 0x86929F }),
  rockDark: new THREE.MeshLambertMaterial({ color: 0x586472 }),
  grassHill: new THREE.MeshLambertMaterial({ color: 0x5F864C }),
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
  oilStain: new THREE.MeshLambertMaterial({ color: 0x181D24, transparent: true, opacity: 0.65 }),
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
  plotSignBg: new THREE.MeshLambertMaterial({ color: 0x242D35 }),
  // Living World, Weather & Urban Storytelling Materials
  puddle: new THREE.MeshLambertMaterial({ color: 0x303E4C, transparent: true, opacity: 0.88 }),
  steam: new THREE.MeshLambertMaterial({ color: 0xF0F4F8, transparent: true, opacity: 0.40 }),
  asphaltPatch: new THREE.MeshLambertMaterial({ color: 0x1A2027 }),
  palmTrunk: new THREE.MeshLambertMaterial({ color: 0x6E5037 }),
  palmLeaf: new THREE.MeshLambertMaterial({ color: 0x48963D }),
  pineFoliage: new THREE.MeshLambertMaterial({ color: 0x2C4D26 }),
  oakFoliage: new THREE.MeshLambertMaterial({ color: 0x588C3C }),
  oakFoliageLight: new THREE.MeshLambertMaterial({ color: 0x72A84E }),
  windowTV: new THREE.MeshBasicMaterial({ color: 0x64B5F6 }),
  windowWarm: new THREE.MeshBasicMaterial({ color: 0xFFD54F }),
  tinCan: new THREE.MeshLambertMaterial({ color: 0xCAD2D8 }),
  paperTrash: new THREE.MeshLambertMaterial({ color: 0xE6E2D8 }),
  posterRed: new THREE.MeshLambertMaterial({ color: 0xC8433A }),
  posterCyan: new THREE.MeshLambertMaterial({ color: 0x2E96A5 }),
  posterYellow: new THREE.MeshLambertMaterial({ color: 0xE8B838 }),
  acGrey: new THREE.MeshLambertMaterial({ color: 0xD0D6DC }),
  pigeonGrey: new THREE.MeshLambertMaterial({ color: 0x6C7680 }),
  pigeonNeck: new THREE.MeshLambertMaterial({ color: 0x4A806C }),
  npcSkin: new THREE.MeshLambertMaterial({ color: 0xEAB994 }),
  npcHairDark: new THREE.MeshLambertMaterial({ color: 0x2B241E }),
  npcHairBlonde: new THREE.MeshLambertMaterial({ color: 0xD4A759 }),
  npcClothes1: new THREE.MeshLambertMaterial({ color: 0x3E6388 }),
  npcClothes2: new THREE.MeshLambertMaterial({ color: 0xB5463D }),
  npcClothes3: new THREE.MeshLambertMaterial({ color: 0x56824B }),
  coffeeCup: new THREE.MeshLambertMaterial({ color: 0xFDFBF7 }),
  // Modern Translucent Glass & Steel Canopy
  canopyGlass: new THREE.MeshLambertMaterial({ color: 0x9FD8F6, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide })
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

  // 2b. West Cloud Viaduct (Sol Sınır - Bulutlara Uzanan Asma Viyadük Köprüsü)
  buildWestCloudViaduct(diorama);

  // 2c. East Hyper-Ring Speedway Portal (Sağ Sınır - Fütüristik Aerodinamik Hızlandırma Kemeri)
  buildEastHyperRingPortal(diorama);

  // 3. Station Concrete Forecourt Apron (Procedural High-Precision Industrial Grid)
  const apronGeo = new THREE.BoxGeometry(22, 0.08, 18);
  const apronMesh = new THREE.Mesh(apronGeo, Mat.apronGrid);
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

  // 5. Main Overhead Structural Steel Canopy (Sundurma) Architecture
  canopyGroup = createCanopyMesh();
  diorama.add(canopyGroup);

  // 6. Initial Pump #1 ONLY (Built at Slot 0)
  const pump0Mesh = createPumpMesh(0, State.upgrades.pumpLevels[0]);
  pump0Mesh.position.copy(pumpSlots[0].pos);
  pumpSlots[0].mesh = pump0Mesh;
  diorama.add(pump0Mesh);

  // 7. Spawn 3D Pre-marked Construction Plots for all Unbuilt Facilities
  Object.values(PLOTS).forEach(plot => {
    const plotSign = createPlotSignMesh(plot);
    plotSign.position.copy(plot.pos);
    plotSignMeshes[plot.id] = plotSign;
    diorama.add(plotSign);
  });

  // 8. Fuel Tanker Unloading Area & Storage Manholes (Behind Shop)
  const tankerArea = createTankerUnloadingArea();
  diorama.add(tankerArea);

  // 9. Highway LED Price Totem Sign
  const totem = createTotemMesh();
  totem.position.set(-10, 0, 8.5);
  diorama.add(totem);

  // 10. Station Perimeters, Rocks, Hills & Diverse Trees (Oak, Pine, Palm, Saplings)
  buildPerimeterFloraAndTerrain(diorama);

  // 11. Living World Systems, Puddles, Steam, Urban Storytelling & Fauna
  createRoadPuddles(diorama);
  createManholeSteamSystem(diorama);
  createSkyFlockBirds(diorama);
  createPerchedPigeons(diorama);
  createNightMoths(diorama);
  createAirConditionerUnit(diorama);
  createUrbanWearDetails(diorama);
  createHighAltitudeJet(diorama);
  updateCafePatrons(diorama);

  // 12. Foreground Living Props & Animals
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
// Procedural Props, Canopy, Tanker & Tiered Facility Architecture
// ---------------------------------------------------------

function createCanopyMesh() {
  const canopy = new THREE.Group();
  canopy.position.set(0, 0, 1.0); // Covers the 4 pump bays perfectly

  // 4 Heavy Industrial Steel Tubular Pillars with Reinforced Concrete Pedestals (Remain stationary)
  const pillarCoords = [
    [-6.8, -3.8],
    [6.8, -3.8],
    [-6.8, 5.2],
    [6.8, 5.2]
  ];

  pillarCoords.forEach(([px, pz]) => {
    // Concrete Footing Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), Mat.concrete);
    plinth.position.set(px, 0.2, pz);
    plinth.castShadow = true;
    canopy.add(plinth);

    // Main Column Steel Tube
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 4.4, 8), Mat.darkInk);
    col.position.set(px, 2.4, pz);
    col.castShadow = true;
    canopy.add(col);

    // Diagonal Gusset Bracing Brackets
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.8, 0.14), Mat.chrome);
    br.position.set(px > 0 ? px - 0.35 : px + 0.35, 4.1, pz);
    br.rotation.z = px > 0 ? Math.PI / 4 : -Math.PI / 4;
    canopy.add(br);
  });

  // Retractable Folding Overhead Roof Assembly (Folds and retracts towards the market building)
  canopyRoofMesh = new THREE.Group();

  // 1. Perimeter Frame Beams (Open Interior for Transparency)
  const beamFront = new THREE.Mesh(new THREE.BoxGeometry(17.1, 0.45, 0.5), Mat.buildingRoof);
  beamFront.position.set(0, 4.65, 6.85);
  const beamBack = new THREE.Mesh(new THREE.BoxGeometry(17.1, 0.45, 0.5), Mat.buildingRoof);
  beamBack.position.set(0, 4.65, -5.45);
  const beamLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 12.8), Mat.buildingRoof);
  beamLeft.position.set(-8.3, 4.65, 0.7);
  const beamRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 12.8), Mat.buildingRoof);
  beamRight.position.set(8.3, 4.65, 0.7);
  canopyRoofMesh.add(beamFront, beamBack, beamLeft, beamRight);

  // 2. Red Brand Perimeter Trim Ribbon
  const fasciaFront = new THREE.Mesh(new THREE.BoxGeometry(17.2, 0.28, 0.54), Mat.redTrim);
  fasciaFront.position.set(0, 4.65, 6.85);
  const fasciaBack = new THREE.Mesh(new THREE.BoxGeometry(17.2, 0.28, 0.54), Mat.redTrim);
  fasciaBack.position.set(0, 4.65, -5.45);
  const fasciaLeft = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.28, 12.9), Mat.redTrim);
  fasciaLeft.position.set(-8.3, 4.65, 0.7);
  const fasciaRight = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.28, 12.9), Mat.redTrim);
  fasciaRight.position.set(8.3, 4.65, 0.7);
  canopyRoofMesh.add(fasciaFront, fasciaBack, fasciaLeft, fasciaRight);

  // Front Fascia "PIXELOIL" Stencil Plaque
  const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.42, 0.1), Mat.roadWhite);
  frontPlate.position.set(0, 4.65, 7.14);
  canopyRoofMesh.add(frontPlate);

  const frontText = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.26, 0.12), Mat.redTrim);
  frontText.position.set(0, 4.65, 7.15);
  canopyRoofMesh.add(frontText);

  // 3. Translucent Polycarbonate Glass Roof Pane (Crystal Visibility of All Pumps & Cars Below)
  const glassRoof = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.04, 12.0), Mat.canopyGlass);
  glassRoof.position.set(0, 4.70, 0.7);
  canopyRoofMesh.add(glassRoof);

  // 4. Architectural Structural Steel Truss Grid (Sleek Skylight I-Beams)
  [-3.8, -0.8, 2.2, 5.2].forEach(z => {
    const trussX = new THREE.Mesh(new THREE.BoxGeometry(16.1, 0.12, 0.08), Mat.solarFrame);
    trussX.position.set(0, 4.62, z);
    canopyRoofMesh.add(trussX);
  });

  [-5.5, -2.75, 0, 2.75, 5.5].forEach(x => {
    const trussZ = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 12.0), Mat.solarFrame);
    trussZ.position.set(x, 4.62, 0.7);
    canopyRoofMesh.add(trussZ);
  });

  // 5. 4 High-Lumen Down-Facing LED Spotlights for Pump Islands
  const spotCoords = [
    [-4, 4.28, -3.0],
    [4, 4.28, -3.0],
    [-4, 4.28, 3.0],
    [4, 4.28, 3.0]
  ];

  spotCoords.forEach(([sx, sy, sz]) => {
    const fix = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 10), Mat.darkInk);
    fix.position.set(sx, 4.32, sz);
    const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 10), Mat.lampGlow);
    bulb.position.set(sx, 4.25, sz);
    canopyRoofMesh.add(fix, bulb);

    const light = new THREE.PointLight(0xFFE8A0, 0.95, 8.5);
    light.position.set(sx, sy, sz);
    nightLights.push({ light, targetIntensity: 0.95 });
    canopyRoofMesh.add(light);
  });

  // Apply initial anim progress
  if (canopyAnimProgress < 0.01) {
    canopyRoofMesh.scale.set(1.0, 1.0, 0.04);
    canopyRoofMesh.position.set(0, 0, -6.2);
    canopyRoofMesh.rotation.x = -0.35;
    canopyRoofMesh.visible = false;
    if (Mat.canopyGlass) Mat.canopyGlass.opacity = 0.0;
  }

  canopy.add(canopyRoofMesh);
  return canopy;
}

function createTankerUnloadingArea() {
  const group = new THREE.Group();
  group.position.set(-7.0, 0.04, -8.2);

  // Reinforced Concrete Slab for Tanker Discharge
  const slab = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 2.8), Mat.concrete);
  slab.position.y = 0.03;
  slab.receiveShadow = true;
  group.add(slab);

  // Safety Yellow/Black Perimeter Curb
  const curb = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.12, 3.0), Mat.hazardStripe);
  curb.position.y = 0.06;
  group.add(curb);

  // 3 Color-Coded Fuel Storage Manhole Hatches
  const hatchGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.06, 16);
  const hBenzin = new THREE.Mesh(hatchGeo, Mat.redTrim);
  hBenzin.position.set(-1.6, 0.12, 0);
  const hDizel = new THREE.Mesh(hatchGeo, Mat.greenAccent);
  hDizel.position.set(0, 0.12, 0);
  const hLpg = new THREE.Mesh(hatchGeo, Mat.orangeAccent);
  hLpg.position.set(1.6, 0.12, 0);

  // Manhole Locking Handles & Hinge Detail
  [hBenzin, hDizel, hLpg].forEach(h => {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.08), Mat.darkInk);
    handle.position.set(0, 0.04, 0);
    h.add(handle);
  });
  group.add(hBenzin, hDizel, hLpg);

  // Static Discharge Grounding Stake Post
  const gPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), Mat.roadYellow);
  gPost.position.set(2.2, 0.35, -1.0);
  const gClamp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.12), Mat.chrome);
  gClamp.position.set(2.2, 0.65, -1.0);
  group.add(gPost, gClamp);

  // Vapor Recovery Standpipe
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), Mat.chrome);
  pipe.position.set(-2.2, 0.7, -1.0);
  const pipeTop = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), Mat.darkInk);
  pipeTop.position.set(-2.2, 1.4, -1.0);
  group.add(pipe, pipeTop);

  return group;
}

function triggerUpgradeFX(group) {
  if (!group) return;

  // Elastic Scale Pop Animation
  const startScale = group.scale.clone();
  group.scale.set(startScale.x * 1.22, startScale.y * 1.22, startScale.z * 1.22);
  let step = 0;
  const popInterval = setInterval(() => {
    step += 0.1;
    group.scale.lerp(startScale, 0.22);
    if (step >= 1.0) {
      group.scale.copy(startScale);
      clearInterval(popInterval);
    }
  }, 16);

  // Burst of Gold/Yellow Construction Sparks
  const origin = group.position.clone().add(new THREE.Vector3(0, 1.5, 0));
  for (let i = 0; i < 18; i++) {
    spawnParticle(origin, Math.random() > 0.5 ? 0xF2BA36 : 0xE5B242, 0.3);
  }
}

function createPumpMesh(id, level = 1) {
  const pumpGroup = new THREE.Group();
  pumpGroup.userData = { isPump: true, pumpId: id, level: level };

  // Concrete Island Curb Base Slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.4), Mat.concrete);
  slab.position.y = 0.175;
  slab.castShadow = true;
  slab.receiveShadow = true;
  slab.userData = { isPump: true, pumpId: id, level: level };
  pumpGroup.add(slab);

  if (level === 1) {
    // --------------------------------------------------
    // Level 1: Classic Low-Poly Mechanical Pump
    // --------------------------------------------------
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.7, 0.65), Mat.buildingWall);
    body.position.y = 1.025;
    body.castShadow = true;
    body.userData = { isPump: true, pumpId: id, level: 1 };

    const header = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.3, 0.69), Mat.redTrim);
    header.position.y = 1.72;
    header.userData = { isPump: true, pumpId: id, level: 1 };

    const dial = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.05), Mat.darkInk);
    dial.position.set(0, 1.25, 0.34);

    const hose = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 6, 12), Mat.darkInk);
    hose.position.set(0.54, 0.9, 0);
    hose.rotation.y = Math.PI / 2;

    pumpGroup.add(body, header, dial, hose);
  } else if (level === 2) {
    // --------------------------------------------------
    // Level 2: Modern Dual Dispenser with LCD & Yellow Bollards
    // --------------------------------------------------
    const bollardGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
    const b1 = new THREE.Mesh(bollardGeo, Mat.roadYellow);
    b1.position.set(-1.0, 0.4, 0);
    const b2 = new THREE.Mesh(bollardGeo, Mat.roadYellow);
    b2.position.set(1.0, 0.4, 0);
    pumpGroup.add(b1, b2);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.9, 0.7), Mat.buildingWall);
    body.position.y = 1.1;
    body.castShadow = true;
    body.userData = { isPump: true, pumpId: id, level: 2 };

    const header = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.35, 0.74), Mat.redTrim);
    header.position.y = 1.9;
    header.userData = { isPump: true, pumpId: id, level: 2 };

    const lcd = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.05), Mat.darkInk);
    lcd.position.set(0, 1.35, 0.36);

    const hose1 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 6, 12), Mat.darkInk);
    hose1.position.set(0.62, 1.0, -0.15);
    hose1.rotation.y = Math.PI / 2;
    const hose2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 6, 12), Mat.darkInk);
    hose2.position.set(0.62, 1.0, 0.15);
    hose2.rotation.y = Math.PI / 2;

    const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), Mat.chrome);
    lampPost.position.set(0, 2.35, 0);
    const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.3), Mat.lampGlow);
    lampHead.position.set(0, 2.7, 0);
    pumpGroup.add(b1, b2, body, header, lcd, hose1, hose2, lampPost, lampHead);
  } else {
    // --------------------------------------------------
    // Level 3: Ultra Modern Smart Dispenser (LED Fuel Grades, POS, Air Tower)
    // --------------------------------------------------
    const bollardGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8);
    const b1 = new THREE.Mesh(bollardGeo, Mat.hazardStripe);
    b1.position.set(-1.05, 0.45, 0);
    const b2 = new THREE.Mesh(bollardGeo, Mat.hazardStripe);
    b2.position.set(1.05, 0.45, 0);
    pumpGroup.add(b1, b2);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.1, 0.76), Mat.darkInk);
    body.position.y = 1.2;
    body.castShadow = true;
    body.userData = { isPump: true, pumpId: id, level: 3 };

    // Glowing Grade Strips
    const ledStrip1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.04), Mat.redTrim);
    ledStrip1.position.set(-0.45, 1.2, 0.39);
    const ledStrip2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.04), Mat.greenAccent);
    ledStrip2.position.set(-0.15, 1.2, 0.39);
    const ledStrip3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.04), Mat.orangeAccent);
    ledStrip3.position.set(0.15, 1.2, 0.39);
    const ledStrip4 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.04), Mat.evGlow);
    ledStrip4.position.set(0.45, 1.2, 0.39);

    const posPlate = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.35, 0.06), Mat.chrome);
    posPlate.position.set(0, 0.9, 0.40);

    const wideLcd = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.05), Mat.roadWhite);
    wideLcd.position.set(0, 1.65, 0.39);

    const airTower = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.5, 0.35), Mat.blueAccent);
    airTower.position.set(0.9, 0.9, 0);
    const airScreen = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.05), Mat.evGlow);
    airScreen.position.set(0.9, 1.3, 0.18);

    pumpGroup.add(body, ledStrip1, ledStrip2, ledStrip3, ledStrip4, posPlate, wideLcd, airTower, airScreen);
  }

  return pumpGroup;
}

// ---------------------------------------------------------
// Dynamic 3D Facility Spawners (Tier Levels 1, 2, 3)
// ---------------------------------------------------------

function spawnCarWashMesh(level = 1) {
  if (carWashGroup) {
    scene.remove(carWashGroup);
    carWashGroup = null;
  }
  carWashGroup = new THREE.Group();
  carWashGroup.position.set(16, 0.04, -2);
  carWashGroup.userData = { facility: 'wash', level: level };

  // Concrete Wash Bay Slab with Drainage Grate
  const slab = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.12, 8.4), Mat.concrete);
  slab.position.y = 0.06;
  slab.receiveShadow = true;
  carWashGroup.add(slab);

  const trench = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 7.2), Mat.darkInk);
  trench.position.y = 0.125;
  carWashGroup.add(trench);

  if (level === 1) {
    // Level 1: Open Concrete Wash Pad with Pressure Pipe Gantry Arch
    const gantryGeo = new THREE.BoxGeometry(4.8, 0.14, 0.14);
    const topBar = new THREE.Mesh(gantryGeo, Mat.chrome);
    topBar.position.set(0, 3.4, 0);
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.4, 0.14), Mat.chrome);
    p1.position.set(-2.33, 1.7, 0);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.4, 0.14), Mat.chrome);
    p2.position.set(2.33, 1.7, 0);
    carWashGroup.add(topBar, p1, p2);

    for (let x = -1.8; x <= 1.8; x += 0.9) {
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 6), Mat.blueAccent);
      nozzle.position.set(x, 3.25, 0);
      nozzle.rotation.x = Math.PI;
      carWashGroup.add(nozzle);
    }
  } else if (level === 2) {
    // Level 2: Semi-Enclosed Steel Arch Tunnel with Rotating Brushes
    const arch = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.8, 8.0), Mat.blueAccent);
    arch.position.y = 1.9;
    arch.castShadow = true;
    carWashGroup.add(arch);

    const tunnelHole = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 8.2), Mat.darkInk);
    tunnelHole.position.y = 1.6;
    carWashGroup.add(tunnelHole);

    // Dual Vertical Cylindrical Brushes
    const brushGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.2, 10);
    const brushMat = new THREE.MeshLambertMaterial({ color: 0x00E5FF });
    const b1 = new THREE.Mesh(brushGeo, brushMat);
    b1.position.set(-1.2, 1.6, 0);
    const b2 = new THREE.Mesh(brushGeo, brushMat);
    b2.position.set(1.2, 1.6, 0);
    carWashGroup.add(b1, b2);

    // Top Roller Brush
    const topBrush = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.2, 10), brushMat);
    topBrush.position.set(0, 2.9, 0);
    topBrush.rotation.z = Math.PI / 2;
    carWashGroup.add(topBrush);
  } else {
    // Level 3: Fully Enclosed Futuristic Wash Tunnel (LED Portal, Overhead Blowers & Traffic Light)
    const arch = new THREE.Mesh(new THREE.BoxGeometry(5.4, 4.2, 9.2), Mat.darkInk);
    arch.position.y = 2.1;
    arch.castShadow = true;
    carWashGroup.add(arch);

    const glassPortholes1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 7.0), Mat.glass);
    glassPortholes1.position.set(-2.72, 2.2, 0);
    const glassPortholes2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 7.0), Mat.glass);
    glassPortholes2.position.set(2.72, 2.2, 0);
    carWashGroup.add(glassPortholes1, glassPortholes2);

    // Neon Cyan Entry / Exit Portal Rings
    const portalGeo = new THREE.BoxGeometry(5.6, 4.4, 0.3);
    const entryRing = new THREE.Mesh(portalGeo, Mat.evGlow);
    entryRing.position.set(0, 2.2, 4.6);
    const exitRing = new THREE.Mesh(portalGeo, Mat.evGlow);
    exitRing.position.set(0, 2.2, -4.6);
    carWashGroup.add(entryRing, exitRing);

    // 2 High-Power Overhead Drying Turbines
    const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 12), Mat.hazardStripe);
    fan1.position.set(-1.0, 4.0, -2.5);
    const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 12), Mat.hazardStripe);
    fan2.position.set(1.0, 4.0, -2.5);
    carWashGroup.add(fan1, fan2);

    // Exit Traffic Signal (Red/Green)
    const trafficPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8), Mat.darkInk);
    trafficPole.position.set(3.2, 1.1, -4.8);
    const trafficBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.25), Mat.darkInk);
    trafficBox.position.set(3.2, 2.2, -4.8);
    const redLight = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), Mat.redTrim);
    redLight.position.set(3.2, 2.4, -4.66);
    const greenLight = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), Mat.greenAccent);
    greenLight.position.set(3.2, 2.0, -4.66);
    carWashGroup.add(trafficPole, trafficBox, redLight, greenLight);
  }

  scene.add(carWashGroup);
  triggerUpgradeFX(carWashGroup);
}

function spawnMarketBayMesh(level = 1) {
  if (marketBayGroup) {
    scene.remove(marketBayGroup);
    marketBayGroup = null;
  }
  marketBayGroup = new THREE.Group();
  marketBayGroup.position.set(-14, 0.04, -8);
  marketBayGroup.userData = { facility: 'market', level: level };

  if (level === 1) {
    // Level 1: Compact Sales Bay Annex
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
  } else if (level === 2) {
    // Level 2: Extended Market + 'PIXEL CAFE' Pergola with Bistro Terrace
    const bay = new THREE.Mesh(new THREE.BoxGeometry(7.6, 3.8, 5.2), Mat.buildingWall);
    bay.position.y = 1.9;
    bay.castShadow = true;
    marketBayGroup.add(bay);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.35, 5.6), Mat.greenAccent);
    roof.position.y = 3.95;
    marketBayGroup.add(roof);

    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.4, 0.1), Mat.glass);
    glassFront.position.set(0, 1.7, 2.62);
    marketBayGroup.add(glassFront);

    // Cafe Side Timber Pergola
    const pergPost1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), Mat.wood);
    pergPost1.position.set(4.4, 1.6, 2.4);
    const pergPost2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), Mat.wood);
    pergPost2.position.set(4.4, 1.6, -1.8);
    const pergRoof = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 4.4), Mat.wood);
    pergRoof.position.set(4.4, 3.2, 0.3);
    marketBayGroup.add(pergPost1, pergPost2, pergRoof);

    // Outdoor Bistro Table & Chairs
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.7, 10), Mat.benchIron);
    table.position.set(4.4, 0.35, 0.3);
    const chair1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), Mat.benchWood);
    chair1.position.set(4.4, 0.2, 1.0);
    const chair2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), Mat.benchWood);
    chair2.position.set(4.4, 0.2, -0.4);
    marketBayGroup.add(table, chair1, chair2);
  } else {
    // Level 3: 2-Story Flagship Supermarket with Rooftop Terrace & Illuminated Sign
    const firstFloor = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3.2, 5.6), Mat.buildingWall);
    firstFloor.position.y = 1.6;
    firstFloor.castShadow = true;
    const secondFloor = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.8, 5.2), Mat.buildingWall);
    secondFloor.position.y = 4.6;
    secondFloor.castShadow = true;
    marketBayGroup.add(firstFloor, secondFloor);

    // Double Height Glass Curtain Walls
    const glass1 = new THREE.Mesh(new THREE.BoxGeometry(7.8, 2.4, 0.1), Mat.glass);
    glass1.position.set(0, 1.6, 2.82);
    const glass2 = new THREE.Mesh(new THREE.BoxGeometry(7.4, 2.2, 0.1), Mat.glass);
    glass2.position.set(0, 4.6, 2.62);
    marketBayGroup.add(glass1, glass2);

    // Rooftop Terrace Railing
    const railFront = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.6, 0.08), Mat.chrome);
    railFront.position.set(0, 6.3, 2.6);
    marketBayGroup.add(railFront);

    // Rooftop 3D Illuminated Billboard Sign
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.2, 0.3), Mat.redTrim);
    signBoard.position.set(0, 6.8, -1.0);
    const signText = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.7, 0.34), Mat.roadWhite);
    signText.position.set(0, 6.8, -0.98);
    marketBayGroup.add(signBoard, signText);

    // Interior Merchandise Snack Racks
    for (let rx = -2.5; rx <= 2.5; rx += 2.5) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.45), Mat.orangeAccent);
      rack.position.set(rx, 1.0, 0.8);
      marketBayGroup.add(rack);
    }
  }

  scene.add(marketBayGroup);
  triggerUpgradeFX(marketBayGroup);
}

function spawnSolarPanelsMesh(level = 1) {
  if (solarPanelsGroup) {
    scene.remove(solarPanelsGroup);
    solarPanelsGroup = null;
  }
  solarPanelsGroup = new THREE.Group();
  solarPanelsGroup.position.set(0, 4.55, -9.5);
  solarPanelsGroup.userData = { facility: 'solar', level: level };

  const countX = level === 1 ? 2 : (level === 2 ? 4 : 5);
  const countZ = level === 1 ? 2 : 3;

  for (let x = -3.2; x <= 3.2; x += (6.4 / (countX - 1 || 1))) {
    for (let z = -1.6; z <= 1.6; z += (3.2 / (countZ - 1 || 1))) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 1.15), Mat.solarCell);
      panel.position.set(x, 0.06, z);
      panel.rotation.x = -0.16;
      solarPanelsGroup.add(panel);
    }
  }

  if (level >= 2) {
    // Inverter Controller Box
    const inv = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), Mat.darkInk);
    inv.position.set(4.2, 0.5, 0);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), Mat.greenAccent);
    led.position.set(4.2, 0.75, 0.22);
    solarPanelsGroup.add(inv, led);
  }

  scene.add(solarPanelsGroup);
  triggerUpgradeFX(solarPanelsGroup);
}

function spawnTurbineMesh(level = 1) {
  if (turbineGroup) {
    scene.remove(turbineGroup);
    turbineGroup = null;
    turbineRotor = null;
    secondaryTurbineRotor = null;
  }
  turbineGroup = new THREE.Group();
  turbineGroup.position.set(-22, 0.04, -8);
  turbineGroup.userData = { facility: 'turbine', level: level };

  const mastHeight = level === 1 ? 12.0 : (level === 2 ? 15.5 : 18.0);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.55, mastHeight, 8), Mat.solarFrame);
  mast.position.y = mastHeight * 0.5;
  mast.castShadow = true;
  turbineGroup.add(mast);

  const nacelle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 2.2), Mat.darkInk);
  nacelle.position.set(0, mastHeight + 0.2, 0);
  turbineGroup.add(nacelle);

  if (level >= 2) {
    // Red Aviation Strobe Beacon
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), Mat.redTrim);
    beacon.position.set(0, mastHeight + 0.8, 0);
    turbineGroup.add(beacon);
  }

  // Primary 3-Blade Rotor
  turbineRotor = new THREE.Group();
  turbineRotor.position.set(0, mastHeight + 0.2, 1.2);
  const bladeLength = level === 1 ? 4.2 : 5.4;
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, bladeLength, 0.08), Mat.roadWhite);
    blade.position.y = bladeLength * 0.5;
    const holder = new THREE.Group();
    holder.rotation.z = (i * 2 * Math.PI) / 3;
    holder.add(blade);
    turbineRotor.add(holder);
  }
  turbineGroup.add(turbineRotor);

  if (level === 3) {
    // Secondary Auxiliary Micro-Rotor
    secondaryTurbineRotor = new THREE.Group();
    secondaryTurbineRotor.position.set(0, mastHeight * 0.55, 0.8);
    for (let i = 0; i < 3; i++) {
      const sBlade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.8, 0.04), Mat.roadYellow);
      sBlade.position.y = 0.9;
      const sHolder = new THREE.Group();
      sHolder.rotation.z = (i * 2 * Math.PI) / 3;
      sHolder.add(sBlade);
      secondaryTurbineRotor.add(sHolder);
    }
    turbineGroup.add(secondaryTurbineRotor);

    // Battery Bank Enclosure at Foundation Base
    const batBank = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.2), Mat.darkInk);
    batBank.position.set(1.4, 0.6, 0);
    const batGauge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.05), Mat.greenAccent);
    batGauge.position.set(1.4, 0.7, 0.62);
    turbineGroup.add(batBank, batGauge);
  }

  scene.add(turbineGroup);
  triggerUpgradeFX(turbineGroup);
}

function spawnEvChargerMesh(level = 1) {
  if (evChargerGroup) {
    scene.remove(evChargerGroup);
    evChargerGroup = null;
  }
  evChargerGroup = new THREE.Group();
  evChargerGroup.position.set(-8, 0.04, 4);
  evChargerGroup.userData = { facility: 'ev', level: level };

  // EV Green Parking Pad
  const padWidth = level === 1 ? 3.0 : 4.4;
  const pad = new THREE.Mesh(new THREE.BoxGeometry(padWidth, 0.04, 2.4), Mat.greenAccent);
  pad.position.y = 0.02;
  pad.receiveShadow = true;
  evChargerGroup.add(pad);

  if (level === 1) {
    // Single 150kW Pedestal
    const totem = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.8, 0.4), Mat.darkInk);
    totem.position.set(0, 0.9, -0.6);
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 0.05), Mat.evGlow);
    led.position.set(0, 1.0, -0.38);
    evChargerGroup.add(totem, led);
  } else if (level === 2) {
    // Dual 350kW DC Ultra Chargers
    [-1.0, 1.0].forEach(x => {
      const totem = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.9, 0.4), Mat.darkInk);
      totem.position.set(x, 0.95, -0.6);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 0.05), Mat.evGlow);
      led.position.set(x, 1.05, -0.38);
      const cable = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 6, 12), Mat.blueAccent);
      cable.position.set(x + (x > 0 ? 0.35 : -0.35), 0.7, -0.6);
      cable.rotation.y = Math.PI / 2;
      evChargerGroup.add(totem, led, cable);
    });
  } else {
    // Level 3: Modern Solar-Roofed EV Hub with High-Res Status Canopy
    [-1.2, 1.2].forEach(x => {
      const totem = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.0, 0.42), Mat.darkInk);
      totem.position.set(x, 1.0, -0.6);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.05), Mat.evGlow);
      led.position.set(x, 1.1, -0.38);
      evChargerGroup.add(totem, led);
    });

    // Solar Canopy over EV Bay
    const evRoof = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 3.2), Mat.solarCell);
    evRoof.position.set(0, 3.2, 0);
    evRoof.rotation.x = -0.08;
    const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), Mat.chrome);
    post1.position.set(-2.2, 1.6, -1.2);
    const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), Mat.chrome);
    post2.position.set(2.2, 1.6, -1.2);
    evChargerGroup.add(evRoof, post1, post2);

    // Floor Embedded Cyan Guide Strips
    const gStrip1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 1.8), Mat.evGlow);
    gStrip1.position.set(-1.2, 0.045, 0.3);
    const gStrip2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 1.8), Mat.evGlow);
    gStrip2.position.set(1.2, 0.045, 0.3);
    evChargerGroup.add(gStrip1, gStrip2);
  }

  scene.add(evChargerGroup);
  triggerUpgradeFX(evChargerGroup);
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

  // Diverse Tree Placements (Oak, Pine, Palm, Road-verge Saplings, Wild Bushes)
  const diverseTreeList = [
    // Back Hill Pines & Sturdy Oaks
    { pos: [-32, -30], type: 'pine', scale: 1.25 },
    { pos: [-26, -32], type: 'oak',  scale: 1.15 },
    { pos: [-20, -31], type: 'pine', scale: 0.95 },
    { pos: [-14, -33], type: 'oak',  scale: 1.30 },
    { pos: [-8, -32],  type: 'pine', scale: 1.10 },
    { pos: [0, -34],   type: 'oak',  scale: 1.40 },
    { pos: [8, -32],   type: 'pine', scale: 1.15 },
    { pos: [14, -33],  type: 'oak',  scale: 1.20 },
    { pos: [20, -31],  type: 'pine', scale: 1.05 },
    { pos: [26, -32],  type: 'oak',  scale: 1.25 },
    { pos: [32, -30],  type: 'pine', scale: 1.30 },

    // Left & Right Perimeter Trees
    { pos: [-34, -20], type: 'pine', scale: 1.10 },
    { pos: [-33, -10], type: 'oak',  scale: 1.15 },
    { pos: [-34, 0],   type: 'pine', scale: 1.05 },
    { pos: [-33, 10],  type: 'oak',  scale: 1.20 },
    { pos: [-34, 20],  type: 'pine', scale: 1.25 },
    { pos: [-32, 28],  type: 'oak',  scale: 1.10 },

    { pos: [34, -20],  type: 'pine', scale: 1.10 },
    { pos: [33, -10],  type: 'oak',  scale: 1.25 },
    { pos: [34, 0],    type: 'pine', scale: 1.15 },
    { pos: [33, 10],   type: 'oak',  scale: 1.05 },
    { pos: [34, 20],   type: 'pine', scale: 1.30 },
    { pos: [32, 28],   type: 'oak',  scale: 1.20 },

    // Station Garden Palms (Beside Entrance & Planters)
    { pos: [-12, -4.5], type: 'palm', scale: 1.05 },
    { pos: [12, -4.5],  type: 'palm', scale: 1.05 },

    // Roadway Refüj Young Saplings (with Support Stakes)
    { pos: [-24, 14.5], type: 'sapling', scale: 0.95 },
    { pos: [-14, 14.5], type: 'sapling', scale: 1.00 },
    { pos: [14, 14.5],  type: 'sapling', scale: 1.00 },
    { pos: [24, 14.5],  type: 'sapling', scale: 0.95 }
  ];

  diverseTreeList.forEach((tData, idx) => {
    const tree = createDiverseLowPolyTree(idx, tData.type);
    tree.position.set(tData.pos[0], 0.04, tData.pos[1]);
    const s = tData.scale || 1.0;
    tree.scale.set(s, s, s);
    diorama.add(tree);
  });

  // Wild Grass Clump Clusters along fence lines
  const bushCoords = [
    [-17, -10], [17, -10], [-21, -4], [21, -4],
    [-11, 7.2], [11, 7.2], [-5, 7.2], [5, 7.2]
  ];
  bushCoords.forEach(([bx, bz], bIdx) => {
    const bush = createWildBush(bIdx);
    bush.position.set(bx, 0.04, bz);
    diorama.add(bush);
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

// 2b. West Cloud Viaduct (Sol Sınır - Bulutlara Uzanan Asma Viyadük Köprüsü)
function buildWestCloudViaduct(diorama) {
  const viaductGroup = new THREE.Group();

  // Highway Bridge Deck Extension (X: -40 to -58, Width: 7.5, Height: 0.8)
  const deckGeo = new THREE.BoxGeometry(18, 0.8, 7.5);
  const deckMesh = new THREE.Mesh(deckGeo, Mat.asphalt);
  deckMesh.position.set(-49, -0.37, 11.5);
  deckMesh.receiveShadow = true;
  viaductGroup.add(deckMesh);

  // Concrete Bridge Base Slab
  const slabGeo = new THREE.BoxGeometry(18.2, 0.6, 7.9);
  const slabMesh = new THREE.Mesh(slabGeo, Mat.concrete);
  slabMesh.position.set(-49, -0.75, 11.5);
  viaductGroup.add(slabMesh);

  // Double Yellow Lines along the viaduct
  for (let i = -56; i <= -40; i += 3) {
    const lineGeo = new THREE.BoxGeometry(1.8, 0.02, 0.15);
    const l1 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    l1.position.set(i, 0.05, 11.35);
    const l2 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    l2.position.set(i, 0.05, 11.65);
    viaductGroup.add(l1, l2);
  }

  // Safety Guardrails on North & South edges of viaduct
  [-1, 1].forEach(side => {
    const railZ = 11.5 + side * 3.75;
    // Concrete base curb
    const curb = new THREE.Mesh(new THREE.BoxGeometry(18, 0.35, 0.25), Mat.darkInk);
    curb.position.set(-49, 0.18, railZ);
    viaductGroup.add(curb);
    // Chrome tubular handrail
    const rail = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 0.08), Mat.chrome);
    rail.position.set(-49, 0.52, railZ);
    viaductGroup.add(rail);

    // Stanchion posts every 3 meters
    for (let x = -56; x <= -40; x += 3.2) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), Mat.chrome);
      post.position.set(x, 0.35, railZ);
      viaductGroup.add(post);
    }
  });

  // Massive Architectural Concrete Pylon under viaduct
  const pylonGeo = new THREE.BoxGeometry(2.4, 12.0, 5.5);
  const pylon = new THREE.Mesh(pylonGeo, Mat.concrete);
  pylon.position.set(-49, -6.5, 11.5);
  pylon.castShadow = true;
  viaductGroup.add(pylon);

  // Support corbel brackets
  const bracketGeo = new THREE.BoxGeometry(3.6, 1.2, 5.8);
  const bracket = new THREE.Mesh(bracketGeo, Mat.darkInk);
  bracket.position.set(-49, -1.2, 11.5);
  viaductGroup.add(bracket);

  // 3D Soft Pastel Cloud Bank at Viaduct Mouth (X: -54 to -58)
  const cloudGroup = new THREE.Group();
  const cloudMat = Mat.cloud;
  const cloudSteamMat = Mat.steam;
  const cloudPositions = [
    [-54, 0.6, 9.0, 1.8],
    [-56, 1.2, 11.5, 2.4],
    [-55, 0.4, 14.2, 2.0],
    [-57, 1.8, 9.8, 2.2],
    [-58, 0.8, 12.8, 2.6],
    [-53.5, -0.4, 11.5, 1.6],
    [-56.5, 2.2, 12.0, 1.9],
    [-55, -0.8, 7.5, 2.1]
  ];

  cloudPositions.forEach(([cx, cy, cz, rad], idx) => {
    const geo = new THREE.DodecahedronGeometry(rad, 1);
    const m = (idx % 3 === 0) ? cloudSteamMat : cloudMat;
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(cx, cy, cz);
    mesh.scale.set(1.3, 0.85, 1.1);
    cloudGroup.add(mesh);
  });
  viaductGroup.add(cloudGroup);

  diorama.add(viaductGroup);
}

// 2c. East Hyper-Ring Speedway Portal (Sağ Sınır - Fütüristik Aerodinamik Hızlandırma Kemeri)
function buildEastHyperRingPortal(diorama) {
  const portalGroup = new THREE.Group();

  // Highway Bridge Deck Extension (X: +40 to +58, Width: 7.5, Height: 0.8)
  const deckGeo = new THREE.BoxGeometry(18, 0.8, 7.5);
  const deckMesh = new THREE.Mesh(deckGeo, Mat.asphalt);
  deckMesh.position.set(49, -0.37, 11.5);
  deckMesh.receiveShadow = true;
  portalGroup.add(deckMesh);

  // Dark High-Tech Base Slab
  const slabGeo = new THREE.BoxGeometry(18.2, 0.6, 7.9);
  const slabMesh = new THREE.Mesh(slabGeo, Mat.darkInk);
  slabMesh.position.set(49, -0.75, 11.5);
  portalGroup.add(slabMesh);

  // Double Yellow Lines
  for (let i = 40; i <= 56; i += 3) {
    const lineGeo = new THREE.BoxGeometry(1.8, 0.02, 0.15);
    const l1 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    l1.position.set(i, 0.05, 11.35);
    const l2 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    l2.position.set(i, 0.05, 11.65);
    portalGroup.add(l1, l2);
  }

  // Under-deck structural diagonal space trusses
  [44, 48, 52, 56].forEach(tx => {
    const truss = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 6.5), Mat.solarFrame);
    truss.position.set(tx, -2.6, 11.5);
    truss.rotation.z = 0.25;
    portalGroup.add(truss);
  });

  // 4 Aerodynamic Hexagonal Speed-Ring Arches
  const ringX = [42, 46, 50, 54];
  ringX.forEach((rx, idx) => {
    const archGroup = new THREE.Group();
    archGroup.position.set(rx, 0, 11.5);

    // Left & Right Steel Pillars
    [-1, 1].forEach(side => {
      const pz = side * 3.85;
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.8, 0.45), Mat.darkInk);
      col.position.set(0, 1.9, pz);
      col.castShadow = true;
      archGroup.add(col);

      // Cyan Accent Strip on each pillar
      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.58, 2.8, 0.1), Mat.evGlow);
      glow.position.set(0, 1.8, pz - side * 0.18);
      archGroup.add(glow);

      // Translucent Aerodynamic Glass Wing Deflector
      const wingGeo = new THREE.BoxGeometry(1.4, 3.0, 0.08);
      const wing = new THREE.Mesh(wingGeo, Mat.canopyGlass);
      wing.position.set(0.4, 2.2, pz + side * 0.45);
      wing.rotation.y = side * 0.35;
      archGroup.add(wing);
    });

    // Top Overhead Arch Crossbeam
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 8.2), Mat.darkInk);
    topBeam.position.set(0, 3.9, 0);
    archGroup.add(topBeam);

    // Overhead Speed Sensor Strip
    const sensorStrip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 6.5), Mat.evGlow);
    sensorStrip.position.set(0, 3.65, 0);
    archGroup.add(sensorStrip);

    portalGroup.add(archGroup);
  });

  diorama.add(portalGroup);
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

function createOakTree(id = 0) {
  const tree = new THREE.Group();
  tree.userData = { treeId: id, treeType: 'oak' };

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.55, 2.6, 7), Mat.wood);
  trunk.position.y = 1.3;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown = new THREE.Group();
  crown.position.y = 2.6;

  const centerSphere = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 1), Mat.oakFoliage);
  centerSphere.position.y = 1.1;
  centerSphere.castShadow = true;
  crown.add(centerSphere);

  const offsets = [
    [-1.2, 0.7, 0.8, 1.3, Mat.oakFoliageLight],
    [1.3, 0.9, -0.7, 1.4, Mat.oakFoliage],
    [-0.8, 1.5, -1.0, 1.2, Mat.foliageDark],
    [0.9, 1.6, 0.9, 1.1, Mat.oakFoliageLight]
  ];
  offsets.forEach(([ox, oy, oz, r, mat]) => {
    const c = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), mat);
    c.position.set(ox, oy, oz);
    c.castShadow = true;
    crown.add(c);
  });

  tree.add(crown);
  tree.userData.crown = crown;
  animatedTrees.push(tree);
  return tree;
}

function createPineTree(id = 0) {
  const tree = new THREE.Group();
  tree.userData = { treeId: id, treeType: 'pine' };

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.40, 2.2, 6), Mat.wood);
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown = new THREE.Group();
  crown.position.y = 2.0;

  const layers = [
    { r: 2.2, h: 1.8, y: 0.3, mat: Mat.pineFoliage },
    { r: 1.7, h: 1.6, y: 1.3, mat: Mat.foliageDark },
    { r: 1.2, h: 1.4, y: 2.2, mat: Mat.pineFoliage },
    { r: 0.7, h: 1.1, y: 3.1, mat: Mat.foliage }
  ];
  layers.forEach(l => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(l.r, l.h, 6), l.mat);
    cone.position.y = l.y;
    cone.castShadow = true;
    crown.add(cone);
  });

  tree.add(crown);
  tree.userData.crown = crown;
  animatedTrees.push(tree);
  return tree;
}

function createPalmTree(id = 0) {
  const tree = new THREE.Group();
  tree.userData = { treeId: id, treeType: 'palm' };

  const trunkGroup = new THREE.Group();
  for (let s = 0; s < 5; s++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.18 - s * 0.015, 0.22 - s * 0.015, 0.85, 6), Mat.palmTrunk);
    seg.position.set(Math.sin(s * 0.25) * 0.25, s * 0.75 + 0.42, 0);
    seg.rotation.z = -s * 0.08;
    seg.castShadow = true;
    trunkGroup.add(seg);
  }
  tree.add(trunkGroup);

  const crown = new THREE.Group();
  crown.position.set(0.6, 4.0, 0);

  for (let i = 0; i < 7; i++) {
    const angle = (i * 2 * Math.PI) / 7;
    const frond = new THREE.Group();
    frond.rotation.y = angle;
    frond.rotation.z = 0.55 + (i % 2) * 0.15;

    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.35), Mat.palmLeaf);
    leaf.position.x = 0.8;
    leaf.castShadow = true;
    frond.add(leaf);
    crown.add(frond);
  }

  tree.add(crown);
  tree.userData.crown = crown;
  animatedTrees.push(tree);
  return tree;
}

function createRoadVergeSapling(id = 0) {
  const tree = new THREE.Group();
  tree.userData = { treeId: id, treeType: 'sapling' };

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.6, 5), Mat.wood);
  stem.position.y = 1.3;
  stem.castShadow = true;
  tree.add(stem);

  const stake1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 4), Mat.planterWood);
  stake1.position.set(-0.25, 0.75, 0);
  stake1.rotation.z = 0.25;
  const stake2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 4), Mat.planterWood);
  stake2.position.set(0.25, 0.75, 0);
  stake2.rotation.z = -0.25;
  tree.add(stake1, stake2);

  const crown = new THREE.Group();
  crown.position.y = 2.4;
  const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 0), Mat.oakFoliageLight);
  leaves.position.y = 0.3;
  leaves.castShadow = true;
  crown.add(leaves);

  tree.add(crown);
  tree.userData.crown = crown;
  animatedTrees.push(tree);
  return tree;
}

function createWildBush(id = 0) {
  const bush = new THREE.Group();
  bush.userData = { treeId: id, treeType: 'bush' };
  const count = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const bMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.25, 0), Mat.foliage);
    bMesh.position.set((Math.random() - 0.5) * 0.4, 0.2 + (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.4);
    bMesh.castShadow = true;
    bush.add(bMesh);
  }
  bush.userData.crown = bush;
  animatedTrees.push(bush);
  return bush;
}

function createDiverseLowPolyTree(id = 0, type = 'pine') {
  if (type === 'oak') return createOakTree(id);
  if (type === 'palm') return createPalmTree(id);
  if (type === 'sapling') return createRoadVergeSapling(id);
  return createPineTree(id);
}

function createLowPolyTree(id = 0) {
  return createDiverseLowPolyTree(id, 'pine');
}

function createRoadPuddles(diorama) {
  const puddleCoords = [
    [-6.5, 0.05, 10.2, 2.2, 1.4, 0.25],
    [7.5, 0.05, 12.0, 1.9, 1.2, -0.4],
    [-2.0, 0.05, 1.5, 1.6, 1.1, 0.6]
  ];
  puddleCoords.forEach(([x, y, z, rx, rz, rot], pIdx) => {
    const geo = new THREE.CircleGeometry(rx * 0.5, 12);
    geo.rotateX(-Math.PI / 2);
    geo.scale(1.0, 1.0, rz / rx);
    const mesh = new THREE.Mesh(geo, Mat.puddle);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rot;
    mesh.userData = { isPuddle: true, pIndex: pIdx };
    diorama.add(mesh);
    roadPuddles.push(mesh);
  });
}

function createManholeSteamSystem(diorama) {
  const manholes = [
    [-8.5, 0.045, 9.8],
    [8.5, 0.045, 10.4],
    [-7.0, 0.045, -8.2]
  ];
  manholes.forEach(([mx, my, mz], idx) => {
    const cover = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.02, 12), Mat.darkInk);
    cover.position.set(mx, my, mz);
    diorama.add(cover);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.015, 12), Mat.asphaltPatch);
    rim.position.set(mx, my - 0.005, mz);
    diorama.add(rim);

    // Steam emitter group
    const emitter = {
      pos: new THREE.Vector3(mx, my + 0.1, mz),
      particles: [],
      timer: Math.random() * 2.0
    };
    manholeSteamEmitters.push(emitter);
  });
}

function createSkyFlockBirds(diorama) {
  for (let i = 0; i < 5; i++) {
    const bird = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.45), Mat.roadWhite);
    const lWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.22), Mat.roadWhite);
    lWing.position.set(-0.35, 0, 0);
    const rWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.22), Mat.roadWhite);
    rWing.position.set(0.35, 0, 0);
    bird.add(body, lWing, rWing);
    bird.userData = {
      lWing, rWing,
      flockOffset: i * (Math.PI * 2 / 5),
      radius: 18 + (i % 2) * 5,
      speed: 0.65 + i * 0.08,
      altitude: 20 + i * 1.4
    };
    diorama.add(bird);
    skyFlockBirds.push(bird);
  }
}

function createPerchedPigeons(diorama) {
  const spots = [
    [-13.1, 4.6, 7.5, 0],
    [14.9, 4.6, 7.5, Math.PI],
    [-4.5, 4.65, -6.4, 0.3]
  ];
  spots.forEach(([px, py, pz, rot], idx) => {
    const pigeon = new THREE.Group();
    const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.32), Mat.pigeonGrey);
    pBody.position.y = 0.1;
    const pHead = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), Mat.pigeonNeck);
    pHead.position.set(0, 0.22, 0.12);
    const pBeak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 4), Mat.flowerYellow);
    pBeak.rotation.x = Math.PI / 2;
    pBeak.position.set(0, 0.22, 0.21);
    pigeon.add(pBody, pHead, pBeak);
    pigeon.position.set(px, py, pz);
    pigeon.rotation.y = rot;
    pigeon.userData = { head: pHead, bobTimer: Math.random() * 3.0 };
    diorama.add(pigeon);
    perchedPigeons.push(pigeon);
  });
}

function createNightMoths(diorama) {
  const lampCenters = [
    new THREE.Vector3(-14, 4.0, 7.5),
    new THREE.Vector3(14, 4.0, 7.5)
  ];
  lampCenters.forEach((center, cIdx) => {
    for (let m = 0; m < 4; m++) {
      const moth = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), Mat.lampGlow);
      moth.userData = {
        center,
        angle: Math.random() * Math.PI * 2,
        dist: 0.4 + Math.random() * 0.9,
        speed: 3.0 + Math.random() * 4.0,
        heightOffset: (Math.random() - 0.5) * 0.6
      };
      diorama.add(moth);
      nightMoths.push(moth);
    }
  });
}

function createAirConditionerUnit(diorama) {
  const acGroup = new THREE.Group();
  acGroup.position.set(-3.2, 3.2, -12.3);

  const housing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.6), Mat.acGrey);
  housing.castShadow = true;
  acGroup.add(housing);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.05), Mat.darkInk);
  grille.position.set(0, 0, -0.31);
  acGroup.add(grille);

  acFanMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.04), Mat.chrome);
  acFanMesh.position.set(0, 0, -0.32);
  acGroup.add(acFanMesh);

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.8, 5), Mat.darkInk);
  pipe.position.set(0.5, -1.4, -0.15);
  acGroup.add(pipe);

  diorama.add(acGroup);
}

function createUrbanWearDetails(diorama) {
  // 1. Patched asphalt areas (differently shaded bitumen slabs)
  const patches = [
    [-3.0, 0.046, 12.2, 2.4, 1.8, 0.15],
    [5.5, 0.046, 10.8, 1.8, 2.2, -0.2],
    [-7.5, 0.046, 2.5, 2.0, 1.5, 0.35]
  ];
  patches.forEach(([x, y, z, sx, sz, rot]) => {
    const patch = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.01, sz), Mat.asphaltPatch);
    patch.position.set(x, y, z);
    patch.rotation.y = rot;
    patch.receiveShadow = true;
    diorama.add(patch);
  });

  // 2. Torn Wall Posters & Graffiti accent on shop west wall
  const poster1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), Mat.posterRed);
  poster1.position.set(-5.06, 2.2, -9.5);
  poster1.rotation.y = -Math.PI / 2;
  const poster2 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.8), Mat.posterCyan);
  poster2.position.set(-5.06, 1.8, -8.6);
  poster2.rotation.y = -Math.PI / 2;
  poster2.rotation.z = -0.15;
  diorama.add(poster1, poster2);

  // 3. Crumpled Newspaper & Paper Cup trash blown into corners
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.14, 6), Mat.paperTrash);
  cup.position.set(-5.6, 0.07, -6.8);
  cup.rotation.z = Math.PI / 2.3;
  const news = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), Mat.paperTrash);
  news.position.set(-6.1, 0.05, -7.1);
  news.rotation.y = 0.45;
  diorama.add(cup, news);

  // 4. Rolling Tin Can Prop (with subtle physics roll on gust)
  rollingCanMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 8), Mat.tinCan);
  rollingCanMesh.position.set(3.5, 0.05, 6.8);
  rollingCanMesh.rotation.z = Math.PI / 2;
  rollingCanMesh.userData = { baseX: 3.5, baseZ: 6.8, rollTimer: 8.0 };
  diorama.add(rollingCanMesh);
}

function createHighAltitudeJet(diorama) {
  skyJetMesh = new THREE.Group();
  const jetBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 1.6), Mat.roadWhite);
  const wings = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.04, 0.6), Mat.roadWhite);
  wings.position.set(0, 0, 0.1);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.4), Mat.redTrim);
  tail.position.set(0, 0.25, -0.6);
  skyJetMesh.add(jetBody, wings, tail);

  skyJetMesh.position.set(-60, 32, -28);
  skyJetMesh.rotation.y = Math.PI / 2.15;
  skyJetMesh.userData = { speed: 4.5, active: true };
  diorama.add(skyJetMesh);
}

function updateCafePatrons(targetDiorama = diorama) {
  cafePatrons.forEach(p => {
    if (p.parent) p.parent.remove(p);
  });
  cafePatrons.length = 0;

  if (!State.upgrades.hasMarket || State.upgrades.marketLevel < 2) return;

  const patronSpots = [
    { pos: [-16.2, 0.04, -5.6], rot: 0.4, clothes: Mat.npcClothes1, hair: Mat.npcHairDark },
    { pos: [-17.4, 0.04, -5.4], rot: -1.8, clothes: Mat.npcClothes2, hair: Mat.npcHairBlonde },
    { pos: [-11.8, 0.04, -5.6], rot: 1.2, clothes: Mat.npcClothes3, hair: Mat.npcHairDark }
  ];

  patronSpots.forEach((spot, idx) => {
    const patron = new THREE.Group();
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.3), spot.clothes);
    pelvis.position.y = 0.52;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.28), spot.clothes);
    torso.position.y = 0.85;

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), Mat.npcSkin);
    head.position.set(0, 1.2, 0);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), spot.hair);
    hair.position.set(0, 1.32, 0);

    const thighL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.32), Mat.darkInk);
    thighL.position.set(-0.1, 0.46, 0.16);
    const thighR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.32), Mat.darkInk);
    thighR.position.set(0.1, 0.46, 0.16);

    const shinL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.1), Mat.darkInk);
    shinL.position.set(-0.1, 0.21, 0.3);
    const shinR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.1), Mat.darkInk);
    shinR.position.set(0.1, 0.21, 0.3);

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.08, 6), Mat.coffeeCup);
    cup.position.set(0.18, 0.78, 0.22);

    patron.add(pelvis, torso, head, hair, thighL, thighR, shinL, shinR, cup);
    patron.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
    patron.rotation.y = spot.rot;
    patron.userData = { head, sipTimer: idx * 2.0 };

    if (targetDiorama) targetDiorama.add(patron);
    cafePatrons.push(patron);
  });
}

function updateLivingWorldFX(delta, totalSeconds) {
  // 1. Sky flock birds circling
  skyFlockBirds.forEach(bird => {
    const u = bird.userData;
    u.flockOffset += u.speed * delta;
    bird.position.x = Math.cos(u.flockOffset) * u.radius;
    bird.position.z = Math.sin(u.flockOffset) * u.radius;
    bird.position.y = u.altitude + Math.sin(totalSeconds * 1.5 + u.flockOffset) * 0.8;
    bird.rotation.y = -u.flockOffset - Math.PI / 2;
    const flap = Math.sin(totalSeconds * 8.0 + u.flockOffset) * 0.35;
    u.lWing.rotation.z = flap;
    u.rWing.rotation.z = -flap;
  });

  // 2. Perched pigeons head bobbing
  perchedPigeons.forEach(pigeon => {
    pigeon.userData.bobTimer -= delta;
    if (pigeon.userData.bobTimer <= 0) {
      pigeon.userData.bobTimer = 1.8 + Math.random() * 3.5;
      pigeon.userData.head.rotation.y = (Math.random() - 0.5) * 0.8;
    }
  });

  // 3. Night Moths / Fireflies around street lights
  const isNight = State.hour < 6 || State.hour >= 20;
  nightMoths.forEach(moth => {
    moth.visible = isNight;
    if (isNight) {
      const u = moth.userData;
      u.angle += u.speed * delta;
      moth.position.set(
        u.center.x + Math.cos(u.angle) * u.dist,
        u.center.y + u.heightOffset + Math.sin(totalSeconds * 4.0 + u.angle) * 0.15,
        u.center.z + Math.sin(u.angle) * u.dist
      );
    }
  });

  // 4. Manhole steam puffs
  manholeSteamEmitters.forEach(emitter => {
    emitter.timer -= delta;
    if (emitter.timer <= 0) {
      emitter.timer = 0.22 + Math.random() * 0.28;
      if (Math.random() < 0.65) {
        const steamMesh = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.12, 0),
          Mat.steam
        );
        steamMesh.position.copy(emitter.pos);
        steamMesh.position.x += (Math.random() - 0.5) * 0.25;
        steamMesh.position.z += (Math.random() - 0.5) * 0.25;
        scene.add(steamMesh);
        particles.push({
          mesh: steamMesh,
          mat: steamMesh.material,
          vel: new THREE.Vector3((Math.random() - 0.5) * 0.1, 0.45 + Math.random() * 0.35, (Math.random() - 0.5) * 0.1),
          life: 1.6,
          maxLife: 1.6
        });
      }
    }
  });

  // 5. Air Conditioner compressor fan & water drip
  if (acFanMesh) {
    acFanMesh.rotation.z += 12.0 * delta;
  }
  acDripTimer += delta;
  if (acDripTimer >= 2.8) {
    acDripTimer = 0;
    const drop = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), Mat.glass);
    drop.position.set(-2.7, 1.8, -12.45);
    scene.add(drop);
    particles.push({
      mesh: drop,
      mat: drop.material,
      vel: new THREE.Vector3(0, -1.8, 0),
      life: 0.9,
      maxLife: 0.9
    });
  }

  // 6. High altitude jet plane
  if (skyJetMesh && skyJetMesh.userData.active) {
    skyJetMesh.position.x += skyJetMesh.userData.speed * delta;
    skyJetMesh.position.z += (skyJetMesh.userData.speed * 0.15) * delta;
    if (skyJetMesh.position.x > 65) {
      skyJetMesh.position.set(-65, 32, -28);
    }
  }

  // 7. Faulty street lamp occasional flicker
  faultyLampTimer += delta;
  if (faultyLampTimer > 18.0) {
    if (faultyLampTimer < 18.35) {
      if (totemGlowLight) {
        totemGlowLight.intensity = Math.random() > 0.4 ? 0.9 : 0.1;
      }
    } else {
      faultyLampTimer = (Math.random() - 0.5) * 6.0;
    }
  }

  // 8. Rolling tin can physics
  if (rollingCanMesh) {
    const u = rollingCanMesh.userData;
    u.rollTimer -= delta;
    if (u.rollTimer <= 0) {
      u.rollTimer = 12.0 + Math.random() * 10.0;
      rollingCanVelocity = 2.4;
    }
    if (rollingCanVelocity > 0.01) {
      rollingCanMesh.position.x += rollingCanVelocity * delta;
      rollingCanMesh.rotation.y += rollingCanVelocity * 6.0 * delta;
      rollingCanVelocity *= 0.96;
      if (rollingCanMesh.position.x > 12) {
        rollingCanMesh.position.x = u.baseX;
        rollingCanVelocity = 0;
      }
    }
  }

  // 9. Cafe Patrons sipping coffee
  cafePatrons.forEach(patron => {
    patron.userData.sipTimer -= delta;
    if (patron.userData.sipTimer <= 0) {
      patron.userData.sipTimer = 3.5 + Math.random() * 4.0;
      patron.userData.head.rotation.x = Math.sin(totalSeconds * 3.0) * 0.15;
    }
  });
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
// 6. PROCEDURAL CAR VEHICLE GENERATOR & KINEMATIC PHYSICS
// =========================================================

function lerpAngle(current, target, factor) {
  let diff = (target - current) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * factor;
}

const CAR_COLORS = [0x4A7BB0, 0xC44D3F, 0x4E9B66, 0x2A3E59, 0xD47631, 0x546E7A, 0x8E44AD, 0x34495E, 0xBE8C3D];
const FUEL_TYPES = ['benzin', 'dizel', 'lpg', 'ev'];

// Kinematic Forward Proximity & Collision Sensor (Anti-Ghosting & Safe Following)
function getForwardObstacleDistance(me, isBypass = false) {
  let minDistance = 999;
  const myPos = me.mesh.position;
  const myX = myPos.x;
  const myZ = myPos.z;

  if (isBypass) {
    // 1. Check other bypass vehicles ahead in the highway lane corridor
    if (typeof bgVehicles !== 'undefined' && Array.isArray(bgVehicles)) {
      for (let i = 0; i < bgVehicles.length; i++) {
        const other = bgVehicles[i];
        if (other === me) continue;
        const ox = other.mesh.position.x;
        const oz = other.mesh.position.z;
        if (Math.abs(oz - myZ) < 2.0 && ox > myX) {
          const d = ox - myX;
          if (d < minDistance) minDistance = d;
        }
      }
    }
    // 2. Also check if any customer car is currently departing/merging into highway ahead
    if (typeof cars !== 'undefined' && Array.isArray(cars)) {
      for (let i = 0; i < cars.length; i++) {
        const c = cars[i];
        if (c.state === 'DEPARTING' && c.mesh.position.z > 9.0) {
          const ox = c.mesh.position.x;
          if (ox > myX && (ox - myX) < minDistance && Math.abs(c.mesh.position.z - myZ) < 2.4) {
            minDistance = ox - myX;
          }
        }
      }
    }
  } else {
    // Customer car (Vehicle)
    if (me.state === 'APPROACHING' || me.state === 'DEPARTING') {
      // Check other customer cars ahead in same queue/path
      if (typeof cars !== 'undefined' && Array.isArray(cars)) {
        for (let i = 0; i < cars.length; i++) {
          const other = cars[i];
          if (other === me) continue;
          const ox = other.mesh.position.x;
          const oz = other.mesh.position.z;
          const dist = Math.hypot(ox - myX, oz - myZ);

          if (me.waypoints && me.wpIndex < me.waypoints.length) {
            const wp = me.waypoints[me.wpIndex];
            const toWpX = wp.x - myX;
            const toWpZ = wp.z - myZ;
            const toOtherX = ox - myX;
            const toOtherZ = oz - myZ;
            const dot = toWpX * toOtherX + toWpZ * toOtherZ;
            // If other car is in our travel heading and within proximity
            if (dot > 0 && dist < 5.2 && dist < minDistance) {
              minDistance = dist;
            }
          }
        }
      }

      // If DEPARTING and approaching highway merge (Z > 9.0), yield to fast bypass traffic!
      if (me.state === 'DEPARTING' && myZ > 9.0) {
        if (typeof bgVehicles !== 'undefined' && Array.isArray(bgVehicles)) {
          for (let i = 0; i < bgVehicles.length; i++) {
            const bg = bgVehicles[i];
            const bgX = bg.mesh.position.x;
            if (bgX < myX + 2.5 && bgX > myX - 8.5) {
              minDistance = Math.min(minDistance, 2.0); // Force yield stop
            }
          }
        }
      }
    }
  }

  return minDistance < 900 ? minDistance : null;
}

class Vehicle {
  constructor(modelType, fuelType, colorHex) {
    this.modelType = modelType;
    this.fuelType = fuelType;
    this.colorHex = colorHex;
    this.reqLiters = Math.floor(Math.random() * 35) + 20;
    this.targetPumpSlot = null;
    this.state = 'APPROACHING'; // APPROACHING, PARKING, WAITING, REFUELING, DEPARTING, DONE

    this.wheels = [];
    this.frontWheels = [];
    this.mesh = this.buildMesh();
    this.mesh.userData = { vehicle: this };

    this.cruiseSpeed = 0.055 + Math.random() * 0.012; // calm, readable tycoon pacing (~3.6 units/sec)
    this.currentSpeed = 0.035;
    this.waypoints = [];
    this.wpIndex = 0;
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

    // Front Headlights (+Z)
    const hlGeo = new THREE.BoxGeometry(0.32, 0.16, 0.1);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xFFF9C4 });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.6, 0.6, 1.71);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.6, 0.6, 1.71);
    car.add(hl1, hl2);

    // Rear Taillights (-Z)
    const tlGeo = new THREE.BoxGeometry(0.32, 0.16, 0.1);
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xD64545 });
    const tl1 = new THREE.Mesh(tlGeo, tlMat);
    tl1.position.set(-0.6, 0.6, -1.71);
    const tl2 = new THREE.Mesh(tlGeo, tlMat);
    tl2.position.set(0.6, 0.6, -1.71);
    car.add(tl1, tl2);

    // Bumper Protective Trims
    const bumperMat = Mat.darkInk;
    const fBump = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.18, 0.18), bumperMat);
    fBump.position.set(0, 0.32, 1.72);
    const rBump = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.18, 0.18), bumperMat);
    rBump.position.set(0, 0.32, -1.72);
    car.add(fBump, rBump);

    // 4 Animated Wheels & Steering Pivots
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 12);
    const wheelMat = Mat.darkInk;
    const rimMat = Mat.chrome;
    const rimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.26, 8);

    const wheelPos = [
      [-0.95, 0.32, -1.0, false], // rear left
      [0.95, 0.32, -1.0, false],  // rear right
      [-0.95, 0.32, 1.0, true],   // front left
      [0.95, 0.32, 1.0, true]     // front right
    ];

    wheelPos.forEach(([wx, wy, wz, isFront]) => {
      const pivot = new THREE.Group();
      pivot.position.set(wx, wy, wz);

      const wheelHub = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelHub.add(tire, rim);

      pivot.add(wheelHub);
      car.add(pivot);

      this.wheels.push(wheelHub);
      if (isFront) this.frontWheels.push(pivot);
    });

    // Floating Fuel Order Badge
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1E242B';
    ctx.fillRect(0, 0, 256, 80);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#E5B242';
    ctx.strokeRect(3, 3, 250, 74);
    ctx.fillStyle = '#FAF7EE';
    ctx.font = 'bold 26px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`[ ${this.fuelType.toUpperCase()} ${this.reqLiters}L ]`, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.75, 1);
    sprite.position.set(0, 2.3, 0);
    car.add(sprite);

    // Initial position inside West Cloud Viaduct, facing +X (Math.PI / 2)
    car.position.set(-52, 0, 11.5);
    car.rotation.y = Math.PI / 2;
    return car;
  }

  initApproachPath() {
    if (!this.targetPumpSlot) return;
    const slotPos = this.targetPumpSlot.pos;
    const isFrontRow = slotPos.z >= 2;
    const parkZ = slotPos.z + 1.8;
    const parkX = slotPos.x;

    if (isFrontRow) {
      // Front Row Pumps (#3 and #4): Smooth entry directly into front bay corridor
      this.waypoints = [
        new THREE.Vector3(slotPos.x - 7.5, 0, 11.5),             // 1. Highway deceleration
        new THREE.Vector3(slotPos.x - 4.2, 0, 9.2),              // 2. Apron entrance curb curve
        new THREE.Vector3(slotPos.x - 1.2, 0, parkZ + 1.8),      // 3. Front bay corridor alignment
        new THREE.Vector3(parkX, 0, parkZ + 0.8),                // 4. Pump entry straight
        new THREE.Vector3(parkX, 0, parkZ)                       // 5. Final pump docking stop
      ];
    } else {
      // Back Row Pumps (#1 and #2): Drive through dedicated open outer aisle without clipping front islands
      this.waypoints = [
        new THREE.Vector3(slotPos.x - 8.5, 0, 11.5),             // 1. Highway deceleration
        new THREE.Vector3(slotPos.x - 5.5, 0, 9.0),              // 2. Apron entrance curb curve
        new THREE.Vector3(slotPos.x - 2.8, 0, 5.2),              // 3. Clear bypass aisle around front island
        new THREE.Vector3(slotPos.x - 0.8, 0, 1.8),              // 4. Inner aisle alignment
        new THREE.Vector3(parkX, 0, parkZ + 0.8),                // 5. Back bay straight alignment
        new THREE.Vector3(parkX, 0, parkZ)                       // 6. Final pump docking stop
      ];
    }
    this.wpIndex = 0;
    this.state = 'APPROACHING';
  }

  initDeparturePath() {
    const startX = this.mesh.position.x;
    const startZ = this.mesh.position.z;

    this.waypoints = [
      new THREE.Vector3(startX + 1.0, 0, startZ + 1.8),  // 1. Forward roll out of bay
      new THREE.Vector3(startX + 3.8, 0, 8.6),           // 2. Apron exit curve
      new THREE.Vector3(startX + 7.5, 0, 11.5),          // 3. Highway merge lane
      new THREE.Vector3(56, 0, 11.5)                     // 4. Drive off through East Hyper-Ring Portal
    ];
    this.wpIndex = 0;
    this.state = 'DEPARTING';
  }

  update(delta = 0.016) {
    if (this.state === 'APPROACHING' || this.state === 'DEPARTING') {
      if (this.wpIndex < this.waypoints.length) {
        const wp = this.waypoints[this.wpIndex];
        const dx = wp.x - this.mesh.position.x;
        const dz = wp.z - this.mesh.position.z;
        const dist = Math.hypot(dx, dz);

        // Smooth steering angle calculation (Kinematic Yaw)
        const targetAngle = Math.atan2(dx, dz);
        this.mesh.rotation.y = lerpAngle(this.mesh.rotation.y, targetAngle, 0.085 * State.timeSpeed);

        // Steer front wheels towards relative turn angle
        let steerAngle = (targetAngle - this.mesh.rotation.y) % (Math.PI * 2);
        if (steerAngle < -Math.PI) steerAngle += Math.PI * 2;
        if (steerAngle > Math.PI) steerAngle -= Math.PI * 2;
        steerAngle = Math.max(-0.42, Math.min(0.42, steerAngle));
        this.frontWheels.forEach(fw => {
          fw.rotation.y = lerpAngle(fw.rotation.y, steerAngle, 0.15 * State.timeSpeed);
        });

        // Forward Obstacle Proximity & Safe Following Check (Anti-Ghosting Physics)
        const aheadDist = getForwardObstacleDistance(this, false);
        let obstacleBrakeFactor = 1.0;
        if (aheadDist !== null) {
          if (aheadDist < 2.8) {
            obstacleBrakeFactor = 0.0; // Complete stop behind leading vehicle!
          } else if (aheadDist < 4.8) {
            obstacleBrakeFactor = (aheadDist - 2.8) / 2.0; // Smooth deceleration
          }
        }

        // Acceleration & Deceleration curves
        let targetSpeed = this.cruiseSpeed;
        if (this.state === 'APPROACHING' && this.wpIndex === this.waypoints.length - 1) {
          // Decelerate smoothly as we reach the pump stop point
          targetSpeed = Math.max(0.012, this.cruiseSpeed * Math.min(1.0, dist / 2.2));
        } else if (this.state === 'DEPARTING') {
          targetSpeed = this.cruiseSpeed * 1.15;
        }

        targetSpeed *= obstacleBrakeFactor;

        this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, targetSpeed, 0.08 * State.timeSpeed);
        const stepDist = this.currentSpeed * State.timeSpeed;

        if (dist > 0.01 && obstacleBrakeFactor > 0.01) {
          const moveStep = Math.min(stepDist, dist);
          this.mesh.position.x += (dx / dist) * moveStep;
          this.mesh.position.z += (dz / dist) * moveStep;
        }

        // Wheel spin animation around X
        this.wheels.forEach(w => {
          w.rotation.x += stepDist * 3.6;
        });

        // Subtle suspension chassis roll on curves
        this.mesh.rotation.z = lerpAngle(this.mesh.rotation.z, -steerAngle * 0.12, 0.1);

        // Waypoint arrival threshold
        const threshold = (this.wpIndex === this.waypoints.length - 1) ? 0.14 : 0.45;
        if (dist <= threshold) {
          this.wpIndex++;
          if (this.wpIndex >= this.waypoints.length) {
            if (this.state === 'APPROACHING') {
              this._arriveAtPump();
            } else if (this.state === 'DEPARTING') {
              this.destroy();
            }
          }
        }
      } else if (this.mesh.position.x > 56) {
        this.destroy();
      }
    } else if (this.state === 'WAITING' || this.state === 'REFUELING') {
      // Gentle engine idle vibration / suspension settle
      this.frontWheels.forEach(fw => {
        fw.rotation.y = lerpAngle(fw.rotation.y, 0, 0.1);
      });
      this.mesh.rotation.z = lerpAngle(this.mesh.rotation.z, 0, 0.1);

      if (this.bounceTime < 2.0) {
        this.bounceTime += 0.05 * State.timeSpeed;
        const spring = Math.sin(this.bounceTime * 9) * Math.exp(-this.bounceTime * 4) * 0.06;
        this.mesh.position.y = spring;
      } else {
        this.mesh.position.y = 0;
      }
    }
  }

  _arriveAtPump() {
    this.mesh.position.y = 0;
    this.state = 'WAITING';
    this.bounceTime = 0;
    this.targetPumpSlot.occupiedBy = this;
    showToast(t('toast_car_docked', this.targetPumpSlot.id + 1));
    sfx.playHonk();

    // If Attendant or Manager is hired, automatically refuel!
    if (State.staff.attendant >= 1 || State.upgrades.hasManager) {
      const waitTime = Math.max(600, 1800 / (1 + (State.staff.attendant - 1) * 0.25));
      setTimeout(() => autoServiceCar(this), waitTime / State.timeSpeed);
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
  car.mesh.position.set(-52, 0, 11.5); // Spawn inside West Cloud Viaduct!
  car.targetPumpSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
  car.targetPumpSlot.occupiedBy = car;
  car.initApproachPath();

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
    } else if (e.code === 'KeyT') {
      toggleCanopySetting();
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

  car.initDeparturePath();
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
  car.initDeparturePath();
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
  if (open) {
    m.classList.remove('hidden');
    if (modalId === 'build-modal') updateBuildModalButtons();
  } else {
    m.classList.add('hidden');
  }
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

// Facility Purchase & Tier Upgrade Handlers (with Timers & Visual Evolution)
function updateBuildModalButtons() {
  // 1. Pump Islands
  const btnPump = document.getElementById('btn-buy-pump');
  if (btnPump && !btnPump.disabled) {
    if (State.upgrades.pumps >= 4) {
      btnPump.textContent = t('btn_bought');
      btnPump.disabled = true;
    } else {
      const nextPumpCost = 6000 + (State.upgrades.pumps - 1) * 2000;
      btnPump.textContent = `₺ ${nextPumpCost.toLocaleString()}`;
    }
  }
  const pumpCountEl = document.getElementById('upgrade-pump-count');
  if (pumpCountEl) pumpCountEl.textContent = State.upgrades.pumps;

  // 2. Car Wash (Lvl 1 -> Lvl 2 -> Lvl 3)
  const btnWash = document.getElementById('btn-buy-wash');
  if (btnWash && !btnWash.disabled) {
    if (!State.upgrades.hasCarWash) {
      btnWash.textContent = '₺ 12.000';
    } else if (State.upgrades.washLevel === 1) {
      btnWash.textContent = `${currentLang === 'tr' ? 'Seviye 2 Yükselt' : 'Upgrade to Lvl 2'} (₺8.000)`;
      btnWash.className = 'buy-btn neo-btn warning';
    } else if (State.upgrades.washLevel === 2) {
      btnWash.textContent = `${currentLang === 'tr' ? 'Seviye 3 Yükselt' : 'Upgrade to Lvl 3'} (₺15.000)`;
      btnWash.className = 'buy-btn neo-btn gold';
    } else {
      btnWash.textContent = `${currentLang === 'tr' ? 'MAKS (Seviye 3)' : 'MAX (Level 3)'}`;
      btnWash.disabled = true;
      btnWash.className = 'buy-btn neo-btn success';
    }
  }

  // 3. Mini Market & Cafe (Lvl 1 -> Lvl 2 -> Lvl 3)
  const btnMarket = document.getElementById('btn-buy-market');
  if (btnMarket && !btnMarket.disabled) {
    if (!State.upgrades.hasMarket) {
      btnMarket.textContent = '₺ 14.000';
    } else if (State.upgrades.marketLevel === 1) {
      btnMarket.textContent = `${currentLang === 'tr' ? 'Seviye 2 Yükselt' : 'Upgrade to Lvl 2'} (₺9.500)`;
      btnMarket.className = 'buy-btn neo-btn warning';
    } else if (State.upgrades.marketLevel === 2) {
      btnMarket.textContent = `${currentLang === 'tr' ? 'Seviye 3 Yükselt' : 'Upgrade to Lvl 3'} (₺18.000)`;
      btnMarket.className = 'buy-btn neo-btn gold';
    } else {
      btnMarket.textContent = `${currentLang === 'tr' ? 'MAKS (Seviye 3)' : 'MAX (Level 3)'}`;
      btnMarket.disabled = true;
      btnMarket.className = 'buy-btn neo-btn success';
    }
  }

  // 4. Solar GES (Lvl 1 -> Lvl 2 -> Lvl 3)
  const btnSolar = document.getElementById('btn-buy-solar');
  const statusSolar = document.getElementById('energy-solar-status');
  if (btnSolar && !btnSolar.disabled) {
    if (!State.upgrades.hasSolar) {
      btnSolar.textContent = '₺ 8.500';
      if (statusSolar) { statusSolar.textContent = currentLang === 'tr' ? 'Yok' : 'None'; statusSolar.className = 'badge-chip grey'; }
    } else if (State.upgrades.solarLevel === 1) {
      btnSolar.textContent = `${currentLang === 'tr' ? 'Seviye 2' : 'Level 2'} (₺6.000)`;
      if (statusSolar) { statusSolar.textContent = 'Seviye 1'; statusSolar.className = 'badge-chip green'; }
    } else if (State.upgrades.solarLevel === 2) {
      btnSolar.textContent = `${currentLang === 'tr' ? 'Seviye 3' : 'Level 3'} (₺12.000)`;
      if (statusSolar) { statusSolar.textContent = 'Seviye 2'; statusSolar.className = 'badge-chip gold'; }
    } else {
      btnSolar.textContent = currentLang === 'tr' ? 'MAKS (Seviye 3)' : 'MAX (Lvl 3)';
      btnSolar.disabled = true;
      if (statusSolar) { statusSolar.textContent = 'Seviye 3 (Maks)'; statusSolar.className = 'badge-chip gold'; }
    }
  }

  // 5. Turbine (Lvl 1 -> Lvl 2 -> Lvl 3)
  const btnTurbine = document.getElementById('btn-buy-turbine');
  const statusTurbine = document.getElementById('energy-turbine-status');
  if (btnTurbine && !btnTurbine.disabled) {
    if (!State.upgrades.hasTurbine) {
      btnTurbine.textContent = '₺ 11.000';
      if (statusTurbine) { statusTurbine.textContent = currentLang === 'tr' ? 'Yok' : 'None'; statusTurbine.className = 'badge-chip grey'; }
    } else if (State.upgrades.turbineLevel === 1) {
      btnTurbine.textContent = `${currentLang === 'tr' ? 'Seviye 2' : 'Level 2'} (₺8.000)`;
      if (statusTurbine) { statusTurbine.textContent = 'Seviye 1'; statusTurbine.className = 'badge-chip green'; }
    } else if (State.upgrades.turbineLevel === 2) {
      btnTurbine.textContent = `${currentLang === 'tr' ? 'Seviye 3' : 'Level 3'} (₺16.000)`;
      if (statusTurbine) { statusTurbine.textContent = 'Seviye 2'; statusTurbine.className = 'badge-chip gold'; }
    } else {
      btnTurbine.textContent = currentLang === 'tr' ? 'MAKS (Seviye 3)' : 'MAX (Lvl 3)';
      btnTurbine.disabled = true;
      if (statusTurbine) { statusTurbine.textContent = 'Seviye 3 (Maks)'; statusTurbine.className = 'badge-chip gold'; }
    }
  }

  // 6. EV Ultra Charger (Lvl 1 -> Lvl 2 -> Lvl 3)
  const btnEv = document.getElementById('btn-buy-ev-charger');
  if (btnEv && !btnEv.disabled) {
    if (!State.upgrades.hasEvCharger) {
      btnEv.textContent = '₺ 18.000';
    } else if (State.upgrades.evLevel === 1) {
      btnEv.textContent = `${currentLang === 'tr' ? 'Seviye 2 Yükselt' : 'Upgrade to Lvl 2'} (₺12.000)`;
      btnEv.className = 'buy-btn neo-btn warning';
    } else if (State.upgrades.evLevel === 2) {
      btnEv.textContent = `${currentLang === 'tr' ? 'Seviye 3 Yükselt' : 'Upgrade to Lvl 3'} (₺24.000)`;
      btnEv.className = 'buy-btn neo-btn gold';
    } else {
      btnEv.textContent = `${currentLang === 'tr' ? 'MAKS (Seviye 3)' : 'MAX (Level 3)'}`;
      btnEv.disabled = true;
      btnEv.className = 'buy-btn neo-btn success';
    }
  }
}

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
      State.upgrades.pumpLevels[nextSlotId] = 1;
      pumpSlots[nextSlotId].isBuilt = true;
      const pumpMesh = createPumpMesh(nextSlotId, 1);
      pumpMesh.position.copy(pumpSlots[nextSlotId].pos);
      pumpSlots[nextSlotId].mesh = pumpMesh;
      scene.add(pumpMesh);
      triggerUpgradeFX(pumpMesh);

      showToast(t('toast_construction_finished', `Pompa #${nextSlotId + 1}`));
      sfx.playFanfare();
      updateBuildModalButtons();
      updateHUD();
    },
    plot,
    'btn-buy-pump'
  );
}

function buyWashUpgrade() {
  if (!State.upgrades.hasCarWash) {
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
        State.upgrades.washLevel = 1;
        spawnCarWashMesh(1);
        updateBuildModalButtons();
        showToast(t('toast_wash_active'));
        sfx.playFanfare();
        updateHUD();
      },
      plot,
      'btn-buy-wash'
    );
  } else if (State.upgrades.washLevel < 3) {
    const nextLvl = State.upgrades.washLevel + 1;
    const cost = nextLvl === 2 ? 8000 : 15000;
    if (State.money < cost) {
      showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
      return;
    }
    State.money -= cost;
    State.upgrades.washLevel = nextLvl;
    spawnCarWashMesh(nextLvl);
    updateBuildModalButtons();
    showToast(`Oto Yıkama Seviye ${nextLvl} yapıldı!`);
    sfx.playFanfare();
    updateHUD();
  }
}

function buyMarketUpgrade() {
  if (!State.upgrades.hasMarket) {
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
        State.upgrades.marketLevel = 1;
        spawnMarketBayMesh(1);
        updateCafePatrons(diorama);
        updateBuildModalButtons();
        showToast(t('toast_market_active'));
        sfx.playFanfare();
        updateHUD();
      },
      plot,
      'btn-buy-market'
    );
  } else if (State.upgrades.marketLevel < 3) {
    const nextLvl = State.upgrades.marketLevel + 1;
    const cost = nextLvl === 2 ? 9500 : 18000;
    if (State.money < cost) {
      showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
      return;
    }
    State.money -= cost;
    State.upgrades.marketLevel = nextLvl;
    spawnMarketBayMesh(nextLvl);
    updateCafePatrons(diorama);
    updateBuildModalButtons();
    showToast(`Mini Market & Cafe Seviye ${nextLvl} yapıldı!`);
    sfx.playFanfare();
    updateHUD();
  }
}

function buySolarUpgrade() {
  if (!State.upgrades.hasSolar) {
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
        State.upgrades.solarLevel = 1;
        spawnSolarPanelsMesh(1);
        updateBuildModalButtons();
        showToast(t('toast_solar_built'));
        sfx.playFanfare();
        updateHUD();
      },
      plot,
      'btn-buy-solar'
    );
  } else if (State.upgrades.solarLevel < 3) {
    const nextLvl = State.upgrades.solarLevel + 1;
    const cost = nextLvl === 2 ? 6000 : 12000;
    if (State.money < cost) {
      showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
      return;
    }
    State.money -= cost;
    State.upgrades.solarLevel = nextLvl;
    spawnSolarPanelsMesh(nextLvl);
    updateBuildModalButtons();
    showToast(`Çatı GES Seviye ${nextLvl} yapıldı!`);
    sfx.playFanfare();
    updateHUD();
  }
}

function buyTurbineUpgrade() {
  if (!State.upgrades.hasTurbine) {
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
        State.upgrades.turbineLevel = 1;
        spawnTurbineMesh(1);
        updateBuildModalButtons();
        showToast(t('toast_turbine_built'));
        sfx.playFanfare();
        updateHUD();
      },
      plot,
      'btn-buy-turbine'
    );
  } else if (State.upgrades.turbineLevel < 3) {
    const nextLvl = State.upgrades.turbineLevel + 1;
    const cost = nextLvl === 2 ? 8000 : 16000;
    if (State.money < cost) {
      showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
      return;
    }
    State.money -= cost;
    State.upgrades.turbineLevel = nextLvl;
    spawnTurbineMesh(nextLvl);
    updateBuildModalButtons();
    showToast(`Rüzgar Türbini Seviye ${nextLvl} yapıldı!`);
    sfx.playFanfare();
    updateHUD();
  }
}

function buyEvChargerUpgrade() {
  if (!State.upgrades.hasEvCharger) {
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
        State.upgrades.evLevel = 1;
        spawnEvChargerMesh(1);
        updateBuildModalButtons();
        showToast(t('toast_ev_built'));
        sfx.playFanfare();
        updateHUD();
      },
      plot,
      'btn-buy-ev-charger'
    );
  } else if (State.upgrades.evLevel < 3) {
    const nextLvl = State.upgrades.evLevel + 1;
    const cost = nextLvl === 2 ? 12000 : 24000;
    if (State.money < cost) {
      showToast(t('toast_insufficient_funds', cost.toLocaleString()), 'error');
      return;
    }
    State.money -= cost;
    State.upgrades.evLevel = nextLvl;
    spawnEvChargerMesh(nextLvl);
    updateBuildModalButtons();
    showToast(`EV Ultra Şarj Seviye ${nextLvl} yapıldı!`);
    sfx.playFanfare();
    updateHUD();
  }
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
    this.speed = 9 + Math.random() * 6;
    this.mesh.position.set(-54 - Math.random() * 8, 0, 13.4);
    this.mesh.rotation.y = Math.PI / 2;
  }

  update(delta) {
    const aheadDist = getForwardObstacleDistance(this, true);
    let speedMult = 1.0;
    if (aheadDist !== null) {
      if (aheadDist < 2.8) {
        speedMult = 0;
      } else if (aheadDist < 5.0) {
        speedMult = (aheadDist - 2.8) / 2.2;
      }
    }
    this.mesh.position.x += this.speed * speedMult * delta * State.timeSpeed;
    if (this.mesh.position.x > 56) {
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
  if (secondaryTurbineRotor) {
    secondaryTurbineRotor.rotation.z -= 4.5 * delta * State.timeSpeed;
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
  updateLivingWorldFX(delta, totalSeconds);
  updateCanopyAnimation(delta);
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
  const btnCanopy = document.getElementById('btn-toggle-canopy');
  if (btnCanopy) {
    btnCanopy.textContent = State.settings.showCanopy ? (currentLang === 'tr' ? 'AÇIK' : 'ON') : (currentLang === 'tr' ? 'KAPALI' : 'OFF');
    btnCanopy.className = `neo-btn toggle-btn ${State.settings.showCanopy ? 'success' : 'danger'}`;
  }

  const btnQuickCanopy = document.getElementById('btn-quick-toggle-canopy');
  if (btnQuickCanopy) {
    btnQuickCanopy.classList.toggle('active', State.settings.showCanopy);
  }

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

function updateCanopyAnimation(delta) {
  if (!canopyRoofMesh) return;
  if (Math.abs(canopyAnimProgress - canopyTargetProgress) > 0.0005) {
    canopyAnimProgress = THREE.MathUtils.damp(canopyAnimProgress, canopyTargetProgress, 7.5, delta);
    
    // Z-axis scale: 1.0 (fully deployed) to 0.04 (retracted into market)
    const zScale = THREE.MathUtils.lerp(0.04, 1.0, canopyAnimProgress);
    // Z-axis position: 0.0 (over pumps) to -6.2 (retracted back against market wall)
    const zPos = THREE.MathUtils.lerp(-6.2, 0.0, canopyAnimProgress);
    // X-axis tilt angle: 0 rad (flat horizontal) to -0.35 rad (-20 deg upward folded accordion)
    const xRot = THREE.MathUtils.lerp(-0.35, 0.0, canopyAnimProgress);

    canopyRoofMesh.scale.set(1.0, 1.0, zScale);
    canopyRoofMesh.position.set(0, 0, zPos);
    canopyRoofMesh.rotation.x = xRot;

    if (Mat.canopyGlass) {
      Mat.canopyGlass.opacity = THREE.MathUtils.lerp(0.0, 0.32, canopyAnimProgress);
    }
  }

  if (canopyTargetProgress === 0.0 && canopyAnimProgress < 0.015) {
    canopyRoofMesh.visible = false;
  } else {
    canopyRoofMesh.visible = true;
  }
}

function toggleCanopySetting() {
  State.settings.showCanopy = !State.settings.showCanopy;
  localStorage.setItem('pixeloil_canopy_vis', State.settings.showCanopy);
  canopyTargetProgress = State.settings.showCanopy ? 1.0 : 0.0;
  if (canopyRoofMesh) {
    canopyRoofMesh.visible = true;
  }
  sfx.playCanopyMove(State.settings.showCanopy);
  updateSettingsUI();
  showToast(t('toast_canopy_toggled'));
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
  const randomFuel = FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)];
  const randomColor = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
  const car = new Vehicle('sedan', randomFuel, randomColor);
  car.targetPumpSlot = freeSlot;
  freeSlot.occupiedBy = car;
  car.initApproachPath();
  cars.push(car);
  scene.add(car.mesh);
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
