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
- `js/motion.js` — the motion layer: first-visit curtain, word-by-word statement highlight, the circle that opens the projects section, word-mask entrances, scroll stamps, cloth re-stamping, odometer figures, timeline line, letter-roll hovers, magnetic buttons, custom cursor
- `fonts/` — self-hosted Bricolage Grotesque, Figtree and JetBrains Mono (SIL OFL)
- `DESIGN.md` — the visual system in one page

## Built with

**Runtime: nothing to install.** Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no npm dependencies at runtime.

| Area | Tool |
|---|---|
| Markup & styling | Hand-written HTML5 and CSS (custom properties, `:has()`, CSS masks, `clip-path`, `@view-transition`) |
| Scripting | Vanilla JavaScript: `IntersectionObserver`, View Transitions API, `requestAnimationFrame` |
| Scroll moments | Word highlight and circle-opening section, based on the **taste-skill** motion kit's `word-highlight` and `iris-opens`, rewritten as plain script in `js/motion.js` |
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

## Malaysian touches & easter eggs
- **Hero cloth:** batik cap blocks (kawung, parang, ceplok, tumpal) mixed with teh tarik, roti canai, satay, cendol and ketupat, all drawn as wax-line motifs. The cloth keeps re-stamping itself, swapping motifs and dyes.
- **Kopitiam menu (home):** four dishes as a menu board, each with its own hover animation, standing on Peranakan floor tiles.
- **Teh tarik pour:** type `teh` anywhere, press *Pull a teh tarik*, or pick *Order a teh tarik* in the command palette.
- **Emergency meeting:** type `sus` anywhere, press *Call a meeting* on the About page, or use the command palette. An original siren-and-alert animation, not game artwork.
- **Off the clock (About):** the games I play, as HUD cards with original glyphs. Game names are trademarks of their owners; no logos or game art are used.
- **404:** the snake eats ketupat.
- **Konami code** still recolours the dyes for a few seconds.

## Motion notes
- Page-to-page transitions use cross-document View Transitions (Chrome/Edge/Safari 18+); other browsers just navigate normally.
- Everything respects `prefers-reduced-motion`: no curtain, cursor, stamps or loops; content is always readable without JavaScript.
- The two looping things (stack marquee, hero cloth) each have a pause button and stop when off screen.
- With reduced motion on, the teh tarik and emergency-meeting eggs show a short message instead of the full animation.

## Preview locally
Any static server works, for example `npx serve .` or `python -m http.server`. Opening the files directly also works, animations included.

## Editing the shared nav/footer
They are inlined in every page. To change them, search-and-replace across `*.html` and `work/*.html`
(each page's nav marks its current link with `aria-current="page"`).

## Before sharing links
`og:image` points at `img/profile.jpg` with a relative path. Social platforms need an absolute URL
(`https://your-domain/img/profile.jpg`), so set it once your production domain is fixed.
