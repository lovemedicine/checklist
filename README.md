# Checklists

A pratice Next.js app for creating reusable checklists. View the [demo](https://checklist-gold.vercel.app).

## Requirements

- npm
- nodejs
- postgres

## Getting Started

First install package dependencies:

```
npm install
```

Then create `.env` file with variables for auth and postgres:

```
# possible values: 'auth' or 'single'
NEXT_PUBLIC_USER_MODE=auth
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# remaining vars are only required if NEXT_PUBLIC_USER_MODE=auth
GOOGLE_ID=
GOOGLE_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"
```

Then create the database, load the schema and seed data, and create the prisma client:

```bash
npx prisma db push
npx prisma db seed
npx prisma generate
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the checklist app.


## TODO

- automated testing
- better error handling
- style improvements
- caching
