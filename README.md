# Fathership

A 3PL platform for **pallet and truckload freight** — instant multi-carrier rates,
one-click booking, real-time tracking, and a carrier loadboard. Modeled loosely
on Mothership; built as a POC.

## Status: proof of concept

Today this is a working end-to-end app with **mock rates** that look real but
aren't pulled from any carrier. Direct carrier integrations
(XPO, Estes, ODFL, SAIA, ArcBest, FedEx Freight, R+L, Knight-Swift, Schneider,
Werner) or aggregators (Project44, Banyan) drop in behind the
`RatesProvider` interface at `src/lib/rates/`.

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
- `providers/mock.ts` — `MockRatesProvider`: 10 carriers, freight-class
  multipliers, fuel surcharge, accessorials, service-level multipliers,
  configurable markup
- `index.ts` — selector keyed on `RATES_PROVIDER`

### Pricing breakdown (every quote returns it)

- **Linehaul** — cpm × miles (TL) or weight + class blend (LTL)
- **Fuel surcharge** — % of linehaul, per carrier
- **Accessorials** — liftgate, residential, inside pickup/delivery, declared value
- **Fathership service fee** — configurable markup (`RATES_MARKUP`, default 10%)

### Production path — direct carrier APIs

Replace `MockRatesProvider` with a fanout that hits real carrier APIs
in parallel and normalizes responses into `RateOption`. Recommended order
based on coverage:

1. **Project44** (aggregates LTL nationwide) — fastest path to real rates
2. **Direct LTL** — Estes, ODFL, XPO, SAIA, FedEx Freight, ArcBest
3. **Truckload** — DAT Power / Truckstop spot, plus contracted carriers

A `MultiProvider` that races a few providers per request and merges results is
the typical pattern.

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
