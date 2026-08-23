# Configuration Reference

## Purpose

This document records the configuration model for the Cassady Tech Solutions website without storing secret values.

## Repository Configuration

Important version-controlled files include:

```text
astro.config.mjs
package.json
wrangler.toml
wrangler.json
.assetsignore
scripts/write-assetsignore.mjs
```

These files should be reviewed together when changing build or Cloudflare runtime behavior.

## Astro Configuration

The Astro configuration defines the canonical site as:

```text
https://cassadytech.com
```

The Cloudflare adapter is enabled, along with MDX and sitemap support.

## Wrangler Configuration

The Worker is named:

```text
cassady-tech-site
```

Known runtime configuration includes:

```text
main = ./dist/_worker.js/index.js
assets directory = ./dist
assets binding = ASSETS
compatibility flag = nodejs_compat
```

The repository currently contains both `wrangler.toml` and `wrangler.json`. If either is modified, verify that Wrangler is reading the intended configuration and that the two files do not introduce conflicting settings.

## Nonsecret Variables

Known nonsecret values include items such as:

```text
PUBLIC_SITE_URL
BUSINESS_NAME
BUSINESS_EMAIL
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
```

Current repository configuration identifies the production site as `https://cassadytech.com` and the business as Cassady Tech Solutions.

## Secrets and Sensitive Configuration

Secret values must be stored in Cloudflare or the relevant service, not committed to GitHub.

Expected sensitive configuration includes:

```text
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_WEBHOOK_SECRET
```

Other configuration referenced by the application may include:

```text
TURNSTILE_SITE_KEY
CONTACT_WEBHOOK_URL
```

Whether a value is treated as a secret depends on its purpose. Public site keys can be exposed to the browser when required by the service, while secret verification keys must remain server-side.

## Contact Configuration

The contact workflow depends on three main pieces:

1. Cloudflare Worker runtime.
2. Cloudflare Turnstile configuration.
3. Resend email configuration.

### Turnstile

The browser uses the Turnstile site key. The Worker uses the Turnstile secret key to verify a submitted challenge token against Cloudflare.

The secret must never be placed in client-side code.

### Resend

The Worker uses `RESEND_API_KEY` to call the Resend email API.

Resend must also recognize and authorize the sender identity or domain used by the configured contact sender.

### Contact Destination

The intended contact destination should be configured through the contact variables rather than hard-coded in new application logic whenever possible.

## Domain Configuration

Production domains:

```text
cassadytech.com
www.cassadytech.com
```

Direct Worker endpoint:

```text
cassady-tech-site.cassady-samuel95.workers.dev
```

Cloudflare is expected to hold the relevant DNS and custom-domain configuration.

## Configuration Change Procedure

When changing configuration:

1. Determine whether the value belongs in Git, Cloudflare variables, Cloudflare secrets, or another service.
2. Never commit a secret value.
3. Document the setting name and purpose here if it affects operations.
4. Apply the service-side change using an authorized administrator account.
5. Run `npm run check` if repository configuration changed.
6. Deploy if required.
7. Validate production behavior.

## Configuration Drift

Because some production settings live outside GitHub, configuration drift is possible.

Periodic review should compare:

- repository Wrangler configuration
- Cloudflare Worker configuration
- Worker variables and secret names
- custom-domain bindings
- Turnstile site configuration
- Resend sender-domain configuration

Do not copy secret values into audit notes. Record only whether each required secret exists and whether it is valid.
