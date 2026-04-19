# Quick Task: UX Improvements - Maison d'Ombre

## Objective
Implement priority UX improvements identified in audit to increase conversions and mobile usability.

## Tasks

### Task 1: WhatsApp Sticky Button (CRITICAL)
- Add floating WhatsApp button bottom-right
- Green brand color (#25D366)
- Pulse animation on idle
- Links to wa.me with pre-filled message
- Mobile: 56px, Desktop: 60px

### Task 2: Reduce Image Blur
- Change filter: blur(1.2px) → blur(0.3px)
- Affects: hero, parallax, gallery images
- Preserve grain overlay

### Task 3: Add og:image + Favicon
- Create/reference hero image for og:image (1200x630)
- Add favicon.ico + apple-touch-icon
- Add manifest.json for PWA

### Task 4: Touch Targets 44px
- Filter buttons: min 44x44px
- Nav links mobile: min 44px height
- Contact icons: 48x48px
- CTA buttons: already OK

### Task 5: Focus States Visible
- Add outline on :focus-visible
- Color: var(--color-accent)
- Offset: 2px
- Style: solid 2px

## Validation
- Playwright visual tests after each step
- Mobile viewport (375px) + Desktop (1440px)
