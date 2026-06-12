/* ============================================================
   Affura Plast — animasyonlar ve etkileşimler
   GSAP / Lenis yüklenemezse site animasyonsuz ama tam çalışır.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var staticMode = params.has("static"); /* ?static → animasyonsuz (test/erişilebilirlik) */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || staticMode;
  var isTouch = window.matchMedia("(hover: none)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;

  /* ---------- Yumuşak kaydırma (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    } else {
      var el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* Çapa linkleri */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      nav.classList.remove("menu-open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Menü davranışı ---------- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  var toTop = document.querySelector(".to-top");
  var progress = document.querySelector(".scroll-progress span");

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("menu-open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 700);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.transform = "scaleX(" + Math.min(y / max, 1) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () { scrollToTarget(0); });

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
     GSAP ANİMASYONLARI
     ============================================================ */
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }

    /* --- Hero giriş sahnesi --- */
    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".nav-inner", { y: -30, opacity: 0, duration: 0.9 })
      .from(".hero-kicker", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-title .line > *", {
        yPercent: 115, duration: 1.1, stagger: 0.14, ease: "power4.out"
      }, "-=0.45")
      .from(".hero-sub", { y: 26, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-ctas .btn", { y: 22, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.55")
      .from(".hero-media", { scale: 0.86, opacity: 0, duration: 1.3, ease: "power3.out" }, "-=1.05")
      .from(".hero-card, .hero-badge", { scale: 0.6, opacity: 0, duration: 0.9, stagger: 0.15, ease: "back.out(1.8)" }, "-=0.7")
      .from(".leaf-decor, .ring-decor", { opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".scroll-cue", { opacity: 0, duration: 0.6 }, "-=0.3");

    /* --- Süzülen öğeler --- */
    gsap.utils.toArray(".float-soft").forEach(function (el, i) {
      gsap.to(el, {
        y: i % 2 ? 14 : -14,
        duration: 2.6 + i * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });

    /* --- Hero mouse paralaks --- */
    if (!isTouch) {
      var hero = document.querySelector(".hero");
      var layers = gsap.utils.toArray(".parallax-layer");
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        var cx = (e.clientX - r.left) / r.width - 0.5;
        var cy = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(function (layer) {
          var depth = parseFloat(layer.getAttribute("data-depth")) || 10;
          gsap.to(layer, { x: cx * depth, y: cy * depth, duration: 1, ease: "power2.out", overwrite: "auto" });
        });
      });
    }

    /* --- Hero paralaks (kaydırma) --- */
    gsap.to(".hero-visual", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* --- Genel reveal: bölüm içi sıralı giriş --- */
    gsap.utils.toArray(".section").forEach(function (section) {
      var items = section.querySelectorAll(".reveal");
      if (!items.length) return;
      gsap.from(items, {
        y: 44, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 72%", once: true }
      });
    });

    /* --- Ürün kartları stagger --- */
    gsap.from(".product-card", {
      y: 56, opacity: 0, duration: 0.95, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".product-grid", start: "top 80%", once: true }
    });

    /* --- Görsel perde (clip-path reveal) --- */
    gsap.utils.toArray(".img-reveal").forEach(function (media) {
      gsap.fromTo(media,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power4.inOut",
          scrollTrigger: { trigger: media, start: "top 78%", once: true }
        });
      var img = media.querySelector("img");
      if (img) {
        gsap.from(img, {
          scale: 1.25, duration: 1.6, ease: "power3.out",
          scrollTrigger: { trigger: media, start: "top 78%", once: true }
        });
      }
    });

    /* --- Sayaçlar --- */
    gsap.utils.toArray(".counter").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2, ease: "power2.out",
        snap: { val: 1 },
        onUpdate: function () { el.textContent = String(Math.round(obj.val)); },
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* --- Süreç çizgisi --- */
    gsap.to(".steps-line-fill", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 60%", scrub: 0.6 }
    });

    /* --- Marquee'ye hafif paralaks eğim --- */
    gsap.fromTo(".marquee", { rotate: -1.2 }, {
      rotate: 0.6, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true }
    });

    /* Sayfa bir #bölüm linkiyle açıldıysa: konumu koru ve
       tetikleyicileri tazele ki içerik gizli kalmasın */
    if (window.location.hash) {
      var hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        requestAnimationFrame(function () {
          if (lenis) lenis.scrollTo(hashTarget, { offset: -70, immediate: true, force: true });
          else hashTarget.scrollIntoView();
          ScrollTrigger.refresh();
        });
      }
    }
  }

  /* ---------- Kart 3D tilt + parıltı takibi ---------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        var rx = (0.5 - py) * 7;
        var ry = (px - 0.5) * 7;
        card.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
        card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        setTimeout(function () { card.style.transition = ""; }, 600);
      });
    });

    /* ---------- Mıknatıs butonlar ---------- */
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px, " + y * 0.3 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
        btn.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        setTimeout(function () { btn.style.transition = ""; }, 500);
      });
    });
  }
});
