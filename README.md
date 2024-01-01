# Checklist App

An app built with Next.js and Prisma for creating reusable checklists.


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
GOOGLE_ID=
GOOGLE_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"
SEED_USER_GOOGLE_ID=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
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
