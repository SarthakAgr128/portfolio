/**
 * Work v2 - Cosmic Minimalist
 * Interactive effects and animations
 */

(function() {
  'use strict';

  // Portal Rings Cursor Distortion
  function initPortalRings() {
    const portalSection = document.querySelector('.hero-portal');
    const rings = document.querySelectorAll('.portal-ring');
    
    if (!portalSection || !rings.length) return;

    let targetDX = 0, targetDY = 0;
    let currentDX = 0, currentDY = 0;
    let rafId = null;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate() {
      currentDX = lerp(currentDX, targetDX, 0.08);
      currentDY = lerp(currentDY, targetDY, 0.08);

      rings.forEach((ring, index) => {
        const intensity = (index === 0) ? 1.0 : 0.7;
        const dx = currentDX * intensity;
        const dy = currentDY * intensity;

        // Stretch toward cursor: scale up on the axis the cursor is pulling
        const stretchX = 1 + Math.abs(dx) * 0.25;
        const stretchY = 1 + Math.abs(dy) * 0.25;

        // Shift slightly toward cursor
        const shiftX = dx * 40;
        const shiftY = dy * 40;

        ring.style.transform = `translate(${shiftX}px, ${shiftY}px) scaleX(${stretchX}) scaleY(${stretchY})`;
      });

      rafId = requestAnimationFrame(animate);
    }

    portalSection.addEventListener('mousemove', (e) => {
      const rect = portalSection.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      targetDX = (mouseX - centerX) / centerX;
      targetDY = (mouseY - centerY) / centerY;
    });

    portalSection.addEventListener('mouseleave', () => {
      targetDX = 0;
      targetDY = 0;
    });

    rafId = requestAnimationFrame(animate);
  }

  // 3D Parallax Dashboard Card
  function init3DDashboard() {
    const dashboard = document.getElementById('dashboard-3d');
    const dashboardGrid = document.querySelector('.dashboard-grid');
    
    if (!dashboard || !dashboardGrid) return;

    dashboard.addEventListener('mousemove', (e) => {
      const rect = dashboard.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const rotateY = ((mouseX - centerX) / centerX) * 8;
      const rotateX = -((mouseY - centerY) / centerY) * 8;

      dashboardGrid.style.transform = `
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        scale3d(1.01, 1.01, 1.01)
      `;
    });

    dashboard.addEventListener('mouseleave', () => {
      dashboardGrid.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // FAQ Accordion
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
          }
        });
        
        item.classList.toggle('is-open', !isOpen);
      });
    });
  }

  // Smooth scroll for navigation
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const navHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // Scroll reveal animation
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.bento-card, .faq-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 80);
          
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // Navigation scroll effect
  function initNavScroll() {
    const nav = document.querySelector('.cosmic-nav');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 80) {
        nav.style.background = 'rgba(2, 6, 23, 0.95)';
        nav.style.backdropFilter = 'blur(60px)';
      } else {
        nav.style.background = 'rgba(255, 255, 255, 0.05)';
        nav.style.backdropFilter = 'blur(40px)';
      }
    }, { passive: true });
  }

  function init() {
    initPortalRings();
    init3DDashboard();
    initFAQAccordion();
    initSmoothScroll();
    initScrollReveal();
    initNavScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
