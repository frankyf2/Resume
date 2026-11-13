# Dol — Portfolio

Personal portfolio. Plain HTML/CSS/JS, **no build step and no templating** — every page is complete static HTML, so it
deploys unchanged to Vercel, GitHub Pages, Netlify or any static host.

## Structure
- `index.html` — home, hero, featured work
- `work.html` — project index; `work/*.html` — one case study per project
- `about.html` — bio, timeline, certificates, résumé download
- `contact.html` — form (Formspree) + links + guestbook (giscus)
- `404.html` — not-found page (with a snake game)
- `css/style.css` — all styles; theme tokens live in `:root` / `:root[data-theme="light"]`; batik motifs are CSS mask variables (`--pat-kawung`, `--pat-parang`, `--pat-ceplok`, `--pat-tumpal`)
- `js/main.js` — nav, theme, command palette (`/` or Ctrl/Cmd+K), form states, easter eggs
- `js/motion.js` — the motion layer: first-visit curtain, word-mask entrances, scroll stamps, cloth re-stamping, odometer figures, timeline line, letter-roll hovers, magnetic buttons, custom cursor
- `assets/moments/` — two scroll moments (word-highlight statement, iris-opens section) loaded as ES modules
- `fonts/` — self-hosted Bricolage Grotesque, Figtree and JetBrains Mono (SIL OFL)
- `DESIGN.md` — the visual system in one page

## Built with

**Runtime: nothing to install.** Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no npm dependencies at runtime.

| Area | Tool |
|---|---|
| Markup & styling | Hand-written HTML5 and CSS (custom properties, `:has()`, CSS masks, `clip-path`, scroll-driven animations, `@view-transition`) |
| Scripting | Vanilla JavaScript: `IntersectionObserver`, View Transitions API, `requestAnimationFrame`, ES modules |
| Scroll moments | `word-highlight` and `iris-opens` from the **taste-skill** motion kit (`assets/moments/`) |
| Fonts | [Bricolage Grotesque](https://github.com/ateliertriay/bricolage), [Figtree](https://github.com/erikdkennedy/figtree), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), all SIL OFL, self-hosted (files taken from [Fontsource](https://fontsource.org)) |
| Contact form | [Formspree](https://formspree.io) |
| Guestbook | [giscus](https://giscus.app) (GitHub Discussions) |
| Hosting | Any static host (GitHub Pages, Vercel, Netlify) |

**Design & build process.** Redesigned with [Claude](https://claude.ai) (Anthropic) using these skills:
- **impeccable**: product record (`PRODUCT.md`), visual direction ("Batik Cap"), craft checks and the design detector pass
- **design-taste-frontend (tasteskill)**: motion layer rules and the two scroll moments
- **emil-design-eng**: easing curves, durations, press and hover feedback, reduced-motion rules
- **[ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)**: design-system search (style, motion intensity, UX checklist)

Checked with headless Chrome via [Playwright](https://playwright.dev) at 1440, 1024 and 390 px, in light and dark, and with reduced motion on.

## Motion notes
- Page-to-page transitions use cross-document View Transitions (Chrome/Edge/Safari 18+); other browsers just navigate normally.
- Everything respects `prefers-reduced-motion`: no curtain, cursor, stamps or loops; content is always readable without JavaScript.
- The two looping things (stack marquee, hero cloth) each have a pause button and stop when off screen.

## Preview locally
Any static server works, for example `npx serve .` or `python -m http.server`. Opening the files directly also works, except the two scroll moments in `assets/moments/` (ES modules need http); the page still reads fine without them.

## Editing the shared nav/footer
They are inlined in every page. To change them, search-and-replace across `*.html` and `work/*.html`
(each page's nav marks its current link with `aria-current="page"`).

## Before sharing links
`og:image` points at `img/profile.jpg` with a relative path. Social platforms need an absolute URL
(`https://your-domain/img/profile.jpg`), so set it once your production domain is fixed.
