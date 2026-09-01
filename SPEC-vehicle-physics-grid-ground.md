# Spec: vehicle-physics-grid-ground (Faz 8 — Araç Kinematik Sürüş Fiziği ve Koyu Endüstriyel Grid Zemin Tasarımı)

## Objective
PixelOil 3D benzin istasyonunda (Web 3D Three.js ve Godot 4 motorlarında eş zamanlı) araçların istasyona giriş, manevra ve çıkış hareketlerini pürüzsüz, gerçekçi ve kontrollü bir kinematiğe kavuşturmak; anında yön değiştirme (snap), geri geri yanaşma veya 180° ters dönme sorununu çözmek; araç hızlarını tycoon atmosferine uygun seviyeye çekmek. Ayrıca, istasyon zeminini düz açık renk/beyaz beton yerine, koyu antrasit tonlarında, üzerinde endüstriyel kare ızgaralar (grid), araç yanaşma kılavuz çizgileri ve güvenlik bordürleri barındıran prosedürel bir diorama zeminine dönüştürmek.

## Tech Stack
- **Web 3D:** Three.js r128, Vanilla JavaScript (`game.js`), Canvas 2D Procedural Texture Generation, HTML5 WebGL
- **Godot 4:** Godot 4 Forward+ / Mobile, GDScript 2.0 (`Car.gd`, `CarSpawner.gd`, `Diorama.tscn`)
- **Tasarım:** 16-Bit Low-Poly Neo-Brutalist, Koyu Antrasit Asfalt Grid Paleti, Unicode Emoji Yasağı, TR/EN Dinamik Dil Desteği

## Commands
- **Web 3D Sunucu:** `python -m http.server 8000 --bind 127.0.0.1`
- **Statik / Sözdizimi Kontrolü:** `node -c web_3d_station/game.js`
- **Godot Doğrulama:** GDScript derleme / sahne referans kontrolü

## Project Structure
```text
myminimarket/
├── web_3d_station/
│   ├── game.js            → Vehicle sınıfı (kinematik hız, yaw lerp, tekerlek dönüşü, ivmelenme) & createStationGroundGridTexture()
│   ├── style.css          → Arayüz ve diorama zemin kontrast uyumu
│   └── index.html         → WebGL canvas kapsayıcısı ve HUD
└── godot_station/
    ├── scenes/
    │   ├── Car.tscn       → Araç gövde ve yönelim referansı (+Z yönelim uyumu)
    │   └── Diorama.tscn   → Zemin ızgara materyali ve yol şeritleri
    └── scripts/
        ├── Car.gd         → Yumuşak yönelim lerp_angle, ivmelenme/yavaşlama ve pürüzsüz waypoint takibi
        └── CarSpawner.gd  → İstasyona giriş ve pompa yanaşma waypoint yayları
```

## Code Style
```javascript
// Web 3D: Kinematik Açısal Dönüş (Shortest-Path Yaw Lerp) ve Hız Eğrisi
function lerpAngle(current, target, factor) {
  let diff = (target - current) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * factor;
}

// Araç hareketi: Hız vektöründen hedef açıyı belirleme ve yumuşak direksiyon
const moveAngle = Math.atan2(dx, dz);
this.mesh.rotation.y = lerpAngle(this.mesh.rotation.y, moveAngle, 0.08 * State.timeSpeed);
```

## Testing Strategy
- **Sözdizimi ve Statik Kontrol:** `node -c web_3d_station/game.js` komutu ile JS parse hatasızlığı doğrulanır.
- **Dual-Engine Uyum Kontrolü:** GDScript ve Three.js tarafındaki araç hızları, waypoint mantığı ve zemin ölçüleri birebir denk tutulur.
- **Kullanıcı Manuel Oynanış Testi:** Kullanıcı tarayıcı üzerinden `http://localhost:8000` adresinde araçların yanaşma açılarını ve zemin desenini bizzat test eder (AGENTS.md gereği otomatik browser botu kullanılmaz).

## Boundaries
- **Always:**
  - Araç yönelimi hesaplanırken en kısa açı farkı (shortest-path angle lerp) kullanılacak, açı taşmalarında 360°/180° ters dönme engellenecektir.
  - Zemin prosedürel dokusu Three.js CanvasTexture ile yüksek performanslı ve draw-call dostu üretilecektir.
  - Yapılan tüm değişiklikler hem `web_3d_station` hem de `godot_station` sürümlerine senkronize aktarılacaktır.
- **Ask first:**
  - Oyunun ekonomik dengesini veya araç bekleme/dolum sürelerini kökten değiştirecek radikal kural değişiklikleri.
- **Never:**
  - Harici ağır fizik motorları (Ammo.js, Rapier, Cannon.js) projeye dahil edilmeyecektir.
  - Zemin üzerine veya araçlara standart unicode emojiler eklenmeyecektir.
  - Otomatik tarayıcı botu / browser subagent ile oynanış simülasyonu başlatılmayacaktır.

## Success Criteria
1. Araçlar otoyoldan istasyona girerken, pompaya yanaşırken ve çıkış yaparken ani açı sıçraması (snap) yapmadan, tekerlek yönlerine ve hareket vektörlerine uygun yumuşak bir kavisle (yaw lerp) döner.
2. Araçların seyir hızları makul ve sakin bir seviyeye (~0.05-0.07 birim/frame) çekilir; kalkışta hafif ivmelenme, duruşta yumuşak yavaşlama uygulanır.
3. Düz açık renk/beyaz zemin kaldırılır; yerine koyu antrasit (#222831) zemin üzerinde brutalist endüstriyel kare ızgara (grid), sarı/beyaz güvenlik çizgileri ve pompa yanaşma alanları içeren estetik bir doku uygulanır.
4. Godot 4 sürümündeki `Car.gd` ve `Diorama.tscn` yapıları Three.js sürümü ile birebir senkronize edilir.
