# LandingPage Section Library

Reusable HTML sections for building landing pages. Full CSS in `templates/homepage-base.html`.

---

## Section Map (Homepage Conversion Flow)

```
┌──────────────────────────────────────────────────┐
│  [STICKY CTA BAR] — appears after hero scroll    │
├──────────────────────────────────────────────────┤
│  § 1. HERO — dark bg, headline, form, image      │
├──────────────────────────────────────────────────┤
│  § 2. PAIN POINT — cream bg, problem statement   │
├──────────────────────────────────────────────────┤
│  § 3. WHAT'S INSIDE — white, mockup + bullets    │
├──────────────────────────────────────────────────┤
│  § 4. WHY THIS WORKS — navy bg, 4-block grid     │
├──────────────────────────────────────────────────┤
│  § 5. AUTHOR BIO — cream, photo + story arc      │
├──────────────────────────────────────────────────┤
│  § 6. TESTIMONIALS — white, 2-3 star cards       │
├──────────────────────────────────────────────────┤
│  § 7. PRESS STRIP — cream-dk, logo bar           │
├──────────────────────────────────────────────────┤
│  § 8. QUOTE + CTA — orange bg, pull quote + form │
├──────────────────────────────────────────────────┤
│  § 9. FINAL CTA — dark bg, urgency + form        │
├──────────────────────────────────────────────────┤
│  § 10. FOOTER — navy, minimal                    │
└──────────────────────────────────────────────────┘
```

---

## 1. Sticky CTA Bar

Appears fixed at top after scrolling past `.hero`. JavaScript triggers on scroll.

```html
<div class="sticky-bar" id="stickyBar">
  <div class="container sticky-bar-inner">
    <span class="sticky-bar-text">Get the free guide — <strong>[offer name]</strong></span>
    <a href="#optin-hero" class="btn-primary btn-sm">Download Free →</a>
  </div>
</div>

<script>
  const hero = document.querySelector('.hero');
  const bar = document.getElementById('stickyBar');
  window.addEventListener('scroll', () => {
    bar.classList.toggle('visible', window.scrollY > hero.offsetHeight);
  });
</script>
```

---

## 2. Hero Section

Dark background, full-width, contains the primary form.

```html
<section class="hero" id="optin-hero">
  <div class="container hero-inner">
    <div class="hero-copy">
      <div class="eyebrow">Free Resource · [Category]</div>
      <h1 class="hero-headline">
        [Bold benefit-driven headline]<br>
        <em>[Specific outcome in amber]</em>
      </h1>
      <p class="hero-sub">[1–2 sentence elaboration on the value proposition]</p>
      <form class="optin-form" action="[AUTORESPONDER_URL]" method="POST">
        <!-- hidden fields here -->
        <div class="form-row">
          <input type="text" name="first_name" placeholder="First name" class="form-input" required>
          <input type="email" name="email" placeholder="Work email" class="form-input" required>
        </div>
        <button type="submit" class="btn-primary">Get the Playbook →</button>
        <p class="form-fine-print">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
    <div class="hero-image">
      <!-- Overlapping rotated image stack -->
      <div class="image-stack">
        <img src="[image-1]" class="stack-img stack-back" alt="">
        <img src="[image-2]" class="stack-img stack-mid" alt="">
        <img src="[image-3]" class="stack-img stack-front" alt="">
      </div>
    </div>
  </div>
</section>
```

**CSS for image stack:**
```css
.image-stack { position: relative; width: 380px; height: 480px; }
.stack-img { position: absolute; width: 300px; border-radius: 8px; box-shadow: var(--card-shadow); }
.stack-back  { transform: rotate(-3deg); top: 60px; left: 0; z-index: 1; }
.stack-mid   { transform: rotate(0deg);  top: 20px; left: 40px; z-index: 2; }
.stack-front { transform: rotate(4deg);  top: 40px; left: 70px; z-index: 3; }
```

---

## 3. Pain Point Section

Cream background. Names the exact problem. One card, no decoration.

```html
<section class="pain-point">
  <div class="container">
    <div class="eyebrow">Sound familiar?</div>
    <div class="pain-card">
      <h2>[Name the specific frustration in the reader's own language]</h2>
      <p>[Expand on the problem — 2–3 sentences. Be specific. Use "you" language.]</p>
      <p class="pain-bridge">[Transition: "That's exactly why I created this."]</p>
    </div>
  </div>
</section>
```

---

## 4. What's Inside Section

White background. Makes the offer tangible. Mockup image left, bullets right.

```html
<section class="whats-inside">
  <div class="container whats-inside-inner">
    <div class="mockup-wrap">
      <img src="[guide-or-newsletter-mockup]" alt="[guide name] preview" class="mockup-img">
    </div>
    <div class="inside-copy">
      <div class="eyebrow">What you'll get</div>
      <h2>[Outcome-focused heading]</h2>
      <ul class="benefit-list">
        <li><span class="check">✓</span> [Specific deliverable 1]</li>
        <li><span class="check">✓</span> [Specific deliverable 2]</li>
        <li><span class="check">✓</span> [Specific deliverable 3]</li>
        <li><span class="check">✓</span> [Specific deliverable 4]</li>
        <li><span class="check">✓</span> [Specific deliverable 5]</li>
      </ul>
      <a href="#optin-hero" class="btn-primary">Get Instant Access →</a>
    </div>
  </div>
</section>
```

---

## 5. Why This Works (4-Block Grid)

Navy background. Numbered benefit blocks. Overcomes objections.

```html
<section class="why-works">
  <div class="container">
    <div class="eyebrow" style="color: var(--amber)">Why it works</div>
    <h2 style="color: var(--white)">[Section headline]</h2>
    <div class="benefit-grid">
      <div class="benefit-card">
        <div class="benefit-num">01</div>
        <h3>[Benefit headline]</h3>
        <p>[1–2 sentence explanation]</p>
      </div>
      <div class="benefit-card">
        <div class="benefit-num">02</div>
        <h3>[Benefit headline]</h3>
        <p>[1–2 sentence explanation]</p>
      </div>
      <div class="benefit-card">
        <div class="benefit-num">03</div>
        <h3>[Benefit headline]</h3>
        <p>[1–2 sentence explanation]</p>
      </div>
      <div class="benefit-card">
        <div class="benefit-num">04</div>
        <h3>[Benefit headline]</h3>
        <p>[1–2 sentence explanation]</p>
      </div>
    </div>
  </div>
</section>
```

---

## 6. Author Bio Section

Cream background. Story arc structure: problem → discovery → outcome.

```html
<section class="author-bio">
  <div class="container author-inner">
    <div class="author-photo-wrap">
      <img src="[profile-photo]" alt="Alvis" class="author-photo-lg">
    </div>
    <div class="author-copy">
      <div class="eyebrow">About Alvis</div>
      <h2>I Used to [Have The Problem]. Here's What Changed.</h2>
      <p>[Problem paragraph — what you struggled with before]</p>
      <p>[Discovery paragraph — what you found/built]</p>
      <p>[Outcome paragraph — what your clients/readers now get as a result]</p>
      <a href="#optin-hero" class="btn-primary">Get the Same Insights →</a>
    </div>
  </div>
</section>
```

---

## 7. Testimonials Section

White background. 2–3 cards. Star ratings. Specific outcome quotes only.

```html
<section class="testimonials">
  <div class="container">
    <div class="eyebrow">What readers say</div>
    <h2>Real Results from Real Leaders</h2>
    <div class="testimonial-grid">
      <div class="testimonial-card">
        <div class="stars">★★★★★</div>
        <blockquote>"[Specific outcome quote — what changed for them after reading]"</blockquote>
        <div class="attribution">
          <img src="[headshot]" alt="[Name]" class="testimonial-photo">
          <div>
            <strong>[Full Name]</strong>
            <span>[Title, Company]</span>
          </div>
        </div>
      </div>
      <!-- repeat for 2–3 testimonials -->
    </div>
  </div>
</section>
```

---

## 8. Press / As-Seen-In Strip

Cream-dark background. Logo bar. Signals third-party credibility.

```html
<section class="press-strip">
  <div class="container">
    <div class="press-label">As seen in / featured on</div>
    <div class="press-logos">
      <img src="[logo-1]" alt="[Publication 1]" class="press-logo">
      <img src="[logo-2]" alt="[Publication 2]" class="press-logo">
      <!-- Add podcast logos, speaking event logos, platform features -->
    </div>
  </div>
</section>
```

---

## 9. Quote + CTA Section

Orange background. Pull quote from the guide/newsletter + embedded form.

```html
<section class="quote-cta" id="optin-mid">
  <div class="container quote-cta-inner">
    <div class="pull-quote">
      <blockquote>"[Most compelling line from the guide or newsletter — the sentence that would make someone stop scrolling]"</blockquote>
      <cite>— Alvis, [Guide Name]</cite>
    </div>
    <div class="quote-form">
      <p class="quote-form-label">Want the full breakdown?</p>
      <form class="optin-form optin-form-light" action="[AUTORESPONDER_URL]" method="POST">
        <input type="email" name="email" placeholder="Your work email" class="form-input" required>
        <button type="submit" class="btn-ghost">Send It To Me →</button>
      </form>
    </div>
  </div>
</section>
```

---

## 10. Final CTA Section

Dark background. Urgency framing. Last chance form.

```html
<section class="final-cta" id="optin-final">
  <div class="container final-cta-inner">
    <div class="eyebrow" style="color: var(--amber)">What are you waiting for?</div>
    <h2 style="color: var(--white)">[Restate the offer headline — stronger, more urgent]</h2>
    <p style="color: rgba(255,255,255,0.75)">[1-sentence stakes — what they lose by not getting this]</p>
    <form class="optin-form" action="[AUTORESPONDER_URL]" method="POST">
      <div class="form-row">
        <input type="text" name="first_name" placeholder="First name" class="form-input" required>
        <input type="email" name="email" placeholder="Work email" class="form-input" required>
      </div>
      <button type="submit" class="btn-primary">Yes, I Want This →</button>
      <p class="form-fine-print" style="color: rgba(255,255,255,0.5)">Free. No spam. Unsubscribe anytime.</p>
    </form>
  </div>
</section>
```

---

## 11. Footer

Navy background. Minimal — no nav links that invite exit.

```html
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-logo">Alvis House</div>
    <div class="footer-links">
      <a href="/privacy-policy">Privacy</a>
      <a href="/terms">Terms</a>
    </div>
    <div class="footer-copy">© 2026 Alvis House. All rights reserved.</div>
  </div>
</footer>
```
