# Aarkledger Website

Clean, professional single-page marketing site for Aarkledger Financial Consultancy,
built with **Next.js 14 (App Router)** and ready to deploy on **Vercel** and link to
**aarkledger.com** via your **Cloudflare DNS**.

## What's on the page

- **Hero** — positioning + two CTAs (book a discovery call, view pricing)
- **Services** — bookkeeping, tax, reporting, payroll, FP&A, ERP
- **Pricing** — Starter / Growth / Corporate retainers with a **CA / US / PH** currency toggle
- **Engagements** — project & à la carte services
- **About** — multi-jurisdiction positioning + stats
- **Contact** — all CTAs open an email to `louie@aarkledger.com` (no backend needed)

The contact buttons use a prefilled `mailto:` link, so the site is fully static — nothing
to maintain server-side.

---

## Run locally (optional)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

> Note: the `node_modules/` and `.next/` folders in this download were created during a
> test build and are safe to delete. They're already in `.gitignore` and are never deployed.

---

## Deploy to Vercel

### Option A — Git (recommended, gives auto-deploys)

1. Create a new repository on GitHub (e.g. `aarkledger-site`) and push this folder to it.
2. Go to **vercel.com → Add New… → Project**, import the repo.
3. Framework preset auto-detects **Next.js** — leave all build settings at their defaults.
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in ~1 minute.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel        # first run links/creates the project
vercel --prod # production deployment
```

---

## Connect aarkledger.com (Cloudflare DNS)

Your domain's nameservers are at **Cloudflare**, so you add the records in the
**Cloudflare dashboard**, not in Vercel.

### Step 1 — Add the domain in Vercel
Vercel project → **Settings → Domains** → add `aarkledger.com` **and** `www.aarkledger.com`.
Vercel will show the exact records it wants (they match the values below).

### Step 2 — Add the records in Cloudflare
Cloudflare dashboard → select **aarkledger.com** → **DNS → Records → Add record**:

| Type  | Name  | Value / Target          | Proxy status            |
|-------|-------|-------------------------|-------------------------|
| A     | `@`   | `76.76.21.21`           | **DNS only** (grey cloud) |
| CNAME | `www` | `cname.vercel-dns.com`  | **DNS only** (grey cloud) |

> ⚠️ **Set both to "DNS only" (grey cloud), not Proxied (orange cloud).**
> If Cloudflare's proxy is on, it terminates SSL itself and Vercel can't issue its
> certificate — the domain gets stuck on "Invalid Configuration." Grey-cloud it.

### Step 3 — Wait & verify
Back in Vercel → **Settings → Domains**, the domain flips to **Valid** and a free SSL
certificate is issued automatically (usually a few minutes; up to ~1 hour for DNS to
propagate). Choose whether `www` redirects to the apex or vice-versa — Vercel offers a
one-click redirect.

---

## ⚠️ Protect your Google Workspace email

Your email `louie@aarkledger.com` works because of existing **MX / TXT records** in
Cloudflare. The website records above (A + CNAME) are **separate** and do not affect email
— as long as you only **add** the two records above and **don't edit or delete** these:

- **MX** records pointing to Google (`smtp.google.com`, or the older `ASPMX.L.GOOGLE.COM`
  set) — route your incoming mail.
- **TXT** records: your **SPF** (the `v=spf1 ... include:_spf.google.com ...` record),
  **DKIM** (`google._domainkey`), and any **DMARC** (`_dmarc`) record.

Leave all MX and email-related TXT records exactly as they are. Only touch the `@` (A) and
`www` (CNAME) records for the website.

---

## Editing content

Everything lives in two files:

- `app/page.js` — all text, services, pricing tiers, and engagement list (plain JS arrays
  near the top — easy to edit).
- `app/globals.css` — colors (see the `:root` variables), spacing, and layout.

To change the brand colors, edit `--navy` and `--accent` at the top of `globals.css`.

---

## Next steps you might want later

- **Real contact form** — swap the `mailto:` for a Vercel serverless function + an email
  API (e.g. Resend) if you'd rather collect submissions than open the user's mail client.
- **Booking link** — point the "Book a discovery call" buttons at a Calendly/Google
  scheduling URL.
- **Logo & favicon** — drop an `icon.png` (and `opengraph-image.png`) into the `app/`
  folder; Next.js picks them up automatically.
