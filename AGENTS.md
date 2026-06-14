# Petter

Daily dog care companion for people living with PTSD. Helps Owners maintain gentle routines by framing care tasks as bonding rituals, not obligations. Hebrew-speaking (Israeli) market.

**Stack**: Expo SDK 52, React Native 0.76, TypeScript, AsyncStorage, i18next, Lottie, React Navigation (bottom tabs).

## Domain Language

Use these terms exactly. The wrong word changes meaning.

| Term | Meaning | Never say |
|------|---------|-----------|
| **Owner** | The person with PTSD using the app | user, caretaker, patient |
| **Pet** | The Owner's dog (one per installation in MVP) | animal, companion |
| **Task** | A care action in a Slot ("Feed Bella", "Morning walk") | reminder, alarm, chore, to-do |
| **Slot** | Time-of-day grouping (Morning/Afternoon/Evening) with a notification time | period, time-block, session |
| **Completion** | Marking a Task done — triggers celebration, never penalized if missed | check-off, done |
| **Reflection** | Slot-bound mood check-in after bonding activities — not a Task | journal entry, survey |
| **Journal** | On-device store of all Owner data — never leaves the device in MVP | database, account, cloud |
| **Care History** | Backward-looking view of completions + moods, framed positively | log, streak history |
| **Default Routine** | Pre-populated Tasks/Slots generated at onboarding (dog type) | template, preset |
| **Today Screen** | Primary daily view — all three Slots stacked, full day always visible | dashboard, home, feed |

## Architecture

```
src/
  types/index.ts       — all domain types (Pet, Task, Slot, DayRecord, etc.)
  store/index.ts       — state management: load/save via AsyncStorage, all mutations
  screens/             — TodayScreen, HistoryScreen, ManageScreen, OnboardingScreen
  components/          — SlotSection, TaskItem, ReflectionCard, CelebrationOverlay
  theme/index.ts       — color + spacing tokens from DESIGN.md
  i18n/                — i18next setup, en.ts + he.ts translations
  notifications/       — expo-notifications scheduling per Slot
assets/confetti.json   — Lottie confetti burst
docs/adr/              — architectural decision records
App.tsx                — root: font loading, navigation, state hydration, miss reconciliation
```

- **No backend.** All data is local (AsyncStorage). Designed to be sync-ready without structural changes.
- **Single AppState** object hydrated on launch, passed via props. No Redux/Context — just `loadState`/`saveState` + mutation functions in `store/index.ts`.
- **Navigation**: bottom tabs (Today, History, Manage). Onboarding shown once before tabs.
- **i18n**: i18next with `en.ts` and `he.ts`. Hebrew locale auto-detected from device, forces RTL via `I18nManager`.

## Code Conventions

- Functional components only, no class components
- All user-facing strings use i18n keys — never hardcode English or Hebrew
- All animations MUST respect `prefers-reduced-motion` (reduced motion = instant transition, no animation)
- 44pt minimum touch targets on all interactive elements
- Import domain types from `../types` (single source of truth)
- State mutations go through `store/index.ts` — never mutate AppState directly

## Design Constraints

These rules are non-negotiable. Read PRODUCT.md for the full rationale.

- **No streaks, no overdue states, no red indicators.** Each day starts clean.
- **Never make the Owner feel bad.** Missed Tasks are recorded silently (ADR 0001) but never surfaced in the current day's view.
- **Celebrate care, not performance.** Completion triggers a celebratory moment, not a checkbox.
- **Zero friction to start.** Two screens to a working routine.
- **WCAG AA minimum.** High contrast body text (>=7:1 on bg). Secondary text >=3.5:1.

## Project Docs

| Doc | Contains |
|-----|----------|
| [PRODUCT.md](./PRODUCT.md) | Users, purpose, brand, design principles, accessibility requirements |
| [DESIGN.md](./DESIGN.md) | Colors, typography, spacing, motion, component specs |
| [CONTEXT.md](./CONTEXT.md) | Full domain language with examples |
| [ROADMAP.md](./ROADMAP.md) | Feature completion status, known bugs |
| [docs/adr/](./docs/adr/) | Architectural decision records |
