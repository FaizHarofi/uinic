# Asset credits

All third-party assets used by AWAS SCAM! after the Editorial Digital Detective redesign (2026-10-15).

| Asset ID | Asset name | Type | Source / creator | License | Modified | Local path | Date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AS-001 | Newsreader variable font (latin) | Web font (woff2) | Google Fonts — Production Type | SIL Open Font License 1.1 | No — latin subset served as-is | `public/fonts/newsreader-latin.woff2` | 2026-10-15 |
| AS-002 | Public Sans variable font (latin) | Web font (woff2) | Google Fonts — US Web Design System | SIL Open Font License 1.1 | No — latin subset served as-is | `public/fonts/publicsans-latin.woff2` | 2026-10-15 |
| AS-003 | lucide-react icon set | SVG icon components | Lucide Contributors | ISC (https://github.com/lucide-icons/lucide/blob/main/LICENSE) | Rendered as supplied React components | `lucide-react` dependency | 2026-10-14 |
| AS-004 | canvas-confetti | JS confetti effect | Peter Kaminski | ISC | No | `canvas-confetti` dependency | 2026-10-14 |

## Original assets (created for this project — not third-party)

| Asset ID | Asset name | Type | Creator / workflow | License | Local path | Date |
| --- | --- | --- | --- | --- | --- | --- |
| AS-005 | Mascot family — "Detektif Digital" (8 SVGs: `main`, `investigating`, `alert`, `thinking`, `hint`, `success`, `completion`, `avatar`) | SVG illustrations | Original artwork made for AWAS SCAM!. Workflow: hand-authored vector SVG in an AI-assisted coding session (opencode), no image-generation model, no external reference character copied. Character: human digital detective — skin `#F2BC94`, ink hair/tie/pants `#17243A`, teal jacket `#168C87` / `#0F6B67`, white shirt, evidence-yellow buttons/badges `#F0C75E`, props: magnifying glass + smartphone. Recolored to the locked Ink/Paper/Signal palette during the 2026-10-15 redesign; poses unchanged. | Original work of this project — no third-party license applies | `public/assets/mascot/*.svg` | 2026-10-15 |
| AS-006 | Evidence-artifact case covers (`CaseCover`) — WhatsApp chat fragment, phone-call screen, browser/scam-site fragment | Code-drawn HTML/CSS scenes | Original work made for AWAS SCAM!; no illustration assets involved | Original work of this project | `src/components/CaseCover.tsx` | 2026-10-15 |

Used in code via `src/components/Mascot.tsx`: case-completion page (`completion`), and
in-game feedback only — inspect / debate / pinboard / emergency (`success` / `alert`).
The nav logo is an inline SVG magnifier, not the mascot (`avatar` pose is currently unused);
the homepage, panduan, progres, and hint panel intentionally carry no mascot — their visual
material is the evidence artifact and plain text.

## Attribution

* Newsreader and Public Sans are used under the SIL Open Font License 1.1 (free to use, embed,
  and redistribute with the license text preserved; fonts are self-hosted, no Google Fonts CDN call).
* lucide-react and canvas-confetti are used under the ISC license.
* No third-party raster images, illustrations, or audio are used. All imagery is either code-drawn
  (evidence artifacts) or original SVG (mascot).
* Footer links to the Tentang page, which repeats these credits with license names.

## Retired / removed assets

| Former asset | Reason |
| --- | --- |
| `public/assets/hero-detective.jpg` | Decorative raster hero image; unreferenced after the Editorial redesign and removed with the homepage rework (2026-10-15). |
| `public/assets/openmoji/` (38 SVGs) + `src/components/OpenMoji.tsx` | Retired with the comic world: illustrations replaced by code-drawn evidence artifacts, lucide icons, and the recolored original mascot. CC BY-SA attribution no longer needed and removed from footer/Tentang. |
| `public/fonts/fredoka-latin.woff2`, `public/fonts/nunito-latin.woff2` | Replaced by Newsreader + Public Sans (OFL, self-hosted). |
| `src/components/FriendlyDetectiveArt.tsx` (original detective SVG) | Removed in an earlier pass; superseded then by OpenMoji, now by the mascot family. |
| `public/assets/illustrations/case-*.svg` (3 original case illustrations) | Replaced by OpenMoji scenes, now by code-drawn `CaseCover` artifacts. |
| `public/assets/images/*.png` (scene/portrait PNGs) | Unused by any code; provenance unverifiable; removed. |
| `src/components/TitleScreen.tsx`, `ComicHeader.tsx`, `CaseSolvedModal.tsx`, `HandbookModal.tsx` | Dead code, never imported; removed during redesign. |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Create-Next-App boilerplate, unreferenced; removed. |

## Licensing notes on choices

* **unDraw was not used.** Its license explicitly prohibits automated downloading/scraping of its
  illustrations (noted during asset research in `ASSET_RESEARCH.md`).
* **OpenMoji is no longer used.** Previously credited under CC BY-SA 4.0; all OpenMoji files and
  references were removed in the 2026-10-15 redesign.
* Realistic colours inside evidence artifacts (WhatsApp chat chrome, browser traffic lights, the
  garish gold scam-site) are intentional artifact fidelity, not brand palette entries; they appear
  only inside those artifacts.
