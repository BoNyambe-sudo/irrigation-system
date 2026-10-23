# Smart Irrigation Zambia

Irrigation systems for Zambian farms - Next.js 16 app with NextAuth v4, Prisma 7, Tailwind v4.

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

## Default credentials
- Admin: admin@irrigation.zm / admin123
- Customer: customer@test.zm / customer123
