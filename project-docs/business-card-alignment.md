# Business card alignment review

Prepared 2026-09-08. Changes are staged for publication, not deployed.

## Visual reference

The supplied finalized card fronts are authoritative. SVG viewports embed the unchanged original JPEG pixels to expose the emblem without redrawing it. CTS uses the silver mountain/circuit-river emblem; GHV uses the green valley/sunrise/river emblem. These are raster-backed SVG assets, not vector redraws. Full supplied card fronts replace existing social-preview imagery.

## Findings and changes

- Replaced CTS old black wordmark and GHV old angular mountain mark.
- CTS: navy, silver, blue; GHV: forest green, cream, teal, gold.
- Shared Arial/system typography, readable labels, 6px button corners, restrained rules, responsive spacing, and circular emblem treatment.
- Shortened home hero copy while retaining existing audience-specific services and project-first CTS positioning.
- GHV station links now appear in desktop/mobile navigation, home hero, welcome strip, contact page and footer.
- Public email addresses match cards: contact@cassadytech.com and contact@ghvtech.com. GHV phone remains 719-781-2356. Backend recipients were not changed.
- Preserved existing forms, service pages, pricing, privacy routes, integrations and station workflow. No new service, certification, testimonial or customer-count claims.

## Verification

- All three production builds passed. CTS TypeScript check passed.
- GHV existing rendered-page and contact-form tests: 2 passed.
- Station existing validation, persistence, retry, authorization, metrics and retention tests: 13 passed.
- GHV desktop screenshot reviewed. Phone and tablet iframe renderings reviewed; body widths matched scroll widths (375px and 753px content areas).
- Station desktop before/after reviewed.
- Temporary responsive QA fixtures removed from source before saving.
- CTS latest origin/main backend changes were already present locally; synced to that revision without altering them.

## Remaining QA limitations

- Browser access to CTS preview failed with ERR_BLOCKED_BY_CLIENT despite a running preview; CTS desktop/tablet/mobile visual verification remains incomplete.
- Station preview uses HTTP. Its pre-existing crypto.randomUUID call requires a secure browser context, preventing full intake interaction there. No production logic was changed to accommodate the preview. Live HTTPS end-to-end delivery was not tested.
- No test notifications or customer requests were sent. Mailbox delivery and live external integration health are not certified by local tests.
- A final browser screenshot/mobile-menu capture timed out; do not treat that interaction as verified.
- Public email links reflect the cards; mailbox existence and deliverability were not independently verified.

## Publication

Existing Sites edits are saved without changing the public deployment. Publish the saved GHV and station versions and merge/deploy the CTS review branch only after publication is authorized. Preserve existing access modes, custom domains, runtime secrets, database bindings and notification destinations.
