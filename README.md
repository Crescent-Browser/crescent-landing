# Crescent landing page

The approved Crescent Browser landing page: Playground’s pink/lavender visual direction, the “Bring back the joy of browsing” headline, the Prism mark, and locally bundled Outfit typography.

## Develop and build

Requires Node.js 22+. No dependencies or installation step.

```sh
npm run dev
# http://127.0.0.1:4173
npm run check
npm run build
```

`public/` is the website source. `dist/` is the static build. The development server binds only to loopback. GitHub Pages deployment is configured in `.github/workflows/pages.yml`. A custom domain has not been configured.

## Source layout

- `public/index.html`: the full landing page.
- `public/styles.css`: the approved appearance, device illustrations, responsive layout, and legal-page styling.
- `public/data.js`: the 28 native theme combinations and local brand-asset paths/names.
- `public/scripts/prism.js`: native Prism facet drawing port.
- `public/scripts/mobile.js`: the mobile UI and Share → Profile → pin-success demonstration.
- `public/scripts/motion.js`: reversible device reveals, floating motion, and the pausable mobile tour.
- `public/scripts/profiles.js`: the independent Work, Personal, and Creative carousel, with four Favorites and five app tabs per Profile.
- `public/app.js`: command search, connection choices, and the keyboard-accessible platform selector.
- `public/scripts/migration.js`: browser-specific source windows and a replayable move into Crescent.
- `public/assets/`: the Prism artwork, Outfit font/license, and original brand SVGs with source and license records.

The phone and desktop examples use synthetic content and temporary in-page state. They do not read browser data, sign in, connect devices, persist selections, or perform real import/sync. There are no analytics, third-party scripts, remote font requests, cookies, or browser storage. Manual controls and reduced-motion preferences are supported.

The earlier design galleries, standalone review files, screenshot experiments, test fixtures, and QA receipts have been removed. Production checks remain in `tools/`.

## Publication and claims

The organization is https://github.com/Crescent-Browser. Release availability, complete import/extension compatibility, mobile feasibility, final browser licensing, security claims, and comparative speed measurements require evidence before asserting release availability or compatibility. Cookies and site storage never sync.

See [asset and claim provenance](docs/provenance.md) and [third-party notices](THIRD_PARTY_NOTICES.md). Website publication requires owner authorization.

## Hosting and installer downloads

The GitHub Pages workflow, same-origin release catalog, and OS-aware download buttons are prepared. See [hosting and domain setup](docs/hosting.md). Run `npm run test:releases` for the distribution-boundary checks and `npm run sync:releases` to refresh the catalog. Deployment is gated by `PAGES_ENABLED`; the owner approved publication to the temporary GitHub Pages URL.
