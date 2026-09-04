#!/usr/bin/env node
// =========================================================
// PixelOil 3D - Yerlesim & Kontrast Dogrulama Betigi (Paket 4)
// Calisma zamanina dahil DEGILDIR; yalnizca gelistirme araci.
//
// Kullanim:
//   node web_3d_station/tools/verify-layout.js
//
// Uc olcumu tekrarlanabilir hale getirir (bkz. MIMARI_YENILEME_PLANI.md):
//   1) Cakisma denetimi   - ayni blok ici >=1.2 m, bloklar arasi >=4.0 m hedef
//   2) Plato denetimi     - hicbir bina/onluk plateauR disina tasmamali
//   3) Kontrast denetimi  - --accent-*/--on-* ciftleri WCAG AA (4.5:1) gecmeli
// =========================================================

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const GAME_JS = path.join(ROOT, "game.js");
const STYLE_CSS = path.join(ROOT, "style.css");

let exitCode = 0;

// ---------------------------------------------------------
// Ortak yardimcilar
// ---------------------------------------------------------

function readSrc(file) {
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

function extractPlots(src) {
  const lines = src.split("\n");
  const start = lines.findIndex(l => /^const PLOTS = \{/.test(l));
  if (start < 0) throw new Error("PLOTS bulunamadi");
  let depth = 0, end = start;
  for (let i = start; i < lines.length; i++) {
    depth += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
    if (i > start && depth <= 0) { end = i; break; }
  }
  const block = lines.slice(start, end + 1).join("\n");
  const plots = {};
  const re = /(\w+):\s*\{\s*id:\s*'(\w+)'[^}]*?pos:\s*new THREE\.Vector3\(([^)]+)\)[^}]*?\}/g;
  let m;
  while ((m = re.exec(block))) {
    const [x, y, z] = m[3].split(",").map(s => parseFloat(s.trim()));
    plots[m[2]] = { id: m[2], x, y, z };
  }
  return plots;
}

function fnBody(lines, fnName) {
  const s = lines.findIndex(l => l.startsWith("function " + fnName + "("));
  if (s < 0) return "";
  let d = 0;
  for (let i = s; i < lines.length; i++) {
    d += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
    if (i > s && d <= 0) return lines.slice(s, i + 1).join("\n");
  }
  return "";
}

// Bir spawn*Mesh fonksiyonundan yerel eksende [minx,maxx,minz,maxz] ayak izi cikarir.
function footprintOf(lines, fnName) {
  const body = fnBody(lines, fnName);
  if (!body) return null;
  const bLines = body.split("\n");
  let minx = 0, maxx = 0, minz = 0, maxz = 0, found = false;
  const pend = [];
  bLines.forEach(l => {
    // Paylasilan prop kutuphanesinden gelen dekoratif objeler (bollard,
    // trash bin, palet istifi, vb.) yapisal ayak izine sayilmaz - bunlar
    // THREE.Group dondurur, kendi geometrisi bu fonksiyon govdesinde
    // gorunmez. Sifir-yarim-genislikli bir yer tutucu itiyoruz ki hemen
    // sonraki propX.position.set() cagrisi BUNU tuketsin (ihmal edilebilir
    // katki) ve altta bekleyen GERCEK (henuz tuketilmemis, degiskenli
    // position.set nedeniyle atlanmis) geometri girdilerini bozmasin.
    if (/=\s*prop[A-Z]\w*\(/.test(l)) { pend.push([0, 0]); return; }
    const g = l.match(/new THREE\.(Box|Cylinder)Geometry\(([^)]*)\)/);
    if (g) {
      const a = g[2].split(",").map(s => parseFloat(s));
      let hw, hd;
      if (g[1] === "Box") { hw = a[0] / 2; hd = a[2] / 2; }
      else { const r = Math.max(a[0] || 0, a[1] || 0); hw = hd = r; }
      if (isFinite(hw) && isFinite(hd)) pend.push([hw, hd]);
    }
    const p = l.match(/position\.set\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);
    const px = l.match(/position\.x\s*=\s*(-?[\d.]+)/);
    const pz = l.match(/position\.z\s*=\s*(-?[\d.]+)/);
    if ((p || px || pz) && pend.length) {
      const [hw, hd] = pend[pend.length - 1];
      const x = p ? +p[1] : (px ? +px[1] : 0);
      const z = p ? +p[3] : (pz ? +pz[1] : 0);
      minx = Math.min(minx, x - hw); maxx = Math.max(maxx, x + hw);
      minz = Math.min(minz, z - hd); maxz = Math.max(maxz, z + hd);
      found = true;
    }
  });
  pend.forEach(([hw, hd]) => {
    minx = Math.min(minx, -hw); maxx = Math.max(maxx, hw);
    minz = Math.min(minz, -hd); maxz = Math.max(maxz, hd);
    found = true;
  });
  return found ? { minx, maxx, minz, maxz } : null;
}

// FACILITY_APRONS dizisini [{key,w,d,cx,cz}] olarak cikarir.
function extractAprons(src) {
  const m = src.match(/const FACILITY_APRONS = \[([\s\S]*?)\n  \];/);
  if (!m) return [];
  const rows = [...m[1].matchAll(/key:\s*'(\w+)'[^}]*?dim:\s*\[([^\]]+)\][^}]*?center:\s*\[([^\]]+)\]/g)];
  return rows.map(r => {
    const [w, , d] = r[2].split(",").map(s => parseFloat(s));
    const [cx, , cz] = r[3].split(",").map(s => parseFloat(s));
    return { key: r[1], w, d, cx, cz };
  });
}

// ---------------------------------------------------------
// 1) CAKISMA DENETIMI
// ---------------------------------------------------------

function checkCollisions(src) {
  console.log("\n=== 1) Cakisma Denetimi (hedef: blok ici >=1.2 m, bloklar arasi >=4.0 m) ===");
  const lines = src.split("\n");
  const PLOTS = extractPlots(src);
  const FN_MAP = {
    wash: "spawnCarWashMesh", market: "spawnMarketBayMesh", tire_shop: "spawnTireShopMesh",
    lube_bay: "spawnLubeBayMesh", vacuum_hub: "spawnVacuumHubMesh", truck_stop: "spawnTruckStopMesh",
    ev: "spawnEvChargerMesh", bakery_drive: "spawnBakeryDriveMesh", moto_dock: "spawnMotoDockMesh",
    pet_park: "spawnPetParkMesh", turbine: "spawnTurbineMesh", hydrogen_bay: "spawnHydrogenBayMesh",
    food_truck: "spawnFoodTruckMesh", rest_lounge: "spawnRestLoungeMesh", parcel_hub: "spawnParcelHubMesh",
    atm_hub: "spawnAtmHubMesh"
  };

  const boxes = [];
  for (const key in FN_MAP) {
    const plot = PLOTS[key];
    if (!plot) { console.log("  ! PLOTS icinde bulunamadi: " + key); continue; }
    const fp = footprintOf(lines, FN_MAP[key]);
    if (!fp) { console.log("  ! ayak izi olculemedi: " + key); continue; }
    boxes.push({
      n: key,
      x0: plot.x + fp.minx, x1: plot.x + fp.maxx,
      z0: plot.z + fp.minz, z1: plot.z + fp.maxz
    });
  }

  let collisions = 0, tight = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const gx = Math.max(a.x0, b.x0) - Math.min(a.x1, b.x1);
      const gz = Math.max(a.z0, b.z0) - Math.min(a.z1, b.z1);
      const gap = Math.max(gx, gz);
      if (gap < 0) {
        collisions++;
        console.log("  CAKISMA  " + gap.toFixed(2) + " m   " + a.n + " <-> " + b.n);
      } else if (gap < 1.2) {
        tight++;
        console.log("  DAR      " + gap.toFixed(2) + " m   " + a.n + " <-> " + b.n);
      }
    }
  }
  console.log("Sonuc: " + collisions + " cakisma, " + tight + " tesis (1.2 m altinda, cakisma degil)");
  return collisions;
}

// ---------------------------------------------------------
// 2) PLATO DENETIMI
// ---------------------------------------------------------

function checkPlateau(src) {
  console.log("\n=== 2) Plato Denetimi ===");
  const rM = src.match(/const plateauR = ([\d.]+);/);
  if (!rM) { console.log("  ! plateauR bulunamadi"); return 1; }
  const R = parseFloat(rM[1]);
  const CZ = 2; // getPlanetoidElevation merkez Z ofseti
  console.log("plateauR = " + R + " (merkez 0," + CZ + ")");

  const lines = src.split("\n");
  const PLOTS = extractPlots(src);
  const FN_MAP = {
    wash: "spawnCarWashMesh", market: "spawnMarketBayMesh", tire_shop: "spawnTireShopMesh",
    lube_bay: "spawnLubeBayMesh", vacuum_hub: "spawnVacuumHubMesh", truck_stop: "spawnTruckStopMesh",
    ev: "spawnEvChargerMesh", bakery_drive: "spawnBakeryDriveMesh", moto_dock: "spawnMotoDockMesh",
    pet_park: "spawnPetParkMesh", turbine: "spawnTurbineMesh", hydrogen_bay: "spawnHydrogenBayMesh",
    food_truck: "spawnFoodTruckMesh", rest_lounge: "spawnRestLoungeMesh", parcel_hub: "spawnParcelHubMesh",
    atm_hub: "spawnAtmHubMesh"
  };

  let overflow = 0;
  for (const key in FN_MAP) {
    const plot = PLOTS[key];
    const fp = plot && footprintOf(lines, FN_MAP[key]);
    if (!plot || !fp) continue;
    let worst = 0;
    [[fp.minx, fp.minz], [fp.minx, fp.maxz], [fp.maxx, fp.minz], [fp.maxx, fp.maxz]].forEach(([lx, lz]) => {
      const x = plot.x + lx, z = plot.z + lz;
      worst = Math.max(worst, Math.hypot(x, z - CZ));
    });
    if (worst > R) {
      overflow++;
      console.log("  TASIYOR (bina)  " + key + "  r=" + worst.toFixed(2) + "  (+" + (worst - R).toFixed(2) + " m)");
    }
  }

  const aprons = extractAprons(src);
  aprons.forEach(a => {
    let worst = 0;
    [[-a.w / 2, -a.d / 2], [-a.w / 2, a.d / 2], [a.w / 2, -a.d / 2], [a.w / 2, a.d / 2]].forEach(([lx, lz]) => {
      const x = a.cx + lx, z = a.cz + lz;
      worst = Math.max(worst, Math.hypot(x, z - CZ));
    });
    if (worst > R) {
      overflow++;
      console.log("  TASIYOR (onluk) " + a.key + "  r=" + worst.toFixed(2) + "  (+" + (worst - R).toFixed(2) + " m)");
    }
  });

  console.log("Sonuc: " + overflow + " plato tasmasi");
  return overflow;
}

// ---------------------------------------------------------
// 3) KONTRAST DENETIMI (WCAG AA, esik 4.5:1)
// ---------------------------------------------------------

function relLuminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const lin = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relLuminance(hex1), l2 = relLuminance(hex2);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(css) {
  console.log("\n=== 3) Kontrast Denetimi (WCAG AA esigi: 4.5:1) ===");
  const vars = {};
  [...css.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)].forEach(m => { vars[m[1]] = m[2]; });

  const pairs = [
    ["accent-red", "on-red"], ["accent-green", "on-green"], ["accent-orange", "on-orange"],
    ["accent-blue", "on-blue"], ["accent-gold", "on-gold"], ["deep-asphalt", "on-asphalt"]
  ];

  let fails = 0;
  pairs.forEach(([bgName, fgName]) => {
    const bg = vars[bgName], fg = vars[fgName];
    if (!bg || !fg) { console.log("  ! token eksik: --" + bgName + " / --" + fgName); return; }
    const ratio = contrastRatio(bg, fg);
    const ok = ratio >= 4.5;
    if (!ok) fails++;
    console.log("  " + (ok ? "OK  " : "FAIL") + " --" + bgName + " (" + bg + ") x --" + fgName + " (" + fg + ")  = " + ratio.toFixed(2) + ":1");
  });
  console.log("Sonuc: " + fails + " kontrast ihlali");
  return fails;
}

// ---------------------------------------------------------
// Calistir
// ---------------------------------------------------------

const gameSrc = readSrc(GAME_JS);
const cssSrc = readSrc(STYLE_CSS);

const collisions = checkCollisions(gameSrc);
const plateauOverflow = checkPlateau(gameSrc);
const contrastFails = checkContrast(cssSrc);

console.log("\n=== OZET ===");
console.log("Cakisma: " + collisions + "  |  Plato tasmasi: " + plateauOverflow + "  |  Kontrast ihlali: " + contrastFails);

if (collisions > 0 || plateauOverflow > 0 || contrastFails > 0) {
  exitCode = 1;
  console.log("\nSonuc: BASARISIZ");
} else {
  console.log("\nSonuc: TUM DENETIMLER GECTI");
}

process.exit(exitCode);
