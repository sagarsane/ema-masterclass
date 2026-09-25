# Rockstar Adventures
Rockstar Adventures (formerly WKND Adventures) on AEM Edge Delivery Services. Bold stories, real life, wild places — with a dark, high-energy design system inspired by the [AEM Rockstar Masterclass](https://rockstar.adobeevents.com/en/masterclass).

## Brand
- Colors: near-black `#0b0b10` background, orange `#f97316` → magenta `#c026d3` brand gradient, violet `#7c3aed` chips, peach `#ffd7b0` kickers. Tokens live in `styles/styles.css`.
- Type: Poppins (headings, 700/800/900) and Roboto (body, 400/700), self-hosted in `fonts/`.
- Accessibility: text-bearing gradients use deeper stops (`#c2410c`, `#a21caf`, `#6d28d9`) so white text meets WCAG AA; hover states use a glow rather than brightening.

## Content import
The importer in `tools/importer/` pulls from the legacy source site (wknd-adventures.com). `transformers/brand.js` rewrites brand names and brand email domains so imported pages ship as Rockstar Adventures; image URLs are left pointing at the source host.

## Environments
- Preview: https://main--ema-masterclass--sagarsane.aem.page/
- Live: https://main--ema-masterclass--sagarsane.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `ema-masterclass` directory in your favorite IDE and start coding :)
