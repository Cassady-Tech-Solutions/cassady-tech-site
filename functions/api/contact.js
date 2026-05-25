export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const contentType = request.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const name = clean(data.name);
    const email = clean(data.email);
    const phone = clean(data.phone || "");
    const company = clean(data.company || "");
    const service = clean(data.service || "");
    const message = clean(data.message);
    const website = clean(data.website || "");
    const turnstileToken = data["cf-turnstile-response"] || data.turnstileToken || "";

    if (website) {
      return json({ success: true }, 200);
    }

    if (!name || !email || !message) {
      return json({ error: "Name, email, and message are required." }, 400);
    }

    if (env.TURNSTILE_SECRET_KEY && !turnstileToken) {
      return json({ error: "Verification is required." }, 400);
    }

    if (env.TURNSTILE_SECRET_KEY) {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: request.headers.get("CF-Connecting-IP") || "",
        }),
      });

      const verificationResult = await verification.json();
      if (!verificationResult.success) {
        return json({ error: "Verification failed." }, 400);
      }
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: "Email service is not configured." }, 500);
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || "Cassady Tech Solutions <contact@cassadytech.com>",
        to: [env.CONTACT_TO || "samuelc@cassadytech.com"],
        reply_to: email,
        subject: `New Cassady Tech Solutions inquiry from ${name}`,
        text: buildEmailText({ name, email, phone, company, service, message }),
      }),
    });

    if (!emailResponse.ok) {
      return json({ error: "Email send failed." }, 500);
    }

    return json({ success: true }, 200);
  } catch (error) {
    return json({ error: "Server error." }, 500);
  }
}

export async function onRequestGet() {
  return json({ error: "Method not allowed. Submit the contact form instead." }, 405);
}

function clean(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.replace(/[<>]/g, "").trim().slice(0, 2000);
}

function buildEmailText({ name, email, phone, company, service, message }) {
  return `New website contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}
Support area: ${service || "Not provided"}

Message:
${message}`;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
