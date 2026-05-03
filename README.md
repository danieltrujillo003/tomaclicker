# Tomaclicker

A tomato-themed “Cookie Clicker”–style tap experience. See [CHANGELOG.md](CHANGELOG.md) for version history and technical notes.

## Repository layout

| Path | Purpose |
|------|---------|
| [play/](play/) | Game UI (`index.html`, `style.css`, `main.js`). Entry point for players. |
| [info/](info/) | Simple app info page; reads `version` and `lastUpdated` from `config.json`. |
| [assets/](assets/) | Images, audio, and [assets/icons/](assets/icons/) (favicons, [site.webmanifest](assets/icons/site.webmanifest)). |
| [config.json](config.json) | App metadata (`version`, `lastUpdated`); consumed by `play/main.js` and `info/main.js`. |

Pretty URLs assume the repo root is the HTTP document root: `/play/`, `/info/`, and `/config.json` (or same paths with `index.html`).

## Local development

This project uses **ES modules** and `fetch()` for `config.json`. Opening HTML from `file://` often breaks modules or cross-origin fetches, so use a **static HTTP server from the repository root** (not from `play/` alone).

Examples:

```bash
cd /path/to/tomaclicker
python3 -m http.server 8000
```

Then open `http://localhost:8000/play/` in the browser.

Alternatively, any static server that serves the repo root works (for example `npx serve .`).

## Deployment

Host the **entire repository** as the site root so relative URLs resolve correctly:

- Game: `https://your.domain/play/` (or `/play/index.html`)
- Info: `https://your.domain/info/`
- Version file must be reachable at `https://your.domain/config.json` (sibling of `play/` and `info/`)

If you deploy under a subpath (for example `https://example.com/tomaclicker/play/`), update asset and `fetch('../config.json')` paths accordingly, or add a small base URL indirection.

## Versioning

Bump `version` and set `lastUpdated` (ISO date `YYYY-MM-DD`) in [config.json](config.json), and document changes in [CHANGELOG.md](CHANGELOG.md).
