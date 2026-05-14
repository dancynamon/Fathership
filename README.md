# Fathership

A 3PL platform for **pallet and truckload freight** — instant multi-carrier rates,
one-click booking, real-time tracking, and a carrier loadboard. Modeled loosely
on Mothership; built as a POC.

## Status: proof of concept → real rates path wired

Today the app runs end-to-end with **mock rates** by default
(`RATES_PROVIDER=mock`). Direct carrier providers for **FedEx Freight**,
**Estes Express**, and **Old Dominion (ODFL)** are scaffolded and activate
the moment you drop their credentials into `.env` and set
`RATES_PROVIDER=live`. See [`docs/CARRIERS.md`](./docs/CARRIERS.md) for the
sign-up walkthrough — all three carriers are free with a shipper account.

## Stack

- **Next.js 14** (App Router, RSC)
- **TypeScript**, **TailwindCSS**
- **Prisma** + SQLite (swap to Postgres for prod — change one line in `schema.prisma`)
- **iron-session** + **bcrypt** for auth
- **zod** for input validation

## Quickstart

```bash
cp .env.example .env
# Generate a real SESSION_SECRET:
#   openssl rand -hex 32   →   paste into .env

npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Visit http://localhost:3000.

### Demo accounts (after `npm run db:seed`)

| Role     | Email                       | Password   |
| -------- | --------------------------- | ---------- |
| Shipper  | `demo@fathership.com`       | `demo1234` |
| Carrier  | `carrier@fathership.com`    | `demo1234` |

## Feature map

| Area | Pages |
| --- | --- |
| Marketing | `/`, `/shippers`, `/carriers`, `/how-it-works`, `/pricing`, `/about`, `/contact` |
| Quoting | `/quote` |
| Booking | `/quote/[id]/book` |
| Shipper app | `/dashboard`, `/dashboard/shipments`, `/dashboard/shipments/[id]`, `/dashboard/quotes`, `/dashboard/billing`, `/dashboard/settings` |
| Carrier app | `/carrier`, `/carrier/mine`, `/carrier/settlements`, `/carrier/profile` |
| Public tracking | `/track?ref=FS-XXXXXXX` |
| Auth | `/signup`, `/login` |
| API | `POST /api/quotes`, `POST /api/bookings`, `POST /api/loads/[id]/accept`, `POST /api/auth/{signup,login,logout}` |

## Rates engine

The pricing flow lives in `src/lib/rates/`:

- `types.ts` — `RatesProvider`, `RateQuoteRequest`, `RateOption`
- `distance.ts` — POC ZIP-to-ZIP mileage (great-circle × driving factor)
- `markup.ts` — central Fathership service fee (`RATES_MARKUP`)
- `http.ts` — fetch-with-timeout + OAuth2 token cache for carrier APIs
- `providers/mock.ts` — `MockRatesProvider`: 10 simulated carriers
- `providers/fedex_freight.ts` — FedEx Freight LTL (OAuth2)
- `providers/estes.ts` — Estes Express LTL (API key)
- `providers/odfl.ts` — Old Dominion LTL (HTTP Basic)
- `providers/multi.ts` — `MultiProvider`: parallel fanout, failure isolation,
  dedupe by (carrier, service)
- `index.ts` — selector (`mock` or `live`) and `quoteWithMarkup()` helper

### Switching to live rates

```
RATES_PROVIDER=live
# Then fill in any of FEDEX_*, ESTES_*, ODFL_* in .env.
```

Unconfigured providers are skipped. If none are configured, the selector
falls back to `mock` so the app keeps working. Full sign-up walkthrough:
[`docs/CARRIERS.md`](./docs/CARRIERS.md).

### Pricing breakdown (every quote returns it)

- **Linehaul** — cpm × miles (TL) or weight + class blend (LTL)
- **Fuel surcharge** — % of linehaul, per carrier
- **Accessorials** — liftgate, residential, inside pickup/delivery, declared value
- **Fathership service fee** — configurable markup (`RATES_MARKUP`, default 10%)

### Adding more carriers

To add SAIA, XPO, ArcBest, R+L, etc.: create
`src/lib/rates/providers/<carrier>.ts` implementing `RatesProvider`, add an
`isConfigured()` static, and push it into `buildLiveProvider()` in
`src/lib/rates/index.ts`. The `MultiProvider` handles fanout, failure
isolation, dedupe, and central markup automatically. See
[`docs/CARRIERS.md`](./docs/CARRIERS.md) for the playbook.

For truckload spot rates, the pattern is the same (DAT Power, Truckstop) but
those APIs are paid subscriptions.

## Architecture notes

- **App Router with RSC** — dashboards read directly from Prisma in server
  components; mutations are POSTs to `/api/...`.
- **Sessions** via `iron-session` cookies, no external auth dependency.
- **SQLite** for the demo. Switch `provider = "postgresql"` in
  `prisma/schema.prisma` and re-run `db:push` for prod.

## What's intentionally not built (yet)

- Stripe billing integration (UI placeholder only)
- EDI 204/214/210
- Real ELD / Macropoint tracking webhooks
- Email/SMS notifications (SendGrid, Twilio)
- Document storage (BOLs, PODs) — S3 / R2
- Admin tooling

These are the obvious next stops once direct carrier APIs are wired in.
