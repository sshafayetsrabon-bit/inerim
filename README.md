# INERIM Interior — website, shop & CMS

React + Vite + Tailwind site for [inerimbd.com](https://inerimbd.com) with a built-in content management system.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/projects`, `/projects/:slug` | Portfolio with room-by-room galleries |
| `/services`, `/about` | Services, philosophy, process, quality checks, FAQ |
| `/shop`, `/shop/:slug` | Furniture, sheets, panels, hardware: filters, search, saved items, live fabric colour preview |
| `/quote` | Quote list → quotation request |
| `/colour-studio` | Recolour walls/fabrics on real renders, compare, download, send to a designer |
| `/pricing` | Instant price calculator (package rates come from the CMS) |
| `/partnership` | Partner programme + application form |
| `/journal`, `/journal/:slug` | Blog |
| `/contact` | Consultation booking |
| `/admin` | **CMS** |

## The CMS (`/admin`)

Edit products (photos, prices, finishes/colours, specs), journal articles (Markdown), projects, the Colour Studio palette,
contact details, the announcement bar and package rates. Every form on the site (quotes, bookings, partnership
applications, Colour Studio looks) arrives in **Enquiries**, where you can update status, reply on WhatsApp and export CSV.

* **First visit:** open `/admin` and choose a password (10+ characters). Do this right after the first deploy.
* **Backend:** `public/api/index.php`, one PHP file and no database. Data lives in `/home/<cpanel-user>/inerim-data/`
  (outside `public_html`, so deploys never overwrite it). It also keeps the last 30 backups of each collection.
* **Email alerts:** new enquiries are emailed to the address in *Site settings* if the host allows PHP `mail()`.
* Until something is saved in the CMS, the site shows the starter content in `src/lib/seed.ts`.
  Items marked **Sample** are placeholders; replace them with real products and prices.

## Develop

```bash
npm install
npm run dev
```

The dev server runs the real `public/api/index.php` in WebAssembly PHP (see `cms-dev-server.ts`), storing data in
`.cms-data/` (git-ignored). Delete that folder to start fresh.

## Deploy (cPanel)

```bash
npm run build
git add -A && git add -f dist
git commit -m "Update site"
git push origin main
```

Then pull/deploy in cPanel → Git Version Control. `.cpanel.yml` copies `dist/` into `public_html`, including `api/`.
