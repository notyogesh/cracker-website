# Cracker Shop

Sivakasi crackers storefront built with **Next.js 16 + Payload CMS 3 + PostgreSQL + Tailwind CSS 4**.

Customers build a cart from the price list and send it as an **estimate** (no online payment). The shop
confirms by phone/WhatsApp and manages each estimate in the admin panel.

## Run locally

Requirements: Node 20+, pnpm, and Postgres (Docker is easiest).

```bash
docker compose up -d      # starts Postgres on 5433 (db: cracker_shop, user/pass: postgres)
cp .env.example .env      # then set PAYLOAD_SECRET to a long random string
pnpm install
pnpm import:mkbro         # MK Bro Crackers catalogue (157 products with cleaned photos)
pnpm dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin (the first visit asks you to create the admin user)

In development Payload creates and updates the database tables automatically. Before going to production,
switch to migrations (`pnpm payload migrate:create` / `pnpm payload migrate`).

## What's where

| Path | Purpose |
|---|---|
| `src/collections/Products.ts` | Products: name, unit, MRP, price, image, stock, featured |
| `src/collections/Categories.ts` | Categories with sort order |
| `src/collections/Orders.ts` | Estimates placed from the cart, with status workflow (admin-only access) |
| `src/globals/Settings.ts` | Shop name, phone, WhatsApp, address, PESO licence, minimum order by state, blocked states |
| `src/app/(frontend)/price-list` | Full price list with quantity inputs (main ordering page) |
| `src/app/(frontend)/cart/actions.ts` | Server action that validates and saves an estimate. Prices are re-read from the database |
| `src/app/(frontend)/order/[orderNumber]` | Confirmation page with a pre-filled WhatsApp message |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Sitemap and robots.txt |

## Product photos

`pnpm images:clean <input-dir> <output-dir>` turns phone photos into catalogue images: AI background
removal (runs locally, no paid service), tight crop, colour fix, product centred on a white 1000×1000
square, saved as WebP. Re-running skips files already done. Photos it lists as "cut along outer
outline" had light packaging the AI wasn't sure about; give those a quick look.

## SEO built in

- Per-page titles, descriptions and canonical URLs
- JSON-LD: `Store` (sitewide), `Product` + `Offer` (product pages), `BreadcrumbList`
- Sitemap of home, price list, categories and products; cart/order pages are `noindex`
- Pages are statically generated and refreshed whenever a product, category or setting is saved in the admin

Set `NEXT_PUBLIC_SITE_URL` to your real domain in production so canonical URLs and the sitemap are correct.

## Before launch

- Fill in **Shop settings** in the admin (real phone, WhatsApp number, address, PESO licence number).
- Add product photos with alt text.
- Add blocked states if local rules stop you delivering somewhere.
- Add an email adapter (e.g. Resend) if you want estimate notifications by email.
