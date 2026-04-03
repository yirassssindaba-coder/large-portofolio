# PulseBoard Fusion

## Overview
PulseBoard Fusion (v1.7.0) is a cinematic, modern, interactive web-based portfolio and dashboard system. It acts as a hub for multiple "worlds": a global country atlas (World Explorer), a botanical reference (Green Atlas), a wildlife compendium (Wild Echo), a technology capability map (Tech Forge), and a WebGL-based farm simulation (Farm World).

### v1.7.1 Highlights
- **Farm World — Harvest/Plant**: Crops now disappear when harvested (set to stage 0, hidden). They only grow back when explicitly replanted via the panel action. Growth progresses through 3 visible stages with a timer system.
- **Farm World — Controls as Tooltip**: The always-visible controls help panel has been replaced with a small `?` trigger button (bottom-right corner). Pressing `?` or clicking the button shows/hides a compact tooltip overlay. Press Escape or click ✕ to close.
- **Farm World — Pet Shop**: Added 6 new cute pets (Hamster, Domba/Sheep, Penguin, Bebek/Duck, Beruang/Bear, Corgi) on top of the existing 6. Each pet has a unique 3D model with distinctive features. 12 pets total.
- **Farm World — Mobile Controls**: Added a dedicated `Run` button (hold to sprint), a camera drag area on the right half of the screen for mobile look control, and improved button labels with emoji icons.

### v1.7.0 Highlights
- **Farm World**: Dynamic day/night sky (11 time keyframes), sun/moon orbs, 900-star particle system, 6 animated cloud groups, 4 chickens (pecking), 2 pigs, 2 sheep, Windmill (rotating sails), Bakery (chimney, glow), XP/Level system, 7-type quest pool, harvest float particles, coin float animations, seasonal clock, building glow rings
- **Post Studio Charts**: Rewritten SVG charts — Y-axis value labels, bar value annotations, "Belum ada data" empty states, improved grid lines with axis lines, donut chart with inner fill circle and percentage legend, `shortNum()` helper, `analytics-donut-wrap` for donut+legend layout

## Architecture
- **Runtime:** Node.js (no build step required)
- **Server:** Native `node:http` module — no Express or external frameworks
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics:** Three.js (in `/vendor/three`)
- **Database:** JSON flat files in `/db` directory

## Project Structure
- `server.js` — Main Node.js HTTP server (serves static files + REST API)
- `index.html` — Main portal page
- `script.js` — Core UI/data logic
- `farm-world.js` — WebGL farm game logic
- `world-explorer.js` — 3D globe with Three.js
- `styles.css` — All styles
- `/db/` — JSON flat file "database" (items, posts, analytics, comments, etc.)
- `/assets/` — Images, videos, and data snapshots
- `/docs/` — PDF documents for each compendium
- `/vendor/` — Three.js and controls

## Running the App
```bash
node server.js
```
Server runs on `0.0.0.0:5000` by default. Use `PORT` env var to override.

## Configuration
- `PORT` — Server port (default: 5000)
- `ADMIN_TOKEN` — Admin authentication token (default: `roberto2026andpassword`)

## Pages
- `/` — Main portal (index.html)
- `/world` — 3D World Atlas
- `/tanaman` — Green Atlas (Plants)
- `/binatang` — Wild Echo (Animals)
- `/teknologi` — Tech Forge (Technology)
- `/game` — Farm World (WebGL game)
- `/posts` — Post Studio / Blog
- `/portfolio` — Portfolio
- `/manager` — Content Manager
- `/analytics` — Analytics dashboard
