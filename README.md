# DeezOps

Premium Discord infrastructure agency landing page — comic neo-brutalist marketing site for Kickoff / Autopilot / Full Send.

**Live:** [deezops.com](https://deezops.com) (Vercel)

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide icons

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Vite static site on Vercel (`npm run build` → `dist`). Hash routes (`#order`, `#pricing`) need no SPA rewrite.

```bash
npx vercel --prod
```

Or push to `master` if the GitHub ↔ Vercel project is linked for production.
