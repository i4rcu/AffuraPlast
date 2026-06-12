# Affura Plast Web Sitesi Yapım Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Affura Plast için tek sayfalık, üç dilli (TR/EN/AR + RTL), yoğun animasyonlu, aydınlık-doğal temalı tanıtım sitesi.

**Architecture:** Derleme adımı olmayan statik site. Tek `index.html` tüm bölümleri içerir; metinler `data-i18n` öznitelikleri ile işaretlenir ve `js/i18n.js` sözlüğünden doldurulur. Animasyonlar `js/main.js` içinde GSAP + ScrollTrigger + Lenis (CDN) ile kurulur; CDN yüklenmezse site animasyonsuz ama tam okunur kalır.

**Tech Stack:** HTML5, CSS3 (custom properties + logical properties for RTL), vanilla JS, GSAP 3 + ScrollTrigger, Lenis, Google Fonts (Latin + Arapça destekli aile).

**Doğrulama yöntemi:** Bu projede birim test altyapısı yok (statik tanıtım sitesi — YAGNI). Her görevin doğrulaması: `python -m http.server 8420` ile yerel sunucu + tarayıcıda görsel kontrol; JS hataları için konsol temiz olmalı.

---

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `index.html` | Tüm bölümlerin işaretlemesi, CDN script etiketleri |
| `css/style.css` | Tasarım tokenları, bölüm stilleri, RTL ve mobil kurallar |
| `js/i18n.js` | TR/EN/AR çeviri sözlüğü, dil değiştirme + RTL + localStorage |
| `js/main.js` | Lenis, GSAP animasyonları, menü, marquee, sayaçlar, form |

## Tasarım Tokenları

```css
:root {
  --bg: #FAF8F3;          /* krem zemin */
  --bg-alt: #F1EEE6;      /* açık kum */
  --ink: #1A2E22;         /* koyu yeşil-siyah metin */
  --green-deep: #1B4332;  /* derin orman yeşili */
  --green: #2D6A4F;       /* ana yeşil */
  --leaf: #74C69D;        /* taze yaprak vurgusu */
  --lime: #B7E4C7;        /* açık vurgu */
  --radius: 20px;
  --font-display: "Sora", "Cairo", sans-serif;
  --font-body: "Inter", "Cairo", sans-serif;
}
```

Arapça seçildiğinde `html[dir="rtl"]` altında `--font-display/--font-body` "Cairo"ya döner; düzen `margin-inline`, `padding-inline`, `inset-inline` gibi mantıksal özelliklerle kendiliğinden aynalanır.

---

### Task 1: İskelet + tasarım sistemi + üst menü

**Files:** Create: `index.html`, `css/style.css`, `js/main.js`, `js/i18n.js` (boş iskelet)

- [ ] `index.html`: `<head>` (meta, Google Fonts: Sora + Inter + Cairo; GSAP, ScrollTrigger, Lenis CDN defer), gövdede `<header class="nav">` (logo "AFFURA PLAST", bölüm linkleri, TR/EN/AR dil butonları, "Teklif Al" CTA, hamburger) ve boş `<main>` bölüm placeholder'ları (`#hero #about #products #sustainability #stats #process #contact`).
- [ ] `css/style.css`: tokenlar, reset, tipografi ölçeği, buton stilleri (`.btn-primary`, `.btn-ghost`), yapışkan cam menü (`backdrop-filter: blur`), mobil hamburger paneli.
- [ ] Doğrula: `python -m http.server 8420` → menü görünür, konsol temiz.
- [ ] Commit: `feat: iskelet, tasarım sistemi ve üst menü`

### Task 2: i18n sistemi (TR/EN/AR + RTL)

**Files:** Create/Modify: `js/i18n.js`, `index.html`, `css/style.css`

- [ ] `js/i18n.js`: `const I18N = { tr: {...}, en: {...}, ar: {...} }` — site genelindeki TÜM metin anahtarları (nav, hero, bölüm başlıkları, kartlar, form, footer). `setLang(lang)`: `data-i18n`/`data-i18n-attr` elemanlarını doldurur, `document.documentElement.lang/dir` günceller, `localStorage('affura-lang')` kaydeder.
- [ ] İçerik gerçeklere dayanır: 2016 Gaziantep kuruluş, baskılı/baskısız PE poşet, gıda ambalajı, stand-up pouch, geri dönüştürülmüş PE, grafik tasarım; iletişim +90 342 290 12 94 / info@affuraplast.com.
- [ ] `html[dir="rtl"]` CSS kuralları (font değişimi, marquee yönü).
- [ ] Doğrula: üç dil butonu da metinleri ve yönü değiştiriyor; yenilemede seçim hatırlanıyor.
- [ ] Commit: `feat: üç dilli i18n + RTL`

### Task 3: Hero bölümü

**Files:** Modify: `index.html`, `css/style.css`, `js/main.js`

- [ ] Tam ekran hero: büyük display başlık (satır satır maskeyle yukarı kayan reveal), alt metin, iki CTA, sağda katmanlı görsel kompozisyon (Unsplash ambalaj/doğa fotoğrafı + süzülen SVG yaprak/halka dekorlar), aşağı kaydırma işareti.
- [ ] `js/main.js`: Lenis kurulumu, GSAP yükleme kontrolü (`if (window.gsap)`), hero giriş timeline'ı, dekor öğelerinde sonsuz `yoyo` süzülme, mouse paralaks.
- [ ] Doğrula: yükleme animasyonu akıcı; `prefers-reduced-motion` ile animasyonlar kapalı.
- [ ] Commit: `feat: hero bölümü ve giriş animasyonları`

### Task 4: Marquee + Hakkımızda

**Files:** Modify: `index.html`, `css/style.css`, `js/main.js`

- [ ] Marquee: anahtar kelimeler (Gıda Ambalajı • Stand-up Pouch • Geri Dönüşüm • Baskılı Poşet …) CSS keyframe ile sürekli akar; RTL'de yön tersine döner; içerik iki kez tekrarlanır (kesintisiz döngü).
- [ ] Hakkımızda: iki kolon — solda clip-path perde reveal'lı fotoğraf + "2016" yıl rozeti, sağda başlık/metin/misyon-vizyon kartları; ScrollTrigger ile sıralı fade-up.
- [ ] Doğrula: kaydırınca animasyonlar tetikleniyor.
- [ ] Commit: `feat: marquee ve hakkımızda`

### Task 5: Ürünler vitrini

**Files:** Modify: `index.html`, `css/style.css`, `js/main.js`

- [ ] 6 kart: Baskılı PE Poşet, Baskısız PE Poşet, Gıda Ambalajı, Stand-up Pouch, Geri Dönüştürülmüş PE, Grafik Tasarım. Her kartta SVG ikon/fotoğraf, başlık, açıklama, ok linki.
- [ ] ScrollTrigger stagger giriş; hover'da 3D tilt (JS `mousemove` transform) + yeşil parıltı.
- [ ] Doğrula: kartlar üç dilde de taşmadan görünüyor.
- [ ] Commit: `feat: ürünler vitrini`

### Task 6: Sürdürülebilirlik + Rakamlar

**Files:** Modify: `index.html`, `css/style.css`, `js/main.js`

- [ ] Sürdürülebilirlik: `--green-deep` zeminli kontrast bölüm; büyük açık renk başlık, çevre mesajı, 3 ikonlu özellik (geri dönüşüm, doğa dostu hammadde, atık azaltma); arka planda hafif paralaks dekor.
- [ ] Rakamlar: 4 sayaç (`data-count` özniteliğinden okunur → patron kolayca değiştirir): 10+ yıl deneyim, 6 ürün grubu, 3 dilde hizmet, %100 geri dönüştürülebilir hedef. ScrollTrigger görünce 0'dan sayar.
- [ ] Doğrula: sayaçlar bir kez tetikleniyor, RTL'de düzgün.
- [ ] Commit: `feat: sürdürülebilirlik ve sayaçlar`

### Task 7: Süreç + İletişim/Teklif + Footer

**Files:** Modify: `index.html`, `css/style.css`, `js/main.js`

- [ ] Süreç: 4 adım (Tasarım → Üretim → Baskı → Teslimat) yatay zaman çizgisi; bağlantı çizgisi `stroke-dashoffset` ile çizilir, adımlar stagger ile belirir.
- [ ] İletişim: solda bilgi kartı (telefon `tel:`, e-posta `mailto:`, adres Gaziantep, sosyal linkler), sağda teklif formu (ad, e-posta, telefon, mesaj) — submit `mailto:info@affuraplast.com` bağlantısı kurar; inputlarda odak animasyonu.
- [ ] Footer: logo, kısa açıklama, bölüm linkleri, telif satırı.
- [ ] Doğrula: form mail istemcisini açıyor, linkler kayarak gidiyor.
- [ ] Commit: `feat: süreç, iletişim ve footer`

### Task 8: Cila + duyarlılık + son doğrulama

**Files:** Modify: tümü

- [ ] Mobil (≤900px / ≤600px) düzen geçişleri; hamburger menü çalışır; animasyon yoğunluğu mobilde hafifletilir.
- [ ] Aktif bölüm menüde vurgulanır (ScrollTrigger ile scroll-spy); "başa dön" butonu.
- [ ] Üç dilde tam tur kontrol: taşma, RTL aynalaması, konsol hatası yok.
- [ ] Commit: `feat: duyarlı tasarım ve son cila`
