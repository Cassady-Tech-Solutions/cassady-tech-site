# Website Architecture

## Purpose and ownership

This is the public website for Cassady Tech Solutions. It is owned in GitHub by the `Cassady-Tech-Solutions` organization; `main` is the production source branch. Organization maintainers own code review and repository access. Cloudflare administrators own the Worker, DNS, domains, logs, and secret configuration. Resend administrators own email sender verification and delivery access.

## Runtime design

```text
GitHub repository (main)
        |
        | build with Astro and deploy with Wrangler
        v
Cloudflare Worker: cassady-tech-site
        |-- ASSETS binding --> built static site in dist/
        |-- /api/contact --> Astro server endpoint
        |                      |-- Resend email
        |                      `-- optional workflow webhook
        `-- custom domains --> cassadytech.com and www.cassadytech.com
```

The application uses Astro 5, TypeScript/JavaScript, and the official `@astrojs/cloudflare` adapter. `astro.config.mjs` sets `https://cassadytech.com` as the canonical site and enables Cloudflare platform proxy support. The build output is `dist/`; the generated Worker entry is `dist/_worker.js/index.js`. Static output is served through the `ASSETS` binding. The post-build script writes an asset-ignore file so generated Worker code is not served as a static asset.

This is **Cloudflare Workers with static assets**, not a conventional Cloudflare Pages deployment. The repository has a legacy `functions/api/contact.js` handler that follows the Pages Functions style; the active route is `src/pages/api/contact.js`. Treat the legacy handler as non-production unless a Pages deployment is deliberately restored.

## Domains

- Canonical: `https://cassadytech.com`
- Alias: `https://www.cassadytech.com`
- Worker development/temporary address: `https://cassady-tech-site.cassady-samuel95.workers.dev`

Cloudflare must maintain TLS and custom-domain/route mapping for the two production hostnames. The desired policy is for `www` to redirect to the canonical apex hostname.

## Configuration caution

Both `wrangler.toml` and `wrangler.json` are tracked and overlap, but differ in compatibility date and observability settings. Before the next production deployment, a Cloudflare administrator should select one authoritative configuration, confirm which file Wrangler uses, and remove or deliberately retire the other in a separately reviewed change. Until then, treat configuration drift as a release risk.
