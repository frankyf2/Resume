# Dol — Portfolio

Personal portfolio website. Built with plain HTML/CSS/JS (no build step), deployable directly via GitHub Pages.

## Structure
- `index.html` — home / hero / featured work
- `work.html` — project index, links to `/work/*.html` case studies
- `work/*.html` — individual project case study pages
- `about.html` — about + timeline (draft) + certificates
- `contact.html` — contact form + links
- `404.html` — not found page
- `css/style.css` — shared styles
- `js/main.js` — mobile nav toggle
- `_includes/nav.html`, `_includes/footer.html` — shared header/footer, pulled into every page via Jekyll `{% include %}`

**Note:** the shared nav/footer only render through Jekyll's include system — GitHub Pages builds this automatically, but opening an `.html` file directly in a browser (double-click) will show the raw `{% include %}` tags instead of the header/footer. To preview locally, run `bundle exec jekyll serve` from this folder (requires Ruby + the `github-pages` gem), or just push to GitHub Pages and view it there.
