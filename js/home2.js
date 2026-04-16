/**
 * Home2 - Glassmorphism Portfolio
 * Smooth animations, scroll effects, and interactive elements
 */

(function () {
  'use strict';

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add reveal class and observe elements
  const revealElements = document.querySelectorAll(
    '.section-label, .features__title, .pricing__title, .productivity__title, .contact__title, ' +
    '.feature-item, .step-card, .pricing-card, .contact-card, .glass-stat'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
    fadeInObserver.observe(el);
  });

  // Progress bars animation on scroll
  const progressBars = document.querySelectorAll('.progress-bar__fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.style.width;
        entry.target.style.width = '0%';
        setTimeout(() => {
          entry.target.style.width = width;
        }, 100);
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  // Navbar scroll effect
  const navbar = document.querySelector('.glass-nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.08)';
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Parallax effect for hero background text
  const heroBgText = document.querySelector('.hero__bg-text');
  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0.03 - scrollY * 0.0001, 0);
      heroBgText.style.opacity = opacity;
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
    }, { passive: true });
  }

  // Mouse move effect for hero image glow
  const heroImageContainer = document.querySelector('.hero__image-container');
  const heroImageGlow = document.querySelector('.hero__image-glow');
  
  if (heroImageContainer && heroImageGlow) {
    heroImageContainer.addEventListener('mousemove', (e) => {
      const rect = heroImageContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      heroImageGlow.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });
    
    heroImageContainer.addEventListener('mouseleave', () => {
      heroImageGlow.style.transform = 'translate(0, 0)';
    });
  }

  // Stagger animation for grids
  const staggerElements = document.querySelectorAll('.features__grid .feature-item, .pricing__grid .pricing-card');
  staggerElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add CSS for reveal animation
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Console welcome message
  console.log('%c👋 Welcome to Sarthak\'s Portfolio', 'font-size: 16px; font-weight: bold; color: #34D399;');
  console.log('%cBuilt with glassmorphism and a lot of coffee ☕', 'font-size: 12px; color: #71717A;');

})();
