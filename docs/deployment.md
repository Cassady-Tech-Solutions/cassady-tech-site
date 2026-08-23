# Deployment and Release Process

## Prerequisites

- GitHub access to `Cassady-Tech-Solutions/cassady-tech-site`
- Node.js 22 or later
- Cloudflare access that can deploy the `cassady-tech-site` Worker
- Access to the authoritative Wrangler configuration (see [architecture](architecture.md))

## Standard release

1. Start from the latest `main` and create a focused branch.
2. Install dependencies with `npm install`.
3. Run `npm run check`. It builds Astro, writes the asset-ignore file, type-checks, and runs a Wrangler dry-run deployment.
4. When appropriate, use `npm run preview` to inspect the built site locally.
5. Open a pull request with a concise summary and validation result. Review content and operational impact.
6. Merge the approved pull request into `main`.
7. From an authenticated, authorized Cloudflare session, deploy the approved commit with `npm run deploy`, unless an intentionally configured CI deployment performs that action.
8. Verify production immediately using the checklist below.

A GitHub push alone does not prove deployment. This repository defines manual Wrangler commands and contains no tracked GitHub Actions workflow; any Cloudflare Git integration or other CI release path must be confirmed in the provider accounts.

## Production verification

- `https://cassadytech.com` loads over HTTPS and is the canonical hostname.
- `https://www.cassadytech.com` follows the intended redirect behavior.
- Main pages load with styles, images, and JavaScript (no asset 404s).
- Worker logs show no unexpected runtime errors.
- Submit one controlled contact-form test and confirm both the success response and inbox delivery. Do not put sensitive information in the test.
- If a webhook is configured, confirm its intended downstream record or log.

## Rollback

If a release is broken, first identify the last known-good Git commit and deployed Worker version. Use Cloudflare's Worker deployment/version controls or deploy that reviewed commit again using the approved procedure. Record the cause and corrective action in the pull request or incident record. Do not roll back secrets by copying them into Git.
