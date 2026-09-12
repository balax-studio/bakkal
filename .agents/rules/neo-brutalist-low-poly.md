---
paths:
  - "**/*.js"
  - "**/*.html"
  - "**/*.css"
  - "**/*.mjs"
---
# Neo-Brutalist UI & Low-Poly Cube 3D Standard

Bu projede geliştirilen, eklenen veya güncellenen HER tasarım aşağıdaki iki temel kurala zorunlu olarak uymak zorundadır:

## 1. UI Tasarımı: Neo-Brutalist
- **Kenarlıklar:** Kalın, net ve koyu (`border: 2.5px solid #111418; border-bottom: 3.5px - 4px solid #111418;`).
- **Gölgeler:** Sert ve katı açılı ofset gölgeler (`box-shadow: 2.5px 2.5px 0px #111418;`). Yumuşak blur/glow gölgeler KESİNLİKLE YASAKTIR.
- **Form/Geometri:** Hafif yuvarlatılmış köşeli kübik/kare formlar (`border-radius: 6px - 10px;`). Pürüzsüz daire (`50%`) KESİNLİKLE YASAKTIR.
- **Renk Paleti:** Sıcak kağıt/krem zemin (`#faf6ec` / `#f1ebdb`), koyu mürekkep (`#111418` / `#22303c`), sarı (`#fde047`) veya kırmızı gibi parlak yüksek kontrastlı vurgular.
- **Taktil Geri Bildirim:** Tıklama/dokunma anında mekanik çökme hissi (`transform: translate(2px, 2px); box-shadow: 0.5px 0.5px 0px #111418;`).

## 2. 3D Tasarım: Low-Poly Cube / Voxel
- Sahneye veya dünyaya eklenen her model, araç, bina ve prop KESİNLİKLE kübik low-poly / voxel (Step-by-step box geometry, BoxGeometry, voxelized style) formatında inşa edilir.
- Pürüzsüz yuvarlatılmış küre/silindir yerine açılı, fasetli, kübik formlar kullanılır.
