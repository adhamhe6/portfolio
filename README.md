# Adham Hewala: Portfolio

Personal website for **Adham Hewala, Backend & AI Engineer**.
Live at **https://adhamhe6.github.io/portfolio/**

It's a multi-page static site built with plain HTML, CSS and JavaScript, using [Jekyll](https://jekyllrb.com/) layouts so the header and footer are written once. **GitHub Pages builds Jekyll automatically**, so there's no build step on your side.

## Pages

| URL | Contents |
| --- | --- |
| `/` | Hero, animated system diagram, key numbers, current role, selected projects, awards |
| `/about/` | Background, working principles, skills, awards, certifications, education, languages |
| `/experience/` | Career timeline with results for each role |
| `/projects/` | Lotus Platform (featured) plus project write-ups |
| `/contact/` | Email, copy-to-clipboard, GitHub / LinkedIn / X, CV, availability, Cairo local time |

## What makes it distinctive

- **"Engineering notebook" look:** warm paper tones, an editorial serif (Instrument Serif), mono labels and a faint blueprint grid.
- **Fig. 01:** an animated diagram of the kind of system Adham builds (RFID, POS and APIs → FastAPI → PostgreSQL, Redis, AI → dashboards).
- **Ctrl K / ⌘ K menu:** jump to any page, copy the email, download the CV, switch theme or open a social profile, all from the keyboard.
- Light and dark themes, accessible mobile menu, reduced-motion support, SEO metadata, sitemap and a custom 404 page.

## Structure

```
_config.yml             # site settings (name, email, URL, baseurl)
_data/nav.yml           # navigation pages
_data/social.yml        # GitHub / LinkedIn / X profiles
_layouts/default.html   # shared page shell
_includes/              # head, header, footer, CTA, icons, command menu
index.html  about.html  experience.html  projects.html  contact.html  404.html
sitemap.xml             # generated from _data/nav.yml
assets/css/styles.css   # design tokens, layout, themes
assets/js/main.js       # theme, nav, back to top, reveal, copy email, command menu
assets/img/             # portrait, favicon
assets/docs/            # CV (PDF)
```

## Deploy to GitHub Pages

1. Merge into `main`.
2. Go to **Settings → Pages → Build and deployment**.
3. Set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, then click **Save**.
4. After 1–2 minutes the site is live at `https://adhamhe6.github.io/portfolio/`.

Every push to `main` rebuilds the site automatically.

## Preview locally (optional)

```bash
gem install jekyll
jekyll serve --baseurl /portfolio   # open http://localhost:4000/portfolio/
```

## Updating content

- **Text:** edit the page's `.html` file.
- **Email, name, URL:** edit `_config.yml`.
- **Social profiles:** edit `_data/social.yml`. They update everywhere (hero, footer, contact page, command menu).
- **CV:** replace `assets/docs/Adham_Hewala_CV.pdf`, keeping the same file name.
- **Photo:** replace `assets/img/adham.jpg`. Use a square image.
- **Colours and fonts:** change the tokens at the top of `assets/css/styles.css`.
