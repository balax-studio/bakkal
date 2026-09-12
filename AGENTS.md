# Workspace Kuralları & Talimatları (İstasyon)

## ÖNEMLİ KULLANICI KURALI: TESTLERİ YALNIZCA KULLANICI YAPAR

- **Ajan Tarayıcı Testi Yapmaz**: `browser_subagent`, Playwright veya otomatik tarayıcı açma araçlarını çalıştırmayın. Kullanıcı ("ben test ederim sen test edip durma") görsel ve işlevsel testleri bizzat kendisi tarayıcı üzerinden yapar.
- **Yalnızca Statik/Sözdizimi Kontrolü**: Kod değişikliklerinden sonra yalnızca yerel hızlı sözdizimi kontrolü (örn. `node --check public/assets/index-C7O-ej6u.js`) yapın, ardından hemen kullanıcıya teslim edin.
- **Gereksiz Test Döngüsü Yok**: Kullanıcı açıkça istemediği sürece test aracı çağırmayın.

## ÖNEMLİ KULLANICI KURALI: ONAY İSTEMEDEN DOĞRUDAN UYGULA
- **Onay Sorusu Gönderme**: Kullanıcıya "onaylıyor musun?", "yapayım mı?" gibi onay soruları göndermeyin. İstenen veya önerilen düzeltmeleri doğrudan uygulayın.
- **Kısa Teslim**: İşlem tamamlandığında gereksiz uzatmadan doğrudan net ve kısa şekilde teslim edin ("Bitti").

## ÖNEMLİ KULLANICI KURALI: TASARIM STANDARDI (NEO-BRUTALIST & LOW-POLY CUBE)
- **UI Tasarımı (Tüm Arayüzler):** Eklenen ve güncellenen her UI bileşeni, buton, kart, modal veya panel KESİNLİKLE **Neo-Brutalist** tarzda olacaktır:
  - Kalın katı kenarlıklar (`border: 2.5px solid #111418; border-bottom: 3.5px - 4px solid #111418;`)
  - Sert ofset gölgeler (`box-shadow: 2.5px 2.5px 0px #111418;`), yumuşak bulanık blur/glow gölgeler KESİNLİKLE YASAKTIR.
  - Hafif yuvarlatılmış köşeli küp/kare formlar (`border-radius: 6px - 10px;`), tam yuvarlak/daire (pürüzsüz `50%`) KESİNLİKLE YASAKTIR.
  - Yüksek kontrast, sıcak krem/kağıt zemin (`var(--paper, #faf6ec)`) veya canlı sarı (`#fde047`) / marka kırmızı vurgular.
  - Dokunsal mekanik basma animasyonu (`:active { transform: translate(2px, 2px); box-shadow: 0.5px 0.5px 0px #111418; }`).
- **3D Tasarım (Modeller ve Sahne):** Eklenen her 3D nesne, bina, istasyon alanı, araç ve dekorasyon KESİNLİKLE **Low-Poly Cube / Voxel** (adım adım kübik formlar, keskin fasetli yüzeyler, pürüzsüzleştirilmemiş mesh'ler) olacaktır. Pürüzsüz organik küre veya silindirik modeller YASAKTIR.

## Geliştirme Notları
- Dev sunucusu yerel olarak `http://localhost:8090/` adresinde çalışmaktadır.
- Yapılan değişiklikler hem `public/assets/index-C7O-ej6u.js` hem de gerekiyorsa `dist/assets/index-C7O-ej6u.js` içine senkron uygulanır.
