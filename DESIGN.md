# Design — "Batik Cap"

A developer's systems shown as batik cap: one carved block, stamped again and again until it becomes the whole cloth.

## Colour
| Role | Dark (indigo cloth) | Light (unbleached cotton) |
|---|---|---|
| Ground `--bg` | #0D1431 | #F3EDE1 |
| Alt ground `--bg-2` | #111B40 | #EAE1CF |
| Surface | #16214F | #FBF8F1 |
| Ink | #F5EEDF | #111A3D |
| Saffron (fill / text) | #F4AA3A / #F5B04A | #EFA232 / #8C5200 |
| Madder (fill / text) | #E0563F / #F27A64 | #D6553D / #AE3523 |
Footer is always deep indigo #070B1E. Fills carry dye; text variants keep AA contrast.

## Type
- Display: Bricolage Grotesque (variable, wdth 86–94, weight 760–800). Tracking no tighter than -0.025em.
- Body: Figtree 400–700, 17px base.
- Data only (facts, figures labels, tags): JetBrains Mono.

## Motifs
CSS mask tiles in `:root`: kawung (four ovals), parang (diagonal bands), ceplok (nested lozenge), tumpal (triangle selvedge). They take the colour of the element's background.

## Shape
Radius 3px for blocks, pill (999px) for buttons and chips. Hairline 1px rules in `--line`.

## Motion grammar
- **Stamp**: scale 1.14→1, blur 8→0, opacity, `cubic-bezier(.2,.9,.25,1)`, 560–700ms.
- **Draw**: stroke-dashoffset 1→0, `cubic-bezier(.77,0,.175,1)`.
- **Flood**: dye fills from below (scaleY / clip-path), 460–520ms ease-out.
- Hero words rise from masks (900ms, 60ms apart); lists stamp in on scroll (70ms stagger, capped at 6).
- Moments: word-highlight statement (home), iris-opens on the projects bath (home).
- Hover: letter-roll on nav and next-project, dye flood on project rows and buttons, magnetic buttons, cursor ring with "View"/"Next" labels.
- Reduced motion: none of the movement; colour and state changes stay.
