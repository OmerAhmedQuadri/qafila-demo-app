# Qafila — concept demo for Media Plus

Interactive, frontend-only demo of the kids' faith-learning platform. No backend: progress is kept in the browser (localStorage) and can be reset from the guide.

"Qafila" (caravan) is a working name. Mascot: **Tamr**, a baby camel.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:5173 (also reachable from Windows while WSL is running)
pnpm build      # static site in dist/
pnpm preview    # serve dist/ on http://localhost:4173
```

## What's inside

| Area | What it shows |
|---|---|
| Splash, profiles | Brand, family account with two child profiles |
| Today | Daily loop: story + dhikr + good deed, lantern streak, "new episode Friday" |
| Journey | Seerah map (Makkah → Hijrah → Madinah); locked stops = content roadmap |
| Lesson: *The Night Journey to Safety* | 5 illustrated story scenes, hide-the-tracks game, 3-question quiz, sequence game, colouring (Masjid Quba), reflection, real-life "Live it" challenge, celebration |
| Dhikr | Private tasbeeh counter (33/33/34), Arabic + transliteration + meaning, no points |
| Garden | Rewards as plants that remember why they grew; collectible place cards |
| Parents | Hold-to-open gate, weekly summary, approve good deeds, screen time, sources + scholar-review status |
| Studio | Preview of Media Plus's content pipeline: draft → scholar review → approved → scheduled |

On a laptop (≥1024px wide) the app sits in a phone/tablet frame with a **presenter panel** (talking points per screen). On phones/tablets it runs full-screen; the ✦ tab on the right edge opens the same guide.

## Content & art rules followed

- The Prophet ﷺ and the Sahaba are never depicted: scenes use places, light, objects, footprints, animals and silhouettes of non-companions only.
- Every story fact is linked to a source (`src/content/data.ts` → `SOURCES`); all marked *scholar review pending* except Qur'an 9:40.
- Arabic is never read by text-to-speech. The optional read-aloud uses the device voice as a placeholder for recorded narration.
- Sounds are synthesised in code: voices & nature only, no music.

## Deploy (static hosting)

The build is a plain static site (`dist/`, relative paths), so any static host works:

- **Netlify Drop:** run `pnpm build`, then drag `dist/` onto https://app.netlify.com/drop
- **Vercel:** `npx vercel deploy --prod` (asks you to log in the first time)

## Structure

```
src/
  art/          characters, icons, plants, story scenes (all inline SVG)
  components/   UI kit (buttons, sheets, hold button, confetti) + presenter shell
  content/      lesson steps, units, dhikr, cards, sources
  lib/          Web Audio sound effects/ambience, placeholder narration
  screens/      Welcome, Home, Journey, Dhikr, Garden, Parent, Studio, lesson/*
  state/        zustand store (persisted to localStorage)
```
