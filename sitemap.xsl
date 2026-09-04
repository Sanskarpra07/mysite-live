<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="en" data-theme="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>~/sitemap — Sanskar Man Pradhan</title>
        <style>
          /* ===== design tokens (match site) ===== */
          :root {
            --bg: #0a0a0a;
            --surface: #111111;
            --surface-2: #161616;
            --border: #2e2e2e;
            --text: #e5e5e5;
            --text-bright: #ffffff;
            --text-dim: #9a9a9a;
            --text-faint: #5a5a5a;
            --accent: #00ff88;
            --accent-ink: #001a0e;
            --accent-glow: rgba(0,255,136,0.35);
            --grid-line: rgba(255,255,255,0.05);
            --dot-base: rgba(255,255,255,0.07);
            --dot-bright: var(--accent);
            --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
            --container: 1100px;
            --radius: 12px;
            --radius-sm: 8px;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body {
            font-family: var(--font-sans);
            background: var(--bg); color: var(--text);
            line-height: 1.6; min-height: 100vh;
            -webkit-font-smoothing: antialiased;
          }
          a { color: inherit; text-decoration: none; }
          ul { list-style: none; }

          /* layered background */
          .bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
          .bg-grid {
            background-image:
              linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
              linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
            background-position: -1px -1px;
            background-size: 96px 96px;
          }
          .bg-dots-base {
            background-image: radial-gradient(circle, var(--dot-base) 1px, transparent 1.4px);
            background-size: 24px 24px;
          }
          .bg-vignette {
            background: radial-gradient(ellipse at top, transparent 0%, var(--bg) 78%);
            opacity: 0.8;
          }

          .container {
            max-width: var(--container);
            margin: 0 auto;
            padding: 0 clamp(18px, 4vw, 32px);
          }

          /* header (sticky, matches site) */
          #site-header {
            position: sticky; top: 0; z-index: 500;
            background: var(--bg);
            border-bottom: 1px solid var(--border);
          }
          .navbar {
            display: flex; align-items: center;
            justify-content: space-between;
            gap: 16px; padding: 14px 0;
          }
          .brand {
            display: flex; align-items: center; gap: 6px;
            font-family: var(--font-mono);
            font-weight: 600; font-size: 0.95rem; color: var(--text);
            flex-shrink: 0;
          }
          .brand-glyph { color: var(--accent); }
          .nav-links {
            display: flex; align-items: center; gap: 2px;
            flex: 1; justify-content: center;
          }
          .nav-links a {
            font-family: var(--font-mono);
            font-size: 0.82rem; font-weight: 500;
            color: var(--text-dim);
            padding: 7px 12px; border-radius: var(--radius-sm);
            transition: color 0.2s ease, background 0.2s ease;
          }
          .nav-links a:hover { color: var(--text-bright); background: var(--surface-2); }
          .nav-links a.active { color: var(--accent); }

          main { position: relative; z-index: 1; }

          /* section */
          .section { padding: clamp(56px, 8vw, 96px) 0; border-top: 1px solid var(--border); }
          .section-head { display: flex; align-items: flex-start; gap: 18px; margin-bottom: 40px; }
          .section-id {
            font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700;
            color: var(--text-faint); padding-top: 6px;
          }
          .section-head h1 {
            font-size: clamp(1.6rem, 3.5vw, 2.2rem);
            font-weight: 700; color: var(--text-bright);
            letter-spacing: -0.02em; line-height: 1.2;
          }
          .section-path {
            font-family: var(--font-mono); font-size: 0.8rem;
            color: var(--text-faint); margin-top: 4px;
          }
          .section-path::before { content: "$ cd "; }
          .availability {
            display: inline-flex; align-items: center; gap: 8px;
            font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.05em;
            color: var(--text-dim); margin-bottom: 20px;
          }
          .dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: var(--accent); box-shadow: 0 0 8px var(--accent-glow);
          }

          /* table styled like site cards */
          .table-card {
            border: 1px solid var(--border);
            border-radius: var(--radius);
            background: var(--surface);
            overflow: hidden;
          }
          table { width: 100%; border-collapse: collapse; }
          th {
            text-align: left; font-family: var(--font-mono);
            font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.06em; color: var(--text-faint);
            background: var(--surface-2);
            border-bottom: 1px solid var(--border);
            padding: 12px 18px;
          }
          td {
            border-bottom: 1px solid var(--border);
            padding: 13px 18px; font-size: 0.85rem; vertical-align: middle;
          }
          tr:last-child td { border-bottom: none; }
          td.loc a {
            font-family: var(--font-mono); color: var(--text-bright);
            transition: color 0.2s; word-break: break-all;
          }
          td.loc a:hover { color: var(--accent); }
          .muted { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim); }
          .tag {
            display: inline-block; font-family: var(--font-mono);
            font-size: 0.7rem; color: var(--accent);
            border: 1px solid var(--accent-dim, rgba(0,255,136,0.35));
            border-radius: 999px; padding: 2px 10px;
          }

          .foot-note {
            font-family: var(--font-mono); font-size: 0.78rem;
            color: var(--text-faint); margin-top: 18px;
          }

          @media (max-width: 700px) {
            .nav-links { display: none; }
            .hide-mobile { display: none; }
            th, td { padding: 10px 12px; }
          }
        </style>
      </head>
      <body>
        <div class="bg-layer bg-grid" aria-hidden="true"></div>
        <div class="bg-layer bg-dots-base" aria-hidden="true"></div>
        <div class="bg-layer bg-vignette" aria-hidden="true"></div>

        <header id="site-header" role="banner">
          <nav class="navbar container" aria-label="Primary navigation">
            <a href="/" class="brand" aria-label="Homepage">
              <span class="brand-glyph" aria-hidden="true">~/</span>
              <span class="brand-name">sanskar</span>
            </a>
            <ul class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#experience">Experience</a></li>
              <li><a href="/#skills">Skills</a></li>
              <li><a href="/#projects">Projects</a></li>
              <li><a href="/#contact">Contact</a></li>
              <li><a href="/blog/">Blog</a></li>
              <li><a href="/sitemap.xml" class="active">Sitemap</a></li>
            </ul>
          </nav>
        </header>

        <main id="main">
          <section class="section container" aria-labelledby="sitemap-heading">
            <div class="availability"><span class="dot" aria-hidden="true"></span><span>SITEMAP</span></div>
            <div class="section-head">
              <span class="section-id">07</span>
              <div>
                <h1 id="sitemap-heading">Sitemap</h1>
                <p class="section-path"><xsl:value-of select="count(sm:urlset/sm:url)" /> urls · sanskar-manpradhan.com.np</p>
              </div>
            </div>

            <div class="table-card">
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th class="hide-mobile">Priority</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sm:urlset/sm:url">
                    <tr>
                      <td class="loc"><a href="{sm:loc}"><xsl:value-of select="sm:loc" /></a></td>
                      <td class="muted hide-mobile"><xsl:value-of select="sm:priority" /></td>
                      <td><span class="tag"><xsl:value-of select="sm:changefreq" /></span></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>

            <p class="foot-note"># machine-readable at /sitemap.xml — submitted via robots.txt</p>
          </section>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
