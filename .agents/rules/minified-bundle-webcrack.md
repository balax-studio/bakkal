---
description: "Minified ve bundle edilmiş devasa JS dosyalarında token tasarrufu için webcrack'in otomatik kullanımı"
always_apply: true
---

# Minified JS Dosyaları ve Webcrack Otomatik Kullanım Kuralı

Bu projede oyunun ana mantığı veya üçüncü parti paketler devasa tek parça minified JS dosyaları (`public/assets/*.js`, `dist/assets/*.js`, `*.min.js`) içerisinde yer alabilir.

Yapay zeka (agent), bu dosyalarda analiz, tersine mühendislik veya kod incelemesi yapması gerektiğinde **ŞU PROTOKOLÜ OTOMATİK OLARAK UYGULAMALIDIR**:

1. **ASLA Ham Minified Dosyayı Doğrudan Context'e Yükleme:**
   - 1.5 MB'lık dosyada `view_file` ile yüzlerce satır okuma veya konsola `console.log` ile binlerce karakter basma.
   - Doğrudan `git diff` veya `git log -p` komutları çalıştırma (`.gitattributes` ile koruma altındadır).

2. **Webcrack'i Otomatik Olarak Çalıştır:**
   - Minified kodun iç yapısını anlamak, fonksiyon mantığını çözmek veya hata ayıklamak gerektiğinde hemen:
     ```bash
     npm run unbundle
     # veya: npx webcrack <dosya_yolu> -o <hedef_dizin>
     ```
     komutunu arka planda çalıştır.
   - Çıkan ayrıştırılmış modüller veya `deobfuscated.js` dosyası üzerinden **yalnızca ilgili küçük fonksiyonu** incele.

3. **Cerrahi Değişiklik ve Senkronizasyon:**
   - İnceleme tamamlandıktan sonra, yapılacak değişikliği hedef dosyaya (`public/assets/index-C7O-ej6u.js`) cerrahi ve minimal bir replacement ile uygula.
   - Geçici ayrıştırma dosyaları repoda tutulmamalı, iş bitince temizlenmelidir.
