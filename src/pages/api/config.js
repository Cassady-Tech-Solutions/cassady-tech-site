import { env } from "cloudflare:workers";

const json = (body, init = {}) =>
	new Response(JSON.stringify(body), {
		...init,
		headers: { "content-type": "application/json; charset=utf-8", ...(init.headers || {}) },
	});

export const prerender = false;

export async function GET() {
	return json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY || "" });
}
