/**
 * BENELOIL 3D - 16-BIT LOW-POLY NEO-BRUTALIST WEBGL ENGINE
 * Powered by Three.js & Web Audio API
 */

// =========================================================
// 1. GAME STATE & SIMULATION CONSTANTS
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
}
const sfx = new SoundFX();

// =========================================================
// 3. THREE.JS 3D SCENE SETUP
// =========================================================

let scene, camera, renderer, controls;
let sunLight, ambientLight;
const cars = [];
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
  const d = 16;
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(24, 22, 24);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minPolarAngle = Math.PI / 6;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Lights
  ambientLight = new THREE.AmbientLight(0xEAECEF, 0.7);
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0xFFFBF0, 1.1);
  sunLight.position.set(16, 28, 16);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 100;
  const shadowDist = 22;
  sunLight.shadow.camera.left = -shadowDist;
  sunLight.shadow.camera.right = shadowDist;
  sunLight.shadow.camera.top = shadowDist;
  sunLight.shadow.camera.bottom = -shadowDist;
  scene.add(sunLight);

  // Build Environment
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
  const d = 16;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// =========================================================
// 4. 16-BIT LOW-POLY DIORAMA BUILDER
// =========================================================

// Shared Flat Materials
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
  chrome: new THREE.MeshLambertMaterial({ color: 0xA8B2BC })
};

function buildDiorama() {
  const diorama = new THREE.Group();

  // 1. Base Terrain Grass
  const grassGeo = new THREE.BoxGeometry(34, 1.5, 34);
  const grassMesh = new THREE.Mesh(grassGeo, Mat.grass);
  grassMesh.position.y = -0.75;
  grassMesh.receiveShadow = true;
  diorama.add(grassMesh);

  // Dirt base underneath
  const dirtGeo = new THREE.BoxGeometry(34, 2, 34);
  const dirtMesh = new THREE.Mesh(dirtGeo, Mat.dirt);
  dirtMesh.position.y = -2.5;
  diorama.add(dirtMesh);

  // 2. Asphalt Highway Road (Forefront)
  const roadGeo = new THREE.BoxGeometry(34, 0.05, 7);
  const roadMesh = new THREE.Mesh(roadGeo, Mat.asphalt);
  roadMesh.position.set(0, 0.03, 11.5);
  roadMesh.receiveShadow = true;
  diorama.add(roadMesh);

  // Double Yellow Lines on Highway
  for (let i = -15; i <= 15; i += 3) {
    const lineGeo = new THREE.BoxGeometry(1.8, 0.02, 0.15);
    const line1 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    line1.position.set(i, 0.06, 11.35);
    const line2 = new THREE.Mesh(lineGeo, Mat.roadYellow);
    line2.position.set(i, 0.06, 11.65);
    diorama.add(line1, line2);
  }

  // 3. Station Concrete Forecourt
  const forecourtGeo = new THREE.BoxGeometry(26, 0.08, 16);
  const forecourt = new THREE.Mesh(forecourtGeo, Mat.concrete);
  forecourt.position.set(0, 0.04, 1);
  forecourt.receiveShadow = true;
  diorama.add(forecourt);

  // 4. BenelOil 2-Story Main Building (Shop & Office)
  const building = new THREE.Group();
  building.position.set(-6.5, 0, -8.5);

  // Ground Floor
  const bldgBase = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 7), Mat.buildingWall);
  bldgBase.position.y = 1.6;
  bldgBase.castShadow = true;
  bldgBase.receiveShadow = true;
  building.add(bldgBase);

  // Top Floor / Roof parapet
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

  diorama.add(building);

  // 5. Large Steel Canopy (Over Pump Island)
  const canopy = new THREE.Group();
  canopy.position.set(0, 0, 1);

  // 4 Pillars
  const pillarGeo = new THREE.BoxGeometry(0.5, 4.5, 0.5);
  const pillarPositions = [
    [-6, 2.25, -3], [6, 2.25, -3],
    [-6, 2.25, 4.5], [6, 2.25, 4.5]
  ];
  pillarPositions.forEach(p => {
    const pillar = new THREE.Mesh(pillarGeo, Mat.concrete);
    pillar.position.set(...p);
    pillar.castShadow = true;
    canopy.add(pillar);

    // Pillar red base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), Mat.redTrim);
    base.position.set(p[0], 0.3, p[2]);
    canopy.add(base);
  });

  // Canopy Roof Deck
  const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(15, 0.6, 11), Mat.buildingWall);
  canopyRoof.position.y = 4.6;
  canopyRoof.castShadow = true;
  canopy.add(canopyRoof);

  // Canopy Red Fascia Band
  const canopyTrim = new THREE.Mesh(new THREE.BoxGeometry(15.4, 0.5, 11.4), Mat.redTrim);
  canopyTrim.position.y = 4.7;
  canopy.add(canopyTrim);

  // 3D "PIXELOIL" Front Billboard
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const sctx = signCanvas.getContext('2d');
  sctx.fillStyle = '#D64545';
  sctx.fillRect(0, 0, 512, 128);
  sctx.lineWidth = 6;
  sctx.strokeStyle = '#1C242B';
  sctx.strokeRect(4, 4, 504, 120);
  sctx.fillStyle = '#FAF6EC';
  sctx.font = 'bold 56px Plus Jakarta Sans, sans-serif';
  sctx.textAlign = 'center';
  sctx.textBaseline = 'middle';
  sctx.fillText('⛽ PIXELOIL', 256, 64);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshBasicMaterial({ map: signTex });
  const signBack = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.3, 0.2), signMat);
  signBack.position.set(0, 5.5, 5.7);
  signBack.castShadow = true;
  canopy.add(signBack);

  // Station Canopy Under-Lights
  const lightGeo = new THREE.BoxGeometry(2, 0.1, 1);
  const uLight1 = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xFFFFF0 }));
  uLight1.position.set(-3.5, 4.25, 1);
  const uLight2 = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xFFFFF0 }));
  uLight2.position.set(3.5, 4.25, 1);
  canopy.add(uLight1, uLight2);

  diorama.add(canopy);

  // 6. Fuel Storage Tanks (Vertical Cylinders)
  const tankGroup = new THREE.Group();
  tankGroup.position.set(8.5, 0, -8.5);

  const tankSpecs = [
    { name: 'Benzin', x: -2.2, color: Mat.redTrim },
    { name: 'Dizel',  x: 0,    color: Mat.greenAccent },
    { name: 'LPG',    x: 2.2,  color: Mat.orangeAccent }
  ];

  tankSpecs.forEach(t => {
    // Tank Body
    const cylGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.6, 16);
    const cyl = new THREE.Mesh(cylGeo, Mat.metalTank);
    cyl.position.set(t.x, 2.0, 0);
    cyl.castShadow = true;

    // Colored Band
    const bandGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.5, 16);
    const band = new THREE.Mesh(bandGeo, t.color);
    band.position.set(t.x, 2.8, 0);

    // Tank Roof Dome
    const domeGeo = new THREE.SphereGeometry(0.9, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, Mat.metalTank);
    dome.position.set(t.x, 3.8, 0);

    tankGroup.add(cyl, band, dome);
  });

  // Connecting Pipe
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

  // 8. Perimeter Trees (Low-Poly 16-Bit Voxel)
  const treePositions = [
    [-13, 0, -13], [-9, 0, -13], [-14, 0, 4], [-14, 0, -4],
    [13, 0, -13], [13, 0, -5], [13, 0, 4]
  ];
  treePositions.forEach(p => {
    const tree = createLowPolyTree();
    tree.position.set(...p);
    diorama.add(tree);
  });

  scene.add(diorama);
}

function createPumpMesh(id) {
  const pump = new THREE.Group();
  pump.userData = { isPump: true, pumpId: id };

  // Concrete Island Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 4.2), Mat.concrete);
  base.position.y = 0.125;
  base.receiveShadow = true;
  pump.add(base);

  // Dispenser Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 1.4), Mat.buildingWall);
  body.position.y = 1.05;
  body.castShadow = true;
  body.userData = { isPump: true, pumpId: id };
  pump.add(body);

  // Red Side Trim
  const side1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.85, 0.2), Mat.redTrim);
  side1.position.set(0, 1.05, -0.65);
  const side2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.85, 0.2), Mat.redTrim);
  side2.position.set(0, 1.05, 0.65);
  pump.add(side1, side2);

  // Glowing LCD Screen
  const lcd = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.45, 0.7), new THREE.MeshBasicMaterial({ color: 0x0C1610 }));
  lcd.position.set(0, 1.3, 0);
  pump.add(lcd);

  return pump;
}

function createLowPolyTree() {
  const tree = new THREE.Group();
  // Trunk
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.6), Mat.wood);
  trunk.position.y = 0.9;
  trunk.castShadow = true;
  tree.add(trunk);

  // Foliage Stepped Cones
  const l1 = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.8, 5), Mat.foliage);
  l1.position.y = 2.0;
  l1.castShadow = true;

  const l2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.6, 5), Mat.foliageDark);
  l2.position.y = 3.0;
  l2.castShadow = true;

  const l3 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.3, 5), Mat.foliage);
  l3.position.y = 4.0;
  l3.castShadow = true;

  tree.add(l1, l2, l3);
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
    ctx.fillText(`⛽ ${this.fuelType.toUpperCase()} ${this.reqLiters}L`, 128, 40);

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
        showToast(`🚗 Araç #${this.targetPumpSlot.id + 1} pompasına yanaştı.`);
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
    title.textContent = `🚗 Araç · ${c.fuelType.toUpperCase()} (Pompa #${pumpId + 1})`;
    btnStart.classList.remove('hidden');
    btnFinish.classList.add('hidden');
  } else {
    title.textContent = `⛽ Pompa #${pumpId + 1} (Bekleyen Araç Yok)`;
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
  showToast(`Hedef dolum: ${target === 'FULL' ? 'FULLE' : target + ' ₺'}`);
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
      showToast(`⚠️ Depoda ${car.fuelType.toUpperCase()} kalmadı!`, 'error');
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

  showToast(`💰 +₺${State.pumpedCost.toFixed(2)} tahsil edildi!`);
  sfx.playCoin();

  car.state = 'DEPARTING';
  State.activePump.occupiedBy = null;
  State.activeCar = null;
  closePumpModal();
  updateHUD();
}

function applyWindshieldWash() {
  State.money += 25;
  showToast('✨ Camlar silindi! +₺25 Bahşiş kazanıldı.');
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

  showToast(`👔 Müdür Pompa #${car.targetPumpSlot.id + 1}'i doldurdu (+₺${cost.toFixed(0)})`);
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
  showToast(`⏩ Zaman hızı: ${State.timeSpeed}x`);
});

function buyPumpUpgrade() {
  if (State.upgrades.pumps >= 4) {
    showToast('Maksimum pompa sayısına ulaşıldı (4).');
    return;
  }
  if (State.money < 6000) {
    showToast('Yetersiz bakiye! (Gereken: ₺6.000)', 'error');
    return;
  }
  State.money -= 6000;
  State.upgrades.pumps += 1;
  document.getElementById('upgrade-pump-count').textContent = State.upgrades.pumps;
  showToast(`🏗️ Pompa #${State.upgrades.pumps} inşa edildi!`);
  sfx.playCoin();
  updateHUD();
}

function buyWashUpgrade() {
  if (State.upgrades.hasCarWash) return;
  if (State.money < 12000) {
    showToast('Yetersiz bakiye! (Gereken: ₺12.000)', 'error');
    return;
  }
  State.money -= 12000;
  State.upgrades.hasCarWash = true;
  document.getElementById('btn-buy-wash').textContent = 'ALINDI';
  document.getElementById('btn-buy-wash').disabled = true;
  showToast('✨ Otomatik Oto Yıkama aktif edildi (+₺80/araç)!');
  sfx.playCoin();
  updateHUD();
}

function buySolarUpgrade() {
  if (State.upgrades.hasSolar) return;
  if (State.money < 8500) {
    showToast('Yetersiz bakiye! (Gereken: ₺8.500)', 'error');
    return;
  }
  State.money -= 8500;
  State.upgrades.hasSolar = true;
  document.getElementById('btn-buy-solar').textContent = 'ALINDI';
  document.getElementById('btn-buy-solar').disabled = true;
  showToast('☀️ Çatı GES kuruldu! Gündüz elektrik faturası ₺0.');
  sfx.playCoin();
  updateHUD();
}

function buyManagerUpgrade() {
  if (State.upgrades.hasManager) return;
  if (State.money < 15000) {
    showToast('Yetersiz bakiye! (Gereken: ₺15.000)', 'error');
    return;
  }
  State.money -= 15000;
  State.upgrades.hasManager = true;
  document.getElementById('btn-buy-manager').textContent = 'ÇALIŞIYOR';
  document.getElementById('btn-buy-manager').disabled = true;
  showToast('👔 İstasyon Müdürü göreve başladı! Dolumlar otomatik.');
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
    showToast(`Yetersiz bakiye! (Gereken: ₺${totalCost.toLocaleString()})`, 'error');
    return;
  }
  if (fuel.current + qty > fuel.max) {
    showToast(`Depo kapasitesi aşılıyor! (Boş yer: ${fuel.max - fuel.current} L)`);
    return;
  }

  State.money -= totalCost;
  fuel.current += qty;
  showToast(`🚚 ${qty}L ${fuelKey.toUpperCase()} tankeri ikmal yaptı!`);
  sfx.playCoin();
  updateHUD();
  updateOrderModalStatus();
}

function updateOrderModalStatus() {
  ['benzin', 'dizel', 'lpg'].forEach(k => {
    const f = State.tanks[k];
    const el = document.getElementById(`order-tank-${k}`);
    if (el) el.textContent = `Depo: ${f.current.toFixed(0)}/${f.max} L`;
  });
}

function adjustPrice(fuelKey, delta) {
  const f = State.tanks[fuelKey];
  f.price = Math.max(f.cost + 1, Math.min(80, f.price + delta));
  document.getElementById(`tariff-${fuelKey}`).textContent = `₺ ${f.price.toFixed(2)}`;
  showToast(`🏷️ ${fuelKey.toUpperCase()} tarifesi güncellendi: ₺${f.price.toFixed(2)}`);
}

// =========================================================
// 8. DAY/NIGHT SIMULATION & HUD UPDATE
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
        showToast(`🌅 GÜN ${State.day} BAŞLADI!`);
      }
    }
    updateHUD();
    updateSkyLighting();
  }
}

function updateSkyLighting() {
  const h = State.hour;
  let skyColor, sunColor, sunEnergy;

  if (h >= 21 || h < 5) {
    // Night
    skyColor = new THREE.Color(0x131B24);
    sunColor = new THREE.Color(0x5A6B8C);
    sunEnergy = 0.35;
    ambientLight.intensity = 0.4;
  } else if (h >= 5 && h < 8) {
    // Sunrise
    skyColor = new THREE.Color(0xF0BE88);
    sunColor = new THREE.Color(0xFFA07A);
    sunEnergy = 0.85;
    ambientLight.intensity = 0.6;
  } else if (h >= 8 && h < 18) {
    // Daytime
    skyColor = new THREE.Color(0xBFD8E3);
    sunColor = new THREE.Color(0xFFFBF0);
    sunEnergy = 1.15;
    ambientLight.intensity = 0.7;
  } else {
    // Sunset
    skyColor = new THREE.Color(0xDE8255);
    sunColor = new THREE.Color(0xF77F00);
    sunEnergy = 0.75;
    ambientLight.intensity = 0.55;
  }

  scene.background.lerp(skyColor, 0.1);
  sunLight.color.lerp(sunColor, 0.1);
  sunLight.intensity = THREE.MathUtils.lerp(sunLight.intensity, sunEnergy, 0.1);
}

function updateHUD() {
  document.getElementById('stat-money').textContent = `₺ ${State.money.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  document.getElementById('stat-day').textContent = State.day;
  const mm = State.minute.toString().padStart(2, '0');
  const hh = State.hour.toString().padStart(2, '0');
  document.getElementById('stat-clock').textContent = `${hh}:${mm}`;
  document.getElementById('stat-rep').textContent = `★ ${State.rep.toFixed(1)}`;

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
// 9. ANIMATION & RENDER LOOP
// =========================================================

let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  controls.update();
  updateDayNightCycle(delta);
  updateSpawner(delta);

  // Update all vehicles
  for (let i = cars.length - 1; i >= 0; i--) {
    cars[i].update();
  }

  renderer.render(scene, camera);
}

// Start Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  updateHUD();
  updateOrderModalStatus();
  showToast('⛽ PixelOil 3D İstasyonuna Hoş Geldiniz!');
});
