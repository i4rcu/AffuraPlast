# Affura Plast Web Sitesi v2 — Sıfırdan Yeniden Tasarım (Tasarım Belgesi)

**Tarih:** 2026-06-19
**Durum:** Kullanıcı tarafından yön onaylandı

## Amaç

Mevcut site sıfırdan yeniden yazılacak. Kullanıcının mevcut siteyle ilgili
şikâyetleri: (1) fazla "şablon"/yapay duruyor, (2) düzen sıkıcı/durağan,
(3) animasyonlar zayıf. Öncelikler: **Arapça öncelikli (varsayılan dil)**,
**mobil kusursuz**, modern, animasyonlu, güzel.

## Tasarım Yönü: "Editöryel Lüks"

Aydınlık & ferah zemin + lüks/premium & cesur hava. Yüksek ambalaj markası
kataloğu hissi: bol boşluk, dev tipografi, asimetrik/editöryel düzen.

### Renk Paleti
- `--bg` sıcak fildişi/kemik: `#F6F2EA`
- `--bg-2` daha derin kum (alternatif bölümler): `#EDE6D8`
- `--ink` sıcak neredeyse-siyah: `#1A1613`
- `--ink-soft`: `#6E645A`
- `--accent` marka moru: `#702979`
- `--accent-deep` (büyük koyu bloklar): `#3F1545`
- `--accent-bright` (vurgular/hover): `#9B3FA8`
- `--line` ince sıcak çizgi: `#E3DBCD`
- Tek canlı vurgu = mor. Cesurca kullanılır (dev başlık vurguları, tam-genişlik
  koyu mor bölüm, butonlar).

### Tipografi
- **Arapça başlık (kahraman):** Reem Kufi (geometrik, premium, modern)
- **Latin başlık:** Fraunces (karakterli serif)
- **Gövde (tüm diller):** Readex Pro (Latin + Arapça kapsar, temiz)
- Latin metin/etiketlerde ikincil olarak Archivo gerekebilir; aksi halde Readex.
- Premium his "dev boyut + ağırlık kontrastı" ile kurulur, dekoratif font yığını ile değil.

## Bilgi Mimarisi (Tek Sayfa)

1. **Üst bar** — sabit; saydam → kaydırınca cam/katı. Logo, bölüm linkleri,
   dil değiştirici (ع / TR / EN), "İletişim/Teklif" CTA. Mobilde hamburger →
   tam ekran kaplama menü (büyük dokunma hedefleri).
2. **Hero** — tam ekran sinematik. Dev Arapça başlık ("نُنتج التغليف لكل منتج")
   harf/satır bazlı giriş animasyonu; alt metin; iki CTA; büyük ürün görseli
   renk bloğu arkasında, hafif paralaks; kaydırma işareti.
3. **Statement marquee** — kalın, akan kapasite kelimeleri şeridi.
4. **Ürün vitrini (yatay kaydırma)** — gerçek ambalaj fotoğrafları yan yana,
   sinematik kartlar; `scroll-snap` ile (mobilde parmakla kaydırılır, JS yok).
5. **Sabit (sticky) kapasite sahnesi** — kaydırdıkça büyük ifadeler/kategoriler
   belirir; "tek çatı altında sınırsız ürün" mesajı.
6. **Hakkımızda** — editöryel, asimetrik; dev "2016", kısa hikâye, misyon/vizyon.
7. **Rakamlar** — dev animasyonlu sayaçlar (IntersectionObserver, tek sefer).
8. **Kalite/Sürdürülebilirlik** — tam genişlik koyu mor (`--accent-deep`) bölüm,
   cesur kontrast.
9. **Süreç** — 4 adım (Tasarım → Üretim → Baskı → Teslimat), dinamik reveal.
10. **İletişim** — güçlü CTA, form (mailto), iki yetkili (Yaman Bey
    +90 531 032 17 70, Baraa Bey +90 530 060 40 33), e-posta
    info@affuraplast.com, adres Gaziantep, sosyal (Instagram/Facebook).
11. **Footer**.

## Animasyon Sistemi (güçlü AMA akıcı — kasma yok)

Daha önce kasmaya yol açan Lenis ve ağır blur **kullanılmayacak**. Ağır JS
kütüphanesi yok (GSAP yok).

- **Giriş/hero:** saf CSS `@keyframes` + `animation-delay` ile kademeli giriş.
- **Bölüm reveal'ları:** küçük IntersectionObserver bir `.in` sınıfı ekler;
  geçişler CSS `transform`/`opacity` (GPU-dostu, tek sefer).
- **Yatay ürün vitrini:** native `scroll-snap` (dokunmatik akıcı, JS yok).
- **Sticky sahne:** CSS `position: sticky`.
- **İlerleme/paralaks zenginleştirme:** destekleyen tarayıcılarda CSS
  **scroll-driven animations** (`animation-timeline: view()/scroll()`) —
  ana iş parçacığını meşgul etmez; desteklenmeyen yerde sorunsuz görünür (no-op).
- **Sayaçlar:** IntersectionObserver + tek `requestAnimationFrame` döngüsü.
- `prefers-reduced-motion: reduce` → tüm animasyonlar kapanır.

## Çok Dillilik (AR varsayılan)

- `js/i18n.js` sözlüğü; `data-i18n` / `data-i18n-ph` öznitelikleri.
- Varsayılan dil **Arapça**; `localStorage('affura-lang')` hatırlar;
  `?lang=` parametresi geçersiz kılar.
- Arapça için `dir="rtl"`, CSS mantıksal özellikler (`margin-inline`,
  `inset-inline`, `padding-inline`) ile tam aynalama.
- Telefon numaraları `<bdi dir="ltr">` ile RTL'de doğru sırada.
- İsimler: TR "Yaman Bey/Baraa Bey", EN "Mr. Yaman/Mr. Baraa", AR "السيد يمان/السيد براء".

## Mobil (öncelik)

- Mobil-öncelikli CSS; tek kolon akış, dev başlıklar `clamp()` ile ölçeklenir.
- Büyük dokunma hedefleri (≥44px), tam ekran menü.
- Yatay ürün vitrini mobilde parmakla kaydırma + snap.
- Her bölüm mobil genişliklerinde (≤400px, ≤600px) elle ekran görüntüsüyle kontrol.
- RTL mobilde de kusursuz.

## Teknik Mimari

- Saf HTML + CSS + vanilla JS, derleme adımı yok (kolay yayın: GitHub Pages).
- Dosyalar (tamamı yeniden yazılır):
  - `index.html` — tüm bölümler, Google Fonts, script'ler
  - `css/style.css` — tasarım tokenları, bölümler, RTL, mobil, animasyonlar
  - `js/i18n.js` — TR/EN/AR sözlüğü + dil mantığı (varsayılan AR)
  - `js/main.js` — menü, IntersectionObserver reveal/sayaç, form (mailto), nav scroll durumu
- Görseller: mevcut `images/products/*.jpg` (gerçek Affuraplast ambalajları).
- Eski `docs/` spec/plan korunur; eski animasyon/Lenis kalıntısı kalmaz.

## Hata Yönetimi / Kenar Durumlar
- Görsel yüklenmezse `.no-img` ile degrade zemin (mevcut desen korunur).
- JS yoksa/CDN yoksa site tam okunur (progressive enhancement; reveal'lar
  başlangıçta görünür durumda olur).
- Form arka uç olmadan `mailto:` ile e-posta istemcisini açar.

## Başarı Ölçütleri
- Mobilde akıcı (kasma yok), Arapça RTL kusursuz, varsayılan dil Arapça.
- "Şablon değil" — özgün editöryel düzen, dev tipografi, dinamik bölümler.
- Güçlü ama pürüzsüz animasyonlar; üç dilde taşma yok.

## Kapsam Dışı (YAGNI)
- E-ticaret/sepet, blog, CMS, gerçek form backend'i, çok sayfalı SEO yapısı.
