/* ============================================================
   Affura Plast — hafif animasyon katmanı
   Yalnızca tek seferlik animasyonlar: giriş, reveal, sayaçlar.
   Sürekli çalışan efekt yok; kaydırma tarayıcıya ait (native).
   GSAP yüklenemezse site animasyonsuz ama tam çalışır.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var staticMode = params.has("static"); /* ?static → animasyonsuz (test/erişilebilirlik) */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || staticMode;
  var hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;

  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  var toTop = document.querySelector(".to-top");
  var progress = document.querySelector(".scroll-progress span");

  /* ---------- Çapa linkleri (native smooth scroll) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      nav.classList.remove("menu-open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Menü davranışı ---------- */
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("menu-open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  /* scrollHeight okuması pahalı: sadece boyut değişince hesapla */
  var maxScroll = 1;
  function measure() {
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle("scrolled", y > 30);
      toTop.classList.toggle("show", y > 700);
      if (progress) progress.style.transform = "scaleX(" + Math.min(y / maxScroll, 1) + ")";
      ticking = false;
    });
  }
  measure();
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("load", measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* Aktif bölüm vurgusu (scroll-spy) */
  var navLinks = document.querySelectorAll(".nav-links a");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = "#" + entry.target.id;
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("href") === id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });

  /* ---------- Yıl ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Teklif formu (mailto) ---------- */
  var form = document.getElementById("quote-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var lang = document.documentElement.lang || "tr";
    var dict = (window.I18N && I18N[lang]) ? I18N[lang] : I18N.tr;
    var name = document.getElementById("f-name").value.trim();
    var email = document.getElementById("f-email").value.trim();
    var phone = document.getElementById("f-phone").value.trim();
    var msg = document.getElementById("f-msg").value.trim();
    var body = name + "\n" + email + (phone ? "\n" + phone : "") + "\n\n" + msg;
    window.location.href = "mailto:info@affuraplast.com" +
      "?subject=" + encodeURIComponent(dict.contact.mailSubject) +
      "&body=" + encodeURIComponent(body);
  });

  /* Animasyon yoksa sayaçlar hedef değerlerini doğrudan gösterir */
  if (!hasGsap) {
    document.querySelectorAll(".counter").forEach(function (el) {
      el.textContent = el.getAttribute("data-count") || "0";
    });
  }

  /* ============================================================
     GSAP — yalnızca tek seferlik, hafif animasyonlar
     ============================================================ */
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    /* --- Hero giriş sahnesi (bir kez) --- */
    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".hero-kicker", { y: 20, opacity: 0, duration: 0.6 })
      .from(".hero-title .line > *", {
        yPercent: 115, duration: 0.9, stagger: 0.12, ease: "power4.out"
      }, "-=0.35")
      .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.45")
      .from(".hero-ctas .btn", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.4")
      .from(".hero-media", { scale: 0.92, opacity: 0, duration: 0.9 }, "-=0.75")
      .from(".hero-card, .hero-badge", { scale: 0.7, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.6)" }, "-=0.5");

    /* --- Bölüm reveal'ları (bir kez, kısa mesafe) --- */
    gsap.utils.toArray(".section").forEach(function (section) {
      var items = section.querySelectorAll(".reveal");
      if (!items.length) return;
      gsap.from(items, {
        y: 24, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.09,
        scrollTrigger: { trigger: section, start: "top 75%", once: true }
      });
    });

    /* --- Ürün kartları (bir kez) --- */
    gsap.from(".product-card", {
      y: 30, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.07,
      scrollTrigger: { trigger: ".product-grid", start: "top 82%", once: true }
    });

    /* --- Görsel perde (bir kez) --- */
    gsap.utils.toArray(".img-reveal").forEach(function (media) {
      gsap.fromTo(media,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut",
          scrollTrigger: { trigger: media, start: "top 78%", once: true }
        });
    });

    /* --- Sayaçlar (bir kez) --- */
    gsap.utils.toArray(".counter").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.6, ease: "power2.out",
        snap: { val: 1 },
        onUpdate: function () { el.textContent = String(Math.round(obj.val)); },
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* --- Süreç çizgisi (bir kez) --- */
    gsap.to(".steps-line-fill", {
      scaleX: 1, duration: 1.4, ease: "power2.inOut",
      scrollTrigger: { trigger: ".steps", start: "top 75%", once: true }
    });

    /* Sayfa bir #bölüm linkiyle açıldıysa tetikleyicileri tazele */
    if (window.location.hash) {
      var hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        requestAnimationFrame(function () {
          hashTarget.scrollIntoView();
          ScrollTrigger.refresh();
        });
      }
    }
  }
});
