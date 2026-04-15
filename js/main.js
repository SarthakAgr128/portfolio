document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initSmoothScroll();
  initProjectFilter();
  initConsoleFeed();
});

function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const overlay = document.querySelector('.nav__overlay');

  if (!toggle || !links) return;

  function openMenu() {
    links.classList.add('open');
    overlay?.classList.add('visible');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    links.querySelector('.nav__link')?.focus();
  }

  function closeMenu() {
    links.classList.remove('open');
    overlay?.classList.remove('visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  links.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', closeMenu)
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu();
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        );
      }
    });
  }, { rootMargin: '-20% 0px -75% 0px' });

  sections.forEach(s => observer.observe(s));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) + 16;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });
}

function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card[data-category]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

function initConsoleFeed() {
  const feed = document.querySelector('#console-feed');
  if (!feed) return;

  const lines = [
    '[sys] orchestrating purple drills…',
    '[sys] rewriting detections for drift',
    '[sys] stacking telemetry from edge sensors',
    '[sys] benchmarking mean time to detect',
    '[sys] syncing playbooks with response',
    '[sys] capturing evidence + narrative'
  ];

  let index = 0;
  const maxLines = 4;

  function pushLine(text) {
    const paragraph = document.createElement('p');
    paragraph.className = 'console-line reveal';
    paragraph.innerHTML = `<span class="prompt">[sys]</span> ${text.replace(/\[sys\]\s*/i, '')}`;
    feed.appendChild(paragraph);

    if (feed.children.length > maxLines) {
      feed.removeChild(feed.firstElementChild);
    }
  }

  // seed initial feed
  for (let i = 0; i < maxLines; i += 1) {
    pushLine(lines[index]);
    index = (index + 1) % lines.length;
  }

  setInterval(() => {
    pushLine(lines[index]);
    index = (index + 1) % lines.length;
  }, 2800);
}
