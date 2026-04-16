/**
 * Flowing Menu - Vanilla JS Implementation
 * Adapted from React FlowingMenu component
 * Features directional transitions and infinite marquee on hover
 */

(function() {
  'use strict';

  const MARQUEE_SPEED = 15;
  const ANIMATION_DURATION = 0.6;
  const ANIMATION_EASE = 'expo.out';
  const MIN_REPETITIONS = 4;

  class FlowingMenuItem {
    constructor(element) {
      this.item = element;
      this.link = element.querySelector('.menu-item__link');
      this.text = element.querySelector('.menu-item__text').textContent;
      this.image = element.dataset.image;
      this.marquee = element.querySelector('.menu-item__marquee');
      this.marqueeInner = element.querySelector('.menu-item__marquee-inner');
      this.marqueeAnimation = null;
      this.repetitions = MIN_REPETITIONS;

      this.init();
    }

    init() {
      this.calculateRepetitions();
      this.generateMarqueeContent();
      this.setupMarqueeAnimation();
      this.bindEvents();

      window.addEventListener('resize', () => {
        this.calculateRepetitions();
        this.generateMarqueeContent();
        this.setupMarqueeAnimation();
      });
    }

    calculateRepetitions() {
      const viewportWidth = window.innerWidth;
      const estimatedPartWidth = this.text.length * 20 + 250;
      const needed = Math.ceil(viewportWidth / estimatedPartWidth) + 2;
      this.repetitions = Math.max(MIN_REPETITIONS, needed);
    }

    generateMarqueeContent() {
      this.marqueeInner.innerHTML = '';
      
      for (let i = 0; i < this.repetitions; i++) {
        const part = document.createElement('div');
        part.className = 'marquee-part';
        part.innerHTML = `
          <span class="marquee-part__text">${this.text}</span>
          <div class="marquee-part__image" style="background-image: url('${this.image}')"></div>
        `;
        this.marqueeInner.appendChild(part);
      }
    }

    setupMarqueeAnimation() {
      if (this.marqueeAnimation) {
        this.marqueeAnimation.kill();
      }

      const firstPart = this.marqueeInner.querySelector('.marquee-part');
      if (!firstPart) return;

      const contentWidth = firstPart.offsetWidth;
      if (contentWidth === 0) {
        setTimeout(() => this.setupMarqueeAnimation(), 100);
        return;
      }

      this.marqueeAnimation = gsap.to(this.marqueeInner, {
        x: -contentWidth,
        duration: MARQUEE_SPEED,
        ease: 'none',
        repeat: -1
      });
    }

    findClosestEdge(mouseX, mouseY, width, height) {
      const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
      const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
      return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
    }

    handleMouseEnter(event) {
      const rect = this.item.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const edge = this.findClosestEdge(mouseX, mouseY, rect.width, rect.height);

      const fromY = edge === 'top' ? '-101%' : '101%';
      const innerFromY = edge === 'top' ? '101%' : '-101%';

      gsap.timeline({ defaults: { duration: ANIMATION_DURATION, ease: ANIMATION_EASE } })
        .set(this.marquee, { y: fromY })
        .set(this.marqueeInner, { y: innerFromY })
        .to(this.marquee, { y: '0%' }, 0)
        .to(this.marqueeInner, { y: '0%' }, 0);
    }

    handleMouseLeave(event) {
      const rect = this.item.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const edge = this.findClosestEdge(mouseX, mouseY, rect.width, rect.height);

      const toY = edge === 'top' ? '-101%' : '101%';
      const innerToY = edge === 'top' ? '101%' : '-101%';

      gsap.timeline({ defaults: { duration: ANIMATION_DURATION, ease: ANIMATION_EASE } })
        .to(this.marquee, { y: toY }, 0)
        .to(this.marqueeInner, { y: innerToY }, 0);
    }

    bindEvents() {
      this.link.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
      this.link.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
    }
  }

  function initFlowingMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => new FlowingMenuItem(item));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlowingMenu);
  } else {
    initFlowingMenu();
  }

  console.log('%c🍔 Menu initialized', 'font-size: 12px; color: #18181B;');

})();
