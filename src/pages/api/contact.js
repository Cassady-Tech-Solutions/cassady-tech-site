import { env } from "cloudflare:workers";

const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const json = (body, init = {}) => new Response(JSON.stringify(body), { ...init, headers: { "content-type": "application/json; charset=utf-8", ...(init.headers || {}) } });
const clean = (value, maxLength = 240) => String(value || "").trim().slice(0, maxLength);

function validatePayload(payload) {
	const lead = { name: clean(payload.name, 120), email: clean(payload.email, 180).toLowerCase(), phone: clean(payload.phone, 40), company: clean(payload.company, 160), service: clean(payload.service, 120), message: clean(payload.message, MAX_MESSAGE_LENGTH), website: clean(payload.website, 200), turnstileToken: clean(payload.turnstileToken, 4096) };
	if (lead.website) return { lead, error: "Thanks. Your request was received." };
	if (!lead.name || !lead.email || !lead.service || !lead.message) return { lead, error: "Please complete the required fields." };
	if (!EMAIL_PATTERN.test(lead.email)) return { lead, error: "Please enter a valid email address." };
	if (lead.message.length < 10) return { lead, error: "Please add a little more detail to your message." };
	if (!lead.turnstileToken) return { lead, error: "Please complete the verification check." };
	return { lead };
}

function requireEnv() {
	const missing = ["TURNSTILE_SECRET_KEY", "RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"].filter((key) => !env[key]);
	return missing.length ? `Missing required form configuration: ${missing.join(", ")}` : "";
}

async function verifyTurnstile(token, request) {
	const formData = new FormData();
	formData.append("secret", env.TURNSTILE_SECRET_KEY);
	formData.append("response", token);
	const ip = request.headers.get("CF-Connecting-IP");
	if (ip) formData.append("remoteip", ip);
	const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: formData });
	if (!response.ok) return false;
	const result = await response.json();
	return Boolean(result.success);
}

function buildLeadPayload(lead, request) {
	return { source: "cassady-tech-solutions", submittedAt: new Date().toISOString(), pageUrl: request.headers.get("referer") || "", userAgent: request.headers.get("user-agent") || "", lead: { name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, service: lead.service, message: lead.message } };
}

function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function buildEmailHtml(payload) {
	const lead = payload.lead;
	const rows = [["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone || "Not provided"], ["Company", lead.company || "Not provided"], ["Service", lead.service], ["Submitted", payload.submittedAt], ["Page", payload.pageUrl || "Not provided"]];
	return `<h1>New Cassady Tech Solutions request</h1><table cellpadding="8" cellspacing="0" style="border-collapse:collapse">${rows.map(([label, value]) => `<tr><th align="left" style="border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("")}</table><h2>Message</h2><p>${escapeHtml(lead.message).replaceAll("\n", "<br>")}</p>`;
}

async function sendEmail(payload) {
	const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" }, body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: payload.lead.email, subject: `New Cassady support request from ${payload.lead.name}`, html: buildEmailHtml(payload) }) });
	if (!response.ok) throw new Error(`Resend email failed: ${await response.text()}`);
}

async function sendWebhook(payload) {
	if (!env.CONTACT_WEBHOOK_URL || !env.CONTACT_WEBHOOK_SECRET) return;
	const response = await fetch(env.CONTACT_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, secret: env.CONTACT_WEBHOOK_SECRET }) });
	if (!response.ok) throw new Error(`Webhook delivery failed: ${await response.text()}`);
}

export const prerender = false;

export async function POST({ request }) {
	const configError = requireEnv();
	if (configError) { console.error(configError); return json({ message: "The contact form is not configured yet." }, { status: 500 }); }
	let payload;
	try { payload = await request.json(); } catch { return json({ message: "Please submit the form again." }, { status: 400 }); }
	const { lead, error } = validatePayload(payload);
	if (lead.website) return json({ ok: true });
	if (error) return json({ message: error }, { status: 400 });
	if (!(await verifyTurnstile(lead.turnstileToken, request))) return json({ message: "Verification failed. Please try again." }, { status: 400 });
	const leadPayload = buildLeadPayload(lead, request);
	try { await sendEmail(leadPayload); } catch (emailError) { console.error(emailError); return json({ message: "The form could not send right now. Please try again shortly." }, { status: 502 }); }
	try { await sendWebhook(leadPayload); } catch (webhookError) { console.error(webhookError); }
	return json({ ok: true });
}

export async function GET() { return json({ message: "Method not allowed." }, { status: 405 }); }
export async function OPTIONS() { return new Response(null, { status: 204 }); }
