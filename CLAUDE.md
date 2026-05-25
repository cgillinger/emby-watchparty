# CLAUDE.md

## ⚠️ REPOSITORY SAFETY — READ FIRST

This is a FORK: `cgillinger/emby-watchparty` (forked from `Oratorian/emby-watchparty`).

**RULES — never violate these:**

1. **NEVER** create a pull request against `Oratorian/emby-watchparty`
2. **NEVER** push to any remote other than `cgillinger/emby-watchparty`
3. **Before every `git push`**, run `git remote -v` and verify the origin URL contains `cgillinger/`
4. **NEVER** run `gh pr create` without explicitly specifying `--repo cgillinger/emby-watchparty`
5. If uncertain about any git operation's target, **stop and ask the user**

## Project Overview

emby-watchparty is a Flask/Socket.IO web app that proxies an Emby media server for synchronized video playback with built-in chat.

### Tech Stack

- **Backend:** Python 3.12, Flask, Socket.IO (gevent), Jinja2 templates
- **Frontend:** Vanilla JS/CSS (no build step), served directly by Flask
- **Config:** `.env` file loaded by `src/config.py`
- **Deployment:** Docker (`Dockerfile`), runs via `run_production.py`

### Key Directories

```
templates/          — Jinja2 HTML (party.html is the main view)
static/css/         — style.css (CSS variables, data-theme system)
static/js/          — ui.js, video.js, library.js, chat.js, sync.js, party.js, state.js, theme.js
src/                — Python backend
src/routes/         — Flask routes (pages, auth, library, media, hls, party_api)
src/socket_handlers/— Socket.IO handlers (sync, party, chat, playback, drift, quality)
src/config.py       — Loads .env configuration
mockups/            — Static HTML/PNG design mockups (reference only, not served by app)
```

### Theme System

Themes use `data-theme` attribute on `<body>` and CSS variables. `theme.js` handles switching and persists selection in localStorage. Theme selector is a `<select id="themeSelector">` in the header.

### Critical JS Dependencies

The following JS files contain functionality tied to specific DOM element IDs and classes. When editing HTML, check these files for references before renaming or removing elements:

- `video.js` (~674 lines) — HLS player, playback controls
- `sync.js` (~203 lines) — Socket.IO sync events
- `library.js` (~533 lines) — Emby library browsing
- `chat.js` (~68 lines) — Chat messaging
- `party.js` (~189 lines) — Party creation/joining
- `ui.js` (~257 lines) — UI interactions, modals

### Live Deployment

The app is currently deployed at `http://192.168.50.8:5000` (LAN). You can fetch this URL to see the current production UI before making changes.

## Workflow

- Branch from `main` for feature work
- Commit frequently with descriptive messages
- Test HTML/CSS/JS changes by opening templates in browser or running `python run_production.py`
- All pushes go to `origin` which is `cgillinger/emby-watchparty` — verify with `git remote -v`
