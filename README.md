# Jekyll repo for sreekar.ch

[![Build Status](https://app.travis-ci.com/sreekarchigurupati/EarthBug.github.io.svg?branch=master)](https://app.travis-ci.com/sreekarchigurupati/EarthBug.github.io)

Based on the Minima Jekyll theme

Execute <code>execute-before-commit.sh</code> for tag generation.

## Authoring notes

### Images on the dark theme

Post content images (`<img>` and inline `<svg>`) get a **white background** by
default so transparent PNGs/SVGs with dark text stay legible on the dark theme.
Opaque photos cover this background, so they're unaffected.

If an image's content is **white/light** (e.g. white diagram lines or text on a
transparent background), the white canvas would hide it. Add the `on-dark` class
to keep that image transparent:

```markdown
![alt text](diagram.svg){:.on-dark}
```

`{:.on-dark}` is Kramdown's attribute syntax (Jekyll's default Markdown
processor) and renders as `class="on-dark"`. The styling lives in
`assets/css/style.scss` under the `.post-content img` rule.
