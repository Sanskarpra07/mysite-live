# Sanskar Man Pradhan — Portfolio

My personal portfolio site. I'm a content writer, content handler, and static web
designer based in Lalitpur, Nepal. The site is built with plain HTML, CSS, and
JavaScript — no frameworks, no build tools. Every file is served exactly as it
is written.

Live at [www.sanskarmanpradhan.com.np](https://www.sanskarmanpradhan.com.np/).

---

## What's on the site

| Page | What it does |
| --- | --- |
| `index.html` | The main portfolio. Hero, About, Experience, Skills, Projects, and Contact all live on this one page. |
| `mini-projects.html` | Six small interactive tools I built to practise JavaScript. |
| `music.html` | A self-hosted audio player for five recorded tracks. |
| `blog/index.html` | The blog, listing every post. |
| `blog/why-content-handling-matters.html` | Why content structure and upkeep matter more than design. |
| `blog/static-web-design-basics.html` | Why a plain static page is the right call for most small projects. |
| `shoe-store/` | Static demo of MegaFoot, my PHP + MySQL shoe store (linked from the projects section). |
| `404.html` | A custom "page not found" page, styled like a terminal error. |

### The mini projects

Each one is a single self-contained demo on `mini-projects.html`:

- **Pomodoro timer** — a work timer with short and long break modes.
- **To-do list** — add, complete, and delete tasks. Saved in the browser, so it survives a refresh.
- **Calculator** — four functions, with a hand-written expression parser instead of `eval`.
- **Password generator** — random passwords with a live strength meter.
- **Dice roller** — roll two dice, with a history of recent rolls.
- **Word counter** — live word, character, sentence, and reading-time counts. Useful for writing.

---

## Features

- **Dark and light themes** — toggled from the nav bar. Your choice is remembered
  in the browser between visits, and the correct theme is applied before the page
  paints, so there's no flash of the wrong colours.
- **Terminal-inspired design** — a layered grid-and-dot background, a green accent
  colour, and a spotlight that follows your cursor on the hero.
- **Chat assistant** — a small terminal-style widget in the Contact section that
  answers questions about me. It's plain JavaScript running in the page; nothing
  is sent to a third-party service.
- **Fully responsive** — a hamburger menu on mobile, fluid layout throughout.
- **Search engine basics** — structured data (JSON-LD), social preview tags,
  canonical URLs, `robots.txt`, and an XML sitemap.
- **Readable sitemap** — open `sitemap.xml` in a browser and it renders as a
  styled table instead of raw XML.
- **Accessible markup** — a skip-to-content link on the main pages, `aria-label`s
  on interactive elements, labelled form fields, and `autocomplete` hints so
  browsers can fill the contact form.
- **Downloadable CV** and real photographs rather than stock images.

---

## How it's put together

Fonts come from Google Fonts (JetBrains Mono for the terminal-flavoured text,
Inter for body copy) and icons from Font Awesome, both loaded from a CDN.
Everything else is hand-written.

The contact form posts to [Formspree](https://formspree.io/), a hosted form
service. A hidden decoy field catches automated spam submissions.

`js/main.js` is loaded with `defer`, which means the browser downloads it while
still reading the page and runs it once the HTML is parsed. Every page repeats
one short inline script in its `<head>` to apply the saved theme before first
paint — that inline copy is deliberate, and it is what prevents the theme flash.

---

## Files

```
index.html              Main portfolio page
music.html              Music player
mini-projects.html      The six demos
404.html                Custom not-found page
blog/                   Blog index and posts

css/style.css           All styling for every page
css/mini-projects.css   Styling specific to the mini projects

js/main.js              Theme toggle, menu, scroll effects, music player, chat
js/mini-projects.js     Logic for the six demos

assets/                 Photos, the CV (PDF), and audio tracks
sitemap.xml             Every page listed for search engines
sitemap.xsl             Makes that sitemap render as a styled table
robots.txt              Points crawlers to the sitemap
favicon.png / .svg      Site icons
CNAME                   Custom domain setting for GitHub Pages
```

Colours and fonts are defined once as CSS variables at the top of
`css/style.css`. The light theme is a single block of overrides just below them,
so changing the palette means editing one place rather than hunting through the
stylesheet.

---

## Running it locally

There's no build step, so any static file server works. From the project folder:

```bash
npx serve .
```

Then open the address it prints. Opening `index.html` directly from the file
system mostly works, but a real server is closer to how the site is actually
hosted.

---

## Common changes

**Update the copy or sections** — edit `index.html`. Each section has an HTML
comment marking where it starts and ends.

**Change the colours** — edit the variables in the `:root` block at the top of
`css/style.css`, and the `[data-theme="light"]` block below it for light mode.

**Add a music track** — drop the audio file into `assets/audio/`, then add an
entry to the `musicTracks` array near the top of `js/main.js`. The player builds
its own track list from that array.

**Write a blog post** — copy an existing file in `blog/`, rename it, and update
the `<title>`, meta description, canonical URL, and Open Graph tags. Then add a
card to the grid in `blog/index.html` and a new entry in `sitemap.xml`.

---

## Security and privacy follow-up

Repository review on 2026-10-26: these items are still open unless noted below.
The site is static GitHub Pages content, with no site-side login or database.
Fixed in this review: the shoe-store notification helper now displays message
content as text instead of injecting it as HTML, preventing markup-based script
injection through notification messages.

- [ ] **Add a privacy notice.** Explain that contact form submissions (name,
  email, subject, and message) are sent to Formspree. Disclose GoatCounter
  analytics and link to both providers' privacy information. No notice was
  found in the site pages.
- [ ] **Review public personal information.** Check the downloadable CV for
  details and PDF metadata that should not be public. Review the published email,
  photographs, and social links as well. This review has not been documented.
- [ ] **Reduce third-party requests.** Consider self-hosting Google Fonts,
  Font Awesome, Bootstrap, and SweetAlert assets used by the portfolio and
  shoe-store demo. Bootstrap references use version 5.3.3 and Bootstrap Icons
  1.11.3, but SweetAlert uses the floating `@11` version; externally hosted
  resources found in the pages do not have Subresource Integrity attributes.
- [ ] **Plan a Content Security Policy.** The pages contain inline scripts and
  load assets from several external providers, so inventory those dependencies
  and move inline scripts into files before enforcing a restrictive policy.
  No CSP or documented CSP plan was found. Start with a report-only policy if
  the hosting setup allows it.
- [ ] **Check deployment security settings.** Confirm GitHub Pages has Enforce
  HTTPS enabled. Review the response headers the hosting setup can provide;
  this cannot be confirmed from the repository. GitHub Pages does not use
  `.htaccess`.
- [ ] **Use the `www` hostname consistently.** `CNAME` is set to
  `www.sanskarmanpradhan.com.np`, but canonical URLs, Open Graph URLs, structured
  data, the sitemap, and other absolute links still use the apex hostname.
  Update them to `https://www.sanskarmanpradhan.com.np/` and confirm the redirect.

---

## Hosting

The site is hosted on GitHub Pages with a custom domain. Pushing to the
deployed branch publishes the changes automatically — there is no build step and
no deployment pipeline to maintain.
