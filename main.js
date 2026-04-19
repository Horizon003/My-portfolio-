/* ======================================================
   HARIS ASLAM — HORIZON PORTFOLIO
   Main JavaScript — Animations, Interactivity, Effects
   ====================================================== */

'use strict';

// ─── DOM Ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTypingEffect();
  initScrollReveal();
  initCountUpStats();
  initContactForm();
  initBackToTop();
  initActiveNavOnScroll();
  initParallaxBlobs();
  initHeroEntrance();
});

/* ──────────────────────────────────────────────────────
   1. NAVIGATION
   ────────────────────────────────────────────────────── */
function initNav() {
  const header    = document.getElementById('nav-header');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = navLinks.querySelectorAll('.nav-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ──────────────────────────────────────────────────────
   2. TYPING EFFECT
   ────────────────────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Pharm-D Student',
    'Vibe Coder',
    'Creative Technologist',
    'Graphic Designer',
    'AI Enthusiast',
    'Media Cell Head',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 45;
  const PAUSE_DURATION = 2000;
  const PAUSE_START    = 400;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        if (!isPaused) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            type();
          }, PAUSE_DURATION);
          return;
        }
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    setTimeout(type, speed);
  }

  // Start after hero entrance delay
  setTimeout(type, 1200);
}

/* ──────────────────────────────────────────────────────
   3. SCROLL REVEAL
   ────────────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────
   4. COUNT-UP STATS
   ────────────────────────────────────────────────────── */
function initCountUpStats() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start    = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ──────────────────────────────────────────────────────
   5. CONTACT FORM (visual demo — opens email client)
   ────────────────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm(form);
      return;
    }

    // Compose mailto link
    const mailto = `mailto:Harisaslam003@gmail.com?subject=${encodeURIComponent(subject + ' — from ' + name)}&body=${encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;

    // Show success state
    const btn = form.querySelector('.btn-primary');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      window.location.href = mailto;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #00D4AA, #00edbb)';
      success.classList.add('show');
      form.reset();

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.background = '';
        btn.disabled = false;
        success.classList.remove('show');
      }, 5000);
    }, 900);
  });
}

function shakeForm(form) {
  form.style.animation = 'shake 0.5s ease';
  setTimeout(() => form.style.animation = '', 500);
}

/* ──────────────────────────────────────────────────────
   6. BACK TO TOP
   ────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────
   7. ACTIVE NAV LINK ON SCROLL
   ────────────────────────────────────────────────────── */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: `-${72}px 0px -40% 0px`
  });

  sections.forEach(s => observer.observe(s));
}

/* ──────────────────────────────────────────────────────
   8. SUBTLE PARALLAX ON AMBIENT BLOBS
   ────────────────────────────────────────────────────── */
function initParallaxBlobs() {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;

      blobs.forEach((blob, i) => {
        const intensity = (i + 1) * 8;
        blob.style.transform = `translate(${cx * intensity}px, ${cy * intensity}px)`;
      });
      ticking = false;
    });
  });
}

/* ──────────────────────────────────────────────────────
   9. HERO ENTRANCE ANIMATION
   ────────────────────────────────────────────────────── */
function initHeroEntrance() {
  const heroItems = [
    '.hero-badge',
    '.hero-name',
    '.hero-alias',
    '.hero-tagline',
    '.hero-description',
    '.hero-actions',
    '.hero-stats',
    '.photo-orbit',
  ];

  heroItems.forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    el.style.transitionDelay = `${0.15 + i * 0.1}s`;

    // Use rAF to trigger reflow before adding visible class
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ──────────────────────────────────────────────────────
   10. SHAKE KEYFRAME (injected into <head>)
   ────────────────────────────────────────────────────── */
(function injectShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15%       { transform: translateX(-8px); }
      30%       { transform: translateX(8px); }
      45%       { transform: translateX(-6px); }
      60%       { transform: translateX(6px); }
      75%       { transform: translateX(-3px); }
      90%       { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────────────────────────
   11. SMOOTH HOVER TILT ON PROJECT CARDS
   ────────────────────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ──────────────────────────────────────────────────────
   12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
