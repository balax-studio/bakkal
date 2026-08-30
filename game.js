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
    build_title: 'İstasyon Yatırımları',
    upgrade_pump_title: 'Pompa Adası Ekle',
    upgrade_pump_desc: 'Aynı anda daha fazla araca dolum yapın.',
    upgrade_wash_title: 'Otomatik Tünel Oto Yıkama',
    upgrade_wash_desc: 'Gelen araçlardan otomatik yıkama ücreti tahsil eder.',
    upgrade_solar_title: 'Çatı Güneş Enerjisi (GES)',
    upgrade_solar_desc: 'Gündüz istasyonun elektrik faturasını sıfırlar.',
    upgrade_mgr_title: 'İstasyon Müdürü İşe Al',
    upgrade_mgr_desc: 'Dolum ve tanker siparişlerini otomatik yönetir.',
    btn_bought: 'ALINDI',
    btn_working: 'ÇALIŞIYOR',
    order_title: 'Yakıt Siparişi (Tanker)',
    tank_status: 'Depo',
    office_title: 'İstasyon Yönetim Ofisi',
    stat_total_rev: 'Toplam Ciro:',
    stat_total_cars: 'Hizmet Verilen Araç:',
    stat_satisfaction: 'Genel Memnuniyet:',
    tariff_title: 'Litre / Birim Satış Tarifesi',
    cost_prefix: 'Maliyet',
    no_waiting_car: '(Bekleyen Araç Yok)',
    toast_welcome: 'PixelOil 3D İstasyonuna Hoş Geldiniz!',
    toast_car_docked: 'Araç #{0} pompasına yanaştı.',
    toast_fuel_empty: 'UYARI: Depoda {0} kalmadı!',
    toast_collected: '+₺{0} tahsil edildi.',
    toast_tip: 'Camlar temizlendi (+₺25 Bahşiş).',
    toast_mgr: 'İstasyon Müdürü: Pompa #{0} dolduruldu (+₺{1})',
    toast_speed: 'Zaman Hızı: {0}x',
    toast_max_pumps: 'Maksimum pompa sayısına ulaşıldı (4).',
    toast_insufficient_funds: 'Yetersiz bakiye! (Gereken: ₺{0})',
    toast_pump_built: 'Pompa #{0} inşa edildi.',
    toast_wash_active: 'Otomatik Oto Yıkama aktif edildi (+₺80/araç).',
    toast_solar_built: 'Çatı GES kuruldu. Gündüz elektrik faturası ₺0.',
    toast_mgr_hired: 'İstasyon Müdürü göreve başladı. Dolumlar otomatik.',
    toast_tanker_arrived: '{0}L {1} tankeri ikmal yaptı.',
    toast_tank_overflow: 'Depo kapasitesi aşılıyor! (Boş yer: {0} L)',
    toast_tariff_updated: '{0} tarifesi güncellendi: ₺{1}',
    toast_new_day: 'GÜN {0} BAŞLADI',
    toast_target: 'Hedef dolum: {0}'
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
    build_title: 'Station Investments',
    upgrade_pump_title: 'Add Pump Island',
    upgrade_pump_desc: 'Serve more vehicles simultaneously.',
    upgrade_wash_title: 'Automatic Tunnel Car Wash',
    upgrade_wash_desc: 'Automatically charges incoming vehicles for wash.',
    upgrade_solar_title: 'Rooftop Solar (PV)',
    upgrade_solar_desc: 'Eliminates daytime station power bills.',
    upgrade_mgr_title: 'Hire Station Manager',
    upgrade_mgr_desc: 'Automates car refueling and tanker orders.',
    btn_bought: 'OWNED',
    btn_working: 'ACTIVE',
    order_title: 'Fuel Tanker Order',
    tank_status: 'Tank',
    office_title: 'Station Management Office',
    stat_total_rev: 'Total Revenue:',
    stat_total_cars: 'Vehicles Served:',
    stat_satisfaction: 'Satisfaction:',
    tariff_title: 'Fuel Unit Price Tariff',
    cost_prefix: 'Cost',
    no_waiting_car: '(No Waiting Vehicle)',
    toast_welcome: 'Welcome to PixelOil 3D Station!',
    toast_car_docked: 'Vehicle docked at Pump #{0}.',
    toast_fuel_empty: 'WARNING: Out of {0} fuel in storage!',
    toast_collected: '+₺{0} collected.',
    toast_tip: 'Windshield cleaned (+₺25 Tip).',
    toast_mgr: 'Station Manager: Filled Pump #{0} (+₺{1})',
    toast_speed: 'Time Speed: {0}x',
    toast_max_pumps: 'Maximum pump count reached (4).',
    toast_insufficient_funds: 'Insufficient funds! (Required: ₺{0})',
    toast_pump_built: 'Pump #{0} constructed.',
    toast_wash_active: 'Automatic Car Wash activated (+₺80/car).',
    toast_solar_built: 'Solar panels installed. Daytime power cost ₺0.',
    toast_mgr_hired: 'Station Manager hired. Refueling automated.',
    toast_tanker_arrived: '{0}L {1} tanker delivery completed.',
    toast_tank_overflow: 'Tank capacity exceeded! (Available: {0} L)',
    toast_tariff_updated: '{0} tariff updated: ₺{1}',
    toast_new_day: 'DAY {0} HAS BEGUN',
    toast_target: 'Target fill: {0}'
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
}

// =========================================================
// 2. GAME STATE & SIMULATION CONSTANTS
// =========================================================

const State = {
  money: 12500,
  day: 1,
  hour: 9,
  minute: 0,
  timeSpeed: 1,
  rep: 4.8,
  totalRev: 0,
  totalCars: 0,

  // Storage Tanks (Current / Max)
  tanks: {
    benzin: { current: 3500, max: 5000, cost: 38.50, price: 44.90, color: 0xD64545 },
    dizel:  { current: 4200, max: 5000, cost: 39.20, price: 45.40, color: 0x27A05A },
    lpg:    { current: 2100, max: 3000, cost: 21.80, price: 26.20, color: 0xE8862E },
    ev:     { current: 100,  max: 100,  cost: 4.50,  price: 9.80,  color: 0x2F6FED }
  },

  // Upgrades
  upgrades: {
    pumps: 2, // 1 to 4
    hasCarWash: false,
    hasSolar: false,
    hasManager: false
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
  targetCost: 'FULL'
};

// =========================================================
// 2. WEB AUDIO 16-BIT SYNTHESIZER
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

  playCoin() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playPumpTick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playHonk() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playBirdChirp() {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playCricket() {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(4500, now);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }
}
const sfx = new SoundFX();

// =========================================================
// 3. THREE.JS 3D SCENE SETUP
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
let dogMesh = null;
let catMesh = null;

const pumpSlots = [
  { id: 0, pos: new THREE.Vector3(-4, 0, -2), occupiedBy: null, mesh: null },
  { id: 1, pos: new THREE.Vector3(4, 0, -2),  occupiedBy: null, mesh: null },
  { id: 2, pos: new THREE.Vector3(-4, 0, 4),  occupiedBy: null, mesh: null },
  { id: 3, pos: new THREE.Vector3(4, 0, 4),   occupiedBy: null, mesh: null }
];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function initThree() {
  const container = document.getElementById('canvas-container');
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xBFD8E3);

  // Orthographic Camera (True Isometric 2:1)
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

  // Controls with Strict Bounds (Prevents drifting out of diorama)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minPolarAngle = Math.PI / 6;
  controls.minDistance = 12;
  controls.maxDistance = 42;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 0, 0);

  // Lights
  ambientLight = new THREE.AmbientLight(0xEAECEF, 0.7);
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0xFFFBF0, 1.15);
  sunLight.position.set(18, 30, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 120;
  const shadowDist = 26;
  sunLight.shadow.camera.left = -shadowDist;
  sunLight.shadow.camera.right = shadowDist;
  sunLight.shadow.camera.top = shadowDist;
  sunLight.shadow.camera.bottom = -shadowDist;
  scene.add(sunLight);

  // Build Living Environment
  buildDiorama();

  // Events
  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointerdown', onCanvasClick);

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
// 4. 16-BIT LOW-POLY LIVING DIORAMA BUILDER
// =========================================================

// Shared Flat & Emissive Materials
const Mat = {
  grass: new THREE.MeshLambertMaterial({ color: 0x76B041 }),
  dirt: new THREE.MeshLambertMaterial({ color: 0x8D6346 }),
  asphalt: new THREE.MeshLambertMaterial({ color: 0x2A313A }),
  concrete: new THREE.MeshLambertMaterial({ color: 0xDCD6C8 }),
  roadYellow: new THREE.MeshLambertMaterial({ color: 0xF2C94C }),
  roadWhite: new THREE.MeshLambertMaterial({ color: 0xEAEAEA }),
  buildingWall: new THREE.MeshLambertMaterial({ color: 0xF5EFE0 }),
  buildingRoof: new THREE.MeshLambertMaterial({ color: 0x48525D }),
  redTrim: new THREE.MeshLambertMaterial({ color: 0xD64545 }),
  greenAccent: new THREE.MeshLambertMaterial({ color: 0x27A05A }),
  orangeAccent: new THREE.MeshLambertMaterial({ color: 0xE8862E }),
  blueAccent: new THREE.MeshLambertMaterial({ color: 0x2F6FED }),
  darkInk: new THREE.MeshLambertMaterial({ color: 0x1C242B }),
  glass: new THREE.MeshLambertMaterial({ color: 0x7298B3, transparent: true, opacity: 0.85 }),
  wood: new THREE.MeshLambertMaterial({ color: 0x6E472A }),
  foliage: new THREE.MeshLambertMaterial({ color: 0x3E7D32 }),
  foliageDark: new THREE.MeshLambertMaterial({ color: 0x2A5A22 }),
  metalTank: new THREE.MeshLambertMaterial({ color: 0xEDE8DC }),
  chrome: new THREE.MeshLambertMaterial({ color: 0xA8B2BC }),
  // Rich Flora & Props
  flowerRed: new THREE.MeshLambertMaterial({ color: 0xE63946 }),
  flowerYellow: new THREE.MeshLambertMaterial({ color: 0xFFD166 }),
  flowerPink: new THREE.MeshLambertMaterial({ color: 0xFF70A6 }),
  flowerStem: new THREE.MeshLambertMaterial({ color: 0x4A8505 }),
  planterWood: new THREE.MeshLambertMaterial({ color: 0x5C381E }),
  benchWood: new THREE.MeshLambertMaterial({ color: 0x9C6644 }),
  benchIron: new THREE.MeshLambertMaterial({ color: 0x2B2D42 }),
  dogFur: new THREE.MeshLambertMaterial({ color: 0xCCA43B }),
  dogMuzzle: new THREE.MeshLambertMaterial({ color: 0x3E2723 }),
  dogCollar: new THREE.MeshLambertMaterial({ color: 0xD62828 }),
  dogMat: new THREE.MeshLambertMaterial({ color: 0x3D5A80 }),
  catFur: new THREE.MeshLambertMaterial({ color: 0xFAEDCD }),
  catSpot: new THREE.MeshLambertMaterial({ color: 0xCB997E }),
  birdBlue: new THREE.MeshLambertMaterial({ color: 0x48CAE4 }),
  birdBeak: new THREE.MeshLambertMaterial({ color: 0xFAA307 }),
  lampPost: new THREE.MeshLambertMaterial({ color: 0x242A35 }),
  lampGlow: new THREE.MeshBasicMaterial({ color: 0xFFE082 }),
  cloud: new THREE.MeshLambertMaterial({ color: 0xFCFCFC, transparent: true, opacity: 0.95 }),
  oilStain: new THREE.MeshLambertMaterial({ color: 0x14181E, transparent: true, opacity: 0.7 }),
  trashGreen: new THREE.MeshLambertMaterial({ color: 0x2D6A4F }),
  airTowerBlue: new THREE.MeshLambertMaterial({ color: 0x1D3557 }),
  fireRed: new THREE.MeshLambertMaterial({ color: 0xE63946 })
};

function buildDiorama() {
  const diorama = new THREE.Group();

  // 1. Extended Island Ground Base (46x46 Floating Neo-Brutalist Diorama)
  const grassGeo = new THREE.BoxGeometry(46, 1.5, 46);
  const grassMesh = new THREE.Mesh(grassGeo, Mat.grass);
  grassMesh.position.y = -0.75;
  grassMesh.receiveShadow = true;
  diorama.add(grassMesh);

  // Stepped Earth Soil Layer
  const dirtGeo = new THREE.BoxGeometry(46, 2.2, 46);
  const dirtMesh = new THREE.Mesh(dirtGeo, Mat.dirt);
  dirtMesh.position.y = -2.6;
  diorama.add(dirtMesh);

  // Dark Ink Floating Base Rim Slab
  const baseSlabGeo = new THREE.BoxGeometry(47.5, 0.6, 47.5);
  const baseSlab = new THREE.Mesh(baseSlabGeo, Mat.darkInk);
  baseSlab.position.y = -3.8;
  diorama.add(baseSlab);

  // 2. Asphalt Highway Road (46 Units Full Width)
  const roadGeo = new THREE.BoxGeometry(46, 0.06, 7.5);
  const roadMesh = new THREE.Mesh(roadGeo, Mat.asphalt);
  roadMesh.position.set(0, 0.03, 11.5);
  roadMesh.receiveShadow = true;
  diorama.add(roadMesh);

  // Double Yellow Lines across full highway
  for (let i = -21; i <= 21; i += 3) {
    const lineGeo = new THREE.BoxGeometry(1.8, 0.02, 0.15);
    const line1 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    line1.position.set(i, 0.07, 11.35);
    const line2 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    line2.position.set(i, 0.07, 11.65);
    diorama.add(line1, line2);
  }

  // White Pedestrian Crosswalk (Zebra Stripes)
  for (let z = 8.4; z <= 14.6; z += 1.1) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.6), Mat.roadWhite);
    stripe.position.set(-2, 0.07, z);
    diorama.add(stripe);
  }

  // 3. Station Concrete Forecourt (Spacious 30x18)
  const forecourtGeo = new THREE.BoxGeometry(30, 0.08, 18);
  const forecourt = new THREE.Mesh(forecourtGeo, Mat.concrete);
  forecourt.position.set(0, 0.04, 1);
  forecourt.receiveShadow = true;
  diorama.add(forecourt);

  // Asphalt Oil Drop / Tire Mark Decals under each pump slot
  pumpSlots.forEach(slot => {
    const oil = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.01, 2.2), Mat.oilStain);
    oil.position.set(slot.pos.x, 0.09, slot.pos.z);
    diorama.add(oil);
  });

  // 4. BenelOil 2-Story Main Building (Shop & Office)
  const building = new THREE.Group();
  building.position.set(-6.5, 0, -8.5);

  // Ground Floor
  const bldgBase = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 7), Mat.buildingWall);
  bldgBase.position.y = 1.6;
  bldgBase.castShadow = true;
  bldgBase.receiveShadow = true;
  building.add(bldgBase);

  // Top Floor / Roof Parapet
  const bldgRoof = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.4, 7.4), Mat.buildingRoof);
  bldgRoof.position.y = 3.3;
  bldgRoof.castShadow = true;
  building.add(bldgRoof);

  // Shop Glass Windows & Door
  const winGeo = new THREE.BoxGeometry(2.4, 1.8, 0.2);
  const win1 = new THREE.Mesh(winGeo, Mat.glass);
  win1.position.set(-2.5, 1.4, 3.52);
  const win2 = new THREE.Mesh(winGeo, Mat.glass);
  win2.position.set(2.5, 1.4, 3.52);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), Mat.glass);
  door.position.set(0, 1.2, 3.52);
  building.add(win1, win2, door);

  // Red Shop Awning
  const awning = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.3, 1.8), Mat.redTrim);
  awning.position.set(0, 2.5, 4.3);
  awning.rotation.x = 0.15;
  awning.castShadow = true;
  building.add(awning);

  // Rooftop AC Compressors & Ducts
  const ac1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), Mat.concrete);
  ac1.position.set(-2, 3.9, -1);
  ac1.castShadow = true;
  const ac2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 1.8), Mat.darkInk);
  ac2.position.set(2, 3.8, 1);
  ac2.castShadow = true;
  building.add(ac1, ac2);

  // Shop Interior Warm Glow Light (Night)
  shopInteriorLight = new THREE.PointLight(0xFFE5A0, 0, 12);
  shopInteriorLight.position.set(0, 2.0, 1.5);
  building.add(shopInteriorLight);
  nightLights.push({ light: shopInteriorLight, targetIntensity: 1.2 });

  diorama.add(building);

  // 5. Open-Air Roadside Price Totem Sign
  const totem = new THREE.Group();
  totem.position.set(-10, 0, 8);

  const totemPost = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.8), Mat.darkInk);
  totemPost.position.y = 2.6;
  totemPost.castShadow = true;
  totem.add(totemPost);

  const initialCanvas = updateTotemSign();
  totemSignTex = new THREE.CanvasTexture(initialCanvas);
  const signMat = new THREE.MeshBasicMaterial({ map: totemSignTex });
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.3), signMat);
  signBoard.position.set(0, 4.0, 0);
  signBoard.castShadow = true;
  totem.add(signBoard);

  totemGlowLight = new THREE.PointLight(0xFF4545, 0, 8);
  totemGlowLight.position.set(0, 4.0, 1.0);
  totem.add(totemGlowLight);
  nightLights.push({ light: totemGlowLight, targetIntensity: 0.8 });

  diorama.add(totem);

  // 6. Fuel Storage Tanks (Vertical Cylinders)
  const tankGroup = new THREE.Group();
  tankGroup.position.set(8.5, 0, -8.5);

  const tankSpecs = [
    { name: 'Benzin', x: -2.2, color: Mat.redTrim },
    { name: 'Dizel',  x: 0,    color: Mat.greenAccent },
    { name: 'LPG',    x: 2.2,  color: Mat.orangeAccent }
  ];

  tankSpecs.forEach(t => {
    const cylGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.6, 16);
    const cyl = new THREE.Mesh(cylGeo, Mat.metalTank);
    cyl.position.set(t.x, 2.0, 0);
    cyl.castShadow = true;

    const bandGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.5, 16);
    const band = new THREE.Mesh(bandGeo, t.color);
    band.position.set(t.x, 2.8, 0);

    const domeGeo = new THREE.SphereGeometry(0.9, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, Mat.metalTank);
    dome.position.set(t.x, 3.8, 0);

    tankGroup.add(cyl, band, dome);
  });

  const pipe = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.2, 0.2), Mat.chrome);
  pipe.position.set(0, 3.2, 1.1);
  tankGroup.add(pipe);

  diorama.add(tankGroup);

  // 7. Interactive Pump Islands
  pumpSlots.forEach(slot => {
    const pumpMesh = createPumpMesh(slot.id);
    pumpMesh.position.copy(slot.pos);
    slot.mesh = pumpMesh;
    diorama.add(pumpMesh);
  });

  // 8. 16-Bit Street Lamps with Night Emissive Glow
  const lamp1 = createStreetLamp();
  lamp1.position.set(-14, 0, 7.5);
  const lamp2 = createStreetLamp();
  lamp2.position.set(14, 0, 7.5);
  diorama.add(lamp1, lamp2);

  // 9. Flora: Voxel Flower Planters & Decorative Bushes
  const planter1 = createFlowerBox(3.6);
  planter1.position.set(-3.5, 0, -4.8);
  const planter2 = createFlowerBox(3.6);
  planter2.position.set(-9.5, 0, -4.8);
  diorama.add(planter1, planter2);

  // Perimeter Hedge Bushes
  const bushPositions = [
    [-18, 0, -18], [-12, 0, -18], [12, 0, -18], [18, 0, -18],
    [-19, 0, 14], [19, 0, 14], [-20, 0, -2], [20, 0, -2]
  ];
  bushPositions.forEach(bp => {
    const bush = createVoxelBush();
    bush.position.set(...bp);
    diorama.add(bush);
  });

  // 10. Station Furniture: Bench, Trash Can, Air/Water Tower, Fire Safety
  const bench = createParkBench();
  bench.position.set(11.5, 0, -5.5);
  bench.rotation.y = -Math.PI / 6;

  const trash = createTrashBin();
  trash.position.set(-11.5, 0, -4.8);

  const airWater = createAirWaterStation();
  airWater.position.set(-12.5, 0, 3.0);
  airWater.rotation.y = Math.PI / 4;

  const fireBox = createFireCabinet();
  fireBox.position.set(9.0, 0, -4.5);

  diorama.add(bench, trash, airWater, fireBox);

  // 11. Fauna: Sleeping Dog (Karabaş), Cat, Perched Birds
  dogMesh = createDogMesh();
  dogMesh.position.set(-2.0, 0.05, -4.8);
  diorama.add(dogMesh);

  catMesh = createCatMesh();
  catMesh.position.set(13.0, 0.05, -9.0);
  catMesh.rotation.y = -Math.PI / 4;
  diorama.add(catMesh);

  const bird1 = createBirdMesh();
  bird1.position.set(-10.5, 3.5, -5.2);
  const bird2 = createBirdMesh();
  bird2.position.set(15.0, 4.8, -5.5);
  birds.push(bird1, bird2);
  diorama.add(bird1, bird2);

  // 12. Floating 16-Bit Voxel Sky Clouds
  const cloudPositions = [
    [-18, 22, -14], [-6, 25, 6], [10, 21, -10], [22, 24, 12]
  ];
  cloudPositions.forEach(cp => {
    const cloud = createVoxelCloud();
    cloud.position.set(...cp);
    clouds.push(cloud);
    scene.add(cloud);
  });

  // 13. Perimeter Trees with Wind Sway
  const treePositions = [
    [-17, 0, -14], [-12, 0, -14], [-17, 0, 3], [-17, 0, -5],
    [16, 0, -14], [16, 0, -5], [16, 0, 3], [19, 0, -10],
    [-20, 0, 8], [20, 0, 8]
  ];
  treePositions.forEach((p, idx) => {
    const tree = createLowPolyTree(idx);
    tree.position.set(...p);
    diorama.add(tree);
  });

  // 14. Initialize Background Highway Bypass Traffic
  initBypassTraffic();

  scene.add(diorama);
}

// ---------------------------------------------------------
// Helper Creators for Props, Flora, Fauna & Street Furniture
// ---------------------------------------------------------

function createStreetLamp() {
  const lamp = new THREE.Group();

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.6, 8), Mat.lampPost);
  post.position.y = 2.3;
  post.castShadow = true;
  lamp.add(post);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.12), Mat.lampPost);
  arm.position.set(0.45, 4.4, 0);
  lamp.add(arm);

  const head = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.3, 8), Mat.lampPost);
  head.position.set(0.95, 4.25, 0);
  lamp.add(head);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), Mat.lampGlow);
  bulb.position.set(0.95, 4.15, 0);
  lamp.add(bulb);

  const light = new THREE.PointLight(0xFFE082, 0, 14);
  light.position.set(0.95, 4.0, 0);
  light.castShadow = false;
  lamp.add(light);

  nightLights.push({ light, bulb, targetIntensity: 1.4 });
  return lamp;
}

function createFlowerBox(length = 3.6) {
  const box = new THREE.Group();

  const planter = new THREE.Mesh(new THREE.BoxGeometry(length, 0.4, 0.6), Mat.planterWood);
  planter.position.y = 0.2;
  planter.castShadow = true;
  box.add(planter);

  const soil = new THREE.Mesh(new THREE.BoxGeometry(length - 0.1, 0.1, 0.5), Mat.dirt);
  soil.position.y = 0.38;
  box.add(soil);

  const colors = [Mat.flowerRed, Mat.flowerYellow, Mat.flowerPink];
  const count = Math.floor(length * 2.5);
  for (let i = 0; i < count; i++) {
    const x = -length / 2 + 0.3 + (i / count) * (length - 0.6) + (Math.random() * 0.1 - 0.05);
    const z = (Math.random() * 0.3 - 0.15);

    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.04), Mat.flowerStem);
    stem.position.set(x, 0.5, z);

    const bloom = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), colors[i % colors.length]);
    bloom.position.set(x, 0.65, z);
    bloom.castShadow = true;

    box.add(stem, bloom);
  }
  return box;
}

function createVoxelBush() {
  const bush = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), Mat.foliage);
  base.position.y = 0.6;
  base.castShadow = true;

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), Mat.foliageDark);
  top.position.y = 1.2;
  top.castShadow = true;

  bush.add(base, top);
  return bush;
}

function createParkBench() {
  const bench = new THREE.Group();

  // Iron legs
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.8), Mat.benchIron);
  leg1.position.set(-0.8, 0.3, 0);
  const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.8), Mat.benchIron);
  leg2.position.set(0.8, 0.3, 0);
  bench.add(leg1, leg2);

  // Wooden seat slats
  for (let z = -0.3; z <= 0.3; z += 0.2) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.14), Mat.benchWood);
    slat.position.set(0, 0.6, z);
    slat.castShadow = true;
    bench.add(slat);
  }

  // Wooden backrest slats
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

  // Sleeping body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.6), Mat.dogFur);
  body.position.set(0, 0.25, 0);
  body.castShadow = true;
  dog.add(body);

  // Head resting
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
  cloud.userData = { speed: 0.4 + Math.random() * 0.4 };
  return cloud;
}

function createLowPolyTree(id = 0) {
  const tree = new THREE.Group();
  tree.userData = { treeId: id };

  // Trunk
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.0, 0.7), Mat.wood);
  trunk.position.y = 1.0;
  trunk.castShadow = true;
  tree.add(trunk);

  // Foliage Crown Group for Wind Sway
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

// =========================================================
// 5. PROCEDURAL CAR VEHICLE GENERATOR & AI
// =========================================================

const CAR_COLORS = [0xD64545, 0x2F6FED, 0x27A05A, 0xE8862E, 0xF5EFE0, 0x1C242B];
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
    this.speed = 0.18;
    this.progress = 0;
  }

  buildMesh() {
    const car = new THREE.Group();

    // Body
    const carMat = new THREE.MeshLambertMaterial({ color: this.colorHex });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 3.4), carMat);
    body.position.y = 0.55;
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    // Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 1.8), Mat.glass);
    cabin.position.set(0, 1.05, -0.2);
    cabin.castShadow = true;
    car.add(cabin);

    // Wheels
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

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xFFF9C4 });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.6, 0.6, 1.71);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.6, 0.6, 1.71);
    car.add(hl1, hl2);

    // 3D Billboard Label for Fuel Request
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FAF6EC';
    ctx.fillRect(0, 0, 256, 80);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1C242B';
    ctx.strokeRect(3, 3, 250, 74);
    ctx.fillStyle = '#1C242B';
    ctx.font = 'bold 28px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`[ ${this.fuelType.toUpperCase()} ${this.reqLiters}L ]`, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.75, 1);
    sprite.position.set(0, 2.4, 0);
    car.add(sprite);

    // Start Position on highway
    car.position.set(-18, 0, 12);
    car.rotation.y = Math.PI / 2;
    return car;
  }

  update() {
    if (this.state === 'APPROACHING') {
      this.mesh.position.x += this.speed * State.timeSpeed;
      // Turn into pump area if slot available
      if (this.targetPumpSlot && this.mesh.position.x >= this.targetPumpSlot.pos.x - 2.5) {
        this.state = 'PARKING';
      } else if (this.mesh.position.x > 18) {
        this.destroy();
      }
    } else if (this.state === 'PARKING') {
      const targetZ = this.targetPumpSlot.pos.z + 1.8;
      const targetX = this.targetPumpSlot.pos.x;
      this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, targetX, 0.08 * State.timeSpeed);
      this.mesh.position.z = THREE.MathUtils.lerp(this.mesh.position.z, targetZ, 0.08 * State.timeSpeed);
      this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, 0, 0.08 * State.timeSpeed);

      if (Math.abs(this.mesh.position.x - targetX) < 0.1 && Math.abs(this.mesh.position.z - targetZ) < 0.1) {
        this.state = 'WAITING';
        this.targetPumpSlot.occupiedBy = this;
        showToast(`Araç #${this.targetPumpSlot.id + 1} pompasına yanaştı.`);
        sfx.playHonk();

        // If manager is hired, auto-service
        if (State.upgrades.hasManager) {
          setTimeout(() => autoServiceCar(this), 1200 / State.timeSpeed);
        }
      }
    } else if (this.state === 'DEPARTING') {
      this.mesh.position.z = THREE.MathUtils.lerp(this.mesh.position.z, 12, 0.06 * State.timeSpeed);
      this.mesh.position.x += this.speed * 1.2 * State.timeSpeed;
      this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, Math.PI / 2, 0.08 * State.timeSpeed);

      if (this.mesh.position.x > 19) {
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
  // Find open pump
  const availableSlots = pumpSlots.slice(0, State.upgrades.pumps).filter(s => !s.occupiedBy);
  const randomFuel = FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)];
  const randomColor = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];

  const car = new Vehicle('sedan', randomFuel, randomColor);
  if (availableSlots.length > 0) {
    car.targetPumpSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
    car.targetPumpSlot.occupiedBy = car; // reserve
  }
  cars.push(car);
  scene.add(car.mesh);
}

// Spawner Loop
let spawnTimer = 0;
function updateSpawner(delta) {
  spawnTimer += delta * State.timeSpeed;
  if (spawnTimer >= 5.5) {
    spawnTimer = 0;
    if (cars.length < 5) {
      spawnCar();
    }
  }
}

// =========================================================
// 6. INTERACTIVE RAYCASTING & CLICK HANDLERS
// =========================================================

function onCanvasClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  for (let hit of intersects) {
    let curr = hit.object;
    while (curr) {
      if (curr.userData && curr.userData.isPump !== undefined) {
        openPumpServiceForSlot(curr.userData.pumpId);
        return;
      }
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
  const dPfx = 'D';
  const lPfx = 'L';
  sctx.fillText(`${bPfx} ₺${bP}`, 128, 130);
  sctx.fillText(`${dPfx} ₺${dP}`, 128, 170);
  sctx.fillText(`${lPfx} ₺${lP}`, 128, 210);

  if (totemSignTex) {
    totemSignTex.image = signCanvas;
    totemSignTex.needsUpdate = true;
  }
  return signCanvas;
}

function openPumpServiceForSlot(pumpId) {
  const slot = pumpSlots[pumpId];
  if (!slot) return;
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

    State.pumpedLiters += 1.5;
    fuel.current = Math.max(0, fuel.current - 1.5);
    State.pumpedCost = State.pumpedLiters * unitPrice;
    sfx.playPumpTick();
    updatePumpModalLCD();
    updateHUD();

    // Check stop condition
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
  State.money += State.pumpedCost;
  State.totalRev += State.pumpedCost;
  State.totalCars += 1;

  // Car wash bonus if unlocked
  if (State.upgrades.hasCarWash) {
    State.money += 80;
    State.totalRev += 80;
  }

  showToast(t('toast_collected', State.pumpedCost.toFixed(2)));
  sfx.playCoin();

  car.state = 'DEPARTING';
  State.activePump.occupiedBy = null;
  State.activeCar = null;
  closePumpModal();
  updateHUD();
}

function applyWindshieldWash() {
  State.money += 25;
  showToast(t('toast_tip'));
  sfx.playCoin();
  updateHUD();
}

function autoServiceCar(car) {
  if (car.state !== 'WAITING') return;
  const fuel = State.tanks[car.fuelType];
  const liters = Math.min(car.reqLiters, fuel.current);
  const cost = liters * fuel.price;

  fuel.current = Math.max(0, fuel.current - liters);
  State.money += cost;
  State.totalRev += cost;
  State.totalCars += 1;

  showToast(t('toast_mgr', car.targetPumpSlot.id + 1, cost.toFixed(0)));
  sfx.playCoin();
  car.state = 'DEPARTING';
  car.targetPumpSlot.occupiedBy = null;
  updateHUD();
}

function updatePumpModalLCD() {
  document.getElementById('lcd-liters').textContent = `${State.pumpedLiters.toFixed(1)} L`;
  document.getElementById('lcd-cost').textContent = `₺ ${State.pumpedCost.toFixed(2)}`;
}

// =========================================================
// 7. UPGRADES, TANKER ORDERS & OFFICE LOGIC
// =========================================================

function toggleModal(modalId, open) {
  const m = document.getElementById(modalId);
  if (open) m.classList.remove('hidden');
  else m.classList.add('hidden');
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

function buyPumpUpgrade() {
  if (State.upgrades.pumps >= 4) {
    showToast(t('toast_max_pumps'));
    return;
  }
  if (State.money < 6000) {
    showToast(t('toast_insufficient_funds', '6.000'), 'error');
    return;
  }
  State.money -= 6000;
  State.upgrades.pumps += 1;
  document.getElementById('upgrade-pump-count').textContent = State.upgrades.pumps;
  showToast(t('toast_pump_built', State.upgrades.pumps));
  sfx.playCoin();
  updateHUD();
}

function buyWashUpgrade() {
  if (State.upgrades.hasCarWash) return;
  if (State.money < 12000) {
    showToast(t('toast_insufficient_funds', '12.000'), 'error');
    return;
  }
  State.money -= 12000;
  State.upgrades.hasCarWash = true;
  document.getElementById('btn-buy-wash').textContent = t('btn_bought');
  document.getElementById('btn-buy-wash').disabled = true;
  showToast(t('toast_wash_active'));
  sfx.playCoin();
  updateHUD();
}

function buySolarUpgrade() {
  if (State.upgrades.hasSolar) return;
  if (State.money < 8500) {
    showToast(t('toast_insufficient_funds', '8.500'), 'error');
    return;
  }
  State.money -= 8500;
  State.upgrades.hasSolar = true;
  document.getElementById('btn-buy-solar').textContent = t('btn_bought');
  document.getElementById('btn-buy-solar').disabled = true;
  showToast(t('toast_solar_built'));
  sfx.playCoin();
  updateHUD();
}

function buyManagerUpgrade() {
  if (State.upgrades.hasManager) return;
  if (State.money < 15000) {
    showToast(t('toast_insufficient_funds', '15.000'), 'error');
    return;
  }
  State.money -= 15000;
  State.upgrades.hasManager = true;
  document.getElementById('btn-buy-manager').textContent = t('btn_working');
  document.getElementById('btn-buy-manager').disabled = true;
  showToast(t('toast_mgr_hired'));
  sfx.playCoin();
  updateHUD();
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
// 8. BACKGROUND HIGHWAY TRAFFIC & 16-BIT PARTICLES
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
      // Commuter Bus
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 5.0), bodyMat);
      body.position.y = 1.0;
      body.castShadow = true;
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.4, 4.4), Mat.glass);
      win.position.set(0, 1.3, 0);
      group.add(body, win);
    }

    // Wheels
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
    this.speed = 10 + Math.random() * 8; // units per sec
    this.mesh.position.set(-28 - Math.random() * 15, 0, 13.4);
    this.mesh.rotation.y = Math.PI / 2;
  }

  update(delta) {
    this.mesh.position.x += this.speed * delta;
    if (this.mesh.position.x > 28) {
      this.reset();
    }
  }
}

function initBypassTraffic() {
  for (let i = 0; i < 3; i++) {
    const bgCar = new BypassVehicle();
    bgCar.mesh.position.x = -24 + i * 18;
    bgVehicles.push(bgCar);
  }
}

function updateBypassTraffic(delta) {
  bgVehicles.forEach(v => v.update(delta));
}

// 16-Bit Smoke & Vapor Particle System
function spawnParticle(pos, colorHex = 0xDCD6C8, scale = 0.25) {
  if (particles.length > 40) return; // budget limit
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

// Cloud Drift Animation
function updateClouds(delta) {
  clouds.forEach(c => {
    c.position.x += c.userData.speed * delta;
    if (c.position.x > 32) {
      c.position.x = -32;
    }
  });
}

// Wind Foliage Sway & Animal Micro-Animations
let lastBirdSoundTime = 0;
let lastCricketSoundTime = 0;

function updateWindAndCreatures(delta, time) {
  // Tree Foliage Wind Sway
  animatedTrees.forEach(t => {
    if (t.userData.crown) {
      t.userData.crown.rotation.z = Math.sin(time * 2.2 + t.userData.treeId) * 0.035;
      t.userData.crown.rotation.x = Math.cos(time * 1.8 + t.userData.treeId) * 0.025;
    }
  });

  // Sleeping Dog Breathing
  if (dogMesh) {
    const breath = 1.0 + Math.sin(time * 2.8) * 0.04;
    dogMesh.scale.set(1.0, breath, 1.0);
  }

  // Cat Tail Sway
  if (catMesh && catMesh.userData.tail) {
    catMesh.userData.tail.rotation.z = Math.sin(time * 4.0) * 0.15;
  }

  // Perched Birds subtle head twist
  birds.forEach((b, idx) => {
    if (b.userData.head && Math.sin(time * 0.8 + idx * 3.0) > 0.85) {
      b.userData.head.rotation.y = (Math.sin(time * 6.0) > 0 ? 0.3 : -0.3);
    }
  });

  // Ambient Web Audio Chimes
  const h = State.hour;
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
// 9. DAY/NIGHT SIMULATION & ADVANCED 4-PHASE LIGHTING
// =========================================================

let clockAccum = 0;
function updateDayNightCycle(delta) {
  clockAccum += delta * State.timeSpeed;
  if (clockAccum >= 1.0) { // 1 sec = 1 min
    clockAccum = 0;
    State.minute += 1;
    if (State.minute >= 60) {
      State.minute = 0;
      State.hour += 1;
      if (State.hour >= 24) {
        State.hour = 0;
        State.day += 1;
        showToast(t('toast_new_day', State.day));
      }
    }
    updateHUD();
    updateSkyLighting();
  }
}

function updateSkyLighting() {
  const h = State.hour;
  let skyColor, sunColor, sunEnergy;
  let nightAlpha = 0.0; // 0 = day, 1 = full night

  if (h >= 21 || h < 5) {
    // Phase 4: Night (21:00 - 05:00)
    skyColor = new THREE.Color(0x111722);
    sunColor = new THREE.Color(0x5A6B8C);
    sunEnergy = 0.3;
    ambientLight.intensity = 0.35;
    nightAlpha = 1.0;
  } else if (h >= 5 && h < 8) {
    // Phase 1: Dawn / Sunrise (05:00 - 08:00)
    skyColor = new THREE.Color(0xF4B991);
    sunColor = new THREE.Color(0xFFA07A);
    sunEnergy = 0.9;
    ambientLight.intensity = 0.6;
    nightAlpha = 0.2;
  } else if (h >= 8 && h < 18) {
    // Phase 2: High Daytime (08:00 - 18:00)
    skyColor = new THREE.Color(0xBFD8E3);
    sunColor = new THREE.Color(0xFFFBF0);
    sunEnergy = 1.2;
    ambientLight.intensity = 0.75;
    nightAlpha = 0.0;
  } else {
    // Phase 3: Sunset / Dusk (18:00 - 21:00)
    skyColor = new THREE.Color(0xDE7A52);
    sunColor = new THREE.Color(0xF77F00);
    sunEnergy = 0.75;
    ambientLight.intensity = 0.55;
    nightAlpha = (h - 18) / 3.0;
  }

  scene.background.lerp(skyColor, 0.08);
  sunLight.color.lerp(sunColor, 0.08);
  sunLight.intensity = THREE.MathUtils.lerp(sunLight.intensity, sunEnergy, 0.08);

  // Smoothly fade Street Lamps and Shop Glow
  nightLights.forEach(nl => {
    const target = nightAlpha * nl.targetIntensity;
    nl.light.intensity = THREE.MathUtils.lerp(nl.light.intensity, target, 0.08);
    if (nl.bulb && nl.bulb.material) {
      if (nightAlpha > 0.4) {
        nl.bulb.material.color.setHex(0xFFE580);
      } else {
        nl.bulb.material.color.setHex(0x555544);
      }
    }
  });
}

function updateHUD() {
  document.getElementById('stat-money').textContent = `₺ ${State.money.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  document.getElementById('stat-day').textContent = State.day;
  const mm = State.minute.toString().padStart(2, '0');
  const hh = State.hour.toString().padStart(2, '0');
  document.getElementById('stat-clock').textContent = `${hh}:${mm}`;
  document.getElementById('stat-rep').textContent = `${State.rep.toFixed(1)} / 5.0`;

  // Fuel gauges
  ['benzin', 'dizel', 'lpg', 'ev'].forEach(k => {
    const f = State.tanks[k];
    const pct = Math.round((f.current / f.max) * 100);
    const bar = document.getElementById(`bar-${k}`);
    const lbl = document.getElementById(`gauge-val-${k}`);
    if (bar) bar.style.width = `${pct}%`;
    if (lbl) lbl.textContent = `${pct}%`;
  });

  // Office stats
  const revEl = document.getElementById('stat-total-rev');
  if (revEl) revEl.textContent = `₺ ${State.totalRev.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  const carEl = document.getElementById('stat-total-cars');
  if (carEl) carEl.textContent = State.totalCars;
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
// 10. ANIMATION & RENDER LOOP
// =========================================================

let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;
  const totalSeconds = now * 0.001;

  // Clamp camera orbit controls target around the center to keep diorama perfectly framed
  controls.target.set(0, 0, 0);
  controls.update();

  updateDayNightCycle(delta);
  updateSpawner(delta);
  updateClouds(delta);
  updateBypassTraffic(delta);
  updateParticles(delta);
  updateWindAndCreatures(delta, totalSeconds);

  // Update all station vehicles
  for (let i = cars.length - 1; i >= 0; i--) {
    cars[i].update();
    // Spawn subtle exhaust puff when car is moving
    if (cars[i].state === 'APPROACHING' || cars[i].state === 'DEPARTING') {
      if (Math.random() < 0.15) {
        spawnParticle(cars[i].mesh.position, 0xB0B8C0, 0.2);
      }
    }
  }

  renderer.render(scene, camera);
}

// Start Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  updateI18nDOM();
  updateHUD();
  updateOrderModalStatus();
  showToast(t('toast_welcome'));
});
