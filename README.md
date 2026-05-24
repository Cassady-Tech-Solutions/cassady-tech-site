# Cassady Tech Solutions Site

Astro + Cloudflare Workers site for Cassady Tech Solutions.

## Live URLs

- Production: https://cassadytech.com
- Production alias: https://www.cassadytech.com
- Temporary Worker URL: https://cassady-tech-site.cassady-samuel95.workers.dev

## Commands

```bash
npm install
npm run dev
npm run build
npm run deploy
```

## Contact Form Configuration

The contact form uses Cloudflare Turnstile, Resend, and an optional webhook target. Configure these Worker variables/secrets in Cloudflare before testing the form end to end:

```text
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
CONTACT_WEBHOOK_URL=
CONTACT_WEBHOOK_SECRET=
```

`CONTACT_WEBHOOK_URL` and `CONTACT_WEBHOOK_SECRET` are optional for launch. When omitted, the form still sends email through Resend.

No secrets belong in this repository.
