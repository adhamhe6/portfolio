(function () {
  'use strict';

  var root = document.documentElement;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var EMAIL = 'adhamdev9@gmail.com';

  /* ---------- Toast ---------- */
  var toastEl = document.querySelector('.toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }

  function copyEmail(email) {
    email = email || EMAIL;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(
        function () { toast('Email copied: ' + email); },
        function () { toast(email); }
      );
    } else {
      toast(email);
    }
  }

  /* ---------- Theme ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return darkQuery.matches ? 'dark' : 'light';
  }
  function updateThemeLabel() {
    if (!themeToggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateThemeLabel();
  }
  if (themeToggle) {
    updateThemeLabel();
    themeToggle.addEventListener('click', toggleTheme);
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', updateThemeLabel);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  function setNav(open) {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('is-open', open);
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('is-open') && !e.target.closest('.nav')) setNav(false);
    });
  }

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Back to top ---------- */
  document.querySelectorAll('[data-back-to-top]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var brand = document.querySelector('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Copy email buttons ---------- */
  document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
    btn.addEventListener('click', function () { copyEmail(btn.getAttribute('data-copy-email')); });
  });

  /* ---------- Diagram: honour reduced motion ---------- */
  var system = document.querySelector('svg.system');
  if (system && system.pauseAnimations && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    system.pauseAnimations();
  }

  /* ---------- Local time (contact page) ---------- */
  var timeEl = document.querySelector('[data-local-time]');
  if (timeEl) {
    var renderTime = function () {
      try {
        var t = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: false
        }).format(new Date());
        timeEl.textContent = t + ' in Cairo';
      } catch (e) { timeEl.textContent = 'Cairo time'; }
    };
    renderTime();
    setInterval(renderTime, 30000);
  }

  /* ---------- Modifier key labels ---------- */
  document.querySelectorAll('[data-mod-key]').forEach(function (k) {
    k.textContent = isMac ? '⌘ K' : 'Ctrl K';
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* ---------- Command palette ---------- */
  var palette = document.querySelector('.palette');
  if (!palette || typeof palette.showModal !== 'function') {
    document.querySelectorAll('[data-palette-open]').forEach(function (b) { b.hidden = true; });
    document.querySelectorAll('.footer-hint').forEach(function (b) { b.hidden = true; });
    return;
  }

  var input = palette.querySelector('.palette-input');
  var items = Array.prototype.slice.call(palette.querySelectorAll('.palette-item'));
  var groups = Array.prototype.slice.call(palette.querySelectorAll('.palette-group'));
  var empty = palette.querySelector('.palette-empty');
  var active = -1;
  var lastFocus = null;

  items.forEach(function (item, i) { item.id = 'palette-opt-' + i; });

  function visibleItems() { return items.filter(function (i) { return !i.hidden; }); }

  function setActive(idx) {
    var vis = visibleItems();
    items.forEach(function (i) { i.classList.remove('is-active'); i.setAttribute('aria-selected', 'false'); });
    if (!vis.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
    active = (idx + vis.length) % vis.length;
    var el = vis[active];
    el.classList.add('is-active');
    el.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', el.id);
    el.scrollIntoView({ block: 'nearest' });
  }

  function filter() {
    var q = input.value.trim().toLowerCase();
    items.forEach(function (item) {
      var hay = (item.textContent + ' ' + (item.getAttribute('data-keywords') || '')).toLowerCase();
      item.hidden = q !== '' && hay.indexOf(q) === -1;
    });
    // hide group labels with no visible items after them
    groups.forEach(function (g) {
      var n = g.nextElementSibling, any = false;
      while (n && !n.classList.contains('palette-group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
    empty.hidden = visibleItems().length > 0;
    setActive(0);
  }

  function openPalette() {
    lastFocus = document.activeElement;
    setNav(false);
    input.value = '';
    filter();
    palette.showModal();
    input.focus();
  }
  function closePalette() {
    if (palette.open) palette.close();
  }
  palette.addEventListener('close', function () {
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  });

  function run(item) {
    if (!item) return;
    var action = item.getAttribute('data-action');
    var href = item.getAttribute('data-href');
    closePalette();
    if (action === 'copy-email') return copyEmail();
    if (action === 'theme') return toggleTheme();
    if (!href) return;
    if (item.hasAttribute('data-download')) {
      var a = document.createElement('a');
      a.href = href; a.download = '';
      document.body.appendChild(a); a.click(); a.remove();
    } else if (item.hasAttribute('data-external')) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.href = href;
    }
  }

  document.querySelectorAll('[data-palette-open]').forEach(function (b) {
    b.addEventListener('click', openPalette);
  });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      palette.open ? closePalette() : openPalette();
    } else if (e.key === 'Escape' && navMenu && navMenu.classList.contains('is-open')) {
      setNav(false);
      navToggle.focus();
    }
  });

  input.addEventListener('input', filter);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); run(visibleItems()[active]); }
  });

  items.forEach(function (item) {
    item.addEventListener('click', function () { run(item); });
    item.addEventListener('mousemove', function () {
      var idx = visibleItems().indexOf(item);
      if (idx !== active) setActive(idx);
    });
  });

  // close when clicking the backdrop
  palette.addEventListener('click', function (e) {
    if (e.target === palette) closePalette();
  });
})();
