/* ═══════════════════════════════════════════════════
   TimeDoors — script.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── REAL-TIME CLOCK ─────────────────────────────── */
const clockTime = document.getElementById('clock-time');
const clockDate = document.getElementById('clock-date');

function updateClock() {
  const now = new Date();

  clockTime.textContent = now.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  clockDate.textContent = now.toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
updateClock();
setInterval(updateClock, 1000);

/* ── THEME TOGGLE (Lamp) ─────────────────────────── */
const themeBtn = document.getElementById('theme-btn');
const html = document.documentElement;

const THEME_KEY = 'timedoors-theme';
const ICONS = { light: '💡', dark: '🌙' };

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeBtn.textContent = ICONS[theme];
  localStorage.setItem(THEME_KEY, theme);
}

// Respect system preference on first visit
const saved = localStorage.getItem(THEME_KEY);
const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
applyTheme(saved || sys);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── BOTTOM TAB NAV (Telegram style) ─────────────── */
const tabs       = document.querySelectorAll('.tab-btn');
const indicator  = document.getElementById('nav-indicator');
const desktopLinks = document.querySelectorAll('.desktop-nav-link');
const navTriggers  = document.querySelectorAll('.nav-trigger');

function positionIndicator(btn) {
  if (!indicator || !btn) return;
  const nav = btn.closest('.bottom-nav');
  if (!nav) return;
  const navPad = 5;
  indicator.style.left  = `${btn.offsetLeft + navPad - 5}px`;
  indicator.style.width = `${btn.offsetWidth}px`;
}

function setActiveSection(targetId) {
  // Bottom tabs
  tabs.forEach(tab => {
    const isActive = tab.dataset.target === targetId;
    tab.classList.toggle('active', isActive);
    if (isActive) positionIndicator(tab);
  });

  // Desktop nav links
  desktopLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.target === targetId);
  });
}

// Tab clicks → smooth scroll
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const el = document.getElementById(tab.dataset.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(tab.dataset.target);
  });
});

// Desktop nav clicks → smooth scroll
desktopLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const el = document.getElementById(link.dataset.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(link.dataset.target);
  });
});

// Any .nav-trigger (logo, buttons etc) → smooth scroll
navTriggers.forEach(trigger => {
  trigger.addEventListener('click', e => {
    e.preventDefault();
    const el = document.getElementById(trigger.dataset.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(trigger.dataset.target);
  });
});

// IntersectionObserver → auto-highlight nav while scrolling
const mainSections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveSection(entry.target.id);
    }
  });
}, { threshold: 0.35 });

mainSections.forEach(sec => sectionObserver.observe(sec));

// Reposition indicator on resize
window.addEventListener('resize', () => {
  const active = document.querySelector('.tab-btn.active');
  if (active) positionIndicator(active);
});

// Initial positioning
window.addEventListener('load', () => {
  const active = document.querySelector('.tab-btn.active');
  if (active) positionIndicator(active);
});
setTimeout(() => {
  const active = document.querySelector('.tab-btn.active');
  if (active) positionIndicator(active);
}, 120);

/* ── HEADER SCROLL EFFECT ────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
});

/* ── BACK TO TOP ─────────────────────────────────── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 350);
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setActiveSection('hero');
});

/* ── POPUP ───────────────────────────────────────── */
const overlay   = document.getElementById('popup-overlay');
const popupIcon  = document.getElementById('popup-icon');
const popupTitle = document.getElementById('popup-title');
const popupSub   = document.getElementById('popup-sub');
const formSubject = document.getElementById('form-subject');

const POPUP_CONFIG = {
  measure: {
    icon: '📐',
    title: 'Викликати замірника',
    sub: 'Заповніть форму і наш фахівець зв\'яжеться з Вами',
    subject: 'Виклик майстра за вимірами'
  },
  buy: {
    icon: '🚪',
    title: 'Замовити двері',
    sub: 'Залиште контакти і ми підберемо найкращий варіант',
    subject: 'Замовлення дверей'
  },
  consultation: {
    icon: '💬',
    title: 'Безкоштовна консультація',
    sub: 'Наш спеціаліст зв\'яжеться з Вами найближчим часом',
    subject: 'Консультація'
  }
};

window.openPopup = function(type) {
  const cfg = POPUP_CONFIG[type] || POPUP_CONFIG.measure;
  popupIcon.textContent  = cfg.icon;
  popupTitle.textContent = cfg.title;
  popupSub.textContent   = cfg.sub;
  if (formSubject) formSubject.value = cfg.subject;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus first input
  setTimeout(() => {
    const first = overlay.querySelector('input:not([type="hidden"])');
    if (first) first.focus();
  }, 400);
};

window.closePopup = function() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

// Close on backdrop click
overlay.addEventListener('click', e => {
  if (e.target === overlay) closePopup();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) {
    closePopup();
  }
});

// Touch swipe to close popup (drag down)
let touchStart = 0;
overlay.addEventListener('touchstart', e => {
  touchStart = e.touches[0].clientY;
}, { passive: true });
overlay.addEventListener('touchmove', e => {
  const delta = e.touches[0].clientY - touchStart;
  if (delta > 60) closePopup();
}, { passive: true });

/* ── REVIEWS CAROUSEL ────────────────────────────── */
const track = document.getElementById('reviews-track');
const dotsContainer = document.getElementById('rev-dots');
const prevBtn = document.getElementById('rev-prev');
const nextBtn = document.getElementById('rev-next');

if (track) {
  const cards = Array.from(track.children);
  let current = 0;
  let autoTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Відгук ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getVisible() {
    // On mobile show 1, on desktop show 2
    return window.innerWidth < 768 ? 1 : 2;
  }

  function goTo(index) {
    const vis = getVisible();
    const max = Math.max(0, cards.length - vis);
    current = Math.max(0, Math.min(index, max));

    const cardW = cards[0].offsetWidth + 16; // +gap
    track.style.transform = `translateX(-${current * cardW}px)`;

    // Update dots
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(goNext, 5500);
  }

  function goNext() {
    const vis = getVisible();
    const max = cards.length - vis;
    goTo(current + 1 > max ? 0 : current + 1);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1 < 0 ? cards.length - getVisible() : current - 1));
  nextBtn.addEventListener('click', goNext);
  window.addEventListener('resize', () => goTo(current));

  // Touch swipe on carousel
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) dx < 0 ? goNext() : goTo(current - 1);
  });

  resetAuto();
}

/* ── CATALOG FILTER ──────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      const show = filter === 'all' || card.dataset.badge === filter;
      card.classList.toggle('hidden', !show);
      card.style.animation = show ? 'fadeUp 0.3s ease both' : 'none';
    });
  });
});

/* ── FORM SUBMIT (prevent default for demo) ──────── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    // Real submission goes to mail.php — only intercept if no server
    // e.preventDefault(); // Remove this comment if you want to test without server
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.textContent = '✅ Надіслано!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Надіслати заявку';
        btn.disabled = false;
        closePopup();
      }, 2500);
    }
  });
});

/* ── SMOOTH APPEAR ON SCROLL ─────────────────────── */
const fadeEls = document.querySelectorAll(
  '.glass-card, .adv-card, .product-card, .team-card, .review-card'
);

const appearObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${(i % 8) * 0.05}s`;
      entry.target.style.animation = 'fadeUp 0.5s ease both';
      appearObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => appearObserver.observe(el));

/* ── HERO FORM PREFILL ───────────────────────────── */
// If user fills hero form and clicks consultation, prefill popup
const heroNameEl  = document.getElementById('hero-name');
const heroEmailEl = document.getElementById('hero-email');

document.querySelector('.hero-card .btn-primary')?.addEventListener('click', () => {
  openPopup('consultation');
  const popupNameInput = overlay.querySelector('input[name="Name"]');
  if (heroNameEl?.value && popupNameInput) {
    popupNameInput.value = heroNameEl.value;
  }
});

console.log('🚪 TimeDoors — готово до роботи!');
