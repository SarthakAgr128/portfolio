(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    if (reduced) return;
    
    gsap.registerPlugin(ScrollTrigger);

    initHeroAnimation();
    initScrollReveals();
    initParallax();
    initCardStack();
    initGalleryAnimations();
    initSmoothScroll();
    initMagneticButtons();
  });

  function initHeroAnimation() {
    const tl = gsap.timeline();
    
    tl.fromTo('.home-hero__wave', { opacity: 0, y: 30, rotate: -20 }, { opacity: 1, y: 0, rotate: 0, duration: 1, ease: 'power3.out' })
      .fromTo('.home-hero__name', { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' }, '-=0.6')
      .fromTo('.home-hero__desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo('.home-hero__meta span', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.6')
      .fromTo('.home-hero__cta .btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.6')
      .fromTo('.home-hero__photo-frame', { opacity: 0, scale: 0.8, rotate: -5 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'power4.out' }, '-=1.2')
      .fromTo('.home-hero__float', { opacity: 0, scale: 0, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.2, ease: 'back.out(2)' }, '-=1');

    gsap.to('.rotating-macbook', {
      rotation: 360,
      y: 100,
      scrollTrigger: {
        trigger: '.home-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  function initScrollReveals() {
    const sections = document.querySelectorAll('.home-section');
    sections.forEach(sec => {
      const elements = sec.querySelectorAll('.reveal');
      if(elements.length) {
        gsap.fromTo(elements, 
          { autoAlpha: 0, y: 50, filter: 'blur(5px)' }, 
          { 
            autoAlpha: 1, 
            y: 0, 
            filter: 'blur(0px)',
            duration: 1, 
            stagger: 0.1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });
  }

  function initParallax() {
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      gsap.to(el, {
        y: () => -(window.innerHeight * speed),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  function initCardStack() {
    const cards = gsap.utils.toArray('.memory-card');
    if (!cards.length) return;

    // Reset inline styles from old implementation
    cards.forEach(card => card.removeAttribute('style'));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.memories',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    cards.forEach((card, i) => {
      if (i === 0) return;
      
      tl.fromTo(card, 
        { y: window.innerHeight, rotate: gsap.utils.random(-20, 20), scale: 0.8 },
        { y: i * -15, rotate: gsap.utils.random(-5, 5), scale: 1, duration: 1, ease: 'power2.inOut' }
      );
    });
  }

  function initGalleryAnimations() {
    const items = gsap.utils.toArray('.gallery__item');
    if(!items.length) return;

    gsap.fromTo(items, 
      { opacity: 0, scale: 0.8, y: 100, rotateX: 45 },
      { 
        opacity: 1, scale: 1, y: 0, rotateX: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.gallery__grid',
          start: 'top 85%',
          end: 'bottom 20%',
          scrub: 1
        }
      }
    );
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 80 },
          duration: 1.5,
          ease: 'power4.inOut'
        });
      });
    });
  }

  function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic');
    
    magnets.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
          x: x * 0.4,
          y: y * 0.4,
          duration: 0.5,
          ease: 'power3.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }
})();
