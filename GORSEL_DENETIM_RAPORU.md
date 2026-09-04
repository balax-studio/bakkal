# PixelOil 3D — Görsel Denetim Raporu & Mobil Uyumluluk Paketi

**Tarih:** 2026-09-04
**Denetlenen sürüm:** `main` @ `630a176`
**Kapsam:** `web_3d_station/game.js` (7459 sat.), `web_3d_station/index.html` (1192 sat.), `web_3d_station/style.css` (1198 sat.)
**Yöntem:** Statik kod analizi. Kısıtlamalar gereği hiçbir tarayıcı otomasyonu / subagent çalıştırılmadı; her bulgu dosya + satır referansıyla doğrulandı. `node --check web_3d_station/game.js` → **SYNTAX OK**.

> Bu rapor, `GORSEL-DENETIM-RAPORU.md` (2026-09-03) dosyasının **halefidir**. Önceki raporun B-01 (paylaşılan cam materyali), B-02 (çift fonksiyon tanımı), B-03 (renk uzayı), B-04 (toast z-index) bulguları kod tabanında **giderilmiş** durumda ve burada tekrarlanmadı. i18n sözlüğü de artık **180/180 TR/EN paritesinde** — anahtar eksiği yok.

---

## Yönetici Özeti

**21 aktif bulgu.** Bunlardan 4'ü mobilde oyunu kullanılamaz hale getiriyor:

| # | Sorun | Neden kritik |
|---|---|---|
| **G-01** | Ortografik kamera frustum'u yalnızca dikey yarı-yüksekliği sabitliyor (`d = 18`) | iPhone dikey (390×844) modda görüş genişliği **±8.3 m**; istasyon çekirdeği ±16 m. Pompa adaları ve market ekranın dışında kalıyor. |
| **G-02** | `setGraphicsQuality()` var olmayan `renderer.shadowMap.mapSize` üzerine yazıyor | Ayarlar → Grafik Kalitesi butonlarından herhangi birine basmak **TypeError fırlatıyor**; ne pixelRatio ne partikül limiti ne de buton vurgusu uygulanıyor. Düşük uçlu cihazlar performans ayarı yapamıyor. |
| **G-11** | `<meta viewport>` içinde `viewport-fit=cover` yok | CSS'teki **13 adet `env(safe-area-inset-*)` kuralının tamamı iOS'ta 0'a çözülüyor.** Çentik ve home-indicator koruması fiilen yok. |
| **G-12** | `#top-bar` `flex-wrap: nowrap` + her iki tarafta `flex-shrink: 0` | 390 px genişlikte içerik ~520 px yer istiyor → **~165 px taşma**; en sağdaki Ayarlar butonu ekran dışına itiliyor, hiç tıklanamıyor. |

Ayrıca **48×48 px dokunma hedefi kuralı 8 ayrı bileşen sınıfında + 20 satır-içi stilli butonda ihlal ediliyor** (en küçüğü `.tariff-btn` = 24×24 px) ve `index.html` içinde **~74 adet sabit Türkçe metin** `data-i18n` olmadan duruyor — İngilizce cihazda arayüzün yarısı Türkçe kalıyor.

---

## BÖLÜM 1 — GÖRSEL DENETİM TABLOSU

### A. 3D Sahne ve Grafik

| ID | Kategori | Konum (Dosya & Satır) | Tespit Edilen Sorun | Mobil Etkisi | Çözüm Önerisi |
|---|---|---|---|---|---|
| **G-01** | 3D/Kamera | `web_3d_station/game.js:1085-1086`, `1165-1170` | `const d = 18` dikey yarı-yükseklik olarak sabit; yatay = `d * aspect`. Aspect < 1 olduğunda yatay görüş çöküyor. 390×844'te yarı-genişlik **8.3 m**, 768×1024'te **13.5 m**. İstasyon içeriği X ∈ [-26, +29]. | 🔴 Dikey modda pompa adaları, market ve tesislerin çoğu ekran dışında. Oyun oynanamaz. | `d`'yi hem dikey hem yatay minimuma göre türet: `d = min(40, max(18, 17 / aspect))`. Ortak `applyCameraFrustum()` yardımcısı ile init + resize'da tek noktadan uygula. |
| **G-02** | 3D/Runtime | `web_3d_station/game.js:6952-6967` | `renderer.shadowMap.mapSize.width = …` — Three.js'te `WebGLShadowMap` nesnesinin `mapSize` özelliği **yoktur** (mapSize `light.shadow` üzerindedir). `undefined.width` ataması TypeError fırlatıyor. | 🔴 Grafik kalitesi ayarı tamamen çalışmıyor; hata fırlatıldığı için altındaki `particleLimit` ve `setPixelRatio` satırları da hiç çalışmıyor. | Hedefi `sunLight.shadow.mapSize` yap, `sunLight.shadow.map` varsa dispose edip null'a çek ve `sunLight.shadow.needsUpdate = true` ile yeniden derlet. |
| **G-03** | 3D/Z-Fighting | `web_3d_station/game.js:1500-1516` ⟷ `1760-1763` | Çekirdek apron `BoxGeometry(24, 0.08, 19)` @ `y=0.04` → üst yüzey **y = 0.08**. Tesis apron slabları da `[w, 0.08, d]` @ `y=0.04` → üst yüzey **y = 0.08**. Eş düzlemsel. `market` (X[2,10] Z[-13,-7]), `food_truck` (X[5.5,10.5] Z[-5.5,-1.5]), `atm_hub` (X[5.05,8.55] Z[-8.5,-5.5]), `parcel_hub` (X[-8.55,-5.05] Z[-8.5,-5.5]) çekirdek apronun **tamamen içinde** kalıyor. | 🟠 Mobil GPU'ların düşük derinlik hassasiyetinde 8×6 m'lik alanlarda sürekli titreme; kamera hareketinde çok belirgin. | Tesis slab merkez Y'sini `0.04` → `0.052`'ye çek (üst yüzey 0.092, çekirdek apronun 0.012 m üstünde). Üstteki beyaz şerit Y'sini de `+0.045` → `+0.050` yap. |
| **G-04** | 3D/Z-Fighting | `web_3d_station/game.js:1501-1516` | Tesis apronları birbiriyle de çakışıyor, hepsi aynı Y'de: `truck_stop` (X[19,29]) × `tire_shop` (X[12,20.5]) → X[19,20.5]×Z[-7.25,-1.75]; `truck_stop` × `lube_bay` → X[19,20.5]×Z[-11.75,-7.25]; `turbine` (X[-25.5,-18.5]) × `pet_park` (X[-19.5,-12]) → X[-19.5,-18.5]×Z[-15.75,-11.25]; `hydrogen_bay` × `bakery_drive` → X[-20.5,-18.5]×Z[-5.5,-1]. | 🟠 Tier 4 tesisler kurulduğunda köşelerde şerit şerit titreme. | `truck_stop` genişliğini `10.0 → 8.0` ve merkezini `24.0 → 25.0`; `turbine`/`hydrogen_bay` genişliğini `7.0 → 6.0` ve merkezini `-22.0 → -22.5` yap. |
| **G-05** | 3D/Işık-Gölge | `web_3d_station/game.js:6936-6943` | `obj.userData._castShadow` yazılıyor ama **hiçbir yerde okunmuyor** (grep: 2 yazma, 0 okuma). Ayrıca `if (!obj.userData._castShadow)` guard'ı `false` değerini "kaydedilmemiş" sayıyor. Gölgeyi kapatıp açmak, orijinalde `castShadow=false` olan zemin/apron/plane mesh'lerini de gölge dökücü yapıyor. | 🟠 Ayarlardan gölge kapatıp açan oyuncuda tüm zemin düzlemleri gölge dökmeye başlıyor → yoğun shadow-acne + mobilde ciddi FPS düşüşü. Geri dönüşü yok. | `_castShadow` guard'ını `=== undefined` ile karşılaştır, gölge açılırken **kaydedilen değeri geri yükle**: `obj.castShadow = obj.userData._castShadow`. |
| **G-06** | 3D/Işık-Gölge | `web_3d_station/game.js:1141-1148`, `6669-6674` | `shadow.camera` yarı-genişliği ±30 sabit; istasyon içeriği ±29 + çevre ağaçları daha dışarıda. `updateSkyLighting()` güneşi X ekseninde döndürüyor ama gölge frustum'u ve `shadow.bias` sabit kalıyor. Ayrıca `normalBias = 0.02`, 2048 haritada teksel ≈ 0.029 m ile uyumluyken 1024'e düşünce teksel 0.059 m'ye çıkıyor. | 🟡 Sabah/akşam uzun gölgeler frustum kenarında sert kesiliyor; düşük kalite profilinde (mobil) gölge akne çizgileri. | `shadowDist`'i 30 → 34 çıkar; `normalBias`'ı harita boyutuyla ölçekle: `normalBias = 2048 / mapSize * 0.02`. |
| **G-07** | 3D/Billboard | `web_3d_station/game.js:1974` (`badge.rotation.x = -Math.PI / 7`), `2229-2236` (`updatePlotBadges`) | Parsel fiyat rozetleri yalnızca Y ekseninde salınıyor; `lookAt(camera)` yok. `controls.mouseButtons.RIGHT = ROTATE` ile 360° dönüş serbest. | 🟡 Kamerayı çeviren oyuncuda tüm inşaat rozetleri kenardan/ters görünüyor, fiyat okunmuyor. | `updatePlotBadges` içinde `badge.quaternion.copy(camera.quaternion)` ile kameraya kilitle (ortografik kamerada tam billboard). |
| **G-08** | 3D/Diorama | `web_3d_station/game.js:2149-2171` | 20 parselden **13'ü** `createGenericPlotMesh()`'e düşüyor — içeriği yalnızca 0.9 m'lik siyah disk + altın halka + 4 köşe L-braketi. Mimariye özel temel yalnızca `pump`, `wash`, `market`, `solar`, `turbine`, `ev` için var. | 🟡 Tesislerin çoğu inşa edilmeden önce ayırt edilemiyor; "jenerik tabela" hissi, mimari kimlik yok. | Kısa vadede tip başına renk/geometri farklılaştırması (servis = gri beton pad + hidrolik kaide izi, lifestyle = ahşap deck + tente direği stub'ı, energy = kablo kanalı + trafo kaidesi). Uzun vadede tip başına ayrı `create*PlotMesh` fonksiyonu. |
| **G-09** | 3D/Kamera | `web_3d_station/game.js:5276-5277` ⟷ `6779-6780` | Pan sınırı iki farklı yerde iki farklı değerle: klavye yolunda `±22 / ±18`, `animate()` içinde `±26 / ±20`. `animate()` her karede çalıştığı için 5276'daki clamp ölü kod. | 🟢 Davranışsal fark yok ama bakım riski. | Sınırları tek bir `const CAM_BOUNDS = { x: 26, z: 20 }` sabitinde topla, iki yerde de onu kullan. |
| **G-10** | 3D/Bellek | `web_3d_station/game.js:1493-1497` | `updateStationApronExpansion()` çocukları `remove()` ediyor ama `geometry.dispose()` çağırmıyor; her tesis inşasında 16'ya kadar yeni `BoxGeometry` üretiliyor. Kod tabanında toplam yalnızca 6 `dispose()` çağrısı var. | 🟡 Uzun oturumda kademeli GPU bellek büyümesi; düşük RAM'li telefonlarda sekme çökmesi. | Kaldırma döngüsünde `obj.geometry && obj.geometry.dispose()` ekle (materyaller paylaşımlı olduğu için **materyali dispose etme**). |

### B. Mobil Uyumluluk ve UI/UX

| ID | Kategori | Konum (Dosya & Satır) | Tespit Edilen Sorun | Mobil Etkisi | Çözüm Önerisi |
|---|---|---|---|---|---|
| **G-11** | Mobil/Safe-Area | `web_3d_station/index.html:5` | Viewport meta'da `viewport-fit=cover` yok. Bu olmadan iOS Safari `env(safe-area-inset-*)` değerlerini **daima 0** döndürür. `style.css` içindeki 13 safe-area kuralı (sat. 129-131, 296-297, 322, 361, 751-752, 1019, 1033-1034, 1055) fiilen ölü. | 🔴 Çentikli iPhone'larda üst HUD çentiğin altında; home-indicator alt FAB menüsünü örtüyor. App Store inceleme riski. | `viewport-fit=cover` ekle. Ayrıca `maximum-scale=1.0, user-scalable=no` erişilebilirlik açısından sorunlu — pinch-zoom'u CSS `touch-action` zaten kontrol ediyor, bu ikisini kaldır. |
| **G-12** | Mobil/Taşma | `web_3d_station/style.css:127-155` | `#top-bar { flex-wrap: nowrap }` + `.top-bar-left { flex-shrink: 0 }` + `.top-bar-right { flex-shrink: 0 }`. 390 px ekranda kullanılabilir 354 px'e karşı istenen genişlik ≈ 520 px (sol ≈ 283, sağ ≈ 232). | 🔴 **~165 px taşma.** Sağdaki Ayarlar ve Debug butonları ekranın dışında, hiç tıklanamıyor. Panel kenarlığı da taşıyor. | ≤680 px'te yakıt göstergelerini (`.fuel-gauges`) gizle, `.top-bar-left`'a `min-width:0; overflow:hidden` ver, `.top-bar-right`'ın `flex-shrink`'ini `1` yap ve `.top-bar-right-controls`'u `flex-shrink:0` bırak. |
| **G-13** | Mobil/Viewport | `web_3d_station/style.css:390`, `406` | `.modal-overlay { height: 100vh }` ve `.modal-card { max-height: calc(100vh - 40px) }`. Mobil tarayıcılarda `100vh` = **büyük** viewport; adres/araç çubuğu görünürken kart ekranın altından taşıyor. | 🟠 Uzun modallarda (İnşaat, Ayarlar, Debug) en alttaki onay butonu araç çubuğunun altında kalıyor, erişilemiyor. | `height: 100dvh` / `max-height: calc(100dvh - 40px)` kullan, `100vh` satırını fallback olarak önce bırak. Overlay padding'ine `env(safe-area-inset-bottom)` ekle. |
| **G-14** | Mobil/Dokunma Hedefi | `style.css:611` (`.tariff-btn` 24×24), `558` (`.qty-btn` 26×26), `871` (`.segment-btn` ~26), `636` (`.tab-btn` ~28), `501` (`.tip-btn` ~30), `485` (`.preset-btn` ~32), `528` (`.buy-btn` ~32), `790` (`.debug-chip-btn` `min-height:38px` — sat. 277'deki 48px'i eziyor), `362` (`.cam-btn` `min-height:38px` @768px) + `index.html`'de 20 satır-içi stilli buton (15'i `padding: 6px 10px`) | 48×48 px kuralının **8 bileşen sınıfında + 20 satır-içi butonda** ihlali. En küçüğü tarife +/- butonları: 24×24 px. `.debug-chip-btn` iki kez tanımlı, ikinci tanım min-height'ı 48 → 38'e düşürüyor. | 🟠 Tarife düzenleme, sipariş miktarı, sekme geçişi ve ayar toggle'ları parmakla isabet ettirilemiyor. App Store / Play Store erişilebilirlik denetiminde doğrudan bulgu. | Tüm etkileşimli sınıflara `min-height:48px; min-width:48px` ver. Görsel boyutu küçük tutmak gerekiyorsa görünür kutuyu koru, `::after` ile şeffaf 48×48 dokunma zarfı ekle. Yinelenen `.debug-chip-btn` bloğundaki `min-height:38px`'i sil. Satır-içi `padding: 6px 10px` stillerini `.neo-btn-sm` sınıfına taşı. |
| **G-15** | UI/Bozuk Değişken | `web_3d_station/style.css:1068`, `web_3d_station/index.html:1078` | `var(--dark-ink)` ve `var(--gold-accent)` **hiçbir yerde tanımlı değil** (`:root`'ta `--ink-border` ve `--accent-gold` var). Fallback verilmediği için bildirimler geçersiz sayılıyor. | 🟠 Rush-hour banner'ı arka planını kaybediyor → beyaz üstüne beyaz metin, okunmuyor. Kasa kazancı göstergesi (28 px) altın yerine varsayılan renkle çiziliyor. | `style.css:1068` → `background: var(--ink-border);`. `index.html:1078` → `--dark-ink` yerine `--ink-border`, `--gold-accent` yerine `--accent-gold`. |
| **G-16** | Mobil/Tipografi | `web_3d_station/style.css:1188-1198` ⟷ `199-211` | `clamp()` yalnızca 3 kuralda ve `--fs-*` değişkenleri **sadece** `@media (max-width:640px)` içinde tanımlı. `.stat-chip { font-size: var(--fs-sm) }` etkisiz çünkü `.chip-label` (8px) ve `.chip-val` (11px) alt seçicileri sabit px ile eziyor. Toplam 1198 satırda sadece 3 `clamp()`. | 🟡 HUD çip etiketleri 320-390 px cihazlarda 8 px'te kalıyor — WCAG altı, okunmuyor; büyük yazı tipi tercihine de yanıt vermiyor. | `--fs-*` değişkenlerini `:root`'a taşı, `.chip-label`/`.chip-val`/`.item-desc`/`.tank-status` gibi sabit px değerlerini `clamp()` tabanlı değişkenlerle değiştir. Minimum gövde metni 11 px. |
| **G-17** | UI/İkonografi | `web_3d_station/game.js:7351-7352` (`⚠️`), `web_3d_station/index.html:1119-1149` (`✓` ×6, `★` ×1) | Unicode emoji/dingbat ikon olarak kullanılıyor. Kural: sıfır emoji, tamamı 2-2.5 px konturlu neo-brutalist SVG. | 🟡 Emoji platforma göre farklı render ediliyor (Android'de renkli Noto, iOS'ta Apple Color) — neo-brutalist dile aykırı, marka tutarsızlığı. | `⚠️`'yi metinden çıkar (toast zaten uyarı stilinde). `✓` → `<polyline points="20 6 9 17 4 12">` SVG; `★` → `<polygon points="12 2 15.09 8.26 …">` SVG, ikisi de `stroke-width="2.5"`. |
| **G-18** | i18n | `web_3d_station/index.html` — 74 satır (örn. `343`, `344`, `453`, `510`, `596`, `766`, `880`, `908`, `938-940`, `1023-1054`, `1117-1147`, `1170`) | Sözlük paritesi tam (**TR 180 / EN 180, eksik anahtar 0**) ancak `index.html` içinde 74 sabit Türkçe metin `data-i18n` taşımıyor: tema kartları, personel işe alım, tesis başlıkları/açıklamaları, parseller, ihaleler, ayar toggle'ları, grafik kalitesi butonları, debug paneli, 7-gün streak kartları, gizlilik başlığı. | 🟠 Dil EN'e alındığında arayüzün büyük bölümü Türkçe kalıyor. App Store lokalizasyon metadata'sı ile çelişiyor. | Her metne `data-i18n="…"` ekle ve karşılıklarını `I18N.tr` / `I18N.en` sözlüklerine yaz. `updateI18nDOM()` zaten `[data-i18n]` üzerinde geziyor, ek altyapı gerekmiyor. |
| **G-19** | UI/İkonografi | `web_3d_station/index.html:68` (`stroke-width="1.5"`), `270` (`stroke-width="3"`) | 51 SVG ikonun 49'u `stroke-width="2.5"`; 2 aykırı değer. | 🟢 Küçük ekranda kontur kalınlığı tutarsızlığı gözle seçiliyor. | İkisini de `2.5` yap. Sat. 68'deki yıldız `fill="currentColor"` olduğu için kontur zaten görünmüyor — `stroke` niteliğini tamamen kaldırmak da geçerli. |
| **G-20** | Mobil/Jest | `web_3d_station/style.css:40-49` (`body, html`) | `overscroll-behavior` hiç tanımlı değil (grep: 0 eşleşme). `overflow:hidden` Chrome Android'de pull-to-refresh'i engellemiyor. | 🟡 Oyuncu haritayı aşağı sürüklerken sayfa yenileniyor, oturum kayboluyor. | `body, html`'e `overscroll-behavior: none;` ekle. |
| **G-21** | Mobil/Safe-Area | `web_3d_station/style.css:383-398` | `.modal-overlay { padding: 16px }` — safe-area yok. Yatay modda çentik, dikey modda home-indicator kart kenarını kesiyor. | 🟡 Landscape'te modal kartın sol kenarı çentiğin altında kalıyor. | `padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));` (G-11 ile birlikte etkili olur). |

---

## BÖLÜM 2 — HAIKU 4.5 İÇİN ATOMİK UYGULAMA PROMPTLARI

Paketler **sırayla** uygulanmalıdır. Her paket bağımsız olarak doğrulanabilir ve tek başına bağlam limitine sığar. Her paketin sonunda belirtilen doğrulama komutu çalıştırılmalıdır.

> **Doğrulama durumu:** Aşağıdaki 26 `BUL` bloğunun tamamı denetim sırasında koda karşı çalıştırılarak **dosyada beklenen sayıda ve benzersiz** olduğu programatik olarak teyit edildi (Paket 1: 17/17, Paket 2: 17/17, Paket 3: 9/9 eşleşme). Halüsinasyon riski yoktur.
>
> ⚠️ **Satır sonu uyarısı:** Üç dosya da **CRLF** (`\r\n`) satır sonu kullanıyor (style.css 1198, game.js 7459, index.html 1192 satır). Düzenleme aracı dosyanın mevcut satır sonlarını korumalıdır; dosyayı LF'e çevirme, aksi halde diff tüm dosyayı kaplar.

---

### 📦 PAKET 1 — `style.css` mobil responsive & safe-area düzeltmeleri

> **Kapsanan bulgular:** G-12, G-13, G-14, G-15, G-16, G-20, G-21
> **Tek dosya:** `web_3d_station/style.css`
> **Diğer dosyalara dokunma.**

<details>
<summary><b>Haiku'ya verilecek prompt (kopyala)</b></summary>

````
Yalnızca `web_3d_station/style.css` dosyasını düzenle. Başka hiçbir dosyaya dokunma.
Aşağıdaki 8 düzenlemeyi sırayla, tam olarak tarif edildiği gibi uygula.
Hiçbir kuralı yeniden yazma, yalnızca belirtilen satırları değiştir/ekle.

--- DÜZENLEME 1/8 : Kök değişkenlere eksik token'ları ve akışkan tipografiyi ekle ---
BUL (dosyanın başındaki :root bloğunun son satırları):
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
DEĞİŞTİR:
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  /* G-15: eksik token alias'ları */
  --dark-ink: #242D35;
  --gold-accent: #E5A93C;

  /* G-16: akışkan tipografi ölçeği */
  --fs-2xs: clamp(9px, 2.2vw, 10px);
  --fs-xs: clamp(10px, 2.5vw, 11.5px);
  --fs-sm: clamp(11px, 2.9vw, 13px);
  --fs-base: clamp(12px, 3.3vw, 15px);

  /* Minimum dokunma hedefi */
  --touch-min: 48px;
}

--- DÜZENLEME 2/8 : Pull-to-refresh engelle (G-20) ---
BUL:
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 3D Canvas */
DEĞİŞTİR:
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior: none;
}

/* 3D Canvas */

--- DÜZENLEME 3/8 : HUD çip metinlerini akışkan yap (G-16) ---
BUL:
.stat-chip .chip-label {
  font-size: 8.5px;
DEĞİŞTİR:
.stat-chip .chip-label {
  font-size: var(--fs-2xs);

BUL:
.stat-chip .chip-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
DEĞİŞTİR:
.stat-chip .chip-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--fs-xs);

--- DÜZENLEME 4/8 : Modal viewport ve safe-area (G-13, G-21) ---
BUL:
  background: rgba(28, 36, 43, 0.45);
  backdrop-filter: blur(2px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
DEĞİŞTİR:
  background: rgba(28, 36, 43, 0.45);
  backdrop-filter: blur(2px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(16px, env(safe-area-inset-top, 0px))
           max(16px, env(safe-area-inset-right, 0px))
           max(16px, env(safe-area-inset-bottom, 0px))
           max(16px, env(safe-area-inset-left, 0px));
}

BUL (aynı .modal-overlay bloğunda, yukarıdaki değişiklikten ÖNCEKİ satırlar):
  width: 100vw;
  height: 100vh;
DEĞİŞTİR:
  width: 100vw;
  height: 100vh;
  height: 100dvh;

BUL:
  max-width: 460px;
  max-height: calc(100vh - 40px);
DEĞİŞTİR:
  max-width: 460px;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);

--- DÜZENLEME 5/8 : Dokunma hedeflerini 48px'e çıkar (G-14) ---
Aşağıdaki 7 kuralın her birine, mevcut özelliklerini KORUYARAK
`min-height: var(--touch-min);` satırı ekle. Genişlik/yükseklik
verilmiş olanlarda ayrıca `min-width: var(--touch-min);` de ekle.

(a) BUL:
.preset-btn {
  padding: 8px 0;
  font-size: 12px;
DEĞİŞTİR:
.preset-btn {
  padding: 8px 0;
  min-height: var(--touch-min);
  font-size: 12px;

(b) BUL:
.tip-btn {
  padding: 8px;
  font-size: 11px;
}
DEĞİŞTİR:
.tip-btn {
  padding: 8px;
  min-height: var(--touch-min);
  font-size: 11px;
}

(c) BUL:
.buy-btn, .order-submit-btn {
  padding: 8px 14px;
DEĞİŞTİR:
.buy-btn, .order-submit-btn {
  padding: 8px 14px;
  min-height: var(--touch-min);

(d) BUL:
.qty-btn {
  width: 26px;
  height: 26px;
DEĞİŞTİR:
.qty-btn {
  width: 26px;
  height: 26px;
  min-width: var(--touch-min);
  min-height: var(--touch-min);

(e) BUL:
.tariff-btn {
  width: 24px;
  height: 24px;
DEĞİŞTİR:
.tariff-btn {
  width: 24px;
  height: 24px;
  min-width: var(--touch-min);
  min-height: var(--touch-min);

(f) BUL:
.tab-btn {
  padding: 6px 12px;
  font-size: 11px;
DEĞİŞTİR:
.tab-btn {
  padding: 6px 12px;
  min-height: var(--touch-min);
  font-size: 11px;

(g) BUL:
.segment-btn {
  background: transparent;
  border: none;
  padding: 5px 10px;
DEĞİŞTİR:
.segment-btn {
  background: transparent;
  border: none;
  padding: 5px 10px;
  min-height: var(--touch-min);
  min-width: var(--touch-min);

--- DÜZENLEME 6/8 : Yinelenen .debug-chip-btn min-height regresyonunu sil (G-14) ---
Dosyada `.debug-chip-btn` İKİ KEZ tanımlıdır. İKİNCİ (aşağıdaki, arka planı
#FFF0F0 olan) tanımdaki `min-height: 38px;` satırını `min-height: var(--touch-min);`
yap. Birinci tanıma dokunma.
BUL:
  color: var(--accent-red);
  padding: 6px 10px;
  font-size: 11px;
  min-height: 38px;
  gap: 4px;
}
DEĞİŞTİR:
  color: var(--accent-red);
  padding: 6px 10px;
  font-size: 11px;
  min-height: var(--touch-min);
  gap: 4px;
}

--- DÜZENLEME 7/8 : @media (max-width: 768px) içindeki .cam-btn regresyonunu düzelt (G-14) ---
BUL:
  .cam-btn {
    width: 38px;
    height: 38px;
    min-height: 38px;
    min-width: 48px;
    padding: 0;
  }
DEĞİŞTİR:
  .cam-btn {
    width: 38px;
    height: 38px;
    min-height: var(--touch-min);
    min-width: var(--touch-min);
    padding: 0;
  }

--- DÜZENLEME 8/8 : Üst HUD taşmasını çöz (G-12) ---
BUL (@media (max-width: 680px) bloğunun İÇİNDE):
  .top-bar-right {
    gap: 6px;
  }
DEĞİŞTİR:
  .top-bar-right {
    gap: 6px;
    flex-shrink: 1;
    min-width: 0;
  }
  .top-bar-left {
    min-width: 0;
    overflow: hidden;
  }
  /* G-12: 680px altında yakıt göstergeleri üst bara sığmıyor */
  .fuel-gauges {
    display: none;
  }
  .top-bar-right-controls {
    flex-shrink: 0;
  }

--- BİTİŞ ---
Hiçbir kuralı silme, hiçbir yeni seçici ekleme (yukarıda açıkça belirtilenler hariç).
Bitince şu komutu çalıştır ve çıktısını raporla:
  node -e "const c=require('fs').readFileSync('web_3d_station/style.css','utf8'); const o=(c.match(/\{/g)||[]).length, x=(c.match(/\}/g)||[]).length; console.log('{',o,'}',x, o===x?'DENGELI':'HATA');"
````

</details>

**Beklenen doğrulama sonucu:** `{ N } N DENGELI`

> **Düzenleme 8 hakkında not:** Yakıt göstergeleri ≤680 px'te gizleniyor çünkü üst barda fiziksel olarak yer yok (354 px kullanılabilir alana karşı ~520 px talep). **Bilgi kaybı yok** — aynı depo doluluk verisi Sipariş modalındaki `.fuel-spec` / `.tank-status` bileşenlerinde tam olarak gösteriliyor. Alternatif (bara ikinci satır ekleme) `#top-bar` mutlak konumlu olduğu için 3D sahneyi örterdi.

---

### 📦 PAKET 2 — `game.js` kamera clamping, ışık ve görsel materyal düzeltmeleri

> **Kapsanan bulgular:** G-01, G-02, G-03, G-04, G-05, G-06, G-07, G-09, G-10, G-17 (emoji kısmı)
> **Tek dosya:** `web_3d_station/game.js`
> **Diğer dosyalara dokunma.**

<details>
<summary><b>Haiku'ya verilecek prompt (kopyala)</b></summary>

````
Yalnızca `web_3d_station/game.js` dosyasını düzenle. Başka hiçbir dosyaya dokunma.
Aşağıdaki 10 düzenlemeyi sırayla uygula. Her BUL bloğu dosyada BENZERSİZDİR.
Girinti ve boşlukları birebir koru. Fonksiyon ekleme/silme yapma
(açıkça belirtilen tek yeni fonksiyon dışında).

--- DÜZENLEME 1/10 : Ortografik kamera frustum'unu mobil dikeye uyarla (G-01) ---
BUL:
  const aspect = width / height;
  const d = 18;
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -300, 1000);
DEĞİŞTİR:
  const aspect = width / height;
  const d = computeFrustumHalfHeight(aspect);
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -300, 1000);

--- DÜZENLEME 2/10 : Frustum yardımcı fonksiyonunu ekle (G-01) ---
BUL:
function onWindowResize() {
DEĞİŞTİR:
// G-01: Ortografik frustum'u hem dikey hem yatay minimuma göre türetir.
// FRUSTUM_V: masaüstünde kullanılan dikey yarı-yükseklik.
// FRUSTUM_H: her en-boy oranında garanti edilen yatay yarı-genişlik
//            (istasyon çekirdeği ekran uzayında ~16.3 m yarı-genişlik kaplar).
// Üst sınır 40, dikey modda sahnenin aşırı küçülmesini engeller.
const FRUSTUM_V = 18;
const FRUSTUM_H = 17;
const FRUSTUM_MAX = 40;

function computeFrustumHalfHeight(aspect) {
  const safeAspect = aspect > 0.01 ? aspect : 0.01;
  return Math.min(FRUSTUM_MAX, Math.max(FRUSTUM_V, FRUSTUM_H / safeAspect));
}

function onWindowResize() {

--- DÜZENLEME 3/10 : Resize handler'ı da aynı yardımcıyı kullansın (G-01) ---
BUL:
  const aspect = width / height;
  const d = 18;
  camera.left = -d * aspect;
DEĞİŞTİR:
  const aspect = width / height;
  const d = computeFrustumHalfHeight(aspect);
  camera.left = -d * aspect;

--- DÜZENLEME 4/10 : Gölge frustum'unu genişlet ve normalBias'ı ölçeklenebilir yap (G-06) ---
BUL:
  const shadowDist = 30;
DEĞİŞTİR:
  const shadowDist = 34;

BUL:
  sunLight.shadow.bias = -0.0003;
  sunLight.shadow.normalBias = 0.02;
DEĞİŞTİR:
  sunLight.shadow.bias = -0.0003;
  sunLight.shadow.normalBias = 0.02;
  sunLight.shadow.camera.updateProjectionMatrix();

--- DÜZENLEME 5/10 : Tesis apron slablarının z-fighting'ini gider (G-03, G-04) ---
BUL:
    { key: 'truck_stop',   prop: 'hasTruckStop',   dim: [10.0, 0.08, 12.0], center: [24.0, 0.04, -6.0],  curbSide: 'east' },
DEĞİŞTİR:
    { key: 'truck_stop',   prop: 'hasTruckStop',   dim: [8.0, 0.08, 12.0], center: [25.0, 0.04, -6.0],  curbSide: 'east' },

BUL:
    { key: 'turbine',      prop: 'hasTurbine',     dim: [7.0, 0.08, 7.0],   center: [-22.0, 0.04, -13.0], curbSide: 'west' },
    { key: 'hydrogen_bay', prop: 'hasHydrogenBay', dim: [7.0, 0.08, 6.0],   center: [-22.0, 0.04, -4.0],  curbSide: 'west' },
DEĞİŞTİR:
    { key: 'turbine',      prop: 'hasTurbine',     dim: [6.0, 0.08, 7.0],   center: [-22.5, 0.04, -13.0], curbSide: 'west' },
    { key: 'hydrogen_bay', prop: 'hasHydrogenBay', dim: [6.0, 0.08, 6.0],   center: [-22.5, 0.04, -4.0],  curbSide: 'west' },

BUL:
    slab.position.set(fa.center[0], fa.center[1], fa.center[2]);
    slab.receiveShadow = true;
DEĞİŞTİR:
    // G-03: cekirdek apronun ust yuzeyi y=0.08. Tesis slabini 0.012 m yukari
    // kaydirarak es duzlemsel z-fighting'i tamamen ortadan kaldiriyoruz.
    slab.position.set(fa.center[0], fa.center[1] + 0.012, fa.center[2]);
    slab.receiveShadow = true;

BUL:
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.015, fa.dim[2] * 0.6), Mat.roadWhite);
    line.position.set(fa.center[0], fa.center[1] + 0.045, fa.center[2]);
DEĞİŞTİR:
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.015, fa.dim[2] * 0.6), Mat.roadWhite);
    line.position.set(fa.center[0], fa.center[1] + 0.057, fa.center[2]);

--- DÜZENLEME 6/10 : Apron yeniden inşasında geometri sızıntısını kapat (G-10) ---
BUL:
  while (stationApronExtensionsGroup.children.length > 0) {
    const obj = stationApronExtensionsGroup.children[0];
    stationApronExtensionsGroup.remove(obj);
  }
DEĞİŞTİR:
  while (stationApronExtensionsGroup.children.length > 0) {
    const obj = stationApronExtensionsGroup.children[0];
    stationApronExtensionsGroup.remove(obj);
    // G-10: materyaller paylasimli, SADECE geometriyi dispose et.
    if (obj.geometry) obj.geometry.dispose();
  }

--- DÜZENLEME 7/10 : Parsel rozetlerini kameraya kilitle (G-07) ---
BUL:
      const badge = mesh.userData.badgeMesh;
      const baseY = badge.userData.baseY || 0.7;
      badge.position.y = baseY + Math.sin(totalSeconds * 2.5 + (badge.id || 0)) * 0.025;
DEĞİŞTİR:
      const badge = mesh.userData.badgeMesh;
      const baseY = badge.userData.baseY || 0.7;
      badge.position.y = baseY + Math.sin(totalSeconds * 2.5 + (badge.id || 0)) * 0.025;
      // G-07: ortografik kamerada tam billboard - kamera donunce rozet okunur kalir.
      if (camera) badge.quaternion.copy(camera.quaternion);

--- DÜZENLEME 8/10 : Kamera pan sinirlarini tek sabitte birlestir (G-09) ---
BUL:
  const clampedX = THREE.MathUtils.clamp(controls.target.x, -22, 22);
  const clampedZ = THREE.MathUtils.clamp(controls.target.z, -18, 18);
DEĞİŞTİR:
  const clampedX = THREE.MathUtils.clamp(controls.target.x, -CAM_BOUND_X, CAM_BOUND_X);
  const clampedZ = THREE.MathUtils.clamp(controls.target.z, -CAM_BOUND_Z, CAM_BOUND_Z);

BUL:
  const clampedX = THREE.MathUtils.clamp(controls.target.x, -26, 26);
  const clampedZ = THREE.MathUtils.clamp(controls.target.z, -20, 20);
DEĞİŞTİR:
  const clampedX = THREE.MathUtils.clamp(controls.target.x, -CAM_BOUND_X, CAM_BOUND_X);
  const clampedZ = THREE.MathUtils.clamp(controls.target.z, -CAM_BOUND_Z, CAM_BOUND_Z);

BUL:
const plotSignMeshes = {};
DEĞİŞTİR:
// G-09: kamera pan siniri tek kaynak.
const CAM_BOUND_X = 26;
const CAM_BOUND_Z = 20;

const plotSignMeshes = {};

--- DÜZENLEME 9/10 : Gölge toggle'ini geri alinabilir yap (G-05) ---
BUL:
    scene.traverse(obj => {
      if (obj.isMesh) {
        if (!obj.userData._castShadow) obj.userData._castShadow = obj.castShadow;
        if (!obj.userData._receiveShadow) obj.userData._receiveShadow = obj.receiveShadow;
        obj.castShadow = State.settings.shadows;
        obj.receiveShadow = State.settings.shadows;
      }
    });
DEĞİŞTİR:
    scene.traverse(obj => {
      if (obj.isMesh) {
        // G-05: `false` de gecerli bir kayitli degerdir; undefined ile kontrol et.
        if (obj.userData._castShadow === undefined) obj.userData._castShadow = obj.castShadow;
        if (obj.userData._receiveShadow === undefined) obj.userData._receiveShadow = obj.receiveShadow;
        if (State.settings.shadows) {
          obj.castShadow = obj.userData._castShadow;
          obj.receiveShadow = obj.userData._receiveShadow;
        } else {
          obj.castShadow = false;
          obj.receiveShadow = false;
        }
      }
    });

--- DÜZENLEME 10/10 : Grafik kalitesi TypeError'unu gider (G-02) + emoji temizligi (G-17) ---
BUL:
    if (q === 'low') {
      renderer.shadowMap.mapSize.width = 1024;
      renderer.shadowMap.mapSize.height = 1024;
      particleLimit = 15;
      renderer.setPixelRatio(1);
    } else if (q === 'med') {
      renderer.shadowMap.mapSize.width = 1536;
      renderer.shadowMap.mapSize.height = 1536;
      particleLimit = 25;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      renderer.shadowMap.mapSize.width = 2048;
      renderer.shadowMap.mapSize.height = 2048;
      particleLimit = 40;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
DEĞİŞTİR:
    // G-02: mapSize `light.shadow` uzerindedir; `renderer.shadowMap` uzerinde
    // boyle bir alan yoktur ve eski kod her cagrida TypeError firlatiyordu.
    let shadowRes = 2048;
    if (q === 'low') {
      shadowRes = 1024;
      particleLimit = 15;
      renderer.setPixelRatio(1);
    } else if (q === 'med') {
      shadowRes = 1536;
      particleLimit = 25;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      shadowRes = 2048;
      particleLimit = 40;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    if (sunLight && sunLight.shadow) {
      sunLight.shadow.mapSize.width = shadowRes;
      sunLight.shadow.mapSize.height = shadowRes;
      // G-06: normalBias'i teksel boyutuyla olcekle, dusuk cozunurlukte akne olmasin.
      sunLight.shadow.normalBias = 0.02 * (2048 / shadowRes);
      if (sunLight.shadow.map) {
        sunLight.shadow.map.dispose();
        sunLight.shadow.map = null;
      }
      sunLight.shadow.needsUpdate = true;
    }

BUL:
        ? '⚠️ Kasa kapasitesi (2 Saat) doldu! Daha fazla gelir kaybetmemek için düzenli giriş yapın.'
        : '⚠️ Vault cap (2 Hours) reached! Log in regularly to avoid losing profits.';
DEĞİŞTİR:
        ? 'Kasa kapasitesi (2 Saat) doldu! Daha fazla gelir kaybetmemek için düzenli giriş yapın.'
        : 'Vault cap (2 Hours) reached! Log in regularly to avoid losing profits.';

--- BİTİŞ ---
Bitince şu komutu çalıştır ve çıktısını raporla:
  node --check web_3d_station/game.js && echo "SYNTAX OK"
````

</details>

**Beklenen doğrulama sonucu:** `SYNTAX OK`

---

### 📦 PAKET 3 — `index.html` viewport, dokunma hedefi ve ikonografi düzenlemeleri

> **Kapsanan bulgular:** G-11, G-14 (satır-içi butonlar), G-15 (vault göstergesi), G-17 (✓/★), G-19
> **Tek dosya:** `web_3d_station/index.html`
> **Diğer dosyalara dokunma. Paket 1 uygulanmış olmalıdır** (`--touch-min`, `--dark-ink`, `--gold-accent` token'ları oradan gelir).

<details>
<summary><b>Haiku'ya verilecek prompt (kopyala)</b></summary>

````
Yalnızca `web_3d_station/index.html` dosyasını düzenle. Başka hiçbir dosyaya dokunma.
Aşağıdaki 6 düzenlemeyi sırayla uygula.

--- DÜZENLEME 1/6 : Viewport meta (G-11) ---
BUL:
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
DEĞİŞTİR:
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#CCE0ED">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">

--- DÜZENLEME 2/6 : Tanimsiz CSS degiskenlerini duzelt (G-15) ---
BUL:
style="background: var(--dark-ink); color: var(--gold-accent); padding: 16px; border: 2px solid var(--dark-ink);
DEĞİŞTİR:
style="background: var(--ink-border); color: var(--accent-gold); padding: 16px; border: 2px solid var(--ink-border);

--- DÜZENLEME 3/6 : SVG kontur kalinliklarini normalize et (G-19) ---
BUL:
        <svg class="neo-icon gold" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="1.5">
DEĞİŞTİR:
        <svg class="neo-icon gold" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2.5">

BUL:
          <svg class="neo-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
DEĞİŞTİR:
          <svg class="neo-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">

--- DÜZENLEME 4/6 : Unicode dingbat ikonlarini SVG'ye cevir (G-17) ---
Dosyada `<span class="streak-status-icon">✓</span>` ifadesi TAM OLARAK 6 KEZ geçer.
HEPSİNİ aşağıdakiyle değiştir:
        <span class="streak-status-icon"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>

Dosyada `<span class="streak-status-icon">★</span>` ifadesi TAM OLARAK 1 KEZ geçer.
Onu aşağıdakiyle değiştir:
        <span class="streak-status-icon"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>

--- DÜZENLEME 5/6 : Satir-ici kucuk buton stillerini dokunma-guvenli sinifa cevir (G-14) ---
Dosyada `style="padding: 6px 10px; font-size: 11px;"` ifadesi TAM OLARAK 15 KEZ geçer.
HEPSİNİ silip yerine `class` niteliğine ` neo-btn-sm` ekleyeceksin.
Yani her `class="neo-btn" style="padding: 6px 10px; font-size: 11px;"` örüntüsünü
şununla değiştir:
  class="neo-btn neo-btn-sm"

Aynı şekilde `style="padding: 6px 12px; font-size: 11px;"` (1 kez) için de:
  class="neo-btn neo-btn-sm"

Eğer `class` niteliği `neo-btn` dışında ek sınıflar içeriyorsa, o sınıfları KORU
ve listenin sonuna ` neo-btn-sm` ekle; yalnızca `style` niteliğini kaldır.

--- DÜZENLEME 6/6 : neo-btn-sm sinifini sayfa ici stil olarak tanimla (G-14) ---
BUL:
  <link rel="stylesheet" href="style.css">
DEĞİŞTİR:
  <link rel="stylesheet" href="style.css">
  <style>
    /* G-14: eskiden satir-ici stil olan kucuk butonlar. Gorsel boyut korunur,
       dokunma zarfi 48x48 px'e cikarilir. */
    .neo-btn-sm {
      padding: 6px 10px;
      font-size: 11px;
      min-height: var(--touch-min, 48px);
      min-width: var(--touch-min, 48px);
    }
    .streak-status-icon svg { display: block; }
  </style>

--- BİTİŞ ---
Bitince şu komutları çalıştır ve çıktılarını raporla:
  node -e "const c=require('fs').readFileSync('web_3d_station/index.html','utf8'); console.log('viewport-fit:', c.includes('viewport-fit=cover')); console.log('kalan satir-ici padding 6px:', (c.match(/padding: 6px 1[02]px; font-size: 11px;/g)||[]).length); console.log('kalan dingbat:', (c.match(/[✓★]/g)||[]).length); console.log('dark-ink kalan:', (c.match(/--dark-ink|--gold-accent/g)||[]).length);"
````

</details>

**Beklenen doğrulama sonucu:**
```
viewport-fit: true
kalan satir-ici padding 6px: 0
kalan dingbat: 0
dark-ink kalan: 0
```

---

### 📦 PAKET 4 (opsiyonel, ayrı oturum) — i18n tamamlama

> **Kapsanan bulgu:** G-18 (74 sabit Türkçe metin)
> **Dosyalar:** `web_3d_station/index.html` + `web_3d_station/game.js`

Bu paket iki dosyaya birden dokunduğu ve 74 metin çifti gerektirdiği için **Haiku 4.5'te tek seferde yapılmamalıdır.** Sekme bazında 5 alt-göreve bölünmesi önerilir:

| Alt-görev | index.html satır aralığı | Yaklaşık metin sayısı |
|---|---|---|
| 4a | 340-372 (tema kartları) | 8 |
| 4b | 420-596 (personel, tesisler, parseller) | 28 |
| 4c | 760-800 (kredi, ihaleler) | 10 |
| 4d | 870-945 (ayarlar, grafik kalitesi) | 8 |
| 4e | 1010-1175 (debug paneli, streak, legal) | 20 |

Her alt-görev için şablon:
1. Belirtilen satır aralığındaki `data-i18n` taşımayan görünür metinleri bul.
2. Her biri için `snake_case` anahtar üret (ör. `theme_std_desc`, `staff_hire_cashier`).
3. Elemana `data-i18n="anahtar"` ekle, iç metni Türkçe karşılık olarak bırak.
4. `game.js` içinde `I18N.tr` (sat. 11-192) ve `I18N.en` (sat. 193-374) bloklarının **ikisine birden** aynı anahtarı ekle.
5. Doğrula:
   `node -e "const s=require('fs').readFileSync('web_3d_station/game.js','utf8').split(/\r?\n/); const k=(a,b)=>{const x=new Set();for(let i=a;i<b;i++){const m=s[i].match(/^\s{4}([a-zA-Z0-9_]+)\s*:/);if(m)x.add(m[1]);}return x;}; const tr=k(11,192),en=k(193,374); console.log('TR',tr.size,'EN',en.size,'fark',[...tr].filter(v=>!en.has(v)).concat([...en].filter(v=>!tr.has(v))));"`
   Çıktı `fark []` olmalı ve TR/EN sayıları eşit kalmalı.

---

## BÖLÜM 3 — G-08 İÇİN AYRI TASARIM ÖNERİSİ (kod paketine dahil edilmedi)

`createGenericPlotMesh()`'e düşen 13 parsel için mimariye özel temeller, bu denetimin *düzeltme* kapsamı dışında bir **içerik üretim** işidir; atomik bir prompt paketine sığmaz. Önerilen kademeli plan:

**Aşama 1 (düşük maliyet, mevcut fonksiyonu genişletir):** `createGenericPlotMesh(plot, w, d)` imzasına `family` parametresi ekle ve `plot.tab` değerine göre üç varyant üret —
- `service` → gri beton pad + iki hidrolik lift kaidesi izi + yağ lekesi decal
- `lifestyle` → ahşap deck çerçevesi + tente direği stub'ı + saksı
- `energy` → gömülü kablo kanalı + trafo kaidesi + uyarı levhası direği

**Aşama 2:** `truck_stop`, `hydrogen_bay`, `rest_lounge` gibi büyük tesisler için mevcut `createWashPlotMesh` / `createEvPlotMesh` kalitesinde ayrı fonksiyonlar.

---

## Önerilen Uygulama Sırası

1. **Paket 2** (G-02 çalışma zamanı hatası + G-01 kamera) — oyunu mobilde oynanabilir hale getirir.
2. **Paket 1** (CSS) — HUD taşması ve dokunma hedefleri.
3. **Paket 3** (HTML) — safe-area'yı aktive eder; Paket 1'deki token'lara bağımlı.
4. **Paket 4** (i18n) — mağaza gönderimi öncesi, ayrı oturumlarda.
5. **G-08** — içerik yol haritasına.

Her paketten sonra: `node --check web_3d_station/game.js` ve süslü parantez denge kontrolü.
