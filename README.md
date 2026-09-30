# Balcão — A Living Archive of Konkani Voices

Next.js 14 (App Router) + Tailwind CSS + Framer Motion + Lucide React.

## What's real vs. simulated

- **Recorder**: real microphone capture (`MediaRecorder`), real live waveform (Web Audio `AnalyserNode`), real local storage (`IndexedDB` — persists per-browser/device only). Live transcription uses the browser's real English speech recognition where supported (Chrome); Konkani transcription and dialect-tagging are honestly shown as not-yet-available, since no such model exists publicly.
- **Radio card**: real audio via the browser's Speech Synthesis API, reading the English translation aloud (no browser ships a Konkani voice). Subtitle highlighting is driven by the engine's real word-boundary events, not a fixed timer — labeled as an estimate, not literal word alignment.
- **Extinction Clock**: the hero number is this archive's own real, live count of recordings and minutes saved (via IndexedDB) — it starts at 0 and grows as you actually record. The footnote cites a real, sourced statistic (2011 Census + O Heraldo reporting) rather than a fabricated figure.

**Browser requirements:** microphone access requires HTTPS (or `localhost`) — this works automatically once deployed to Vercel. Live English transcription currently only works in Chromium-based browsers (Chrome, Edge); recording and playback work everywhere `MediaRecorder` is supported.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Push to GitHub

```bash
cd balcao-project
git init
git add .
git commit -m "Initial commit: Balcão Project"
gh repo create balcao-project --public --source=. --remote=origin --push
```

No `gh` CLI? Do it manually:
1. Create a new empty repo on github.com (don't add a README there).
2. Then:
```bash
git remote add origin https://github.com/<your-username>/balcao-project.git
git branch -M main
git push -u origin main
```

## Deploy to Vercel

**Option A — Dashboard (easiest):**
1. Go to vercel.com → **Add New Project**.
2. Import the `balcao-project` GitHub repo.
3. Framework preset auto-detects **Next.js** — leave build settings as default.
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in ~1 minute.

**Option B — CLI:**
```bash
npm i -g vercel
vercel login
vercel        # deploys a preview
vercel --prod # promotes to production
```

Every future `git push` to `main` auto-redeploys via Vercel's GitHub integration.

## Project structure

```
app/
  layout.tsx        Root layout, fonts (Fraunces, Inter, Noto Sans Devanagari)
  page.tsx           Assembles the four sections
  globals.css        Design tokens, custom animations
components/
  ExtinctionClock.tsx
  RadioSubtitle.tsx  Radio dial + breath-aware karaoke subtitles + script toggle
  GeoSonicMap.tsx    SVG map + sliding story tray
  ElderRecorder.tsx  Consent picker + mic + simulated waveform/transcript
lib/
  villages.ts        Story data (English / Romi / Devanagari), consent tiers
```
