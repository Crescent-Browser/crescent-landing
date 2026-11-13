# Hosting, domain, and release linkage

Recommended setup: GitHub Pages for the open-source browser project website, Namecheap for domain registration/DNS, and GitHub Releases in `Crescent-Browser/crescent-browser` for installers. Keep the paid Crescent Cloud application/backend separate from this static project website. GitHub Pages is not a SaaS hosting backend.

## Setup state and approvals

When this setup was prepared, only the landing repository was visible under Crescent-Browser and its Pages site was not enabled. The local browser checkout points to a repository that returns 404. The intended release source is `Crescent-Browser/crescent-browser`; establish that repository and its publication/license boundary before enabling installer publication. No installer releases or Windows/Linux distribution readiness are asserted.

The workflow and OS-aware download UI are implemented. The owner approved commit/push and publication at `https://crescent-browser.github.io/crescent-landing/`. The owner purchased `crescentbrowser.com` and authorized its setup. The Pages custom domain is now configured; the owner entered Namecheap DNS records from their laptop. No signing secret was read or signing key created. Pages deployment runs only when repository variable `PAGES_ENABLED` equals `true` and Pages is configured with GitHub Actions.

## Domain recommendation (checked 2026-11-13)

Prefer **crescentbrowser.com**. It matches the product and is easy to say. Optionally register **crescentbrowser.app** as a redirect/brand-protection domain. Authoritative registry RDAP returned 404 for both at the time checked; this suggests no registration record, not guaranteed registrar availability or non-premium pricing. `getcrescent.app` already has a registration record. Confirm availability and renewal pricing at Namecheap checkout.

Namecheap's .com page listed $12.08 first-year registration and $19.98 annual renewal, plus any applicable fees/taxes, when checked. Promotions and prices can change. BasicDNS is sufficient; GitHub Pages supplies HTTPS. There is no need to buy Namecheap website hosting or an extra SSL certificate for this configuration.

Sources:
- https://rdap.verisign.com/com/v1/domain/crescentbrowser.com
- https://pubapi.registry.google/rdap/domain/crescentbrowser.app
- https://www.namecheap.com/domains/registration/gtld/com/
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Publish the prepared site

After owner approval, commit/push the landing source and workflow. In repository Settings → Pages choose GitHub Actions. Set the repository Actions variable `PAGES_ENABLED=true`, then run the `Landing CI and GitHub Pages` workflow. The initial URL is `https://crescent-browser.github.io/crescent-landing/`. Relative asset and release-catalog paths support that project prefix as well as a custom-domain root.

PRs run release-routing tests, asset validation and the build without deployment. Main pushes, manual dispatches and the hourly schedule refresh the public release catalog, validate/build, then deploy only when enabled. Actions are pinned to verified upstream commit SHAs. Deployment uses the standard Pages OIDC permissions; no Namecheap or Cloudflare secret is needed.

## Purchased-domain configuration

1. Verify ownership of the domain under the GitHub organization using the TXT value GitHub provides. Do not invent or reuse another domain's verification token.
2. Add the custom domain in the landing repository's Pages settings before pointing DNS at it. This is independent of a CNAME file when using a custom Actions workflow.
3. Keep Namecheap BasicDNS. For an apex domain, set these A records for host `@`:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
4. Set `www` CNAME to `crescent-browser.github.io` (the organization host, without a URL scheme or repository path). Remove only conflicting parking/redirect records for those exact hosts; preserve mail and unrelated DNS records.
5. Wait for GitHub's DNS check/certificate, then enable Enforce HTTPS. GitHub can redirect between the configured apex and www domains. Do not add wildcard DNS for Pages.

Use the current GitHub instructions again when making the change: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https . The purchased domain is recorded in `public/CNAME`; organization-level Pages ownership verification remains a separate step using the exact TXT challenge supplied by GitHub.

## Installer handoff

`tools/sync-releases.mjs` reads the latest stable published release from `Crescent-Browser/crescent-browser` at site build time. It accepts only recognized uploaded installer names with SHA-256 digests and exact repository-owned GitHub URLs. Missing repositories/releases produce a safe empty catalog. API errors fail the build instead of silently replacing good links. Drafts/prereleases, incomplete uploads, malicious URLs and duplicate targets are rejected. Source-only releases do not create installer links.

The result is a same-origin static `public/releases.json`; visitors do not query GitHub's API or submit OS information to another service. A download begins only on a click. OS detection uses platform information and available CPU Client Hints. Universal Mac installers are preferred; uncertain architectures and mobile/ChromeOS clients get explicit manual choices. Only existing assets are listed. The release-updates state is intentional until the first signed installer exists.

The main browser checkout now contains `docs/releases.md`, `release/contract.json`, portable core CI, and a signature-gated draft-release workflow. Full production Chromium installer builders/signing are still prerequisites. Existing development/QA bundles cannot pass the publication gate. This is installer distribution, not a browser auto-update implementation.

After publishing a verified browser release, manually dispatch the landing workflow for immediate refresh. The hourly schedule also refreshes it without a cross-repository write token. Deployments are not made automatically from PRs.

## Validation

Run `npm run test:releases`, `npm run check`, and `npm run build`. Release-routing tests cover missing platforms, unknown CPU, mobile devices, drafts, malformed URLs, missing digests, and source-only releases. They do not certify a real native installer or signature.

## Custom domain and search setup

Canonical origin: `https://crescentbrowser.com/`. The apex uses GitHub Pages’ four A records and `www` is a CNAME to `crescent-browser.github.io`. GitHub Pages owns apex/www redirects and certificate provisioning. The Pages API setting is authoritative for this Actions deployment; `public/CNAME` documents the intended domain.

The production site includes canonical URLs, crawlable product copy, unique page metadata, Organization/WebSite/WebPage JSON-LD, a root sitemap and robots file, a branded 404 page, 96px/192px icons, and a 1200×630 social-sharing image. It uses local WOFF2 font delivery and content-addressed CSS/JavaScript. No analytics or external runtime scripts were added.

Google Search Console: add the **Domain** property `crescentbrowser.com`, publish the exact TXT record Google supplies at Namecheap, verify ownership, and submit `https://crescentbrowser.com/sitemap.xml`. Use URL Inspection on the homepage after HTTPS is ready. Bing Webmaster Tools can import a verified Search Console property. These account-level steps require the owner’s signed-in laptop session and must not be reported complete without evidence.

Indexing and ranking are controlled by search engines. No ranking position, indexing date, fabricated software ratings, or nonexistent download offers are claimed. Software-app rich-result markup is intentionally omitted until verified release/offer/review data supports it.
