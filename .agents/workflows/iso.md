---
description: "İstenen görev için gerekli becerileri resmi find-skills ile bulup kurar, ardından prompt-optimizer ile optimize edilmiş nihai promptu üretir."
---

# /iso İş Akışı (Akıllı Beceri Keşfi, Kurulumu ve Prompt Optimizasyonu)

Kullanıcı `/iso <yapılmak istenen görev>` komutunu verdiğinde aşağıdaki 4 aşamalı protokol sıra bozulmadan işletilir:

## 1. Aşama: Görev Analizi ve Beceri Keşfi (find-skills)
- Kullanıcının ilettiği `<görev>` incelenir.
- Görev için gereken uzmanlıklar (mimari, test, animasyon, ağ, veritabanı vb.) saptanır.
- Resmi **`find-skills`** protokolü işletilir:
  1. Önce projedeki mevcut `.agents/skills/` ve yerel arşiv (`D:\github\skill-arsivi`) taranır.
  2. Bulunamazsa doğrudan `npx skills find <arama_terimi>` ile açık kaynak ekosistemde arama yapılır.
  3. En kaliteli ve güvenilir beceri `npx skills add <paket> --skill <ad> -y` ile projeye fiziken kurulur.

## 2. Aşama: Kurulum Bilgilendirmesi (Zorunlu Format)
Eğer görev için yeni bir beceri indirilip kurulduysa, nihai prompttan önce kullanıcıya açıkça şu formatta bildirim geçilir:
> `[Kurulum] "<beceri-adi>" skili kuruldu ve projeye bağlandı.`

Eğer gereken tüm beceriler halihazırda mevcutsa:
> `[Bilgi] Görev için mevcut "<beceri-adi>" skili devrede, ek kuruluma ihtiyaç duyulmadı.`

## 3. Aşama: Prompt Optimizasyonu (prompt-optimizer)
- Kurulan yeni beceriler ve devredeki mevcut becerilerin `SKILL.md` kuralları okunur.
- **`prompt-optimizer`** bu kuralları sentezler; Antigravity mimarisine (Flutter, Flame, Riverpod, TDD, Neo-Brutalism vb.) tam uyumlu, adım adım icra edilebilir **Nihai Operasyonel Prompt** üretir.

## 4. Aşama: Nihai Çıktı Sunumu
Kullanıcıya tek seferde şu formatla sunulur:
1. Kurulum / Durum Bilgisi (`"... skili kuruldu"`)
2. Tek bir fenced code block içinde **Nihai Optimize Edilmiş Prompt**
3. *"Bu optimize edilmiş prompt ile geliştirmeyi başlatmamı onaylıyor musunuz?"* sorusu.
