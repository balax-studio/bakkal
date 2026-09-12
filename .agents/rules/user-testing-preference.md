# Kullanıcı Test ve Doğrulama Kuralı (User Testing Preference)

## KESİN KURAL: AJAN OTOMATİK TEST VEYA TARAYICI TESTİ ÇALIŞTIRMAZ

1. **Testleri Yalnızca Kullanıcı Yapar**:
   - Kullanıcı görsel, oynanış, UI, 3D render ve fonksiyonel testleri doğrudan kendi tarayıcısında (`http://localhost:8090/`) bizzat test eder.
   - Ajan (`browser_subagent`, Playwright, Chrome DevTools veya otomatik tarayıcı açma araçlarını) KULLANMAMALIDIR.

2. **Test Döngülerine Girilmeyecek**:
   - Kullanıcı açıkça "sen test et" veya "tarayıcıda test et" şeklinde doğrudan bir talimat vermediği sürece asla tarayıcı testi başlatılmayacaktır.
   - Sürekli test etme, ekran görüntüsü alma veya doğrulama amacıyla tarayıcı ajanları koşturulmayacaktır.

3. **İzin Verilen Tek Doğrulama (Statik Sözdizimi)**:
   - Ajan yalnızca kodun sözdizimsel olarak kırılmadığından emin olmak için yerel ve hafif statik kontroller yapabilir (örneğin `node --check <dosya>`).
   - Kod hatasız derlendiğinde veya sözdizimi doğrulandığında işlem tamamlanmış kabul edilir ve kontrol hemen kullanıcıya devredilir.

4. **Kullanıcıya Hızlı Teslim ve Onay İstememe**:
   - Değişiklikler uygulandıktan sonra beklemeden ve gereksiz test adımlarına sapmadan doğrudan teslim edilir.
   - Kullanıcıya onay sorusu ("yapayım mı?", "onaylıyor musun?") sorulmaz, önerilen veya istenen düzeltmeler doğrudan uygulanır ve kısaca "Bitti" bildirilir.
