# Cloudflare Configuration and Secrets

Set non-sensitive values as Cloudflare Worker variables and credentials in Cloudflare Worker secrets. Do not commit real values to Git, `.env` files intended for sharing, screenshots, tickets, or logs.

| Name | Type | Required | Purpose |
| --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | Variable | Recommended | Canonical public site URL |
| `BUSINESS_NAME` | Variable | Recommended | Business identity |
| `BUSINESS_EMAIL` | Variable | Recommended | Business contact address |
| `CONTACT_TO_EMAIL` | Variable | Yes | Contact-form recipient |
| `CONTACT_FROM_EMAIL` | Variable | Yes | Resend-verified sender |
| `RESEND_API_KEY` | Secret | Yes | Resend API authentication |
| `CONTACT_WEBHOOK_URL` | Protected variable or secret | Optional | Workflow/CRM endpoint |
| `CONTACT_WEBHOOK_SECRET` | Secret | Optional | Shared webhook credential |
| `TURNSTILE_SITE_KEY` | Variable | Only after activation | Browser challenge configuration |
| `TURNSTILE_SECRET_KEY` | Secret | Only after activation | Server-side challenge verification |

The active contact endpoint accepts older `CONTACT_TO` and `CONTACT_FROM` aliases, but new configuration should use the `*_EMAIL` names above.

## Access controls

Keep GitHub organization maintainers, Cloudflare administrators, and Resend administrators limited to current operators. Use individual accounts, MFA, least-privilege roles, and a documented recovery owner. Periodically review organization membership, Cloudflare account roles, domain ownership, and Resend access so the site is not dependent on one personal account.

## Secret rotation

When a secret may have been exposed, revoke or rotate it at its provider immediately, update the Cloudflare Worker secret, redeploy if required, and test the affected integration. Never paste old or new secret values into an issue or pull request. For Resend, test delivery after rotation; for webhook credentials, confirm the receiving service accepts the new credential.
