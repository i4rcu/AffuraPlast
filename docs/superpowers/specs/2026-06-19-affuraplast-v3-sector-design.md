# Affura Plast v3 — "Sektörünü Anlayan Ambalaj" (Tasarım Belgesi)

**Tarih:** 2026-06-19
**Durum:** Kullanıcı onayladı. Önceki tüm taslaklardan (v1/v2/previews/v3-mockups) HİÇBİR
metin, bölüm veya görsel düzen tekrar kullanılmayacak — sıfırdan yeni içerik.

## Konumlandırma
**Sektör uzmanlığı.** Her sektörün ambalajı farklı bir problemi çözer
(kahve→aroma bariyeri, dondurulmuş→soğuk dayanımı, süt→tazelik, sos→sızdırmazlık).
Mesaj: **"تغليفٌ يفهم قطاعك"** (Sektörünü anlayan ambalaj).

## Yeni bölümler (eskiden hiçbiri yok)
1. **Hero** — "Sektörünü anlayan ambalaj"; alt metin sektör genişliği; CTA teklif/danışmanlık.
2. **القطاعات (Sektörler)** — 8 sektör kartı (kahve & sıcak içecek, süt ürünleri,
   dondurulmuş gıda, sos & konserve, unlu mamul, baharat & bakliyat, atıştırmalık,
   toz ürünler). Her kart: ikon + sektör + kısa söz + gerçek ürün görseli (varsa).
3. **التحدّي → الحل (Sektörün sorunu → çözümümüz)** — 4 öne çıkan sektör için
   ambalaj zorluğu ve çözümü (uzmanlık kanıtı). Örn. kahve: aroma kaçmasın → bariyerli
   çok katmanlı film + tek yönlü valf.
4. **خيارات التغليف (Ambalaj tipleri & teknikler)** — stand-up pouch, flow-wrap,
   shrink/çok'lu paket, laminasyon, rotogravür baskı, geri dönüştürülebilir/bariyer film.
5. **لماذا الخبرة مهمة (Neden uzmanlık önemli)** — manifesto + 3-4 rakam (sayaç).
6. **الأسئلة الشائعة (SSS)** — minimum sipariş, teslim süresi, tasarım desteği,
   numune, gıda güvenliği. Akordeon (aç/kapa).
7. **اطلب استشارة (Sektör danışmanlığı / teklif)** — form (mailto) + iletişim
   (Yaman Bey +90 531 032 17 70, Baraa Bey +90 530 060 40 33, info@affuraplast.com,
   Gaziantep). Sosyal: Instagram/Facebook @affuraplast.tr.
8. **Footer**.

## Görsel kimlik (yeni)
- Zemin: sıcak kum/fildişi `#F3EFE6`, daha derin kum `#EAE3D5`.
- Mürekkep: koyu yeşil-siyah `#14201A`; yumuşak `#5C6660`.
- Aksan: **zümrüt yeşili** `#0E7C5A` (canlı `#2DBB86`, koyu blok `#0A3D2E`).
- Marka moru `#702979` yalnızca logoda.
- Çizgi: `#DDD5C4`.
- Tipografi: Arapça **Tajawal**; Latin **Manrope**. Arapça em italik değil.

## Animasyon
- Hero giriş (kademeli), kaydırma reveal (IntersectionObserver `.in`),
  sektör kartı stagger + hover, sayaç, SSS akordeon, akan şerit (marquee),
  hareketli zümrüt gradyan vurgular. GPU-dostu transform/opacity. Lenis/ağır lib yok.
- `prefers-reduced-motion` tüm hareketi kapatır ve gizli içerikleri görünür yapar.

## Diller
- Arapça öncelikli (varsayılan), `dir=rtl`. i18n altyapısı (`data-i18n`).
- AR tam; TR + EN çevirileri eklenecek. `localStorage('affura-lang')`, `?lang=`.

## Teknik
- Saf HTML/CSS/JS, derleme yok. `index.html`, `css/style.css`, `js/i18n.js`, `js/main.js`
  TAMAMEN yeniden yazılır. Görseller `images/products/*.jpg`.
- Telefon numaraları `<bdi dir="ltr">`. GitHub Pages (i4rcu/AffuraPlast, main).

## Başarı ölçütü
Tamamen yeni metin + bölümler, sektör-uzmanlığı duruşu net; mobil kusursuz;
zengin ama akıcı animasyon; Arapça RTL doğru.

## Kapsam dışı (YAGNI)
E-ticaret, blog, CMS, gerçek form backend'i.
