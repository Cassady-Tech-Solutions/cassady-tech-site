# Cassady Tech Solutions Website Platform

This folder contains the operational and technical documentation for the Cassady Tech Solutions website hosted at `cassadytech.com`.

The goal is to keep website administration, deployment, Cloudflare runtime details, and operational knowledge separate from the production application files used by Astro and Cloudflare Workers.

## Related planning

- [Website rebuild plan](../website-rebuild-plan/README.md): Living strategy for the future Cassady Tech Solutions and Greenhorn Valley Tech repositioning and redesign.

## Start Here

- [ADMINISTRATION.md](./ADMINISTRATION.md): How the website is actually managed, including human responsibilities, automation, and AI-assisted work.
- [ARCHITECTURE.md](./ARCHITECTURE.md): Technical architecture, request flow, components, and responsibility boundaries.
- [DEPLOYMENT.md](./DEPLOYMENT.md): Build, validation, preview, deployment, and rollback procedures.
- [CONFIGURATION.md](./CONFIGURATION.md): Cloudflare, domains, Worker variables, secrets, Turnstile, Resend, and environment configuration.
- [SECURITY.md](./SECURITY.md): Security controls, secret handling, repository boundaries, and change control.
- [RUNBOOK.md](./RUNBOOK.md): Routine operations, troubleshooting, and incident response procedures.

## Production Summary

- Repository: `Cassady-Tech-Solutions/cassady-tech-site`
- Production branch: `main`
- Framework: Astro 5 with TypeScript
- Runtime: Cloudflare Workers
- Deployment tool: Wrangler
- Production domain: `https://cassadytech.com`
- Alias: `https://www.cassadytech.com`
- Worker service: `cassady-tech-site`
- Worker development URL: `https://cassady-tech-site.cassady-samuel95.workers.dev`
- Contact protection: Cloudflare Turnstile
- Contact delivery: Resend

## Documentation Scope

These files document the current known production design. They do not contain secrets, API keys, passwords, tokens, or private credentials.

If implementation details change, update these documents in the same pull request as the related application or infrastructure change whenever possible.
