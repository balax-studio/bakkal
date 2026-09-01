# SPEC-translucent-glass-canopy: Modern Translucent Glass & Steel Truss Canopy Architecture

## 1. Objective
Replace the solid opaque concrete canopy roof in PixelOil 3D with an architectural translucent glass skylight and structural steel truss framework. This resolves the isometric camera occlusion problem where fuel pumps 1-4, approaching cars, and floating fuel request badges were blocked by the roof, while enhancing the diorama with a futuristic, high-end neo-brutalist aesthetic.

## 2. Technical Architecture & Materials
- **Web 3D (Three.js)**:
  - `Mat.canopyGlass`: `new THREE.MeshLambertMaterial({ color: 0x9FD8F6, transparent: true, opacity: 0.34, depthWrite: false, side: THREE.DoubleSide })`
  - `Mat.canopyTruss`: `new THREE.MeshLambertMaterial({ color: 0x2A323D })`
  - `Mat.canopyFascia`: Red brand ribbon (`Mat.redTrim`) and front `"PIXELOIL"` logo stencil plaque.
  - Steel Truss Lattice: 4 longitudinal and 3 transverse structural I-beams forming a modern architectural skylight grid.
  - LED Spotlights: 4 down-facing island fixtures preserved for night mode ambient illumination.
- **Godot 4**:
  - `godot_station/scenes/Canopy.tscn`: CSGBox3D with semi-transparent glass material (`albedo_color = Color(0.62, 0.85, 0.96, 0.35)`), perimeter brand trim, and steel frame lattice.

## 4. Canopy Visibility & Cutaway Toggle Controls
- **Settings Modal Integration**: Added "Kanopi / Çatı Görünürlüğü" toggle switch in the Graphics tab of the Settings modal (`#btn-toggle-canopy`).
- **Quick HUD Bar Integration**: Added `#btn-quick-toggle-canopy` in `#camera-controls-bar` for one-touch roof toggle directly from the HUD.
- **Keyboard Shortcut**: `T` key instantly toggles canopy visibility.
- **LocalStorage Persistence**: Player choice saved in `localStorage.setItem('pixeloil_canopy_vis', ...)` and auto-restored on boot.
- **Dual-Engine Parity**: `EventBus.canopy_visibility_changed` signal and `KEY_T` hotkey synchronized in Godot 4.

## 5. Success Criteria
- [x] All 4 pump bays (Pump 1, 2, 3, 4) clearly visible through the canopy from the default isometric camera angle `(32, 28, 32)`.
- [x] Approaching and parked vehicle roofs, colors, and `[ FUEL X L ]` sprite badges visible with zero visual blockage.
- [x] Canopy maintains realistic corporate station silhouette, pillars, fascia branding, and night spotlights.
- [x] In-game Settings modal and quick HUD toolbar allows toggling canopy visibility ON/OFF dynamically.
- [x] Dual-engine parity maintained between `web_3d_station/` and `godot_station/`.
- [x] JavaScript syntax passes `node -c web_3d_station/game.js` with 0 errors.
