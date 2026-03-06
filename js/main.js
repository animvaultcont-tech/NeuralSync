'use strict';

/* ============================================
   NEURALSYNC — main.js
============================================ */

/* ---------- 1. PRELOADER ---------- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    revealOnScroll();
  }, 2200);
});

/* ---------- 2. NAVBAR ---------- */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  if (scrollY > lastScroll && scrollY > 300) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = scrollY;
}, { passive: true });

navbar.style.transition = 'transform 0.4s ease, background 0.4s ease, padding 0.4s ease, backdrop-filter 0.4s ease';

/* ---------- 3. MOBILE MENU ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- 4. SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 20;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ---------- 5. REVEAL ON SCROLL ---------- */
function isVisible(el) {
  return el.getBoundingClientRect().top <= window.innerHeight * 0.88;
}

function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach((el) => {
    if (isVisible(el)) {
      const parent = el.parentElement;
      const siblings = Array.from(parent.querySelectorAll('.reveal:not(.visible)'));
      const index = siblings.indexOf(el);
      const delay = Math.min(index * 90, 450);
      setTimeout(() => el.classList.add('visible'), delay);
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll();

/* ---------- 6. ACTIVE NAV HIGHLIGHT ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--white)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- 7. STAT COUNTER ---------- */
function countUp(el, target, suffix) {
  let start = 0;
  const duration = 2000;
  const startTime = performance.now();
  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (!isNaN(target)) countUp(el, target);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBand = document.querySelector('.stats-band');
if (statsBand) statObserver.observe(statsBand);

/* ---------- 8. PRICING TOGGLE ---------- */
const billingToggle = document.getElementById('billingToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const annualLabel = document.getElementById('annualLabel');
let isAnnual = false;

if (billingToggle) {
  billingToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    billingToggle.classList.toggle('active', isAnnual);

    monthlyLabel.style.color = isAnnual ? 'var(--text-muted)' : 'var(--white)';
    annualLabel.style.color = isAnnual ? 'var(--white)' : 'var(--text-muted)';

    document.querySelectorAll('.amount:not(.custom)').forEach(el => {
      const monthly = parseFloat(el.dataset.monthly);
      const annual = parseFloat(el.dataset.annual);
      if (!isNaN(monthly)) {
        const current = isAnnual ? annual : monthly;
        animatePrice(el, current);
      }
    });
  });
}

function animatePrice(el, target) {
  const start = parseFloat(el.textContent) || 0;
  const duration = 400;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ---------- 9. NEWSLETTER FORM ---------- */
const nlForm = document.getElementById('nlForm');
const nlSuccess = document.getElementById('nlSuccess');
const nlEmail = document.getElementById('nlEmail');

if (nlForm) {
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = nlEmail.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nlEmail.style.borderColor = '#ef4444';
      nlEmail.focus();
      setTimeout(() => nlEmail.style.borderColor = '', 2000);
      return;
    }

    const btn = nlForm.querySelector('.nl-btn');
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    setTimeout(() => {
      nlForm.reset();
      btn.textContent = 'Subscribe →';
      btn.disabled = false;
      nlSuccess.style.display = 'block';
      setTimeout(() => nlSuccess.style.display = 'none', 5000);
    }, 1200);
  });
}

/* ---------- 10. NEURAL NET ANIMATION ---------- */
function animateNeuralNet() {
  const nodes = document.querySelectorAll('.nn-node');
  if (!nodes.length) return;

  setInterval(() => {
    nodes.forEach(node => node.classList.remove('active'));
    const randomNodes = Array.from(nodes).sort(() => Math.random() - 0.5).slice(0, 3);
    randomNodes.forEach(node => node.classList.add('active'));
  }, 1200);
}

animateNeuralNet();

/* ---------- 11. DASHBOARD BAR ANIMATION ---------- */
function animateDashBars() {
  const bars = document.querySelectorAll('.chart-bars .bar');
  if (!bars.length) return;

  setInterval(() => {
    bars.forEach(bar => {
      const newHeight = Math.floor(Math.random() * 60 + 40) + '%';
      bar.style.height = newHeight;
      bar.style.transition = 'height 0.6s ease';
    });
  }, 2500);
}

animateDashBars();

/* ---------- 12. DASHBOARD LIVE COUNTER ---------- */
const liveEl = document.querySelector('.dash-live span:last-child');
if (liveEl) {
  setInterval(() => {
    const base = 840;
    const variation = Math.floor(Math.random() * 30 - 15);
    liveEl.textContent = `Live inference running · ${base + variation} req/s`;
  }, 1800);
}

/* ---------- 13. HERO PARALLAX ---------- */
const heroGlow1 = document.querySelector('.hero-glow-1');
const heroGlow2 = document.querySelector('.hero-glow-2');

if (heroGlow1) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroGlow1.style.transform = `translateX(-50%) translateY(${scrollY * 0.25}px)`;
      if (heroGlow2) heroGlow2.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

/* ---------- 14. TYPING EFFECT in hero badge ---------- */
const heroBadge = document.querySelector('.hero-badge span:last-child');
if (heroBadge) {
  const originalText = heroBadge.innerHTML;
  // Just ensure badge animates in nicely — already handled by reveal
}

/* ---------- 15. SCROLL PROGRESS BAR ---------- */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
  background: linear-gradient(90deg, var(--blue-dark), var(--cyan));
  width: 0%; transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / docHeight) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });
