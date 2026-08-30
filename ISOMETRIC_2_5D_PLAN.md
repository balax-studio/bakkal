# 2.5D İzometrik Görsel Dönüşüm — Uygulama Planı

> **Bu dosya kendi kendine yeterlidir.** Planı uygulayacak yapay zekânın başka hiçbir konuşma geçmişine ihtiyacı yoktur. Sırayla oku, fazları sırayla uygula.

---

## 1. Amaç

`myminimarket` (Flutter + Flame ile yazılmış "İstasyon: BenelOil Türkiye" benzinlik tycoon oyunu) şu anda **düz, 2D, tepeden bakışlı, kalın siyah kenarlıklı (neo-brutalist)** bir sahne çiziyor. Hedef, sahneyi **https://beneloil.com** oyununun görsel diline çevirmek: **izometrik 2.5D, low-poly, flat-shaded diorama**.

### Kritik kısıt
- **Godot, Unity veya herhangi bir 3D oyun motoru KULLANILMAYACAK.**
- **`flutter_scene`, `three_dart`, `flutter_gl` gibi 3D paketleri KULLANILMAYACAK.** (deneysel, web'de sorunlu)
- **Blender / harici 3D asset pipeline KURULMAYACAK.**
- Çözüm tamamen **Flutter `Canvas` üzerinde elle çizilen sahte-3D (fake 3D) izometrik ressam** olacak. **Yeni bağımlılık eklenmeyecek.**

Bu bir kısıtlama değil, bilinçli bir mimari karardır. Hedef görünüm gerçek 3D geometri gerektirmez.

---

## 2. Hedef stilin analizi (beneloil.com incelemesinden)

Site tek bir `<canvas>` üzerinde **WebGL** ile render ediyor (Three.js bundle içine gömülmüş). Ama görsel dilin tamamı üç kurala indirgenebilir ve üçü de saf Canvas 2D ile çizilebilir:

1. **Ortografik izometrik kamera.** Perspektif YOK. Paralel çizgiler ekranda da paralel kalır. Kamera sabit, döndürülemez.
2. **Flat shading, tekstür YOK.** Her hacim, tek bir taban renginin 3 tonuyla çizilir: üst yüz en açık, bir yan yüz orta, diğer yan yüz en koyu. Işık sol-üstten sabit gelir. Gradient yok, normal map yok.
3. **Outline YOK.** Hacim hissi kenar çizgisinden değil, **yüzler arası ton kontrastından** gelir. Nesnelerin altında yumuşak, düşük opasiteli **elips temas gölgesi** vardır.

### Gözlemlenen palet ve sahne içeriği
- Çim: doygun ama yumuşak yeşil
- Asfalt yol: koyu gri, **çift sarı orta çizgi** + beyaz kesikli şerit çizgileri
- Forecourt (istasyon önü): açık gri beton platform
- Bina: 2 katlı, krem/beyaz gövde, koyu gri çatı, çatıda klima üniteleri, girişte **kırmızı tente**
- Pompa adaları: beton platform + kırmızı dispenser kutuları + üstte kanopi
- Yakıt tankları: dikey silindirler, açık gri
- Propler: koni ağaçlar, lamba direkleri, çitler, küçük taşlar
- Araçlar: basit kutu geometrisi (gövde + kabin), doygun renkler (yeşil, turuncu, mavi kamyonetler)
- HUD: yumuşak gölgeli, ince kenarlıklı krem kartlar; kırmızı (`#D64545`) birincil aksan

---

## 3. Projenin şu anki durumu

### Teknoloji
- Flutter, Dart SDK `^3.5.0`
- `flame: ^1.18.0`, `google_fonts: ^6.2.1`, `shared_preferences: ^2.2.3`
- Toplam ~3500 satır Dart

### İlgili dosyalar
| Dosya | Rol | Bu planda ne olacak |
|---|---|---|
| `lib/game/petrol_station_game.dart` | `FlameGame` alt sınıfı, spawn/servis mantığı | Konumlandırma grid'e taşınacak |
| `lib/game/components/diorama_station_renderer.dart` | Sahneyi çizen tek `Component` | **Tamamen silinecek**, yerine yeni sistem gelecek |
| `lib/game/components/customer_vehicle_component.dart` | Müşteri aracı | İzometrik çizim + grid hareketi |
| `lib/game/components/tanker_component.dart` | Yakıt tankeri | İzometrik çizim + grid hareketi |
| `lib/game/components/floating_coin_component.dart` | "+₺250" uçan yazı | Küçük dokunuş, büyük ölçüde korunur |
| `lib/core/theme/station_theme.dart` | Palet + tipografi + `neoCard` | Palet genişletilecek, brutalist gölge yumuşatılacak |
| `lib/domain/station_state.dart` | Oyun durumu (para, yakıt, saat, pompa sayısı) | **Dokunulmayacak** |
| `lib/ui/hud/station_hud.dart`, `lib/ui/modals/*` | Flutter widget HUD | Faz 7'de yumuşatılacak |

### Mevcut renderer'ın sorunları
`diorama_station_renderer.dart` şu anda:
- Her şeyi eksen hizalı `Rect` / `RRect` olarak çiziyor (izometri yok)
- Her şeye `strokeWidth: 2.5` siyah kenarlık uyguluyor (hedef stille doğrudan çelişiyor)
- Konumları **ekran yüzdesiyle** hesaplıyor (`size.x * 0.16`, `size.y * 0.72`) — dünya koordinatı yok, bu yüzden kamera, zoom veya derinlik sıralaması imkânsız
- Derinlik sıralaması yok — araç pompanın önüne mi arkasına mı gelecek belirsiz
- Gölge yok

`petrol_station_game.dart` içinde de aynı sorun var; `_trySpawnCustomer()` içinde pompa hedef konumu ekran yüzdesiyle hesaplanıyor:

```dart
final double spacing = size.x * 0.76 / (stationState.pumpsCount + 1);
final double targetX = size.x * 0.12 + (spacing * (freeSlot + 1));
final double targetY = size.y * 0.50;
```

Bu, Faz 5'te grid koordinatına dönüşmek zorunda.

---

## 4. Mimari karar

**Sahne = veri, çizim = saf fonksiyon.**

Sahne artık `render()` içinde elle yazılmış çizim çağrıları olmayacak. Bunun yerine:

1. Dünya, **grid koordinatlarında** (`gx`, `gy`, `gz`) tanımlı bir **prop listesi** olacak.
2. Her frame bu liste **derinliğe göre sıralanacak** (painter's algorithm).
3. Her prop, ortak izometrik primitiflerle (`drawIsoBox` vb.) çizilecek.
4. Araçlar da aynı listeye dinamik olarak katılacak — böylece bir araç pompanın arkasına geçtiğinde **doğru şekilde onun arkasında kalacak.**

---

## 5. Fazlar

Her faz bağımsız olarak derlenebilir ve çalıştırılabilir olmalıdır. Bir fazı bitirmeden sonrakine geçme.

---

### FAZ 1 — İzometrik matematik çekirdeği

**Yeni dosya:** `lib/game/iso/iso_math.dart`

2:1 dimetrik projeksiyon kullan (klasik izometrik oyun görünümü, en ucuz matematik, piksel hizası temiz).

```dart
import 'dart:ui';
import 'package:flutter/material.dart';

/// Bir grid karesinin ekrandaki genişliği (2:1 dimetrik).
const double kTileW = 64.0;

/// Bir grid karesinin ekrandaki yüksekliği.
const double kTileH = 32.0;

/// 1 birim dünya yüksekliğinin (gz) ekrandaki piksel karşılığı.
const double kZUnit = 32.0;

/// Grid koordinatını (gx, gy, gz) ekran koordinatına çevirir.
/// gx: sağa-aşağı eksen, gy: sola-aşağı eksen, gz: yukarı (yükseklik).
Offset iso(double gx, double gy, [double gz = 0]) => Offset(
      (gx - gy) * (kTileW / 2),
      (gx + gy) * (kTileH / 2) - gz * kZUnit,
    );

/// Ekran koordinatını grid koordinatına çevirir (dokunma/tap testi için, gz=0 düzleminde).
Offset screenToIso(Offset p) {
  final double gx = (p.dx / (kTileW / 2) + p.dy / (kTileH / 2)) / 2;
  final double gy = (p.dy / (kTileH / 2) - p.dx / (kTileW / 2)) / 2;
  return Offset(gx, gy);
}

// --- Flat shading: ışık sol-üstten sabit ---

/// Üst yüz — en parlak, taban rengin kendisi.
Color shadeTop(Color c) => c;

/// +gy yönüne bakan yüz (ekranda SOLDA görünür) — orta ton.
Color shadeLeft(Color c) => Color.lerp(c, Colors.black, 0.18)!;

/// +gx yönüne bakan yüz (ekranda SAĞDA görünür) — en koyu.
Color shadeRight(Color c) => Color.lerp(c, Colors.black, 0.34)!;

/// Zemin/düz yüzeyler için hafif ton oynatma (tile varyasyonu).
Color shadeFlat(Color c, double amount) => Color.lerp(c, Colors.black, amount)!;
```

> **Not:** `iso()` fonksiyonu dünya orijinini (0,0) ekran orijinine koyar. Sahnenin ekranda ortalanması Faz 3'teki kamera offset'i ile yapılacak; burada offset EKLEME.

**Kabul kriteri:** Dosya derleniyor. Henüz görsel çıktı yok.

---

### FAZ 2 — İzometrik çizim primitifleri

**Yeni dosya:** `lib/game/iso/iso_shapes.dart`

Tüm sahne bu birkaç fonksiyonla çizilecek. **Hiçbirinde `PaintingStyle.stroke` KULLANMA.**

Gerekli fonksiyonlar:

#### `drawIsoBox`
```dart
void drawIsoBox(
  Canvas canvas, {
  required double gx,      // taban köşesinin grid x'i
  required double gy,      // taban köşesinin grid y'si
  required double w,       // gx yönünde genişlik (grid birimi)
  required double d,       // gy yönünde derinlik (grid birimi)
  required double h,       // yükseklik (gz birimi)
  required Color color,
  double baseZ = 0,        // tabanın yerden yüksekliği (üst üste kutular için)
})
```

Üç yüzü şu köşelerle `Path` olarak kur ve `drawPath` ile doldur. **Çizim sırası önemli: önce yan yüzler, sonra üst yüz.**

- **Sağ yüz** (`gx = gx+w` düzlemi, ekranda sağda), rengi `shadeRight(color)`:
  `iso(gx+w, gy, baseZ+h)` → `iso(gx+w, gy+d, baseZ+h)` → `iso(gx+w, gy+d, baseZ)` → `iso(gx+w, gy, baseZ)`
- **Sol yüz** (`gy = gy+d` düzlemi, ekranda solda), rengi `shadeLeft(color)`:
  `iso(gx, gy+d, baseZ+h)` → `iso(gx+w, gy+d, baseZ+h)` → `iso(gx+w, gy+d, baseZ)` → `iso(gx, gy+d, baseZ)`
- **Üst yüz** (`gz = baseZ+h` düzlemi), rengi `shadeTop(color)`:
  `iso(gx, gy, baseZ+h)` → `iso(gx+w, gy, baseZ+h)` → `iso(gx+w, gy+d, baseZ+h)` → `iso(gx, gy+d, baseZ+h)`

> Yüzlerin ekranda sağ/sol düşme yönünü ilk çalıştırmada **görsel olarak doğrula**; eğer ters görünüyorsa `shadeLeft` / `shadeRight` çağrılarını yer değiştir. Matematik değil, sadece ton ataması değişir.

#### `drawIsoPrism`
Üçgen çatı. Bir sırt çizgisi (ridge) boyunca iki eğimli yüz. Parametreler `drawIsoBox` ile aynı + `ridgeAlong` (`Axis.x` / `Axis.y`).

#### `drawIsoCylinder`
Yakıt tankları, ağaç gövdeleri, direkler için. Üstte bir elips (`shadeTop`), altta gövde olarak elipsin alt yarısını kapsayan dikdörtgen+elips birleşimi (`shadeLeft`). Basit tutulabilir: `canvas.drawOval` (üst) + gövde `Path` + alt elips yayı.

#### `drawIsoCone`
Ağaç tepeleri için. Tepe noktası + taban elipsi arasında üçgen `Path` + taban elipsi.

#### `drawIsoQuad`
Zemin poligonları (asfalt forecourt, çim yamaları, yol şeritleri) için — dört grid noktası alır, `gz=0` düzleminde doldurur.

#### `drawContactShadow`
```dart
void drawContactShadow(Canvas canvas, {
  required double gx, required double gy,
  required double w, required double d,
  double opacity = 0.14,
})
```
`gz=0` düzleminde, prop'un ayak izini kaplayan bir elips. Renk: `Colors.black.withValues(alpha: opacity)`. Hafif `MaskFilter.blur(BlurStyle.normal, 3)` uygula. **Her prop'tan ÖNCE çizilmeli.**

**Kabul kriteri:** Bu dosya derleniyor ve fonksiyonlar dışa açık.

---

### FAZ 3 — Dünya modeli ve derinlik sıralaması

**Yeni dosya:** `lib/game/iso/iso_prop.dart`

```dart
/// Sahnedeki tek bir çizilebilir nesne.
abstract class IsoProp {
  double get gx;
  double get gy;
  /// Ayak izi — derinlik sıralamasında merkez hesabı için.
  double get w;
  double get d;

  /// Painter's algorithm sıralama anahtarı.
  /// Ayak izinin MERKEZİ kullanılır, köşesi değil.
  double get depth => (gx + w / 2) + (gy + d / 2);

  void render(Canvas canvas);
}
```

Somut tipler: `BoxProp`, `PrismProp`, `CylinderProp`, `ConeProp`, `TreeProp`, `LampProp`, `GroundQuadProp`.

**Yeni dosya:** `lib/game/iso/iso_world.dart`

```dart
class IsoWorld {
  /// Hiç değişmeyen zemin katmanı (çim, asfalt, yol çizgileri).
  final List<IsoProp> ground = [];

  /// Sıralanacak dikey nesneler (binalar, pompalar, ağaçlar, araçlar).
  final List<IsoProp> props = [];

  void render(Canvas canvas) {
    // 1. Zemin — sıralama gerekmez, ekleme sırasıyla çizilir.
    for (final p in ground) { p.render(canvas); }

    // 2. Dikey nesneler — derinliğe göre sırala, sonra çiz.
    props.sort((a, b) => a.depth.compareTo(b.depth));
    for (final p in props) { p.render(canvas); }
  }
}
```

> **Performans:** Her frame `sort` çağrısı ~50 prop için sorun değil. 200+ prop olursa statik propleri bir kez sıralayıp sadece hareketli olanları araya ekle (Faz 8).

**Kabul kriteri:** Boş bir dünya oluşturulabiliyor, `render` çağrılabiliyor.

---

### FAZ 4 — Sahnenin yeniden inşası

**SİLİNECEK:** `lib/game/components/diorama_station_renderer.dart`

**Yeni dosya:** `lib/game/iso/iso_station_scene.dart`

`Component with HasGameReference<PetrolStationGame>` olarak bir sınıf. Görevi: `stationState`'e bakarak `IsoWorld`'ü kurmak ve çizmek.

#### Kamera offset'i
`render()` başında sahneyi ekranda ortala:
```dart
canvas.save();
canvas.translate(game.size.x / 2 + kCameraOffsetX, game.size.y * 0.30 + kCameraOffsetY);
// ... world.render(canvas) ...
canvas.restore();
```
`kCameraOffsetX/Y` sabitlerini ayarlanabilir bırak.

#### Sahne yerleşimi (grid planı)

Grid'i şu şekilde kurgula (değerler başlangıç noktasıdır, görsel olarak ayarla):

```
gy
 ↑
 │   [ ÇİM ]
 │   ┌──────────────────────────────┐
 │   │  ağaçlar, çit, taşlar        │
 │   │   ┌──────────────────────┐   │
 │   │   │  BETON FORECOURT     │   │
 │   │   │   [tanklar]  [BİNA]  │   │
 │   │   │   [pompa adaları]    │   │
 │   │   │   [kanopi]           │   │
 │   │   └──────────────────────┘   │
 │   │  ═══ ASFALT YOL (çapraz) ═══ │
 │   └──────────────────────────────┘
 └────────────────────────────────────→ gx
```

Somut adımlar:

1. **Çim zemini:** ~24×24 grid alanı. Tek büyük quad yerine **tile tile çiz** ve her tile'a çok hafif rastgele ton varyasyonu ver (`shadeFlat(grass, rnd*0.03)`). Bu, düz bir yeşil bloktan çok daha canlı durur. Rastgeleliği **sabit seed** ile üret ki her frame titremesin.

2. **Asfalt yol:** Grid boyunca uzanan bir şerit (`drawIsoQuad`). Üstüne:
   - **Çift sarı orta çizgi** (iki ince paralel quad)
   - Şeritlerin ortasına **beyaz kesikli çizgiler** (kısa quad'lar, düzenli aralıkla)

3. **Beton forecourt:** Yoldan istasyona uzanan açık gri quad. Kenarına ince koyu gri şerit (bordür) ekle.

4. **Ana bina:** `stationState`'e göre büyüklüğü değişebilir.
   - Gövde: `drawIsoBox` — krem renk, `h ≈ 2.5`
   - İkinci kat: gövdenin üstünde `baseZ` ile ikinci kutu
   - Çatı: hafif taşan koyu gri düz kutu (`h ≈ 0.15`)
   - Çatı üstü klima üniteleri: 2–3 küçük gri kutu
   - Giriş tentesi: kırmızı ince prizma
   - Pencereler: ön yüze koyu mavi-gri quad'lar (yüz düzlemine hizalı çizilmeli)
   - Tabela: kırmızı kutu + üstüne `TextPainter` ile `BENELOIL` yazısı

5. **Pompa adaları:** `stationState.pumpsCount` kadar döngü.
   - Beton platform: alçak kutu (`h ≈ 0.12`), açık gri
   - Dispenser: kırmızı kutu (`h ≈ 1.2`)
   - Ekran: dispenser'ın ön yüzüne küçük koyu quad
   - Pompa numarası: `TextPainter`

6. **Kanopi:** Pompa adalarının üzerinde, 4 ince silindir direk + üstte geniş düz beyaz kutu. Kanopinin altına **büyük, yumuşak bir gölge quad'ı** koy — derinlik hissini en çok bu artırır.

7. **Yakıt tankları:** Bina yanında 3–4 dikey silindir (`drawIsoCylinder`), yakıt tipine göre renk şeridi.

8. **Propler:** Koni ağaçlar (gövde silindiri + koni tepe), lamba direkleri (ince silindir + üstte kutu), çit parçaları, küçük taşlar. Bunları sahnenin kenarlarına dağıt — **sabit seed** ile.

9. **Koşullu tesisler:** `stationState.hasCarWash` → oto yıkama binası; `stationState.hasEvCharger` → şarj üniteleri. Mevcut renderer'daki mantığı koru, sadece izometrik çiz.

#### Palet
`station_theme.dart`'a yeni sabitler ekle (mevcut olanları silme):
```dart
static const Color isoGrass    = Color(0xFF6FA84F);
static const Color isoAsphalt  = Color(0xFF3A3F44);
static const Color isoConcrete = Color(0xFFC9CCC8);
static const Color isoBuilding = Color(0xFFF2EDE1);
static const Color isoRoof     = Color(0xFF4A5057);
static const Color isoTree     = Color(0xFF3E8E4F);
static const Color isoTrunk    = Color(0xFF6B4C35);
// Aksan renkleri (red/orange/blue/green) mevcut haliyle kullanılabilir.
```

**Kabul kriteri:** Uygulama çalıştırıldığında ekranda **izometrik bir benzin istasyonu diorama'sı** görünüyor. Hiçbir yerde siyah outline yok. Nesnelerin altında gölge var. Bina araçların/pompaların arkasında doğru katmanda.

---

### FAZ 5 — Araçlar izometrik dünyada

**Değişecek:** `lib/game/components/customer_vehicle_component.dart`, `lib/game/components/tanker_component.dart`

1. Araç konumu artık **grid koordinatı** (`gx`, `gy`) olacak, ekran pikseli değil.
2. Hareket, **waypoint listesi** üzerinden: `yola giriş → forecourt'a sapış → pompa slotu → çıkış`. Her waypoint grid koordinatı.
3. Çizim: araç = 2 kutu (gövde `h≈0.5` + kabin `h≈0.4`, kabin gövdenin üstünde ve biraz geride) + 4 küçük koyu silindir (tekerlek) + `drawContactShadow`.
4. Araç, her frame `IsoWorld.props` listesine eklenmeli ki derinlik sıralamasına girsin.
5. Yön: araç hangi eksende ilerliyorsa kutu boyutlarını (`w`, `d`) ona göre yerleştir. Dört yön yeterli, ara açı gerekmez.

**Değişecek:** `lib/game/petrol_station_game.dart`

`_trySpawnCustomer()` içindeki ekran-yüzdeli konum hesabı (`size.x * 0.76 / ...`) **grid koordinatına** dönüşecek. Pompa slotlarının grid konumları Faz 4'te sahne tarafından belirlendiği için, sahneden `Vector2 gridPosForPumpSlot(int slot)` gibi bir sorgu fonksiyonu aç ve onu kullan.

Tap testi: `screenToIso()` ile dokunulan noktayı grid'e çevir, araçların ayak izleriyle karşılaştır.

**Kabul kriteri:** Araçlar yoldan gelip forecourt'a sapıyor, pompaya yanaşıyor, servis sonrası çıkıyor. Pompanın arkasından geçen araç doğru şekilde pompanın arkasında kalıyor. Araca dokunmak panel açıyor.

---

### FAZ 6 — Atmosfer (gün/gece)

`station_state.dart` içinde zaten `timeOfDay` (0–24 saat) var; **bu dosyaya dokunma**, sadece oku.

1. `IsoStationScene.render()` sonunda tüm sahnenin üzerine saate göre bir renk tint'i uygula:
   - Gece (22–05): koyu mavi-mor, `alpha ≈ 0.35`
   - Şafak/gün batımı (05–07, 18–21): turuncu-pembe, `alpha ≈ 0.18`
   - Gündüz: tint yok
   - Geçişleri `Color.lerp` ile yumuşat, ani sıçrama olmasın.
2. Akşam/gece saatlerinde: bina pencerelerini sıcak sarıya çevir, lamba direklerinin altına yumuşak sarı radial glow ekle, kanopi altına aydınlatma havuzu koy.
3. `FlameGame.backgroundColor()` de saate göre değişsin (gökyüzü rengi).

**Kabul kriteri:** Oyun saati ilerledikçe sahne renk değiştiriyor, gece lambalar yanıyor.

---

### FAZ 7 — HUD'un stille uyumlanması

**Değişecek:** `lib/core/theme/station_theme.dart` ve `lib/ui/**`

Mevcut tema **neo-brutalist**: sert 3.5px siyah offset gölge (`neoShadow`, `blurRadius: 0`) ve 2.5px kalın siyah kenarlıklar. Bu, yumuşak izometrik diorama ile çelişiyor.

1. `neoShadow` / `neoShadowSmall` / `neoShadowLarge` yerine yumuşak gölgeler:
   ```dart
   static List<BoxShadow> get softShadow => [
     BoxShadow(color: ink.withValues(alpha: 0.14), offset: const Offset(0, 3), blurRadius: 10),
   ];
   ```
   **Eski getter'ları hemen silme** — önce yeni olanı ekle, kullanım yerlerini tek tek geçir, sonra temizle.
2. `neoCard()` içindeki `borderWidth: 2.5` → `1.0`, kenarlık rengi `ink` → `ink.withValues(alpha: 0.10)`.
3. Köşe yarıçapları biraz büyüsün (`rMd: 14 → 16`).
4. Palet zaten uyumlu — `red #D64545` hedef sitedeki kırmızıyla neredeyse birebir. **Renkleri değiştirme.**
5. `Baloo 2` fontu korunacak (yuvarlak, dostane — stile uygun).
6. LCD/LED ekran bileşenleri (`digital_led_display.dart`) korunacak — pompa ekranı olarak stille uyumlu.

**Kabul kriteri:** HUD kartları yumuşak gölgeli, ince kenarlıklı. Oyun sahnesiyle görsel olarak aynı dili konuşuyor.

---

### FAZ 8 — Performans (yalnızca gerekirse)

Faz 1–7 sonrası FPS düşükse:

1. **Statik sahneyi önbelleğe al.** Zemin + binalar + ağaçlar hiç değişmiyor. `PictureRecorder` ile bir kez `ui.Picture`'a kaydet, her frame `canvas.drawPicture()` ile bas. Sadece araçlar, efektler ve gün/gece tint'i her frame yeniden çizilsin. Önbelleği yalnızca `stationState` değiştiğinde (pompa eklendi, tesis açıldı) geçersiz kıl.
2. `Paint` nesnelerini `render()` içinde `new`'leme — sınıf seviyesinde `static final` olarak tut.
3. `TextPainter`'ları her frame yeniden `layout()` etme — sabit yazılar için önbelleğe al.
4. Prop listesi 200'ü aşarsa: statik propleri bir kez sırala, hareketli propleri her frame binary search ile araya yerleştir.

**Kabul kriteri:** Orta seviye telefonda sabit 60 FPS.

---

### FAZ 9 (OPSİYONEL, sonraya) — Kahraman propler için sprite

Yalnızca Faz 1–8 tamamlandıktan ve stil beğenildikten sonra düşünülecek. Ana bina gibi 1–2 "kahraman" nesne için Blender'da model + izometrik render → PNG atlas → Flame `SpriteComponent`. **Bu faz planın zorunlu parçası değildir ve baştan yapılmamalıdır.**

---

## 6. Yapılmayacaklar listesi

- ❌ `station_state.dart`, `fuel_type.dart`, `vehicle_model.dart` içindeki **oyun mantığına dokunma.** Bu tamamen görsel bir dönüşümdür.
- ❌ `save_service.dart` / kayıt formatını değiştirme.
- ❌ `pubspec.yaml`'a yeni paket ekleme.
- ❌ Perspektif kamera, döndürülebilir kamera, gerçek 3D matris.
- ❌ Sahneye siyah outline geri getirme.
- ❌ Gradient dolgu, tekstür, normal map.

---

## 7. Genel kabul kriteri

Uygulama açıldığında ekranda **beneloil.com'daki gibi izometrik, low-poly, flat-shaded, outline'sız bir benzin istasyonu diorama'sı** görünüyor; araçlar yoldan gelip pompalara yanaşıyor, doğru derinlik sırasında çiziliyor, gece olduğunda lambalar yanıyor ve HUD sahneyle aynı görsel dili konuşuyor — tüm bunlar saf Flutter `Canvas` ile, hiçbir 3D motoru veya yeni bağımlılık olmadan.

---

## 8. Önerilen uygulama sırası

Faz 1 → 2 → 3 → 4 (en uzun faz) → 5 → 6 → 7 → (gerekirse 8) → (opsiyonel 9)

Faz 1–3 birlikte ~400 satırdır ve tüm görsel dönüşümün kilidini açar. Faz 4 en çok emek isteyen ama tamamen mekanik olan fazdır. **Faz 4'ün sonunda dur ve görsel sonucu değerlendir** — palet ve oranlar burada ayarlanmalı, sonraki fazlarda değil.
