# Capability Map: 2.5D İzometrik Görsel Dönüşüm

| Modül ID | Sorumluluk | Bağımlılıklar | Durum |
|---|---|---|---|
| `iso-core` | 2:1 dimetrik projeksiyon, flat shading (`iso_math.dart`), izometrik çizim primitifleri (`iso_shapes.dart`), prop ve dünya derinlik modeli (`iso_prop.dart`, `iso_world.dart`) | — | ✅ Tamamlandı (Faz 1-3) |
| `iso-scene` | İzometrik zemin, ana bina, kanopi, pompalar, tanklar, propler ve gün/gece dinamik atmosfer ışıklandırması (`iso_station_scene.dart`) | `iso-core` | ✅ Tamamlandı (Faz 4, 6) |
| `iso-vehicles` | İzometrik araç ve tanker modelleri, grid tabanlı waypoint hareketi ve sahne derinlik entegrasyonu (`customer_vehicle_component.dart`, `tanker_component.dart`, `petrol_station_game.dart`) | `iso-core`, `iso-scene` | ✅ Tamamlandı (Faz 5) |
| `iso-hud-theme` | Neo-brutalist sert gölgeler ve kalın kenarlıklardan yumuşak diorama gölgelerine (`softShadow`) ve ince kenarlıklara geçiş, tüm modal ve panellerin diorama görsel diliyle uyumlanması (`station_theme.dart`, `lib/ui/**`) | `iso-core` | 🟡 Uygulanacak (Faz 7) |
| `iso-performance` | Canvas çizim optimizasyonları, statik paint nesneleri, 60 FPS akıcılık denetimi (`iso_station_scene.dart`) | `iso-scene`, `iso-hud-theme` | ⏳ Beklemede (Faz 8) |

**İnşa Sırası:** `iso-core` → `iso-scene` → `iso-vehicles` → `iso-hud-theme` → `iso-performance`
