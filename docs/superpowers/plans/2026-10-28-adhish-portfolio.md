# Adhish Pawar Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Mission Control Night" story portfolio: a server-rendered Next.js site of eight chapters, driven entirely by JSON content, with lazy-loaded GSAP, Framer Motion, Lenis and Three.js layers.

**Architecture:** Server components render all content from `content/*.json`, validated by a zod schema. Animation lives in small client islands that are dynamically imported after first paint and switched off under `prefers-reduced-motion`. The LCP element is always plain HTML or a static image, never the WebGL canvas.

**Tech Stack:** Next.js (App Router, TypeScript), SCSS modules, GSAP + ScrollTrigger, Framer Motion (`LazyMotion`), Lenis, Three.js + GLSL, zod, Vitest + Testing Library, Playwright + `@axe-core/playwright`, Lighthouse CI, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-28-adhish-portfolio-design.md`

## Global Constraints

- App Router, TypeScript, SCSS modules. No `src/` directory: `app/`, `components/`, `content/`, `lib/`, `styles/`, `public/` at the project root. Path alias `@/*` maps to `./*`.
- Colour tokens (exact): `--void #0D0D0D`, `--surface #101010`, `--navy #132644`, `--signal #F4F4F4`, `--dim #9F9F9F`, `--faint #828282`, `--accent #2F5BFF`, `--accent-text #7C97FF`. One accent hue only.
- Fonts via `next/font`, self-hosted: Inter Tight (display and body), Instrument Serif italic (emphasis, 1 to 2 words per headline), Geist Mono (labels).
- Copy rules: the site never says "open to work", "open to opportunities" or "hire me". The call to action is "Let's connect". CGPA is **9.38**; the string `9.93` appears nowhere.
- No photos of Adhish anywhere. No stock photos. Real FifthSense pilot imagery only with permission; line art by default.
- Every claim traces to the spec's Verified facts table; every project entry has a non-empty `source`.
- `three`, `gsap`, `framer-motion` and `lenis` are never in the initial JS for `/`; each loads by dynamic import after first paint.
- Under `prefers-reduced-motion`: Lenis off, boot sequence skipped, orbit line fully drawn, WebGL replaced by static images.
- Accessibility: WCAG AA, semantic landmarks, exactly one `h1`, full keyboard navigation, visible focus ring in `--accent-text`.
- Performance targets: Lighthouse desktop performance >= 0.99; mobile performance >= 0.95.
- Deployment target: Vercel. Site URL comes from `NEXT_PUBLIC_SITE_URL`.
- Tests run with `npm test` (Vitest) and `npm run test:e2e` (Playwright). Node >= 20.

## Review Focus

1. **JavaScript disabled or very slow:** all eight chapters' text must be in the server HTML. Pinned in Task 5 and Task 12.
2. **`prefers-reduced-motion` visitors:** no Lenis, no boot overlay, orbit line drawn, no canvas. Pinned in Tasks 6, 7, 8, 10 and 12.
3. **No WebGL, low-memory phone, or WebGL context lost mid-session:** the hero must never go blank; the static orb stays. Pinned in Task 10.
4. **Boot overlay trapping a keyboard or screen-reader user, or replaying for a returning visitor:** skippable with any key, never hides main content, plays once per session. Pinned in Task 7.
5. **Content JSON with a missing field, wrong type or a very long title:** the build must fail with the file and field named, and long titles must wrap without horizontal scroll. Pinned in Tasks 2 and 4.

---

### Task 1: Scaffold, design tokens and contrast guard

**Files:**
- Create: project scaffold via `create-next-app` (TypeScript, App Router, no Tailwind, no `src/`, ESLint on), `.nvmrc`, `vitest.config.ts`, `styles/_tokens.scss`, `styles/_type.scss`, `styles/globals.scss`, `lib/fonts.ts`, `lib/contrast.ts`, `next.config.js`
- Modify: `app/layout.tsx` (apply fonts and globals), `app/page.tsx` (placeholder `<main>`)
- Test: `tests/tokens.test.ts`, `tests/contrast.test.ts`

**Interfaces:**
- Produces: CSS custom properties from `:root` in `styles/_tokens.scss`; `lib/fonts.ts` exports `fontDisplay`, `fontSerif`, `fontMono` (each a `next/font` object with a `variable` class); `lib/contrast.ts` exports `contrastRatio(fg: string, bg: string): number` (hex in, WCAG ratio out).

- [ ] **Step 1: Initialise the repo.** In the project root run `git init`, then scaffold with `npx create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm --yes`. If it refuses because `docs/` and `assets/` exist, scaffold in a temp folder and move the files in. Add `sass`, `zod`, `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `gsap`, `framer-motion`, `lenis`, `three`, `@types/three`. Pin the resolved versions exactly in `package.json`. Add scripts `test`, `test:e2e`, `check:content`, `check:bundle`.
- [ ] **Step 2: Write the failing tests.**
  - `tokens.test.ts::defines every colour token with its exact value`: reads `styles/_tokens.scss` as text and asserts each of the eight Global Constraints token/value pairs appears.
  - `contrast.test.ts::body text pairs pass WCAG AA`: asserts `contrastRatio` >= 4.5 for signal/void, dim/void, faint/void, accent-text/void, `#FFFFFF`/accent (button text); asserts `contrastRatio("#2F5BFF", "#0D0D0D") < 4.5` (documents why `--accent` is never used for small text); asserts `contrastRatio("#000000", "#FFFFFF")` is 21 within 0.01.
- [ ] **Step 3: Run to verify failure.** Run `npx vitest run tests/tokens.test.ts tests/contrast.test.ts`. Expected: FAIL (files missing).
- [ ] **Step 4: Implement** `styles/_tokens.scss` (tokens on `:root`, plus a type scale and spacing scale), `lib/contrast.ts` (WCAG relative-luminance formula), `lib/fonts.ts` (Inter Tight 400/500/700, Instrument Serif italic 400, Geist Mono 400/500, `display: "swap"`), the global body style (`background: var(--void)`, `color: var(--signal)`, `:focus-visible` outline 2px `var(--accent-text)`), and `next.config.js` (CommonJS; `images.formats: ["image/avif","image/webp"]`, `reactStrictMode: true`).
- [ ] **Step 5: Verify.** Run `npx vitest run` then `npm run build`. Expected: both pass.
- [ ] **Step 6: Commit.** `git add -A && git commit -m "chore: scaffold Next.js app with design tokens and contrast guard"`

### Task 2: Content model, schema and the copy

**Files:**
- Create: `content/profile.json`, `content/chapters.json`, `content/projects.json`, `content/skills.json`, `content/explorer.json`, `content/schema.ts`, `lib/content.ts`, `scripts/check-content.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces (all exported from `content/schema.ts`, as zod schemas plus inferred types):
  - `ChapterKind = "boot"|"origin"|"foundations"|"production"|"flagship"|"next"|"explorer"|"connect"`
  - `Chapter { id: string; index: number; kind: ChapterKind; label: string; title: string; body: string[]; stations?: {tag: string; caption: string}[]; projectIds?: string[]; quote?: {text: string; attribution: string} }` (`title` may contain `*emphasis*` markers)
  - `Project { id: string; title: string; role: string; kind: "client"|"personal"; summary: string; stack: string[]; links: {label: string; href: string}[]; diagram?: {nodes: {id: string; label: string; detail: string}[]}; source: string }`
  - `Profile { name: string; headline: string; role: {title: string; company: string; since: string}; location: string; aspirations: string; education: {school: string; degree: string; years: string; cgpa: string}; links: {linkedin: string; github: string; email: string} }`
  - `Skills { groups: {name: string; items: string[]}[] }`, `Explorer { frames: {id: string; caption: string; alt: string; src?: string}[] }`
  - `Content { profile: Profile; chapters: Chapter[]; projects: Project[]; skills: Skills; explorer: Explorer }`
- Produces: `lib/content.ts` exports `loadContent(): Content` and `class ContentError extends Error { file: string; path: string }`.

- [ ] **Step 1: Write the failing tests** in `tests/content.test.ts`:
  - `loadContent returns eight chapters indexed 0..7 in order, kinds matching the spec's chapter table`
  - `profile.education.cgpa is "9.38" and "9.93" appears in no content file`
  - `no content string matches /open to work|open to opportunities|hire me/i`
  - `every project has a non-empty source and a kind of client or personal`
  - `every chapter.projectIds entry exists in projects`
  - `a content fixture with a missing project.source throws ContentError whose file is "projects.json" and whose path names the field`
  - `a title of 300 characters with no spaces still validates` (layout handling is Task 4)
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/content.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `content/schema.ts` and `lib/content.ts` (read the five JSON files, parse, wrap zod errors into `ContentError` naming file and issue path). Implement `scripts/check-content.ts` to call `loadContent()` and exit non-zero on error; wire to `npm run check:content`.
- [ ] **Step 4: Author the JSON.** Source every fact from the spec's Verified facts table, Aspirations section and chapter table. Use this exact copy:
  - `profile.headline`: `Associate Software Engineer | Java & Python | Agentic AI & GenAI | Core ML, Experimentation & Production Pipelines | Building AI Products from Scratch to Scale`
  - `profile.role`: Associate Software Engineer, CoReCo Technologies Private Limited, since `2025-07`. `profile.location`: `Pune, India`. Links: LinkedIn `https://www.linkedin.com/in/adhish-pawar-153241231/`, GitHub `https://github.com/adhishpawar`, email `adhishpawar@gmail.com` (default per spec item 4; Adhish may change it).
  - Chapter 00 title: `Building AI products from *scratch to scale.*`; body: `Associate Software Engineer working across Java, Python, agentic AI and core ML, building pipelines that go from experiment to production.`
  - Chapter 04 (flagship): title `Teaching a system to *understand* people.`; body: `I designed the machine-learning pipeline that predicts gestures in real time, and I'm architecting the backend the whole platform runs on.` and `First pilot: Royal Orchid Hotels, Bangalore.`; quote `That's the only metric that really counts.` attributed `Adhish Pawar, on the pilot`.
  - Chapter 06 (explorer): title `Beyond *the terminal.*`; body: `Between builds I travel, move between places, and learn whatever domain is next. Tech makes more sense when life is in the same frame.`
  - Chapter 07 (connect): title `If you're building something that *matters*, let's talk.`
  - Chapters 01, 02, 03, 05: write from the spec's table and facts only. Chapter 03 stations: client products (Django REST, PostgreSQL, Redis), speech and RAG services (FastAPI), pilot that won a PO, Propel Excellence Award.
  - Projects: FifthSense (client; diagram nodes in order: Data/DVC, Experiments/MLflow, Serving/Django REST + Flask, Retrain/CI-CD), UPI Replication System, ride-hailing platform, FinSec Vault, FusionX, TimesheetPA (all personal). Each `source` names LinkedIn or the GitHub repo.
- [ ] **Step 5: Verify.** Run `npx vitest run tests/content.test.ts` and `npm run check:content`. Expected: PASS.
- [ ] **Step 6: Commit.** `git add content lib scripts tests && git commit -m "feat: validated JSON content model and copy"`

### Task 3: SEO, Open Graph, structured data and llms.txt

**Files:**
- Create: `lib/llms.ts`, `lib/jsonld.ts`, `lib/site.ts`, `app/llms.txt/route.ts`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx` (metadata, JSON-LD script)
- Test: `tests/llms.test.ts`, `tests/jsonld.test.ts`, `tests/site.test.ts`

**Interfaces:**
- Consumes: `Content`, `loadContent()` from Task 2.
- Produces: `buildLlmsTxt(content: Content, siteUrl: string): string`; `buildPersonJsonLd(content: Content, siteUrl: string): Record<string, unknown>`; `getSiteUrl(): string` (reads `NEXT_PUBLIC_SITE_URL`; falls back to `http://localhost:3000` except when `VERCEL_ENV === "production"`, where it throws an Error naming the variable).

- [ ] **Step 1: Write the failing tests.**
  - `llms::starts with "# Adhish Pawar" followed by a "> " summary line`
  - `llms::lists all eight chapters under "## Chapters" and every project under "## Projects" with its link`
  - `llms::is deterministic and contains no "open to work"`
  - `jsonld::has @type Person, jobTitle "Associate Software Engineer", worksFor CoReCo Technologies Private Limited, and sameAs containing the LinkedIn and GitHub URLs`
  - `site::getSiteUrl throws when VERCEL_ENV is production and the variable is unset`
  - `llms route::GET returns text/plain; charset=utf-8 and the buildLlmsTxt output`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/llms.test.ts tests/jsonld.test.ts tests/site.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the three pure builders and the route (`export const dynamic = "force-static"`). `opengraph-image.tsx` uses `ImageResponse` with `--void` background, the headline in white with the emphasis words in the accent. Layout metadata: title `Adhish Pawar`, description from `profile.aspirations` first sentence, Open Graph and Twitter card tags, canonical from `getSiteUrl()`.
- [ ] **Step 4: Verify.** Run `npx vitest run`, then `npm run build`, then fetch `/llms.txt` from `npm start` with `curl -s localhost:3000/llms.txt | head -5`. Expected: tests PASS; first line `# Adhish Pawar`.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: Open Graph, JSON-LD and generated llms.txt"`

### Task 4: UI primitives

**Files:**
- Create: `lib/emphasis.ts`, `components/ui/Emphasis.tsx`, `components/ui/Label.tsx`, `components/ui/Button.tsx`, `components/ui/SectionShell.tsx`, matching `*.module.scss`, `styles/_utilities.scss` (`.sr-only`)
- Test: `tests/emphasis.test.ts`, `tests/ui.test.tsx`

**Interfaces:**
- Produces: `parseEmphasis(text: string): {text: string; em: boolean}[]`; `<Emphasis text={string} />` (renders `<em>` segments); `<Label index?: string>{children}</Label>` (mono label, renders `[04] ...` style); `<Button href: string variant?: "primary">`; `<SectionShell id: string; labelledBy: string; level: 1|2; title: string; children>` (a `<section aria-labelledby>` whose heading uses `Emphasis` and is `h1` only when `level === 1`).

- [ ] **Step 1: Write the failing tests.**
  - `parseEmphasis("a *b* c")` returns `[{text:"a ",em:false},{text:"b",em:true},{text:" c",em:false}]`
  - `parseEmphasis("2 * 3")` and `parseEmphasis("*open")` return a single literal segment (unmatched markers stay literal)
  - `ui::SectionShell renders an h1 for level 1, an h2 for level 2, and aria-labelledby points at the heading id`
  - `ui::Button renders an anchor with the given href and visible text`
  - `ui::heading styles set overflow-wrap: anywhere` (reads `SectionShell.module.scss` as text; pins long-title wrapping from Review Focus 5)
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/emphasis.test.ts tests/ui.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** the components as server components (no `"use client"`). Heading style: Inter Tight 700, tight tracking, `text-wrap: balance`; `em` uses `--font-serif`. Button primary: `--accent` fill, white text, `:focus-visible` ring.
- [ ] **Step 4: Verify.** Run `npx vitest run`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: UI primitives with emphasis parsing"`

### Task 5: Chapters and the page (server-rendered)

**Files:**
- Create: `components/chapters/ChapterRenderer.tsx`, `components/chapters/{Boot,Origin,Foundations,Production,Flagship,Next,Explorer,Connect}Chapter.tsx` (+ `.module.scss`), `components/ui/SiteHeader.tsx` (skip link, name, nav as plain anchors), `components/ui/SiteFooter.tsx`
- Modify: `app/page.tsx`
- Test: `tests/page.test.tsx`

**Interfaces:**
- Consumes: `Content`, `Chapter`, `Project` (Task 2); `SectionShell`, `Label`, `Button` (Task 4).
- Produces: `<ChapterRenderer chapter={Chapter} projects={Project[]} />` mapping `chapter.kind` to the matching chapter component; every chapter section has `id="ch-0N"`. The Flagship chapter renders `<div data-slot="pipeline" />` and the Boot chapter `<div data-slot="orb" />` as insertion points for Tasks 10 and 11. `app/page.tsx` is an async server component calling `loadContent()`.

- [ ] **Step 1: Write the failing tests** (render to static markup with `renderToStaticMarkup`):
  - `page::server HTML contains the exact chapter 00 headline text and all eight section ids ch-00..ch-07` (Review Focus 1: no JS needed)
  - `page::contains exactly one h1`
  - `page::first focusable element is the "Skip to content" link targeting #main`
  - `page::swapping the content fixture's headline changes the output with no component change` (decoupled from data)
  - `page::FifthSense chapter shows the quote and the line "First pilot: Royal Orchid Hotels, Bangalore."`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/page.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** the chapter components. Layout follows the concept boards in `assets/concepts` (copy on the left, visual slot on the right, mono labels like `[04] FIFTHSENSE / GLOVATRIX`). Explorer renders `explorer.frames` as illustrated frames when `src` is absent. Connect chapter: one primary `Button` linking to LinkedIn, plus the three links as text. Add a `<noscript>`-safe layout: no content depends on JS.
- [ ] **Step 4: Verify.** Run `npx vitest run`, then `npm run dev` and open `/` to confirm all chapters render with JS blocked (browser devtools: disable JavaScript).
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: server-rendered chapters and page composition"`

### Task 6: Motion foundation (reduced motion, idle loader, Lenis)

**Files:**
- Create: `components/motion/useReducedMotion.ts`, `components/motion/LenisProvider.tsx`, `lib/idle.ts`
- Modify: `app/layout.tsx` (mount `LenisProvider`)
- Test: `tests/motion-foundation.test.tsx`

**Interfaces:**
- Produces: `useReducedMotion(): boolean` (client hook, tracks `matchMedia("(prefers-reduced-motion: reduce)")` changes); `whenIdle(cb: () => void, timeoutMs?: number): () => void` (uses `requestIdleCallback`, falls back to `setTimeout`, returns a cancel function); `<LenisProvider>{children}</LenisProvider>` (client; dynamically imports `lenis` after idle only when not reduced; enables anchor handling so `#ch-0N` links still work).

- [ ] **Step 1: Write the failing tests.**
  - `useReducedMotion::returns true when matchMedia reduces, and updates on a change event`
  - `whenIdle::calls back once, and the returned cancel prevents the call`
  - `LenisProvider::does not import lenis when reduced motion is on` (spy on the dynamic import)
  - `LenisProvider::destroys the Lenis instance on unmount`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/motion-foundation.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** the three units. Lenis must not intercept keyboard scrolling or anchor focus.
- [ ] **Step 4: Verify.** Run `npx vitest run`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: motion foundation with reduced-motion and idle loading"`

### Task 7: Boot sequence

**Files:**
- Create: `components/motion/Boot.tsx`, `components/motion/Boot.module.scss`, `lib/boot.ts`
- Modify: `components/chapters/BootChapter.tsx` (mount `<Boot />`)
- Test: `tests/boot.test.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`, `whenIdle` (Task 6).
- Produces: `BOOT_MS: number` (<= 3000); `shouldPlayBoot(input: {reduced: boolean; seen: boolean}): boolean`; `<Boot lines: string[] />` (client overlay).

- [ ] **Step 1: Write the failing tests.**
  - `shouldPlayBoot` table: plays only when `reduced` is false and `seen` is false
  - `BOOT_MS <= 3000`
  - `Boot::renders nothing under reduced motion`
  - `Boot::any keydown removes the overlay and sets sessionStorage "boot-seen"`
  - `Boot::overlay is aria-hidden, never wraps or hides the main content, and does not trap focus (a "Skip intro" button is the only focusable element inside it)`
  - `Boot::second mount in the same session renders nothing` (returning visitor, Review Focus 4)
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/boot.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement.** Overlay lines come from props (`> initialising orbit … 100%` style, text from `profile`/chapter 00 data, not hard-coded in the component). The overlay is `position: fixed` above the page and removed from the DOM on completion; `<main>` is never `display: none` or `aria-hidden`. Wrap storage access in try/catch.
- [ ] **Step 4: Verify.** Run `npx vitest run tests/boot.test.tsx`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: skippable once-per-session boot sequence"`

### Task 8: GSAP orbit line

**Files:**
- Create: `lib/orbit.ts`, `components/motion/OrbitLine.tsx`, `components/motion/OrbitLine.module.scss`
- Modify: `app/layout.tsx` or `app/page.tsx` (mount `<OrbitLine chapterIds={string[]} />`)
- Test: `tests/orbit.test.ts`, `tests/orbit-line.test.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`, `whenIdle` (Task 6); chapter ids `ch-00..ch-07` (Task 5).
- Produces: `computeOrbitSegments(ids: string[], weights?: Record<string, number>): {id: string; start: number; end: number}[]`; `<OrbitLine chapterIds={string[]} />` (client; fixed SVG path drawn by ScrollTrigger scrub via `strokeDashoffset`; GSAP imported dynamically).

- [ ] **Step 1: Write the failing tests.**
  - `computeOrbitSegments(8 ids)` returns segments that are contiguous, start at 0, end at 1, and sum of spans is 1 (within 1e-9)
  - `computeOrbitSegments` with weight `{ "ch-04": 2 }` gives `ch-04` twice the span of an unweighted chapter
  - `computeOrbitSegments([])` returns `[]`
  - `OrbitLine::under reduced motion the path has strokeDashoffset 0 and gsap is never imported`
  - `OrbitLine::path is aria-hidden and pointer-events none`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/orbit.test.ts tests/orbit-line.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement.** One master GSAP timeline, one labelled segment per chapter from `computeOrbitSegments(ids, {"ch-04": 2})`. Register `ScrollTrigger` inside the dynamic import only. Kill triggers on unmount.
- [ ] **Step 4: Verify.** Run `npx vitest run`, then scroll `npm run dev` and confirm the line draws with scroll.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: scroll-driven orbit line with GSAP"`

### Task 9: Framer Motion interface layer

**Files:**
- Create: `components/motion/MotionRoot.tsx`, `components/ui/NavMenu.tsx`, `components/ui/ConnectButton.tsx`
- Modify: `components/ui/SiteHeader.tsx` (use `NavMenu`), `components/chapters/ConnectChapter.tsx` (use `ConnectButton`)
- Test: `tests/nav.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 4), `useReducedMotion` (Task 6).
- Produces: `<MotionRoot>` (client; `LazyMotion` with `domAnimation`, loaded via dynamic feature import); `<NavMenu items: {label: string; href: string}[] />` (client; toggle button with `aria-expanded`, closes on Escape and returns focus to the toggle); `<ConnectButton href label />` (client; hover and press micro-motion, none when reduced).

- [ ] **Step 1: Write the failing tests** (user-event):
  - `NavMenu::toggle button has aria-expanded that flips on click`
  - `NavMenu::Escape closes the menu and returns focus to the toggle`
  - `NavMenu::all items are reachable with Tab when open`
  - `ConnectButton::still renders a plain link with the href when reduced motion is on`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/nav.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** using `m.*` components only (never the full `motion` import) so the bundle stays small. The header without JS still shows plain anchor links (progressive enhancement over Task 5's markup).
- [ ] **Step 4: Verify.** Run `npx vitest run`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: Framer Motion interface layer for nav and CTA"`

### Task 10: Three.js and GLSL (hero orb and FifthSense glow)

**Files:**
- Create: `lib/webgl.ts`, `components/webgl/StaticOrb.tsx`, `components/webgl/HeroOrb.tsx`, `components/webgl/FifthSenseGlow.tsx`, `components/webgl/shaders/halftone.frag.glsl`, `components/webgl/shaders/orb.vert.glsl`, `components/webgl/shaders.ts`, `public/images/halftone-orb.png` (copy of `assets/concepts/halftone-orb.png`)
- Modify: `components/chapters/BootChapter.tsx` and `FlagshipChapter.tsx` (fill the `data-slot` placeholders)
- Test: `tests/webgl.test.ts`, `tests/hero-orb.test.tsx`

**Interfaces:**
- Consumes: `whenIdle`, `useReducedMotion` (Task 6).
- Produces: `shouldUseWebGL(env: {reduced: boolean; saveData: boolean; hasWebGL: boolean; viewportWidth: number; deviceMemory?: number}): boolean`; `<StaticOrb />` (server component, `next/image` with explicit width and height, `priority`); `<HeroOrb />` (client; `next/dynamic` with `ssr: false`, mounted after `whenIdle`, canvas fades in over `StaticOrb`); `<FifthSenseGlow />` (same contract). `shaders.ts` exports `halftoneFragment: string` and `orbVertex: string`.

- [ ] **Step 1: Write the failing tests.**
  - `shouldUseWebGL` table: false when reduced, when saveData, when no WebGL, when `viewportWidth < 768`, when `deviceMemory < 4`; true for a desktop with 8 GB and WebGL
  - `shaders::halftoneFragment declares uniforms uTime, uLight and uStep`
  - `HeroOrb::renders StaticOrb markup on the server and no canvas` (the LCP element is the static image)
  - `HeroOrb::a "webglcontextlost" event removes the canvas and leaves StaticOrb visible` (Review Focus 3)
  - `HeroOrb::when shouldUseWebGL is false, three is never imported`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/webgl.test.ts tests/hero-orb.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement.** The fragment shader reproduces the approved halftone look: Lambert shading from the upper-left light, dot grid with spacing `uStep` px at a 900 px design size, dot radius `0.52 * uStep * v^0.7`, colour mixed from `#2F5BFF` to `#F4F4F4` by `v^1.6`, slow `uTime` drift. Dispose geometry, material and renderer on unmount; cap `devicePixelRatio` at 2; pause rendering when the tab is hidden or the canvas is off-screen (IntersectionObserver).
- [ ] **Step 4: Verify.** Run `npx vitest run`, then `npm run dev` and compare the hero with `assets/concepts/01-hero.png`.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: lazy WebGL halftone orb with static fallback"`

### Task 11: FifthSense chapter visuals

**Files:**
- Create: `components/diagrams/PipelineDiagram.tsx`, `components/diagrams/HandLineArt.tsx`, `components/motion/useFlagshipPin.ts`, matching `*.module.scss`
- Modify: `components/chapters/FlagshipChapter.tsx`
- Test: `tests/diagrams.test.tsx`

**Interfaces:**
- Consumes: `Project.diagram` (Task 2); `useReducedMotion`, `whenIdle` (Task 6).
- Produces: `<PipelineDiagram nodes: {id: string; label: string; detail: string}[] title: string />` (server component; SVG with `role="img"` and `aria-labelledby`, plus a visually-hidden `<ol>` listing each node in order); `<HandLineArt />` (decorative abstract SVG, `aria-hidden`); `useFlagshipPin(ref: RefObject<HTMLElement>): void` (client; ScrollTrigger pin for desktop only, skipped when reduced).

- [ ] **Step 1: Write the failing tests.**
  - `PipelineDiagram::renders one box per node, in order, with its label and detail`
  - `PipelineDiagram::exposes a text equivalent as an ordered list with the same labels`
  - `PipelineDiagram::with zero nodes renders nothing and does not throw`
  - `HandLineArt::is aria-hidden`
  - `useFlagshipPin::does nothing and imports no gsap when reduced`
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/diagrams.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement.** Diagram style follows `assets/concepts/02-fifthsense.png` (thin lines, glowing accent path, mono labels). Wire `Project` `fifthsense` into the Flagship chapter via `chapter.projectIds`.
- [ ] **Step 4: Verify.** Run `npx vitest run`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: FifthSense pipeline diagram and pinned chapter"`

### Task 12: Accessibility, no-JS, reduced-motion and performance gates

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/a11y.spec.ts`, `tests/e2e/keyboard.spec.ts`, `tests/e2e/nojs.spec.ts`, `tests/e2e/reduced-motion.spec.ts`, `tests/e2e/lcp.spec.ts`, `scripts/check-bundle.ts`, `lighthouserc.js`

**Interfaces:**
- Consumes: the whole site, run via `npm run build && npm start` on port 3000.
- Produces: `npm run test:e2e`, `npm run check:bundle`, `npm run lhci`.

- [ ] **Step 1: Write the gates.**
  - `a11y::axe finds zero violations tagged wcag2a, wcag2aa, wcag21aa on "/" in normal and reduced-motion modes`
  - `keyboard::first Tab focuses "Skip to content"; every focusable element shows a non-"none" outline when focused; the boot "Skip intro" button works with Enter`
  - `nojs::with JavaScript disabled, the h1 and all eight chapter headings are visible`
  - `reduced-motion::with reduce emulated there is no canvas element and no boot overlay`
  - `lcp::the largest contentful paint element is not a CANVAS` (PerformanceObserver)
  - `check-bundle`: reads the build output for `/` and fails if any initial chunk contains the markers `ScrollTrigger`, `WebGLRenderer`, `LazyMotion` or `lenis`
  - `lighthouserc.js`: desktop preset asserts performance >= 0.99, accessibility >= 0.98, best-practices >= 0.95, seo >= 0.98; a second mobile run asserts performance >= 0.95
- [ ] **Step 2: Run to see the current state.** Run `npm run build && npm run test:e2e && npm run check:bundle && npm run lhci`. Expected: any failure here is a real defect.
- [ ] **Step 3: Fix what fails** in the owning task's files (not in the gates). Typical fixes: move a static import to a dynamic one, add `width`/`height` to an image, raise a text colour to `--accent-text`.
- [ ] **Step 4: Re-run** the same command. Expected: all PASS; record the Lighthouse scores in the commit message.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "test: accessibility, no-JS, reduced-motion and performance gates"`

### Task 13: Deployment readiness and content guide

**Files:**
- Modify: `next.config.js` (headers), `app/robots.ts`, `app/sitemap.ts`
- Create: `README.md` (how to update content), `vercel.json` only if a setting cannot live in `next.config.js`
- Test: `tests/headers.test.ts`

**Interfaces:**
- Consumes: `getSiteUrl()` (Task 3).

- [ ] **Step 1: Write the failing test** `headers::next.config headers() returns immutable max-age=31536000 for /_next/static/* and /images/*, and includes X-Content-Type-Options nosniff and Referrer-Policy strict-origin-when-cross-origin`.
- [ ] **Step 2: Run to verify failure.** Run `npx vitest run tests/headers.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the headers in `next.config.js`. Write `README.md`: install, `npm run dev`, how to edit the five JSON files, `npm run check:content`, the environment variable `NEXT_PUBLIC_SITE_URL`, and the Vercel import steps (framework preset Next.js, add the variable for Production).
- [ ] **Step 4: Verify.** Run `npx vitest run`, `npm run check:content`, `npm run build`. Expected: all PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "chore: production headers and content guide"`

---

## Self-review notes

- **Spec coverage:** purpose and copy rules (Tasks 2, 3); truth rules and verified facts (Task 2 `source` test); chapters 00 to 07 (Task 5); palette, type, imagery (Tasks 1, 10, 11); motion (Tasks 6 to 11); stack and splitting (Tasks 6 to 10, 12); performance budget (Task 12); content model (Task 2); SEO and `llms.txt` (Task 3); accessibility (Tasks 4, 9, 12); deployment (Task 13). The spec's "Needed from Adhish" items (travel photos, FifthSense permission, domain) are inputs, not tasks: photos plug into `explorer.json`, the domain into `NEXT_PUBLIC_SITE_URL`.
- **Spec correction made while planning:** `--faint` passes AA (about 5.1:1) and `--accent` fails AA for small text (about 3.8:1), so `--accent-text #7C97FF` was added to the spec and Task 1 enforces it by test.
- **Type consistency:** `Content`, `Chapter`, `Project`, `useReducedMotion`, `whenIdle` and `shouldUseWebGL` are defined once and used with the same names in later tasks.
