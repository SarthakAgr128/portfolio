/**
 * Date Page - Hand-Drawn Sketchbook Interactions
 * Scroll reveals, smooth scrolling, and organic animations
 */

(function() {
  'use strict';

  // ============================================
  // SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('.sketch-nav')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const nav = document.querySelector('.sketch-nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      nav.style.transform = 'translateX(-50%) scale(0.95)';
      nav.style.opacity = '0.95';
    } else {
      nav.style.transform = 'translateX(-50%) scale(1)';
      nav.style.opacity = '1';
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  // ============================================
  // RANDOM SLIGHT ROTATIONS ON CARDS
  // ============================================
  function addOrganicRotations() {
    const cards = document.querySelectorAll('.sketch-card, .polaroid, .interest-item');
    
    cards.forEach(card => {
      const baseRotation = parseFloat(getComputedStyle(card).transform.split(',')[1]) || 0;
      
      card.addEventListener('mouseenter', () => {
        const wobble = (Math.random() - 0.5) * 2;
        card.style.transform = `translateY(-4px) rotate(${wobble}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ============================================
  // FLOATING ELEMENTS PARALLAX
  // ============================================
  function initParallax() {
    const floatingElements = document.querySelectorAll('.hero__floating');
    
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      floatingElements.forEach((el, index) => {
        const speed = (index + 1) * 10;
        const x = mouseX * speed;
        const y = mouseY * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // ============================================
  // BUTTON PRESS EFFECT
  // ============================================
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translate(4px, 4px)';
        btn.style.boxShadow = 'none';
      });
      
      btn.addEventListener('mouseup', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
      });
    });
  }

  // ============================================
  // SCRIBBLE UNDERLINE ANIMATION
  // ============================================
  function animateScribbleUnderline() {
    const scribbles = document.querySelectorAll('.scribble-underline');
    
    const scribbleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          scribbleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    scribbles.forEach(el => scribbleObserver.observe(el));
  }

  // ============================================
  // POLAROID STACK EFFECT
  // ============================================
  function initPolaroidEffects() {
    const polaroids = document.querySelectorAll('.polaroid');
    
    polaroids.forEach(polaroid => {
      polaroid.addEventListener('mouseenter', () => {
        polaroid.style.zIndex = '20';
      });
      
      polaroid.addEventListener('mouseleave', () => {
        polaroid.style.zIndex = '';
      });
    });
  }

  // ============================================
  // STAGGER ANIMATION FOR LISTS
  // ============================================
  function staggerListItems() {
    const listItems = document.querySelectorAll('.starter-list li, .interest-item');
    
    listItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  // ============================================
  // INITIALIZE
  // ============================================
  function init() {
    addOrganicRotations();
    initParallax();
    initButtonEffects();
    animateScribbleUnderline();
    initPolaroidEffects();
    staggerListItems();
    
    console.log('%c✏️ Sketchbook ready!', 'font-family: cursive; font-size: 14px; color: #fb923c;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
