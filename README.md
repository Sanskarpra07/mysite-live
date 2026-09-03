# Sanskar Man Pradhan — Personal Portfolio

A personal portfolio website for **Sanskar Man Pradhan** — BCA student, content
writer/content handler, and static web designer based in Lalitpur, Nepal.

Built with **plain HTML, CSS and JavaScript** (no frameworks). Designed with a
dark, terminal-inspired developer theme. Live at
[sanskar-manpradhan.com.np](https://sanskar-manpradhan.com.np/).

---

## Pages & Structure

| Page | Purpose |
| --- | --- |
| `index.html` | Single-page portfolio: Hero, About, Experience & Education, Skills, Projects, Contact. |
| `blog/index.html` | Blog landing page listing all posts. |
| `blog/why-content-handling-matters.html` | Blog post on content structure & SEO. |
| `blog/static-web-design-basics.html` | Blog post on building clean static pages. |

Every major section is commented in the source so it is easy to find and edit.

---

## Files

- `index.html` — page structure and content (one comment per section).
- `css/style.css` — all styling. Colors and fonts are driven by CSS variables in
  `:root`; `[data-theme="light"]` holds the light-mode overrides.
- `js/main.js` — theme toggle, mobile menu, smooth scroll, animated
  mouse-tracking background, stats counters, scroll progress bar, and the
  built-in chat assistant.
- `assets/` — profile photos, downloadable CV (PDF), and supporting images.
- `blog/` — blog landing page and individual post pages.
- `sitemap.xml` — SEO crawl config listing every page for the live domain.
- `sitemap.xsl` — stylesheet that renders `sitemap.xml` in the browser with the
  same design as the site.
- `robots.txt` — points crawlers to the sitemap.
- `favicon.svg` — site favicon.

---

## Features

- **Dark / light theme toggle**, persisted in `localStorage` via the
  `data-theme` attribute on `<html>`.
- **Terminal-style visual theme** — layered grid and dot backgrounds with a
  green accent, plus a mouse-tracking spot effect on the hero.
- **Fully responsive** layout with a hamburger mobile menu.
- **Live chat assistant** — a small terminal-style AI chat built into the
  Contact section (no external widget).
- **Blog** for sharing content-writing and web-development articles.
- **SEO-friendly**:
  - JSON-LD **`Person` + `WebSite`** structured data linking the site to all
    social profiles (GitHub, LinkedIn, Facebook, Instagram, email) for
    search-engine entity recognition.
  - Open Graph / Twitter Card meta tags for nice social-sharing previews.
  - `canonical` URL, `robots.txt`, and a complete `sitemap.xml`.
- **Styled sitemap** — viewed in a browser, `sitemap.xml` renders as a
  clean, on-brand table thanks to `sitemap.xsl`.
- Downloadable **CV** and real profile imagery.

---

## Styling

Fonts are loaded from Google Fonts: **JetBrains Mono** for the terminal/dev text
and **Inter** for body copy. Icons come from **Font Awesome** via CDN.

---

## Accessibility & Performance

- Semantic HTML, skip-to-content link, and `aria-label`s throughout.
- Images set `loading="lazy"` (the hero image loads eagerly with
  `fetchpriority="high"`) and include `width`/`height` to avoid layout shift.
- The contact form posts to **Formspree**; a fake `_gotcha` honeypot filters
  bots.

---

## Deployment

Static site hosted on **GitHub Pages** with a custom domain configured via the
`CNAME` file. To push updates, commit and push to the deployed branch — GitHub
Pages serves the published files automatically.
