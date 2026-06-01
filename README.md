This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
## source data
https://open.toronto.ca/dataset/short-term-rentals-registration/

## Events collector (`/airbnb-directory/events`)

Read-only feed of major Toronto events (Blue Jays, Raptors, …) to support manual
Airbnb pricing decisions. A [Vercel Cron](https://vercel.com/docs/cron-jobs) job
(`vercel.json`) hits `app/api/cron/collect-events` daily; it pulls events from the
Ticketmaster Discovery API and upserts them into a DynamoDB table. The `app/events`
page reads the table and renders them.

Architecture is provider-based so new sources/series are cheap to add:
- **Add a series** (e.g. Maple Leafs): one entry in `lib/events/subscriptions.ts`.
  Find its Ticketmaster ids with
  `TICKETMASTER_API_KEY=xxx node scripts/discover-ticketmaster-ids.mjs "Toronto Maple Leafs" "Scotiabank Arena"`.
- **Add a website/API**: implement `EventProvider` in `lib/events/providers/` and
  register it in `lib/events/providers/index.ts`.

The DynamoDB table + the IAM user this app uses are provisioned by the
`airbnbAutoReply` CDK stack (it owns the AWS infra). Required env vars are listed
in `.env.example` — set them in `.env.local` for local dev and in the Vercel
project settings for deployment. Trigger the collector manually with:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://<your-domain>/airbnb-directory/api/cron/collect-events
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
