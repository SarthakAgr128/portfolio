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
    const panel = footer?.querySelector('.rabbit-hole-section');
    const link = panel?.querySelector('a');
    if (!main || !footer || !panel) return;

    const cfg = {
      threshold: 0.2,        // 0-20% is 1:1
      resistancePower: 2.35, // >1 increases resistance after threshold
      closeSnap: 0.42,        // hysteresis lower bound
      openSnap: 0.68,         // hysteresis upper bound
      settleDelayMs: 130,
      springStiffness: 260,
      springDamping: 32
    };

    const state = {
      rawProgress: 0,
      target: 0,
      x: 0,
      v: 0,
      raf: 0,
      lastTs: 0,
      idleTimer: 0
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panelHeightPx = () => Math.round(window.innerHeight * 0.33);

    function clamp01(v) {
      return Math.max(0, Math.min(1, v));
    }

    // 0..threshold => linear, threshold..1 => nonlinear resisted curve.
    function mapWithResistance(raw) {
      const t = cfg.threshold;
      if (raw <= t) return raw;
      const x = (raw - t) / (1 - t);
      const resisted = Math.pow(x, cfg.resistancePower);
      return t + (1 - t) * resisted;
    }

    // Critically/near-critically damped spring solver.
    function tick(ts) {
      if (!state.lastTs) state.lastTs = ts;
      const dt = Math.min((ts - state.lastTs) / 1000, 0.032);
      state.lastTs = ts;

      const k = cfg.springStiffness;
      const c = cfg.springDamping;
      const a = -k * (state.x - state.target) - c * state.v;
      state.v += a * dt;
      state.x = clamp01(state.x + state.v * dt);

      if (Math.abs(state.v) < 0.0009 && Math.abs(state.target - state.x) < 0.0009) {
        state.x = state.target;
        state.v = 0;
        applyProgress(state.x);
        state.raf = 0;
        state.lastTs = 0;
        return;
      }

      applyProgress(state.x);
      state.raf = requestAnimationFrame(tick);
    }

    function startSpring() {
      if (!state.raf) state.raf = requestAnimationFrame(tick);
    }

    function applyProgress(p) {
      const h = panelHeightPx();
      const y = (1 - p) * h;
      const opacity = Math.min(1, p * 1.15);
      gsap.set(footer, { y });
      gsap.set(panel, { opacity });

      footer.classList.toggle('revealed', p > 0.5);
      footer.classList.toggle('is-open', p > 0.96);
      footer.classList.toggle('is-visible', p > 0.04);

      if (link) {
        link.tabIndex = p > 0.05 ? 0 : -1;
      }
      footer.setAttribute('aria-hidden', p <= 0.02 ? 'true' : 'false');
    }

    function maybeSettle() {
      if (prefersReducedMotion) return;
      if (state.target <= cfg.closeSnap) {
        state.target = 0;
      } else if (state.target >= cfg.openSnap) {
        state.target = 1;
      } else {
        return;
      }
      startSpring();
    }

    function onRawProgress(raw) {
      state.rawProgress = clamp01(raw);
      state.target = mapWithResistance(state.rawProgress);

      if (prefersReducedMotion) {
        state.x = state.target;
        applyProgress(state.x);
      } else {
        startSpring();
      }

      window.clearTimeout(state.idleTimer);
      state.idleTimer = window.setTimeout(maybeSettle, cfg.settleDelayMs);
    }

    const trigger = ScrollTrigger.create({
      trigger: main,
      start: 'bottom bottom',
      end: () => `bottom+=${panelHeightPx()} bottom`,
      scrub: false,
      onUpdate: (self) => {
        onRawProgress(self.progress);
      },
      onLeave: () => {
        onRawProgress(1);
      },
      onLeaveBack: () => {
        onRawProgress(0);
      }
    });

    window.addEventListener('resize', () => {
      applyProgress(state.x);
      trigger.refresh();
    }, { passive: true });

    state.x = prefersReducedMotion ? 0 : 0;
    applyProgress(0);
  }
})();
