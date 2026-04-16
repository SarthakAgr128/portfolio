/**
 * Menu Modal - Liquid Glass Popup with Flowing Menu Effect
 * Reusable across all pages
 */

(function() {
  'use strict';

  const MARQUEE_SPEED = 12;
  const ANIMATION_DURATION = 0.5;
  const ANIMATION_EASE = 'expo.out';

  // Menu items configuration
  const menuItems = [
    { text: 'Home', link: getBasePath() + '', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=200&auto=format&fit=crop' },
    { text: 'Home v2', link: getBasePath() + 'home2/', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&h=200&auto=format&fit=crop' },
    { text: 'Work', link: getBasePath() + 'workprofile/', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=200&auto=format&fit=crop' },
    { text: 'Interesting', link: getBasePath() + 'interesting/', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&h=200&auto=format&fit=crop' }
  ];

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/home2/') || path.includes('/workprofile/') || 
        path.includes('/interesting/') || path.includes('/date/') ||
        path.includes('/menu/')) {
      return '../';
    }
    return '';
  }

  // Create menu modal HTML
  function createMenuModal(container) {
    const modal = document.createElement('div');
    modal.className = 'menu-modal';
    modal.id = 'menu-modal';
    
    let menuItemsHTML = menuItems.map(item => `
      <div class="menu-modal__item" data-image="${item.image}">
        <a href="${item.link}" class="menu-modal__link">
          <span class="menu-modal__text">${item.text}</span>
        </a>
        <div class="menu-modal__marquee">
          <div class="menu-modal__marquee-inner"></div>
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="menu-modal__glass">
        <nav class="menu-modal__nav">
          ${menuItemsHTML}
        </nav>
      </div>
    `;

    container.appendChild(modal);
    return modal;
  }

  // Create menu trigger button
  function createMenuTrigger(container) {
    const trigger = document.createElement('button');
    trigger.className = 'menu-trigger';
    trigger.id = 'menu-trigger';
    trigger.setAttribute('aria-label', 'Open menu');
    trigger.setAttribute('aria-expanded', 'false');
    
    trigger.innerHTML = `
      <div class="menu-trigger__icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span class="menu-trigger__label">Menu</span>
    `;

    container.appendChild(trigger);
    return trigger;
  }
  
  // Create menu container wrapper
  function createMenuContainer() {
    const wrapper = document.createElement('div');
    wrapper.className = 'menu-container';
    wrapper.style.position = 'relative';
    return wrapper;
  }

  // Flowing Menu Item Class
  class FlowingMenuItem {
    constructor(element) {
      this.item = element;
      this.link = element.querySelector('.menu-modal__link');
      this.text = element.querySelector('.menu-modal__text').textContent;
      this.image = element.dataset.image;
      this.marquee = element.querySelector('.menu-modal__marquee');
      this.marqueeInner = element.querySelector('.menu-modal__marquee-inner');
      this.marqueeAnimation = null;
      this.repetitions = 6;

      this.init();
    }

    init() {
      this.generateMarqueeContent();
      this.setupMarqueeAnimation();
      this.bindEvents();
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
      if (!window.gsap) return;
      
      if (this.marqueeAnimation) {
        this.marqueeAnimation.kill();
      }

      const firstPart = this.marqueeInner.querySelector('.marquee-part');
      if (!firstPart) return;

      setTimeout(() => {
        const contentWidth = firstPart.offsetWidth;
        if (contentWidth === 0) return;

        this.marqueeAnimation = gsap.to(this.marqueeInner, {
          x: -contentWidth,
          duration: MARQUEE_SPEED,
          ease: 'none',
          repeat: -1
        });
      }, 100);
    }

    findClosestEdge(mouseX, mouseY, width, height) {
      const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
      const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
      return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
    }

    handleMouseEnter(event) {
      if (!window.gsap) return;
      
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
      if (!window.gsap) return;
      
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

  // Menu Modal Controller
  const MenuModal = {
    modal: null,
    trigger: null,
    container: null,
    isOpen: false,
    menuItems: [],

    init() {
      // Find nav links container in different page layouts
      const navLinks = document.querySelector('.home-nav__links') || 
                       document.querySelector('.glass-nav__links') || 
                       document.querySelector('.nav__links') ||
                       document.querySelector('.sketch-nav__links');
      
      if (!navLinks) {
        console.warn('Menu: Could not find navigation links container');
        return;
      }
      
      // Create container wrapper
      this.container = createMenuContainer();
      
      // Create trigger and modal
      this.trigger = createMenuTrigger(this.container);
      this.modal = createMenuModal(this.container);
      
      // Insert into navigation
      navLinks.appendChild(this.container);
      
      this.bindEvents();
      this.initMenuItems();
    },

    initMenuItems() {
      const items = this.modal.querySelectorAll('.menu-modal__item');
      items.forEach(item => {
        this.menuItems.push(new FlowingMenuItem(item));
      });
    },

    open() {
      this.isOpen = true;
      this.modal.classList.add('is-open');
      this.trigger.setAttribute('aria-expanded', 'true');
      
      // Re-setup marquee animations when modal opens
      this.menuItems.forEach(item => item.setupMarqueeAnimation());
    },

    close() {
      this.isOpen = false;
      this.modal.classList.remove('is-open');
      this.trigger.setAttribute('aria-expanded', 'false');
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    bindEvents() {
      // Trigger click
      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
      
      // Click outside to close
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.container.contains(e.target)) {
          this.close();
        }
      });
      
      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  };

  // Initialize when DOM is ready
  function init() {
    MenuModal.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
