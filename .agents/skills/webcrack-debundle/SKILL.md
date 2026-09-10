---
name: webcrack-debundle
description: "Minified JS dosyalarını ve devasa bundle'ları webcrack ile otomatik olarak ayrıştırıp deobfuscate ederek token tasarrufu sağlayan uzman workflow."
---

# Webcrack Debundle & Token Optimization Skill

Bu skill, minified bundle dosyalarında (`public/assets/*.js` gibi 1MB+ dosyalar) hata ayıklama, özellik ekleme veya tersine mühendislik gerektiğinde otomatik devreye girer.

## Ne Zaman Kullanılır?
- Projedeki `public/assets/index-C7O-ej6u.js` veya benzeri sıkıştırılmış kodların mantığı anlaşılmaya çalışıldığında
- Minified kod üzerinde arama yaparken bağlam kaybı yaşandığında
- Büyük dosya çıktıları nedeniyle token tüketimini minimumda tutmak gerektiğinde

## Çalıştırma Adımları

1. **Ayrıştırma (Unbundle):**
   ```bash
   npm run unbundle
   # veya spesifik bir çıktı dizini için:
   npx webcrack public/assets/index-C7O-ej6u.js -o .cache/unbundled
   ```

2. **Hedef Modülü/Fonksiyonu İnceleme:**
   - Açılan klasör içerisindeki dosyalar okunabilir değişken ve fonksiyon adlarına sahip olur.
   - Sadece ilgilenilen fonksiyonu veya bloğu oku (maksimum 50-100 satır).

3. **Cerrahi Uygulama:**
   - Değişikliği `public/assets/index-C7O-ej6u.js` dosyasına cerrahi string replace veya Node scripti ile uygula.
   - İşlem bittiğinde `dist/assets/index-C7O-ej6u.js` ile senkronize et.
