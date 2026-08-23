# Cassady Tech Site Documentation

This folder is the operational documentation for `Cassady-Tech-Solutions/cassady-tech-site`. It is intentionally separate from the Astro and Cloudflare Worker application files.

| Document | Use it for |
| --- | --- |
| [Architecture](architecture.md) | System design, hosting model, domains, and runtime boundaries |
| [Deployment](deployment.md) | Safe local validation, review, release, and production verification |
| [Configuration and secrets](configuration-and-secrets.md) | Cloudflare variables, secrets, provider access, and rotation |
| [Contact form](contact-form.md) | Request flow, Resend delivery, webhook behavior, and Turnstile status |
| [Runbook](runbook.md) | Troubleshooting and routine operational checks |
| [Website administration](website-administration.md) | What humans own, what automation does, and appropriate AI-assisted work |

## Scope and source of truth

The GitHub repository is the source of truth for site code and this documentation. Cloudflare is the source of truth for deployed Worker configuration, custom domains, DNS, logs, and secrets. Resend is the source of truth for sender-domain verification and email-delivery activity. Never add credentials, copied secret values, or personal contact submissions to this folder.

## Change policy

Create a focused branch from current `main`, validate it, open a pull request, and merge only after review. This documentation branch does not alter application, build, Worker, DNS, or secret configuration.
