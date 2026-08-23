# Security and Change Control

## Security Principles

The website is designed around a managed serverless runtime and Git-based change control. Security depends on protecting administrative identities, keeping secrets out of source control, validating production changes, and preserving clear ownership boundaries.

## Repository Security

The GitHub repository is public. Therefore:

- Never commit API keys, passwords, access tokens, private certificates, recovery codes, or secret values.
- Assume every committed file is publicly readable.
- Review diffs before commit and before merge.
- Use branches and pull requests for production-impacting changes whenever practical.
- Restrict organization and repository write access to people and tools that require it.

## Cloudflare Security

Cloudflare holds sensitive production state that should remain outside GitHub.

Protect:

- account administrator access
- Worker deployment permissions
- DNS and domain controls
- Worker secrets
- Turnstile secret keys
- any account-level API tokens

Use least privilege for API tokens and connected automation where supported.

## Resend Security

Protect the Resend API key as a production secret.

Review sender-domain authorization periodically and remove unused credentials or integrations.

## Contact Form Controls

The contact handler currently includes several defensive controls:

- required-field validation
- basic input sanitization
- a honeypot field
- optional Cloudflare Turnstile verification
- server-side Resend API use

The Turnstile secret and Resend API key must remain server-side.

## AI and Automation Access

AI tools may be given repository access to inspect or prepare changes. Access should be scoped to the repositories required for the task.

Recommended operating model:

- AI may read the codebase and documentation.
- AI may prepare changes on a branch.
- AI may create or update documentation and code when explicitly authorized.
- High-impact changes should be reviewed by a human before merge.
- AI should not be provided plaintext production secrets in prompts or committed files.
- AI should not independently change account ownership, billing, domain ownership, or credential policy.

## Change Classification

### Low Risk

Examples:

- documentation corrections
- spelling or copy fixes
- nonfunctional formatting changes

These may use a lightweight review process.

### Medium Risk

Examples:

- new site content
- layout changes
- dependency updates
- contact-form UI changes

These should be validated locally and reviewed before production deployment.

### High Risk

Examples:

- Worker runtime changes
- authentication or security-control changes
- DNS changes
- secret rotation
- contact delivery changes
- deployment configuration changes
- domain routing changes

These require explicit human approval and post-change validation.

## Secret Rotation

When rotating a secret:

1. Create the replacement secret in the owning service.
2. Update the Cloudflare Worker secret or relevant integration.
3. Validate the application with the new credential.
4. Revoke the old credential.
5. Confirm the old value is not present in Git history, logs, tickets, or documentation.

If a secret is ever committed to Git, treat it as compromised even if the commit is later removed.

## Dependency Security

The site uses npm packages. Periodically review:

```bash
npm outdated
npm audit
```

Dependency upgrades should be tested with:

```bash
npm run check
```

before production deployment.

## Incident Priorities

If a website security incident is suspected:

1. Protect administrative accounts.
2. Revoke exposed credentials.
3. Preserve relevant evidence and logs.
4. Restore known-good service state.
5. Validate domain and DNS integrity.
6. Review recent GitHub and Cloudflare changes.
7. Document the cause and corrective action.

See [RUNBOOK.md](./RUNBOOK.md) for troubleshooting procedures.
