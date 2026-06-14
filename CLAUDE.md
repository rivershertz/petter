@AGENTS.md

## Commands

```bash
npx expo start                # Dev server (press i for iOS simulator, a for Android)
npx expo start --ios          # Direct iOS launch
npx tsc --noEmit              # Typecheck (no test runner configured yet)
```

IMPORTANT: Read the exact versioned Expo docs at https://docs.expo.dev/versions/v52.0.0/ before writing any Expo API code. SDK 52 has breaking changes from earlier versions.

## Workflow

- Read PRODUCT.md before any feature work — it defines what "correct" means
- Read DESIGN.md before any UI work — colors, spacing, motion specs are there
- Run `/qa` skill after UI changes to catch regressions on the simulator
- Conventional commits, under 4 lines
- When adding a new screen or component, add translations to both `src/i18n/en.ts` and `src/i18n/he.ts`

## Things That Will Bite You

- **`reconcileMisses` runs on app open** (`App.tsx`). It back-fills missed Tasks for closed Slots, including the prior day's evening. Don't duplicate this logic — call the existing function.
- **Evening Slot never closes within its own day.** `SLOT_CLOSE_HOUR.evening` is 24, so evening misses are only reconciled the next time the app opens (next morning). This is intentional per ADR 0001.
- **Renaming a Task pins a literal label.** `renameTask` sets `isCustom: true`, so the task renders its raw `label` string instead of translating an i18n key. This is by design — don't "fix" it.
- **Lottie confetti is gated on reduced-motion.** `CelebrationOverlay` checks `AccessibilityInfo` and falls back to an instant bubble with no animation. Always test both paths when touching celebration code.
- **Hebrew forces RTL at startup.** `src/i18n/index.ts` calls `I18nManager.forceRTL(true)` for Hebrew locale. This cannot be toggled at runtime — it requires an app restart. All flex-row layouts must work mirrored.
- **Mood replacement, not append.** `recordReflectionResponse` filters out the existing response for the same `reflectionId` before inserting the new one. Tapping a different mood chip replaces, never stacks.
- **Custom task IDs use `Date.now()`.** `addCustomTask` generates `custom-${Date.now()}` — these are not UUIDs but are unique enough for a single-device, single-Owner MVP.
