(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  const canvas = document.getElementById("cable-canvas");
  const depthEl = document.getElementById("interesting-depth");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let w = 0;
  let h = 0;
  let scrollY = 0;
  let tick = 0;

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawCable() {
    if (!ctx || w < 2) return;

    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.5;
    const travel = scrollY * 0.85;
    const twist = scrollY * 0.0028;

    /* Ambient vertical lines (depth) — no horizontal drift */
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "#334";
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    ctx.restore();

    /* Core backbone: stacked segments, rotate in place (twist), pattern moves down */
    const segH = 10;
    const strands = 5;
    const startY = -(travel % (segH * 6)) - segH * 6;
    const endY = h + segH * 8;

    for (let y = startY; y < endY; y += segH) {
      const i = Math.floor(y / segH);
      const rot = twist + i * 0.11;

      for (let s = 0; s < strands; s++) {
        const phase = (s / strands) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, y + segH * 0.5);
        ctx.rotate(rot + phase * 0.15);

        const hue = 175 + (s * 18 + i) % 40;
        const grad = ctx.createLinearGradient(-5, -segH, 5, segH);
        grad.addColorStop(0, `hsla(${hue}, 95%, 58%, 0.95)`);
        grad.addColorStop(0.5, `hsla(${hue + 20}, 80%, 45%, 0.85)`);
        grad.addColorStop(1, `hsla(${hue}, 90%, 35%, 0.75)`);

        ctx.fillStyle = grad;
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.45)`;
        ctx.shadowBlur = 12;
        ctx.fillRect(-3.5, -segH * 0.5, 7, segH + 1);
        ctx.restore();
      }
    }

    /* Inner bright spine — fixed x (no lateral pan) */
    ctx.save();
    ctx.strokeStyle = "rgba(200, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "rgba(0, 230, 255, 0.55)";
    ctx.shadowBlur = 14;
    ctx.globalAlpha = 0.55;
    ctx.setLineDash([4, 8]);
    ctx.lineDashOffset = -(travel % 32);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
    ctx.restore();

    /* Orbiting “packets” around cable — circular motion, center fixed at cx */
    if (!prefersReduced) {
      const packets = 14;
      for (let p = 0; p < packets; p++) {
        const py = ((p * 137 + travel * 0.6) % (h + 120)) - 40;
        const ang = twist * 40 + p * 0.7 + tick * 0.015;
        const orbit = 22 + (p % 5) * 6;
        const px = cx + Math.cos(ang) * orbit;
        const size = 2 + (p % 3);

        ctx.fillStyle = p % 2 === 0 ? "rgba(0, 230, 255, 0.75)" : "rgba(191, 95, 255, 0.65)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (depthEl) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.round((scrollY / maxScroll) * 100));
      depthEl.textContent = `SIGNAL DEPTH · ${pct}%`;
    }
  }

  function loop() {
    if (!prefersReduced) tick++;
    drawCable();
    requestAnimationFrame(loop);
  }

  function onScroll() {
    scrollY = window.scrollY || 0;
    if (prefersReduced) drawCable();
  }

  /* Cursor */
  function initCursor() {
    if (isCoarse) return;
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    let mx = w / 2;
    let my = h / 2;
    let rx = mx;
    let ry = my;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });

    function cursorLoop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(cursorLoop);
    }
    requestAnimationFrame(cursorLoop);

    document.querySelectorAll("a, button, .interesting__panel").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  function initReveal() {
    const panels = document.querySelectorAll(".interesting__panel");
    if (!panels.length) return;

    if (prefersReduced) {
      panels.forEach((p) => p.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    panels.forEach((p) => io.observe(p));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    resize();
    drawCable();
  });

  resize();
  onScroll();
  initCursor();
  initReveal();

  if (prefersReduced) {
    drawCable();
  } else {
    requestAnimationFrame(loop);
  }
})();
