document.addEventListener('DOMContentLoaded', () => {
  const parallaxCard = document.querySelector('.parallax-card');

  if (parallaxCard) {
    parallaxCard.addEventListener('mousemove', (e) => {
      const rect = parallaxCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = x - centerX;
      const deltaY = y - centerY;

      const rotateX = (deltaY / centerY) * -10; // Invert for natural feel
      const rotateY = (deltaX / centerX) * 10;

      parallaxCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    parallaxCard.addEventListener('mouseleave', () => {
      parallaxCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
});
