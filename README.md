# Smart Irrigation Zambia

Irrigation systems for Zambian farms — **Next.js 16** app with **NextAuth v4**, **Prisma 7**, **Tailwind v4**, Leaflet maps, Recharts and live SSE.

## Setup

1. Install dependencies
```bash
pnpm install
```

2. Start PostgreSQL
```bash
docker-compose up -d
```

3. Setup database
```bash
pnpm db:push
pnpm db:seed
```

4. Run dev server
```bash
pnpm dev
```

Open http://localhost:3000

## Default credentials
- Admin: `admin@irrigation.zm` / `admin123`
- Customer: `customer@test.zm` / `customer123`

## Features
- Public store: home, `/systems`, `/systems/[slug]` with coverage calculator and map
- 5-step checkout at `/order/[slug]` via server actions (customer → location → farm → payment → confirm)
- Admin: dashboard with Recharts-ready stats, live SSE orders table with toast + sound, order detail with map & timeline, full clustered farm map, products CRUD, customers list
- Realtime: `/api/events` SSE endpoint broadcasts `order:new` and `order:status`; admin orders prepend new orders live (test with two tabs)
- Payments: mock `lib/payments.ts` ready for MTN MoMo, Airtel Money and Flutterwave via env vars

## Payments — plugging in real APIs
`src/lib/payments.ts` exposes a single `pay(method, amount, phone?)` function. The mock returns `{ success, reference }`. To enable a real provider, set the corresponding env var and replace the placeholder branch:

- **MTN MoMo** — set `MTN_MOMO_API_KEY`, call the MoMo Collection API (`requesttopay`) inside the `MOMO` case.
- **Airtel Money** — set `AIRTEL_MONEY_API_KEY`, call the Airtel Money checkout inside the `AIRTEL` case.
- **Flutterwave (Card)** — set `FLUTTERWAVE_SECRET_KEY`, call the Flutterwave charge endpoint inside the `CARD` case.
- **Cash on delivery** — `CASH` is always free.

## Testing realtime
1. Sign in as admin and open `/admin/orders`.
2. Open a second private tab, sign in as a customer and place an order at `/order/[slug]`.
3. The admin tab should prepend the new order, play a sound and show a toast — without a refresh.

## Scripts
| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:seed` | Seed products, users and 15 demo Lusaka orders |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm lint` | ESLint |

## Mobile-first
Layouts use fluid `max-w-6xl`, responsive grids and touch-friendly controls. The WhatsApp float and geolocation button are sized for thumbs.