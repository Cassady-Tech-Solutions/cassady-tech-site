# Deployment Guide

## Purpose

This guide documents the normal path for validating and deploying the Cassady Tech Solutions website to Cloudflare Workers.

## Prerequisites

The administrator performing a deployment should have:

- Access to `Cassady-Tech-Solutions/cassady-tech-site`.
- Node.js 22 or newer.
- npm installed.
- Wrangler authentication for the correct Cloudflare account.
- Permission to deploy the `cassady-tech-site` Worker.
- Access to production secrets and service configuration when required for troubleshooting.

Do not place secrets into the repository or local shell history unnecessarily.

## Local Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/Cassady-Tech-Solutions/cassady-tech-site.git
cd cassady-tech-site
npm install
```

## Local Development

Run Astro locally:

```bash
npm run dev
```

Use this for content, layout, and normal application development.

## Build

Generate the production build:

```bash
npm run build
```

The build script runs Astro and then writes the required `.assetsignore` configuration used by the Cloudflare deployment process.

## Full Predeployment Check

Run:

```bash
npm run check
```

The current check script performs:

1. Astro production build.
2. Asset-ignore generation.
3. TypeScript validation.
4. Wrangler dry-run deployment validation.

A production deployment should not proceed if this command reports unresolved errors.

## Cloudflare Preview

Run:

```bash
npm run preview
```

This builds the project and starts `wrangler dev`, which more closely represents the Cloudflare runtime than `astro dev`.

Use this when validating Worker-specific behavior, runtime bindings, or server-side logic.

## Standard Deployment Workflow

Recommended production workflow:

1. Update local `main`.
2. Create a feature or maintenance branch.
3. Make the required change.
4. Run `npm run check`.
5. Review the Git diff.
6. Commit and push the branch.
7. Open a pull request into `main`.
8. Obtain human review for production-impacting changes.
9. Merge the approved pull request.
10. Deploy the merged production state using the approved deployment method.
11. Validate the production site.

## Manual Wrangler Deployment

The repository currently defines:

```bash
npm run deploy
```

This command prepares the asset-ignore file and invokes:

```bash
wrangler deploy
```

Before running it, confirm:

```bash
git status
git branch --show-current
```

For a production deployment, the intended code should match the approved `main` state unless an explicitly authorized emergency procedure is being used.

## Postdeployment Validation

At minimum, verify:

- `https://cassadytech.com` loads successfully.
- `https://www.cassadytech.com` behaves as intended.
- Major navigation links work.
- Static assets load without obvious failures.
- The contact page renders correctly.
- Turnstile appears and validates when enabled.
- A controlled contact-form submission reaches the configured mailbox.

For a Worker-specific issue, also test the direct Worker endpoint:

```text
https://cassady-tech-site.cassady-samuel95.workers.dev
```

## Rollback

Preferred rollback strategy is Git-based:

1. Identify the last known-good commit.
2. Revert the problematic change through Git.
3. Review the rollback diff.
4. Merge the rollback.
5. Deploy the restored state.
6. Validate production.

If Cloudflare's deployment history is used for an emergency rollback, reconcile Git immediately afterward. Git must continue to describe the intended production state.

## Emergency Deployment

An emergency deployment may bypass the normal review duration only when a human administrator explicitly determines that the production impact justifies it.

Even during an emergency:

- Preserve the change in Git.
- Do not disable security controls unless specifically authorized and risk-assessed.
- Record what changed and why.
- Validate production after the change.
- Follow with a normal review once service is restored.

## Deployment Failure Triage

If deployment fails:

1. Run `npm run check` again and capture the first meaningful error.
2. Confirm Node.js and npm versions.
3. Confirm Wrangler authentication and selected Cloudflare account.
4. Confirm the Worker name is still `cassady-tech-site`.
5. Check for conflicts between Wrangler configuration files.
6. Confirm required secrets and variables exist in Cloudflare.
7. Review recent code and configuration changes.
8. Test with `npm run preview`.

See [RUNBOOK.md](./RUNBOOK.md) for operational troubleshooting.
