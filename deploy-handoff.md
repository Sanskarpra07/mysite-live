# Deploy handoff — MegaFoot shoe store

Read this file first when resuming work on another machine. It captures the
state of the shoe-store deployment as of 6 Oct 2026.

**Say this to continue:** *"Read `deploy-handoff.md` in mysite-live and pick up
where the last session left off."*

## The goal

Get the dynamic PHP + MySQL project **shoe_store** online and reachable from
the portfolio's projects section, so visitors can see it.

## Where things stand

### Done

| Item | Status |
| --- | --- |
| `shoe_store` made portable for shared hosting | pushed — `Sanskarpra07/shoe_store` @ `231bb17` |
| Static, browsable demo of the storefront | live — https://sanskarmanpradhan.com.np/shoe-store/ |
| Portfolio project card 03 (was "UI/UX Design Work") | replaced with MegaFoot, live + github links |
| Portfolio pushed | `Sanskarpra07/mysite-live` @ `828a671` |

### The portability fixes (shoe_store repo)

- `.htaccess` — no more `RewriteBase /shoe_store/`; redirect base is derived
  from `REQUEST_URI`, internal rewrites are relative, so the app runs at the
  domain root **or** in a sub folder. `backend/`, `database/`, `docs/`,
  `.sql/.md/.json` and dotfiles are blocked from HTTP.
- `backend/db_config.php` — reads `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
  from the environment, falls back to the XAMPP defaults.
- `backend/db.php` + `backend/payment_config.php` — HTTPS detected behind
  proxies (`X-Forwarded-Proto`) so payment callback URLs are `https://`.
- `database/setup.sql` — `CREATE DATABASE` / `USE` removed, so it imports into
  any panel-created database name. Select the target DB first in phpMyAdmin.

Verified locally at both the domain root (temp vhost) and a sub folder: home,
shop, product, cart, checkout, admin login + dashboard, legacy 301s, 403s on
sensitive paths.

### Still to do

1. **Create a PHP + MySQL hosting account** (InfinityFree / Byet.host — free,
   no card). Only the site owner can sign up (email verification), which is why
   this step is still open.
2. Upload the deploy package to `public_html` and extract it.
   - On the office laptop the package already exists:
     `C:\Users\Sanskar\Desktop\shoe_store-deploy.zip` (608 KB, 76 files).
   - It is **not in git**, so on any other machine rebuild it (see below).
3. Fill `backend/db_config.php` with the panel's DB host / name / user /
   password (or set the `DB_*` environment variables).
4. phpMyAdmin → select the database → Import → `database/setup.sql`.
5. Smoke test: `/` , `/shop.php`, `/admin/login.php` (admin / `password`).
6. Switch the portfolio card 03 **live** link from
   `https://sanskarmanpradhan.com.np/shoe-store/` to the real dynamic site URL.

### Rebuild the upload package on another machine

```powershell
# from a clone of the shoe_store repo
$stage = "$env:TEMP\shoe_store_stage"; $zip = "$env:TEMP\shoe_store-deploy.zip"
robocopy (Get-Location) $stage /E /XD .git /NFL /NDL /NJH /NJS /NP
Compress-Archive -Path "$stage\*" -DestinationPath $zip -Force
```

Note: use forward-slash entry names if you rebuild with .NET's ZipFile —
`Compress-Archive` on PowerShell 5.1 writes backslashes, which some Linux
File Managers extract incorrectly.

## Repos and paths

| Repo | Local path (office laptop) |
| --- | --- |
| `Sanskarpra07/mysite-live` (portfolio) | `C:\Users\Sanskar\Desktop\Design\mysite-live` |
| `Sanskarpra07/shoe_store` (project) | `C:\xampp\htdocs\shoe_store` |

On the home laptop: clone both fresh — **these paths will not exist there.**
XAMPP is only needed to render/export pages locally.

## Demo details

- Static demo folder: `shoe-store/` in this repo — 21 pages (home, shop, about,
  contact, cart, login, register, track order, 13 products) + `assets/`.
  It is a snapshot: a banner and a click-interceptor toast explain that cart,
  checkout, accounts and payments need the live PHP site.
- The demo was exported by fetching the running XAMPP site and rewriting
  `*.php` links to `.html`; product pages are `product-<id>.html`.
- Default logins (from the shoe_store README): admin / `password`,
  staff1 / `password`, customer `sita@example.com` / `customer123`.
- eSewa + Khalti keys in `backend/payment_config.php` are **sandbox** keys.
  Some free hosts block outbound PHP connections, so sandbox payments may not
  complete there.

## Gotchas learned in the last session

- Vercel, GitLab Pages and GitHub Pages cannot run PHP or MySQL — the dynamic
  store needs real PHP + MySQL hosting.
- A relative `RewriteRule` target works for internal rewrites but produces a
  broken URL in a `R=301` on Windows; derive the redirect base from
  `REQUEST_URI` instead.
- The `RewriteCond %{ENV:REDIRECT_STATUS} !200` guard is required, otherwise
  the canonical redirect fires during the internal rewrite pass and redirects
  every page to itself.
