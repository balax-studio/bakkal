# Spec: iso-hud-theme (Faz 7 — HUD ve UI'nin İzometrik Diorama Stiliyle Uyumlanması)

## Objective
Mevcut neo-brutalist tema sert siyah gölgeler (`neoShadow`, `blurRadius: 0`) ve kalın 2.5px siyah kenarlıklar kullanmaktadır. Bu durum beneloil.com esintili yumuşak izometrik 2.5D diorama sahnesi ile görsel uyumsuzluk yaratmaktadır. Hedef, tüm HUD kartlarını, menüleri, modalları ve servis panellerini yumuşak gölgeli (`softShadow`), ince kenarlıklı (1.0px, düşük opaklık) ve rafine köşe yarıçaplarına (`rMd: 16`) sahip modern diorama arayüzüne dönüştürmektir.

## Tech Stack
- Flutter SDK `^3.5.0`
- `google_fonts: ^6.2.1` (`Baloo 2` fontu korunacak)
- `flame: ^1.18.0` (HUD overlay ve panel etkileşimi)
- Bağımlılık değişikliği yok (saf Flutter Widget & Theme)

## Commands
- Build / Analyze: `flutter analyze`
- Run Web: `flutter run -d chrome`
- Test: `flutter test`

## Project Structure
```text
lib/
├── core/theme/
│   └── station_theme.dart          → softShadow, softCard, güncellenmiş köşe yarıçapları
└── ui/
    ├── hud/
    │   ├── station_hud.dart        → Üst durum çubuğu ve yakıt göstergeleri
    │   └── radial_fab_menu.dart    → Dairesel FAB buton ve alt menü kartları
    ├── modals/
    │   ├── construction_modal.dart → Tesis ve pompa yükseltme modalı
    │   ├── fuel_order_modal.dart   → Yakıt siparişi modalı
    │   └── office_modal.dart       → Muhasebe ve istasyon ofisi modalı
    └── panels/
        └── pump_service_panel.dart → Pompa servis ve yakıt dolum paneli
```

## Code Style
```dart
// Tema Kuralı: Yumuşak gölge ve ince zarif kenarlık
static BoxDecoration softCard({
  Color color = paper,
  double radius = rMd,
  Color? borderColor,
  List<BoxShadow>? shadow,
}) =>
    BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: borderColor ?? ink.withValues(alpha: 0.10),
        width: 1.0,
      ),
      boxShadow: shadow ?? softShadow,
    );
```

- Renk paletindeki `red (#D64545)`, `green`, `orange`, `blue` ve `paper` tonları aynen korunacaktır.
- `neoShadow` / `neoShadowSmall` doğrudan silinmeyecek, `softShadow` ve `softShadowSmall` yapılarına aşamalı dönüştürülecektir.
- Dijital LED göstergeler (`StationTheme.lcdBg`, `ledGreen`) pompa ekranı havasını korumak için muhafaza edilecektir.

## Testing Strategy
- Statik kod analizi: `flutter analyze` (sıfır uyarı / hata)
- Widget testleri: `flutter test`
- Görsel doğrulama: Web arayüzünde (`localhost:8085`) tüm butonlar, diyaloglar ve pompa servis ekranı açılarak görsel uyumun ve okunabilirliğin doğrulanması.

## Boundaries
- **Always:** `flutter analyze` ile derleme doğrulaması yap, mevcut `station_state.dart` iş mantığını ve callback'leri koru.
- **Ask first:** Renk paletini veya font tipografisini değiştirmek.
- **Never:** Oyun mekaniğini, kayıt sistemini veya domain modellerini bozmak; yeni dış bağımlılık eklemek.

## Success Criteria
1. HUD üst çubuğu, sayaçlar ve aksiyon butonları yumuşak gölgeli ve ince kenarlıklı görünür.
2. İnşaat (`construction_modal.dart`), Yakıt Siparişi (`fuel_order_modal.dart`) ve Ofis (`office_modal.dart`) modalları diorama arka planıyla kesintisiz uyum sağlar.
3. Pompa servis paneli (`pump_service_panel.dart`) diorama temasıyla uyumlu yumuşak hatlara sahip olurken LED göstergelerin kontrastı korunur.
4. `flutter analyze` hatasız geçer ve tüm buton tıklama/etkileşimleri eksiksiz çalışır.

## Open Questions
- Yok (Gereksinimler ve görsel kısıtlar `ISOMETRIC_2_5D_PLAN.md` içinde net olarak tanımlanmıştır).
