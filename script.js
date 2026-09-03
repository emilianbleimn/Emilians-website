/* =========================================================
   EB Solutions — Interaktivität  ·  VIP Schwarz & Gold
   ========================================================= */
(function () {
  'use strict';

  /* ---- Intro / Logo-Splash bei jedem Laden ---- */
  (function () {
    var pl = document.getElementById('preloader');
    if (!pl) { return; }
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var minVisible = reduced ? 300 : 1100;
    /* Ab Navigationsstart messen, nicht ab Skriptstart. Sonst wird das Intro
       auf langsamen Verbindungen doppelt so lange gezeigt wie geplant. */
    function elapsed() {
      return (window.performance && performance.now) ? performance.now() : 0;
    }
    var done = false;
    function hide() {
      if (done) { return; }
      done = true;
      pl.classList.add('hide');
      setTimeout(function () { pl.style.display = 'none'; }, 650);
    }
    function schedule() { setTimeout(hide, Math.max(0, minVisible - elapsed())); }
    if (document.readyState === 'complete') { schedule(); }
    else { window.addEventListener('load', schedule); }
    setTimeout(hide, 3500); // Sicherheitsnetz, falls 'load' ausbleibt
  })();

  /* ---- Konfiguration ---- */
  var CONTACT_EMAIL = 'emilianbleimn@gmail.com';
  var PLACEHOLDER_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

  /* ---- Jahr im Footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---- Theme-Umschalter (Light/Dark) ---- */
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function syncThemeUI(t) {
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', t === 'light' ? 'Zu Dark Mode wechseln' : 'Zu Light Mode wechseln');
    }
    if (themeMeta) { themeMeta.setAttribute('content', t === 'light' ? '#FBF9F4' : '#0A0A0B'); }
  }
  syncThemeUI(currentTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('eb-theme', next); } catch (e) {}
      syncThemeUI(next);
    });
  }

  /* ---- Header-Schatten & Back-to-top ---- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) { header.classList.toggle('scrolled', y > 8); }
    if (toTop) { toTop.classList.toggle('show', y > 600); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobiles Menü ---- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  function closeNav() {
    if (!nav || !navToggle) { return; }
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
  }
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeNav(); } });
  }

  /* ---- Back to top ---- */
  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---- Scroll-Reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Formulare: Web3Forms + mailto-Fallback ---- */
  function setStatus(form, message, type) {
    var status = form.querySelector('.form-status');
    if (!status) { return; }
    status.textContent = message;
    status.className = 'form-status' + (type ? ' ' + type : '');
  }
  function buildMailto(form) {
    var lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (!el.name) { return; }
      if (['access_key', 'subject', 'from_name', 'botcheck', 'redirect'].indexOf(el.name) !== -1) { return; }
      if (el.type === 'checkbox' && !el.value) { return; }
      var val = (el.value || '').trim();
      if (!val) { return; }
      lines.push(el.name + ': ' + val);
    });
    var subject = form.getAttribute('data-subject') || 'Anfrage über EB Solutions';
    return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  }
  function handleSubmit(form) {
    return function (e) {
      e.preventDefault();
      var hp = form.querySelector('input[name="botcheck"]');
      if (hp && hp.checked) { return; }

      var keyField = form.querySelector('input[name="access_key"]');
      var key = keyField ? keyField.value.trim() : '';
      if (!key || key === PLACEHOLDER_KEY) {
        setStatus(form, 'Dein E-Mail-Programm öffnet sich – bitte die Nachricht dort absenden.', 'info');
        window.location.href = buildMailto(form);
        return;
      }

      form.classList.add('is-sending');
      setStatus(form, 'Wird gesendet …', 'info');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, json: j }; }); })
        .then(function (result) {
          form.classList.remove('is-sending');
          if (result.ok && result.json.success) {
            setStatus(form, '✓ Vielen Dank! Deine Nachricht ist angekommen. Ich melde mich innerhalb von 24 Stunden.', 'ok');
            form.reset();
          } else {
            setStatus(form, 'Sende-Dienst nicht erreichbar – dein E-Mail-Programm öffnet sich als Alternative.', 'info');
            window.location.href = buildMailto(form);
          }
        })
        .catch(function () {
          form.classList.remove('is-sending');
          setStatus(form, 'Verbindung fehlgeschlagen – dein E-Mail-Programm öffnet sich als Alternative.', 'info');
          window.location.href = buildMailto(form);
        });
    };
  }
  document.querySelectorAll('.js-form').forEach(function (form) {
    form.addEventListener('submit', handleSubmit(form));
  });

  /* ---- Reduced-Motion ---- */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Zahlen hochzählen ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    function tick(ts) {
      if (start === null) { start = ts; }
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (!prefersReduced && 'IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Cursor-Spotlight im Hero ---- */
  var hero = document.getElementById('start');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && finePointer && !prefersReduced) {
    var raf = null, mx = 0, my = 0;
    function applySpot() {
      raf = null;
      hero.style.setProperty('--mx', mx + 'px');
      hero.style.setProperty('--my', my + 'px');
    }
    hero.addEventListener('mousemove', function (ev) {
      var r = hero.getBoundingClientRect();
      mx = ev.clientX - r.left - 270;
      my = ev.clientY - r.top - 270;
      if (!raf) { raf = requestAnimationFrame(applySpot); }
    });
  }

})();
