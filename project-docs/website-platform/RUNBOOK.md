# Website Operations Runbook

## Purpose

This runbook provides a practical troubleshooting and maintenance reference for the Cassady Tech Solutions website.

## Normal Health Check

Verify:

1. `https://cassadytech.com` loads.
2. `https://www.cassadytech.com` loads or redirects as intended.
3. Primary navigation works.
4. Images, styles, and scripts load correctly.
5. Contact form renders.
6. Turnstile works when enabled.
7. A controlled contact submission reaches the configured mailbox.

## Site Does Not Load

Check in this order:

1. Confirm whether both custom domains fail.
2. Test the direct Worker URL:

```text
https://cassady-tech-site.cassady-samuel95.workers.dev
```

3. If the Worker URL works but the custom domains fail, investigate Cloudflare DNS and custom-domain bindings.
4. If both fail, inspect the latest Worker deployment and recent code changes.
5. Review Cloudflare service status if platform-wide behavior is suspected.
6. Roll back to the last known-good deployment if necessary.

## Styles or Static Assets Are Broken

1. Run a fresh build:

```bash
npm run build
```

2. Confirm the `dist` output exists.
3. Confirm the Cloudflare assets binding still points to `./dist`.
4. Confirm `.assetsignore` generation completed.
5. Run:

```bash
npm run preview
```

6. Compare local Cloudflare preview behavior with production.

## Worker Deployment Fails

Run:

```bash
npm run check
```

Then verify:

- Node.js is version 22 or newer.
- dependencies are installed.
- Wrangler is authenticated.
- the correct Cloudflare account is selected.
- the Worker is still named `cassady-tech-site`.
- Wrangler configuration files do not conflict.
- no required binding was removed.

## Contact Form Does Not Send Email

Determine whether the failure occurs before or after form submission.

### Turnstile Failure

Check:

- Turnstile site key is associated with the intended domain.
- `TURNSTILE_SECRET_KEY` exists in the Worker environment.
- the browser is submitting a Turnstile token.
- Cloudflare verification succeeds.

### Resend Failure

Check:

- `RESEND_API_KEY` exists in the Worker environment.
- the key is active.
- the configured sender identity is authorized in Resend.
- the destination address is correct.
- Resend service health and delivery logs show the request.

### Form Validation Failure

The handler requires:

- name
- email
- message

Review browser request data and Worker behavior if required fields are present but the request still fails.

## Contact Form Receives Spam

Current controls include a honeypot field and Cloudflare Turnstile when enabled.

If spam increases:

1. Confirm Turnstile is active in production.
2. Confirm the secret is valid.
3. Review whether the form endpoint is being called directly.
4. Consider rate limiting or additional Cloudflare controls.
5. Avoid adding a new security dependency before identifying the actual abuse pattern.

## Domain Problem

If `cassadytech.com` fails but the Worker URL works:

1. Review Cloudflare DNS records.
2. Review the Worker custom-domain binding.
3. Verify no recent DNS change introduced drift.
4. Confirm the domain is active in the expected Cloudflare account.
5. Test `www` and apex independently.

## Unexpected Production Content

1. Identify the currently deployed Worker version.
2. Compare production behavior with `main`.
3. Review recent Git commits and pull requests.
4. Determine whether an out-of-band Cloudflare deployment occurred.
5. Restore the intended Git state and redeploy.

## Suspected Secret Exposure

1. Revoke or rotate the exposed credential immediately.
2. Update the Worker or service with the replacement credential.
3. Validate production.
4. Search the repository and Git history for exposure.
5. Review logs and account activity for misuse.
6. Document the incident and corrective action.

## Dependency Maintenance

Periodically run:

```bash
npm outdated
npm audit
npm run check
```

Upgrade dependencies through a branch and pull request. Avoid combining unrelated dependency upgrades with major content or architecture changes.

## Quarterly Administration Review

At least periodically, review:

- GitHub organization membership.
- repository collaborators and connected apps.
- Cloudflare administrative access.
- Worker configuration and custom domains.
- required Worker variables and secret names.
- Turnstile configuration.
- Resend sender-domain configuration.
- dependency status.
- whether these project documents still match production.

## Recovery Principle

When troubleshooting, preserve GitHub as the source of truth. If an emergency change is made directly in Cloudflare, reconcile that change into Git as soon as service is stable.
