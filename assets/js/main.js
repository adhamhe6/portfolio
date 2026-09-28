(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function updateThemeLabel() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (themeToggle) {
    updateThemeLabel();
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateThemeLabel();
    });
    darkQuery.addEventListener && darkQuery.addEventListener('change', updateThemeLabel);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function setNav(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('is-open', open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('is-open') && !e.target.closest('.nav')) setNav(false);
    });
  }

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Game of Life (hero card) ---------- */
  var lifeCanvas = document.querySelector('.life-canvas');
  if (lifeCanvas && lifeCanvas.getContext) {
    var ctx = lifeCanvas.getContext('2d');
    var genEl = document.querySelector('.life-gen');
    var COLS = 31, ROWS = 19, CELL = 8;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    lifeCanvas.width = COLS * CELL * dpr;
    lifeCanvas.height = ROWS * CELL * dpr;
    ctx.scale(dpr, dpr);

    var grid, gen, history;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function seed() {
      grid = new Uint8Array(COLS * ROWS);
      for (var i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.28 ? 1 : 0;
      gen = 0;
      history = [];
    }

    function step() {
      var next = new Uint8Array(COLS * ROWS);
      for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
          var n = 0;
          for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
              if (dx || dy) n += grid[((y + dy + ROWS) % ROWS) * COLS + ((x + dx + COLS) % COLS)];
            }
          }
          var alive = grid[y * COLS + x];
          next[y * COLS + x] = (n === 3 || (alive && n === 2)) ? 1 : 0;
        }
      }
      grid = next;
      gen++;
      // reseed when the board dies out, freezes or loops
      var key = grid.join('');
      if (history.indexOf(key) !== -1 || gen > 400) seed();
      history.push(key);
      if (history.length > 12) history.shift();
    }

    function draw() {
      var styles = getComputedStyle(document.documentElement);
      var accent = styles.getPropertyValue('--accent').trim() || '#0f766e';
      var faint = styles.getPropertyValue('--border').trim() || '#e3e8eb';
      ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);
      for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
          var alive = grid[y * COLS + x];
          ctx.fillStyle = alive ? accent : faint;
          var pad = alive ? 1 : 3;
          ctx.fillRect(x * CELL + pad, y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
        }
      }
      if (genEl) genEl.textContent = 'gen ' + gen;
    }

    seed();
    for (var warm = 0; warm < 8; warm++) step();
    draw();

    if (!reduceMotion) {
      var visible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; })
          .observe(lifeCanvas);
      }
      setInterval(function () {
        if (!visible || document.hidden) return;
        step();
        draw();
      }, 140);
    }
  }

  /* ---------- Back to top ---------- */
  document.querySelectorAll('[data-scroll-top]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  /* ---------- Active section in nav ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (a) {
          var active = a.getAttribute('href') === id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { revealer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector('.copy-email');
  var copyStatus = document.querySelector('.copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var done = function () {
        copyBtn.textContent = 'Copied ✓';
        if (copyStatus) copyStatus.textContent = 'Email address copied to clipboard.';
        setTimeout(function () {
          copyBtn.textContent = 'Copy email';
          if (copyStatus) copyStatus.textContent = '';
        }, 2500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, function () {
          if (copyStatus) copyStatus.textContent = email;
        });
      } else if (copyStatus) {
        copyStatus.textContent = email;
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
