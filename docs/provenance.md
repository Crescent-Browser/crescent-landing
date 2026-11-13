# Landing source and claim provenance

Updated 2026-11-13. The owner-approved landing design is now the production source in `public/`.

## Assets

- Crescent mark and favicon: original Prism artwork from the browser workspace (`research/design/prism-apply/icons/mark-spectrum-1024.png` and `favicon-spectrum-32.png`).
- Outfit: the original variable font is retained, with a WOFF2 delivery version generated using FontTools without design changes. Original font from the public Google Fonts collection. Source: https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/Outfit%5Bwght%5D.ttf. Full OFL text is bundled beside it.
- Sixteen application/network marks: retrieved with Open Brand Assets’ `find-brand-logo` workflow from SVGL and Gilbarbara Logos. The public source manifest, original variants, hashes, dates, and usage notes are retained under `public/assets/brands/`.
- Additional migration/platform marks: Arc, Chrome, Zen, Firefox, Android, and Apple from SVGL revision `90f6de7026c5e75a9014dbf1f422792bd40b1802`; Dia from its official website favicon. Artwork is preserved unchanged, with per-file hashes and URLs in the source manifest.
- Google: Devicon v2.17.0, https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/google/google-original.svg . Its MIT notice remains bundled.

Only the selected Outfit font and assets used by the production page are retained. Native development captures, abandoned fonts, standalone review artifacts, and screenshot fixtures have been removed.

## Product illustrations

All browser, phone, account, article, import, and connection examples are synthetic HTML/CSS illustrations. The Medium, GitHub, and Figma examples do not copy those sites’ pages. The owner’s Arc Search screenshots informed structure only; no personal browsing or source images are included.

Native theme colors come from the pure C++ resolver. Prism ports the seeded native facet algorithm and current expanded-sidebar layout policy. `docs/theme-provenance.json` retains implementation hashes and rendering parameters. The phone adaptation remains a proposal.

The landing uses evergreen presentation copy. Wide desktop hero devices are visible at page load and retain their floating motion. Browser-specific migration windows and five platform choices are interactive illustrations. The iOS and Android marks use monochrome CSS masks that inherit the same color as the desktop symbols; their source SVGs remain unchanged. No new product-release evidence is implied by these presentation changes.

### Migration illustration references (2026-11-13)

The five source windows are original HTML/CSS interpretations, not screenshots or copied UI code. All tabs, names, and page content are synthetic. The shared sample tabs illustrate the proposed migration experience; full setup and configuration parity remain in development.

- Arc: its sidebar model, Favorites, pinned tabs, folders, and Spaces. Reference: https://resources.arc.net/ and the official https://arc.net/ migration overview.
- Chrome: the familiar horizontal-tab configuration, rounded omnibox, profile control, tab groups, and bookmarks bar. Reference: https://www.google.com/chrome/ . Chrome also offers vertical tabs; the illustration deliberately shows its horizontal layout.
- Zen: the official hero's warm dark sidebar, six Essentials, Workspaces, and inset page. Reference: https://zen-browser.app/ and https://zen-browser.app/media/hero-video/poster.webp .
- Dia: the current official demo's cream/yellow sidebar, three Favorites, tab groups, and Chats control. Reference: https://www.diabrowser.com/ (hero video poster). This depicts Dia's controls only; Crescent has no AI integration.
- Firefox: a horizontal-tab configuration with a separate address toolbar, tracking-protection shield, bookmarks, extensions, and application menu. Reference: https://www.firefox.com/en-US/browsers/desktop/ .

The owner requested “New browser. Same look and config.” as the migration headline. It expresses the intended experience; the scene explicitly labels migration as in development. The bottom download section was removed; its verified release catalog is now accessible on demand through the download links.

## Product boundaries

The browser uses Chromium’s full browser foundation. Desktop scope includes macOS, Windows, and Linux; current native development evidence is on macOS. Release availability is not asserted. Full extension compatibility and complete migration remain under validation.

Crescent Mobile, same-account continuity, secure pairing, personal Hub transport, and Crescent Cloud are in development. Tailscale represents an optional network path around a personal Hub, not a deployed integration. Cookies and site storage never sync. No cloud-synced article library, AI integration, or comparative speed claim is advertised. The final browser license remains under completion. iOS feasibility under the no-WebKit constraint is unresolved.

The website does not collect data or perform real sync, migration, sign-in, or pairing. The owner approved GitHub Pages hosting at the temporary project URL. The owner subsequently purchased `crescentbrowser.com` and authorized custom-domain configuration and SEO work. DNS was entered by the owner in their Namecheap account.

## References

Zigzag (https://zigzagbrowser.com/) and Dia (https://www.diabrowser.com/) informed the information hierarchy and product storytelling. No source code, screenshots, or artwork from those landing pages is included.

## Search and sharing

The 1200×630 social card started as an original code-composed graphic using the existing Prism mark, Outfit font, and landing colors. Its wordmark was changed to “Crescent Browser” with the built-in image generation tool on 2026-11-13, using the original card as the edit target, then resized to its existing delivery dimensions. The separate Prism logo assets are unchanged. Favicon/search/touch sizes derive from the same original mark. Metadata and JSON-LD describe the public project and website; no fabricated ratings, offers, release versions, or installed-platform availability are included.


### Sharing image edit prompt

Mode: built-in image generation, existing-image edit. Saved asset: `public/assets/crescent-social.png`.

> Use case: text-localization. Edit target: the supplied Crescent Browser website social-sharing graphic. Change ONLY the small upper-left wordmark text from the lowercase word "crescent" to the exact text "Crescent Browser" (capital C, capital B, all other letters lowercase). Keep the same heavy rounded geometric Outfit-style font, dark purple ink, baseline, left position beside the small faceted crescent logo, and similar size. There is enough free horizontal space to extend the wordmark to the right. Preserve every other element as exactly as possible: the pale pink background, original faceted crescent artwork in both positions, the purple rounded right-side shape and peach circle, the headline "Bring back / the joy of / browsing.", the line "An open-source Chromium browser.", the URL "crescentbrowser.com", all colors, alignment, proportions and spacing. Keep the original 1200 by 630 pixel landscape canvas and composition. No new graphics, no extra text, no watermark. This is a precise existing-brand wordmark correction, not a redesign.
