# CalcKit — Final (Netlify-ready)

Free calculator suite (Next.js 14 + React 18).

## Local (Windows)

Prefer a path **without spaces**, e.g. `C:\calckit`:

```powershell
cd C:\calckit
Remove-Item -Recurse -Force .next, node_modules -ErrorAction SilentlyContinue
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000

## Netlify deploy

1. Push this folder to GitHub (do **not** commit `.env.local`)
2. Netlify → Add new site → Import from Git
3. Build command: `npm run build` (plugin in `netlify.toml`)
4. Optional env vars in Netlify UI:

```
ADMIN_SECRET=strong-password
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.0-flash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

5. Deploy → open the Netlify URL

## Included

- All calculator tools + back / All tools navigation
- SEO, blog, legal pages, feedback, EN/UR, dark mode, PWA files
- AI tip on tool result panels (needs `GEMINI_API_KEY` or shows offline tip)
- Ads removed (add later)
- Full login/signup deferred

## Not included (later)

- Google/Email account system
- Ad network scripts
- Custom domain (add in Netlify when ready)
