document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = el.dataset.phrases?.split('|')[0] || '';
    return;
  }

  const phrases = (el.dataset.phrases || '').split('|');
  if (!phrases.length) return;

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const TYPING_SPEED = 55;
  const DELETING_SPEED = 30;
  const PAUSE_AFTER_TYPING = 2200;
  const PAUSE_AFTER_DELETING = 400;

  function tick() {
    const currentPhrase = phrases[phraseIdx];
    const displayed = currentPhrase.substring(0, charIdx);
    el.textContent = displayed;

    if (!isDeleting && charIdx === currentPhrase.length) {
      setTimeout(() => { isDeleting = true; tick(); }, PAUSE_AFTER_TYPING);
      return;
    }

    if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(tick, PAUSE_AFTER_DELETING);
      return;
    }

    charIdx += isDeleting ? -1 : 1;
    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    setTimeout(tick, speed);
  }

  setTimeout(tick, 800);
});
