# How the Website Is Managed and Administered

This page separates accountability from assistance. A human operator remains responsible for all business decisions, production changes, customer communications, access administration, and approval of AI-produced material.

| Area | Human responsibility | Automation | AI-assisted work |
| --- | --- | --- | --- |
| Content | Decide services, pricing, legal/privacy language, brand voice, and publish approval | Builds the site from approved source | Draft or revise copy; human verifies facts, tone, and claims |
| Code changes | Review, test, approve PRs, and decide release timing | Dependency install, build, type check, and optional dry-run | Explain code, draft focused changes, identify likely issues; human reviews every diff |
| Deployment | Authorize deployer access and approve rollback/release | Wrangler deploys the built Worker when run; a separately configured CI system may deploy if confirmed | Produce release checklist or troubleshooting guidance; human executes/approves production actions |
| Cloudflare and domains | Manage account roles, DNS, custom domains, TLS, Worker settings, and secrets | Cloudflare serves assets, runs endpoints, and records logs | Interpret logs/configuration and suggest fixes; never provide secrets to an AI tool |
| Contact requests | Read requests, respond to prospects, decide routing and retention | Resend delivers email; optional webhook forwards a payload | Draft replies or summarize sanitized requests; human approves communication and protects personal data |
| Security and recovery | Control MFA, access reviews, secret rotation, incident decisions, and provider recovery contacts | Cloudflare/Resend enforce their configured controls | Create checklists and analyze non-sensitive evidence; human validates and acts |

## Administration rhythm

- Before every release: human reviews the pull request and validation results, then confirms required configuration is present.
- After every release: human verifies the site, canonical routing, and a controlled contact-form delivery test.
- Monthly: human checks availability, form delivery, and Worker errors.
- Quarterly: human reviews access roles, domain/registrar ownership, recovery contacts, and updates.
- When using AI: provide only the minimum non-sensitive context; independently verify output; never authorize it to make unsupervised customer, legal, financial, security, DNS, secret, or production decisions.

## Boundaries

Automation executes the instructions and permissions it is given; it does not own policy or business judgment. AI can accelerate drafting, analysis, and repetitive engineering tasks, but may be wrong, incomplete, or unaware of current account state. Keep approvals, secrets, and customer-data handling with accountable humans.
