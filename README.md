# portfolio

Personal + professional portfolio — static site on GitHub Pages.

## Structure

| Route | What |
|-------|------|
| `/` | Personal home page (about, photos, interests, hobbies) |
| `/workprofile/` | Cybersecurity work portfolio (projects, CTFs, certs, timeline) |
| `/date/` | Hidden dating page (not linked publicly) |

## Stack

Vanilla HTML, CSS, JavaScript. Zero frameworks, zero build step.

## Local dev

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy

1. Push to `main`.
2. GitHub → Settings → Pages → Source: `main` / `/ (root)`.
3. Done.

## Customization

- **Home page content:** Edit `index.html`
- **Work profile content:** Edit `workprofile/index.html`
- **Colors / fonts:** Edit `css/theme.css`
- **Photos:** Replace placeholder gallery items in `index.html` with real `<img>` tags
- **Avatar:** Replace `assets/avatar.webp` (used on home hero + work profile)
