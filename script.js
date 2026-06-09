/* =========================================================
   EB Web Studio — Interaktivität
   ========================================================= */
(function () {
  'use strict';

  /* ---- Konfiguration ---- */
  // Deine Kontakt-E-Mail (wird für den mailto-Fallback genutzt)
  var CONTACT_EMAIL = 'emilianbleimn@gmail.com';
  // Platzhalter-Erkennung: Solange kein echter Web3Forms-Key eingetragen ist,
  // nutzen die Formulare automatisch den mailto-Fallback.
  var PLACEHOLDER_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

  /* ---- Jahr im Footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---- Header: Schatten beim Scrollen ---- */
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
    // Beim Klick auf einen Link schließen
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    // Schließen mit ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });
  }

  /* ---- Back to top ---- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll-Reveal Animation ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
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

  // Baut aus den sichtbaren Feldern einen lesbaren E-Mail-Text (für mailto)
  function buildMailto(form) {
    var lines = [];
    var fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(function (el) {
      if (!el.name) { return; }
      // technische / versteckte Felder überspringen
      if (['access_key', 'subject', 'from_name', 'botcheck', 'redirect'].indexOf(el.name) !== -1) { return; }
      if (el.type === 'checkbox' && !el.value) { return; }
      var val = (el.value || '').trim();
      if (!val) { return; }
      lines.push(el.name + ': ' + val);
    });
    var subject = form.getAttribute('data-subject') || 'Anfrage über EB Web Studio';
    var body = lines.join('\n');
    return 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function handleSubmit(form) {
    return function (e) {
      e.preventDefault();

      // Honeypot: von Bots ausgefüllt -> still abbrechen
      var hp = form.querySelector('input[name="botcheck"]');
      if (hp && hp.checked) { return; }

      var keyField = form.querySelector('input[name="access_key"]');
      var key = keyField ? keyField.value.trim() : '';
      var usePlaceholderFallback = (!key || key === PLACEHOLDER_KEY);

      // ---- Fallback: kein echter Key -> direkt mailto ----
      if (usePlaceholderFallback) {
        setStatus(form, 'Dein E-Mail-Programm öffnet sich – bitte die Nachricht dort absenden.', 'info');
        window.location.href = buildMailto(form);
        return;
      }

      // ---- Hauptweg: Web3Forms (AJAX) ----
      form.classList.add('is-sending');
      setStatus(form, 'Wird gesendet …', 'info');

      var data = new FormData(form);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, json: j }; }); })
        .then(function (result) {
          form.classList.remove('is-sending');
          if (result.ok && result.json.success) {
            setStatus(form, '✅ Vielen Dank! Deine Nachricht ist angekommen. Ich melde mich innerhalb von 24 Stunden.', 'ok');
            form.reset();
          } else {
            // Fallback bei API-Fehler
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

  /* ---- Reduced-Motion Präferenz ---- */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Sanfte Maus-Parallaxe im Hero ---- */
  var hero = document.getElementById('start');
  var finePointer = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && finePointer && !prefersReduced) {
    var layers = [
      { el: hero.querySelector('.hero-sun'), depth: 16 },
      { el: hero.querySelector('.palm-l'), depth: 26 },
      { el: hero.querySelector('.palm-r'), depth: -22 }
    ].filter(function (l) { return l.el; });
    var raf = null, mx = 0, my = 0;
    function applyParallax() {
      raf = null;
      layers.forEach(function (l) {
        l.el.style.setProperty('--px', (mx * l.depth).toFixed(1) + 'px');
        l.el.style.setProperty('--py', (my * l.depth).toFixed(1) + 'px');
      });
    }
    hero.addEventListener('mousemove', function (ev) {
      var r = hero.getBoundingClientRect();
      mx = (ev.clientX - r.left) / r.width - 0.5;
      my = (ev.clientY - r.top) / r.height - 0.5;
      if (!raf) { raf = requestAnimationFrame(applyParallax); }
    });
    hero.addEventListener('mouseleave', function () {
      mx = 0; my = 0;
      if (!raf) { raf = requestAnimationFrame(applyParallax); }
    });
  }

})();
