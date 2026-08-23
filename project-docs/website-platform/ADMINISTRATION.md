# Website Administration and Management

This page explains how the Cassady Tech Solutions website is managed in practice. It separates human ownership from platform automation and AI-assisted work so that future administrators can quickly understand who or what is responsible for each part of the system.

## Administrative Model

The website is operated using a Git-centered workflow. GitHub is the source of truth for website code and deployment configuration. Cloudflare provides the production runtime, custom-domain routing, static asset delivery, and server-side execution. Resend handles outbound contact-form email. Cloudflare Turnstile provides bot protection for the contact workflow.

The preferred change path is:

```text
Human request or maintenance need
        |
        v
Human or AI prepares code/documentation change
        |
        v
Git branch and pull request
        |
        v
Human review and approval
        |
        v
Merge to main
        |
        v
Build and deployment through Wrangler / Cloudflare
        |
        v
Production validation
```

## What Humans Own

Humans remain the authority for business, security, and production decisions.

Human responsibilities include:

- Deciding what the website should say and what services the business offers.
- Approving branding, pricing, legal language, contact details, and public claims.
- Approving production-impacting code or infrastructure changes.
- Managing GitHub organization membership and repository permissions.
- Managing Cloudflare account ownership, domain registration, DNS, and administrative access.
- Managing Resend ownership and sender-domain authorization.
- Creating, rotating, revoking, and validating secrets and API credentials.
- Reviewing pull requests before merge when changes could affect production.
- Deciding when rollback or incident response is required.
- Verifying business-critical workflows after important deployments.

Humans should not place credentials, tokens, secret keys, or private configuration values directly into the repository.

## What Automation Owns

Automation handles repeatable technical execution after the required configuration and code are present.

### Astro

Astro builds the application into deployable output. The production build is generated with:

```bash
npm run build
```

The project build script runs Astro and then writes the Cloudflare assets-ignore configuration required by the deployment workflow.

### Wrangler

Wrangler is the deployment interface between the repository and Cloudflare Workers.

Key commands include:

```bash
npm run check
npm run preview
npm run deploy
```

Wrangler reads the repository's Cloudflare configuration, packages the Worker and static assets, and sends the deployment to Cloudflare.

### Cloudflare Workers

Cloudflare automatically handles requests after a deployment is active. This includes:

- Serving production website traffic.
- Serving static assets from the Astro build output.
- Executing server-side Worker logic.
- Routing configured custom domains to the deployed Worker.
- Providing the `workers.dev` service endpoint.
- Exposing configured environment variables and secrets to Worker code.

### Contact Form Automation

When a visitor submits the website contact form, the server-side workflow handles the request automatically.

The workflow performs the following tasks:

1. Accepts the submitted form data.
2. Sanitizes submitted values.
3. Checks the honeypot field used for simple bot filtering.
4. Verifies Cloudflare Turnstile when Turnstile is enabled.
5. Uses the Resend API to send the inquiry to the configured Cassady Tech Solutions mailbox.
6. Returns success or error status to the website.

No human action is required for a normal contact submission after the services and secrets are correctly configured.

## What AI May Assist With

AI may be used as an engineering and administrative assistant, but AI is not the production owner.

Appropriate AI-assisted work includes:

- Reviewing the codebase and existing configuration.
- Drafting website content.
- Preparing code changes.
- Preparing documentation changes.
- Identifying inconsistent configuration or stale documentation.
- Reviewing pull-request diffs.
- Suggesting architecture, security, accessibility, SEO, and performance improvements.
- Preparing troubleshooting steps.
- Creating tests or validation checklists.
- Preparing deployment or rollback commands for human review.

AI should normally work through Git branches and pull requests rather than making undocumented production changes.

## What AI Should Not Autonomously Own

Unless explicitly authorized by a human for a narrowly scoped task, AI should not independently:

- Change domain ownership or registrar settings.
- Change Cloudflare account ownership or organization membership.
- Rotate or expose production secrets.
- Change billing or paid-service plans.
- Publish legal or contractual claims.
- Alter pricing or business commitments.
- Merge high-impact production changes without human review.
- Disable security controls to work around a deployment problem.

## System of Record

The primary system of record for website implementation is:

```text
GitHub
Cassady-Tech-Solutions/cassady-tech-site
```

The `main` branch represents the intended production state.

Cloudflare contains runtime state that cannot safely or appropriately live in Git, including secrets, account configuration, domain configuration, and some service-side settings. Those settings should be documented here by purpose and expected name, but secret values must remain outside the repository.

## Routine Website Change

For a normal content or application change:

1. Create a branch from `main`.
2. Make the change in the repository.
3. Run local validation.
4. Review the diff.
5. Open a pull request.
6. Human reviews the change.
7. Merge the approved pull request.
8. Deploy using the approved deployment path.
9. Validate `cassadytech.com` after deployment.

## Emergency Change

If production is broken and a rapid fix is required, a human administrator may authorize an expedited deployment. Even then, the resulting code and configuration should be reconciled back into Git immediately so that the repository remains the source of truth.

## Administrative Ownership Summary

| Area | Primary Owner | Automation | AI Role |
| --- | --- | --- | --- |
| Business content | Human | None | Draft/review assistance |
| Git repository | Human | Git/GitHub mechanics | Code and documentation assistance |
| Production approval | Human | None | Review assistance |
| Astro build | Human initiated or CI initiated | Astro | Diagnose/build assistance |
| Worker deployment | Human initiated or CI initiated | Wrangler and Cloudflare | Prepare/review deployment |
| DNS and domains | Human | Cloudflare request routing | Audit/recommendations |
| Secrets | Human | Cloudflare secret injection | Identify required names only |
| Contact form | Human configures | Worker, Turnstile, Resend | Review/troubleshoot |
| Incident response | Human | Platform telemetry may assist | Investigation assistance |

## Guiding Rule

Automation executes repeatable work. AI assists with reasoning and implementation. Humans retain authority over business intent, credentials, access, and production risk.
