# Portfolio Site — Implementation Blueprint

> **Author role assumptions:** Senior front-end architect, motion designer, UX writer specializing in cybersecurity portfolios.
> **Hosting target:** GitHub Pages (static, no server-side logic).
> **Audience:** Recruiters, hiring managers, fellow security practitioners, CTF teammates.

---

## A. Site Concept & Visual Theme

### Concept: "Clean Terminal"

A dark, high-contrast interface that channels the aesthetic of a security professional's workspace — terminal typography, subtle grid patterns, and precise motion — while staying modern, readable, and welcoming. Not a gimmicky "hacker movie" look; more like a well-configured Neovim setup meets a high-end design studio.

### Color System

| Token              | Hex       | Usage                          |
|--------------------|-----------|--------------------------------|
| `--bg-primary`     | `#0a0a0f` | Page background                |
| `--bg-surface`     | `#111118` | Cards, elevated surfaces       |
| `--bg-surface-alt` | `#1a1a24` | Hover states, secondary cards  |
| `--text-primary`   | `#e4e4e7` | Body text                      |
| `--text-secondary` | `#8888a0` | Muted text, labels             |
| `--accent-cyan`    | `#00d4ff` | Primary interactive elements   |
| `--accent-green`   | `#00ff88` | Terminal caret, success states  |
| `--accent-purple`  | `#7b2ff7` | Hover accents, gradients       |
| `--accent-pink`    | `#ff3366` | Alerts, danger, CTF highlights |
| `--border`         | `#1e1e2e` | Subtle dividers                |

### Typography

- **Headings:** `"JetBrains Mono", "Fira Code", monospace` — reinforces the technical identity.
- **Body:** `"Inter", system-ui, sans-serif` — clean readability at all sizes.
- **Code/Labels:** `"JetBrains Mono", monospace` at smaller weights.

### Visual Motifs

- Dot-grid background pattern (pure CSS, no images).
- Faint scanline overlay on the hero section (CSS pseudo-element, opacity 0.03).
- Monospace section labels prefixed with `//` or `$` like code comments.
- Cards with `border: 1px solid var(--border)` and subtle glow on hover.

---

## B. Information Architecture

```
/                          → Home (single-page, all sections)
/2026-04-15/               → Hidden "dating portfolio" entry (sample)
/2026-05-01/               → Another hidden entry (add as needed)
/404.html                  → Custom 404 page
```

### Home page sections (scroll order):

1. **Hero** — Name, title, rotating tagline, CTA
2. **About** — 2-3 paragraph bio + photo/avatar
3. **Skills** — Categorized skill tags with proficiency indicators
4. **Projects** — Filterable card grid (4-6 featured projects)
5. **Writeups / CTFs** — Recent writeups + CTF placements
6. **Certifications** — Badge/card display
7. **Timeline** — Career + education milestones
8. **Contact** — Email, socials, availability status
9. **Footer** — Copyright, "built with" note, PGP key link

### Hidden subpages:

- Accessed only by direct URL (e.g., `/2026-04-15`).
- Contain a personal "dating portfolio" style page.
- Include a clear **"← Back to Home"** link.
- **Not linked from the home page, navigation, or sitemap.**

---

## C. Page-by-Page Text Wireframes

### C.1 Home Page (`/`)

```
┌─────────────────────────────────────────────────┐
│  [Logo/Name]                    [Nav: sections]  │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │           HERO SECTION                       │ │
│  │                                               │ │
│  │   > Sarthak Agrawal_                         │ │
│  │                                               │ │
│  │   Security Engineer · Ethical Hacker          │ │
│  │   · Red Teamer                                │ │
│  │                                               │ │
│  │   [Typing animation cycling through:]         │ │
│  │   "I break things so you can build safely."   │ │
│  │   "Turning vulnerabilities into value."       │ │
│  │   "Making the internet a little safer."       │ │
│  │                                               │ │
│  │   [ View My Work ↓ ]   [ Get In Touch → ]    │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  // about ──────────────────────────────────────  │
│  ┌──────────┐                                     │
│  │  Avatar  │  Paragraph bio about background,    │
│  │          │  philosophy, and what drives you.    │
│  └──────────┘                                     │
│                                                   │
│  // skills ─────────────────────────────────────  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │ Offensive  │ │ Defensive │ │ Dev/Tools │       │
│  │ Pentesting │ │ SIEM      │ │ Python    │       │
│  │ Web App    │ │ IR        │ │ Bash      │       │
│  │ Network    │ │ Forensics │ │ Docker    │       │
│  │ ...        │ │ ...       │ │ ...       │       │
│  └───────────┘ └───────────┘ └───────────┘       │
│                                                   │
│  // projects ───────────────────────────────────  │
│  [ All ] [ Tools ] [ Research ] [ CTF ]           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Project  │ │ Project  │ │ Project  │          │
│  │ Card 1   │ │ Card 2   │ │ Card 3   │          │
│  │ [GitHub] │ │ [GitHub] │ │ [GitHub] │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│                                                   │
│  // writeups ───────────────────────────────────  │
│  ┌─────────────────────────────────────────────┐ │
│  │  CTF Name  │  Challenge  │  Category │ Link  │ │
│  │  ...       │  ...        │  ...      │ ...   │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  // certifications ─────────────────────────────  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                │
│  │OSCP │ │CEH  │ │AWS  │ │ ... │                │
│  └─────┘ └─────┘ └─────┘ └─────┘                │
│                                                   │
│  // timeline ───────────────────────────────────  │
│  ●─── 2026  Current Role                         │
│  │                                                │
│  ●─── 2024  Previous Role                        │
│  │                                                │
│  ●─── 2022  Education / Cert                     │
│                                                   │
│  // contact ────────────────────────────────────  │
│  ┌─────────────────────────────────────────────┐ │
│  │  Let's work together.                        │ │
│  │  [Email] [GitHub] [LinkedIn] [Twitter]       │ │
│  │  Status: 🟢 Open to opportunities            │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ─────────────────────────────────────────────── │
│  © 2026 Sarthak Agrawal · Built with HTML/CSS/JS │
└─────────────────────────────────────────────────┘
```

### C.2 Hidden Date Page (`/2026-04-15/`)

```
┌─────────────────────────────────────────────────┐
│  ← Back to Home                                  │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │          A DIFFERENT KIND OF PORTFOLIO        │ │
│  │                                               │ │
│  │  Hi! You found the secret page. 👋           │ │
│  │                                               │ │
│  │  [Photo / avatar]                             │ │
│  │                                               │ │
│  │  The Basics:                                  │ │
│  │  Name, age, location, interests...            │ │
│  │                                               │ │
│  │  What I'm About:                              │ │
│  │  Personal blurb, hobbies, values...           │ │
│  │                                               │ │
│  │  Fun Facts / Conversation Starters:           │ │
│  │  • Bullet list of personality tidbits         │ │
│  │                                               │ │
│  │  [Instagram] [Spotify] [Other personal links] │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ⚠ Privacy note (see Section H)                  │
│                                                   │
│  ← Back to Home                                  │
└─────────────────────────────────────────────────┘
```

### C.3 Custom 404 Page

```
┌─────────────────────────────────────────────────┐
│                                                   │
│     $ cat /page                                  │
│     cat: /page: No such file or directory         │
│                                                   │
│     404 — Page not found.                         │
│     The packet got lost in transit.               │
│                                                   │
│     [ ← Back to Home ]                            │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## D. Recommended Tech Stack

| Layer        | Choice                        | Why                                                                                  |
|--------------|-------------------------------|--------------------------------------------------------------------------------------|
| Markup       | Vanilla HTML5                 | Zero build step, instant deploy to GitHub Pages, maximum performance.                |
| Styling      | Vanilla CSS3 (custom props)   | No preprocessor needed; CSS nesting is now baseline. Smaller payload than Tailwind.  |
| Interaction  | Vanilla ES6+ JavaScript       | No framework overhead. Intersection Observer + CSS transitions handle 90% of motion. |
| Fonts        | Google Fonts (JetBrains Mono, Inter) | Reliable CDN, WOFF2, preconnect for speed.                                    |
| Icons        | Inline SVG                    | No icon library dependency, tree-shaken by default, style with CSS.                  |
| Hosting      | GitHub Pages                  | Free, HTTPS by default, custom domain support, CI via push-to-main.                  |
| Analytics    | None (or Plausible, optional) | Privacy-respecting; no cookie banner needed.                                         |

### Why no framework?

- A single-page portfolio with 6-8 sections does not benefit from React/Vue/Svelte's component model.
- Zero JS framework = zero hydration cost = sub-1s First Contentful Paint.
- Maintenance is trivial: edit HTML, push, done.
- If the site grows to 10+ pages, consider migrating to Astro (which outputs static HTML).

---

## E. Repo File Tree

```
portfolio/
├── index.html                  # Home page (all sections)
├── 404.html                    # Custom 404 page
├── BLUEPRINT.md                # This document
├── README.md                   # Project overview
│
├── css/
│   ├── reset.css               # Minimal CSS reset
│   ├── theme.css               # Custom properties, typography, base
│   ├── layout.css              # Grid, containers, section spacing
│   ├── components.css          # Cards, buttons, badges, nav
│   └── animations.css          # Keyframes, scroll-driven classes, reduced-motion
│
├── js/
│   ├── main.js                 # Bootstrap: nav, scroll spy, smooth scroll
│   ├── animations.js           # Intersection Observer scroll-reveal logic
│   └── typing.js               # Hero typing/cycling effect
│
├── assets/
│   ├── avatar.webp             # Profile photo (WebP, ≤80KB)
│   ├── og-image.png            # Open Graph preview (1200×630)
│   └── favicon.svg             # SVG favicon
│
└── 2026-04-15/
    └── index.html              # Sample hidden "dating portfolio" page
```

---

## F. Key Implementation Notes

### F.1 Scroll-Reveal Animations

All sections use a single `IntersectionObserver` with `threshold: 0.15`. Elements start with `opacity: 0; transform: translateY(24px)` and transition in. CSS handles the animation via a `.revealed` class toggle — no GSAP or heavy library needed.

```js
// animations.js (simplified)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
/* animations.css */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

### F.2 Hero Typing Effect

A lightweight ~40-line vanilla JS function cycles through taglines with a cursor blink. Uses `requestAnimationFrame` for smooth timing, pauses between phrases, and respects `prefers-reduced-motion` by showing the first tagline statically.

### F.3 Navigation

- Fixed top nav with backdrop blur (`backdrop-filter: blur(12px)`).
- Scroll-spy highlights the current section using the same `IntersectionObserver` pattern.
- Mobile: hamburger menu with a slide-in overlay. Pure CSS checkbox hack + JS for accessibility (focus trap, Escape to close).

### F.4 Project Cards

- CSS Grid `auto-fill, minmax(300px, 1fr)` for responsive layout.
- Filter buttons use data attributes: `data-category="tool|research|ctf"`.
- Filtering is CSS-class-based (`.hidden { display: none }`) with a short fade transition.
- Cards have a subtle `box-shadow` glow on hover using the accent color at low opacity.

### F.5 Timeline

- Vertical line with alternating left/right entries on desktop; single-column stacked on mobile.
- Each node fades in via scroll-reveal with a staggered `transition-delay` (0ms, 100ms, 200ms…).

### F.6 Dot-Grid Background

A pure-CSS radial-gradient pattern on `body::before`:
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.4;
}
```

### F.7 Hidden Date Pages — Routing

GitHub Pages serves `/<folder>/index.html` as `/<folder>/`. To add a new date page:
1. Create `2026-05-01/index.html`.
2. Push to `main`.
3. Done — no build step, no config change.

### F.8 Performance Budget

| Metric          | Target       |
|-----------------|-------------|
| Total page size | < 250 KB     |
| First paint     | < 1.0s       |
| LCP             | < 1.5s       |
| CLS             | < 0.05       |
| JS bundle       | < 15 KB      |
| CSS total       | < 20 KB      |

---

## G. Deployment Steps for GitHub Pages

1. **Push code to `main` branch** on GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch → `main` / `/ (root)`**.
4. Click **Save**. GitHub will deploy within ~60 seconds.
5. (Optional) Add a custom domain under **Custom domain** and create a `CNAME` file in the repo root.
6. Confirm HTTPS is enforced (automatic with `*.github.io`).

There is no build command — GitHub Pages serves the static files directly.

---

## H. Performance & Accessibility Checklist

### Performance
- [x] No JavaScript framework — zero hydration cost.
- [x] Fonts loaded with `<link rel="preconnect">` + `font-display: swap`.
- [x] Images in WebP format, lazy-loaded with `loading="lazy"`.
- [x] All CSS/JS is vanilla and minifiable (no build step required, but can add one later).
- [x] No third-party scripts (analytics optional, self-hosted if added).
- [x] `<meta name="viewport">` set for mobile rendering.

### Accessibility
- [x] Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- [x] All images have `alt` attributes.
- [x] Color contrast ratios ≥ 4.5:1 (WCAG AA) — verified against the dark palette.
- [x] Keyboard navigation: all interactive elements are focusable and operable.
- [x] Skip-to-content link as the first focusable element.
- [x] `prefers-reduced-motion: reduce` disables all animations and transitions.
- [x] `prefers-color-scheme` media query ready (dark is default; light variant can be added).
- [x] ARIA labels on icon-only links (GitHub, LinkedIn, etc.).
- [x] Focus-visible outlines styled (not removed).
- [x] Mobile nav has focus trap and `aria-expanded` state.

---

## I. Security & Privacy Note for Hidden Pages

> **Important:** Pages at `/<date>` are "hidden" only in the sense that no link on the public site points to them. They are **not private**. Anyone with the URL can view them, and they may be indexed by search engines, discovered via browser history, or found in the GitHub repo's source code (which is public).
>
> **If you need actual privacy**, consider these alternatives (no backend required):
> - **Password-protected static pages** using client-side encryption (e.g., [StatiCrypt](https://github.com/robinmoisson/staticrypt)) — encrypts the HTML with AES and requires a password to view.
> - **Unlisted GitHub Gist** or a **Notion page with restricted sharing** for truly personal content.
> - **Add a `<meta name="robots" content="noindex, nofollow">` tag** to hidden pages to discourage (but not prevent) search engine indexing.
>
> The hidden pages in this implementation include the `noindex` meta tag and a `robots.txt` entry as best-effort measures, but these are **advisory, not enforceable**.

---

## J. Assumptions Made

- **Name:** Sarthak Agrawal (from workspace path).
- **Role focus:** Cybersecurity — offensive security, pentesting, CTFs.
- **Certifications:** Placeholder names used (OSCP, CEH, etc.) — replace with actuals.
- **Projects:** Placeholder content — replace with real project details.
- **Avatar:** A placeholder is referenced; add your own `assets/avatar.webp`.
- **No build tooling:** Intentionally zero-config. If you later want minification or Sass, add a `package.json` with a simple build script.
- **Single-page home:** All sections on one scrollable page (not multi-page) for maximum engagement and scroll-driven storytelling.
