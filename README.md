# Revile Blog

A personal news-style blog built with Next.js App Router, TypeScript, Tailwind, and MongoDB. The public site and admin panel both consume the same route handlers for a headless CMS workflow.

## Local setup

1. Copy `.env.example` to `.env` and set your values.
2. Start a local MongoDB instance:
   - `docker compose up -d`
   - or run `mongod` locally if you already have MongoDB installed.
3. Confirm the connection string is valid:
   - `MONGODB_URI=mongodb://127.0.0.1:27017/revile-blog`
   - `SESSION_SECRET=replace-with-a-long-random-string-at-least-32-chars`
4. Install dependencies and start the app:
   - `npm install`
   - `npm run dev`
5. Open `http://localhost:3000` and create the first admin account at `/admin/signup`.

## First admin signup

The first user to sign up becomes the sole admin. The signup route enforces this server-side before creating the `AdminUser` document. After the first admin exists, the page redirects to `/admin/login` and the public signup flow is no longer available.

## Seed demo content

Populate a few published posts for the home page and tagged list:

```bash
node scripts/seed.mjs
```

## Routes

- Public home: `/`
- Post detail: `/posts/[slug]`
- Tag archive: `/tags/[tag]`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- Comment moderation: `/admin/comments`
- Insights: `/admin/insights`

## Notes

- Markdown is stored in the post body and rendered with a markdown viewer.
- Comments default to `pending` until an admin approves them.
- Uploaded cover and inline images are stored in `public/uploads` and exposed as static files.
