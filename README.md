# Sanskar Man Pradhan — Personal Portfolio

Single-page personal portfolio for Sanskar Man Pradhan (BCA student, content writer/content handler, and static web designer, Lalitpur, Nepal), built with vanilla HTML, CSS and JavaScript. Live at [sanskar-manpradhan.com.np](https://sanskar-manpradhan.com.np/).

## Files

- `index.html` — main structure, with a comment before every section (Hero, About, Timeline, Skills, Projects, Social, Contact).
- `css/style.css` — all styles. Re-theme by editing the CSS variables in `:root` at the top; light-theme overrides live in `body.theme-light`.
- `js/main.js` — page loader, theme toggle, mobile nav, animated canvas background, and scroll interactions.
- `assets/` — real profile photo, CV (PDF), and supporting images.
- `sitemap.xml` / `robots.txt` — SEO crawl config for the live domain.

## Features

- Dark/light theme toggle (persisted via `localStorage`), including a theme-aware animated particle background on the hero section.
- Responsive social links section (GitHub, LinkedIn, Facebook, Instagram, Email) with matching brand-color icon styling.
- JSON-LD `Person` structured data in `<head>` linking the site to all social profiles via `sameAs`, for search-engine entity disambiguation.
- Open Graph / Twitter Card meta tags for social sharing previews.
- Downloadable CV and real profile imagery (no placeholder assets remain).

## Styling

Fonts are loaded from Google Fonts: `Space Grotesk` for headings, `Inter` for body text. Icons via Font Awesome (CDN).

## Accessibility & Performance

- Semantic HTML, skip-to-content link, and `aria-label`s throughout.
- Images use `loading="lazy"` (except the above-the-fold profile photo, which loads eagerly with `fetchpriority="high"`) and `width`/`height` attributes to prevent layout shift.
- `webp` image sources with `jpg` fallback via `<picture>`.


## Deployment

Static site served via GitHub Pages, with a custom domain configured through the `CNAME` file.
