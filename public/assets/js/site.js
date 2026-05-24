const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const yearNode = document.querySelector("[data-year]");
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

const contactForm = document.querySelector("[data-contact-form]");
const turnstileSlot = document.querySelector("[data-turnstile]");
let turnstileWidgetId = null;

async function loadTurnstile() {
  if (!contactForm || !turnstileSlot) return;
  try {
    const response = await fetch("/api/config", { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("Unable to load form configuration.");
    const config = await response.json();
    if (!config.turnstileSiteKey) {
      turnstileSlot.textContent = "Form verification is not configured yet.";
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      turnstileWidgetId = window.turnstile.render(turnstileSlot, { sitekey: config.turnstileSiteKey, theme: "light" });
    });
    document.head.appendChild(script);
  } catch {
    turnstileSlot.textContent = "Form verification is temporarily unavailable.";
  }
}

function setFormStatus(message, state) {
  const status = document.querySelector("[data-form-status]");
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

function getFormPayload(form) {
  const formData = new FormData(form);
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    service: String(formData.get("service") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    website: String(formData.get("website") || "").trim(),
    turnstileToken: String(formData.get("cf-turnstile-response") || "").trim(),
  };
}

if (contactForm) {
  loadTurnstile();
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");
    setFormStatus("Sending your request...", "pending");
    if (submitButton) submitButton.disabled = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(getFormPayload(contactForm)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "The form could not be sent.");
      contactForm.reset();
      if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
      setFormStatus("Thanks. Your request was sent successfully.", "success");
    } catch (error) {
      setFormStatus(error.message || "Something went wrong. Please try again.", "error");
      if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
