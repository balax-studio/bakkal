# Akıllı Repo Kurulum ve Antigravity Entegrasyon Standardı

Bu kural, kullanıcı bir GitHub reposunu veya CLI aracını "kur", "globale kur" veya "entegre et" dediğinde bağlayıcıdır.

## 1. Antigravity Odaklı Kurulum İlkesi (Sıfır Çöp)
- Kurulacak aracın dokümantasyonunda Cursor, Claude Code, Windsurf vb. farklı editörlere ait şablonlar veya komutlar bulunsa dahi, kullanıcının sisteminde aktif olarak kullanılmayan bu araçlar için atıl konfigürasyon dizinleri ve kancalar (hooks) OLUŞTURULAMAZ.
- Sadece aracın kendi ikili dosyası (binary / CLI / runtime) ve **Google Antigravity IDE** entegrasyonu hedeflenir.

## 2. Üretici Tavsiyesini Antigravity Mimarisine Uyarlama
- Üreticinin önerdiği kullanım biçimi incelenir ve Antigravity mimarisindeki en uygun karşılığına dönüştürülür:
  - **Terminal / CLI filtreleri veya kuralları:** Antigravity Kuralı (`rules/*.md` veya `GEMINI.md`) olarak yapılandırılır.
  - **Model Context Protocol (MCP) sunucuları:** `mcp_config.json` veya MCP yapılandırmasına eklenir.
  - **Doğrudan komut satırı araçları:** Temiz bir işletim sistemi dizinine (`AppData\Local\Programs\...`) yerleştirilip kullanıcı `PATH` ortam değişkenine eklenir.

## 3. Global ve Kalıcı Entegrasyon
- Kullanıcı "globale kur" dediğinde:
  - İlgili aracın çalıştırılabilir dosyası sistem `PATH` yoluna kalıcı olarak eklenir.
  - Araca ait Antigravity kuralları hem mevcut projeye (`.agents/rules/`) hem de küresel kök dizine (`~/.gemini/config/rules/`) kaydedilir. Böylece açılan her yeni projede kural otomatik olarak yürürlüğe girer.

## 4. Doğrulama ve Çalışma Testi
- Kurulum tamamlandıktan sonra aracın Antigravity içinde gerçekten çalıştığı (`--version`, test komutu veya doğrulama çıktısı) teyit edilmelidir.
- Kullanıcıya yalnızca Antigravity'yi ilgilendiren, gereksiz teknik karmaşadan uzak net bir özet sunulur.

## 5. Platform ve Asistan Uyumluluk Optimizasyonu (Antigravity & OS Adaptation)
- Bir beceri veya repo kurulurken asla ham / dış ekosistem haliyle bırakılamaz; Antigravity IDE ve mevcut işletim sistemine (Windows/PowerShell) cerrahi olarak optimize edilmelidir:
  - **İşletim Sistemi / Shell Düzeltmesi:** `python3`, `bash`, Linux path formatları gibi sistemde çalışmayacak ifadeler doğrudan Windows uyumlu (`python`, `powershell`, Windows dizin yapıları) karşılıklarına çevrilmelidir.
  - **Asistan Yabancı Çağrılarının Temizlenmesi:** Metinlerde veya scriptlerde yer alan yabancı araç bağımlılıkları (`call Claude`, `Claude CLI`, `/tdd`, `CLAUDE.md` vb.) elenmeli veya Antigravity / Gemini karşılıklarıyla (`GEMINI.md`, `Antigravity Rules`, doğrudan ajan eylemleri) değiştirilmelidir.
  - **Çalıştırılabilir Kod Bağlantısı:** Script barındıran beceriler izole bırakılamaz; ya Windows `PATH`e bir wrapper ile eklenmeli ya da Antigravity ajanı tarafından doğrudan koşturulabilir hale getirilmelidir.

