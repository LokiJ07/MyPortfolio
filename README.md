# Louie Jay — Portfolio

Personal software development portfolio built as a lightweight static site.

**Live site:** https://lokij07.github.io/MyPortfolio/

## About the site

A clean, responsive portfolio covering my background, technical skills, selected projects, certificates, and ways to get in touch.

- Plain HTML, CSS, and JavaScript. No build tooling or UI framework is required to view the site.
- Nine project cards with descriptions and links; entries include both web systems and Android/desktop work.
- The NutriMap capstone highlights its **Most Promising Technology Award** at INNOHUB 2026 (3rd Northern Mindanao Research and Innovation Summit, April 30, 2026). The portfolio now displays the user-selected **AI-generated cleaned-up visualization** as a preview. The photographed certificate is preserved at `certificates/nutrimap-award-original-photo.webp` and is clearly linked as the authentic documentation; the enhanced visualization must not be mistaken for an official scan or independently verified certificate.
- System-aware, persistent light/dark mode.
- Responsive navigation, accessible certificate viewer, reduced-motion support, and keyboard-friendly controls.
- Original profile photo, certificate files, and the NutriMap award evidence stay in the repository.

## Run locally

Open `index.html` in a browser, or serve the repository directory using a basic static web server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Checks

With Node.js installed:

```bash
node --check script.js
node tests/verify.mjs
```

GitHub Actions runs these checks on pull requests and pushes to `main` or a `feature/*` branch.

## Deployment

The site is deployed with GitHub Pages from the repository. Changes to the live site should be reviewed and checked before merging into `main`.

## Project links

Project descriptions are intentionally concise and consistent: a title, a brief summary, and a website or GitHub link when public. Projects in development are not described as publicly released products.

© Louie Jay.
