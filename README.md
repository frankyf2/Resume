# Dol — Portfolio

Personal portfolio. Plain HTML/CSS/JS, **no build step and no templating** — every page is complete static HTML, so it
deploys unchanged to Vercel, GitHub Pages, Netlify or any static host.

## Structure
- `index.html` — home, hero, featured work
- `work.html` — project index; `work/*.html` — one case study per project
- `about.html` — bio, timeline, certificates, résumé download
- `contact.html` — form (Formspree) + links + guestbook (giscus)
- `404.html` — not-found page (with a snake game)
- `css/style.css` — all styles; theme tokens live in `:root` / `:root[data-theme="light"]`
- `js/main.js` — nav, theme, command palette (`/` or Ctrl/Cmd+K), form states, easter eggs

## Preview locally
Any static server works, for example `npx serve .` or `python -m http.server`. Opening the files directly also works.

## Editing the shared nav/footer
They are inlined in every page. To change them, search-and-replace across `*.html` and `work/*.html`
(each page's nav marks its current link with `aria-current="page"`).

## Before sharing links
`og:image` points at `img/profile.jpg` with a relative path. Social platforms need an absolute URL
(`https://your-domain/img/profile.jpg`), so set it once your production domain is fixed.
