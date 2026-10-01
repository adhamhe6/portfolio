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

  // Highlight the section crossing the middle of the viewport; none while
  // the hero (or any gap between sections) is there instead.
  function setActive(section) {
    var id = section ? '#' + section.id : null;
    links.forEach(function (a) {
      var active = a.getAttribute('href') === id;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function updateActive() {
    var line = window.innerHeight * 0.45;
    var current = null;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = s;
    });
    // At the very bottom the last (short) section may never reach the line
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom && window.scrollY > 0) current = sections[sections.length - 1];
    setActive(current);
  }

  if (sections.length) {
    var ticking = false;
    var onSpyScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; updateActive(); });
    };
    window.addEventListener('scroll', onSpyScroll, { passive: true });
    window.addEventListener('resize', onSpyScroll);
    updateActive();
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

  /* ---------- Scrollable Recognition cards: fade hint ---------- */
  document.querySelectorAll('.recog-scroll').forEach(function (box) {
    var update = function () {
      box.classList.toggle('has-more', box.scrollTop + box.clientHeight < box.scrollHeight - 2);
    };
    box.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Never trap the page: once the card can't scroll further in the wheel's
    // direction (or has no overflow), pass the scroll straight to the page.
    box.addEventListener('wheel', function (e) {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // pinch-zoom / sideways
      var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      var atTop = box.scrollTop <= 0;
      var atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
      if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
        e.preventDefault();
        window.scrollBy({ top: dy, behavior: 'instant' });
      }
    }, { passive: false });
  });

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
