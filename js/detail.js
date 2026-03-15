// Kevin Elanjickal — Detail Page Enhancements (Phase 6)
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==================== READING PROGRESS BAR ====================
  var progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ==================== CUSTOM CURSOR ====================
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    // Touch device detection
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.add('has-custom-cursor');
      var mouseX = 0, mouseY = 0;
      var ringX = 0, ringY = 0;

      document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        dot.classList.add('visible');
        ring.classList.add('visible');
      });

      // Smooth ring follow
      var animateRing = function () {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      };
      animateRing();

      // Hover state on interactive elements
      var hoverTargets = document.querySelectorAll('a, button, .detail-nav-back, .detail-nav-links a, .back-link, .nav-brand, .nav-toggle');
      hoverTargets.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          dot.classList.add('hovering');
          ring.classList.add('hovering');
        });
        el.addEventListener('mouseleave', function () {
          dot.classList.remove('hovering');
          ring.classList.remove('hovering');
        });
      });

      // Click state
      document.addEventListener('mousedown', function () {
        dot.classList.add('clicking');
        ring.classList.add('clicking');
      });
      document.addEventListener('mouseup', function () {
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
      });
    }
  }

  // ==================== PAGE EXIT TRANSITION ====================
  // Fade out when clicking internal links
  var internalLinks = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="mailto"]):not([href^="tel"]):not([href^="#"])');
  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(function () {
        window.location.href = href;
      }, 300);
    });
  });

  // ==================== GSAP ANIMATIONS ====================
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {

    // --- Detail hero entrance ---
    var heroTitle = document.querySelector('.detail-hero h1');
    var breadcrumb = document.querySelector('.detail-hero .breadcrumb');
    if (heroTitle) {
      gsap.from(heroTitle, {
        opacity: 0, y: 30, duration: 0.8, delay: 0.2, ease: 'power3.out'
      });
    }
    if (breadcrumb) {
      gsap.from(breadcrumb, {
        opacity: 0, y: 20, duration: 0.6, delay: 0.4, ease: 'power3.out'
      });
    }

    // --- Company logo reveal ---
    var logo = document.querySelector('.company-logo');
    if (logo) {
      gsap.from(logo, {
        opacity: 0, scale: 0.8, duration: 0.7, delay: 0.5, ease: 'back.out(1.7)'
      });
    }

    // --- Content sections stagger in ---
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Animate detail meta
      var detailMeta = document.querySelector('.detail-meta');
      if (detailMeta) {
        gsap.from(detailMeta.children, {
          opacity: 0, y: 20, stagger: 0.1, duration: 0.5, delay: 0.6,
          ease: 'power2.out'
        });
      }

      // Animate list items
      var listItems = document.querySelectorAll('.content-wrap li');
      if (listItems.length > 0) {
        gsap.from(listItems, {
          opacity: 0, x: -20, stagger: 0.08, duration: 0.5, delay: 0.8,
          ease: 'power2.out'
        });
      }

      // Animate paragraphs
      var paragraphs = document.querySelectorAll('.content-wrap > p, .content-wrap > h3');
      if (paragraphs.length > 0) {
        paragraphs.forEach(function (p) {
          gsap.from(p, {
            opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: p, start: 'top 90%', once: true }
          });
        });
      }

      // Animate detail-nav
      var detailNav = document.querySelector('.detail-nav');
      if (detailNav) {
        gsap.from(detailNav, {
          opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: detailNav, start: 'top 95%', once: true }
        });
      }

      // Animate back-link (dofe page)
      var backLink = document.querySelector('.back-link');
      if (backLink) {
        gsap.from(backLink, {
          opacity: 0, x: -20, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: backLink, start: 'top 95%', once: true }
        });
      }
    }
  }

})();
