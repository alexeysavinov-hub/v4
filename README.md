# TOP APP GAMES — Website

Mobile-first marketing site for **TOP APP GAMES**, an independent European mobile game
studio based in Cyprus — makers of **LUDUS · Strategy Battle PvP** and **Siege Arena**.

Premium-dark one-pager: sticky pill navigation with a full-screen mobile menu and
active-section highlight, animated hero with parallax glows and a drifting pixel-dust
backdrop, two featured titles with official store buttons, a collapsible "Meet the team"
section, a newsroom with article previews, and a contact form with client-side validation.

## Tech

- Static site — **no build step**. Plain HTML + CSS + vanilla JS.
- Fonts: Space Grotesk + Outfit (Google Fonts).
- All animation is transform/opacity only (60fps on mobile), `prefers-reduced-motion` respected.
- Backdrop variants are wired via `data-bg` on `<html>`: pixels-drift (default), pixels, aurora, grid, dots, scanlines, off.

## Structure

```
index.html       Entry point — all markup
site/site.css    Design tokens + all component styles
site/site.js     Nav, slide-in menu, scroll reveals, parallax, team collapse, form
assets/          Logo, game key art, pixel backdrop tile
```

## Run locally

```
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Works as-is on GitHub Pages, Vercel or any static host. All paths are relative.

## Notes

- Team headshots load from external URLs — swap for self-hosted images if you prefer
  the site fully self-contained.

© 2026 TOP APP GAMES LTD · All rights reserved
