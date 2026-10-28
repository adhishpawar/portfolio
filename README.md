# Adhish Pawar: portfolio

A story-told personal portfolio. Eight chapters, one scroll, a dark "mission control" look.
Next.js (App Router), SCSS modules, and a small amount of motion: GSAP, Framer Motion,
Lenis and Three.js, all loaded after first paint.

Design spec: `docs/superpowers/specs/2026-10-28-adhish-portfolio-design.md`
Implementation plan: `docs/superpowers/plans/2026-10-28-adhish-portfolio.md`

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Node 24 is what it was built with (`.nvmrc`).

## Change the content (no code needed)

Everything on the page comes from five JSON files in `content/`. Edit them, then check them:

```bash
npm run check:content
```

If a field is missing or has the wrong type, the check (and the build) stops and names the
file and the field.

| File | What it holds |
|---|---|
| `profile.json` | Name, headline, current role, location, aspirations, education, contact links |
| `chapters.json` | The eight chapters in order: label, title, body paragraphs, stations, quote |
| `projects.json` | Projects shown in the chapters. Every project needs a `source` (where the claim comes from) |
| `skills.json` | Skill groups (used in `llms.txt`) |
| `explorer.json` | The frames in the Explorer chapter |

Rules the tests enforce: the CGPA is `9.38`, the site never says "open to work" or "hire me",
chapters keep the ids `ch-00` to `ch-07` in order, and every project has a `source`.

**Emphasis in titles:** wrap one or two words in asterisks, for example
`Beyond *the terminal.*`. Those words render in the italic serif.

**Add your own photos to the Explorer chapter:** put the image in `public/images/explorer/`
and set `src` on a frame in `explorer.json` (for example `"/images/explorer/lisbon.jpg"`). Frames
without a `src` show an illustrated placeholder.

## Deploy to Vercel

1. Import the repository in Vercel. The framework preset is **Next.js**.
2. Add an environment variable `NEXT_PUBLIC_SITE_URL` for **Production**, for example
   `https://your-domain.com` (see `.env.example`).
3. Deploy. `llms.txt`, `sitemap.xml`, `robots.txt` and the social preview image are generated
   from the same content, so there is nothing else to configure.

## Quality checks

```bash
npm test              # unit tests
npm run check:content # content files are valid
npm run check:bundle  # builds, then checks no animation library is in the initial JavaScript
npm run test:e2e      # builds, then browser tests: accessibility (axe), keyboard, no-JS,
                      # reduced motion, layout shift, scroll and WebGL behaviour
npm run lhci          # builds, then Lighthouse desktop and mobile
```

The browser checks use the Edge or Chrome already installed on the machine. Lighthouse and
Playwright need a built site, which these scripts create.

Measured on the last run: Lighthouse desktop 1.0 and mobile 0.95 to 0.96 for performance, and
1.0 for accessibility, best practices and SEO. Mobile sits right at the 0.95 target, so expect it
to vary by a few points between runs and machines.

## How it is put together

- `app/` routes, metadata, `llms.txt`, sitemap, robots and the social image.
- `components/chapters/` one component per chapter type. They take data as props and hold no text.
- `components/motion/` the animation layers. Every one is switched off for visitors who prefer
  reduced motion, and loads only when needed.
- `components/webgl/` the halftone orb and glow. A static image is always underneath, and stays if
  WebGL is missing, the device is small, or the context is lost.
- `lib/` content loading, the `llms.txt` and structured-data builders, and small helpers.
- `content/` the JSON described above, plus its schema.

## Before you publish

- Update your GitHub profile README to match: the CGPA there says `9.93` (it is `9.38`) and it
  says "Open to Backend Engineer roles".
- Confirm the contact details in `content/profile.json` (LinkedIn, GitHub and email).
- Photos or footage of FifthSense users or the Royal Orchid pilot need permission first. The
  site uses line art instead.
