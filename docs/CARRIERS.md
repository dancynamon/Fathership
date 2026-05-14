# Carrier API onboarding

The cheapest path to real LTL rates is to sign up directly with a handful of
national carriers. Each one is free with a shipper account and gives you that
carrier's **published tariff** — bookable, real, no aggregator middleman.

Wire up FedEx Freight + Estes + ODFL and you cover ~50% of US LTL volume for
**$0/mo**.

> Pricing returned will be each carrier's **list/published rates**, not
> negotiated. Negotiated rates require account volume and a sales conversation
> with that carrier; for a POC and early pilot, list rates are fine.

## How the integration works

1. Sign up for the carrier's developer portal (see steps per carrier below).
2. Drop the credentials into your `.env` file.
3. Set `RATES_PROVIDER=live`.
4. Restart the app. The selector at `src/lib/rates/index.ts` will:
   - Activate every provider whose credentials are present
   - Skip providers without credentials (no error)
   - Fall back to the mock engine if nothing is configured
5. The `MultiProvider` runs every active provider in parallel, isolates
   failures, dedupes by `(carrier, service)`, applies the central
   `RATES_MARKUP`, and returns sorted options.

## 1. FedEx Freight (easiest — start here)

**Why first:** the FedEx Developer Portal is fully self-serve. No phone call,
no account rep, no minimum volume.

### Steps

1. Create a FedEx account at https://www.fedex.com (free).
2. Note your **9-digit shipping account number** (it shows up in your FedEx
   account profile; if you don't have one, request a FedEx Freight account).
3. Go to https://developer.fedex.com — sign in with the same FedEx account.
4. **Create a project** → enable "Rates and Transit Times API".
5. Copy the issued **API Key** (= client_id) and **Secret Key** (= client_secret).
6. Sandbox first; flip to production once it works.

### `.env`

```
RATES_PROVIDER=live
FEDEX_API_BASE=https://apis-sandbox.fedex.com   # production: https://apis.fedex.com
FEDEX_CLIENT_ID=...
FEDEX_CLIENT_SECRET=...
FEDEX_ACCOUNT_NUMBER=...
```

### Notes

- Auth: OAuth2 client_credentials, tokens cached for ~55 min by `getOAuthToken()`.
- The provider only quotes LTL (`loadType === "PALLET"`), since FedEx Freight
  doesn't do TL.
- Docs: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html
- **Verify** the JSON shape after your first sandbox call — FedEx revises the
  schema occasionally. The `// VERIFY:` comments in
  `src/lib/rates/providers/fedex_freight.ts` show what to check.

## 2. Estes Express

**Why next:** large national LTL footprint, free with a shipper account, no
volume requirements.

### Steps

1. Open an Estes shipper account at https://www.estes-express.com (free).
2. Apply for Web Services API access at
   https://www.estes-express.com/myestes/api — usually approved within a
   business day.
3. They email an **API key** and confirm your **account number**.

### `.env`

```
RATES_PROVIDER=live
ESTES_API_BASE=https://api.estes-express.com
ESTES_API_KEY=...
ESTES_ACCOUNT_NUMBER=...
```

### Notes

- Auth: API key in the `apiKey` request header.
- Estes has both SOAP and REST flavors of the rating API; this provider uses
  REST. **Verify** the endpoint path against your developer welcome packet —
  the path has changed across API versions.

## 3. Old Dominion (ODFL)

**Why next:** highest on-time reliability in US LTL; widely respected. Slightly
slower onboarding because access is gated through a customer rep.

### Steps

1. Open an ODFL customer account.
2. Email or call your ODFL rep and ask for **Web Services API** access. They
   send a packet with API docs, your username/password, and your account number.
3. Onboarding usually takes 2–5 business days.

### `.env`

```
RATES_PROVIDER=live
ODFL_API_BASE=https://api.odfl.com
ODFL_USERNAME=...
ODFL_PASSWORD=...
ODFL_ACCOUNT_NUMBER=...
```

### Notes

- Auth: HTTP Basic with the issued username/password.
- ODFL ships SOAP and REST flavors; the provider uses REST. **Verify** the
  endpoint path & payload against your welcome packet.

## Suggested order of operations

| Day | Action |
| --- | --- |
| 1 | Sign up for FedEx Developer + create project → drop sandbox creds in `.env`. Run one test quote against sandbox. Fix any JSON-path issues marked `VERIFY:` in the provider. |
| 1–2 | Apply for Estes API access. |
| 2–3 | Email ODFL rep for Web Services access. |
| 3–7 | Verify Estes once creds arrive. |
| 5–10 | Verify ODFL once creds arrive. |
| 10+ | Flip FedEx to production, monitor live rates. |

## Adding more carriers later

When you want to add SAIA, XPO, ArcBest, R+L, etc., follow the same pattern:

1. Create `src/lib/rates/providers/<carrier>.ts` exporting a class that
   implements `RatesProvider`.
2. Add an `isConfigured()` static returning `true` only when the carrier's
   env vars are present.
3. Push the provider into `buildLiveProvider()` in `src/lib/rates/index.ts`.
4. Document credentials in `.env.example` and add a section here.

The `MultiProvider` and `applyMarkup()` will handle the rest.

## Falling back when things break

The `MultiProvider` uses `Promise.allSettled` — one carrier returning a 500 or
timing out **never** kills the whole quote. The failed provider is logged and
its options are simply omitted. If every provider fails, the quote returns an
empty `options` array (handled by the UI as a "no rates available" state).
