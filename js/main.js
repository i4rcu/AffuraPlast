/* ============================================================
   Affura Plast v2 — etkileşim + hafif animasyon
   Ağır kütüphane yok. IntersectionObserver reveal + sayaç.
   prefers-reduced-motion'da tüm hareket kapanır.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("mobileMenu");
  var toTop = document.querySelector(".to-top");
  var progress = document.querySelector(".scroll-progress span");

  /* ---------- Mobil menü ---------- */
  function closeMenu() {
    menu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* ---------- Çapa linkleri (native smooth) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- Scroll durumu (rAF ile tekil) ---------- */
  var maxScroll = 1;
  function measure() { maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle("scrolled", y > 24);
      toTop.classList.toggle("show", y > 640);
      if (progress) progress.style.transform = "scaleX(" + Math.min(y / maxScroll, 1) + ")";
      ticking = false;
    });
  }
  measure();
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("load", measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Reveal animasyonları ---------- */
  var animEls = document.querySelectorAll("[data-anim]");
  if (reduce || !("IntersectionObserver" in window)) {
    animEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    animEls.forEach(function (el) { io.observe(el); });

    /* Hero her zaman görünür alandadır; maskelenmiş başlık satırları kendi
       overflow:hidden kabıyla kırpıldığından IO tetiklenmez — elle aç. */
    requestAnimationFrame(function () {
      document.querySelectorAll(".hero [data-anim]").forEach(function (el) {
        el.classList.add("in"); io.unobserve(el);
      });
    });
  }

  /* ---------- Sayaçlar ---------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var start = null, dur = 1500;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".counter");
  if (reduce || !("IntersectionObserver" in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count") || "0"; });
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Aktif bölüm (scroll-spy) ---------- */
  var navLinks = document.querySelectorAll(".nav-links a");
  if ("IntersectionObserver" in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Yıl ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Teklif formu (mailto) ---------- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lang = document.documentElement.lang || "ar";
      var dict = (window.I18N && I18N[lang]) ? I18N[lang] : I18N.ar;
      var name = document.getElementById("f-name").value.trim();
      var email = document.getElementById("f-email").value.trim();
      var phone = document.getElementById("f-phone").value.trim();
      var msg = document.getElementById("f-msg").value.trim();
      var body = name + "\n" + email + (phone ? "\n" + phone : "") + "\n\n" + msg;
      window.location.href = "mailto:info@affuraplast.com?subject=" +
        encodeURIComponent(dict.contact.mailSubject) + "&body=" + encodeURIComponent(body);
    });
  }
});
