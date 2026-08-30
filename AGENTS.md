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
