/**
 * Virtual Analog Touch Joystick + Keyboard WASD Fallback
 * Smooth mobile controls for Android & iOS touchscreens
 */

export class VirtualJoystick {
  constructor(zoneId, thumbId) {
    this.zone = document.getElementById(zoneId);
    this.thumb = document.getElementById(thumbId);
    
    this.vector = { x: 0, y: 0 };
    this.active = false;
    this.pointerId = null;
    this.maxRadius = 38; // Maximum thumb travel distance in px

    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false
    };

    this.initTouch();
    this.initKeyboard();
  }

  initTouch() {
    if (!this.zone) return;

    const onPointerDown = (e) => {
      this.active = true;
      this.pointerId = e.pointerId;
      this.zone.setPointerCapture(e.pointerId);
      this.updateVector(e);
    };

    const onPointerMove = (e) => {
      if (!this.active || e.pointerId !== this.pointerId) return;
      this.updateVector(e);
    };

    const onPointerUp = (e) => {
      if (e.pointerId !== this.pointerId) return;
      this.reset();
    };

    this.zone.addEventListener('pointerdown', onPointerDown);
    this.zone.addEventListener('pointermove', onPointerMove);
    this.zone.addEventListener('pointerup', onPointerUp);
    this.zone.addEventListener('pointercancel', onPointerUp);
  }

  updateVector(e) {
    const rect = this.zone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = e.clientX - centerX;
    let deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > this.maxRadius) {
      deltaX = (deltaX / distance) * this.maxRadius;
      deltaY = (deltaY / distance) * this.maxRadius;
    }

    if (this.thumb) {
      this.thumb.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    // Normalized vector -1.0 to 1.0
    this.vector.x = deltaX / this.maxRadius;
    this.vector.y = deltaY / this.maxRadius;
  }

  reset() {
    this.active = false;
    this.pointerId = null;
    this.vector.x = 0;
    this.vector.y = 0;
    if (this.thumb) {
      this.thumb.style.transform = `translate(0px, 0px)`;
    }
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.keys[e.code] !== undefined) {
        this.keys[e.code] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.keys[e.code] !== undefined) {
        this.keys[e.code] = false;
      }
    });
  }

  /**
   * Returns current combined movement vector { x, y }
   * Coordinates: x: right (+), left (-); y: down (+), up (-)
   */
  getInput() {
    // Check keyboard first
    let kx = 0;
    let ky = 0;

    if (this.keys.ArrowRight || this.keys.KeyD) kx += 1;
    if (this.keys.ArrowLeft || this.keys.KeyA) kx -= 1;
    if (this.keys.ArrowDown || this.keys.KeyS) ky += 1;
    if (this.keys.ArrowUp || this.keys.KeyW) ky -= 1;

    if (kx !== 0 || ky !== 0) {
      const len = Math.hypot(kx, ky);
      return { x: kx / len, y: ky / len };
    }

    // Return analog touch joystick
    return { x: this.vector.x, y: this.vector.y };
  }
}
