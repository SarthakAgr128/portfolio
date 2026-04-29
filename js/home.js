(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    if (reduced) return;
    
    gsap.registerPlugin(ScrollTrigger);

    initHeroAnimation();
    initScrollReveals();
    initParallax();
    initCardStack();
    initHorizontalScroll();
    initSmoothScroll();
    initMagneticButtons();
    initInteractiveBackground();
  });

  function initInteractiveBackground() {
    // Create an aura element
    const aura = document.createElement('div');
    aura.className = 'cursor-aura';
    document.body.appendChild(aura);

    window.addEventListener('mousemove', (e) => {
      // Aura follows mouse
      gsap.to(aura, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      // Blobs repel from mouse
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) * 0.05;
      const dy = (e.clientY - cy) * 0.05;
      
      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 0.5;
        gsap.to(blob, {
          x: -dx * factor,
          y: -dy * factor,
          duration: 2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  }

  function initHeroAnimation() {
    const tl = gsap.timeline();
    
    tl.fromTo('.home-hero__wave', { opacity: 0, y: 30, rotate: -20 }, { opacity: 1, y: 0, rotate: 0, duration: 1, ease: 'power3.out' })
      .fromTo('.home-hero__name', { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' }, '-=0.6')
      .fromTo('.home-hero__desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo('.home-hero__meta span', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.6')
      .fromTo('.home-hero__cta .btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.6')
      .fromTo('.home-hero__photo-frame', { opacity: 0, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', scale: 1.1 }, { opacity: 1, clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', scale: 1, duration: 1.5, ease: 'power4.out' }, '-=1.2')
      .fromTo('.home-hero__float', { opacity: 0, scale: 0, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.2, ease: 'back.out(2)' }, '-=1');
  }

  function initScrollReveals() {
    // Marquee scroll velocity
    const marqueeTrack = document.querySelector('.home-marquee__track');
    if (marqueeTrack) {
      gsap.to(marqueeTrack, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });
      let proxy = { skew: 0 },
          skewSetter = gsap.quickSetter(".home-marquee__item", "skewX", "deg"),
          clamp = gsap.utils.clamp(-20, 20);
      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -300);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
          }
        }
      });
    }
    const sections = document.querySelectorAll('section, footer');
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
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    // Rabbit hole spring scroll effect
    initRabbitHoleSpring();

    // Magnetic text
    const magneticTexts = document.querySelectorAll('.magnetic-text');
    magneticTexts.forEach(text => {
      text.addEventListener('mousemove', (e) => {
        const rect = text.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(text, {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.5,
          ease: 'power3.out'
        });
      });
      text.addEventListener('mouseleave', () => {
        gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      });
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

    // Make background blobs float interactively
    const blobs = gsap.utils.toArray('.blob');
    blobs.forEach((blob, i) => {
      gsap.to(blob, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        rotation: "random(-45, 45)",
        scale: "random(0.8, 1.2)",
        duration: "random(10, 20)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * -5
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

  function initHorizontalScroll() {
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    const panels = gsap.utils.toArray('.horizontal-scroll-panel');
    
    if (!horizontalSection || !scrollContainer || panels.length === 0) return;

    let horizontalTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalSection,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + scrollContainer.offsetWidth
      }
    });

    // Add parallax to the badges inside panels
    panels.forEach((panel, i) => {
      const badges = panel.querySelectorAll('.skill-badge');
      if(badges.length) {
        gsap.fromTo(badges,
          { opacity: 0, y: 50, scale: 0.5 },
          {
            opacity: 1, y: 0, scale: 1,
            stagger: 0.1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: "left center",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
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

  function initRabbitHoleSpring() {
    const main = document.querySelector('#main');
    const footer = document.querySelector('.mega-footer');
    if (!main || !footer) return;

    const footerHeight = window.innerHeight * 0.33;
    let isSpringActive = false;
    let springProgress = 0;
    let targetProgress = 0;
    let lastScrollY = window.scrollY;
    let scrollAccumulator = 0;
    const springThreshold = 0.2;
    const resistanceFactor = 3.5;

    function updateSpring() {
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const maxScroll = docHeight - viewHeight;
      const scrollY = window.scrollY;
      
      const distanceFromBottom = maxScroll - scrollY;
      const revealRatio = 1 - (distanceFromBottom / footerHeight);
      
      if (revealRatio > 0 && revealRatio <= 1) {
        const delta = scrollY - lastScrollY;
        
        if (revealRatio < springThreshold) {
          targetProgress = revealRatio;
        } else {
          if (delta > 0) {
            scrollAccumulator += delta / resistanceFactor;
            const resistedProgress = springThreshold + (scrollAccumulator / footerHeight);
            targetProgress = Math.min(resistedProgress, 1);
          } else if (delta < 0) {
            scrollAccumulator = Math.max(0, scrollAccumulator + delta);
            const resistedProgress = springThreshold + (scrollAccumulator / footerHeight);
            targetProgress = Math.max(resistedProgress, 0);
          }
        }
        
        springProgress += (targetProgress - springProgress) * 0.15;
        
        const translateY = (1 - springProgress) * footerHeight;
        gsap.set(footer, { y: translateY });
        
        const opacity = Math.min(1, springProgress * 1.5);
        gsap.set(footer.querySelector('.rabbit-hole-section'), { opacity });
        
        if (springProgress > 0.5 && !isSpringActive) {
          isSpringActive = true;
          footer.classList.add('revealed');
        } else if (springProgress <= 0.5 && isSpringActive) {
          isSpringActive = false;
          footer.classList.remove('revealed');
        }
      } else if (revealRatio <= 0) {
        scrollAccumulator = 0;
        springProgress = 0;
        targetProgress = 0;
        gsap.set(footer, { y: footerHeight });
        gsap.set(footer.querySelector('.rabbit-hole-section'), { opacity: 0 });
      }
      
      lastScrollY = scrollY;
    }

    gsap.set(footer, { y: footerHeight });
    gsap.set(footer.querySelector('.rabbit-hole-section'), { opacity: 0 });

    ScrollTrigger.create({
      trigger: main,
      start: 'bottom bottom',
      end: `bottom+=${footerHeight} bottom`,
      onUpdate: updateSpring,
      onLeaveBack: () => {
        scrollAccumulator = 0;
        springProgress = 0;
        gsap.to(footer, { y: footerHeight, duration: 0.3 });
      }
    });

    let rafId;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateSpring);
    }, { passive: true });
  }
})();
