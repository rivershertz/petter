# Roadmap

Tracks feature completion against the product spec in [PRODUCT.md](./PRODUCT.md).

---

## Core Domain & Data

- [x] Pet, Task, Slot, DayRecord, Reflection, Mood, AppState types
- [x] Journal store — AsyncStorage persistence (`loadState` / `saveState`)
- [x] Default Routine auto-generated on onboarding — Morning (Feed, Water, Walk), Afternoon (Water, Play), Evening (Feed, Water, Walk) ([PRODUCT.md — Default Routine](./PRODUCT.md))
- [x] Task completion recording — idempotent, no streaks, no overdue state ([PRODUCT.md — Completion](./PRODUCT.md))
- [x] Reflection response recording tied to DayRecord
- [x] **Silent miss recording** — ADR 0001. `reconcileMisses` runs on app open: every Task in a closed Slot that wasn't completed is written to `DayRecord.misses` (idempotent), including the prior day's evening reconciled the next morning. Never surfaced in the current day's view. ([PRODUCT.md — Care History](./PRODUCT.md))

---

## Onboarding

- [x] Two-step onboarding: pet name entry → ready confirmation ([PRODUCT.md — Zero friction to start](./PRODUCT.md))
- [x] Default Routine created on completion, no manual configuration required

---

## Today Screen

- [x] Three Slots rendered in order — Morning, Afternoon, Evening ([PRODUCT.md — Today Screen](./PRODUCT.md))
- [x] Active / past / future visual states for Slot headers
- [x] Task completion with celebration trigger
- [x] Slot-level completion badge when all tasks done
- [x] Reflection card shown in Afternoon slot after Play task
- [x] Full day always in view — no hidden or collapsed slots

---

## Celebration

- [x] CelebrationOverlay — spring scale + fade-in bubble with message
- [x] Particle system (6 colored dots) — custom `Animated` implementation
- [x] Reduced-motion fallback: instant show → 1000ms dismiss, no animation ([PRODUCT.md — Accessibility](./PRODUCT.md))
- [x] **Lottie confetti** — DESIGN.md Lottie particle system. `CelebrationOverlay` renders `assets/confetti.json` (28-particle burst in the brand celebration palette) via `lottie-react-native`, gated on reduced-motion (falls back to instant bubble, no confetti).

---

## History Screen (Care History)

- [x] Week summary card — positive framing ("X tasks completed this week with [Name]") ([PRODUCT.md — Care History](./PRODUCT.md))
- [x] 14-day rolling history, sorted newest first
- [x] Mood emoji row per day
- [x] **Completed task names rendered** — `DayCard` renders each completed task as a periwinkle pill chip, translated (or custom label for renamed tasks).
- [x] **Reflection context in history** — each mood renders as `emoji + "{Slot} · {Mood}"` rows instead of bare emojis.

---

## Manage Screen

- [x] Add custom Task to any Slot ([PRODUCT.md — Task](./PRODUCT.md))
- [x] Remove Task from any Slot
- [x] **Rename Task** — inline edit flow (✎ button) backed by `renameTask`; renaming pins a literal label so the task renders as custom text.
- [x] **Slot notification time editing** — each Slot header shows a 🔔 time pill; tapping opens an hour/minute stepper editor backed by `setSlotNotificationTime`, which reschedules notifications. ([PRODUCT.md — Slot](./PRODUCT.md))

---

## Notifications

- [x] **Slot-open push notifications** — `src/notifications` requests permission, sets the handler + Android channel, and schedules a daily reminder per Slot (`SchedulableTriggerInputTypes.DAILY`) with warm per-slot copy. Rescheduled on launch and whenever a Slot's time changes. ([PRODUCT.md — Slot](./PRODUCT.md))

---

## Accessibility & RTL

- [x] `I18nManager.isRTL` detection — Hebrew locale auto-selected when device is RTL
- [x] Hebrew translations in place (`src/i18n/he.ts`)
- [x] **RTL layout enforcement** — `src/i18n` calls `I18nManager.allowRTL` / `forceRTL` for the Hebrew locale, mirroring flex-row layouts. ([PRODUCT.md — Accessibility & Inclusion](./PRODUCT.md))
- [x] **Nunito font** — `expo-font` + `@expo-google-fonts/nunito` loaded in `App`; Display/Heading use Nunito 800/700. Hebrew keeps the system font for correct RTL glyphs. ([DESIGN.md — Typography](./DESIGN.md))
- [x] **44pt minimum tap targets** — `TaskItem` (52pt), Manage rename/remove/stepper buttons (44pt), and ReflectionCard mood chips (44pt min) all meet the minimum. ([PRODUCT.md — Accessibility & Inclusion](./PRODUCT.md))
- [x] **accessibilityLabel coverage** — `TaskItem` (label + checkbox state), mood chips, Manage rename/remove buttons + time pill, and tab bar items (`tabBarAccessibilityLabel`, emoji hidden) all carry labels.
