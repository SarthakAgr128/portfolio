(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    if (!reduced) {
      initParallax();
      initCardStack();
    }
    initSmoothScroll();
  });

  /* --- Scroll reveals --- */

  function initScrollReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (reduced) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* --- Parallax on hero elements --- */

  function initParallax() {
    const items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          items.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.1;
            const rect = el.getBoundingClientRect();
            if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
              el.style.transform = `translateY(${scrollY * speed}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* --- Scroll-driven memory card stack --- */

  function initCardStack() {
    const section = document.querySelector('.memories');
    const cards = document.querySelectorAll('.memory-card');
    if (!section || !cards.length) return;

    const total = cards.length;

    cards.forEach((card, i) => {
      card.style.zIndex = total - i;
      card.style.transform = `rotate(${(i - 2) * 3}deg) translateY(${i * -6}px)`;
    });

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          const sectionHeight = section.offsetHeight - window.innerHeight;
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

          cards.forEach((card, i) => {
            const cardStart = i / total;
            const cardEnd = (i + 1) / total;
            const cardProgress = Math.max(0, Math.min(1,
              (progress - cardStart) / (cardEnd - cardStart)
            ));

            if (cardProgress <= 0) {
              const baseRotate = (i - 2) * 3;
              card.style.transform = `rotate(${baseRotate}deg) translateY(${i * -6}px)`;
              card.style.opacity = '1';
            } else if (cardProgress < 1) {
              const ease = cardProgress * cardProgress;
              const tx = ease * 250 * (i % 2 === 0 ? 1 : -1);
              const ty = ease * -120;
              const rot = ease * 25 * (i % 2 === 0 ? 1 : -1);
              const scale = 1 - ease * 0.1;
              card.style.transform =
                `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
              card.style.opacity = `${1 - ease * 0.8}`;
            } else {
              card.style.opacity = '0';
              card.style.pointerEvents = 'none';
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* --- Smooth anchor scrolling --- */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      });
    });
  }
})();
