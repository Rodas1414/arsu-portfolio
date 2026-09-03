/* ============================================================
   ARSEMA GEBRESELAMA — PORTFOLIO
   main.js — Interactions, Animations, Navigation
   ============================================================ */

'use strict';

/* ── LOADING SCREEN ──────────────────────────────────────── */
(function initLoader() {
  const screen = document.querySelector('.loading-screen');
  if (!screen) {
    document.body.style.overflow = '';
    return;
  }

  function dismiss() {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => { screen.style.display = 'none'; }, 800);
  }

  const hardTimeout = setTimeout(dismiss, 2500);

  if (document.readyState === 'complete') {
    clearTimeout(hardTimeout);
    setTimeout(dismiss, 600);
  } else {
    window.addEventListener('load', () => {
      clearTimeout(hardTimeout);
      setTimeout(dismiss, 600);
    });
  }
})();

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-item, .toolkit-item, .wwm-option, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* ── SCROLL PROGRESS BAR ────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ── NAVIGATION ──────────────────────────────────────────── */
(function initNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      if (open) {
        mobile.style.display = 'flex';
        requestAnimationFrame(() => mobile.classList.add('open'));
      } else {
        mobile.classList.remove('open');
        setTimeout(() => { mobile.style.display = ''; }, 400);
      }
    });
    mobile.querySelectorAll('.nav-mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        setTimeout(() => { mobile.style.display = ''; }, 400);
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
  }
})();

/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  function revealEl(el) {
    el.classList.add('visible');
  }

  // Immediately reveal anything already in the viewport on load
  function revealVisible() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealEl(el);
      }
    });
  }

  // Use IntersectionObserver for elements below the fold
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealEl(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));

  // Run immediately and also after a short delay (handles project pages)
  revealVisible();
  setTimeout(revealVisible, 100);
  window.addEventListener('load', revealVisible);
})();

/* ── HERO PARALLAX ───────────────────────────────────────── */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }
  }, { passive: true });
})();

/* ── HERO IMAGE SCALE-IN ─────────────────────────────────── */
(function initHeroImage() {
  // Homepage hero
  const img = document.querySelector('.hero-bg img');
  if (img) {
    img.style.transform = 'scale(1.08)';
    window.addEventListener('load', () => { img.style.transform = 'scale(1.0)'; });
  }
  // Project page hero — ensure it's always visible
  const projectImg = document.querySelector('.project-hero-bg img');
  if (projectImg) {
    projectImg.style.opacity = '1';
    projectImg.style.transform = 'scale(1.0)';
  }
})();

/* ── PROJECT ITEM HOVER ──────────────────────────────────── */
(function initProjectHovers() {
  const items = document.querySelectorAll('.project-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(other => { if (other !== item) other.style.opacity = '0.55'; });
    });
    item.addEventListener('mouseleave', () => {
      items.forEach(other => { other.style.opacity = ''; });
    });
  });
})();

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();

/* ── CONTACT FORM ────────────────────────────────────────── */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('.form-submit button');
    const msg = form.querySelector('.form-message');
    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderBottomColor = '#a03030';
        setTimeout(() => { input.style.borderBottomColor = ''; }, 2000);
      }
    });

    if (!valid) {
      if (msg) { msg.textContent = 'Please fill in all required fields.'; msg.className = 'form-message error'; }
      return;
    }

    if (btn) btn.textContent = 'Sending...';
    setTimeout(() => {
      if (btn) btn.textContent = 'Send Inquiry →';
      if (msg) { msg.textContent = 'Thank you. Arsema will be in touch shortly.'; msg.className = 'form-message success'; }
      form.reset();
    }, 1200);
  });

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderBottomColor = ''; });
  });
})();

/* ── NUMBER COUNT UP ─────────────────────────────────────── */
(function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.target || el.textContent);
      const suffix = el.dataset.suffix || '';
      const start  = Date.now();
      const dur    = 1400;

      function tick() {
        const p = Math.min((Date.now() - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── MARQUEE ─────────────────────────────────────────────── */
(function initMarquee() {
  document.querySelectorAll('.marquee-inner').forEach(m => {
    m.parentElement.appendChild(m.cloneNode(true));
  });
})();
