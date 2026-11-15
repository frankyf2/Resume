# Dol's portfolio

Hi, I'm Dol (Abdullah bin Harun). I'm a full-stack developer working mostly in Blazor and .NET, and this is my portfolio site. It covers the platforms I've built for PNMS and MIRAR, a few side builds, my résumé and a bit about me.

Live at **[frankyf2.github.io/Resume](https://frankyf2.github.io/Resume)**.

I kept this one deliberately simple: plain HTML, CSS and JavaScript. No framework, no build step, no npm packages at runtime. Every page is a complete HTML file, so I can drop it on GitHub Pages (or any static host) as is.

## What's in here

- `index.html`: home page with featured work
- `work.html`: all my projects; each one has its own case study in `work/`
  (MIRAR, PNMS, iSelia, iSeliaIntel, CareVentis, star8892, Autumn Twilight, iSusun)
- `about.html`: bio, skills, timeline, certificates and my résumé
- `contact.html`: contact form and a guestbook
- `404.html`: a not-found page, with a snake game
- `css/style.css`: all the styles; theme colours are in `:root` and the batik patterns are CSS masks
- `js/main.js`: nav, light/dark theme, the command palette (`/` or Ctrl/Cmd+K) and the easter eggs
- `js/motion.js`: all the animation (intro curtain, scroll effects, cursor, hovers)
- `fonts/`: Bricolage Grotesque, Figtree and JetBrains Mono, self-hosted
- `DESIGN.md`: my notes on the visual style

## Built with

| | |
|---|---|
| Markup & styling | Hand-written HTML and CSS (custom properties, `:has()`, CSS masks, `clip-path`, view transitions) |
| Scripting | Vanilla JS: `IntersectionObserver`, View Transitions API, `requestAnimationFrame` |
| Fonts | [Bricolage Grotesque](https://github.com/ateliertriay/bricolage), [Figtree](https://github.com/erikdkennedy/figtree), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), all SIL OFL, from [Fontsource](https://fontsource.org) |
| Contact form | [Formspree](https://formspree.io) |
| Guestbook | [giscus](https://giscus.app) |
| Hosting | GitHub Pages |

The word-highlight and circle-reveal scroll effects are based on the motion kit from the **taste-skill** design skill, rewritten as plain JS. I designed and wrote the site with [Claude](https://claude.ai) as a pair, and tested it in headless Chrome with [Playwright](https://playwright.dev) at desktop, tablet and phone sizes, in light and dark, with reduced motion on.

## The Malaysian bits (and easter eggs)

I wanted the site to feel like it's from here, not a template.

- **Hero cloth:** batik cap blocks (kawung, parang, ceplok, tumpal) mixed with teh tarik, roti canai, satay, cendol and ketupat. It keeps re-stamping itself with new motifs and dyes.
- **Kopitiam menu** on the home page, standing on Peranakan floor tiles.
- Type `teh` anywhere for a **teh tarik pour**.
- Type `sus` anywhere for an **emergency meeting**.
- **Off the clock** on the About page: the games I play. No logos or game art, just my own glyphs.
- The **404 snake** eats ketupat.
- The **Konami code** still works.

## Motion and accessibility

- Page transitions use cross-document View Transitions (Chrome, Edge, Safari 18+). Other browsers just load the next page normally.
- If you have reduced motion turned on, the curtain, custom cursor, stamps and loops are all off, and the easter eggs show a short message instead.
- The two looping animations (the stack marquee and the hero cloth) have pause buttons and stop when they're off screen.
- Everything is readable without JavaScript.

## Running it locally

Any static server works, for example `npx serve .` or `python -m http.server`. Opening the HTML files directly works too.

## Notes to self

- The nav and footer are copied into every page, so changes mean a search-and-replace across `*.html` and `work/*.html`. Each page marks its own nav link with `aria-current="page"`.
- `og:image` still points at `img/profile.jpg` with a relative path. Social previews need the full URL, so switch it to an absolute link if the domain changes.

## Contact

- Email: abdullahharun96@gmail.com
- LinkedIn: [linkedin.com/in/abdullahharun96](https://www.linkedin.com/in/abdullahharun96/)
