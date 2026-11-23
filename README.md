# AeroPulse-India
Real-time Airfare Price Index and Aviation Intelligence Platform for India

## Local setup

1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Supply only the credentials explicitly requested below.
5. Run `npm run db:migrate` when `DATABASE_URL` is configured.
6. Run `npm run dev`.

## Deployment

The repository is compatible with Vercel's Next.js framework preset:

- import the existing GitHub repository into Vercel
- set the framework preset to Next.js
- set build command to `npm run build`
- set install command to `npm install`
- add environment variables in Vercel Project Settings, not in source code
- deploy `main`

No credentials are stored in this repository.

## Provider boundaries

- Duffel credentials must be test-mode credentials. The application disables live Duffel booking behavior.
- Cesium public browser tokens must be restricted and scoped to browser use. Private tokens must never be placed in `NEXT_PUBLIC_*`.
- OpenSky production aircraft requests remain disabled until written operational permission and credentials are obtained. `/api/aircraft` returns clearly labelled demonstration data.
- Resend sending requires a verified domain or an approved test sender.
- Anthropic keys are server-only and are not exposed to browser code.
- The status page reports configuration and reachability without revealing secrets.

## Integration status

Visit `/admin/status` after starting the app. API status is available from `/api/status`.
