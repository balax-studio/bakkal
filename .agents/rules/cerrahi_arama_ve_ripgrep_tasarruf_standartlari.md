# Cerrahi Arama, Ripgrep ve Token Tasarrufu Standartları

Bu kural, projede çalışan tüm yapay zeka ajanları ve geliştiriciler için arama, kod okuma ve düzenleme verimliliğini bağlar.

## 1. Cerrahi Arama ve Kademeli Keşif (Phased Retrieval)
- Kod tabanında bir analiz veya düzenleme yaparken tüm dosyaları körü körüne hafızaya doldurmak (bulk read) yasaktır.
- Hedef sınıf, fonksiyon, değişken veya metin tespiti için öncelikle `grep_search` veya `ripgrep` (`rg`) motoru kullanılmalıdır.
- Kademeli arama protokolü uygulanır:
  1. Adım: Standart arama (`rg pattern` veya `grep_search`).
  2. Adım: Sonuç bulunamazsa gizli ve yapılandırma dosyalarını dahil et (`-u` bayrağı).
  3. Adım: Yalnızca gerektiğinde dosya tipi filtresi (`-tdart`, `-tjson` vb.) ile aramayı daralt.

## 2. Bağlam Bütünlüğü ve Güvenli Düzenleme (Context Integrity)
- `ripgrep` ile konumu tespit edilen kod bloğunun yaşam döngüsü (`dispose`, state dinleyicileri, importlar) incelenmeden körlemesine değişiklik yapılamaz.
- Kod düzenlemeleri yalnızca hedeflenen satırlara cerrahi olarak uygulanmalıdır.

## 3. Global ve Yerel Çöp İzolasyonu (Zero-Noise Filtering)
- `build/`, `.dart_tool/`, `node_modules/`, `target/`, `.gradle/` ve `*.log` gibi üretim çıktıları aramalardan ve bağlamdan daima izole tutulmalıdır.
