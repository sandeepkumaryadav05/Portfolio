/* ============================================================
   SANDEEP KUMAR YADAV — PORTFOLIO
   Interactive Scripts: GSAP + Cursor + Scramble + Tilt + Magnetic + Flow Lines
   ============================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
  var html = document.documentElement;

  // ============================================================
  // 1. FLOW LINES PARALLAX (mouse-reactive)
  // ============================================================
  function initFlowLines() {
    if (isMobile || prefersReducedMotion) return;
    var heroSvg = document.querySelector('.hero-flow svg');
    if (!heroSvg) return;

    var mx = 0, my = 0;
    var cx = 0, cy = 0;

    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 20;
      my = (e.clientY / window.innerHeight - 0.5) * 10;
    }, { passive: true });

    function animate() {
      cx += (mx - cx) * 0.03;
      cy += (my - cy) * 0.03;
      heroSvg.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ============================================================
  // 2. CUSTOM CURSOR
  // ============================================================
  function initCursor() {
    if (isMobile || prefersReducedMotion) return;
    var dot = document.querySelector('.cursor');
    var ring = document.querySelector('.cursor-follower');
    if (!dot || !ring) return;

    var mx = 0, my = 0;
    var dx = 0, dy = 0;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    }, { passive: true });

    function followRing() {
      dx += (mx - dx) * 0.12;
      dy += (my - dy) * 0.12;
      ring.style.left = dx + 'px';
      ring.style.top = dy + 'px';
      requestAnimationFrame(followRing);
    }
    followRing();

    var hoverTargets = 'a, button, [data-magnetic], [data-scramble], input, textarea, .skill-item, .stat-item, .cert-card';
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('hovering'); ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
    });
  }

  // ============================================================
  // 3. GSAP SCROLL ANIMATIONS
  // ============================================================
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var heroEls = document.querySelectorAll('.hero .anim-in');
    gsap.to(heroEls, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.2
    });

    gsap.utils.toArray('.section-label.anim-in').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    gsap.utils.toArray('.gsap-reveal').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    gsap.utils.toArray('.gsap-reveal-up').forEach(function (el, i) {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    gsap.utils.toArray('.gsap-reveal-left').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    gsap.utils.toArray('.project-visual').forEach(function (el) {
      gsap.fromTo(el, { y: 30 }, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    gsap.utils.toArray('.timeline-dot').forEach(function (el) {
      gsap.fromTo(el, { scale: 0.5, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    document.querySelectorAll('.stat-value[data-target]').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () { animateCountUp(el); }
      });
    });
  }

  // ============================================================
  // 4. TEXT SCRAMBLE EFFECT
  // ============================================================
  function initScramble() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    document.querySelectorAll('[data-scramble]').forEach(function (el) {
      var original = el.textContent;
      var interval = null;

      el.addEventListener('mouseenter', function () {
        var iteration = 0;
        clearInterval(interval);
        interval = setInterval(function () {
          el.textContent = original.split('').map(function (char, index) {
            if (index < iteration) return original[index];
            if (char === ' ' || char === '\n' || char === '<' || char === '>') return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          iteration += 1 / 2;
          if (iteration >= original.length) {
            el.textContent = original;
            clearInterval(interval);
          }
        }, 30);
      });

      el.addEventListener('mouseleave', function () {
        clearInterval(interval);
        el.textContent = original;
      });
    });
  }

  // ============================================================
  // 5. MAGNETIC BUTTONS
  // ============================================================
  function initMagnetic() {
    if (isMobile || prefersReducedMotion) return;

    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ============================================================
  // 6. 3D TILT ON PROJECT CARDS
  // ============================================================
  function initTilt() {
    if (isMobile || prefersReducedMotion) return;

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateX = (y - 0.5) * -8;
        var rotateY = (x - 0.5) * 8;
        el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.01, 1.01, 1.01)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      el.addEventListener('mouseenter', function () {
        el.style.transition = 'transform 0.15s ease-out';
      });
    });
  }

  // ============================================================
  // 7. COUNT-UP ANIMATION
  // ============================================================
  function animateCountUp(el) {
    if (el.classList.contains('counted')) return;
    el.classList.add('counted');
    var target = parseFloat(el.getAttribute('data-target'));
    var isDecimal = el.hasAttribute('data-decimal');
    var duration = 1800;
    var startTime = performance.now();

    function update(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ============================================================
  // 8. THEME TOGGLE
  // ============================================================
  var themeToggle = document.getElementById('themeToggle');
  var navbar = document.getElementById('navbar');
  var navLinks = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  var navOverlay = document.getElementById('navOverlay');
  var backToTop = document.getElementById('backToTop');
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var sections = document.querySelectorAll('.section, .hero');
  var navItems = document.querySelectorAll('.nav-links a');

  function getPreferredTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ============================================================
  // 9. MOBILE MENU
  // ============================================================
  function openMenu() {
    navLinks.classList.add('open');
    navOverlay.classList.add('open');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  navItems.forEach(function (link) { link.addEventListener('click', closeMenu); });

  // ============================================================
  // 10. NAVBAR SCROLL + ACTIVE LINK
  // ============================================================
  function handleScroll() {
    var scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('visible', scrollY > 500);

    var current = '';
    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
    });
    navItems.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ============================================================
  // 11. BACK TO TOP
  // ============================================================
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 12. CONTACT FORM
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = formStatus;
      status.textContent = '';
      status.className = 'form-status';

      var hCaptchaResponse = contactForm.querySelector('textarea[name="h-captcha-response"]');
      if (!hCaptchaResponse || !hCaptchaResponse.value) {
        status.textContent = 'Please complete the security verification.';
        status.className = 'form-status error';
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var orig = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            status.className = 'form-status success';
            contactForm.reset();
            if (typeof hcaptcha !== 'undefined') {
              try { hcaptcha.reset(); } catch (err) { /* ignore */ }
            }
          } else {
            return response.json().then(function (d) { throw new Error(d.message); });
          }
        })
        .catch(function () {
          status.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
          status.className = 'form-status error';
        })
        .finally(function () {
          submitBtn.textContent = orig;
          submitBtn.disabled = false;
        });
    });
  }

  // ============================================================
  // 13. SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // 14. SCROLL PROGRESS BAR
  // ============================================================
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgress.style.transform = 'scaleX(' + progress + ')';
    }, { passive: true });
  }

  // ============================================================
  // 15. CARD HOVER GLOW
  // ============================================================
  function initCardGlow() {
    if (isMobile) return;
    document.querySelectorAll('.skill-category, .cert-card, .stat-item').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ============================================================
  // 16. GRADIENT BORDER ON PROJECT CARDS
  // ============================================================
  function initGradientBorders() {
    document.querySelectorAll('.project-block').forEach(function (el) {
      el.classList.add('gradient-border');
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  if (!prefersReducedMotion) {
    initFlowLines();
    initCursor();
    initScramble();
    initMagnetic();
    initTilt();
    initCardGlow();
    initGradientBorders();
  }
  initGSAP();

})();
