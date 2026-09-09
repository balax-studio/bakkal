/**
 * Customer AI and Lifecycle Manager
 * Spawns shoppers, navigates to shelves, buys produce, queues at checkout, pays money
 */

import * as THREE from 'three';
import { sound } from './sound-effects.js';

export class CustomerManager {
  constructor(scene, state, martWorld) {
    this.scene = scene;
    this.state = state;
    this.world = martWorld;
    this.customers = [];
    this.maxCustomers = 4;
    this.spawnTimer = 0;
    this.spawnInterval = 3.5; // Spawn a customer every 3.5s if capacity permits

    // Colors for customer shirts (neo-brutalist vibrant palette)
    this.shirtColors = [0x06b6d4, 0xef4444, 0x10b981, 0x8b5cf6, 0xf59e0b];
  }

  update(dt) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval && this.customers.length < this.maxCustomers) {
      this.spawnTimer = 0;
      this.spawnCustomer();
    }

    // Update each customer
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      c.update(dt);
      if (c.isDead) {
        this.scene.remove(c.mesh);
        this.customers.splice(i, 1);
      }
    }
  }

  spawnCustomer() {
    // Entrance spawn coordinate
    const spawnPos = new THREE.Vector3(-8, 0, 10);
    const color = this.shirtColors[Math.floor(Math.random() * this.shirtColors.length)];
    const customer = new Customer(this.scene, this.state, this.world, spawnPos, color);
    this.customers.push(customer);
  }
}

class Customer {
  constructor(scene, state, world, pos, shirtColor) {
    this.scene = scene;
    this.state = state;
    this.world = world;
    this.speed = 3.2;
    this.isDead = false;

    // States: 'ENTER', 'GO_TO_SHELF', 'PICK_ITEM', 'GO_TO_REGISTER', 'WAIT_CHECKOUT', 'LEAVE'
    this.status = 'ENTER';
    this.hasItem = false;
    this.targetPos = new THREE.Vector3();
    this.chosenShelf = null;
    this.waitTime = 0;

    // Create 3D Mesh (Low-poly faceted 8-bit character)
    this.mesh = new THREE.Group();
    this.mesh.position.copy(pos);

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.7, 0.9, 0.45);
    const bodyMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5, flatShading: true });
    this.body = new THREE.Mesh(bodyGeo, bodyMat);
    this.body.position.y = 0.85;
    this.body.castShadow = true;
    this.mesh.add(this.body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6, flatShading: true });
    this.head = new THREE.Mesh(headGeo, headMat);
    this.head.position.y = 1.6;
    this.head.castShadow = true;
    this.mesh.add(this.head);

    // Hair/Cap
    const capGeo = new THREE.BoxGeometry(0.54, 0.2, 0.54);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, flatShading: true });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.8;
    this.mesh.add(cap);

    // Left & Right Legs
    const legGeo = new THREE.BoxGeometry(0.24, 0.55, 0.24);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, flatShading: true });
    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.2, 0.28, 0);
    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.2, 0.28, 0);
    this.mesh.add(this.leftLeg);
    this.mesh.add(this.rightLeg);

    // Carried Item slot (hands)
    this.itemMesh = null;

    this.scene.add(this.mesh);
    this.walkCycle = 0;

    // Start entering
    this.targetPos.set(-2, 0, 4);
  }

  update(dt) {
    // Leg swing animation when moving
    this.walkCycle += dt * 9;
    const isMoving = this.status !== 'WAIT_CHECKOUT' && this.status !== 'PICK_ITEM';
    if (isMoving) {
      this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.5;
      this.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.5;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
    }

    switch (this.status) {
      case 'ENTER':
        this.moveTo(this.targetPos, dt, () => {
          this.decideShelf();
        });
        break;

      case 'GO_TO_SHELF':
        if (!this.chosenShelf || !this.chosenShelf.unlocked) {
          this.decideShelf();
          return;
        }
        this.moveTo(this.targetPos, dt, () => {
          this.status = 'PICK_ITEM';
          this.waitTime = 0.5;
        });
        break;

      case 'PICK_ITEM':
        this.waitTime -= dt;
        if (this.waitTime <= 0) {
          if (this.chosenShelf && this.chosenShelf.items > 0) {
            this.chosenShelf.items--;
            this.world.updateShelfMeshes();
            this.attachCarriedItem();
            sound.playPop();
            this.status = 'GO_TO_REGISTER';
            this.targetPos.copy(this.world.registerCustomerPos);
          } else {
            // Shelf is empty, wait or retry
            this.decideShelf();
          }
        }
        break;

      case 'GO_TO_REGISTER':
        this.moveTo(this.targetPos, dt, () => {
          this.status = 'WAIT_CHECKOUT';
          this.waitTime = 0;
        });
        break;

      case 'WAIT_CHECKOUT':
        // Check if player or automated cashier is serving register
        const playerAtRegister = this.world.isPlayerAtRegister();
        const canServe = playerAtRegister || this.state.hasCashier;
        if (canServe) {
          this.waitTime += dt;
          if (this.waitTime >= 0.7) {
            // Completed transaction!
            this.detachCarriedItem();
            this.world.spawnCashDrop(this.chosenShelf ? this.chosenShelf.price : 6);
            sound.playCash();
            this.status = 'LEAVE';
            this.targetPos.set(-8, 0, 10); // exit door
          }
        }
        break;

      case 'LEAVE':
        this.moveTo(this.targetPos, dt, () => {
          this.isDead = true;
        });
        break;
    }
  }

  decideShelf() {
    // Find unlocked shelf with items
    const available = this.state.shelves.filter(s => s.unlocked && s.items > 0);
    if (available.length > 0) {
      this.chosenShelf = available[Math.floor(Math.random() * available.length)];
      const shelfWorldPos = this.world.getShelfStandPos(this.chosenShelf.id);
      this.targetPos.copy(shelfWorldPos);
      this.status = 'GO_TO_SHELF';
    } else {
      // If no shelf has items, wait around or wander in store
      this.targetPos.set(
        -2 + (Math.random() * 4 - 2),
        0,
        2 + (Math.random() * 3 - 1.5)
      );
      this.status = 'ENTER';
    }
  }

  attachCarriedItem() {
    if (this.itemMesh) return;
    const isEgg = this.chosenShelf && this.chosenShelf.type === 'egg';
    const color = isEgg ? 0xffedd5 : 0xef4444;
    const geo = isEgg ? new THREE.BoxGeometry(0.3, 0.4, 0.3) : new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, flatShading: true });
    this.itemMesh = new THREE.Mesh(geo, mat);
    this.itemMesh.position.set(0, 0.9, 0.45);
    this.mesh.add(this.itemMesh);
  }

  detachCarriedItem() {
    if (this.itemMesh) {
      this.mesh.remove(this.itemMesh);
      this.itemMesh = null;
    }
  }

  moveTo(target, dt, onArrive) {
    const dir = new THREE.Vector3().subVectors(target, this.mesh.position);
    dir.y = 0;
    const dist = dir.length();

    if (dist < 0.25) {
      if (onArrive) onArrive();
      return;
    }

    dir.normalize();
    this.mesh.position.addScaledVector(dir, this.speed * dt);
    // Face movement direction
    const angle = Math.atan2(dir.x, dir.z);
    this.mesh.rotation.y = angle;
  }
}
