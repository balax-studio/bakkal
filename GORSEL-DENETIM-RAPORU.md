# PixelOil 3D — Görsel Denetim & İyileştirme Raporu

**Tarih:** 2026-09-03
**Kapsam:** `web_3d_station/` (Three.js — birincil render motoru), `godot_station/` (Godot 4), `lib/` (Flutter 2.5D)
**Yöntem:** Statik kod analizi. AGENTS.md §5 gereği hiçbir tarayıcı otomasyonu / oyun içi test çalıştırılmadı; tüm bulgular kod okumasıyla doğrulandı ve satır numarasıyla referanslandı.

> Not: Mesajın sonundaki `/promp-optimizer` bu oturumda kayıtlı bir skill değil (mevcut skill listesinde yok), o yüzden çağrılmadı. Adını doğru yazarsan (veya hangi işi yapmasını beklediğini söylersen) onu da çalıştırırım.

---

## Yönetici Özeti

Toplam **24 görsel sorun** tespit edildi. Bunlardan **5 tanesi oyunu her oturumda gözle görülür şekilde bozuyor** ve öncelikle düzeltilmeli:

| # | Sorun | Etki |
|---|---|---|
| B-01 | Klima damlası partikülü paylaşılan `Mat.glass` materyalini animasyonla söndürüyor | Oyundaki **tüm camlar** (market vitrini, araç camları, otobüs pencereleri) her 2.8 sn'de bir sönüp yanıyor |
| B-02 | 4 mesh üretici fonksiyon iki kez tanımlı; eski/basit sürümler yenilerini eziyor | Oto Yıkama, GES, Türbin, EV Şarj için **Seviye 2 ve 3 görselleri hiç görünmüyor** |
| B-03 | `renderer.outputEncoding` hiç ayarlanmıyor (r128'de `outputColorSpace` yok) | Tüm sahne yanlış gamma ile render ediliyor — soluk, mat, cansız renkler |
| B-04 | Toast bildirimleri modalların arkasında kalıyor (z-index 100 < 999) | İnşaat/sipariş/tarife onay mesajlarının **hiçbiri görünmüyor** |
| B-05 | Market Bay tesisi asfalt önlüğün 14 m dışında, çimenin üstüne kuruluyor | Bina havada/kopuk duruyor, Moto Swap parseliyle çakışıyor |

Ayrıca kod tabanında **7462 satırda sadece 2 adet `dispose()` çağrısı** var — uzun oturumlarda sürekli GPU bellek sızıntısı oluşuyor.

---

## BÖLÜM A — KRİTİK GÖRSEL HATALAR

### B-01 · Tüm camlar periyodik olarak yanıp sönüyor 🔴

**Yer:** [game.js:4631](web_3d_station/game.js:4631), [game.js:6588](web_3d_station/game.js:6588)

Klima ünitesinin su damlası partikülü paylaşılan `Mat.glass` materyaliyle üretiliyor:

```js
const drop = new THREE.Mesh(new THREE.BoxGeometry(0.03,0.05,0.03), Mat.glass);
particles.push({ mesh: drop, mat: drop.material, ... });   // mat === Mat.glass
```

`updateParticles()` ise partikül ömrü boyunca `p.mat.opacity` değerini 0.85'ten 0'a düşürüp sonunda `p.mat.dispose()` çağırıyor. `Mat.glass` sahnede **18 farklı mesh** tarafından kullanılıyor (market vitrini, otomatik kapı, içecek dolabı, oto yıkama camları, market anneksi, araç camları, otobüs/minibüs pencereleri). Sonuç: her 2.8 saniyede bir oyundaki bütün camlar solup kayboluyor, sonra aniden geri geliyor. Aynı sorun `Mat.steam` için de geçerli.

**Çözüm:** Partiküller asla paylaşılan materyal kullanmamalı.
```js
const drop = new THREE.Mesh(geo, Mat.glass.clone());
```
ve `updateParticles` içindeki `p.mat.dispose()` sadece klonlanmış materyaller için çalışmalı (partikül objesine `owned: true` bayrağı ekle).

---

### B-02 · Tesis Seviye 2/3 görselleri hiç görünmüyor 🔴

**Yer:** [game.js:2622](web_3d_station/game.js:2622) vs [game.js:4697](web_3d_station/game.js:4697) ve 3 benzeri

Dört fonksiyon **iki kez** tanımlanmış:

| Fonksiyon | Zengin/kademeli sürüm | Eski basit sürüm (kazanan) |
|---|---|---|
| `spawnCarWashMesh` | satır 2622 | satır 4697 |
| `spawnSolarPanelsMesh` | satır 2823 | satır 4724 |
| `spawnTurbineMesh` | satır 2857 | satır 4740 |
| `spawnEvChargerMesh` | satır 2925 | satır 4770 |

JavaScript'te aynı kapsamda iki `function` bildirimi olduğunda **sonuncusu kazanır**. Yani her zaman eski, `level` parametresini yok sayan basit sürümler çalışıyor. Kaybolan içerik:

- Oto Yıkama: L2 döner fırçalı tünel, L3 kapalı fütüristik tünel (LED portal, kurutma türbinleri, trafik lambası)
- GES: kademeli panel sayısı + inverter kutusu
- Türbin: 15.5 m / 18 m gövde, havacılık flaşörü, ikincil mikro-rotor, batarya bankı
- EV Şarj: çift 350 kW totem, güneş kanopili L3 hub, zemin kılavuz şeritleri

Ayrıca eski sürümlerdeki `if (carWashGroup) return;` guard'ı yükseltmede mesh'in yeniden kurulmasını da engelliyor.

**Çözüm:** 4697–4790 arasındaki dört eski fonksiyonu tamamen sil. Silmeden önce kademeli sürümlerdeki **yanlış konumları** düzelt (B-05 ile aynı sorun):

| Fonksiyon | Kademeli sürümdeki konum | Olması gereken (`PLOTS`) |
|---|---|---|
| `spawnCarWashMesh` | `(16, 0.04, -2)` | `(16.25, 0.04, 2.0)` |
| `spawnSolarPanelsMesh` | `(0, 4.55, -9.5)` | `(0, 4.55, -10.0)` |
| `spawnTurbineMesh` | `(-22, 0.04, -8)` | `(-22, 0.04, -13.0)` |
| `spawnEvChargerMesh` | `(-8, 0.04, 4)` | `(-16.25, 0.04, 3.5)` |

Hepsini `group.position.copy(PLOTS.<key>.pos)` haline getir — diğer 12 tesis zaten böyle yapıyor.

---

### B-03 · Renk uzayı ayarlanmamış — sahne soluk render ediliyor 🔴

**Yer:** [game.js:1098](web_3d_station/game.js:1098), [index.html:13](web_3d_station/index.html:13)

```js
if ('outputColorSpace' in renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
```

Proje **Three.js r128** (2021) kullanıyor. Bu sürümde `outputColorSpace` özelliği yok — API'nin adı `outputEncoding`. Dolayısıyla bu blok her zaman atlanıyor ve renderer varsayılan `LinearEncoding` ile kalıyor. ACESFilmic tone mapping (satır 1094) sRGB çıkış olmadan uygulandığı için tüm palet **soluk, düşük kontrastlı ve doygunluğu kaçmış** görünüyor. "16-bit canlı tycoon paleti" hedefinin doğrudan karşısında.

Aynı şekilde `CanvasTexture`'ların hiçbirinde (`game.js` içinde 8 adet) encoding ayarlanmamış — zemin ızgarası ve tabela yazıları da yanlış gamma ile çiziliyor.

**Çözüm (r128 kalacaksa):**
```js
renderer.outputEncoding = THREE.sRGBEncoding;
// ve her renk dokusu için:
tex.encoding = THREE.sRGBEncoding;
```
**Tavsiye edilen:** Three.js'i r160+ ES module + importmap'e taşı. r128 CDN'den geliyor (`cdnjs` + `jsdelivr`) — mobil mağaza paketlemesinde çevrimdışı açılışta **oyun hiç açılmaz**. Kütüphaneyi yerelleştir.

---

### B-04 · Toast bildirimleri modalların arkasında kalıyor 🔴

**Yer:** [style.css:753](web_3d_station/style.css:753) (`z-index: 100`) vs [style.css:393](web_3d_station/style.css:393) (`z-index: 999`)

İnşaat, personel eğitimi, tanker siparişi, tarife güncelleme, tema uygulama, arsa alımı — hepsi modal açıkken `showToast()` çağırıyor. Modal overlay z-index 999, toast container 100. Oyuncu **hiçbir onay mesajını göremiyor**.

**Çözüm:** `#toast-container { z-index: 1200; }` ve alt/sağ kenarlara `env(safe-area-inset-*)` ekle (şu an tek safe-area koruması olmayan HUD elemanı).

---

### B-05 · Market Bay asfaltın dışında, çimenin üstünde 🔴

**Yer:** [game.js:2733](web_3d_station/game.js:2733)

```js
marketBayGroup.position.set(-14, 0.04, -8);
```

`PLOTS.market.pos` ise `(0, 0.04, -10.0)`. Ana asfalt önlük X:[-12, 12] aralığında olduğu için bina **önlüğün 2 m dışında, çimenin üstünde** duruyor. `spawnMarketBayMesh` ayrıca `updateStationApronExpansion()` çağırmıyor, yani altına asfalt da gelmiyor. Üstelik `(-15.75, -8)` konumundaki **Moto Swap parseliyle çakışıyor** — AGENTS.md §7 "sıfır çakışma" kuralının ihlali.

İkincil sorun: `PLOTS.market.pos = (0, -10)` zaten ana market binasının **içinde** — inşaat rozeti binanın içinde havada duruyor, inşa edilince ise annex 14 m ötede beliriyor.

**Çözüm:** Market annexini binanın doğu kanadına bitişik, önlük içinde konumlandır (örn. `(6.0, 0.04, -10.0)`), `PLOTS.market.pos`'u rozet görünür olacak şekilde bina ön cephesine taşı (`(0, 0.04, -6.2)`), ve `updateStationApronExpansion()` çağrısını ekle + `FACILITY_APRONS` listesine `market` girdisi ekle.

---

## BÖLÜM B — YÜKSEK ÖNCELİKLİ GÖRSEL HATALAR

### B-06 · Asfalt önlük genişlemelerinde z-fighting ve doku uyumsuzluğu 🟠

**Yer:** [game.js:1468–1530](web_3d_station/game.js:1468)

Üç ayrı sorun:

1. **Materyal uyumsuzluğu:** Ana önlük `Mat.apronGrid` (1024px prosedürel ızgara dokusu, peron çizgileri, sarı köşe braketleri) kullanırken genişleme dilimleri düz `Mat.asphalt` kullanıyor. AGENTS.md §8'in istediği "seamless apron connector" yerine gözle görülür renk/doku sınırı oluşuyor.

2. **Üst üste binen eş düzlemli dilimler → z-fighting:** Aynı `y = 0.08` yüksekliğinde çakışan çiftler:
   - `tire_shop` (Z: -7.25…-1.75) ∩ `wash` (Z: -2.5…6.5) → X:[12, 20.5] bandında çakışma
   - `vacuum_hub` (X: 12…20) ∩ `truck_stop` (X: 19…29) → X:[19, 20] bandında çakışma
   - `parcel_hub`, `atm_hub`, `food_truck` — üçü de **tamamen ana önlüğün içinde**, yani detaylı ızgara dokusunun üstüne düz gri dikdörtgenler basıyor ve titriyor.

3. **Kalıcı beton bordür bariyeri:** [game.js:1743](web_3d_station/game.js:1743) `eastCurb`/`westCurb` X = ±12'de sabit duruyor ve önlük genişlediğinde kaldırılmıyor — yeni asfaltla ana önlük arasında **bir bordür duvarı** kalıyor, araçlar içinden geçiyor.

**Çözüm:**
- Genişleme dilimlerini de `Mat.apronGrid` ile çiz (`map.repeat` ile dilim boyutuna göre ölçekle) veya en azından ızgara ile aynı taban rengini kullan.
- Ana önlüğün içine düşen tesisler (`parcel_hub`, `atm_hub`, `food_truck`) için dilim üretme — sadece bordür/çizgi ekle.
- Çakışan dilimler için tek bir birleşik bounding-box hesapla, ya da `y` değerlerini 0.001 kademelendir (`0.080`, `0.081`, `0.082`).
- Bordürleri `stationApronExtensionsGroup` içine taşı ve `updateStationApronExpansion()` içinde açılan yönlerdeki segmentleri atla.

---

### B-07 · Araç hareketi kare hızına bağlı 🟠

**Yer:** [game.js:6805](web_3d_station/game.js:6805), [game.js:5060](web_3d_station/game.js:5060)

```js
cars[i].update();                    // delta GEÇİLMİYOR
update(delta = 0.016) { ... }        // her zaman varsayılan
this.mesh.position.x += (dx/dist) * this.currentSpeed * State.timeSpeed;  // kare başına
```

Araç konumu, direksiyon açısı, tekerlek dönüşü ve `stallTime` hep **kare başına** ilerliyor. Sonuç:
- 120 Hz ekranda araçlar 2× hızlı, 30 FPS'te yarı hızda
- FPS düştüğünde araçlar ağır çekim, yükseldiğinde ileri sarma gibi görünüyor
- Arka plan trafiği (`BypassVehicle.update(delta)`) doğru delta kullanıyor → **iki trafik akışı farklı hızlarda**, aynı yolda tutarsızlık

Ek olarak `animate()` içinde `delta` hiç kırpılmıyor: sekme arka plana alınıp geri gelince tek karede saniyelerce delta gelir → günlük döngü sıçrar, bulutlar/partiküller ışınlanır.

**Çözüm:**
```js
const delta = Math.min((now - lastTime) / 1000, 0.1);   // clamp
...
cars[i].update(delta);
```
ve `Vehicle.update` içindeki tüm `+=` hareketlerini `* delta * 60` normalize et (veya hızları birim/saniye cinsine çevir).

---

### B-08 · Kanopiyi gizlemek market tentesinin camını da yok ediyor 🟠

**Yer:** [game.js:6905](web_3d_station/game.js:6905), [game.js:1269](web_3d_station/game.js:1269)

`updateCanopyAnimation` paylaşılan `Mat.canopyGlass.opacity` değerini doğrudan değiştiriyor. Bu materyal aynı zamanda market girişindeki tente camı (`awningGlass`) tarafından da kullanılıyor. Ayarlardan "Kanopi Görünürlüğü" kapatıldığında **market tentesinin camı da kayboluyor.**

Ayrıca 4 adet peron aydınlatması `PointLight` kanopi çatısının çocuğu — kanopi geri çekilince ışıklar pompaların üstünden Z: -6.2'ye kayıyor, geceleri pompalar karanlıkta kalıyor.

**Çözüm:** Kanopi çatısı için ayrı bir materyal instance kullan (`Mat.canopyGlass.clone()`), ışıkları `canopyGroup`'a (hareketsiz ana gruba) taşı.

---

### B-09 · Gölge ayarını kapatıp açmak sahneyi bozuyor 🟠

**Yer:** [game.js:6949](web_3d_station/game.js:6949)

```js
scene.traverse(obj => {
  if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }
});
```

Gölgeler tekrar açıldığında **her mesh** gölge yayıcı yapılıyor — zemin düzlemi, şeffaf ışık konileri, cam paneller, partiküller, rozet düzlemleri, bulutlar dahil. Sonuç: şeffaf ışık konileri ve camlar **opak gölge düşürmeye** başlıyor, sahnede olmayan siyah lekeler beliriyor; ayrıca gölge haritası çizim sayısı katlanıyor.

**Çözüm:** Sahne kurulurken her mesh'in orijinal bayrağını `obj.userData._castShadow` olarak sakla, geri açarken onu geri yükle. Alternatif: sadece `renderer.shadowMap.enabled` bayrağını çevir, mesh bayraklarına hiç dokunma (çok daha basit ve yeterli).

---

### B-10 · Yayılan buhar ve su damlaları hiç görünmüyor (NaN pozisyon) 🟠

**Yer:** [game.js:4613](web_3d_station/game.js:4613), [game.js:4634](web_3d_station/game.js:4634) vs [game.js:6577](web_3d_station/game.js:6577)

Rögar buharı ve klima damlası partikülleri şu şekilde ekleniyor:
```js
particles.push({ mesh, mat, vel: new THREE.Vector3(...), life, maxLife });
```
Ama `updateParticles` `p.vx`, `p.vy`, `p.vz` alanlarını okuyor (`spawnParticle` bunları kullanıyor). `vel` alanı hiç okunmuyor → `position.x += undefined * delta` → **NaN**. Mesh anında görünmez oluyor; ayrıca NaN pozisyon Three.js'in frustum culling bounding sphere hesabını da bozuyor.

**Çözüm:** `vel: v` yerine `vx: v.x, vy: v.y, vz: v.z` kullan, veya `updateParticles`'ı tek bir `vel` Vector3 sözleşmesine geçir ve `spawnParticle`'ı da ona uydur.

---

### B-11 · Rozetler ve inşaat panoları kameraya dönmüyor 🟠

**Yer:** [game.js:1931](web_3d_station/game.js:1931), [game.js:2290](web_3d_station/game.js:2290)

Parsel fiyat rozetleri (`PlaneGeometry` + sabit `rotation.x = -π/7`) ve inşaat şantiyesi ilerleme panosu düz düzlem olarak yerleştirilmiş, hiçbir billboard mantığı yok. Kamera sağ tıkla 360° dönebildiği için:

- Rozetler kenardan bakıldığında **çizgiye dönüşüyor** (okunmuyor)
- Arkadan bakıldığında `side: DoubleSide` sayesinde görünüyor ama **yazı ayna görüntüsü**
- Şantiye panosu `DoubleSide` bile değil → kameranın yarısında **tamamen kayboluyor**

**Çözüm:** İkisini de `THREE.Sprite` yap (araçların yakıt rozeti gibi — o doğru yapılmış, [game.js:4968](web_3d_station/game.js:4968)), veya her karede `mesh.quaternion.copy(camera.quaternion)` uygula.

---

### B-12 · Kanvas dokularındaki yazılar yanlış fontla çiziliyor 🟠

**Yer:** [game.js:1917](web_3d_station/game.js:1917), [game.js:4962](web_3d_station/game.js:4962), [game.js:3450](web_3d_station/game.js:3450)

Tüm 3D tabela ve rozet dokuları `ctx.font = 'bold 20px Plus Jakarta Sans, sans-serif'` ile çiziliyor ve `buildDiorama()` sayfa yüklenir yüklenmez çalışıyor. Google Fonts stylesheet'i henüz yüklenmemişse Canvas sessizce **sistem sans-serif'ine düşüyor** — 3D tabelaların tipografisi HUD'dan farklı oluyor ve bu doku bir daha çizilmiyor (dil değişene kadar).

**Çözüm:**
```js
await document.fonts.ready;   // veya document.fonts.load('bold 20px "Plus Jakarta Sans"')
initThree();
```

---

## BÖLÜM C — ORTA ÖNCELİKLİ SORUNLAR

### B-13 · HUD her karede DOM'a yazıyor (mobil FPS düşüşü) 🟡
[game.js:6755](web_3d_station/game.js:6755) — `updateHUD()`, `updateDayNightCycle()` içinden **her karede** çağrılıyor: 10 `getElementById`, 4 `style.width` yazması, `toLocaleString`. Her kare zorunlu layout tetikliyor. **Çözüm:** Değer değiştiğinde çağır, veya 200 ms'lik throttle uygula.

### B-14 · "Hedef Kare Hızı" ayarı hiçbir şey yapmıyor 🟡
[game.js:6981](web_3d_station/game.js:6981) — `setTargetFps()` sadece `localStorage`'a yazıp buton class'ı değiştiriyor; `animate()` içinde hiçbir frame limiter yok. 30 FPS pil tasarrufu seçeneği çalışmıyor. **Çözüm:** `animate()` içine `if (targetFps && now - lastRender < 1000/targetFps) return;` biriktirici ekle.

### B-15 · Grafik kalite profili sadece pixelRatio değiştiriyor 🟡
[game.js:6964](web_3d_station/game.js:6964) — Açıklamada "doku filtreleme kalitesi" vaat ediliyor ama anisotropy, gölge haritası boyutu (sabit 2048), partikül limiti hiç değişmiyor. **Çözüm:** Düşük profilde `shadow.mapSize = 1024`, `anisotropy = 1`, partikül limiti 15; yüksekte 2048/`getMaxAnisotropy()`/40.

### B-16 · 7 i18n anahtarı sözlükte yok — ekranda ham anahtar görünüyor 🟡
`index.html` içindeki şu `data-i18n` anahtarları `I18N.tr`/`I18N.en`'de tanımlı değil:
`rush_title`, `rush_sub`, `streak_subtitle`, `vault_cap_warning`, `vault_collect`, `vault_double`, `vault_time`

`t()` fallback olarak anahtarın kendisini döndürdüğü için, dil değiştirildikten sonra rush banner'da **"rush_title"** ve kasa modalında **"vault_collect"** yazıyor. Sözlükte `rush_banner_title`/`rush_banner_desc`/`vault_collect_btn`/`vault_double_btn` var — HTML yanlış anahtara bağlanmış. **Çözüm:** HTML anahtarlarını sözlükle eşle veya eksik 7 anahtarı TR+EN olarak ekle.

### B-17 · Sabit güneş — gün boyunca gölgeler hiç dönmüyor 🟡
[game.js:1113](web_3d_station/game.js:1113) — `sunLight.position` `(18, 30, 18)` olarak sabit. `updateSkyLighting()` sadece renk ve şiddet değiştiriyor. Şafakta, öğlende, gün batımında ve **gece ay ışığında bile** gölgeler tam aynı yöne düşüyor. 7 dakikalık gün döngüsünün en büyük sinematik kaybı. **Çözüm:** Saate göre yörünge:
```js
const a = ((h - 6) / 12) * Math.PI;
sunLight.position.set(Math.cos(a) * 34, Math.max(6, Math.sin(a) * 36), 18);
```

### B-18 · Kamera pan sınırında izometrik açı bozuluyor 🟡
[game.js:6797](web_3d_station/game.js:6797) — `animate()` içinde `controls.target` ±22/±18'e kırpılıyor ama `camera.position` telafi edilmiyor. `updateKeyboardCamera()` (satır 5325) bunu doğru yapıyor, animate loop yapmıyor. Fareyle sınıra doğru pan yapıldıkça kamera-hedef vektörü değişiyor ve **izometrik açı kayıyor**. Ayrıca Tır Peronu X = 24'te olduğu için ±22 sınırı yüzünden **ortalanamıyor**. **Çözüm:** Kırpma farkını `camera.position`'a da uygula ve sınırı ±26/±20'ye genişlet.

### B-19 · Zoom limitleri iki yerde farklı 🟡
[game.js:6286](web_3d_station/game.js:6286) `zoomCamera` 0.35–4.0 kırpıyor, [game.js:1128](web_3d_station/game.js:1128) `controls.minZoom/maxZoom` 0.55–3.5. Klavye ile sınır dışına çıkıldığında OrbitControls bir sonraki karede geri çekiyor → **görünür zıplama**. **Çözüm:** Tek sabit kullan.

### B-20 · Araç pompaya yanaşırken açı anında snap ediyor 🟡
[game.js:5165](web_3d_station/game.js:5165) — `_arriveAtPump()` içinde `this.mesh.rotation.y = Math.PI / 2` doğrudan atanıyor. Yumuşak kinematik dönüşten sonra son karede ani sıçrama görülüyor. **Çözüm:** Yönelimi `lerpAngle` ile 0.3 sn içinde hedefe getir (WAITING state'inde de sürdür).

### B-21 · Sürekli GPU bellek sızıntısı 🟡
7462 satırda sadece 2 `dispose()` çağrısı var. Sızdıran noktalar:
- `Vehicle.destroy()` ([game.js:5185](web_3d_station/game.js:5185)) — her araç kendi `CanvasTexture` (256×80) + `MeshLambertMaterial` yaratıyor, hiçbiri temizlenmiyor. Araçlar **5 saniyede bir** doğuyor.
- `updateStationApronExpansion()` — eski dilimler `remove` ediliyor ama geometry dispose edilmiyor.
- `spawn*Mesh()` — yükseltmede `scene.remove(group)` var, dispose yok.
- `updateTotemSign()` — her fiyat/dil değişiminde yeni 256×256 canvas.

**Çözüm:** Ortak bir `disposeGroup(obj)` yardımcısı yaz (`traverse` → `geometry.dispose()` + `material.map?.dispose()` + `material.dispose()`, paylaşılan `Mat.*` materyallerini atlayarak) ve tüm remove noktalarında çağır.

### B-22 · Tıklama her karede tüm sahneyi raycast ediyor 🟡
[game.js:5345](web_3d_station/game.js:5345) — `raycaster.intersectObjects(scene.children, true)` 64×64 arazi düzlemi, bulutlar, partiküller, tüm ağaçlar ve prop'lar dahil binlerce mesh'i geziyor. Mobilde dokunma gecikmesi hissediliyor. **Çözüm:** Etkileşimli objeleri (`isPump`, `isPlotSign`, `vehicle`) ayrı bir `interactables` dizisinde tut ve sadece onu raycast et; veya `THREE.Layers` kullan.

### B-23 · Otoyolda iki şerit de aynı yöne akıyor 🟡
Oyuncu araçları Z = 9.8 şeridinde +X yönüne, arka plan trafiği ([game.js:6531](web_3d_station/game.js:6531)) Z = 13.4 şeridinde de +X yönüne gidiyor. Ama yolda **çift sarı orta çizgi** (Z: 11.35 / 11.65) çizili — yani karşı yön şeridi olması gerekiyor. Görsel olarak trafiğin yarısı ters şeritte. Ayrıca 136 m'lik yolda sadece **4 arka plan aracı** var, otoyol boş görünüyor. **Çözüm:** Bypass araçlarının yarısını `-X` yönüne çevir (`rotation.y = -π/2`, `speed` negatif, X > 68'de reset) ve araç sayısını 8–10'a çıkar.

### B-24 · Kuşlar korkuluğun içine gömülü 🟡
[game.js:1859](web_3d_station/game.js:1859) — Kuşlar `y = 4.5, z = -6.4`'e yerleştirilmiş; market ön korkuluğunun üst kotu `y ≈ 4.98`, `z ≈ -6.75`. Kuşlar korkuluğun **0.5 m altında, duvarın içinde** duruyor. **Çözüm:** `y = 5.05, z = -6.75`.

---

## BÖLÜM D — MOTOR PARİTESİ (AGENTS.md §3 İHLALİ)

AGENTS.md §3 web ve Godot sürümlerinin eş zamanlı güncellenmesini şart koşuyor. Mevcut durum:

| Alan | `web_3d_station/` | `godot_station/` |
|---|---|---|
| Tesis state değişkenleri | 17 tesis | 17 tesis ✅ |
| **Tesis 3D mesh'leri** | ~40 mesh üretici fonksiyon | **0 — Diorama.tscn'de hiç yok** ❌ |
| İnşaat parselleri + rozetler | 20 parsel, kademeli kilit | **Yok** ❌ |
| Dinamik önlük genişlemesi | Var | **Yok** ❌ |
| Yaşayan dünya (kuş, koyun, kedi, buhar, NPC) | ~15 sistem | **Yok** ❌ |
| Arka plan otoyol trafiği | Var | **Yok** ❌ |
| Bulutlar / gökyüzü | 8 voxel bulut | **Yok** ❌ |
| Post-process | ACES tone mapping, bloom **yok** | ACES + **glow/bloom açık** ⚠️ |

`Diorama.tscn` içinde yalnızca: zemin, yol, 2 tünel, bina, kanopi, 4 pompa, tanklar, 8 ağaç, 2 lamba, 2 birikinti var. Godot sürümü şu an oynanabilir bir görsel eşdeğer değil, **iskelet bir sahne**.

Ayrıca `lib/` altındaki Flutter 2.5D izometrik sürüm üçüncü bir divergent dal: `CAPABILITY_MAP.md`'ye göre Faz 7–8 (`iso-hud-theme`, `iso-performance`) hâlâ tamamlanmamış.

**Öneri:** Üç motoru aynı anda taşımak yerine bir tanesini "kaynak-doğru" (source of truth) ilan et. `web_3d_station/` açık ara en olgun sürüm. Godot'yu ya ondan üretilen bir veri şemasıyla (JSON parsel/tesis tanımları) besle, ya da resmi olarak dondur.

---

## BÖLÜM E — MOBİL & MAĞAZA UYUMU (AGENTS.md §4)

### E-01 · Dokunma hedefleri 48×48px kuralının altında
AGENTS.md §4 minimum 48×48px istiyor. Mevcut değerler:

| Seçici | Mevcut | Mobilde |
|---|---|---|
| `.lang-chip` | 34×38 | 34×38 |
| `.debug-chip-btn` | 34 | 38 |
| `.settings-chip-btn` | 34 | 38×40 |
| `.cam-btn` | 40×40 | **36×36** |
| `.modal-close-btn` | 36×36 | 36×36 |
| `.fab-btn` | 48×48 ✅ | **42×42** ❌ |

Özellikle mobil medya sorgularında hedefler **küçültülüyor** — kuralın tam tersi. `.modal-close-btn` 36px olması iOS'ta modal kapatmayı zorlaştırıyor.

**Çözüm:** Tüm interaktif elemanlara `min-height: 48px; min-width: 48px;` taban değeri ver; görsel olarak küçük görünmesi gerekiyorsa iç ikonu küçült, hit alanını `padding` veya şeffaf `::after` ile büyüt.

### E-02 · Sabit px tipografi, mobilde okunmuyor
`style.css`'te 55 `font-size` kuralı, hepsi sabit `px`: **8px (1), 8.5px (3), 9px (2), 10px (5), 11px (15), 12px (14)**. Toplam 40 kural 12px ve altında. Küçük telefonlarda HUD sayaçları, tesis açıklamaları ve muhasebe tablosu okunmuyor; tablette de büyümüyor.

**Çözüm:** `clamp()` tabanlı ölçek kur:
```css
:root { --fs-xs: clamp(11px, 2.6vw, 13px); --fs-sm: clamp(12px, 3vw, 15px); }
```
ve 12px altındaki tüm değerleri bu değişkenlere taşı. Mağaza incelemelerinde okunabilirlik sık geri çevrilme sebebi.

### E-03 · Rush banner HUD üst barını örtüyor
`.rush-banner` `top: 8px; z-index: 95`, `#top-bar` `top: 10px; z-index: 20`. Rush saati başlayınca banner **kasa / gün / itibar çiplerinin üstüne biniyor**. **Çözüm:** Banner'ı `top: calc(64px + env(safe-area-inset-top))` altına al veya top-bar'ı `translateY` ile aşağı kaydır.

### E-04 · Toast container'da safe-area koruması yok
`#toast-container { bottom: 24px; right: 24px; }` — projedeki tek safe-area'sız yerleşim. iPhone yatay modda home indicator'ın altında kalıyor.

---

## BÖLÜM F — GÖRSEL İYİLEŞTİRME ÖNERİLERİ

Bunlar hata değil; mevcut "16-bit low-poly neo-brutalist tycoon" yönünü belirgin şekilde yükseltecek eklemeler. Etki/maliyet sırasına göre gruplandı.

### F-1 · Yüksek etki, düşük maliyet (ilk yapılacaklar)

**1. Yumuşak temas gölgeleri (contact shadows)**
Her araç, pompa, prop ve ağacın altına `CircleGeometry` + radyal alpha gradient dokulu şeffaf disk koy. Low-poly diorama'larda nesneleri zemine "oturtan" en ucuz numaradır; gerçek gölge haritası kapalıyken bile derinlik hissi verir. Tek paylaşılan doku, tek materyal, ~40 draw call.

**2. Vinyet + hafif renk derecelendirme (color grading)**
`EffectComposer` + `ShaderPass` ile tek geçişte: kenarlarda %18 vinyet, gölgelere hafif mavi, ışıklara hafif sıcak kayma (lift/gamma/gain). Sinematik diorama hissini anında getirir, maliyeti tek fullscreen quad.

**3. Selektif bloom (yalnızca ışıklı yüzeyler)**
`Mat.lampGlow`, `Mat.neonAmber`, `Mat.evGlow`, `Mat.screenGlow`, `Mat.beaconRed` için bloom katmanı. Godot sürümünde zaten `glow_enabled = true` — web'e eklemek **motor paritesini de kapatır**. Geceleri kanopi ışıkları, EV totemleri ve LED fiyat totemi dramatik biçimde canlanır.

**4. Ambient Occlusion "bakedaki" — köşe koyulaştırma**
Tam SSAO yerine: binaların yere değdiği yerlere ve kanopi altına manuel koyu gradient düzlemler. Sıfır GPU maliyeti, %80 SSAO hissi.

**5. Gündüz gökyüzü gradyanı**
Şu an `scene.background` düz renk. Bunun yerine büyük ters çevrilmiş küre + dikey gradient shader (ufukta açık, zenitte doygun mavi). Gün döngüsünde iki renk arası lerp yeterli. Fog rengini gradyanın ufuk rengiyle eşle.

**6. Araç çeşitliliği**
`Vehicle.buildMesh` `modelType` parametresini alıyor ama her zaman aynı sedanı üretiyor. `BypassVehicle`'daki `beetle`/`van`/`bus` mantığını oyuncu araçlarına da taşı; ayrıca SUV, pickup, hatchback, motosiklet, elektrikli araç (farklı yakıt kapağı renk kodu ile). Her tipe farklı `reqLiters` aralığı ver — hem görsel hem oynanış çeşitliliği.

### F-2 · Orta maliyet, güçlü sinematik kazanç

**7. Gerçek gün-döngüsü güneş yörüngesi** (B-17'nin ötesi)
Güneş konumuyla birlikte gölge uzunluğu, ambient rengi ve fog yoğunluğu birlikte animasyonlansın. Altın saat (17:00–19:00) için ayrı bir sıcak renk kademesi ekle — tycoon oyunlarında en çok ekran görüntüsü alınan an budur.

**8. Gece far/stop lambası ışıkları**
Araç farları şu an `MeshBasicMaterial` — sadece parlak plastik. Geceleri araç başına 1 adet dar açılı `SpotLight` + zemine düşen konik ışık dokusu ekle (ışık sayısını sınırla: sadece en yakın 3 araç). Fren yaparken (`obstacleBrakeFactor < 1`) stop lambası materyalini parlaklaştır.

**9. Islak zemin / yağmur modu**
`Mat.puddle` zaten var. Rastgele hava durumu ekle: yağmurda asfalt materyaline hafif yansıma (reflection map yerine parlak overlay düzlemi), birikinti sayısını artır, partikül yağmur, ıslak zeminde araç lastik izi. Yağmur → müşteri sayısı düşer, oto yıkama geliri artar (görsel + mekanik bağı).

**10. İnşaat animasyon aşamaları**
Şu an inşaat sadece bir ilerleme panosu. Bunun yerine: %0–33 temel + kalıp, %33–66 iskele + yarım duvarlar, %66–100 çatı + bitirme; tamamlanınca mevcut `triggerUpgradeFX` pop animasyonu. Oyuncunun ilerlemeyi **haritada** görmesi bekleme süresini oynanabilir hale getirir.

**11. Yakıt dolumu görsel geri bildirimi**
Dolum sırasında: pompadan araca uzanan hortum mesh'i (basit Catmull-Rom eğrisi), pompa LCD'sinde artan litre (canvas doku güncellemesi), araç üstünde dolan bir yakıt göstergesi halkası. Şu an dolum tamamen HUD'da geçiyor, 3D sahnede hiçbir şey olmuyor.

**12. Mevsim / tema varyantları**
`State.theme` altyapısı zaten var ama sadece renk değişimi. Gerçek temalar: kış (kar örtüsü materyali, çıplak ağaçlar, nefes buharı), sonbahar (turuncu yapraklar + düşen yaprak partikülleri), gece-şehir neon teması. Retention için güçlü, mağaza görselleri için mükemmel.

### F-3 · Kalite & tutarlılık iyileştirmeleri

**13. Işık sayısını sabitle ve Lambert'ten çık**
Şu an 6 ışık (1 directional + 5 point) × Lambert. `MeshLambertMaterial` per-vertex aydınlatma yapar — düşük poligonlu büyük yüzeylerde (asfalt, çatı) **bantlaşma** oluşturur. `MeshPhongMaterial` (flatShading: true, shininess: 0) veya `MeshStandardMaterial` (roughness: 1, metalness: 0) per-fragment hesaplar ve aynı flat-shaded görünümü verir, çok daha temiz.

**14. Gölge frustum'unu istasyona göre hesapla**
`shadowDist = 30` sabit ama Tır Peronu X = 29'a, Türbin gövdesi Y = 18'e uzanıyor. Gölge kamerasını inşa edilmiş tesislerin bounding box'ına göre `updateStationApronExpansion()` içinde yeniden hesapla — hem kenar tesislerin gölgesi kaybolmaz hem de küçük istasyonda gölge çözünürlüğü artar.

**15. Materyal ve geometri havuzu (instancing)**
Ağaçlar, koniler, bordürler, raf kutuları, çitler tekrar tekrar `new BoxGeometry` ile üretiliyor. Ortak geometrileri modül seviyesinde bir kez oluştur; ağaçlar/koyunlar/koniler için `InstancedMesh` kullan. Draw call sayısı mobilde 60 FPS için kritik (AGENTS.md §4).

**16. LOD ve mesafe kırpma**
Kamera yakınlaştırıldığında (zoom > 2) uzak arazi prop'larını gizle; uzaklaştırıldığında iç mekan diorama detaylarını (raf kutuları, POS terminali, kahve makinesi — ~50 mesh) gizle. Basit `visible` toggle bile ciddi kazanç verir.

**17. Zemin dokusu çözünürlüğü ve anizotropi**
`createStationGridTexture()` 1024px ve `anisotropy = 4` sabit. Düz açıdan bakıldığında ızgara çizgileri aliasing yapıyor. `renderer.capabilities.getMaxAnisotropy()` kullan ve mipmap üret (`generateMipmaps = true`, `minFilter = LinearMipmapLinearFilter`).

**18. Emissive materyallerin gece/gündüz ayrımı**
`Mat.lampGlow`, `neonAmber`, `evGlow` gündüz de tam parlaklıkta — gündüz "yanık ampul" gibi cansız duruyorlar. `updateSkyLighting()` içinde `nightAlpha`'ya göre bu materyallerin `color`'ını sönük→parlak arasında lerp et. Ucuz ve gün döngüsünü çok daha okunur yapar.

**19. Kamera geçiş animasyonları**
"Odak" butonu ve parsel tıklaması anında ışınlanıyor. `TWEEN` benzeri basit bir ease-out ile 0.6 sn'lik kamera geçişi ekle; tesis inşa edilince kamera kısa süreli o tesise yumuşak zoom yapsın (satın alma anını ödüllendirir).

**20. HUD'da 3D bağlantı ipuçları**
Bir tesis inşa edilebilir hale geldiğinde 3D rozetin yanı sıra ekran kenarında yön oku göster (kamera dışındaysa). Şu an oyuncu haritanın neresinde yeni bir şey açıldığını bilmiyor.

---

## Önerilen Uygulama Sırası

**Sprint 1 — Bozuk olanı düzelt (1 gün):**
B-01 (cam sönmesi) → B-03 (renk uzayı) → B-04 (toast z-index) → B-16 (i18n anahtarları) → B-10 (NaN partiküller)

**Sprint 2 — Görsel doğruluk (2 gün):**
B-02 (kademeli mesh'ler) → B-05 (market konumu) → B-06 (önlük z-fighting) → B-08 (kanopi cam paylaşımı) → B-09 (gölge toggle) → B-11 (billboard) → B-24 (kuşlar)

**Sprint 3 — Performans & his (2 gün):**
B-07 (delta-time) → B-13 (HUD throttle) → B-21 (dispose) → B-22 (raycast) → B-18/B-19 (kamera) → B-20 (docking snap) → E-01/E-02 (mobil hedef & tipografi)

**Sprint 4 — Sinematik yükseltme (3–4 gün):**
F-1 tamamı (contact shadow, vinyet, selektif bloom, gökyüzü gradyanı, araç çeşitliliği) → B-17 (güneş yörüngesi) → F-2'den 8, 11

**Sprint 5 — Motor paritesi kararı:**
Godot sürümü için ya tesis mesh üretimini portla, ya da resmi olarak dondurup AGENTS.md §3'ü güncelle.
