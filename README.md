# portfolio

Personal cybersecurity portfolio — static site hosted on GitHub Pages.

## Stack

Vanilla HTML, CSS, and JavaScript. Zero frameworks, zero build step.

## Local development

Open `index.html` in a browser, or serve with any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

1. Push to `main`.
2. GitHub → Settings → Pages → Source: `main` / `/ (root)`.
3. Done.

## Customization

- **Content:** Edit `index.html` directly — all sections are in one file.
- **Colors/fonts:** Edit `css/theme.css` custom properties.
- **Hidden pages:** Create `<date>/index.html` folders (see `2026-04-15/` for an example).
- **Avatar:** Replace `assets/avatar.webp` with your own (160×160, WebP recommended).

See [BLUEPRINT.md](BLUEPRINT.md) for the full architecture spec.
