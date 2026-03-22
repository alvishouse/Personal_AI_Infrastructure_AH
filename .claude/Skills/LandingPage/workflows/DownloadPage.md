# Workflow: Download Page

Builds a thank-you / download page for after a user opts in to receive a lead magnet.

Reference implementation: `scratchpad/lead-magnets/2026-02-24-90-day-tax/05-output/download-page.html`

---

## Structure

```
Nav (minimal — logo only)
Hero (navy — thank you + guide preview + download button)
What's Inside (cream — 3-column feature list)
Author Strip (navy — photo + bio + social)
Footer (minimal)
```

---

## Phase 1 — Brief

Confirm:
1. What lead magnet is being delivered? (title + PDF URL)
2. What is the guide cover image URL?
3. What 3–5 key things does the guide include?
4. What is the next action after download? (follow on LinkedIn, join community, etc.)

---

## Phase 2 — HTML Build

Start from: `../templates/download-page-base.html`

Deploy to WordPress as a **private** page (not indexed, linked only in autoresponder email).

---

## Phase 3 — Deploy

1. Create WordPress page (status: Private or Password-protected)
2. Use the page URL as the redirect destination in the autoresponder
3. Upload any guide assets (PDF) to WordPress media library first
