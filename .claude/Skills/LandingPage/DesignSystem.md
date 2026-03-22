# LandingPage Design System — Alvis House

Web adaptation of the Alvis House brand system for landing pages and homepages.

---

## Color Palette

Same tokens as the Infographic system — shared brand foundation.

```css
:root {
  /* Brand */
  --cream:      #ece6d9;   /* Section background — warm off-white */
  --cream-dk:   #ddd8ce;   /* Hover states, subtle dividers */
  --navy:       #3b546b;   /* Primary text, dark sections, nav */
  --orange:     #cf5828;   /* CTAs, buttons, accent bars — PRIMARY ACTION COLOR */
  --steel:      #7a8c9b;   /* Secondary text, muted labels */
  --teal:       #2E7D6B;   /* Success states, positive signals */
  --amber:      #F0A500;   /* Highlight callouts, star ratings */
  --ink:        #1a2635;   /* Body text — near-black */
  --ink-mid:    #3d4f60;   /* Secondary body text */
  --rule:       #d4cdc3;   /* Borders, dividers */
  --white:      #ffffff;

  /* Page-specific additions */
  --hero-bg:    #1a2635;   /* Dark hero backgrounds */
  --card-shadow: 0 4px 24px rgba(26,38,53,0.12);
  --card-radius: 12px;
}
```

### Section Background Rhythm

Alternate for visual momentum — never two identical adjacent sections:

| Section | Background | Text |
|---------|-----------|------|
| Hero | `--hero-bg` (dark) | White |
| Pain Point | `--cream` | `--ink` |
| What's Inside | White | `--ink` |
| Why This Works | `--navy` (dark) | White |
| Author Bio | `--cream` | `--ink` |
| Testimonials | White | `--ink` |
| Press Strip | `--cream-dk` | `--steel` |
| Quote + CTA | `--orange` (accent) | White |
| Final CTA | `--hero-bg` (dark) | White |
| Footer | `--navy` | White |

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

| Use | Font | Specs |
|-----|------|-------|
| Hero headline | Montserrat | 900, 48–64px desktop / 32px mobile, line-height 1.1 |
| Section headings | Montserrat | 700, 32–40px |
| Eyebrow / label | Montserrat | 700, 11px, letter-spacing 0.14em, uppercase |
| Body copy | Lora | 400, 17–18px, line-height 1.7 |
| Stat callouts | Montserrat | 800–900, 56–72px |
| Button text | Montserrat | 700, 14–16px, letter-spacing 0.06em |
| Testimonial quote | Lora | italic, 400, 18px |
| Caption / fine print | Montserrat | 400, 12px, `--steel` |

---

## Buttons

### Primary CTA (Orange)
```css
.btn-primary {
  background: var(--orange);
  color: var(--white);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 16px 32px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(207,88,40,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(207,88,40,0.45);
}
```

**Text patterns:**
- "Get the Playbook →"
- "Download Free →"
- "Send Me the Insights →"
- "Yes, I Want This →"
- NEVER: "Subscribe", "Submit", "Sign Up"

### Secondary (Ghost)
```css
.btn-ghost {
  background: transparent;
  color: var(--white);
  border: 2px solid rgba(255,255,255,0.6);
  /* same font/padding as primary */
}
.btn-ghost:hover { border-color: var(--white); }
```

---

## Opt-In Form — Brevo (Sendinblue) Integration

**Provider:** Brevo (formerly Sendinblue)
**List ID:** 4
**API Key location:** Elementor → Form widget → Sendinblue panel (V3 key)

Two integration paths — choose based on deployment method:

---

### Option A: Brevo API via WordPress AJAX (Recommended for custom HTML)

Form submits to a WordPress AJAX endpoint that calls the Brevo API server-side.
No CORS issues. Works on any page served by WordPress.

**HTML form (same on every page):**
```html
<form class="optin-form" id="brevoForm" novalidate>
  <div class="form-row">
    <input type="text" name="first_name" id="firstName" placeholder="First name" class="form-input" required>
    <input type="email" name="email" id="email" placeholder="Work email" class="form-input" required>
  </div>
  <button type="submit" class="btn-primary" id="submitBtn">Get the Playbook →</button>
  <p class="form-fine-print">No spam. Unsubscribe anytime.</p>
  <p class="form-message" id="formMessage"></p>
</form>

<script>
document.getElementById('brevoForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMessage');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const res = await fetch('/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      action: 'brevo_subscribe',
      first_name: document.getElementById('firstName').value,
      email: document.getElementById('email').value,
    })
  });
  const data = await res.json();

  if (data.success) {
    msg.textContent = "You're in! Check your inbox.";
    msg.style.color = '#2E7D6B';
    this.reset();
  } else {
    msg.textContent = data.data || 'Something went wrong. Try again.';
    msg.style.color = '#cf5828';
    btn.disabled = false;
    btn.textContent = 'Get the Playbook →';
  }
});
</script>
```

**WordPress PHP handler** (add via WPCode plugin or functions.php):
See `tools/brevo-handler.php` — handles the AJAX action, calls Brevo API, returns JSON.

---

### Option B: Elementor Form Shortcode (Zero-code, keep existing integration)

Keep the existing Elementor form widget in a saved Elementor template.
Embed it in any page via shortcode. Preserves all Brevo mapping automatically.

```html
<!-- Replace the form HTML with: -->
[elementor-template id="[TEMPLATE_ID]"]
```

**Steps:**
1. In Elementor, save the current form as a "Global Widget" or "Template"
2. Note the template ID
3. Drop the shortcode anywhere in the custom HTML page

**Trade-off:** Works perfectly inside WordPress. Less control over styling.

---

### Option C: Brevo Embedded Form (Fully portable, no WordPress dependency)

Brevo generates embeddable HTML/JS from their dashboard.
Works on ANY page, no server code required.

**Steps:**
1. Brevo Dashboard → Forms → Create Subscription Form
2. Link to List ID 4
3. Copy the generated embed snippet
4. Drop into any `<div>` on the page
5. Override Brevo's default CSS with our `.optin-form` styles

**Trade-off:** Less styling control without CSS overrides.

---

### Recommended for Homepage Redesign: **Option A**

Full control over design + behavior. One small PHP snippet (see `tools/brevo-handler.php`) added via WPCode plugin — no theme edits required.

---

**Rules (all options):**
- Minimum friction: first name + email only
- Fine print always below button
- NEVER change the Brevo List ID (4) without confirming the list in Brevo dashboard
- Double opt-in is currently OFF — subscribers added immediately

---

## Cards

```css
.card {
  background: var(--white);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: 28px 32px;
}
```

### Testimonial Card
```html
<div class="testimonial-card">
  <div class="stars">★★★★★</div>
  <blockquote>"Quote text here — make it specific and outcome-focused."</blockquote>
  <div class="attribution">
    <img src="[headshot]" alt="Name" class="testimonial-photo">
    <div>
      <strong>Full Name</strong>
      <span>Title, Company</span>
    </div>
  </div>
</div>
```

### Feature / Benefit Card
```html
<div class="benefit-card">
  <div class="benefit-num">01</div>
  <h3>Benefit Headline</h3>
  <p>Supporting explanation — one to two sentences max.</p>
</div>
```

---

## Key Design Decisions (From Reference Analysis)

1. **No top navbar on conversion pages** — removes all exit points
2. **Sticky CTA bar** — triggers on scroll past hero, stays fixed at top
3. **Hero image: overlapping rotated stack** — 3 images at -3°, 0°, +4° with z-index creates energy
4. **Alternating dark/light sections** — cream → dark → white → dark builds scroll momentum
5. **Star ratings in amber** — `--amber` (#F0A500) for ★★★★★
6. **Section eyebrows** — small Montserrat uppercase label above every headline
7. **Large stat numbers** — Montserrat 900 at 60–72px for impact callouts

---

## Responsive Breakpoints

```css
/* Mobile first */
.container { width: 100%; padding: 0 20px; }

/* Tablet */
@media (min-width: 768px) {
  .container { max-width: 720px; margin: 0 auto; padding: 0 32px; }
}

/* Desktop */
@media (min-width: 1200px) {
  .container { max-width: 1100px; padding: 0 48px; }
}
```
