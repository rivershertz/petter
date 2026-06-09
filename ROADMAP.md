# Roadmap

Tracks feature completion against the product spec in [PRODUCT.md](./PRODUCT.md).

---

## Core Domain & Data

- [x] Pet, Task, Slot, DayRecord, Reflection, Mood, AppState types
- [x] Journal store — AsyncStorage persistence (`loadState` / `saveState`)
- [x] Default Routine auto-generated on onboarding — Morning (Feed, Water, Walk), Afternoon (Water, Play), Evening (Feed, Water, Walk) ([PRODUCT.md — Default Routine](./PRODUCT.md))
- [x] Task completion recording — idempotent, no streaks, no overdue state ([PRODUCT.md — Completion](./PRODUCT.md))
- [x] Reflection response recording tied to DayRecord
- [ ] **Silent miss recording** — ADR 0001 specifies that every missed Task should be silently written to the Journal at slot close so Care History can surface patterns. Currently the store only records completions; missed tasks are discarded. ([PRODUCT.md — Care History](./PRODUCT.md))

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
- [ ] **Lottie confetti** — DESIGN.md specifies a Lottie particle system for the celebration burst. Current implementation uses a hand-rolled `Animated` particle system. Acceptable for now; revisit if the motion feels under-powered.

---

## History Screen (Care History)

- [x] Week summary card — positive framing ("X tasks completed this week with [Name]") ([PRODUCT.md — Care History](./PRODUCT.md))
- [x] 14-day rolling history, sorted newest first
- [x] Mood emoji row per day
- [ ] **Completed task names not rendered** — `DayCard` computes `completedTasks` but the array is never displayed. Task names are missing from the history cards.
- [ ] **Reflection context in history** — moods show as bare emojis with no slot or prompt context, making the pattern hard to read.

---

## Manage Screen

- [x] Add custom Task to any Slot ([PRODUCT.md — Task](./PRODUCT.md))
- [x] Remove Task from any Slot
- [ ] **Rename Task** — no edit flow exists; owners can only delete and re-add.
- [ ] **Slot notification time editing** — each Slot stores `notificationHour` / `notificationMinute` in the data model but the Manage screen has no UI to change them. ([PRODUCT.md — Slot](./PRODUCT.md))

---

## Notifications

- [ ] **Slot-open push notifications** — Slot data model has `notificationHour` / `notificationMinute` fields and the spec states "notifications fire when a Slot opens". No `expo-notifications` scheduling code exists anywhere. ([PRODUCT.md — Slot](./PRODUCT.md))

---

## Accessibility & RTL

- [x] `I18nManager.isRTL` detection — Hebrew locale auto-selected when device is RTL
- [x] Hebrew translations in place (`src/i18n/he.ts`)
- [ ] **RTL layout enforcement** — `I18nManager.forceRTL` / `allowRTL` is never called. Hebrew text renders correctly but flex-row layouts (task rows, slot headers, tab bar) will not mirror on LTR devices running Hebrew. First-class RTL is a hard requirement. ([PRODUCT.md — Accessibility & Inclusion](./PRODUCT.md))
- [ ] **Nunito font** — DESIGN.md specifies Nunito 800/700 for Display and Heading roles via `expo-font`. No font loading exists; system fonts are used throughout. ([DESIGN.md — Typography](./DESIGN.md))
- [ ] **44pt minimum tap targets** — DESIGN.md specifies 44×44pt minimum for all interactive elements. `TaskItem` and small action buttons have not been audited against this. ([PRODUCT.md — Accessibility & Inclusion](./PRODUCT.md))
- [ ] **accessibilityLabel coverage** — Only `CelebrationOverlay` and the delete button in ManageScreen carry explicit labels. TaskItem, ReflectionCard mood chips, and tab icons need labels.
