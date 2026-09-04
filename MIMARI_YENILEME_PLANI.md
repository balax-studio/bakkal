# PixelOil 3D — Neo-Brutalist 16-Bit Mimari, Canlı Dünya & UI/UX Yenileme Planı

**Tarih:** 2026-09-04
**Denetlenen sürüm:** `docs/gorsel-denetim-raporu` @ `71aa443`
**Kapsam:** `web_3d_station/` (game.js 7473 sat., index.html 1196 sat., style.css 1207 sat.) + `godot_station/` (2557 sat.)
**Yöntem:** Statik kod analizi + programatik geometri ölçümü. Tarayıcı otomasyonu çalıştırılmadı. Tüm ayak izleri, koridor mesafeleri ve plato taşmaları `game.js`'ten geometri çıkarılarak hesaplandı.

> Bu plan, `GORSEL_DENETIM_RAPORU.md` (G-01…G-21) üzerine kurulur. O raporun paketleri `88bd2f9` ile uygulandı, uygulamadaki iki regresyon `71aa443` ile kapatıldı.

---

## 0. Yönetici Özeti — Ne Hazır, Ne Değil

Dört direği tek tek ölçtüm. **Brief'in varsaydığı başlangıç noktası ile kodun gerçek durumu üç yerde ciddi biçimde ayrışıyor**, ve bu ayrışmalar paketlemeyi doğrudan değiştiriyor:

| Direk | Brief'in varsayımı | Ölçülen gerçek durum | Sonuç |
|---|---|---|---|
| **1 — Tesis Mimarisi** | "Jenerik kutu veya basit placeholder yapıları ortadan kaldır" | Doğru. 16 tesisin 6'sı zengin (66-105 sat.), 10'u ince (22-51 sat.) kutu istifi. 5 tesis `level` parametresini **hiç kullanmıyor** → L2/L3 yükseltmesi görsel olarak hiçbir şey yapmıyor. 20 parselin 13'ü jenerik disk+halka temeline düşüyor. | **Tam kapsamlı iş.** 3 alt-pakete bölündü. |
| **2 — Neo-Brutalist UI** | Yeni palet + 2.5px kontur + sert gölge | Gölgeler **zaten sert** (`0px` blur, 2/3.5/5px). Palet mat pastel — değişmeli. Konturlar 1px/1.5px/2px karışık, **hiç 2.5px yok**. Dokunma hedefleri ve safe-area **önceki pakette tamamlandı**. | Palet + kontur normalizasyonu. **Kontrast tehlikesi var — aşağıda.** |
| **3 — Canlı Dünya** | "Statik istasyonu hareketli simülasyona dönüştür" | **Zaten büyük ölçüde canlı.** Koyun, köpek, kedi, güvercin, kuş sürüsü, gece güveleri, rögar buharı, klima damlası, ağaç salınımı, türbin rotorları, gündüz/gece ses döngüsü — hepsi mevcut ve `updateWindAndCreatures` / `updateLivingWorldFX` içinde çalışıyor. | **Sadece 3 eksik sistem var.** Paket küçük. |
| **4 — Sıfır Çakışma & Waypoint** | "`approachWaypoints`, `dockingNode`, `departureWaypoints` koordinatlarını **koru**" | Korunacak bir şey yok: **waypoint sistemi yalnızca pompalar için var.** 16 tesisin hiçbirinde yanaşma/ayrılma rotası tanımlı değil; araçlar sadece pompaya gidiyor. Ayrıca **6 gerçek bina içiçe geçmesi** ve **3 tesisin plato dışına taşması** ölçüldü. | Koruma değil, **sıfırdan kurulum**. |

**Kritik uyarı (Direk 2):** İstenen canlı palet kontrast açısından güvenli değil. `#FFE853` (elektrik sarısı) üzerine beyaz metin **1.31:1** kontrast verir — WCAG AA eşiği 4.5:1. Aynı sorun `#00F5A0` (1.55:1) ve `#00D2FF` (1.85:1) için de geçerli. Paleti olduğu gibi uygularsak butonların yarısı okunamaz hale gelir. Paket 1 bu yüzden her aksana **eşlik eden metin rengi token'ı** ile geliyor (sarı/mint/camgöbeği üzerine `#181E24`, kırmızı/turuncu üzerine `#FFFFFF`). Renkler istendiği gibi kalıyor, sadece üzerlerindeki metin rengi hesaplanıyor.

---

## 1. DİREK 1 — Tesis Mimarisi Analizi

### 1.1 Mevcut detay seviyesi (satır sayısı = detay ölçüsü)

| Tesis | Fonksiyon | Satır | Kademe (L2/L3) | Durum |
|---|---|---:|---|---|
| Oto Yıkama | `spawnCarWashMesh` (L2683) | 105 | ✅ var | Zengin |
| Mini Market | `spawnMarketBayMesh` (L2789) | 96 | ✅ var | Zengin |
| Lastik Servisi | `spawnTireShopMesh` (L3055) | 68 | ✅ var | Zengin |
| Rüzgar Türbini | `spawnTurbineMesh` (L2920) | 67 | ✅ var | Zengin |
| EV Şarj | `spawnEvChargerMesh` (L2988) | 66 | ✅ var | Zengin |
| Hızlı Yağ | `spawnLubeBayMesh` (L3124) | 51 | ✅ var | Orta |
| Drive-Thru Cafe | `spawnBakeryDriveMesh` (L3290) | 42 | ✅ var | Orta |
| Moto Swap | `spawnMotoDockMesh` (L3213) | 38 | ✅ var | Orta |
| Tır Peronu | `spawnTruckStopMesh` (L3252) | 37 | ✅ var | Orta |
| Oto Vakum | `spawnVacuumHubMesh` (L3176) | 36 | ✅ var | Orta |
| Çatı GES | `spawnSolarPanelsMesh` (L2886) | 33 | ✅ var | Orta |
| Burger Van | `spawnFoodTruckMesh` (L3333) | 31 | ✅ var | İnce |
| Pet Parkı | `spawnPetParkMesh` (L3394) | 31 | ❌ **yok** | İnce |
| Mola & WC | `spawnRestLoungeMesh` (L3365) | 28 | ❌ **yok** | İnce |
| H2 Hidrojen | `spawnHydrogenBayMesh` (L3475) | 27 | ❌ **yok** | İnce |
| Kargo Dolabı | `spawnParcelHubMesh` (L3426) | 25 | ❌ **yok** | İnce |
| ATM Kiosk | `spawnAtmHubMesh` (L3452) | 22 | ❌ **yok** | En ince |

**Kademesizlik bulgusu:** 5 tesis (`rest_lounge`, `pet_park`, `parcel_hub`, `atm_hub`, `hydrogen_bay`) `level` parametresini imzada alıyor ama gövdede hiç dallandırmıyor. Oyuncu bu tesisleri Seviye 2 veya 3'e yükselttiğinde **ekranda hiçbir şey değişmiyor** — para harcanıyor, görsel geri bildirim sıfır.

**Örnek (ATM Kiosk, tamamı):** bir beton pad, iki renkli kutu, bir gölgelik plakası. Güvenlik dubası, aydınlatma, zemin işaretlemesi, kablo kanalı, çöp kutusu — hiçbiri yok.

### 1.2 İnşaat temelleri

`createPlotSignMesh` (L2147) 20 parselin **13'ünü** `createGenericPlotMesh`'e yönlendiriyor. Jenerik temel = 0.9 m siyah disk + altın halka + 4 köşe L-braketi + kanvas fiyat rozeti. Mimariye özel temel yalnızca `pump`, `wash`, `market`, `solar`, `turbine`, `ev` için var (hepsi 17-26 satır, yani onlar da ince).

### 1.3 Malzeme envanteri — yeni bağımlılık gerekmiyor

`Mat` paletinde **85 hazır malzeme** var (`hazardCone`, `hazardStripe`, `palletWood`, `brickClay`, `scaffoldWood`, `benchIron`, `trashGreen`, `chrome`, `rockDark`, `neonAmber`, `beaconRed`…). Direk 1'in istediği tüm prop'lar bu palet ile yapılabilir — **yeni malzeme veya doku yüklemesi gerekmiyor.** Mevcut yardımcı fonksiyon sayısı ise sadece 2: `createSafetyConeMesh()` (L1924) ve `addPlotCornerBrackets()` (L2000).

---

## 2. DİREK 2 — UI Sistemi Analizi

### 2.1 Palet karşılaştırması

| Rol | Mevcut | İstenen | Δ |
|---|---|---|---|
| Kontur / mürekkep | `#242D35` | `#1E232A` | Değişecek |
| Kırmızı | `#D45D56` (mat) | `#FF3366` Kızıl Akaryakıt | Değişecek |
| Turuncu | `#DC7E34` | `#FF6B35` Güvenlik Turuncusu | Değişecek |
| Sarı/Altın | `#E5A93C` | `#FFE853` Elektrik Sarısı | Değişecek |
| Yeşil | `#4E9B66` | `#00F5A0` Neon Mint | Değişecek |
| Mavi | `#4879D6` | `#00D2FF` Retro Camgöbeği | Değişecek |
| Koyu zemin | — | `#181E24` Derin Asfalt | **Yeni** |

### 2.2 Kontur ve gölge disiplini

| Özellik | Ölçülen | Hedef | Durum |
|---|---|---|---|
| `border: 1px solid` | 4 kural | — | Kaldırılacak |
| `border: 1.5px solid` | 10 kural | — | Kaldırılacak |
| `border: 2px solid` | 7 kural | — | Kaldırılacak |
| `border: 2.5px solid` | **0 kural** | tümü | Eklenecek |
| Blur'lu `box-shadow` | **0 kural** | 0 | ✅ Zaten temiz |
| `--shadow-md` | `3.5px 3.5px 0px` | `3.5px 3.5px 0px` | ✅ Eşleşiyor |
| `--shadow-lg` | `5px 5px 0px` | `5px 5px 0px` | ✅ Eşleşiyor |

### 2.3 Önceki pakette kapatılan maddeler (tekrar edilmeyecek)

- 48×48 px dokunma hedefi: **12 kuralda uygulandı** (`71aa443`)
- `env(safe-area-inset-*)` + `viewport-fit=cover`: **aktif**
- Sıfır emoji: **sağlandı** (⚠️, ✓, ★ → SVG / metin)
- SVG kontur `stroke-width="2.5"`: **51/51 ikon**
- i18n: **TR 180 / EN 180 tam parite**

### 2.4 Kontrast hesabı (WCAG AA, normal metin eşiği 4.5:1)

| Zemin | Beyaz metin | `#181E24` metin | Kullanılacak |
|---|---:|---:|---|
| `#FFE853` Elektrik Sarısı | 1.31:1 ❌ | **14.8:1** ✅ | Koyu |
| `#00F5A0` Neon Mint | 1.55:1 ❌ | **12.5:1** ✅ | Koyu |
| `#00D2FF` Camgöbeği | 1.85:1 ❌ | **10.4:1** ✅ | Koyu |
| `#FF6B35` Güvenlik Turuncusu | 3.06:1 ❌ | **6.3:1** ✅ | Koyu |
| `#FF3366` Kızıl Akaryakıt | **4.55:1** ✅ | 4.2:1 ❌ | Beyaz |
| `#181E24` Derin Asfalt | **16.4:1** ✅ | — | Beyaz |

Paket 1 bu tabloyu `--on-*` token'ları olarak kodluyor.

---

## 3. DİREK 3 — Canlı Dünya Analizi

### 3.1 Zaten uygulanmış sistemler (dokunulmayacak)

| Sistem | Fonksiyon | Satır |
|---|---|---|
| Yol su birikintileri | `createRoadPuddles` | L4383 |
| Rögar buhar püskürtme | `createManholeSteamSystem` | L4402 |
| Gökyüzü kuş sürüsü | `createSkyFlockBirds` | L4427 |
| Çatıda güvercinler | `createPerchedPigeons` | L4448 |
| Gece güveleri | `createNightMoths` | L4472 |
| Klima dış ünite + damlama | `createAirConditionerUnit` | L4493 |
| Kentsel yıpranma detayları | `createUrbanWearDetails` | L4516 |
| Yüksek irtifa jeti | `createHighAltitudeJet` | L4558 |
| Ağaç tepesi rüzgar salınımı | `updateWindAndCreatures` | L6599 |
| Köpek nefes alma / kedi kuyruk | `updateWindAndCreatures` | L6608-6616 |
| Otlayan koyunlar | `sheepList[].update()` | L6624 |
| Türbin rotorları | `updateWindAndCreatures` | L6626-6631 |
| Gündüz kuş / gece cırcır sesi | `updateWindAndCreatures` | L6633+ |
| Gün doğumu/batımı geçişleri | `updateSkyLighting` | L6681 |
| ACESFilmic ton eşleme | `initThree` | L1099 |

**Brief'in "statik istasyonu canlıya dönüştür" hedefi büyük ölçüde zaten karşılanmış durumda.** Bu sistemleri yeniden yazmak regresyon riskinden başka bir şey getirmez.

### 3.2 Gerçekten eksik olan 3 sistem

| Eksik | Brief maddesi | Not |
|---|---|---|
| **Ateşböcekleri** | "gece sokak lambaları etrafında uçuşan ateşböcekleri/güveler" | Güveler var (`createNightMoths`), ateşböceği yok. Lamba çevresinde yörüngeli, nabız gibi sönüp yanan noktalar. |
| **Egzoz dumanı** | "egzoz dumanı" | Kodda `exhaust`/`smoke` hiç geçmiyor. Araç kalkışında arka tampondan 3-4 partikül. |
| **Bayrak salınımı** | "rüzgarda sallanan ağaç tepeleri ve bayraklar" | Ağaçlar sallanıyor, bayrak mesh'i hiç yok. Totem direğine ve tır peronuna birer bayrak. |

---

## 4. DİREK 4 — Çakışma, Zemin ve Trafik Analizi

### 4.1 Ölçülen yapı ayak izleri

Her `spawn*Mesh` fonksiyonundan geometri boyutları ve child pozisyonları çıkarılarak hesaplandı:

| Tesis | Ayak izi (G×D) | Dünya X | Dünya Z |
|---|---|---|---|
| wash | 6.2 × 9.7 m | [13.4, 19.6] | [-2.9, 6.8] |
| market | 9.5 × 5.7 m | [1.7, 11.2] | [-12.8, -7.1] |
| tire_shop | 5.8 × 5.1 m | [13.3, 19.1] | [-7.0, -1.9] |
| lube_bay | 5.2 × 5.8 m | [13.7, 18.9] | [-12.3, -6.6] |
| vacuum_hub | 4.8 × 4.4 m | [13.6, 18.4] | [-15.7, -11.3] |
| truck_stop | 9.0 × 6.4 m | [19.5, 28.5] | [-9.2, -2.8] |
| ev | 4.8 × 3.2 m | [-18.6, -13.8] | [1.9, 5.1] |
| bakery_drive | 5.2 × 4.4 m | [-18.9, -13.7] | [-4.7, -0.3] |
| moto_dock | 3.8 × 3.0 m | [-17.6, -13.8] | [-9.5, -6.5] |
| pet_park | 5.4 × 8.1 m | [-18.4, -13.1] | [-18.9, -10.8] |
| turbine | 3.2 × 2.2 m | [-22.9, -19.7] | [-14.1, -11.9] |
| hydrogen_bay | 6.0 × 6.0 m | [-25.0, -19.0] | [-7.0, -1.0] |
| food_truck | 5.6 × 4.2 m | [5.2, 10.8] | [-5.6, -1.4] |
| rest_lounge | 5.6 × 4.6 m | [-2.8, 2.8] | [-17.3, -12.7] |
| parcel_hub | 4.0 × 2.2 m | [-8.8, -4.8] | [-8.1, -5.9] |
| atm_hub | 2.8 × 2.0 m | [5.4, 8.2] | [-8.0, -6.0] |

### 4.2 Gerçek bina içiçe geçmeleri (6 adet)

| # | Çift | Örtüşme | Not |
|---|---|---:|---|
| 1 | `lube_bay` ↔ `vacuum_hub` | **−1.00 m** | Doğu servis kolonunda gövdeler birbirine giriyor |
| 2 | `wash` ↔ `tire_shop` | **−0.99 m** | Yıkama tüneli lastik servisinin içine giriyor |
| 3 | `market` ↔ `atm_hub` | **−0.87 m** | ATM kiosk market binasının duvarında |
| 4 | `tire_shop` ↔ `lube_bay` | **−0.45 m** | |
| 5 | `wash` ↔ `truck_stop` | **−0.10 m** | Teğet |
| 6 | `market` ↔ `rest_lounge` | **−0.10 m** | Teğet |

Ek olarak 9 çift 2.0 m altında, 12 çift 4.0 m altında.

### 4.3 ⚠️ 4.0 m koridor kuralı doğu kolonunda geometrik olarak imkânsız

Brief "tesisler arasında minimum 4.0 m net manevra koridoru" istiyor. Doğu servis kolonunda ölçüm:

- 4 bay toplam yapı derinliği: 9.7 + 5.1 + 5.8 + 4.4 = **25.0 m**
- 3 koridor × 4.0 m = **12.0 m**
- Gereken toplam Z uzunluğu: **37.0 m**
- Mevcut kullanılabilir Z aralığı (apron z=+6.8 → plato kenarı z≈−16): **22.8 m**

**14.2 m açık var.** Bu kural bu kolonda ancak (a) binaları %40 küçülterek, (b) platoyu büyüterek veya (c) bir tesisi kolondan çıkararak sağlanabilir.

**Önerilen değiştirilmiş kural — Paket 2B bunu uygular:**
> 4.0 m koridor, **araç sirkülasyon ekseninde** zorunludur (apron kenarı ile bina hattı arasında, ve tesis bloğunun çevresinde). Aynı servis bloğu içindeki komşu bay'ler arasında **minimum 1.2 m** yeterlidir — gerçek servis merkezleri de böyle kurulur ve bitişik bay'ler tek bir mimari kütle olarak okunur.

Bu sapma bilinçlidir; gerekçesi yukarıdaki ölçümdür.

### 4.4 🔴 Plato taşması — 3 tesis boşlukta duruyor

Plato yarıçapı `plateauR = 27.5` (merkez `0, 2`). Bunun dışında `getPlanetoidElevation` zemini `-0.00165·dr²` ile aşağı kıvırıyor.

| Tesis | En uzak köşe | r | Plato dışı |
|---|---|---:|---:|
| **truck_stop** (bina) | (28.5, −9.2) | 30.62 | **+3.12 m** |
| **truck_stop** (apron levhası) | (29.0, −12.0) | 32.20 | **+4.70 m** |
| **turbine** (apron levhası) | (−25.5, −16.5) | 31.50 | **+4.00 m** |
| turbine (bina) | (−22.9, −14.1) | 27.99 | +0.49 m |
| pet_park (bina) | (−18.4, −18.9) | 27.85 | +0.35 m |

Tır Peronu'nun **asfalt önlüğü platonun 4.7 m dışında**, yani çimenin aşağı kıvrıldığı yamacın üzerinde havada asılı duruyor. Bu, önceki denetimde yakalanmamış yeni bir bulgudur.

**Çözüm:** `plateauR` 27.5 → 36.0 ve buna bağlı `createPlanetoidTerrain` silindir yarıçapları (28/29 → 36.5/37.5, dirt 28.5/30 → 37/38.5, slab 30/31 → 38.5/39.5). Değer, Paket 2B sonrası en uzak nokta olan tır peronu önlüğünün köşesinden (r = 34.80) 1.2 m paylı türetildi.

### 4.5 🔴 Önceki paketten gelen regresyon — tır peronu önlüğü binayı bırakmış

`GORSEL_DENETIM_RAPORU.md` G-04 düzeltmesi `truck_stop` önlüğünü `dim 10.0 / center 24.0` (X[19,29]) → `dim 8.0 / center 25.0` (X[21,29]) yapmıştı. Ancak bina X[19.5, 28.5]'te duruyor:

> Binanın batı **1.5 m'si** (X[19.5, 21.0]) artık asfaltın dışında, çimenin üstünde.

G-04'ün amacı `truck_stop` ↔ `tire_shop` önlük eş-düzlemselliğini gidermekti. Önlüğü küçültmek yanlış araçtı — Paket 2C bunu **per-tesis Y kademelemesi** ile değiştiriyor: önlükler serbestçe örtüşebilir (Direk 4'ün "seamless apron extension" hedefi bunu zaten istiyor), z-fighting ise her tesise `0.002·index` Y ofseti vererek çözülür.

### 4.6 Trafik waypoint sistemi — tesisler için hiç yok

`initApproachPath` / `initDeparturePath` (L4955-5015) yalnızca **pompa slotlarına** rota üretiyor: iki yanaşma şablonu (ön sıra Z=4.2, arka sıra Z=0.5) ve iki ayrılma şablonu. `PLOTS` içindeki 16 tesisin hiçbirine ait `approachWaypoints`, `dockingNode` veya `departureWaypoints` tanımı **yok** — araçlar oto yıkamaya, tır peronuna, EV şarja hiç gitmiyor.

Ayrıca ölçülen bir sıkışıklık: ön sıra ayrılma rotası `(12.5, 0, 7.8)` noktasından geçiyor, oto yıkama gövdesi X=13.4'te başlıyor → **0.9 m boşluk**. Araç kasası ~1.8 m genişliğinde olduğu için bu nokta yeniden konumlandırılmalı.

---

## 5. GODOT PARİTESİ — Dürüst Değerlendirme

| Varlık | web_3d_station | godot_station |
|---|---:|---:|
| Toplam kod | 7473 sat. (game.js) | 2557 sat. (11 script + 8 sahne) |
| Tesis mesh üreticisi | 16 | **0** |
| Parsel/inşaat sistemi | 20 parsel, kademeli | **yok** |
| Canlı dünya sistemi | 15 sistem | **yok** |
| Sahne dosyaları | — | Building, Canopy, Car, Diorama, Main, Pump, Tank, Tree (8) |
| Malzeme | 85 (`Mat`) | 14 (`.tres`) |
| i18n | 180 TR / 180 EN | `I18n.gd` 317 sat. |

**Godot tarafında tesis sistemi hiç yok.** Brief'in Paket 4'te istediği "mimari eşleme kontrolü" yapılabilecek bir eşleme mevcut değil; bu bir senkronizasyon değil, sıfırdan port işi olur ve kabaca web tarafındaki 16 mesh üreticisinin + parsel sisteminin GDScript karşılığının yazılmasını gerektirir.

**Öneri:** Godot portu bu yenileme paketinin kapsamı dışında tutulsun ve ayrı bir yol haritası olarak planlansın. Paket 4 bunun yerine web tarafı için **ölçülebilir doğrulama betikleri** teslim ediyor — çakışma, plato taşması ve kontrast otomatik olarak yeniden ölçülebilir hale geliyor.

---

## 6. UYGULAMA PAKETLERİ

Paketleme ilkesi: **her paket tek dosya + tek konu + Haiku 4.5'in bağlamına sığan boyut.** Direk 1'in 16 tesisi tek pakete sığmadığı için önce paylaşılan bir **prop kütüphanesi** kuruluyor, sonra tesisler bu kütüphaneyi çağırarak zenginleştiriliyor. Bu, hem tekrar eden kodu ortadan kaldırıyor hem de her tesis düzenlemesini 5-15 satıra indiriyor.

```
PAKET 1   style.css + index.html   Palet, 2.5px kontur, kontrast token'ları
PAKET 2A  game.js                  Prop kütüphanesi (12 yardımcı fonksiyon)
PAKET 2B  game.js                  Yerleşim düzeltmesi: 6 çakışma + plato + apron Y kademelemesi
PAKET 2C  game.js                  10 ince tesise prop uygulaması + 5 tesise kademe
PAKET 2D  game.js                  13 jenerik parsel temeline aile-bazlı karakter
PAKET 3   game.js                  Ateşböcekleri, egzoz dumanı, bayrak salınımı
PAKET 4   —                        Doğrulama betikleri (çakışma / plato / kontrast / sözdizimi)
```

Sıra bağımlılığı: **2A → 2B → 2C → 2D**. Paket 1 ve Paket 3 bağımsız, herhangi bir noktada uygulanabilir.

---

### 📦 PAKET 1 — Neo-Brutalist palet, 2.5 px kontur ve kontrast token'ları

> **Dosyalar:** `web_3d_station/style.css` (ana), `web_3d_station/index.html` (tek satır)
> **Kapsanan:** Direk 2 tamamı

<details>
<summary><b>Haiku'ya verilecek prompt</b></summary>

````
Yalnızca `web_3d_station/style.css` ve `web_3d_station/index.html` dosyalarını düzenle.
Dosyalar CRLF satır sonu kullanıyor; düzenleme aracı bunları korumalı.

--- DÜZENLEME 1/4 : Paleti değiştir (style.css) ---
BUL:
  --bg-paper: #FAF7EE;
  --bg-card: #FFFFFF;
  --bg-inner: #F1EBDC;
  --ink-border: #242D35;
  --ink-text: #242D35;
  --ink-muted: #626F7D;
  
  --accent-red: #D45D56;
  --accent-green: #4E9B66;
  --accent-orange: #DC7E34;
  --accent-blue: #4879D6;
  --accent-gold: #E5A93C;
  --accent-purple: #8367C7;
DEĞİŞTİR:
  --bg-paper: #FAF7EE;
  --bg-card: #FFFFFF;
  --bg-inner: #F1EBDC;
  --ink-border: #1E232A;
  --ink-text: #1E232A;
  --ink-muted: #5A6672;

  /* Canlı endüstriyel palet */
  --accent-red: #FF3366;      /* Kızıl Akaryakıt */
  --accent-green: #00F5A0;    /* Neon Mint */
  --accent-orange: #FF6B35;   /* Güvenlik Turuncusu */
  --accent-blue: #00D2FF;     /* Retro Camgöbeği */
  --accent-gold: #FFE853;     /* Elektrik Sarısı */
  --accent-purple: #8367C7;
  --deep-asphalt: #181E24;    /* Derin Asfalt */

  /* Kontrast eşleri: her aksanın üzerinde okunabilir metin rengi.
     WCAG AA (4.5:1) hesabıyla belirlendi; aksan renkleri değişmedi. */
  --on-red: #FFFFFF;          /* 4.55:1 */
  --on-green: #181E24;        /* 12.5:1 */
  --on-orange: #181E24;       /* 6.3:1  */
  --on-blue: #181E24;         /* 10.4:1 */
  --on-gold: #181E24;         /* 14.8:1 */
  --on-asphalt: #FFFFFF;      /* 16.4:1 */

--- DÜZENLEME 2/4 : Aksan butonlarının metin rengini token'a bağla (style.css) ---
BUL:
.neo-btn.success {
  background: var(--accent-green);
  color: #FFFFFF;
}
.neo-btn.danger {
  background: var(--accent-red);
  color: #FFFFFF;
}
.neo-btn.warning {
  background: var(--accent-orange);
  color: #FFFFFF;
}
.neo-btn.accent {
  background: var(--accent-red);
  color: #FFFFFF;
}
DEĞİŞTİR:
.neo-btn.success {
  background: var(--accent-green);
  color: var(--on-green);
}
.neo-btn.danger {
  background: var(--accent-red);
  color: var(--on-red);
}
.neo-btn.warning {
  background: var(--accent-orange);
  color: var(--on-orange);
}
.neo-btn.accent {
  background: var(--accent-red);
  color: var(--on-red);
}

--- DÜZENLEME 3/4 : Rozet çiplerinin metin rengini token'a bağla (style.css) ---
BUL:
.badge-chip.green { background: var(--accent-green); color: #fff; }
.badge-chip.gold { background: var(--accent-gold); color: #000; }
.badge-chip.blue { background: var(--accent-blue); color: #fff; }
.badge-chip.grey { background: var(--ink-muted); color: #fff; }
DEĞİŞTİR:
.badge-chip.green { background: var(--accent-green); color: var(--on-green); }
.badge-chip.gold { background: var(--accent-gold); color: var(--on-gold); }
.badge-chip.blue { background: var(--accent-blue); color: var(--on-blue); }
.badge-chip.grey { background: var(--ink-muted); color: #fff; }

--- DÜZENLEME 4/4 : Kontur kalınlıklarını 2.5px'e normalize et (style.css) ---
Dosyadaki TÜM `border: 1px solid`, `border: 1.5px solid` ve `border: 2px solid`
bildirimlerini `border: 2.5px solid` yap. Renk kısmına ve `border-color`,
`border-bottom`, `border-top` gibi yön-belirli bildirimlere DOKUNMA.
Şu üç dönüşümü uygula:
   "border: 1px solid"   -> "border: 2.5px solid"    (4 örnek)
   "border: 1.5px solid" -> "border: 2.5px solid"    (10 örnek)
   "border: 2px solid"   -> "border: 2.5px solid"    (7 örnek)

--- BİTİŞ ---
Doğrulama komutu:
  node -e "const c=require('fs').readFileSync('web_3d_station/style.css','utf8');
  console.log('2.5px kontur:', (c.match(/border: 2\.5px solid/g)||[]).length, '(beklenen 21)');
  console.log('kalan eski kontur:', (c.match(/border: (1|1\.5|2)px solid/g)||[]).length, '(beklenen 0)');
  console.log('on-* token:', (c.match(/--on-[a-z]+:/g)||[]).length, '(beklenen 6)');
  console.log('braces:', (c.match(/\{/g)||[]).length === (c.match(/\}/g)||[]).length ? 'DENGELI':'HATA');"
````

</details>

**Beklenen:** `2.5px kontur: 21` · `kalan eski kontur: 0` · `on-* token: 6` · `braces: DENGELI`

---

### 📦 PAKET 2A — Paylaşılan 16-bit prop kütüphanesi

> **Dosya:** `web_3d_station/game.js` · **Yalnızca ekleme yapar, hiçbir şey silmez.**
> Bu paket 12 yardımcı fonksiyon ekler. Sonraki paketler bunları çağırır; tesis başına düzenleme 5-15 satıra iner.

<details>
<summary><b>Haiku'ya verilecek prompt</b></summary>

````
Yalnızca `web_3d_station/game.js` dosyasını düzenle. CRLF satır sonlarını koru.
Bu paket SADECE yeni fonksiyon ekler. Var olan hiçbir satırı silme veya değiştirme.

--- TEK DÜZENLEME : Prop kütüphanesini ekle ---
BUL (dosyada benzersizdir):
function createSafetyConeMesh() {
DEĞİŞTİR (aşağıdaki bloğun TAMAMINI yaz, sonuna orijinal satır dahil):
// =========================================================
// 16-BIT NEO-BRUTALIST PAYLASILAN PROP KUTUPHANESI
// Tum props mevcut `Mat` paletini kullanir; yeni malzeme YOK.
// Her fonksiyon bir THREE.Group dondurur ve cagiran tarafta
// position.set(...) ile yerlestirilir.
// =========================================================

// Sari-siyah seritli guvenlik dubasi (bollard)
function propBollard() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.26), Mat.darkInk);
  base.position.y = 0.03;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.85, 8), Mat.hazardCone);
  post.position.y = 0.46;
  post.castShadow = true;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 8), Mat.darkInk);
  band.position.y = 0.62;
  g.add(base, post, band);
  return g;
}

// Zemin drenaj izgarasi
function propDrainGrate(w = 0.9, d = 0.4) {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), Mat.darkInk);
  frame.position.y = 0.025;
  g.add(frame);
  const bars = Math.max(3, Math.round(w / 0.16));
  for (let i = 0; i < bars; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, d * 0.82), Mat.chrome);
    bar.position.set(-w / 2 + (i + 0.5) * (w / bars), 0.055, 0);
    g.add(bar);
  }
  return g;
}

// Ahsap palet istifi (16-bit depo dokusu)
function propPalletStack(layers = 3) {
  const g = new THREE.Group();
  for (let i = 0; i < layers; i++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.11, 0.75), Mat.palletWood);
    slab.position.set((i % 2) * 0.05 - 0.025, 0.06 + i * 0.14, (i % 2) * 0.04 - 0.02);
    slab.rotation.y = (i % 2) * 0.06;
    slab.castShadow = true;
    g.add(slab);
  }
  return g;
}

// Endustriyel kablo makarasi
function propCableReel() {
  const g = new THREE.Group();
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6), Mat.chrome);
  axle.rotation.z = Math.PI / 2;
  axle.position.y = 0.42;
  const mk = (x) => {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 12), Mat.palletWood);
    d.rotation.z = Math.PI / 2;
    d.position.set(x, 0.42, 0);
    d.castShadow = true;
    return d;
  };
  const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12), Mat.darkInk);
  coil.rotation.z = Math.PI / 2;
  coil.position.y = 0.42;
  g.add(axle, mk(-0.24), mk(0.24), coil);
  return g;
}

// Metal oturma banki
function propBench() {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.42), Mat.benchWood);
  seat.position.y = 0.44;
  seat.castShadow = true;
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.34, 0.07), Mat.benchWood);
  back.position.set(0, 0.66, -0.18);
  const leg = (x) => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.44, 0.38), Mat.benchIron);
    l.position.set(x, 0.22, 0);
    return l;
  };
  g.add(seat, back, leg(-0.62), leg(0.62));
  return g;
}

// Retro cop kutusu
function propTrashBin() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.72, 8), Mat.trashGreen);
  body.position.y = 0.36;
  body.castShadow = true;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.07, 8), Mat.darkInk);
  rim.position.y = 0.74;
  g.add(body, rim);
  return g;
}

// Tekerlek takozu (wheel chock)
function propWheelChock() {
  const g = new THREE.Group();
  const w = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.22), Mat.hazardCone);
  w.position.y = 0.08;
  w.rotation.z = -0.22;
  g.add(w);
  return g;
}

// Basincli hortum makarasi (duvara monte)
function propHoseReel() {
  const g = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.5), Mat.darkInk);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.2, 10), Mat.redTrim);
  drum.rotation.z = Math.PI / 2;
  drum.position.x = 0.16;
  const nozzle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), Mat.chrome);
  nozzle.position.set(0.16, -0.32, 0);
  g.add(plate, drum, nozzle);
  return g;
}

// Zemin boya seridi (guvenlik / yonlendirme)
function propFloorStripe(w, d, mat) {
  const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.014, d), mat || Mat.roadYellow);
  s.position.y = 0.075;
  return s;
}

// Neon totem tabela direigi (perakende tesisleri icin)
function propNeonTotem(glowMat) {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.16), Mat.darkInk);
  post.position.y = 1.3;
  post.castShadow = true;
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.1), Mat.darkInk);
  panel.position.y = 2.75;
  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.52, 0.04), glowMat || Mat.neonAmber);
  glow.position.set(0, 2.75, 0.08);
  g.add(post, panel, glow);
  return g;
}

// Trafo / inverter kabini (enerji tesisleri icin)
function propInverterCabinet() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.3, 0.5), Mat.shelfGrey);
  body.position.y = 0.65;
  body.castShadow = true;
  const vent = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.03), Mat.darkInk);
  vent.position.set(0, 1.0, 0.26);
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.03), Mat.evGlow);
  led.position.set(0.26, 0.5, 0.26);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.09, 0.7), Mat.concrete);
  pad.position.y = 0.045;
  g.add(pad, body, vent, led);
  return g;
}

// Kademe rozeti: tesis seviyesini gosteren kucuk LED cubuk dizisi
function propLevelPips(level) {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.5, 0.09), Mat.darkInk);
  post.position.y = 0.25;
  g.add(post);
  for (let i = 0; i < 3; i++) {
    const on = i < level;
    const pip = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.08, 0.05),
      on ? Mat.evGlow : Mat.shelfGrey
    );
    pip.position.set(0, 0.16 + i * 0.13, 0.06);
    g.add(pip);
  }
  return g;
}

function createSafetyConeMesh() {

--- BİTİŞ ---
Doğrulama:
  node --check web_3d_station/game.js && node -e "const c=require('fs').readFileSync('web_3d_station/game.js','utf8');
  const n=(c.match(/^function prop[A-Z]/gm)||[]).length; console.log('prop fonksiyonu:',n,'(beklenen 12)');"
````

</details>

**Beklenen:** sözdizimi OK · `prop fonksiyonu: 12`

---

### 📦 PAKET 2B — Yerleşim düzeltmesi: çakışmalar, plato ve apron kademelemesi

> **Dosya:** `web_3d_station/game.js`
> **Kapsanan:** §4.2 (6 çakışma), §4.4 (plato taşması), §4.5 (tır peronu önlük regresyonu), §4.6 kısmi

<details>
<summary><b>Haiku'ya verilecek prompt</b></summary>

````
Yalnızca `web_3d_station/game.js` dosyasını düzenle. CRLF satır sonlarını koru.
9 düzenlemeyi sırayla uygula (3b ve 3c dahil).

--- DÜZENLEME 1/7 : Doğu servis kolonunu ayır (PLOTS) ---
Bu üç satırdaki SADECE `pos` vektörünün Z bileşenini değiştir.
BUL:
  tire_shop:    { id: 'tire_shop',    type: 'tire_shop',               tier: 2, pos: new THREE.Vector3(16.25, 0.04, -4.5), cost: 7500,  duration: 40, name: 'Lastik Servisi',  tab: 'service' },
DEĞİŞTİR:
  tire_shop:    { id: 'tire_shop',    type: 'tire_shop',               tier: 2, pos: new THREE.Vector3(16.25, 0.04, -6.7), cost: 7500,  duration: 40, name: 'Lastik Servisi',  tab: 'service' },

BUL:
  lube_bay:     { id: 'lube_bay',     type: 'lube_bay',                tier: 3, pos: new THREE.Vector3(16.25, 0.04, -9.5), cost: 9500,  duration: 45, name: 'Hızlı Yağ Değişim', tab: 'service' },
DEĞİŞTİR:
  lube_bay:     { id: 'lube_bay',     type: 'lube_bay',                tier: 3, pos: new THREE.Vector3(16.25, 0.04, -13.3), cost: 9500,  duration: 45, name: 'Hızlı Yağ Değişim', tab: 'service' },

BUL:
  vacuum_hub:   { id: 'vacuum_hub',   type: 'vacuum_hub',              tier: 3, pos: new THREE.Vector3(16.0, 0.04, -13.5), cost: 6500,  duration: 35, name: 'Oto Vakum Hub',   tab: 'service' },
DEĞİŞTİR:
  vacuum_hub:   { id: 'vacuum_hub',   type: 'vacuum_hub',              tier: 3, pos: new THREE.Vector3(16.0, 0.04, -19.5), cost: 6500,  duration: 35, name: 'Oto Vakum Hub',   tab: 'service' },

--- DÜZENLEME 2/7 : ATM kiosk'u market duvarından çek (PLOTS) ---
BUL:
  atm_hub:      { id: 'atm_hub',      type: 'atm_hub',                 tier: 1, pos: new THREE.Vector3(6.8, 0.04, -7.0),   cost: 3500,  duration: 20, name: 'ATM Kiosk',       tab: 'lifestyle' },
DEĞİŞTİR:
  atm_hub:      { id: 'atm_hub',      type: 'atm_hub',                 tier: 1, pos: new THREE.Vector3(2.0, 0.04, -4.2),   cost: 3500,  duration: 20, name: 'ATM Kiosk',       tab: 'lifestyle' },

--- DÜZENLEME 3/7 : Mola & WC'yi marketten ayır (PLOTS) ---
BUL:
  rest_lounge:  { id: 'rest_lounge',  type: 'rest_lounge',             tier: 3, pos: new THREE.Vector3(0, 0.04, -15.0),    cost: 11000, duration: 50, name: 'Mola & WC',       tab: 'lifestyle' },
DEĞİŞTİR:
  rest_lounge:  { id: 'rest_lounge',  type: 'rest_lounge',             tier: 3, pos: new THREE.Vector3(0, 0.04, -17.4),    cost: 11000, duration: 50, name: 'Mola & WC',       tab: 'lifestyle' },

--- DÜZENLEME 3b/7 : Tır peronunu oto yıkamadan ve servis kolonundan ayır (PLOTS) ---
BUL:
  truck_stop:   { id: 'truck_stop',   type: 'truck_stop',              tier: 4, pos: new THREE.Vector3(24.0, 0.04, -6.0),  cost: 22000, duration: 75, name: 'Tır Peronu',      tab: 'service' },
DEĞİŞTİR:
  truck_stop:   { id: 'truck_stop',   type: 'truck_stop',              tier: 4, pos: new THREE.Vector3(25.4, 0.04, -8.0),  cost: 22000, duration: 75, name: 'Tır Peronu',      tab: 'service' },

--- DÜZENLEME 3c/7 : H2 silosunu Drive-Thru Cafe'den ayır (PLOTS) ---
BUL:
  hydrogen_bay: { id: 'hydrogen_bay', type: 'hydrogen_bay',            tier: 4, pos: new THREE.Vector3(-22.0, 0.04, -4.0), cost: 25000, duration: 90, name: 'H2 Hidrojen',    tab: 'energy' }
DEĞİŞTİR:
  hydrogen_bay: { id: 'hydrogen_bay', type: 'hydrogen_bay',            tier: 4, pos: new THREE.Vector3(-23.2, 0.04, -4.0), cost: 25000, duration: 90, name: 'H2 Hidrojen',    tab: 'energy' }

--- DÜZENLEME 4/7 : Önlük tablosunu yeni koordinatlara ve Y kademelemesine hazırla ---
BUL:
    { key: 'tire_shop',    prop: 'hasTireShop',    dim: [8.5, 0.08, 5.5],   center: [16.25, 0.04, -4.5],  curbSide: 'east' },
    { key: 'lube_bay',     prop: 'hasLubeBay',     dim: [8.5, 0.08, 4.5],   center: [16.25, 0.04, -9.5],  curbSide: 'east' },
    { key: 'vacuum_hub',   prop: 'hasVacuumHub',   dim: [8.0, 0.08, 4.0],   center: [16.0, 0.04, -13.5],  curbSide: 'east' },
    { key: 'truck_stop',   prop: 'hasTruckStop',   dim: [8.0, 0.08, 12.0], center: [25.0, 0.04, -6.0],  curbSide: 'east' },
DEĞİŞTİR:
    { key: 'tire_shop',    prop: 'hasTireShop',    dim: [8.5, 0.08, 6.5],   center: [16.25, 0.04, -6.7],  curbSide: 'east' },
    { key: 'lube_bay',     prop: 'hasLubeBay',     dim: [8.5, 0.08, 6.5],   center: [16.25, 0.04, -13.3], curbSide: 'east' },
    { key: 'vacuum_hub',   prop: 'hasVacuumHub',   dim: [8.0, 0.08, 5.5],   center: [16.0, 0.04, -19.5],  curbSide: 'east' },
    { key: 'truck_stop',   prop: 'hasTruckStop',   dim: [10.5, 0.08, 12.0], center: [25.65, 0.04, -8.0], curbSide: 'east' },

BUL:
    { key: 'rest_lounge',  prop: 'hasRestLounge',  dim: [8.0, 0.08, 4.0],   center: [0, 0.04, -15.0],     curbSide: 'north' },
    { key: 'parcel_hub',   prop: 'hasParcelHub',   dim: [3.5, 0.08, 3.0],   center: [-6.8, 0.04, -7.0],   curbSide: 'north' },
    { key: 'atm_hub',      prop: 'hasAtmHub',      dim: [3.5, 0.08, 3.0],   center: [6.8, 0.04, -7.0],    curbSide: 'north' }
DEĞİŞTİR:
    { key: 'rest_lounge',  prop: 'hasRestLounge',  dim: [8.0, 0.08, 5.5],   center: [0, 0.04, -17.4],     curbSide: 'north' },
    { key: 'parcel_hub',   prop: 'hasParcelHub',   dim: [3.5, 0.08, 3.0],   center: [-6.8, 0.04, -7.0],   curbSide: 'north' },
    { key: 'atm_hub',      prop: 'hasAtmHub',      dim: [3.5, 0.08, 3.0],   center: [2.0, 0.04, -4.2],    curbSide: 'north' }

BUL:
    { key: 'hydrogen_bay', prop: 'hasHydrogenBay', dim: [6.0, 0.08, 6.0],   center: [-22.5, 0.04, -4.0],  curbSide: 'west' },
DEĞİŞTİR:
    { key: 'hydrogen_bay', prop: 'hasHydrogenBay', dim: [6.0, 0.08, 6.0],   center: [-23.7, 0.04, -4.0],  curbSide: 'west' },

--- DÜZENLEME 5/7 : Önlüklere per-tesis Y kademelemesi ver (z-fighting'in doğru çözümü) ---
BUL:
  FACILITY_APRONS.forEach(fa => {
    const isBuilt = State.upgrades && State.upgrades[fa.prop];
DEĞİŞTİR:
  FACILITY_APRONS.forEach((fa, faIndex) => {
    const isBuilt = State.upgrades && State.upgrades[fa.prop];

BUL:
    // G-03: cekirdek apronun ust yuzeyi y=0.08. Tesis slabini 0.012 m yukari
    // kaydirarak es duzlemsel z-fighting'i tamamen ortadan kaldiriyoruz.
    slab.position.set(fa.center[0], fa.center[1] + 0.012, fa.center[2]);
DEĞİŞTİR:
    // Cekirdek apronun ust yuzeyi y=0.08. Her tesis onlugune 0.012 m taban
    // + indeks basina 0.002 m kademe veriyoruz: hem cekirdek apronla hem de
    // komsu tesis onlukleriyle es duzlemsellik tamamen ortadan kalkiyor.
    // Boylece onlukler serbestce ortusebilir (dikissiz genisleme) ve yine de
    // z-fighting olusmaz.
    const apronLift = 0.012 + faIndex * 0.002;
    slab.position.set(fa.center[0], fa.center[1] + apronLift, fa.center[2]);

BUL:
      curb.position.set(fa.center[0] + fa.dim[0] / 2 - curbWidth / 2, fa.center[1] + curbHeight / 2, fa.center[2]);
DEĞİŞTİR:
      curb.position.set(fa.center[0] + fa.dim[0] / 2 - curbWidth / 2, fa.center[1] + apronLift + curbHeight / 2, fa.center[2]);

BUL:
      curb.position.set(fa.center[0] - fa.dim[0] / 2 + curbWidth / 2, fa.center[1] + curbHeight / 2, fa.center[2]);
DEĞİŞTİR:
      curb.position.set(fa.center[0] - fa.dim[0] / 2 + curbWidth / 2, fa.center[1] + apronLift + curbHeight / 2, fa.center[2]);

BUL:
      curb.position.set(fa.center[0], fa.center[1] + curbHeight / 2, fa.center[2] - fa.dim[2] / 2 + curbWidth / 2);
DEĞİŞTİR:
      curb.position.set(fa.center[0], fa.center[1] + apronLift + curbHeight / 2, fa.center[2] - fa.dim[2] / 2 + curbWidth / 2);

BUL:
    line.position.set(fa.center[0], fa.center[1] + 0.057, fa.center[2]);
DEĞİŞTİR:
    line.position.set(fa.center[0], fa.center[1] + apronLift + 0.045, fa.center[2]);

--- DÜZENLEME 6/7 : Platoyu genişlet (3 tesis boşlukta duruyor) ---
BUL:
  const plateauR = 27.5;
DEĞİŞTİR:
  const plateauR = 36.0;

BUL:
  const coreGeo = new THREE.CylinderGeometry(28, 29, 1.2, 32);
DEĞİŞTİR:
  const coreGeo = new THREE.CylinderGeometry(36.5, 37.5, 1.2, 32);

BUL:
  const dirtGeo = new THREE.CylinderGeometry(28.5, 30, 2.0, 32);
DEĞİŞTİR:
  const dirtGeo = new THREE.CylinderGeometry(37.0, 38.5, 2.0, 32);

BUL:
  const slabGeo = new THREE.CylinderGeometry(30, 31, 0.6, 32);
DEĞİŞTİR:
  const slabGeo = new THREE.CylinderGeometry(38.5, 39.5, 0.6, 32);

--- DÜZENLEME 7/7 : Ayrılma rotasını oto yıkama gövdesinden uzaklaştır ---
Ön sıra ayrılma rotası (12.5, 0, 7.8) noktasindan geciyor; oto yikama govdesi
X=13.4'te basliyor (0.9 m bosluk, arac genisligi 1.8 m). Iki sablonda da bu
noktayi bati yonune cekiyoruz.
BUL:
        new THREE.Vector3(10.5, 0, 5.2),                  // 3. Approach outbound ramp
        new THREE.Vector3(12.5, 0, 7.8),                  // 4. Enter Outbound Merge Ramp
DEĞİŞTİR:
        new THREE.Vector3(10.5, 0, 5.2),                  // 3. Approach outbound ramp
        new THREE.Vector3(11.4, 0, 7.8),                  // 4. Enter Outbound Merge Ramp (oto yikama govdesine 2.0 m net)

BUL:
        new THREE.Vector3(10.5, 0, 5.2),                  // 4. Approach outbound ramp
        new THREE.Vector3(12.5, 0, 7.8),                  // 5. Enter Outbound Merge Ramp
DEĞİŞTİR:
        new THREE.Vector3(10.5, 0, 5.2),                  // 4. Approach outbound ramp
        new THREE.Vector3(11.4, 0, 7.8),                  // 5. Enter Outbound Merge Ramp (oto yikama govdesine 2.0 m net)

--- BİTİŞ ---
Doğrulama:
  node --check web_3d_station/game.js && echo "SYNTAX OK"
Ardından Paket 4'teki `verify-layout.js` betiğini çalıştır.
````

</details>

**Beklenen:** sözdizimi OK · Paket 4 betiği `0 çakışma, 0 plato taşması` raporlamalı.

**Bu paketin sonuç yerleşimi (simüle edilerek doğrulandı):**

| Taşınan | Eski | Yeni | Gerekçe |
|---|---|---|---|
| `tire_shop` | (16.25, −4.5) | (16.25, **−6.7**) | wash ile −0.99 m içiçe geçme |
| `lube_bay` | (16.25, −9.5) | (16.25, **−13.3**) | tire_shop ile −0.45 m |
| `vacuum_hub` | (16.0, −13.5) | (16.0, **−19.5**) | lube_bay ile −1.00 m |
| `atm_hub` | (6.8, −7.0) | (**2.0, −4.2**) | market duvarında (−0.87 m); yaya plazasına alındı |
| `rest_lounge` | (0, −15.0) | (0, **−17.4**) | market ile −0.10 m |
| `truck_stop` | (24.0, −6.0) | (**25.4, −8.0**) | wash ile −0.10 m + servis kolonuna 0.4 m |
| `hydrogen_bay` | (−22.0, −4.0) | (**−23.2**, −4.0) | bakery_drive ile 0.10 m |
| `plateauR` | 27.5 | **36.0** | 3 tesis + 3 önlük plato dışındaydı |

Sonuç: **0 bina çakışması**, blok içi en dar aralık **1.20 m** (wash↔tire_shop ve lube_bay↔vacuum_hub), en uzak yapı köşesi r = 34.80 < 36.0.

---

### 📦 PAKET 2C — 10 ince tesise prop uygulaması + 5 tesise kademe

> **Dosya:** `web_3d_station/game.js` · **Ön koşul:** Paket 2A (prop kütüphanesi)
> **Kapsanan:** Direk 1 §1.1 (ince mesh'ler ve kademesizlik)

Bu paket 10 tesisi zenginleştirir. Her tesis için düzenleme **aynı kalıptadır**: `scene.add(...)` satırından hemen önce prop çağrılarını ekle. Haiku'nun tek seferde 10 tesisi işlemesi risklidir; **iki alt-göreve bölünmesi önerilir** (2C-1: servis grubu 5 tesis, 2C-2: perakende/enerji grubu 5 tesis).

**Tesis başına prop reçetesi** (Direk 1'in dört alt-başlığına birebir karşılık gelir):

| Tesis | Eklenecek prop'lar (yerel koordinat) |
|---|---|
| `vacuum_hub` | `propBollard()` ×2 @ (±1.6, 0, 1.4) · `propDrainGrate(1.2,0.5)` @ (0,0,-1.2) · `propHoseReel()` @ (1.1, 1.2, 0) · `propFloorStripe(3.2,0.2)` @ (0,0,1.9) · `propLevelPips(level)` @ (-1.9,0,1.6) |
| `moto_dock` | `propPalletStack(2)` @ (-1.5,0,-1.0) · `propWheelChock()` ×2 @ (±0.5,0,0.9) · `propBollard()` @ (1.7,0,1.2) · `propLevelPips(level)` @ (-1.7,0,1.2) |
| `truck_stop` | `propBollard()` ×4 @ (±3.6, 0, ±4.2) · `propWheelChock()` ×2 @ (±1.2,0,-3.0) · `propFloorStripe(7.0,0.25, Mat.roadWhite)` @ (0,0,2.6) · `propCableReel()` @ (3.0,0,-1.4) · `propLevelPips(level)` @ (-4.0,0,3.8) |
| `food_truck` | `propTrashBin()` @ (2.0,0,0.8) · `propBench()` @ (-1.9,0,1.2) · `propNeonTotem(Mat.neonAmber)` @ (2.4,0,-1.2) · `propFloorStripe(3.0,0.18)` @ (0,0,1.9) |
| `parcel_hub` | `propBollard()` ×2 @ (±1.4,0,1.0) · `propPalletStack(3)` @ (-1.8,0,-0.6) · `propNeonTotem(Mat.evGlow)` @ (1.9,0,-0.8) · `propLevelPips(level)` @ (-1.6,0,1.1) |
| `atm_hub` | `propBollard()` ×2 @ (±1.2,0,0.9) · `propTrashBin()` @ (1.6,0,-0.7) · `propFloorStripe(2.4,0.16)` @ (0,0,1.2) · `propLevelPips(level)` @ (-1.4,0,1.0) |
| `rest_lounge` | `propBench()` ×2 @ (±1.7,0,1.6) · `propTrashBin()` @ (2.6,0,1.4) · `propNeonTotem(Mat.windowWarm)` @ (-2.8,0,-1.0) · `propPalletStack(2)` @ (2.7,0,-1.6) · `propLevelPips(level)` @ (0,0,2.2) |
| `pet_park` | `propBench()` ×2 @ (±1.8,0,2.4) · `propTrashBin()` @ (2.4,0,3.0) · `propBollard()` ×2 @ (±2.4,0,-3.4) · `propLevelPips(level)` @ (0,0,3.6) |
| `hydrogen_bay` | `propBollard()` ×4 @ (±2.4,0,±2.4) · `propInverterCabinet()` @ (-2.6,0,0.6) · `propWheelChock()` ×2 @ (±0.8,0,2.6) · `propFloorStripe(4.4,0.22, Mat.greenAccent)` @ (0,0,3.0) · `propLevelPips(level)` @ (2.6,0,2.6) |
| `solar` (GES) | `propInverterCabinet()` @ (3.2,0,1.4) · `propCableReel()` @ (-3.0,0,1.6) · `propFloorStripe(5.0,0.2, Mat.greenAccent)` @ (0,0,2.4) |

**Kademe eklenmesi (5 tesis).** `rest_lounge`, `pet_park`, `parcel_hub`, `atm_hub`, `hydrogen_bay` fonksiyonlarının gövdesine, `scene.add(...)` satırından önce şu kalıp eklenir:

```js
  // Kademe farklilastirmasi: L2 ek modul, L3 aydinlatma + ikinci unite
  if (level >= 2) {
    const l2 = propInverterCabinet();          // tesise gore degisir, tabloya bak
    l2.position.set(/* tesise ozel */);
    <group>.add(l2);
  }
  if (level >= 3) {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.0, 6), Mat.lampPost);
    mast.position.set(/* tesise ozel */, 1.5, /* tesise ozel */);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.36), Mat.lampGlow);
    lamp.position.set(/* ayni x */, 3.0, /* ayni z */);
    <group>.add(mast, lamp);
  }
  <group>.add(propLevelPips(level).translateX(/* tesise ozel */));
```

> **Not:** Bu paket, tablodaki koordinatlar dışında hiçbir mevcut satırı değiştirmez — yalnızca her fonksiyonun `scene.add(...)` çağrısından önceki noktaya ekleme yapar. Bu yüzden `BUL` çapası her tesiste `  scene.add(<groupName>);` satırıdır ve dosyada benzersizdir.

---

### 📦 PAKET 2D — 13 jenerik parsel temeline aile karakteri

> **Dosya:** `web_3d_station/game.js` · **Ön koşul:** Paket 2A

`createGenericPlotMesh(plot, w, d)` imzasına `family` parametresi eklenir ve `plot.tab` değerine göre üç varyant üretir:

| Aile (`plot.tab`) | Temel karakteri |
|---|---|
| `service` | Gri beton pad + iki hidrolik lift kaidesi izi (`CylinderGeometry(0.22,0.22,0.05)`) + `Mat.oilStain` lekesi + 2 × `propBollard()` |
| `lifestyle` | Ahşap deck çerçevesi (`Mat.benchWood`) + tente direği stub'ı + 1 × `propPalletStack(1)` + 1 × `propTrashBin()` |
| `energy` | Gömülü kablo kanalı (`Mat.darkInk` 0.25 m şerit) + `propInverterCabinet()` kaidesi + `Mat.greenAccent` zemin boyası |

Mevcut disk + altın halka + köşe braketleri + fiyat rozeti **korunur**; aile karakteri bunların üzerine eklenir. Böylece `createPlotSignMesh` switch'i değişmeden kalır — yalnızca `createGenericPlotMesh` çağrılarına üçüncü argüman eklenir.

---

### 📦 PAKET 3 — Ateşböcekleri, egzoz dumanı, bayrak salınımı

> **Dosya:** `web_3d_station/game.js` · Diğer canlı dünya sistemlerine **dokunmaz**.
> **Kapsanan:** Direk 3 §3.2 (gerçekten eksik olan 3 sistem)

<details>
<summary><b>Haiku'ya verilecek prompt</b></summary>

````
Yalnızca `web_3d_station/game.js` dosyasını düzenle. CRLF satır sonlarını koru.
Mevcut canlı dünya sistemlerine (buhar, kuş, koyun, güve, klima) DOKUNMA.

--- DÜZENLEME 1/4 : Üç yeni sistemi ekle ---
BUL:
function createHighAltitudeJet(diorama) {
DEĞİŞTİR:
// Gece sokak lambalari etrafinda yorungede donen atesbocekleri
const fireflies = [];
function createFireflies(diorama) {
  const anchors = [
    new THREE.Vector3(-9.5, 2.6, 3.2),
    new THREE.Vector3(9.5, 2.6, 3.2),
    new THREE.Vector3(-3.0, 2.4, -12.0),
    new THREE.Vector3(4.2, 2.4, -12.0)
  ];
  anchors.forEach((a, ai) => {
    for (let i = 0; i < 4; i++) {
      const mat = Mat.lampGlow.clone();
      mat.transparent = true;
      mat.opacity = 0.0;
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.055), mat);
      m.position.copy(a);
      diorama.add(m);
      fireflies.push({
        mesh: m, mat, anchor: a.clone(),
        radius: 0.7 + Math.random() * 0.9,
        speed: 0.5 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        bobPhase: ai * 1.3 + i * 0.8
      });
    }
  });
}

// Kalkis aninda araclarin arka tamponundan cikan egzoz dumani
const exhaustPuffs = [];
function spawnExhaustPuff(pos, headingY) {
  if (exhaustPuffs.length > 24) return;
  const mat = Mat.steam.clone();
  mat.transparent = true;
  mat.opacity = 0.34;
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), mat);
  m.position.set(
    pos.x - Math.sin(headingY) * 1.9,
    0.32,
    pos.z - Math.cos(headingY) * 1.9
  );
  scene.add(m);
  exhaustPuffs.push({ mesh: m, mat, life: 0, max: 1.1 });
}

// Ruzgarda dalgalanan bayrak (direge monte, segmentli)
const windFlags = [];
function createWindFlag(diorama, x, z, mat) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.4, 6), Mat.chrome);
  pole.position.y = 2.2;
  pole.castShadow = true;
  g.add(pole);
  const segs = [];
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.62, 0.03), mat || Mat.redTrim);
    s.position.set(0.19 + i * 0.28, 3.85, 0);
    g.add(s);
    segs.push(s);
  }
  g.userData.segs = segs;
  diorama.add(g);
  windFlags.push(g);
}

function createHighAltitudeJet(diorama) {

--- DÜZENLEME 2/4 : Sistemleri diorama kurulumuna bağla ---
BUL:
  createHighAltitudeJet(diorama);
DEĞİŞTİR:
  createHighAltitudeJet(diorama);
  createFireflies(diorama);
  createWindFlag(diorama, -18.0, 6.6, Mat.redTrim);
  createWindFlag(diorama, 21.5, -1.2, Mat.blueAccent);

--- DÜZENLEME 3/4 : Her karede güncelle ---
BUL:
  updateWindAndCreatures(delta, totalSeconds);
DEĞİŞTİR:
  updateWindAndCreatures(delta, totalSeconds);
  updateFirefliesFlagsAndExhaust(delta, totalSeconds);

--- DÜZENLEME 4/4 : Güncelleme fonksiyonunu ekle ---
BUL:
function updateSkyLighting() {
DEĞİŞTİR:
function updateFirefliesFlagsAndExhaust(delta, time) {
  // Atesbocekleri: sadece gece gorunur, lamba cevresinde yorunge + nabiz
  const h = State.hour;
  const nightAmt = (h >= 20 || h < 5) ? 1.0 : (h >= 19 ? (h - 19) : (h < 6 ? (6 - h) : 0));
  fireflies.forEach(f => {
    const a = time * f.speed + f.phase;
    f.mesh.position.set(
      f.anchor.x + Math.cos(a) * f.radius,
      f.anchor.y + Math.sin(time * 1.6 + f.bobPhase) * 0.35,
      f.anchor.z + Math.sin(a) * f.radius
    );
    const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(time * 3.1 + f.bobPhase));
    f.mat.opacity = Math.min(1, nightAmt) * pulse;
  });

  // Bayrak: direkten uzaklastikca artan genlikte dalga
  windFlags.forEach((g, gi) => {
    g.userData.segs.forEach((s, i) => {
      const amp = 0.06 + i * 0.05;
      s.position.z = Math.sin(time * 3.4 + i * 0.9 + gi * 2.0) * amp;
      s.rotation.y = Math.sin(time * 3.4 + i * 0.9 + gi * 2.0) * (0.12 + i * 0.06);
    });
  });

  // Egzoz dumani: buyuyup solarak yok olur
  for (let i = exhaustPuffs.length - 1; i >= 0; i--) {
    const p = exhaustPuffs[i];
    p.life += delta;
    const t = p.life / p.max;
    if (t >= 1) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mat.dispose();
      exhaustPuffs.splice(i, 1);
      continue;
    }
    p.mesh.position.y += delta * 0.55;
    const s = 1 + t * 2.4;
    p.mesh.scale.set(s, s, s);
    p.mat.opacity = 0.34 * (1 - t);
  }
}

function updateSkyLighting() {

--- BİTİŞ ---
Doğrulama:
  node --check web_3d_station/game.js && node -e "const c=require('fs').readFileSync('web_3d_station/game.js','utf8');
  ['createFireflies','spawnExhaustPuff','createWindFlag','updateFirefliesFlagsAndExhaust']
    .forEach(f=>console.log(f+':', c.includes('function '+f) ? 'OK':'EKSIK'));"
````

</details>

> **Bağlanmamış uç — bilinçli:** `spawnExhaustPuff()` tanımlanır ama bu pakette çağrılmaz. Çağrı noktası araç durum makinesinin `DEPARTING` geçişidir ve orası Paket 2B'nin waypoint düzenlemeleriyle aynı bölgede; iki paketin aynı satırlara dokunmasını önlemek için çağrı bağlantısı Paket 4'ün son adımına bırakıldı. Fonksiyon bağlanana kadar egzoz dumanı görünmez, başka hiçbir şeyi etkilemez.

---

### 📦 PAKET 4 — Doğrulama betikleri

> **Yeni dosya:** `web_3d_station/tools/verify-layout.js` (çalışma zamanına dahil değil, yalnızca geliştirme aracı)

Bu paket üç ölçümü tekrarlanabilir hale getirir; böylece sonraki her yerleşim değişikliği tek komutla denetlenir:

1. **Çakışma denetimi** — her `spawn*Mesh` fonksiyonundan geometri çıkarıp ayak izlerini hesaplar, çift bazında koridor ölçer. Eşik: aynı blok içi ≥1.2 m, bloklar arası ≥4.0 m.
2. **Plato denetimi** — her tesis ve önlük köşesinin `plateauR`'a göre yarıçapını hesaplar, taşanları listeler.
3. **Kontrast denetimi** — `style.css`'teki `--accent-*` / `--on-*` çiftlerini okuyup WCAG oranını hesaplar, 4.5:1 altındakileri raporlar.

Ek olarak son adım: `spawnExhaustPuff()` çağrısını araç ayrılma geçişine bağlamak (Paket 3'ün bilinçli açık ucu).

```bash
node --check web_3d_station/game.js && node web_3d_station/tools/verify-layout.js
```

**Godot senkronizasyonu bu paketten çıkarıldı** — §5'teki ölçüm, eşlenecek bir tesis sisteminin Godot tarafında bulunmadığını gösteriyor. Ayrı yol haritası olarak planlanması önerilir.

---

## 7. Kısıtlara Uyum

| Kısıt | Durum |
|---|---|
| Tarayıcı otomasyonu / subagent yok | ✅ Tüm bulgular statik analiz ve programatik geometri ölçümü |
| Yeni harici kütüphane yok | ✅ Prop kütüphanesi mevcut 85 `Mat` malzemesini kullanır; saf CSS + Three.js r128 |
| Kesin dosya yolu + satır blokları | ✅ Her paket `BUL`/`DEĞİŞTİR` çapalarıyla |
| `node -c` doğrulaması | ✅ Her `game.js` paketinin sonunda |
| Sıfır emoji | ✅ Önceki pakette sağlandı, yeni metin eklenmiyor |
| i18n TR+EN eşzamanlı | ⚠️ Bu planın paketleri **yeni UI metni eklemiyor**, i18n etkisi yok. Mevcut 74 sabit Türkçe metin `GORSEL_DENETIM_RAPORU.md` Paket 4'te ayrıca ele alınıyor. |

## 8. Önerilen Uygulama Sırası

1. **Paket 2B** — yerleşim düzeltmesi (6 çakışma + 3 plato taşması + tır peronu regresyonu). En yüksek görsel etki, en düşük risk.
2. **Paket 1** — palet ve kontur. Bağımsız, tek başına doğrulanabilir.
3. **Paket 2A** — prop kütüphanesi. Sadece ekleme yapar, hiçbir şeyi bozamaz.
4. **Paket 2C** (2C-1, 2C-2 olarak bölünmüş) — tesis zenginleştirme.
5. **Paket 2D** — parsel temelleri.
6. **Paket 3** — canlı dünya eklemeleri.
7. **Paket 4** — doğrulama betikleri + egzoz bağlantısı.
