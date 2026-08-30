# Tasks: iso-hud-theme (Faz 7 HUD Uyumlaması)

- [ ] Task 1: `station_theme.dart` tema güncellemeleri
  - Acceptance: `softCard`, `softShadow`, `softShadowSmall`, `softShadowLarge`, `rMd: 16`, 1.0px ince kenarlık ve hafif opaklık stilleri tanımlandı
  - Verify: `flutter analyze`
  - Files: `lib/core/theme/station_theme.dart`

- [ ] Task 2: HUD üst durum çubuğu ve FAB menü dönüşümü
  - Acceptance: Üst istasyon durum kartları, yakıt barları ve dairesel menü yumuşak diorama gölgelerine ve ince kenarlıklara sahip
  - Verify: `flutter analyze`
  - Files: `lib/ui/hud/station_hud.dart`, `lib/ui/hud/radial_fab_menu.dart`

- [ ] Task 3: Yönetim ve işlem modallarının dönüşümü
  - Acceptance: `construction_modal.dart`, `fuel_order_modal.dart`, `office_modal.dart` modallarındaki tüm kartlar, sekmeler ve butonlar yumuşak gölgeli ve 1px ince kenarlıklı
  - Verify: `flutter analyze`
  - Files: `lib/ui/modals/construction_modal.dart`, `lib/ui/modals/fuel_order_modal.dart`, `lib/ui/modals/office_modal.dart`

- [ ] Task 4: Pompa servis panelinin dönüşümü
  - Acceptance: `pump_service_panel.dart` yumuşak kenarlık ve diorama gölgelerine sahip; LCD ekran kontrastı ve buton etkileşimleri kusursuz
  - Verify: `flutter analyze`
  - Files: `lib/ui/panels/pump_service_panel.dart`

- [ ] Task 5: Kapsamlı analiz ve test doğrulaması
  - Acceptance: `flutter analyze` sıfır hata ve sıfır uyarı ile tamamlanır, testler geçer
  - Verify: `flutter analyze && flutter test`
  - Files: Tüm `lib/ui/**` ve `lib/core/theme/**`
