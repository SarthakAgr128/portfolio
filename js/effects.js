(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReduced) {
      initCursorGlow();
      initTiltCards();
      initMagneticButtons();
      initTextScramble();
    }
    initKonamiCode();
    initEmailCopy();
  });

  /* --- Cursor glow follows mouse --- */

  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function animate() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(animate);
    })();
  }

  /* --- 3D tilt on cards --- */

  function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;

        card.style.transform =
          `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;

        card.style.setProperty('--mouse-x', ((x / rect.width) * 100) + '%');
        card.style.setProperty('--mouse-y', ((y / rect.height) * 100) + '%');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* --- Magnetic buttons --- */

  function initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* --- Text scramble effect on scroll --- */

  function initTextScramble() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const els = document.querySelectorAll('.scramble-text');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.scrambled) {
          entry.target.dataset.scrambled = 'true';
          scramble(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    els.forEach(el => {
      el.dataset.final = el.textContent;
      observer.observe(el);
    });

    function scramble(el) {
      const final = el.dataset.final;
      const duration = Math.min(final.length * 40, 800);
      const steps = 20;
      const stepTime = duration / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        let result = '';

        for (let i = 0; i < final.length; i++) {
          if (final[i] === ' ') {
            result += ' ';
          } else if (i < final.length * progress) {
            result += final[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        el.textContent = result;

        if (step >= steps) {
          clearInterval(interval);
          el.textContent = final;
        }
      }, stepTime);
    }
  }

  /* --- Konami code easter egg --- */

  function initKonamiCode() {
    const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === code[pos]) {
        pos++;
        if (pos === code.length) {
          activatePartyMode();
          pos = 0;
        }
      } else {
        pos = 0;
      }
    });
  }

  function activatePartyMode() {
    document.body.classList.toggle('party-mode');
    const isOn = document.body.classList.contains('party-mode');
    showToast(isOn ? '🎉 party mode activated!' : '😴 back to business');
  }

  /* --- Click-to-copy email --- */

  function initEmailCopy() {
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(el.dataset.copy);
          showToast('📋 copied to clipboard!');
        } catch {
          showToast('could not copy — check permissions');
        }
      });
    });
  }

  /* --- Toast helper --- */

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('show');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  window.__showToast = showToast;
})();
