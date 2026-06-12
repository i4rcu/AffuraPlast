# Affura Plast Web Sitesi Yeniden Tasarımı — Tasarım Belgesi

**Tarih:** 2026-06-12
**Durum:** Kullanıcı tarafından onaylandı

## Amaç

Affura Plast'ın (https://affuraplast.com) mevcut WordPress sitesinin yerini alacak; şık, modern, sade ama yoğun animasyonlu, tek sayfalık, üç dilli (TR/EN/AR) bir tanıtım sitesi.

## Şirket Bağlamı

- **Şirket:** Affura Plast (Afoura Company), 2016'da kuruldu, Gaziantep.
- **Faaliyet:** Baskılı/baskısız polietilen poşetler, gıda ve gıda dışı ambalaj, stand-up pouch, geri dönüştürülmüş polietilen, grafik tasarım hizmeti.
- **Değerler:** Çevre dostu üretim ("Doğa Dostu"), uluslararası standartlar, rekabetçi fiyat.
- **İletişim:** +90 342 290 12 94 · info@affuraplast.com · Instagram/Facebook @affuraplast.tr

## Sektör Araştırması Bulguları

Amcor, Mondi, Huhtamaki ve Korozo incelemesinden çıkan ortak desen:
hero (net misyon mesajı) → ürün kategorileri vitrini → sürdürülebilirlik vurgusu →
sayılarla şirket → haberler → güçlü iletişim CTA'sı. Ton: profesyonel ama erişilebilir,
sürdürülebilirlik merkezi tema.

## Görsel Kimlik: "Doğa Dostu Premium"

- **Zemin:** Krem/beyaz (aydınlık tema).
- **Renkler:** Derin orman yeşili (ana), taze yaprak yeşili (vurgu), krem/kum tonları.
- **Tipografi:** Modern, büyük ölçekli başlıklar; okunaklı gövde metni. Latin + Arapça
  glifleri destekleyen Google Fonts ailesi.
- **His:** Sade, bol beyaz alan, ama her kaydırmada hareket.

## Sayfa Yapısı (Tek Sayfa)

1. **Üst menü** — yapışkan, cam (glassmorphism) efektli; logo, bölüm linkleri,
   dil değiştirici (TR/EN/AR), "Teklif Al" CTA butonu. Mobilde hamburger menü.
2. **Hero** — "Doğaya Saygılı Ambalaj Çözümleri" başlığı; harf/kelime bazlı giriş
   animasyonu, süzülen dekoratif öğeler, paralaks, kaydırma işareti.
3. **Marquee şerit** — ürün anahtar kelimeleri sürekli akar.
4. **Hakkımızda** — 2016'dan beri Gaziantep; misyon/vizyon; görsel reveal efekti.
5. **Ürünler** — kategori kartları: baskılı PE poşet, baskısız PE poşet, gıda
   ambalajı, stand-up pouch, geri dönüştürülmüş PE, grafik tasarım. 3D hover.
6. **Sürdürülebilirlik** — koyu yeşil kontrast bölüm; çevre mesajı, ikon animasyonları.
7. **Rakamlarla Affura** — sayaç animasyonları (10+ yıl deneyim vb.); rakamlar
   HTML'de kolayca düzenlenebilir `data-` öznitelikleriyle tutulur.
8. **Süreç** — Tasarım → Üretim → Baskı → Teslimat; adım adım çizgi animasyonu.
9. **Teklif Al / İletişim** — form (ad, e-posta, telefon, mesaj; mailto ile gönderim)
   + gerçek iletişim bilgileri.
10. **Footer** — linkler, sosyal medya, telif satırı.

## Animasyon Sistemi

- **Lenis** ile yumuşak kaydırma.
- **GSAP + ScrollTrigger** (CDN) ile kaydırma tetiklemeli animasyonlar:
  başlık reveal'ları, görsel clip-path perde efektleri, paralaks katmanlar,
  sayaçlar, süreç çizgisi, bölüm geçişleri.
- Mikro etkileşimler: mıknatıs butonlar, kart 3D tilt, marquee.
- `prefers-reduced-motion` desteklenir (animasyonlar kapanır).

## Çok Dillilik (TR/EN/AR)

- Tek HTML; metinler `data-i18n` öznitelikleri + JS sözlüğü (`i18n.js`) ile değişir.
- Arapça seçilince `dir="rtl"` + CSS mantıksal özelliklerle tam RTL düzen.
- Seçim `localStorage`'da saklanır; varsayılan TR.

## Teknik Mimari

- **Yığın:** Saf HTML + CSS + vanilla JS. Derleme adımı yok; her hosting'e atılabilir.
- **Dosyalar:**
  - `index.html` — tüm bölümler
  - `css/style.css` — tasarım sistemi + bölüm stilleri + RTL kuralları
  - `js/main.js` — animasyonlar, menü, form
  - `js/i18n.js` — üç dilin çeviri sözlüğü + dil değiştirme mantığı
- **Kütüphaneler (CDN):** GSAP, ScrollTrigger, Lenis.
- **Görseller:** Unsplash stok fotoğraflar (ambalaj/üretim/doğa) + özel SVG öğeler.
  Daha sonra gerçek ürün fotoğraflarıyla değiştirmek tek satır iş.

## Hata Yönetimi / Kenar Durumlar

- CDN yüklenmezse sayfa animasyonsuz ama tamamen okunur kalır (progressive enhancement).
- Form, arka uç olmadığı için `mailto:` ile e-posta istemcisini açar.
- Mobil (≤768px) düzen: tek kolon, hamburger menü, hafifletilmiş animasyonlar.

## Başarı Ölçütleri

- Sayfa tarayıcıda akıcı çalışır (60fps hedef), üç dil + RTL doğru görünür.
- Sade/modern görünüm; sektör liderleriyle aynı bilgi mimarisi.
- Patrona sunulabilecek "vay" etkisi yaratan animasyon kalitesi.

## Kapsam Dışı (YAGNI)

- E-ticaret/sepet, blog altyapısı, CMS, gerçek form backend'i, SEO çok sayfalı yapı.
