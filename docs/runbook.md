# Operations Runbook

## Routine checks

Monthly, confirm the homepage and contact page load over HTTPS, the canonical redirect works, key assets return successfully, and a controlled form submission reaches the inbox. Quarterly, review GitHub/Cloudflare/Resend access, pending dependency updates, domain expiration/registrar access, and Worker error logs.

## Troubleshooting guide

| Symptom | Check | Likely action |
| --- | --- | --- |
| Build or dry run fails | Node 22+, dependencies, and authoritative Wrangler file | Correct the local toolchain or resolve the Wrangler configuration conflict |
| Site does not load | Cloudflare zone status, DNS, Worker route/custom domain, TLS | Restore the intended route/domain mapping and inspect Worker logs |
| CSS, JS, or images 404 | Build output and `ASSETS` binding | Rebuild, confirm assets directory is `dist`, inspect asset-ignore behavior |
| Form returns 500 | Worker secret configuration | Add/restore `RESEND_API_KEY` without exposing it |
| Form returns 502 | Resend logs and sender-domain verification | Verify sender and API credential, then submit a controlled retest |
| Email arrives but webhook does not | Worker logs and webhook endpoint credential | Repair URL/secret; email delivery remains the primary success path |
| Spam is excessive | Current form behavior | Turnstile is not fully active; implement the tested end-to-end flow described in [contact-form](contact-form.md) |

## Incident handling

1. Capture the time, affected URL/function, visible error, and recent deployment reference without collecting unnecessary personal data.
2. Check Cloudflare Worker logs and provider status pages.
3. If a recent release caused the issue, roll back using the approved deployment process.
4. If a credential is suspected exposed, rotate it immediately following [configuration and secrets](configuration-and-secrets.md).
5. Document resolution and a follow-up prevention task.

Avoid logging API keys, webhook secrets, or full contact messages. Limit production access and perform changes through reviewed pull requests wherever practical.
