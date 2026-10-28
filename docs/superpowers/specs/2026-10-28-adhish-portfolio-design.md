# Adhish Pawar Portfolio: Design Spec

Date: 2026-10-28
Status: Draft for review. No code has been written.

## 1. Purpose

A personal portfolio told as a story. It is for recruiters, HR, engineers and founders who want to connect with Adhish.

- Adhish is **not job hunting**. The site must never say "open to work". The call to action is "let's connect".
- The site shows that he builds AI products and the systems behind them, from scratch to scale.
- It also shows the person: travelling, moving between places, learning new domains.

Success: a visitor can say in 30 seconds who he is, what he has shipped, and where he is heading, and can reach him in one click.

## 2. Positioning and truth rules

Headline (taken from his LinkedIn): **Associate Software Engineer | Java & Python | Agentic AI & GenAI | Core ML, Experimentation & Production Pipelines | Building AI Products from Scratch to Scale.**

Rules:

1. Every claim must trace to a verified source (LinkedIn, GitHub, or Adhish in chat). Nothing is invented: no titles, dates, metrics or clients.
2. Personal projects are labelled as personal projects. They are presented as products he designed and built, not as client work.
3. FifthSense photos or footage of deaf users appear only with the client's and users' permission.

### Verified facts (source, as of 2026-10-28)

| Fact | Source |
|---|---|
| Associate Software Engineer, CoReCo Technologies Pvt Ltd, Jul 2025 to present. Django REST Framework services on PostgreSQL and Redis for client products. GenAI work: speech-to-text, text-to-speech and RAG systems served as FastAPI microservices. Took part in POCs and a pilot that helped the company retain a client and win the PO. | LinkedIn |
| Machine Learning Engineer, Glovatrix, Sep 2025 to present. Product: FifthSense (Indian Sign Language gesture recognition for deaf users). Designed the ML gesture-prediction pipeline, built a continuous real-time prediction approach, and is architecting the platform backend. Stack: DVC, MLflow, Django REST Framework, Flask, MLOps CI/CD. | LinkedIn post, LinkedIn |
| First FifthSense pilot client: Royal Orchid Hotels, Bangalore. | LinkedIn post |
| Propel Excellence Award from CoReCo after about 10 months. | LinkedIn post |
| Talks: Walchand College of Engineering Alumni Business Meet (Pune); AI Demo Day (Gyde, Altzor Digital Solutions, CoReCo). | LinkedIn post |
| R&D Intern, PES's Modern College of Engineering, Dec 2023 to Jan 2024: distributed deepfake-detection system on Hadoop and Spark; model served via a Spring Boot and Java backend. | LinkedIn |
| B.E. Computer Engineering, PES's Modern College of Engineering, Jan 2021 to Jun 2025, **CGPA 9.38**. | LinkedIn, confirmed by Adhish |
| Projects: FusionX (CNN plus Transformer deepfake detector, PyTorch and FastAPI), FinSec Vault (Spring Boot 3 banking backend), UPI Replication System (payment saga, outbox, idempotency), ride-hailing demand/supply platform with a separate ML forecasting service, TimesheetPA (Teams chatbot using GPT-4o-mini), AI Prompt Manager, PriceWise-AI, teleinsight-mlops. | GitHub, LinkedIn |
| Credentials: AWS Academy Machine Learning and Cloud Foundation (Jul 2023); Java, Spring Boot 3, Docker and Git courses; GATE CSE preparation. 250+ LeetCode problems. | LinkedIn, GitHub |

### Conflicts resolved

- CGPA: LinkedIn 9.38 vs GitHub README 9.93. **Use 9.38.** Adhish should fix the README.
- The GitHub README says "Python & Backend Intern, Jan 2025". LinkedIn starts at Jul 2025 with no internship. **Use LinkedIn.**
- The README says "Open to Backend Engineer roles". This contradicts the site's purpose. Adhish should update it.
- The LinkedIn About text was not captured. Adhish should confirm nothing important is missing.

## 3. Aspirations (Adhish's words, lightly edited)

Build IT solutions at scale and automate workflows. Build AI-based applications and products. Move toward core ML: model development across ML, DL and AI. Keep a clear view of how tech and life fit together. Outside work: travel, move between places, learn, and build knowledge across many domains.

## 4. Story structure

One scroll, told as a mission log. The recurring motif is an **orbit** line, taken from his own post: "One orbit unlocked. Already locked in on the next one."

| Chapter | Title | Content | Visual |
|---|---|---|---|
| 00 | Boot | Short boot sequence, name, headline | Halftone orb, orbit rings |
| 01 | Origin | Pune, B.E. at Modern College, 9.38 CGPA, deepfake research | Timeline line art, halftone orb |
| 02 | Foundations | Java, systems thinking, UPI core, FinSec Vault | Glowing line diagrams of the payment state machine |
| 03 | Into production | CoReCo: Django, RAG and speech services, pilot that won a PO, Propel Excellence Award | Orbit line passing through "stations" |
| 04 | FifthSense | The ML pipeline, Royal Orchid pilot, the talks. Emotional centre of the page. | Line-art hand sign that draws itself; pipeline as a glowing path |
| 05 | Next orbit | Aspirations | Orbit line leaving the frame |
| 06 | Explorer | Travel, moving, learning | Grainy, desaturated photo frames with place names as coordinates |
| 07 | Connect | "If you are building something that matters, let's talk." | One blue button |

## 5. Visual identity: "Mission Control Night"

Dark, cinematic, calm. References: Razorpay AI Builders (dark, serif-italic emphasis, rendered illustration) and Heron AI (technical line drawings, mono labels, bracketed indices).

### Colour

| Token | Value | Use |
|---|---|---|
| `--void` | `#0D0D0D` | Page background (measured on Razorpay) |
| `--surface` | `#101010` | Raised surfaces |
| `--navy` | `#132644` | Subtle panels and glows (measured on Razorpay) |
| `--signal` | `#F4F4F4` | Headlines and body text |
| `--dim` | `#9F9F9F` | Secondary text |
| `--faint` | `#828282` | Labels and metadata (about 5.1:1 on void, passes AA) |
| `--accent` | `#2F5BFF` | The only accent, for graphics (orbit line), large text and button fills. About 3.8:1 on void, so it fails AA for small text. White text on this fill is about 5.2:1. |
| `--accent-text` | `#7C97FF` | A lighter tint of the same accent, for small accent-coloured text such as links (about 7:1 on void) |

One accent hue only. An automated test checks the contrast of every text and background pairing against WCAG AA.

### Typography (all free, self-hosted via `next/font`)

- Display: **Inter Tight**, bold, tight tracking, uppercase for chapter titles.
- Emphasis: **Instrument Serif**, italic, one or two words per headline.
- Labels and metadata: **Geist Mono**, small, for lines like `CH. 04 / FIFTHSENSE / PUNE`.
- Body: Inter Tight regular, about 65 characters per line.

### Imagery

- **Own work drawn as instruments:** thin-line diagrams of the UPI saga, the FifthSense pipeline and the orbit path.
- **No photos of Adhish.** He chose to leave his own photos out. Story chapters use generated halftone orbs, rings and line art. The Explorer chapter uses illustrated frames and a route line until he decides to supply travel photos (optional). No stock photos.
- **No generic AI imagery:** no robots, brains or glowing circuit boards.
- **Sign-language motif:** abstract line art only, unless real pilot imagery is cleared.

## 6. Motion

Slow and deliberate. Nothing bounces or flashes.

- Boot sequence: runs once per visit, under 3 seconds, skippable with any key, never blocks content, skipped under `prefers-reduced-motion`.
- Orbit line: one GSAP master timeline tied to scroll; each chapter is a labelled segment.
- FifthSense chapter: scroll slows (pinned section), hand-sign line draws, pipeline lights up in order.
- Interface motion (menu, hover, buttons, page transitions): Framer Motion.
- Three.js and GLSL: used in exactly two places, the opening halftone orb and ring, and the glow behind the FifthSense pipeline.

## 7. Technical architecture

### Stack

- Next.js (App Router) with SCSS modules.
- **GSAP + ScrollTrigger** for scroll timelines.
- **Framer Motion** for interface interactions, using `LazyMotion` with the `domAnimation` feature set to limit its size.
- **Three.js with GLSL shaders** for the two visual moments.
- **Lenis** for smooth scrolling (chosen over Locomotive Scroll for lower weight).
- Hosting: Vercel.

All four animation libraries stay, as requested, each scoped to the job above.

### Rendering and splitting

- Server components render all content. Animation lives in small client islands.
- GSAP, Framer Motion, Three.js and Lenis are loaded with dynamic imports after first paint.
- The first visible content (headline, static hero image) is plain server-rendered HTML and is the largest contentful paint element. The canvas never is.
- Phones receive a lighter shader or a static image.

### Performance budget

- Target Lighthouse 99+ on desktop. On mobile with WebGL the realistic target is 95+; this is stated honestly in the build plan.
- Fonts via `next/font` with only the needed weights. Images via `next/image` in AVIF or WebP with explicit dimensions.
- No layout shift: the hero reserves its space before the canvas mounts.

### File structure

```
app/                 layout.tsx, page.tsx, opengraph-image, sitemap, llms.txt route
components/
  ui/                buttons, labels, section shell (no data inside)
  chapters/          one component per chapter type, props only
  motion/            GSAP timeline hooks, Lenis provider, Framer variants
  webgl/             halftone orb, orbit ring, shaders (.glsl)
content/             profile.json, chapters.json, projects.json, skills.json, explorer.json
styles/              _tokens.scss, _type.scss, _motion.scss, module styles
public/              optimised images, diagrams
next.config.js
```

### Content model

Components hold no text. The five JSON files in `content/` are the only place content changes. Each project entry has: id, title, role, kind (client / personal), summary, stack, links, diagram, verified-source note. A script checks that every `projects.json` entry has a source note.

## 8. SEO and AIO

- Open Graph and Twitter tags on every page, with a generated social image in the site's style.
- Semantic HTML and structured data (`Person`) built from `profile.json`.
- `llms.txt` at the site root, generated from the same JSON so it cannot drift. It contains: a two-line identity summary, current role, chapter list, key projects with links, and contact details.

## 9. Accessibility

- Semantic landmarks, one `h1`, ordered headings.
- Full keyboard navigation with a visible focus ring in `--accent`.
- `prefers-reduced-motion`: Lenis off, boot sequence skipped, orbit line shown fully drawn, WebGL replaced by static images.
- Every diagram has a text equivalent; every image has alt text.
- Contrast checked against WCAG AA.

## 10. Deployment

Vercel, with production image and font optimisation, caching headers set in `next.config.js`, and a custom domain to be chosen.

## 11. Out of scope

- A blog, CMS, login or comments.
- A job-application or "hire me" flow.
- Instagram content (private account, excluded).
- YouTube (none exists).

## 12. Needed from Adhish before build

1. Confirm the LinkedIn About section and the dates above.
2. Optional: travel photos for Explorer. No photos of Adhish are required or used.
3. Permission and any images for FifthSense and Royal Orchid.
4. The contact method to show (default: LinkedIn, GitHub, and email).
5. A domain name.
