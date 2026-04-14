document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const phrases = (el.dataset.phrases || '').split('|').filter(Boolean);
  if (!phrases.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&*';
  let phraseIdx = 0;

  function decodePhrase(text, cb) {
    const len = text.length;
    const duration = Math.min(len * 35, 800);
    const steps = 18;
    const stepMs = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      let out = '';
      for (let i = 0; i < len; i++) {
        if (text[i] === ' ') {
          out += ' ';
        } else if (i < len * progress) {
          out += text[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = out;
      if (step >= steps) {
        clearInterval(interval);
        el.textContent = text;
        cb();
      }
    }, stepMs);
  }

  function erasePhrase(text, cb) {
    let i = text.length;
    const interval = setInterval(() => {
      i--;
      el.textContent = text.substring(0, i);
      if (i <= 0) {
        clearInterval(interval);
        cb();
      }
    }, 25);
  }

  function cycle() {
    const phrase = phrases[phraseIdx];
    decodePhrase(phrase, () => {
      setTimeout(() => {
        erasePhrase(phrase, () => {
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(cycle, 300);
        });
      }, 2500);
    });
  }

  setTimeout(cycle, 600);
});
