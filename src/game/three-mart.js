/**
 * ThreeMart - 3D Isometric Mini-Mart World Engine
 * Low-Poly Faceted 8-Bit Neo-Brutalist Aesthetic
 * Zero Emojis Used
 */

import * as THREE from 'three';
import { sound } from './sound-effects.js';
import { CustomerManager } from './customer-ai.js';

export class ThreeMart {
  constructor(canvas, state, joystick) {
    this.canvas = canvas;
    this.state = state;
    this.joystick = joystick;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);

    // Camera setup - Isometric perspective
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.cameraOffset = new THREE.Vector3(14, 18, 16);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Internal collections & state
    this.textSprites = [];
    this.cashDrops = [];
    this.clock = new THREE.Clock();
    this.stackWobble = { angleX: 0, angleZ: 0, velX: 0, velZ: 0 };
    this.lastPlayerPos = new THREE.Vector3();

    // Lighting
    this.initLights();

    // World Elements
    this.initWorldGround();
    this.initStoreWalls();
    this.initGardenPlants();
    this.initShelves();
    this.initCheckoutCounter();
    this.initUnlockPads();
    this.initPlayer();

    // Customer System
    this.customerManager = new CustomerManager(this.scene, this.state, this);

    // Window resize
    window.addEventListener('resize', () => this.onResize());

    // Start loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xfff7ed, 1.2);
    sun.position.set(16, 26, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 60;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.001;
    this.scene.add(sun);
  }

  initWorldGround() {
    // 1. Outside ground (Grass/Garden area)
    const gardenGroundGeo = new THREE.BoxGeometry(16, 0.4, 22);
    const gardenGroundMat = new THREE.MeshStandardMaterial({
      color: 0x86efac, // Fresh bright green
      roughness: 0.8,
      flatShading: true
    });
    const gardenGround = new THREE.Mesh(gardenGroundGeo, gardenGroundMat);
    gardenGround.position.set(10, -0.2, 0);
    gardenGround.receiveShadow = true;
    this.scene.add(gardenGround);

    // Garden Soil Bed
    const soilGeo = new THREE.BoxGeometry(10, 0.5, 14);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Rich dark earth brown
      roughness: 0.9,
      flatShading: true
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(10, -0.1, 0);
    soil.receiveShadow = true;
    this.scene.add(soil);

    // Soil Bed Border (Neo-brutalist chunky wooden beam)
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7, flatShading: true });
    const beamGeoX = new THREE.BoxGeometry(10.6, 0.4, 0.4);
    const beamGeoZ = new THREE.BoxGeometry(0.4, 0.4, 14.6);
    
    const beam1 = new THREE.Mesh(beamGeoX, beamMat);
    beam1.position.set(10, 0.2, 7.2);
    const beam2 = new THREE.Mesh(beamGeoX, beamMat);
    beam2.position.set(10, 0.2, -7.2);
    const beam3 = new THREE.Mesh(beamGeoZ, beamMat);
    beam3.position.set(4.8, 0.2, 0);
    const beam4 = new THREE.Mesh(beamGeoZ, beamMat);
    beam4.position.set(15.2, 0.2, 0);
    this.scene.add(beam1, beam2, beam3, beam4);

    // 2. Store Interior Floor
    const storeGroundGeo = new THREE.BoxGeometry(18, 0.4, 22);
    const storeGroundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      flatShading: true
    });
    const storeGround = new THREE.Mesh(storeGroundGeo, storeGroundMat);
    storeGround.position.set(-6, -0.2, 0);
    storeGround.receiveShadow = true;
    this.scene.add(storeGround);

    // Floor Checker / Grid Pattern overlay
    const gridHelper = new THREE.GridHelper(18, 18, 0x09090b, 0xe2e8f0);
    gridHelper.position.set(-6, 0.01, 0);
    this.scene.add(gridHelper);

    // Floor divider between farm and store (Neo-brutalist black barrier)
    const dividerGeo = new THREE.BoxGeometry(0.3, 0.4, 22);
    const dividerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });
    const divider = new THREE.Mesh(dividerGeo, dividerMat);
    divider.position.set(3, 0.2, 0);
    this.scene.add(divider);

    // Add Garden sign
    this.addFloatingLabel("ORGANIK DOMATES TARLASI", new THREE.Vector3(10, 3.2, -6.5), 0xf59e0b);
  }

  initStoreWalls() {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
      flatShading: true
    });
    const wallTrimMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.4
    });

    // Back wall
    const backWallGeo = new THREE.BoxGeometry(18, 3.5, 0.6);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(-6, 1.75, -11);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Back wall top trim
    const topTrim = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.4, 0.8), wallTrimMat);
    topTrim.position.set(-6, 3.6, -11);
    this.scene.add(topTrim);

    // Left wall
    const leftWallGeo = new THREE.BoxGeometry(0.6, 3.5, 22);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-15, 1.75, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Market Entrance Banner
    this.addFloatingLabel("MINI MART NEO - GIRIS", new THREE.Vector3(-6, 4.2, -10.5), 0x06b6d4);
  }

  initGardenPlants() {
    this.plants = [];
    const rows = 3;
    const cols = 2;
    const startX = 7.5;
    const startZ = -4.5;
    const spacingX = 4.5;
    const spacingZ = 4.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const plantGroup = new THREE.Group();
        const px = startX + c * spacingX;
        const pz = startZ + r * spacingZ;
        plantGroup.position.set(px, 0, pz);

        // Plant stem
        const stemGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.9, 6);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, flatShading: true });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.45;
        stem.castShadow = true;
        plantGroup.add(stem);

        // Leaves (faceted cluster)
        const leafGeo = new THREE.DodecahedronGeometry(0.55, 0);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6, flatShading: true });
        const leaves = new THREE.Mesh(leafGeo, leafMat);
        leaves.position.y = 0.95;
        leaves.castShadow = true;
        plantGroup.add(leaves);

        // Ripe Tomatoes on the bush (3 per plant)
        const tomatoes = [];
        const tomOffsets = [
          new THREE.Vector3(-0.4, 0.85, 0.25),
          new THREE.Vector3(0.4, 0.95, -0.2),
          new THREE.Vector3(0, 1.15, 0.4)
        ];

        tomOffsets.forEach(offset => {
          const tom = this.createTomatoMesh();
          tom.position.copy(offset);
          plantGroup.add(tom);
          tomatoes.push(tom);
        });

        this.scene.add(plantGroup);

        this.plants.push({
          group: plantGroup,
          tomatoes: tomatoes,
          isRipe: true,
          regrowTimer: 0,
          regrowDuration: 2.4,
          pos: new THREE.Vector3(px, 0, pz)
        });
      }
    }
  }

  createTomatoMesh() {
    const group = new THREE.Group();
    // Faceted red tomato
    const geo = new THREE.BoxGeometry(0.36, 0.36, 0.36);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vibrant ripe red
      roughness: 0.3,
      flatShading: true
    });
    const tomato = new THREE.Mesh(geo, mat);
    tomato.castShadow = true;
    group.add(tomato);

    // Green cap
    const capGeo = new THREE.BoxGeometry(0.18, 0.08, 0.18);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.2;
    group.add(cap);

    return group;
  }

  initShelves() {
    this.shelfEntities = [];

    // Shelf 1 (Default Unlocked)
    const shelf1 = this.createShelfEntity(1, new THREE.Vector3(-5, 0, -4), true);
    this.shelfEntities.push(shelf1);

    // Shelf 2 (Unlockable: 50 TL)
    const shelf2 = this.createShelfEntity(2, new THREE.Vector3(-10, 0, -4), false, 50);
    this.shelfEntities.push(shelf2);

    this.updateShelfMeshes();
  }

  createShelfEntity(id, position, unlocked, cost = 0) {
    const group = new THREE.Group();
    group.position.copy(position);

    // Shelf Furniture Mesh
    const standMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5, flatShading: true });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7, flatShading: true });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });

    // Base Stand
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 1.8), standMat);
    base.position.y = 0.25;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Bottom Rim
    const baseRim = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.2, 1.9), trimMat);
    baseRim.position.y = 0.1;
    group.add(baseRim);

    // Shelving Boards (Tier 1 & Tier 2)
    const tier1 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 1.6), woodMat);
    tier1.position.y = 0.8;
    tier1.castShadow = true;
    group.add(tier1);

    const tier2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 1.4), woodMat);
    tier2.position.y = 1.45;
    tier2.castShadow = true;
    group.add(tier2);

    // Shelf Backboard
    const back = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 0.2), standMat);
    back.position.set(0, 1.0, -0.85);
    back.castShadow = true;
    group.add(back);

    // Display slots for stocked tomatoes (2 tiers x 6 slots = 12 max)
    const itemSlots = [];
    for (let tier = 0; tier < 2; tier++) {
      const y = tier === 0 ? 1.0 : 1.65;
      const z = tier === 0 ? 0.3 : 0.0;
      for (let i = 0; i < 6; i++) {
        const x = -1.25 + i * 0.5;
        const tom = this.createTomatoMesh();
        tom.position.set(x, y, z);
        tom.visible = false;
        group.add(tom);
        itemSlots.push(tom);
      }
    }

    group.visible = unlocked;
    this.scene.add(group);

    // Floating Label
    const labelPos = position.clone().add(new THREE.Vector3(0, 2.8, 0));
    const labelSprite = this.addFloatingLabel(`RAF ${id}: 0/12`, labelPos, 0x06b6d4);

    return {
      id,
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
        this.updateFloatingLabelText(se.labelSprite, `RAF ${se.id}: ${stateShelf.items}/${stateShelf.maxItems}`);
      }

      // Show items matching count
      se.itemSlots.forEach((slot, idx) => {
        slot.visible = idx < stateShelf.items;
      });
    });
  }

  initCheckoutCounter() {
    this.counterGroup = new THREE.Group();
    this.counterPos = new THREE.Vector3(-4, 0, 6);
    this.counterGroup.position.copy(this.counterPos);

    const deskMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5, flatShading: true });
    const topMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, flatShading: true });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });

    // Desk Body
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.6), deskMat);
    desk.position.y = 0.6;
    desk.castShadow = true;
    desk.receiveShadow = true;
    this.counterGroup.add(desk);

    // Desk Countertop
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.15, 1.8), topMat);
    top.position.y = 1.25;
    top.castShadow = true;
    this.counterGroup.add(top);

    // Cash Register Monitor & Scanner
    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.4), blackMat);
    monitor.position.set(-0.6, 1.65, 0.2);
    monitor.castShadow = true;
    this.counterGroup.add(monitor);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    screen.position.set(-0.6, 1.65, 0.41);
    this.counterGroup.add(screen);

    // Conveyor Belt line
    const conveyor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 1.2), blackMat);
    conveyor.position.set(0.8, 1.34, 0);
    this.counterGroup.add(conveyor);

    this.scene.add(this.counterGroup);

    // Customer queue position (in front of register)
    this.registerCustomerPos = new THREE.Vector3(-4, 0, 8.2);

    // Player Cashier position (behind register)
    this.registerPlayerPos = new THREE.Vector3(-4, 0, 4.2);

    // Automated Cashier NPC Mesh (Initially hidden until unlocked)
    this.cashierNPC = this.createCashierNPC(new THREE.Vector3(-4, 0, 4.2));
    this.cashierNPC.visible = false;
    this.scene.add(this.cashierNPC);

    // Register Label
    this.addFloatingLabel("KASA & ODEME ALANI", this.counterPos.clone().add(new THREE.Vector3(0, 2.6, 0)), 0x10b981);
  }

  createCashierNPC(pos) {
    const group = new THREE.Group();
    group.position.copy(pos);

    // Body with green apron
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.9, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x10b981, flatShading: true })
    );
    body.position.y = 0.85;
    group.add(body);

    // Head
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xffdbac, flatShading: true })
    );
    head.position.y = 1.6;
    group.add(head);

    // Visor cap
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.15, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x09090b, flatShading: true })
    );
    visor.position.set(0, 1.8, 0.05);
    group.add(visor);

    return group;
  }

  initUnlockPads() {
    this.unlockPads = [];

    // Pad 1: Unlock Shelf 2 (50 ₺)
    const pad1 = this.createUnlockPad(
      'shelf_2',
      new THREE.Vector3(-10, 0, -1.8),
      50,
      "YENI RAF 2: 50 TL",
      () => {
        const shelf = this.state.shelves.find(s => s.id === 2);
        if (shelf) shelf.unlocked = true;
        this.updateShelfMeshes();
        this.state.checkObjectiveProgress('shelf', 1);
      }
    );
    this.unlockPads.push(pad1);

    // Pad 2: Unlock Automated Cashier (150 ₺)
    const pad2 = this.createUnlockPad(
      'cashier',
      new THREE.Vector3(-8, 0, 4.2),
      150,
      "OTO KASIYER: 150 TL",
      () => {
        this.state.hasCashier = true;
        this.cashierNPC.visible = true;
        this.state.checkObjectiveProgress('cashier', 1);
      }
    );
    this.unlockPads.push(pad2);
  }

  createUnlockPad(id, position, totalCost, labelText, onUnlock) {
    const group = new THREE.Group();
    group.position.copy(position);

    // Outer Circle Pad with Neo-Brutalist border
    const padGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 24);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Bright yellow
      roughness: 0.5,
      flatShading: true
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = 0.05;
    padMesh.receiveShadow = true;
    group.add(padMesh);

    // Black Rim
    const rimGeo = new THREE.TorusGeometry(1.42, 0.06, 8, 24);
    rimGeo.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const rim = new THREE.Mesh(rimGeo, rimMat);
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

    // Player Body (Vibrant hoodie/jacket)
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.0, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan neo-brutalist hoodie
      roughness: 0.4,
      flatShading: true
    });
    this.playerBody = new THREE.Mesh(bodyGeo, bodyMat);
    this.playerBody.position.y = 0.95;
    this.playerBody.castShadow = true;
    this.player.add(this.playerBody);

    // Head
    const headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6, flatShading: true });
    this.playerHead = new THREE.Mesh(headGeo, headMat);
    this.playerHead.position.y = 1.75;
    this.playerHead.castShadow = true;
    this.player.add(this.playerHead);

    // Backward Cap (Neo-Brutalist dark cap)
    const capGeo = new THREE.BoxGeometry(0.6, 0.22, 0.6);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, flatShading: true });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.95;
    this.player.add(cap);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.28, 0.6, 0.28);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, flatShading: true });
    this.playerLegL = new THREE.Mesh(legGeo, legMat);
    this.playerLegL.position.set(-0.22, 0.3, 0);
    this.playerLegL.castShadow = true;
    this.playerLegR = new THREE.Mesh(legGeo, legMat);
    this.playerLegR.position.set(0.22, 0.3, 0);
    this.playerLegR.castShadow = true;
    this.player.add(this.playerLegL);
    this.player.add(this.playerLegR);

    // Backpack frame (Carrying rack)
    const rackGeo = new THREE.BoxGeometry(0.7, 0.8, 0.2);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, flatShading: true });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(0, 1.0, -0.35);
    this.player.add(rack);

    // Backpack stack root group (for physical swaying/wobble)
    this.stackRoot = new THREE.Group();
    this.stackRoot.position.set(0, 0.8, -0.4);
    this.player.add(this.stackRoot);

    // Pool of carried tomato meshes in the stack (up to maxCapacity = 6)
    this.carriedMeshes = [];
    for (let i = 0; i < 10; i++) {
      const tom = this.createTomatoMesh();
      tom.position.y = i * 0.42;
      tom.visible = false;
      this.stackRoot.add(tom);
      this.carriedMeshes.push(tom);
    }

    this.scene.add(this.player);
    this.playerWalkCycle = 0;
  }

  addFloatingLabel(text, position, accentColor = 0x06b6d4) {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    this.drawLabelCanvas(ctx, text, accentColor);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(position);
    sprite.scale.set(3.2, 0.8, 1);
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
    // Neo-brutalist rounded pill label
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 6;

    // Draw rounded rectangle
    const x = 10, y = 10, w = 364, h = 76, r = 20;
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

    // Accent line on bottom
    ctx.fillStyle = '#' + accentColor.toString(16).padStart(6, '0');
    ctx.fillRect(x + 20, y + h - 10, w - 40, 6);

    // Text (Strictly no emojis)
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 26px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 192, 44);
  }

  spawnCashDrop(amount) {
    const cashGroup = new THREE.Group();
    // Faceted green dollar bills stack
    const geo = new THREE.BoxGeometry(0.7, 0.25, 0.45);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Bright crisp cash green
      roughness: 0.3,
      flatShading: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    cashGroup.add(mesh);

    // Position on the counter
    const spreadX = (Math.random() - 0.5) * 1.2;
    const spreadZ = (Math.random() - 0.5) * 0.8;
    cashGroup.position.set(
      this.counterPos.x + 0.8 + spreadX,
      1.4,
      this.counterPos.z + spreadZ
    );

    this.scene.add(cashGroup);
    this.cashDrops.push({
      group: cashGroup,
      amount: amount,
      collected: false
    });
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
    this.updateShelvesInteraction(dt);
    this.updateUnlockPads(dt);
    this.updateCashCollection(dt);
    this.customerManager.update(dt);
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }

  updatePlayer(dt) {
    const input = this.joystick.getInput();
    const speed = this.state.playerSpeed * (this.state.speedBoostActive ? 1.6 : 1.0);

    const isMoving = Math.hypot(input.x, input.y) > 0.05;

    if (isMoving) {
      // 45-degree isometric projection movement
      const isoX = (input.x - input.y) * 0.7071;
      const isoZ = (input.x + input.y) * 0.7071;

      this.player.position.x += isoX * speed * dt;
      this.player.position.z += isoZ * speed * dt;

      // Rotate player to face movement direction
      const angle = Math.atan2(isoX, isoZ);
      this.player.rotation.y = angle;

      // Leg walk cycle
      this.playerWalkCycle += dt * 14 * (this.state.speedBoostActive ? 1.5 : 1.0);
      this.playerLegL.rotation.x = Math.sin(this.playerWalkCycle) * 0.6;
      this.playerLegR.rotation.x = -Math.sin(this.playerWalkCycle) * 0.6;
    } else {
      this.playerLegL.rotation.x = 0;
      this.playerLegR.rotation.x = 0;
    }

    // Clamp player bounds
    this.player.position.x = THREE.MathUtils.clamp(this.player.position.x, -14, 16);
    this.player.position.z = THREE.MathUtils.clamp(this.player.position.z, -10, 10);

    // Update carried items in backpack stack
    const invCount = this.state.inventory.length;
    this.carriedMeshes.forEach((mesh, idx) => {
      mesh.visible = idx < invCount;
    });

    // Wobbly stack physics (inertia based on player speed / acceleration)
    const pVelX = (this.player.position.x - this.lastPlayerPos.x) / (dt || 0.016);
    const pVelZ = (this.player.position.z - this.lastPlayerPos.z) / (dt || 0.016);

    const targetTiltX = THREE.MathUtils.clamp(-pVelZ * 0.04, -0.35, 0.35);
    const targetTiltZ = THREE.MathUtils.clamp(pVelX * 0.04, -0.35, 0.35);

    this.stackWobble.angleX += (targetTiltX - this.stackWobble.angleX) * 12 * dt;
    this.stackWobble.angleZ += (targetTiltZ - this.stackWobble.angleZ) * 12 * dt;

    this.stackRoot.rotation.x = this.stackWobble.angleX;
    this.stackRoot.rotation.z = this.stackWobble.angleZ;

    this.lastPlayerPos.copy(this.player.position);
  }

  updateGarden(dt) {
    this.plants.forEach(plant => {
      if (!plant.isRipe) {
        plant.regrowTimer += dt;
        const progress = THREE.MathUtils.clamp(plant.regrowTimer / plant.regrowDuration, 0, 1);
        
        // Growth scaling animation
        plant.tomatoes.forEach(t => {
          t.visible = true;
          t.scale.setScalar(progress);
        });

        if (progress >= 1) {
          plant.isRipe = true;
        }
      }

      // Check proximity to player for harvesting
      if (plant.isRipe && this.state.canPickItem()) {
        const dist = this.player.position.distanceTo(plant.pos);
        if (dist < 1.8) {
          plant.isRipe = false;
          plant.regrowTimer = 0;
          plant.tomatoes.forEach(t => (t.visible = false));

          this.state.pushItem({ type: 'tomato', id: Date.now() });
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

      const dist = this.player.position.distanceTo(se.playerStockPos);
      if (dist < 2.0 && stateShelf.items < stateShelf.maxItems) {
        // Stock item from backpack to shelf
        this.shelfStockTimer = (this.shelfStockTimer || 0) + dt;
        if (this.shelfStockTimer > 0.12) {
          this.shelfStockTimer = 0;
          const item = this.state.popItem();
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

      const dist = this.player.position.distanceTo(pad.position);
      if (dist < 1.6) {
        pad.drainTimer += dt;
        if (pad.drainTimer >= 0.08) {
          pad.drainTimer = 0;
          // Drain cash step-by-step
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
    // Player collects cash drops by walking near checkout counter
    for (let i = this.cashDrops.length - 1; i >= 0; i--) {
      const drop = this.cashDrops[i];
      const dist = this.player.position.distanceTo(drop.group.position);
      if (dist < 2.5) {
        this.scene.remove(drop.group);
        this.state.addCash(drop.amount);
        sound.playCash();
        this.cashDrops.splice(i, 1);
      }
    }
  }

  updateCamera() {
    // Smooth camera follow
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
