# Adham Hewala: Portfolio

Personal website for **Adham Hewala, Backend & AI Engineer**.
Live at **https://adhamhe6.github.io/portfolio/**

It's a static site written in plain HTML, CSS and JavaScript. There's no build step and no dependencies to install.

## Features

- Sections: hero, key numbers, about, experience timeline, projects, skills, awards, certifications, education and contact
- Light and dark themes. It follows the system setting by default, and your choice is remembered
- Works on phones and desktops, with an accessible mobile menu
- Accessibility: semantic landmarks, a skip link, visible focus styles, support for reduced motion, and good colour contrast
- SEO: meta description, Open Graph tags, JSON-LD `Person` data, canonical URL and a sitemap
- Downloadable CV, a copy-email button, a custom 404 page and print styles

## Structure

```
index.html              # the whole page
404.html                # GitHub Pages "not found" page
sitemap.xml
.nojekyll               # serve files as-is (skip Jekyll)
assets/
  css/styles.css        # design tokens, layout, themes
  js/main.js            # theme toggle, mobile nav, scroll spy, reveal, copy email
  img/adham.jpg         # portrait / social preview
  img/favicon.svg
  docs/Adham_Hewala_CV.pdf
```

## Run locally

```bash
git clone https://github.com/adhamhe6/portfolio.git
cd portfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Merge this branch into `main`.
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, then click **Save**.
4. After a minute or two the site is live at `https://adhamhe6.github.io/portfolio/`.
5. Optional: in the repo's **About** panel, set the website to that URL.

Every push to `main` redeploys the site automatically.

## Updating content

- **Text:** edit `index.html`. Each section is marked with an `<!-- ===== NAME ===== -->` comment.
- **CV:** replace `assets/docs/Adham_Hewala_CV.pdf`, keeping the same file name.
- **Photo:** replace `assets/img/adham.jpg`. A square image of about 500×500 works best.
- **Colours:** change the `--accent` tokens at the top of `assets/css/styles.css`.
- **Project links:** when a project repo is public, add a link to it inside that project's card.
