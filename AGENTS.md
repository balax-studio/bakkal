# PixelOil 3D Project Rules & Architecture Standards

## 1. Iconography & Aesthetics
- **ASLA EMOJİ KULLANILMAYACAK**: Projenin hiçbir yerinde (UI, bildirimler, başlıklar, butonlar, 3D levhalar) standart unicode emojiler kullanılmayacaktır.
- **BRUTALİST SVG İKONLAR**: Her zaman keskin, geometrik, 2px/2.5px siyah konturlu inline SVG veya vektör ikonlar kullanılacaktır.

## 2. Dynamic Multi-Language Architecture (i18n: TR / EN)
- **DİNAMİK DİL SİSTEMİ**: Tüm arayüz metinleri, toast mesajları, 3D levhalar, modal pencereleri ve butonlar harici bir çeviri sözlüğü (i18n dictionary) üzerinden dinamik çekilmelidir.
- **TR / EN EŞ ZAMANLI DESTEK**: Projede eklenen her yeni özellik ve metin hem Türkçe (TR) hem İngilizce (EN) karşılığı ile birlikte yazılacak ve tek dokunuşla dil değişimi desteklenecektir.

## 3. Dual-Engine Synchronization (Web 3D & Godot 4)
- **EŞ ZAMANLI GÜNCELLEME**: Yapılan her mekanik, ekonomi, diorama ve UI kurgusu hem `web_3d_station/` (Three.js) hem de `godot_station/` (Godot 4 Forward+) dizinlerinde senkronize şekilde uygulanacaktır. İki sürüm birbirinden kopuk veya uyumsuz bırakılamaz.

## 4. Mobile Store Standards (Apple App Store & Google Play Store)
- **STORE UYUMLULUĞU**: UI ve etkileşim tasarımı iOS ve Android mağaza yönergelerine (App Store Review Guidelines & Google Play Policy) tam uyumlu olacaktır.
- **TOUCH TARGET & SAFE AREA**: Mobil dokunmatik hedef alanları en az 48x48px olacak, safe-area-inset desteği sağlanacak ve mobil cihazlarda yatay/dikey taşmalar önlenecektir.
- **PERFORMANS & OPTİMİZASYON**: Mobil GPU'larda 60 FPS hedeflenecek, draw call'lar düşük tutulacaktır.

## 5. Testing & Verification Protocol (User Playtesting Only)
- **OTOMATİK OYUN TESTİ/TARAYICI BOTU KULLANILMAYACAK**: Ajan kesinlikle oyunu oynamak, butonlara tıklatmak, gameplay simülasyonu yapmak veya interaktif test etmek için browser subagent / tarayıcı otomasyonu başlatmayacaktır.
- **KULLANICI MANUEL TEST EDER**: Tüm oyun oynanış testleri, tıklamalar, mekanik denemeleri bizzat kullanıcı tarafından manuel yapılacaktır. Ajan yalnızca kod yazımı, sözdizimi doğrulamaları, statik analiz ve dual-engine senkronizasyonunu eksiksiz tamamlayıp kullanıcıya teslim edecektir.

## 6. Facility Construction & Upgrade Visualization Standards
- **ASLA JENERİK TABELA/DİREK KULLANILMAYACAK**: İnşa edilmemiş veya geliştirilebilir tesis alanları (Pompalar, Yıkama, Market, Güneş Paneli, Rüzgar Türbini, EV Şarj) harita üzerine rastgele ahşap çubuk tabelalar veya devasa billboardlar dikilerek temsil edilmeyecektir.
- **ÖZELLEŞTİRİLMİŞ 3D İNŞAAT TEMELLERİ (CUSTOM 3D PRE-BUILD DIORAMAS)**: Her tesis için kendine has mimari inşaat alanı kurgulanacaktır:
  - Pompalar: Güvenlik konileri, beton ada temeli, zemin flanşı ve minik etkileşimli rozet.
  - Oto Yıkama: Su gider ızgaraları, zemin drenajı ve köşe güvenlik dubaları ile su borusu paletleri.
  - Market: Tuğla/ahşap palet istifleri ve temel beton çizgileri.
  - Çatı GES: Kanopi üstü montaj rayları ve bağlantı buat kutusu.
  - Rüzgar Türbini: Dairesel beton kaide ve ankraj cıvata yuvaları.
  - EV Şarj: Yeşil zemin boyaması, tekerlek takozları ve elektrik kablo kanalları.
- **ETKİLEŞİMLİ PROMPT & MODAL ENTEGRASYONU**: İnşaat alanına (temele veya rozete) tıklandığında ilgili tesisin inşaat/geliştirme modali doğrudan açılmalıdır.

