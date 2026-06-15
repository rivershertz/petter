# Design

## Color

Palette strategy: **Committed** — a periwinkle-indigo primary carries the brand identity across all key surfaces (active states, buttons, Slot headers). A warm coral-peach accent activates for celebration moments, CTAs, and the Reflection picker. Background lets the primary do the talking.

Mood: "playdate in a sunny backyard — a dog leaping through morning light, soft shadows on grass, something that makes you smile without trying." Dark mode is the same backyard at dusk — warm, dim, present.

### Theme

Three modes: **Light**, **Dark**, **System** (follows OS). Default: System. Stored in `AppState.themePreference`. Changes apply instantly. System mode follows OS changes in real-time.

### Light palette

```css
--color-primary:  oklch(0.52 0.17 252);   /* periwinkle indigo — calm, identity */
--color-accent:   oklch(0.68 0.19 32);    /* warm coral-peach — tender, celebratory */
--color-bg:       oklch(1.000 0.000 0);   /* pure white */
--color-surface:  oklch(0.965 0.007 255); /* barely blue-tinted card bg */
--color-ink:      oklch(0.20 0.015 258);  /* near-black, brand-hued */
--color-muted:    oklch(0.45 0.008 258);  /* secondary text — ≥3.5:1 vs bg */
--color-border:   #E8EAF4;
--color-slotPast:   #B8BAD0;              /* ink at 40% opacity */
--color-slotFuture: #D4D6E8;             /* ink at 25% opacity */
```

### Dark palette

Deep indigo-navy, not black. Same periwinkle family — the same room with the lights dimmed.

```css
--color-primary:  oklch(0.60 0.15 252);   /* periwinkle, lightened for dark bg */
--color-accent:   oklch(0.72 0.17 32);    /* coral, lightened for dark bg */
--color-bg:       oklch(0.155 0.02 258);  /* deep indigo-navy */
--color-surface:  oklch(0.205 0.025 258); /* lifted card bg */
--color-ink:      oklch(0.925 0.008 258); /* soft off-white, brand-hued */
--color-muted:    oklch(0.635 0.02 258);  /* secondary text — ≥4.5:1 vs bg */
--color-border:   oklch(0.25 0.025 258);
--color-slotPast:   oklch(0.37 0.025 258);
--color-slotFuture: oklch(0.305 0.025 258);
```

Dark hex approximations: bg `#181A2A`, surface `#232540`, ink `#E8E9F0`, muted `#9496AE`, primary `#7B8CE0`, accent `#E8805E`, border `#2E3050`, slotPast `#4A4C68`, slotFuture `#3A3C58`.

### Contrast (both modes)

Text on primary fills: white. Text on accent fills: white. Body text on bg: ink (≥7:1). Secondary text: muted (≥4.5:1 on bg, ≥3.5:1 on surface).

### Celebration particles (shared across modes)

- `oklch(0.85 0.12 32)` — soft peach
- `oklch(0.82 0.10 135)` — sage green
- `oklch(0.88 0.09 252)` — sky-periwinkle
- `oklch(0.90 0.11 85)` — warm yellow

## Typography

Mobile-first. Hebrew (RTL) is a first-class requirement — body text always uses system fonts, which provide correct Hebrew rendering on iOS (SF Hebrew) and Android (Noto Sans Hebrew).

| Role | Family | Weight | Size |
|------|--------|--------|------|
| Display | Nunito (expo-font) with system fallback | 800 | 28–36sp |
| Heading | Nunito | 700 | 20–24sp |
| Body | System (SF Pro / Roboto + Hebrew) | 400 | 16sp |
| Label | System | 600 | 13sp |
| Caption | System | 400 | 12sp |

Line height: 1.5× for body, 1.2× for headings. Hebrew text always inherits system font regardless of component role.

## Shape & Radius

Soft but not infantilizing. Cards and buttons use rounded corners that feel calm and safe.

| Element | Radius |
|---------|--------|
| Button (primary) | 16px |
| Card / Slot section | 20px |
| Task item | 14px |
| Bottom sheet | 24px top corners |
| Mood picker chip | 50% (pill) |

## Spacing

Base unit: 8px. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48px.

## Motion

Intentional, soft, never sudden. Respects `prefers-reduced-motion` — all animations fall back to instant transitions.

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Task completion | Scale up 1.0→1.04→1.0 + color fill | 280ms | ease-out-quart |
| Celebration burst | Confetti particle system (Lottie) | 1200ms | — |
| Slot open notification | Gentle slide-down | 300ms | ease-out |
| Tab switch | Fade | 180ms | ease-out |
| Mood picker | Spring scale | 200ms | spring (stiffness 200) |

## Elevation

No box-shadows on flat elements. Elevation via surface color contrast only.
Modals / bottom sheets: `rgba(0,0,0,0.4)` scrim.

## Iconography

Rounded icon style (SF Symbols on iOS, Material Symbols Rounded on Android via `@expo/vector-icons`). Stroke weight consistent with body text weight.

## Component Notes

**SlotSection**: Active slot has primary-colored header. Past slots muted (ink at 40% opacity). Future slots ink at 25% opacity. All always visible — no collapse.

**TaskItem**: Tap area minimum 44×44pt. On completion: fill animates from transparent to primary-tinted surface, checkmark scales in. Triggers celebration burst at Slot completion.

**ReflectionCard**: Coral-accent tinted surface. Five mood chips in a row (emoji + one-word label). Selected chip fills to accent color with white label.

**CelebrationOverlay**: Full-screen Lottie confetti burst, auto-dismisses at 1200ms. Respects reduced-motion: crossfade to a simple "Done" state instead.
