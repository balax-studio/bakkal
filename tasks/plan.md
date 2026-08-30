# Implementation Plan: iso-hud-theme (Faz 7 HUD Uyumlaması)

## 1. Mimari ve Bileşen Bağımlılıkları
`station_theme.dart` üzerindeki temel stil tanımları (`softShadow`, `softCard`, `rMd: 16`, 1px kenarlıklar) UI bileşenlerinin temelidir. Önce tema güncellenecek, ardından UI bileşenleri tek tek dönüştürülecektir.

## 2. Uygulama Sırası
1. **Adım 1:** `lib/core/theme/station_theme.dart` içinde `softCard`, `softShadowSmall`, `softShadowLarge` ve border helper'larının tamamlanması.
2. **Adım 2:** `lib/ui/hud/station_hud.dart` ve `radial_fab_menu.dart` bileşenlerinin yumuşak diorama stiline geçirilmesi.
3. **Adım 3:** `lib/ui/modals/construction_modal.dart`, `fuel_order_modal.dart`, `office_modal.dart` modallarının güncellenmesi.
4. **Adım 4:** `lib/ui/panels/pump_service_panel.dart` servis ekranının güncellenmesi.
5. **Adım 5:** `flutter analyze` ve `flutter test` doğrulaması + görsel kontrol.

## 3. Riskler ve Önlemler
- **Risk:** `neoCard` veya `neoShadow` çağrılarının kaldırılması sırasında eksik referans veya UI kırılması.
- **Önlem:** Eski getter'lar (`neoShadow`, `neoCard`) hemen silinmeyecek, `softCard` / `softShadow` ile yer değiştirildikten sonra temizlenecektir.
