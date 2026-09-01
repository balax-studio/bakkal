# SPEC: PixelOil 3D — Yaşayan Dünya, Çevresel Hikaye Anlatımı ve Sinematik Çevre Detayları

## 1. Amaç ve Vizyon
PixelOil 3D diorama simülasyonuna; doğa, dinamik hava koşulları, yaşayan hayvanlar/NPC'ler, yaşanmışlık ve aşınma izleri, iç mekan hayat illüzyonları ve sinematik mikro olaylar ekleyerek istasyonu ve çevresini nefes alan, hikayesi olan yaşayan bir mikro evrene dönüştürmek.

---

## 2. Mimari ve Katı Kurallar (AGENTS.md)
- **ASLA EMOJİ KULLANILMAYACAK**: Arayüz, 3D levhalar, bildirimler ve diorama rozetlerinde kesinlikle unicode emoji bulunmayacak; sadece brutalist geometrik inline SVG ve 3D procedural meshler kullanılacak.
- **DİNAMİK ÇİFT DİL (TR / EN)**: Eklenen tüm yeni hava durumu durumları, çevre bildirimleri ve diorama etkileşimleri `I18N` sözlüğüne çift dilli olarak işlenecek.
- **DUAL-ENGINE EŞZAMANLILIĞI**: Web 3D (`web_3d_station/`) ve Godot 4 (`godot_station/`) motorlarında aynı çevre özellikleri ve modelleri senkronize uygulanacak.
- **KULLANICI MANUEL TEST EDER**: Otomatik tarayıcı botu başlatılmayacak; statik analiz ve sözdizimi doğrulamasının ardından kullanıcı yerel sunucuda manuel test edecek.

---

## 3. Modül Haritası ve Yetenek Dağılımı

| Modül ID | Sorumluluk | Bağımlılık |
|---|---|---|
| `env_foliage_weather` | Ağaç türleri, rüzgar salınımı, yağmur su birikintisi & buhar partikülleri | Çekirdek Diorama |
| `wildlife_and_npcs` | Uçan martılar/kargalar, güvercinler, sarman kedi, bistro yaya NPC'leri | `env_foliage_weather` |
| `urban_storytelling` | Asfalt yamaları, yırtık afişler, yerdeki kağıt çöpler, TV pencere ışık titremesi | Çekirdek Diorama |
| `micro_events_fx` | Bozuk yanıp sönen lamba, ufukta uçak izi, yuvarlanan kutu, ambiyans sesleri | `wildlife_and_npcs`, `urban_storytelling` |
| `godot_sync` | Godot 4 `Diorama.tscn`, `Canopy.tscn` ve çevre scriptlerinin Three.js ile senkronizasyonu | Tüm Modüller |

---

## 4. Teknik Şartname & Kod Standartları

### Modül 1: `env_foliage_weather`
- **Ağaç Çeşitliliği**: Refüj fidanı (genç konik), meşe/çınar (geniş kübik taç), sahil palmiyesi (istasyon yanı) ve iğne yapraklı çamlar.
- **Rüzgar Salınımı**: `crown.rotation.z = sin(time * 2.2 + id) * 0.035` ile GPU/CPU hafif salınım.
- **Su Birikintileri (Puddles)**: Asfalt üzerinde koyu parlak (Roughness 0.05, Metalness 0.25) pürüzsüz su birikintisi meshleri.
- **Rögar Buharları**: `ParticleSystem` ile yukarı doğru yavaşça yükselip sönen şeffaf buhar bulutçukları.

### Modül 2: `wildlife_and_npcs`
- **Gökyüzü Kuşları**: Yarıçap 25m etrafında dairesel süzülen 4 martı/karga sürüsü.
- **Güvercinler**: Sokak lambası konsolunda durup periyodik kafa sallayan düşük poligonlu güvercinler.
- **Sarman Kedi**: Market köşesinde esneyen ve kuyruğunu sallayan sarman kedi modeli.
- **Bistro & Cafe NPC'leri**: Mini market seviye 2/3 olduğunda 'Pixel Cafe' bistro masalarında oturan ve kahve içen stilize voxel yayalar.

### Modül 3: `urban_storytelling`
- **Asfalt Yamaları & Çatlaklar**: Farklı tonda koyu antrasit yama geometrileri ve sarı yol çizgi aşınmaları.
- **Zemin Mikro Detayları**: İstasyon köşelerinde rüzgarla hafif titreşen kağıt bardak, gazete kupürü ve bina diplerinde minik yabani otlar.
- **Pencere Hayat İllüzyonu**: Gece olunca market/ofis üst pencerelerinde mavi TV ekran titreşimi (`Math.sin(time * 8.0) * 0.15 + 0.85`) ve sıcak sarı oda ışığı.
- **Klima Dış Ünitesi**: Marketin arka duvarında dönen fan pervanesi ve altında hafif su damlama lekesi.

### Modül 4: `micro_events_fx`
- **Arızalı Sokak Lambası**: 15-20 saniyede bir rastgele 0.4 saniye cızırdayarak pırpır eden sokak lambası ışığı.
- **Ufuk Uçak İzi**: Gökyüzünün yüksek irtifasında (Y: 28) yavaşça yatay geçen ve arkasında beyaz iz bırakan yolcu uçağı.
- **Boş Kutu Fiziği**: Rüzgar hızlandığında istasyon zemininde birkaç metre yuvarlanan teneke kutu.
- **Gelişmiş Web Audio Ambiyansı**: Gece cırcır böceği, gündüz kuş cıvıltısı ve hafif rüzgar uğultusu.

---

## 5. Başarı Kriterleri (Acceptance Criteria)
1. Web 3D (Three.js) tarayıcıda 60 FPS akıcılıkta çalışmalı.
2. Tesis seviyeleri arttıkça (örneğin Market Lvl 2/3 olunca cafe masalarına oturan müşteriler belirmeli) çevre dinamik tepki vermeli.
3. Asla emoji kullanılmamalı; sadece brutalist SVG ve geometrik 3D meshler yer almalı.
4. `node -c web_3d_station/game.js` sözdizimi doğrulaması 0 hata ile tamamlanmalı.
5. Godot 4 Forward+ sahneleri (`godot_station/scenes/Diorama.tscn`) ve scriptleri Three.js sürümüyle senkronize olmalı.
