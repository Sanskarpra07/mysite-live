# Sanskar Man Pradhan — Portfolio

My personal portfolio site. Content writer, content handler, and static web
designer based in Lalitpur, Nepal. Built with plain HTML, CSS, and JavaScript —
no frameworks, no build tools, just files served as-is. Live at
[sanskar-manpradhan.com.np](https://sanskar-manpradhan.com.np/).

---

## What's on the site

- **Single-page portfolio** — Hero, About, Experience & Education, Skills,
  Projects, Contact. Everything on one page.
- **Blog** — a separate section with articles on content handling and static web
  design.

| Page | What it does |
| --- | --- |
| `index.html` | The portfolio itself — all sections, one scroll. |
| `blog/index.html` | Blog landing page listing all posts. |
| `blog/why-content-handling-matters.html` | Why content structure and maintenance matter more than design. |
| `blog/static-web-design-basics.html` | Why a static page is the right call for most small projects. |

---

## Files

- `index.html` — the page. Sections are commented so they're easy to find.
- `css/style.css` — all styling. Colors and fonts live in CSS variables in
  `:root`; `[data-theme="light"]` handles the light mode overrides.
- `js/main.js` — theme toggle, mobile menu, smooth scroll, mouse-tracking
  background, stats counters, scroll progress bar, and the chat assistant.
- `assets/` — profile photos, downloadable CV (PDF), and supporting images.
- `blog/` — blog pages.
- `404.html` — custom 404 page.
- `sitemap.xml` — every page listed for search crawlers.
- `sitemap.xsl` — makes `sitemap.xml` render as a clean table in the browser.
- `robots.txt` — points crawlers to the sitemap.
- `favicon.png` — site favicon.
- `favicon.svg` — vector version.
- `CNAME` — custom domain config for GitHub Pages.

---

## Features

- **Dark / light theme** — toggled via `data-theme` on `<html>`, persisted in
  `localStorage`.
- **Terminal-style look** — layered grid and dot backgrounds, green accent, mouse
  tracking spot on the hero.
- **Fully responsive** — hamburger menu on mobile, fluid layout throughout.
- **Chat assistant** — a terminal-style widget in the Contact section. No
  external service, just JavaScript.
- **Blog** — for content writing and web development articles.
- **SEO** — JSON-LD structured data (Person + WebSite), Open Graph and Twitter
  Card meta tags, canonical URLs, robots.txt, and a full sitemap.
- **Styled sitemap** — open `sitemap.xml` in a browser and it renders as an
  on-brand table.
- **Downloadable CV** and real profile photos, not stock images.

---

## How it's built

Fonts come from Google Fonts — JetBrains Mono for terminal/developer text, Inter
for body copy. Icons are from Font Awesome via CDN. Everything else is hand-coded.

The contact form posts to Formspree. A fake `_gotcha` field filters bots.

Semantic HTML throughout — skip-to-content link, `aria-label`s on interactive
elements, `loading="lazy"` on images (the hero loads eagerly with
`fetchpriority="high"`), and `width`/`height` set to prevent layout shift.

---

## Hosting

Static site on GitHub Pages with a custom domain. Push to the deployed branch
and GitHub Pages serves it automatically — no build step, no deployment pipeline.
