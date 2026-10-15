# Asset & UI reference research

## Design direction (2026-10-15 full visual redesign)

Target: a Duolingo-style playful learning game. Three primary colours only —
coral `#FF7043` (progress / success / primary actions), navy `#243B67` (type / structure),
ivory `#FFFDF5` (background) — plus white cards and semantic red `#E5484D` for danger/incorrect feedback.

## Sources consulted for direction and assets

| Source | URL | What was taken |
| --- | --- | --- |
| OpenMoji | https://openmoji.org | Illustration set: verified on the site that all emojis are free to use under CC BY-SA 4.0; consistent emoji-style guide; SVGs downloaded from the project's GitHub at tag 17.0.0 |
| Google Fonts (Fredoka, Nunito) | https://fonts.google.com/specimen/Fredoka , https://fonts.google.com/specimen/Nunito | Display + body type; both SIL OFL 1.1; variable woff2 self-hosted |
| unDraw | https://undraw.co | Considered and rejected: license forbids automated download/scraping of illustrations |
| Lucide | https://lucide.dev | UI icons (installed package, ISC) |
| canvas-confetti | https://github.com/catdad/canvas-confetti | Reward confetti on the results page (already installed, ISC) |

## Decisions applied

* **Gameplay `/main/[id]`**: full-bleed OpenMoji case scene on top of the stage (`CaseCover`, height-capped at
  `46vh` so 1440×900 and 1366×768 need no scroll), dialogue panel directly below, neutral choice cards (no red tint
  before choosing), red ring + shake only after a risky pick, green ring after a safe pick.
* **Catalogue/detail/home**:   shared `CaseCover` so every case thumbnail uses the same scene language.
* **Micro-animations**: tactile button press (3D shadow collapse), float on illustrations, staggered card rise,
  typewriter + caret (existing), score pop, shake on risky pick, confetti on results — all disabled under
  `prefers-reduced-motion`.
* **Accessibility**: green text on light backgrounds uses darkened `#2F6A02`/`#3B8A02` for AA contrast; primary
  buttons use navy text on green; progress reads from real `localStorage` only.
* **Modals**: the six gameplay modals (Inspect, Debate, Call, Browser, Pinboard, Emergency) were re-coloured from the
  old amber/slate theme to the brand scale (`--color-brand-*` in `globals.css`), keeping red for danger semantics.

## Verification method

License statements were read from the projects' own sites/pages (openmoji.org licensing page, Google Fonts OFL
bundling terms, Lucide and canvas-confetti LICENSE files in `node_modules`). Screenshots of the running app were
taken locally with headless Chrome (puppeteer-core) against `localhost:3000` at 1440×900, 1366×768, and 390×844;
interaction flows (choice rings, modals, reset, navigation, filters, mobile menu) were scripted the same way.
