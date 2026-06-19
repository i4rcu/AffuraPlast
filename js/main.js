/* ============================================================
   Affura Plast v3 — etkileşim + hafif animasyon
   IntersectionObserver reveal + sayaç + SSS akordeon. Ağır lib yok.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  var mmenu = document.getElementById("mmenu");
  var totop = document.querySelector(".totop");
  var prog = document.querySelector(".sprog span");

  function closeMenu() {
    mmenu.classList.remove("open"); burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false"); mmenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function () {
    var o = mmenu.classList.toggle("open");
    burger.classList.toggle("open", o); burger.setAttribute("aria-expanded", String(o));
    mmenu.setAttribute("aria-hidden", String(!o)); document.body.style.overflow = o ? "hidden" : "";
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var el = document.querySelector(id); if (!el) return;
      e.preventDefault(); closeMenu();
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  var max = 1;
  function measure() { max = Math.max(document.documentElement.scrollHeight - innerHeight, 1); }
  var tick = false;
  function onScroll() {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      var y = scrollY || document.documentElement.scrollTop;
      nav.classList.toggle("scrolled", y > 22);
      totop.classList.toggle("show", y > 640);
      if (prog) prog.style.transform = "scaleX(" + Math.min(y / max, 1) + ")";
      tick = false;
    });
  }
  measure(); addEventListener("resize", measure, { passive: true }); addEventListener("load", measure);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  totop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* reveal */
  var els = document.querySelectorAll("[data-a]");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
    requestAnimationFrame(function () { document.querySelectorAll(".hero [data-a]").forEach(function (el) { el.classList.add("in"); io.unobserve(el); }); });
  }

  /* counters */
  function run(el) {
    var to = +el.getAttribute("data-c") || 0;
    if (reduce) { el.textContent = String(to); return; }
    var s = null;
    function f(t) { if (s === null) s = t; var p = Math.min((t - s) / 1500, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  var cts = document.querySelectorAll(".ct");
  if (reduce || !("IntersectionObserver" in window)) {
    cts.forEach(function (el) { el.textContent = el.getAttribute("data-c") || "0"; });
  } else {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    cts.forEach(function (el) { cio.observe(el); });
  }

  /* FAQ — tek seferde bir açık */
  var qas = document.querySelectorAll(".qa");
  qas.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* scroll-spy */
  var links = document.querySelectorAll(".nav-l a");
  if ("IntersectionObserver" in window && links.length) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; var id = "#" + e.target.id;
        links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  var yEl = document.getElementById("year"); if (yEl) yEl.textContent = String(new Date().getFullYear());

  var form = document.getElementById("quote-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var lang = document.documentElement.lang || "ar";
    var d = (window.I18N && I18N[lang]) ? I18N[lang] : I18N.ar;
    var v = function (id) { var n = document.getElementById(id); return n ? n.value.trim() : ""; };
    var body = v("f-name") + "\n" + v("f-sector") + "\n" + v("f-email") + (v("f-phone") ? "\n" + v("f-phone") : "") + "\n\n" + v("f-msg");
    location.href = "mailto:info@affuraplast.com?subject=" + encodeURIComponent(d.contact.mailSubject) + "&body=" + encodeURIComponent(body);
  });
});
