# Contact Form Operations

The contact page submits JSON to `POST /api/contact`, served by `src/pages/api/contact.js` in the Cloudflare Worker.

## Request flow

1. The browser collects name, email, optional phone/company, service area, message, and a hidden honeypot field.
2. The endpoint validates required fields, basic email format, message length, and the honeypot.
3. It creates a payload with submission time, referrer, and user agent.
4. It sends an email through Resend. The lead email becomes `reply_to`.
5. If both webhook values are configured, it also posts the payload to that endpoint. Webhook failure is logged but does not fail an otherwise successful email response.

Required operation: `RESEND_API_KEY` must be present and `CONTACT_FROM_EMAIL` must be a sender Resend has verified. Delivery failures return a 502 response; missing Resend configuration returns a 500 response.

## Turnstile status: not active end to end

Turnstile-related variables and a configuration endpoint exist, and the legacy Pages handler verifies a Turnstile response. But the current Astro contact page does not render the Turnstile widget and the active Astro endpoint does not verify a token. Therefore do not claim the live form is Turnstile-protected yet.

To activate it, implement and test both parts in a separately reviewed application change: render the widget using `TURNSTILE_SITE_KEY`, then require and verify the token server-side with `TURNSTILE_SECRET_KEY`. Update the privacy notice and this document after the production test succeeds.

## Safe testing

Use a controlled test request with non-sensitive content after form, Resend, domain, or secret changes. Confirm the browser response, Worker logs, and inbox delivery. Keep contact submissions and their contents out of code reviews and logs where they are not operationally necessary.
