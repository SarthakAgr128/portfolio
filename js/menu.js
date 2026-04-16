/**
 * Menu Page - Tubes Background + Flowing Menu
 * Interactive 3D tubes that follow cursor with liquid glass menu overlay
 */

// ============================================
// TUBES BACKGROUND
// ============================================

const TubesManager = {
  app: null,
  canvas: null,
  currentColors: {
    tubes: ['#f967fb', '#53bc28', '#6958d5'],
    lights: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5']
  },

  async init() {
    this.canvas = document.getElementById('tubes-canvas');
    if (!this.canvas) return;

    try {
      const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
      const TubesCursor = module.default;

      this.app = TubesCursor(this.canvas, {
        tubes: {
          colors: this.currentColors.tubes,
          lights: {
            intensity: 200,
            colors: this.currentColors.lights
          }
        }
      });

      this.updateCSSVariables();
      this.bindClickHandler();
      
      console.log('%c🎨 Tubes initialized', 'font-size: 12px; color: #f967fb;');
    } catch (error) {
      console.warn('Tubes background not available:', error);
      document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)';
    }
  },

  randomColors(count) {
    const colors = [];
    const hueRanges = [
      [280, 320], // Purple/Pink
      [100, 160], // Green
      [200, 260], // Blue
      [0, 40],    // Red/Orange
    ];
    
    for (let i = 0; i < count; i++) {
      const range = hueRanges[i % hueRanges.length];
      const hue = Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
      const sat = Math.floor(Math.random() * 30 + 70);
      const light = Math.floor(Math.random() * 20 + 50);
      colors.push(`hsl(${hue}, ${sat}%, ${light}%)`);
    }
    return colors;
  },

  hslToHex(hsl) {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return hsl;
    
    let [, h, s, l] = match.map(Number);
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  },

  updateCSSVariables() {
    const root = document.documentElement;
    const colors = this.currentColors.tubes;
    
    root.style.setProperty('--tube-color-1', colors[0]);
    root.style.setProperty('--tube-color-2', colors[1]);
    root.style.setProperty('--tube-color-3', colors[2]);
    
    // Create glow color from primary tube color
    const glowColor = colors[0].startsWith('#') 
      ? colors[0] + '4D' // Add alpha
      : colors[0].replace(')', ', 0.3)').replace('hsl(', 'hsla(');
    root.style.setProperty('--tube-glow', glowColor);

    // Update reflection layer
    const reflection = document.getElementById('color-reflection');
    if (reflection) {
      reflection.style.background = `
        radial-gradient(ellipse at 30% 30%, ${colors[0]}33 0%, transparent 50%),
        radial-gradient(ellipse at 70% 60%, ${colors[1]}33 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, ${colors[2]}33 0%, transparent 50%)
      `;
    }
  },

  randomize() {
    if (!this.app) return;

    const tubeColors = this.randomColors(3).map(c => this.hslToHex(c));
    const lightColors = this.randomColors(4).map(c => this.hslToHex(c));

    this.currentColors.tubes = tubeColors;
    this.currentColors.lights = lightColors;

    this.app.tubes.setColors(tubeColors);
    this.app.tubes.setLightsColors(lightColors);
    this.updateCSSVariables();

    // Visual feedback
    const menu = document.getElementById('liquid-glass-menu');
    if (menu) {
      menu.style.transform = 'translateY(-4px) scale(1.01)';
      setTimeout(() => {
        menu.style.transform = '';
      }, 200);
    }
  },

  bindClickHandler() {
    document.addEventListener('click', (e) => {
      // Don't randomize if clicking on links
      if (e.target.closest('a')) return;
      this.randomize();
    });
  }
};

// ============================================
// FLOWING MENU
// ============================================

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
    const estimatedPartWidth = this.text.length * 20 + 200;
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

// ============================================
// INITIALIZATION
// ============================================

function initFlowingMenu() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => new FlowingMenuItem(item));
}

async function init() {
  // Initialize tubes background
  await TubesManager.init();
  
  // Initialize flowing menu
  initFlowingMenu();

  console.log('%c🍔 Menu ready', 'font-size: 12px; color: #53bc28;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
