/**
 * Ghost Cursor - Standalone version with Three.js bundled
 * A fluid, smoky cursor trail effect
 */

(function() {
  'use strict';

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error('GhostCursor: Three.js is required. Please include Three.js before this script.');
    return;
  }

  class GhostCursor {
    constructor(options = {}) {
      this.config = {
        color: options.color || '#FFFFFF',
        brightness: options.brightness || 1.2,
        trailLength: options.trailLength || 20,
        inertia: options.inertia || 0.4,
        bloomStrength: options.bloomStrength || 0.3,
        bloomRadius: options.bloomRadius || 0.8,
        bloomThreshold: options.bloomThreshold || 0,
        grainIntensity: options.grainIntensity || 0.05,
        edgeIntensity: options.edgeIntensity || 0,
        mixBlendMode: options.mixBlendMode || 'screen',
        fadeDelayMs: options.fadeDelayMs || 200,
        fadeDurationMs: options.fadeDurationMs || 1000,
        zIndex: options.zIndex || 999,
        maxDevicePixelRatio: options.maxDevicePixelRatio || 0.5
      };

      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      this.pixelBudget = this.isTouch ? 0.9e6 : 1.3e6;
      
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.material = null;
      this.container = null;
      this.parentElement = null;
      
      this.trailBuffer = [];
      this.headIndex = 0;
      this.rafId = null;
      this.resizeObserver = null;
      this.currentMouse = new THREE.Vector2(0.5, 0.5);
      this.velocity = new THREE.Vector2(0, 0);
      this.fadeOpacity = 1.0;
      this.lastMoveTime = performance.now();
      this.pointerActive = false;
      this.isRunning = false;
    }

    init(parentSelector = 'body') {
      this.parentElement = document.querySelector(parentSelector);
      if (!this.parentElement) {
        console.error('GhostCursor: Parent element not found:', parentSelector);
        return;
      }

      console.log('GhostCursor: Initializing...');
      
      this.container = document.createElement('div');
      this.container.className = 'ghost-cursor-container';
      this.container.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: ${this.config.zIndex};
        overflow: hidden;
      `;
      this.parentElement.appendChild(this.container);

      try {
        this.setupRenderer();
        this.setupScene();
        this.setupEventListeners();
        this.startAnimationLoop();
        console.log('GhostCursor: Initialized successfully!');
      } catch (error) {
        console.error('GhostCursor: Initialization failed:', error);
      }
    }

    setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: !this.isTouch,
        alpha: true,
        depth: false,
        stencil: false,
        powerPreference: 'default',
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });

      this.renderer.setClearColor(0x000000, 0);
      this.renderer.domElement.style.cssText = `
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
        background: transparent;
        mix-blend-mode: ${this.config.mixBlendMode};
      `;

      this.container.appendChild(this.renderer.domElement);
    }

    setupScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);

      const maxTrail = Math.max(1, Math.floor(this.config.trailLength));
      this.trailBuffer = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));
      this.headIndex = 0;

      const baseColor = new THREE.Color(this.config.color);
      
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float iTime;
        uniform vec3  iResolution;
        uniform vec2  iMouse;
        uniform vec2  iPrevMouse[${maxTrail}];
        uniform float iOpacity;
        uniform float iScale;
        uniform vec3  iBaseColor;
        uniform float iBrightness;

        varying vec2  vUv;

        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }

        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3. - 2. * f);
          return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                     mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
        }

        float fbm(vec2 p){
          float v = 0.0;
          float a = 0.5;
          mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for(int i=0;i<5;i++){
            v += a * noise(p);
            p = m * p * 2.0;
            a *= 0.5;
          }
          return v;
        }

        vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
          vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
          vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));
          float smoke = fbm(p * iScale + r * 0.8);
          
          float radius = 0.5 + 0.3 * (1.0 / iScale);
          float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
          float alpha = pow(smoke, 2.5) * distFactor;

          vec3 color = mix(iBaseColor, vec3(1.0), 0.2);

          return vec4(color * alpha * intensity, alpha * intensity);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
          vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
          
          vec3 colorAcc = vec3(0.0);
          float alphaAcc = 0.0;
          
          vec4 b = blob(uv, mouse, 1.0, iOpacity);
          colorAcc += b.rgb;
          alphaAcc += b.a;

          for (int i = 0; i < ${maxTrail}; i++) {
            vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
            float t = 1.0 - float(i) / float(${maxTrail});
            t = pow(t, 2.0);
            
            if (t > 0.01) {
              vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
              colorAcc += bt.rgb;
              alphaAcc += bt.a;
            }
          }

          colorAcc *= iBrightness;
          
          float outAlpha = clamp(alphaAcc * iOpacity, 0.0, 1.0);
          gl_FragColor = vec4(colorAcc, outAlpha);
        }
      `;

      this.material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3(1, 1, 1) },
          iMouse: { value: new THREE.Vector2(0.5, 0.5) },
          iPrevMouse: { value: this.trailBuffer.map(v => v.clone()) },
          iOpacity: { value: 1.0 },
          iScale: { value: 1.0 },
          iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
          iBrightness: { value: this.config.brightness }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Mesh(geometry, this.material);
      this.scene.add(mesh);

      this.geometry = geometry;
      this.mesh = mesh;

      this.handleResize();
      
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);
    }

    handleResize() {
      const rect = this.container.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));

      const currentDPR = Math.min(window.devicePixelRatio || 1, this.config.maxDevicePixelRatio);
      const need = cssW * cssH * currentDPR * currentDPR;
      const scale = need <= this.pixelBudget ? 1 : Math.max(0.5, Math.min(1, Math.sqrt(this.pixelBudget / Math.max(1, need))));
      
      const pixelRatio = currentDPR * scale;
      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(cssW, cssH, false);

      const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
      const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
      
      this.material.uniforms.iResolution.value.set(wpx, hpx, 1);
      this.material.uniforms.iScale.value = this.calculateScale();
    }

    calculateScale() {
      const rect = this.container.getBoundingClientRect();
      const base = 600;
      const current = Math.min(Math.max(1, rect.width), Math.max(1, rect.height));
      return Math.max(0.5, Math.min(2.0, current / base));
    }

    setupEventListeners() {
      this.onPointerMove = (e) => {
        const rect = this.parentElement.getBoundingClientRect();
        const x = THREE.MathUtils.clamp((e.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
        const y = THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
        
        this.currentMouse.set(x, y);
        this.pointerActive = true;
        this.lastMoveTime = performance.now();
        this.ensureLoop();
      };

      this.onPointerEnter = () => {
        this.pointerActive = true;
        this.ensureLoop();
      };

      this.onPointerLeave = () => {
        this.pointerActive = false;
        this.lastMoveTime = performance.now();
        this.ensureLoop();
      };

      this.parentElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.parentElement.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
      this.parentElement.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    }

    startAnimationLoop() {
      const startTime = performance.now();

      const animate = () => {
        const now = performance.now();
        const t = (now - startTime) / 1000;

        if (this.pointerActive) {
          this.velocity.set(
            this.currentMouse.x - this.material.uniforms.iMouse.value.x,
            this.currentMouse.y - this.material.uniforms.iMouse.value.y
          );
          this.material.uniforms.iMouse.value.copy(this.currentMouse);
          this.fadeOpacity = 1.0;
        } else {
          this.velocity.multiplyScalar(this.config.inertia);
          if (this.velocity.lengthSq() > 1e-6) {
            this.material.uniforms.iMouse.value.add(this.velocity);
          }
          
          const dt = now - this.lastMoveTime;
          if (dt > this.config.fadeDelayMs) {
            const k = Math.min(1, (dt - this.config.fadeDelayMs) / this.config.fadeDurationMs);
            this.fadeOpacity = Math.max(0, 1 - k);
          }
        }

        const N = this.trailBuffer.length;
        this.headIndex = (this.headIndex + 1) % N;
        this.trailBuffer[this.headIndex].copy(this.material.uniforms.iMouse.value);
        
        const arr = this.material.uniforms.iPrevMouse.value;
        for (let i = 0; i < N; i++) {
          const srcIdx = (this.headIndex - i + N) % N;
          arr[i].copy(this.trailBuffer[srcIdx]);
        }

        this.material.uniforms.iOpacity.value = this.fadeOpacity;
        this.material.uniforms.iTime.value = t;

        this.renderer.render(this.scene, this.camera);

        if (!this.pointerActive && this.fadeOpacity <= 0.001) {
          this.isRunning = false;
          this.rafId = null;
          return;
        }

        this.rafId = requestAnimationFrame(animate);
      };

      this.ensureLoop = () => {
        if (!this.isRunning) {
          this.isRunning = true;
          this.rafId = requestAnimationFrame(animate);
        }
      };

      this.ensureLoop();
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.isRunning = false;

      if (this.parentElement) {
        this.parentElement.removeEventListener('pointermove', this.onPointerMove);
        this.parentElement.removeEventListener('pointerenter', this.onPointerEnter);
        this.parentElement.removeEventListener('pointerleave', this.onPointerLeave);
      }

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      if (this.scene) this.scene.clear();
      if (this.geometry) this.geometry.dispose();
      if (this.material) this.material.dispose();
      if (this.renderer) {
        this.renderer.dispose();
        if (this.renderer.domElement && this.renderer.domElement.parentElement) {
          this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
        }
      }

      if (this.container && this.container.parentElement) {
        this.container.parentElement.removeChild(this.container);
      }
    }
  }

  // Export to global scope
  window.GhostCursor = GhostCursor;

})();
