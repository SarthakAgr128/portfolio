/**
 * Tubes Background - Interactive 3D Cursor Effect
 * SAVED FOR LATER USE
 * 
 * This creates an interactive 3D background with neon tubes that follow the cursor.
 * Click anywhere to randomize colors.
 * 
 * Usage:
 * 1. Add <canvas id="tubes-canvas"></canvas> to your HTML
 * 2. Include GSAP: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
 * 3. Include this script as a module: <script type="module" src="js/tubes-background.js"></script>
 */

const TubesBackground = {
  app: null,
  canvas: null,
  currentColors: {
    tubes: ['#f967fb', '#53bc28', '#6958d5'],
    lights: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5']
  },

  async init(canvasId = 'tubes-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn('Tubes canvas not found');
      return false;
    }

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
      return true;
    } catch (error) {
      console.warn('Tubes background not available:', error);
      document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)';
      return false;
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
    
    const glowColor = colors[0].startsWith('#') 
      ? colors[0] + '4D'
      : colors[0].replace(')', ', 0.3)').replace('hsl(', 'hsla(');
    root.style.setProperty('--tube-glow', glowColor);
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
  },

  bindClickHandler() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      this.randomize();
    });
  }
};

// Export for use
export default TubesBackground;

// Auto-init if canvas exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TubesBackground.init());
} else {
  TubesBackground.init();
}
