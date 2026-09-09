/**
 * ThreeMart - 3D Isometric Mini-Mart World Engine
 * Low-Poly Faceted 8-Bit Neo-Brutalist Aesthetic
 * Modular, fully editable and extensible
 * Strictly ZERO Emojis Used
 */

import * as THREE from 'three';
import { GAME_CONFIG } from './mart-config.js';
import { sound } from './sound-effects.js';
import { CustomerManager } from './customer-ai.js';

export class ThreeMart {
  constructor(canvas, state, joystick) {
    this.canvas = canvas;
    this.state = state;
    this.joystick = joystick;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);

    // Isometric perspective camera (45 deg angle)
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    this.cameraOffset = new THREE.Vector3(14, 18, 16);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Collections & State
    this.textSprites = [];
    this.cashDrops = [];
    this.clock = new THREE.Clock();
    this.stackWobble = { angleX: 0, angleZ: 0, velX: 0, velZ: 0 };
    this.lastPlayerPos = new THREE.Vector3();

    // Initialize World
    this.initLights();
    this.initWorldGround();
    this.initStoreWalls();
    this.initGardenPlants();
    this.initChickenCoop();
    this.initShelves();
    this.initCheckoutCounter();
    this.initUnlockPads();
    this.initPlayer();
    this.initHelperWorker();

    // Customer System
    this.customerManager = new CustomerManager(this.scene, this.state, this);

    // Window resize
    window.addEventListener('resize', () => this.onResize());

    // Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xfff7ed, 1.25);
    sun.position.set(18, 28, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 70;
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 22;
    sun.shadow.camera.bottom = -22;
    sun.shadow.bias = -0.001;
    this.scene.add(sun);
  }

  initWorldGround() {
    // 1. Garden & Farm Zone (Outside ground)
    const gardenGroundGeo = new THREE.BoxGeometry(16, 0.4, 24);
    const gardenGroundMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.grass,
      roughness: 0.8,
      flatShading: true
    });
    const gardenGround = new THREE.Mesh(gardenGroundGeo, gardenGroundMat);
    gardenGround.position.set(11, -0.2, 0);
    gardenGround.receiveShadow = true;
    this.scene.add(gardenGround);

    // Tomato Soil Bed
    const soilGeo = new THREE.BoxGeometry(9, 0.5, 11);
    const soilMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.soil,
      roughness: 0.9,
      flatShading: true
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(10.5, -0.1, -4);
    soil.receiveShadow = true;
    this.scene.add(soil);

    // Tahta kiriş çerçevesi
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7, flatShading: true });
    const beamX = new THREE.BoxGeometry(9.6, 0.4, 0.4);
    const beamZ = new THREE.BoxGeometry(0.4, 0.4, 11.6);
    const b1 = new THREE.Mesh(beamX, beamMat); b1.position.set(10.5, 0.2, 1.6);
    const b2 = new THREE.Mesh(beamX, beamMat); b2.position.set(10.5, 0.2, -9.6);
    const b3 = new THREE.Mesh(beamZ, beamMat); b3.position.set(5.9, 0.2, -4);
    const b4 = new THREE.Mesh(beamZ, beamMat); b4.position.set(15.1, 0.2, -4);
    this.scene.add(b1, b2, b3, b4);

    // 2. Store Interior Floor
    const storeGroundGeo = new THREE.BoxGeometry(20, 0.4, 24);
    const storeGroundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      flatShading: true
    });
    const storeGround = new THREE.Mesh(storeGroundGeo, storeGroundMat);
    storeGround.position.set(-7, -0.2, 0);
    storeGround.receiveShadow = true;
    this.scene.add(storeGround);

    // Floor Checker / Grid Pattern overlay
    const gridHelper = new THREE.GridHelper(20, 20, 0x09090b, 0xe2e8f0);
    gridHelper.position.set(-7, 0.01, 0);
    this.scene.add(gridHelper);

    // Sınır Çizgisi
    const divider = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x09090b })
    );
    divider.position.set(3, 0.2, 0);
    this.scene.add(divider);

    // Garden Label
    this.addFloatingLabel("DOMATES TARLASI", new THREE.Vector3(10.5, 3.2, -9.8), 0xf59e0b);
  }

  initStoreWalls() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, flatShading: true });
    const wallTrimMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });

    // Back wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 3.5, 0.6), wallMat);
    backWall.position.set(-7, 1.75, -12);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const topTrim = new THREE.Mesh(new THREE.BoxGeometry(20.2, 0.4, 0.8), wallTrimMat);
    topTrim.position.set(-7, 3.6, -12);
    this.scene.add(topTrim);

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.5, 24), wallMat);
    leftWall.position.set(-17, 1.75, 0);
    leftWall.castShadow = true;
    this.scene.add(leftWall);

    this.addFloatingLabel("MINI MART NEO", new THREE.Vector3(-7, 4.2, -11.5), 0x06b6d4);
  }

  initGardenPlants() {
    this.plants = [];
    const rows = 3;
    const cols = 2;
    const startX = 8.5;
    const startZ = -7.5;
    const spacingX = 4.0;
    const spacingZ = 3.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const plantGroup = new THREE.Group();
        const px = startX + c * spacingX;
        const pz = startZ + r * spacingZ;
        plantGroup.position.set(px, 0, pz);

        // Plant stem
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, 0.9, 6),
          new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true })
        );
        stem.position.y = 0.45;
        stem.castShadow = true;
        plantGroup.add(stem);

        // Leaves cluster
        const leaves = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.55, 0),
          new THREE.MeshStandardMaterial({ color: 0x22c55e, flatShading: true })
        );
        leaves.position.y = 0.95;
        leaves.castShadow = true;
        plantGroup.add(leaves);

        // Ripe Tomatoes
        const tomatoes = [];
        const tomOffsets = [
          new THREE.Vector3(-0.4, 0.85, 0.25),
          new THREE.Vector3(0.4, 0.95, -0.2),
          new THREE.Vector3(0, 1.15, 0.4)
        ];

        tomOffsets.forEach(offset => {
          const tom = this.createProduceMesh('tomato');
          tom.position.copy(offset);
          plantGroup.add(tom);
          tomatoes.push(tom);
        });

        this.scene.add(plantGroup);

        this.plants.push({
          group: plantGroup,
          tomatoes,
          isRipe: true,
          regrowTimer: 0,
          regrowDuration: GAME_CONFIG.items.tomato.growDuration,
          pos: new THREE.Vector3(px, 0, pz)
        });
      }
    }
  }

  initChickenCoop() {
    this.coopGroup = new THREE.Group();
    this.coopPos = new THREE.Vector3(10.5, 0, 7);
    this.coopGroup.position.copy(this.coopPos);

    // Coop House
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6, flatShading: true });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5, flatShading: true });

    const house = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.0, 3.2), woodMat);
    house.position.y = 1.0;
    house.castShadow = true;
    this.coopGroup.add(house);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1.4, 4), roofMat);
    roof.position.set(0, 2.7, 0);
    roof.rotation.y = Math.PI / 4;
    this.coopGroup.add(roof);

    // Chicken Nests (2 nests)
    this.nests = [];
    [-1.2, 1.2].forEach((offset, idx) => {
      const nest = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.6, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, flatShading: true })
      );
      nest.position.set(offset, 0.15, 2.2);
      this.coopGroup.add(nest);

      // Egg in nest
      const egg = this.createProduceMesh('egg');
      egg.position.set(offset, 0.4, 2.2);
      this.coopGroup.add(egg);

      this.nests.push({
        mesh: egg,
        hasEgg: true,
        timer: 0,
        pos: this.coopPos.clone().add(new THREE.Vector3(offset, 0, 2.2))
      });
    });

    this.coopGroup.visible = false; // Unlocked via Pad 2
    this.scene.add(this.coopGroup);

    this.coopLabel = this.addFloatingLabel("TAVUK KUMESI", this.coopPos.clone().add(new THREE.Vector3(0, 3.8, 0)), 0xf59e0b);
    this.coopLabel.visible = false;
  }

  createProduceMesh(type) {
    const group = new THREE.Group();
    if (type === 'tomato') {
      const geo = new THREE.BoxGeometry(0.36, 0.36, 0.36);
      const mat = new THREE.MeshStandardMaterial({
        color: GAME_CONFIG.items.tomato.color,
        roughness: 0.3,
        flatShading: true
      });
      const tomato = new THREE.Mesh(geo, mat);
      tomato.castShadow = true;
      group.add(tomato);

      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.08, 0.18),
        new THREE.MeshStandardMaterial({ color: GAME_CONFIG.items.tomato.capColor, flatShading: true })
      );
      cap.position.y = 0.2;
      group.add(cap);
    } else if (type === 'egg') {
      const geo = new THREE.BoxGeometry(0.32, 0.42, 0.32);
      const mat = new THREE.MeshStandardMaterial({
        color: GAME_CONFIG.items.egg.color,
        roughness: 0.2,
        flatShading: true
      });
      const egg = new THREE.Mesh(geo, mat);
      egg.castShadow = true;
      group.add(egg);
    }
    return group;
  }

  initShelves() {
    this.shelfEntities = [];

    // Shelf 1 (Tomato - Default Unlocked)
    this.shelfEntities.push(this.createShelfEntity(1, 'tomato', new THREE.Vector3(-5, 0, -4), true));

    // Shelf 2 (Tomato - Unlockable: 50 TL)
    this.shelfEntities.push(this.createShelfEntity(2, 'tomato', new THREE.Vector3(-11, 0, -4), false, 50));

    // Shelf 3 (Egg - Unlockable: 140 TL)
    this.shelfEntities.push(this.createShelfEntity(3, 'egg', new THREE.Vector3(-11, 0, 1.5), false, 140));

    this.updateShelfMeshes();
  }

  createShelfEntity(id, type, position, unlocked, cost = 0) {
    const group = new THREE.Group();
    group.position.copy(position);

    const standColor = type === 'tomato' ? 0x0284c7 : 0xd97706;
    const standMat = new THREE.MeshStandardMaterial({ color: standColor, roughness: 0.5, flatShading: true });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7, flatShading: true });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });

    // Stand Furniture
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 1.8), standMat);
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);

    const baseRim = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.2, 1.9), trimMat);
    baseRim.position.y = 0.1;
    group.add(baseRim);

    const tier1 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 1.6), woodMat);
    tier1.position.y = 0.8;
    group.add(tier1);

    const tier2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 1.4), woodMat);
    tier2.position.y = 1.45;
    group.add(tier2);

    const back = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 0.2), standMat);
    back.position.set(0, 1.0, -0.85);
    group.add(back);

    // Display slots
    const itemSlots = [];
    const maxItems = type === 'tomato' ? 12 : 8;
    const itemsPerTier = maxItems / 2;

    for (let tier = 0; tier < 2; tier++) {
      const y = tier === 0 ? 1.0 : 1.65;
      const z = tier === 0 ? 0.3 : 0.0;
      for (let i = 0; i < itemsPerTier; i++) {
        const x = -1.2 + i * (2.4 / (itemsPerTier - 1));
        const item = this.createProduceMesh(type);
        item.position.set(x, y, z);
        item.visible = false;
        group.add(item);
        itemSlots.push(item);
      }
    }

    group.visible = unlocked;
    this.scene.add(group);

    const typeTitle = type === 'tomato' ? 'DOMATES' : 'YUMURTA';
    const labelPos = position.clone().add(new THREE.Vector3(0, 2.8, 0));
    const labelSprite = this.addFloatingLabel(`RAF ${id} (${typeTitle})`, labelPos, standColor);

    return {
      id,
      type,
      group,
      position,
      itemSlots,
      unlocked,
      cost,
      labelSprite,
      customerStandPos: position.clone().add(new THREE.Vector3(0, 0, 1.6)),
      playerStockPos: position.clone().add(new THREE.Vector3(0, 0, 1.6))
    };
  }

  updateShelfMeshes() {
    this.shelfEntities.forEach(se => {
      const stateShelf = this.state.shelves.find(s => s.id === se.id);
      if (!stateShelf) return;

      se.group.visible = stateShelf.unlocked;
      if (se.labelSprite) {
        se.labelSprite.visible = stateShelf.unlocked;
        const name = se.type === 'tomato' ? 'DOMATES' : 'YUMURTA';
        this.updateFloatingLabelText(se.labelSprite, `RAF ${se.id} (${name}): ${stateShelf.items}/${stateShelf.maxItems}`);
      }

      se.itemSlots.forEach((slot, idx) => {
        slot.visible = idx < stateShelf.items;
      });
    });
  }

  initCheckoutCounter() {
    this.counterGroup = new THREE.Group();
    this.counterPos = new THREE.Vector3(-4, 0, 6.5);
    this.counterGroup.position.copy(this.counterPos);

    const deskMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5, flatShading: true });
    const topMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, flatShading: true });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });

    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.6), deskMat);
    desk.position.y = 0.6;
    desk.castShadow = true;
    this.counterGroup.add(desk);

    const top = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.15, 1.8), topMat);
    top.position.y = 1.25;
    this.counterGroup.add(top);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.4), blackMat);
    monitor.position.set(-0.6, 1.65, 0.2);
    this.counterGroup.add(monitor);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    screen.position.set(-0.6, 1.65, 0.41);
    this.counterGroup.add(screen);

    const conveyor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 1.2), blackMat);
    conveyor.position.set(0.8, 1.34, 0);
    this.counterGroup.add(conveyor);

    this.scene.add(this.counterGroup);

    this.registerCustomerPos = new THREE.Vector3(-4, 0, 8.8);
    this.registerPlayerPos = new THREE.Vector3(-4, 0, 4.6);

    // Automated Cashier Staff
    this.cashierNPC = this.createCharacterMesh(0x10b981, true);
    this.cashierNPC.position.copy(this.registerPlayerPos);
    this.cashierNPC.visible = false;
    this.scene.add(this.cashierNPC);

    this.addFloatingLabel("KASA ODEME ALANI", this.counterPos.clone().add(new THREE.Vector3(0, 2.6, 0)), 0x10b981);
  }

  initHelperWorker() {
    this.helperNPC = this.createCharacterMesh(0x8b5cf6, false);
    this.helperNPC.position.set(4, 0, -2);
    this.helperNPC.visible = false;
    this.scene.add(this.helperNPC);
    this.helperTarget = new THREE.Vector3(8.5, 0, -4);
    this.helperState = 'HARVEST';
  }

  createCharacterMesh(shirtColor, isCashier = false) {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.9, 0.45),
      new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5, flatShading: true })
    );
    body.position.y = 0.85;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6, flatShading: true })
    );
    head.position.y = 1.6;
    head.castShadow = true;
    group.add(head);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.2, 0.54),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, flatShading: true })
    );
    cap.position.y = 1.8;
    group.add(cap);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, flatShading: true });
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.24), legMat);
    leftLeg.position.set(-0.2, 0.28, 0);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.24), legMat);
    rightLeg.position.set(0.2, 0.28, 0);
    group.add(leftLeg, rightLeg);

    group.userData = { leftLeg, rightLeg, walkCycle: 0 };
    return group;
  }

  initUnlockPads() {
    this.unlockPads = [];

    // 1. Shelf 2 Pad
    this.unlockPads.push(this.createUnlockPad(
      'shelf_2',
      new THREE.Vector3(-11, 0, -1.8),
      GAME_CONFIG.unlocks.shelf2.cost,
      GAME_CONFIG.unlocks.shelf2.label,
      () => {
        const shelf = this.state.shelves.find(s => s.id === 2);
        if (shelf) shelf.unlocked = true;
        this.updateShelfMeshes();
      }
    ));

    // 2. Chicken Coop Pad
    this.unlockPads.push(this.createUnlockPad(
      'coop',
      new THREE.Vector3(7.5, 0, 7),
      GAME_CONFIG.unlocks.chickenCoop.cost,
      GAME_CONFIG.unlocks.chickenCoop.label,
      () => {
        this.state.unlockedCoop = true;
        this.coopGroup.visible = true;
        this.coopLabel.visible = true;
      }
    ));

    // 3. Egg Shelf Pad
    this.unlockPads.push(this.createUnlockPad(
      'shelf_egg',
      new THREE.Vector3(-11, 0, 3.8),
      GAME_CONFIG.unlocks.eggShelf.cost,
      GAME_CONFIG.unlocks.eggShelf.label,
      () => {
        const shelf = this.state.shelves.find(s => s.id === 3);
        if (shelf) shelf.unlocked = true;
        this.updateShelfMeshes();
      }
    ));

    // 4. Automated Cashier Pad
    this.unlockPads.push(this.createUnlockPad(
      'cashier',
      new THREE.Vector3(-8, 0, 4.6),
      GAME_CONFIG.unlocks.cashierStaff.cost,
      GAME_CONFIG.unlocks.cashierStaff.label,
      () => {
        this.state.hasCashier = true;
        this.cashierNPC.visible = true;
      }
    ));

    // 5. Helper Worker Pad
    this.unlockPads.push(this.createUnlockPad(
      'helper',
      new THREE.Vector3(2, 0, -2),
      GAME_CONFIG.unlocks.helperWorker.cost,
      GAME_CONFIG.unlocks.helperWorker.label,
      () => {
        this.state.hasHelper = true;
        this.helperNPC.visible = true;
      }
    ));
  }

  createUnlockPad(id, position, totalCost, labelText, onUnlock) {
    const group = new THREE.Group();
    group.position.copy(position);

    const padMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.1, 24),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5, flatShading: true })
    );
    padMesh.position.y = 0.05;
    padMesh.receiveShadow = true;
    group.add(padMesh);

    const rimGeo = new THREE.TorusGeometry(1.42, 0.06, 8, 24);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, new THREE.MeshBasicMaterial({ color: 0x09090b }));
    rim.position.y = 0.11;
    group.add(rim);

    this.scene.add(group);

    const labelSprite = this.addFloatingLabel(labelText, position.clone().add(new THREE.Vector3(0, 1.8, 0)), 0xeab308);

    return {
      id,
      position,
      group,
      totalCost,
      remainingCost: totalCost,
      labelSprite,
      labelText,
      isUnlocked: false,
      drainTimer: 0,
      onUnlock
    };
  }

  initPlayer() {
    this.player = new THREE.Group();
    this.player.position.set(0, 0, 2);

    // Player Body
    this.playerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.0, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4, flatShading: true })
    );
    this.playerBody.position.y = 0.95;
    this.playerBody.castShadow = true;
    this.player.add(this.playerBody);

    // Head & Cap
    this.playerHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6, flatShading: true })
    );
    this.playerHead.position.y = 1.75;
    this.playerHead.castShadow = true;
    this.player.add(this.playerHead);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.22, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, flatShading: true })
    );
    cap.position.y = 1.95;
    this.player.add(cap);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, flatShading: true });
    this.playerLegL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.28), legMat);
    this.playerLegL.position.set(-0.22, 0.3, 0);
    this.playerLegR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.28), legMat);
    this.playerLegR.position.set(0.22, 0.3, 0);
    this.player.add(this.playerLegL, this.playerLegR);

    // Carrying Rack
    const rack = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.8, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, flatShading: true })
    );
    rack.position.set(0, 1.0, -0.35);
    this.player.add(rack);

    // Backpack Stack Root
    this.stackRoot = new THREE.Group();
    this.stackRoot.position.set(0, 0.8, -0.4);
    this.player.add(this.stackRoot);

    // Carried mesh pool (12 items max)
    this.carriedMeshes = [];
    for (let i = 0; i < 12; i++) {
      const tomMesh = this.createProduceMesh('tomato');
      const eggMesh = this.createProduceMesh('egg');
      tomMesh.position.y = i * 0.42;
      eggMesh.position.y = i * 0.42;
      tomMesh.visible = false;
      eggMesh.visible = false;
      this.stackRoot.add(tomMesh, eggMesh);
      this.carriedMeshes.push({ tom: tomMesh, egg: eggMesh });
    }

    this.scene.add(this.player);
    this.playerWalkCycle = 0;
  }

  addFloatingLabel(text, position, accentColor = 0x06b6d4) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    this.drawLabelCanvas(ctx, text, accentColor);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(position);
    sprite.scale.set(3.4, 0.85, 1);
    this.scene.add(sprite);

    sprite.userData = { canvas, ctx, text, accentColor };
    this.textSprites.push(sprite);
    return sprite;
  }

  updateFloatingLabelText(sprite, newText) {
    if (!sprite || !sprite.userData) return;
    sprite.userData.text = newText;
    const { canvas, ctx, accentColor } = sprite.userData;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawLabelCanvas(ctx, newText, accentColor);
    sprite.material.map.needsUpdate = true;
  }

  drawLabelCanvas(ctx, text, accentColor) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 6;

    const x = 10, y = 10, w = 380, h = 80, r = 22;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#' + accentColor.toString(16).padStart(6, '0');
    ctx.fillRect(x + 20, y + h - 10, w - 40, 6);

    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 28px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 200, 46);
  }

  spawnCashDrop(amount) {
    const cashGroup = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.25, 0.45),
      new THREE.MeshStandardMaterial({ color: GAME_CONFIG.palette.cashGreen, roughness: 0.3, flatShading: true })
    );
    mesh.castShadow = true;
    cashGroup.add(mesh);

    const spreadX = (Math.random() - 0.5) * 1.2;
    const spreadZ = (Math.random() - 0.5) * 0.8;
    cashGroup.position.set(
      this.counterPos.x + 0.8 + spreadX,
      1.4,
      this.counterPos.z + spreadZ
    );

    this.scene.add(cashGroup);
    this.cashDrops.push({ group: cashGroup, amount });
  }

  isPlayerAtRegister() {
    return this.player.position.distanceTo(this.registerPlayerPos) < 2.0;
  }

  getShelfStandPos(shelfId) {
    const se = this.shelfEntities.find(s => s.id === shelfId);
    return se ? se.customerStandPos : new THREE.Vector3(-5, 0, -2.5);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    this.updatePlayer(dt);
    this.updateGarden(dt);
    this.updateChickenCoop(dt);
    this.updateShelvesInteraction(dt);
    this.updateUnlockPads(dt);
    this.updateCashCollection(dt);
    this.updateHelperWorker(dt);
    this.customerManager.update(dt);
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }

  updatePlayer(dt) {
    const input = this.joystick.getInput();
    const speed = this.state.playerSpeed * (this.state.speedBoostActive ? GAME_CONFIG.player.boostSpeedMultiplier : 1.0);
    const isMoving = Math.hypot(input.x, input.y) > 0.05;

    if (isMoving) {
      const isoX = (input.x - input.y) * 0.7071;
      const isoZ = (input.x + input.y) * 0.7071;

      this.player.position.x += isoX * speed * dt;
      this.player.position.z += isoZ * speed * dt;

      const angle = Math.atan2(isoX, isoZ);
      this.player.rotation.y = angle;

      this.playerWalkCycle += dt * 14 * (this.state.speedBoostActive ? 1.5 : 1.0);
      this.playerLegL.rotation.x = Math.sin(this.playerWalkCycle) * 0.6;
      this.playerLegR.rotation.x = -Math.sin(this.playerWalkCycle) * 0.6;
    } else {
      this.playerLegL.rotation.x = 0;
      this.playerLegR.rotation.x = 0;
    }

    this.player.position.x = THREE.MathUtils.clamp(this.player.position.x, -16, 17);
    this.player.position.z = THREE.MathUtils.clamp(this.player.position.z, -11, 11);

    // Update carried items visually matching inventory
    this.carriedMeshes.forEach((slot, idx) => {
      const item = this.state.inventory[idx];
      if (item) {
        slot.tom.visible = item.type === 'tomato';
        slot.egg.visible = item.type === 'egg';
      } else {
        slot.tom.visible = false;
        slot.egg.visible = false;
      }
    });

    // Wobble physics
    const pVelX = (this.player.position.x - this.lastPlayerPos.x) / (dt || 0.016);
    const pVelZ = (this.player.position.z - this.lastPlayerPos.z) / (dt || 0.016);

    const targetTiltX = THREE.MathUtils.clamp(-pVelZ * GAME_CONFIG.player.tiltSensitivity, -0.35, 0.35);
    const targetTiltZ = THREE.MathUtils.clamp(pVelX * GAME_CONFIG.player.tiltSensitivity, -0.35, 0.35);

    this.stackWobble.angleX += (targetTiltX - this.stackWobble.angleX) * GAME_CONFIG.player.tiltDamping * dt;
    this.stackWobble.angleZ += (targetTiltZ - this.stackWobble.angleZ) * GAME_CONFIG.player.tiltDamping * dt;

    this.stackRoot.rotation.x = this.stackWobble.angleX;
    this.stackRoot.rotation.z = this.stackWobble.angleZ;

    this.lastPlayerPos.copy(this.player.position);
  }

  updateGarden(dt) {
    this.plants.forEach(plant => {
      if (!plant.isRipe) {
        plant.regrowTimer += dt;
        const progress = THREE.MathUtils.clamp(plant.regrowTimer / plant.regrowDuration, 0, 1);
        plant.tomatoes.forEach(t => {
          t.visible = true;
          t.scale.setScalar(progress);
        });
        if (progress >= 1) plant.isRipe = true;
      }

      if (plant.isRipe && this.state.canPickItem()) {
        if (this.player.position.distanceTo(plant.pos) < 1.8) {
          plant.isRipe = false;
          plant.regrowTimer = 0;
          plant.tomatoes.forEach(t => (t.visible = false));
          this.state.pushItem({ type: 'tomato', id: Date.now() });
          sound.playPop();
        }
      }
    });
  }

  updateChickenCoop(dt) {
    if (!this.state.unlockedCoop) return;

    this.nests.forEach(nest => {
      if (!nest.hasEgg) {
        nest.timer += dt;
        const prog = THREE.MathUtils.clamp(nest.timer / GAME_CONFIG.items.egg.layDuration, 0, 1);
        nest.mesh.visible = true;
        nest.mesh.scale.setScalar(prog);
        if (prog >= 1) nest.hasEgg = true;
      }

      if (nest.hasEgg && this.state.canPickItem()) {
        if (this.player.position.distanceTo(nest.pos) < 1.8) {
          nest.hasEgg = false;
          nest.timer = 0;
          nest.mesh.visible = false;
          this.state.pushItem({ type: 'egg', id: Date.now() });
          sound.playPop();
        }
      }
    });
  }

  updateShelvesInteraction(dt) {
    if (this.state.inventory.length === 0) return;

    this.shelfEntities.forEach(se => {
      const stateShelf = this.state.shelves.find(s => s.id === se.id);
      if (!stateShelf || !stateShelf.unlocked) return;

      if (this.player.position.distanceTo(se.playerStockPos) < 2.2 && stateShelf.items < stateShelf.maxItems) {
        this.shelfStockTimer = (this.shelfStockTimer || 0) + dt;
        if (this.shelfStockTimer > 0.12) {
          this.shelfStockTimer = 0;
          const item = this.state.popItemForShelf(se.type);
          if (item) {
            stateShelf.items++;
            this.updateShelfMeshes();
            sound.playStack();
          }
        }
      }
    });
  }

  updateUnlockPads(dt) {
    this.unlockPads.forEach(pad => {
      if (pad.isUnlocked) return;

      if (this.player.position.distanceTo(pad.position) < 1.7) {
        pad.drainTimer += dt;
        if (pad.drainTimer >= 0.08) {
          pad.drainTimer = 0;
          const step = Math.min(5, pad.remainingCost, this.state.cash);
          if (step > 0 && this.state.spendCash(step)) {
            pad.remainingCost -= step;
            sound.playStack();
            this.updateFloatingLabelText(pad.labelSprite, `KALAN: ${pad.remainingCost} TL`);

            if (pad.remainingCost <= 0) {
              pad.isUnlocked = true;
              pad.group.visible = false;
              pad.labelSprite.visible = false;
              sound.playUnlock();
              if (pad.onUnlock) pad.onUnlock();
            }
          }
        }
      }
    });
  }

  updateCashCollection(dt) {
    for (let i = this.cashDrops.length - 1; i >= 0; i--) {
      const drop = this.cashDrops[i];
      if (this.player.position.distanceTo(drop.group.position) < 2.5) {
        this.scene.remove(drop.group);
        this.state.addCash(drop.amount);
        sound.playCash();
        this.cashDrops.splice(i, 1);
      }
    }
  }

  updateHelperWorker(dt) {
    if (!this.state.hasHelper) return;

    // Helper walks between tomato garden and shelf to auto-stock
    const helper = this.helperNPC;
    const target = this.helperTarget;
    const dir = new THREE.Vector3().subVectors(target, helper.position);
    dir.y = 0;
    const dist = dir.length();

    if (dist < 0.4) {
      if (this.helperState === 'HARVEST') {
        this.helperState = 'STOCK';
        this.helperTarget.set(-5, 0, -2.4); // shelf 1
      } else {
        this.helperState = 'HARVEST';
        const shelf1 = this.state.shelves.find(s => s.id === 1);
        if (shelf1 && shelf1.items < shelf1.maxItems) {
          shelf1.items = Math.min(shelf1.maxItems, shelf1.items + 2);
          this.updateShelfMeshes();
        }
        this.helperTarget.set(8.5, 0, -4); // garden
      }
    } else {
      dir.normalize();
      helper.position.addScaledVector(dir, 3.0 * dt);
      helper.rotation.y = Math.atan2(dir.x, dir.z);

      helper.userData.walkCycle += dt * 10;
      helper.userData.leftLeg.rotation.x = Math.sin(helper.userData.walkCycle) * 0.5;
      helper.userData.rightLeg.rotation.x = -Math.sin(helper.userData.walkCycle) * 0.5;
    }
  }

  updateCamera() {
    const targetCamX = this.player.position.x + this.cameraOffset.x;
    const targetCamY = this.cameraOffset.y;
    const targetCamZ = this.player.position.z + this.cameraOffset.z;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.08;
    this.camera.position.y = targetCamY;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.08;

    this.camera.lookAt(
      this.player.position.x - 2,
      1.5,
      this.player.position.z - 2
    );
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
