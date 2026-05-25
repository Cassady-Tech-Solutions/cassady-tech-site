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
  };
}

if (contactForm) {
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

      if (!response.ok) {
        throw new Error(result.message || "The form could not be sent.");
      }

      contactForm.reset();
      setFormStatus("Thanks. Your request was sent successfully.", "success");
    } catch (error) {
      setFormStatus(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
