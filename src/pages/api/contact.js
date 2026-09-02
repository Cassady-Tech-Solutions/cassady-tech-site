import { env as workerEnv } from "cloudflare:workers";

const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ORIGINS = new Set([
	"https://cassadytech.com",
	"https://www.cassadytech.com",
	"https://ghvtech.com",
	"https://www.ghvtech.com",
]);

const clean = (value, maxLength = 240) => String(value || "").trim().slice(0, maxLength);
const cleanLine = (value, maxLength = 240) => clean(value, maxLength).replace(/[\r\n]+/g, " ");

function getEnv(locals) {
	return locals?.runtime?.env || workerEnv || {};
}

function getConfig(env) {
	return {
		resendApiKey: env.RESEND_API_KEY,
		toEmail: env.CONTACT_TO_EMAIL || env.CONTACT_TO || "support@cassadytechsolutions.zohodesk.com",
		ccEmail: env.CONTACT_CC_EMAIL || env.CONTACT_CC || "contact@cassadytech.com",
		fromEmail: env.CONTACT_FROM_EMAIL || env.CONTACT_FROM || "Cassady Tech Solutions <contact@cassadytech.com>",
		webhookUrl: env.CONTACT_WEBHOOK_URL,
		webhookSecret: env.CONTACT_WEBHOOK_SECRET,
	};
}

function corsHeaders(request) {
	const origin = request.headers.get("origin");
	return {
		...(origin && ALLOWED_ORIGINS.has(origin) ? { "access-control-allow-origin": origin } : {}),
		"access-control-allow-methods": "POST, OPTIONS",
		"access-control-allow-headers": "content-type, accept",
		"access-control-max-age": "86400",
		vary: "Origin",
	};
}

function json(body, request, init = {}) {
	return new Response(JSON.stringify(body), {
		...init,
		headers: {
			"content-type": "application/json; charset=utf-8",
			...corsHeaders(request),
			...(init.headers || {}),
		},
	});
}

function isAllowedRequest(request) {
	const origin = request.headers.get("origin");
	return !origin || ALLOWED_ORIGINS.has(origin);
}

function validatePayload(payload) {
	const lead = {
		name: cleanLine(payload.name, 120),
		email: cleanLine(payload.email, 180).toLowerCase(),
		phone: cleanLine(payload.phone, 40),
		company: cleanLine(payload.company, 160),
		service: cleanLine(payload.service, 120),
		message: clean(payload.message, MAX_MESSAGE_LENGTH),
		website: clean(payload.website, 200),
	};

	if (lead.website) return { lead };
	if (!lead.name || !lead.email || !lead.service || !lead.message) return { lead, error: "Please complete the required fields." };
	if (!EMAIL_PATTERN.test(lead.email)) return { lead, error: "Please enter a valid email address." };
	if (lead.message.length < 10) return { lead, error: "Please add a little more detail to your message." };
	return { lead };
}

function requireEnv(config) {
	return config.resendApiKey ? "" : "Missing required form configuration: RESEND_API_KEY";
}

function resolveSource(request) {
	for (const value of [request.headers.get("origin"), request.headers.get("referer")]) {
		if (!value) continue;
		try {
			const hostname = new URL(value).hostname.replace(/^www\./, "");
			if (hostname === "ghvtech.com") return { key: "greenhorn-valley-tech", label: "Greenhorn Valley Tech", short: "GHV" };
		} catch {
			// Ignore malformed optional headers and use the CTS source below.
		}
	}

	return { key: "cassady-tech-solutions", label: "Cassady Tech Solutions", short: "CTS" };
}

function buildLeadPayload(lead, request) {
	return {
		source: resolveSource(request),
		submittedAt: new Date().toISOString(),
		pageUrl: request.headers.get("referer") || "",
		userAgent: request.headers.get("user-agent") || "",
		lead: {
			name: lead.name,
			email: lead.email,
			phone: lead.phone,
			company: lead.company,
			service: lead.service,
			message: lead.message,
		},
	};
}

function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function emailRows(payload) {
	const { lead, source } = payload;
	return [
		["Website", source.label],
		["Name", lead.name],
		["Email", lead.email],
		["Phone", lead.phone || "Not provided"],
		["Organization", lead.company || "Not provided"],
		["Request type", lead.service],
		["Submitted", payload.submittedAt],
		["Page", payload.pageUrl || "Not provided"],
	];
}

function buildEmailHtml(payload) {
	const rows = emailRows(payload);
	return `<h1>New ${escapeHtml(payload.source.label)} request</h1><table cellpadding="8" cellspacing="0" style="border-collapse:collapse">${rows.map(([label, value]) => `<tr><th align="left" style="border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("")}</table><h2>Message</h2><p>${escapeHtml(payload.lead.message).replaceAll("\n", "<br>")}</p>`;
}

function buildEmailText(payload) {
	const details = emailRows(payload).map(([label, value]) => `${label}: ${value}`).join("\n");
	return `New ${payload.source.label} request\n\n${details}\n\nMessage:\n${payload.lead.message}`;
}

async function sendEmail(payload, config) {
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: { authorization: `Bearer ${config.resendApiKey}`, "content-type": "application/json" },
		body: JSON.stringify({
			from: config.fromEmail,
			to: [config.toEmail],
			cc: [config.ccEmail],
			reply_to: payload.lead.email,
			subject: `[${payload.source.short}] ${payload.lead.service} from ${payload.lead.name}`,
			html: buildEmailHtml(payload),
			text: buildEmailText(payload),
		}),
	});

	if (!response.ok) throw new Error(`Resend email failed (${response.status}): ${await response.text()}`);
}

async function sendWebhook(payload, config) {
	if (!config.webhookUrl || !config.webhookSecret) return;
	const response = await fetch(config.webhookUrl, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ ...payload, secret: config.webhookSecret }),
	});
	if (!response.ok) throw new Error(`Webhook delivery failed (${response.status})`);
}

export const prerender = false;

export async function POST({ request, locals }) {
	if (!isAllowedRequest(request)) return json({ message: "This submission origin is not allowed." }, request, { status: 403 });

	const config = getConfig(getEnv(locals));
	const configError = requireEnv(config);
	if (configError) {
		console.error(configError);
		return json({ message: "The contact form is temporarily unavailable." }, request, { status: 500 });
	}

	let payload;
	try {
		payload = await request.json();
	} catch {
		return json({ message: "Please submit the form again." }, request, { status: 400 });
	}

	const { lead, error } = validatePayload(payload);
	if (lead.website) return json({ ok: true }, request);
	if (error) return json({ message: error }, request, { status: 400 });

	const leadPayload = buildLeadPayload(lead, request);
	try {
		await sendEmail(leadPayload, config);
	} catch (emailError) {
		console.error(emailError);
		return json({ message: "The form reached us, but the ticket could not be created. Please call 719-781-2356." }, request, { status: 502 });
	}

	try {
		await sendWebhook(leadPayload, config);
	} catch (webhookError) {
		console.error(webhookError);
	}

	return json({ ok: true }, request);
}

export async function GET({ request }) {
	return json({ message: "Method not allowed." }, request, { status: 405, headers: { allow: "POST, OPTIONS" } });
}

export async function OPTIONS({ request }) {
	if (!isAllowedRequest(request)) return new Response(null, { status: 403, headers: corsHeaders(request) });
	return new Response(null, { status: 204, headers: corsHeaders(request) });
}
