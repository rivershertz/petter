---
title: QA Flows — Petter
description: Manual QA test cases for the Petter app. Each flow covers one user-facing feature with step-by-step execution instructions and the expected visual outcome per step. Run these before any release to verify the main paths are working correctly.
---

# QA Flows — Petter

---

## 1. Onboarding — First Launch

**Description**: Fresh install with no saved state. User names their pet and enters the app.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Launch app with no stored data | Loading spinner on neutral background, then onboarding screen with 🐕 emoji and a name input field |
| 2 | Input field is empty | CTA button is dimmed (opacity 0.4), label shows default placeholder text |
| 3 | Type a pet name (e.g. "Luna") | CTA button becomes fully opaque, label updates to include the pet name |
| 4 | Tap CTA or press keyboard "Done" | Screen transitions to a "ready" confirmation screen with 🐾 emoji, pet name in heading |
| 5 | Tap "Let's go" / CTA on ready screen | App navigates to the main tab layout (Today / History / Manage tabs visible at bottom) |
| 6 | iOS notification permission prompt appears (first launch only) | System dialog asks to allow notifications; tap "Allow". Daily slot reminders are scheduled in the background |

---

## 2. Onboarding — Empty Name Validation

**Description**: User attempts to submit with no name entered.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Launch onboarding screen | Name input is auto-focused, keyboard appears |
| 2 | Leave input empty, tap CTA | Nothing happens; CTA remains dimmed and non-interactive |
| 3 | Press keyboard "Done" with empty input | Nothing happens |

---

## 3. Today — Complete a Single Task

**Description**: User taps a task checkbox during the active slot.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Open Today tab | Current time slot header has primary-color background with white text; future slots are dimmed (50% opacity) |
| 2 | Tap an uncompleted task in the active slot | Task row updates to a checked/completed state |
| 3 | Celebration overlay appears | White bubble with 🐾 and "Great job!" message pops in with spring animation; a Lottie confetti burst fans out from the center in the brand celebration palette (peach, sage, sky, yellow, indigo, coral). With reduce-motion enabled, the bubble shows instantly with no confetti |
| 4 | Overlay auto-dismisses (~1.4 s) | Celebration fades out; task remains checked; slot counter (e.g. "1/3") increments |

---

## 4. Today — Complete All Tasks in a Slot (Slot Celebration)

**Description**: User completes the last remaining task in a slot.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | All but one task in a slot is checked | Slot header shows partial count (e.g. "2/3") |
| 2 | Tap the last unchecked task | Task row turns checked |
| 3 | Celebration overlay appears with slot message | Bubble message references the slot name and pet name (e.g. "Morning done! Luna is happy 🐾") |
| 4 | Overlay dismisses | Slot header now shows a ✓ badge alongside the full count (e.g. "3/3") |

---

## 5. Today — Afternoon Reflection (Mood Selection)

**Description**: Reflection card appears below afternoon slot tasks; user picks a mood.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | View afternoon slot (active or past) | Reflection card with warm peach background (#FEF0EB) is visible below task list, showing a prompt and 5 mood chips (happy, calm, anxious, tired, connected) |
| 2 | Tap a mood chip (e.g. "😊 happy") | Selected chip fills with accent color; label turns white; other chips remain outlined |
| 3 | Tap a different mood chip | New chip becomes selected; previously selected chip reverts to outlined style |
| 4 | Navigate away and return | Selected mood chip remains highlighted (persisted) |

---

## 6. Today — Slot State Visual Differentiation

**Description**: Verify active / past / future slots render distinctly based on current time.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Open Today tab in the morning (before 12:00) | Morning header: primary-color background, white text. Afternoon and evening headers: neutral surface background, muted text, 50% opacity |
| 2 | View afternoon tasks | Task items inside future slots appear non-interactive (disabled) |
| 3 | Task count badge | Future slots show no count badge; active/past slots show "X/Y" count |

---

## 7. Manage — Add a Custom Task

**Description**: User adds a new custom task to a slot.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Open Manage tab | Three slot sections (Morning, Afternoon, Evening), each with existing tasks and a dashed "+ Add task" button |
| 2 | Tap "+ Add task" under a slot | Inline form appears below the task list: a bordered text input (auto-focused) and Cancel / Save buttons |
| 3 | Input is empty | Save button is dimmed (opacity 0.4) and non-interactive |
| 4 | Type a task name | Save button becomes fully opaque and interactive |
| 5 | Tap Save (or press Done) | Form collapses; new task appears in the slot's task list |
| 6 | Open Today tab | New custom task is visible in the corresponding slot |

---

## 8. Manage — Cancel Adding a Task

**Description**: User opens the add-task form then cancels.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Tap "+ Add task" to open the form | Inline form appears with empty input |
| 2 | Type some text | Input shows typed text |
| 3 | Tap Cancel | Form collapses; no new task is added; slot task list is unchanged |

---

## 9. Manage — Remove a Task

**Description**: User removes a task via the ✕ button.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Observe task row in Manage | Each row has a task label, a ✎ rename button, and a ✕ remove button on the right (each ≥44pt) |
| 2 | Tap ✕ on a task | Native alert dialog appears with task name and "Delete Task" / "Cancel" options |
| 3 | Tap Cancel in the dialog | Dialog dismisses; task row is still present in the list |
| 4 | Tap ✕ again, then tap "Delete Task" | Task row is removed from the list immediately |
| 5 | Open Today tab | Removed task is no longer shown in that slot |

---

## 10. History — View Daily Records

**Description**: After completing tasks and a reflection, the History tab shows a record.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Complete several tasks across slots on the current day | — |
| 2 | Select a mood in the afternoon reflection | — |
| 3 | Open History tab | Most recent day appears as a card at the top; card shows date and task count (e.g. "4 tasks", or "1 task" singular) |
| 4 | Completed task names render on the card | Each completed task appears as a small periwinkle pill chip (e.g. "Feed Luna", "Fresh water"); names are translated and reflect any renames |
| 5 | Reflection mood context | Each recorded mood renders as a row: emoji + "{Slot} · {Mood}" (e.g. "😊 Afternoon · Happy"), not a bare emoji |
| 6 | If completions exist this week | A 🌟 weekly summary card appears above the day list, stating total completions this week |

---

## 11. History — Empty State

**Description**: First day of use with no completions recorded.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Complete onboarding (no tasks done yet) | — |
| 2 | Open History tab immediately | No day cards visible; muted empty-state message is displayed centered on screen |
| 3 | No week summary card | 🌟 card is absent since weekCompletions === 0 |

---

## 12. Manage — Rename a Task

**Description**: User renames an existing task via the ✎ button.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Open Manage tab, tap the ✎ button on a task row | Row is replaced by an inline edit form: a bordered text input pre-filled with the current task name (auto-focused) and Cancel / Save buttons |
| 2 | Clear the input | Save button is dimmed (opacity 0.4) and non-interactive |
| 3 | Type a new name (e.g. "Evening cuddle") | Save button becomes fully opaque |
| 4 | Tap Save (or press Done) | Form collapses; the task row now shows the new name |
| 5 | Open Today tab | The task appears under its slot with the renamed label |
| 6 | Rename a default task (e.g. "Feed Luna") | Editing works the same; after save the task renders as the custom text and no longer re-translates with the pet name |

---

## 13. Manage — Edit Slot Reminder Time

**Description**: User changes the notification time for a slot.

| # | Step | Expected Visual |
|---|------|-----------------|
| 1 | Open Manage tab | Each slot header shows a 🔔 time pill on the right (e.g. "08:00" morning, "13:00" afternoon, "18:00" evening) |
| 2 | Tap the time pill | An inline editor appears with two steppers (hour and minute), each with − / + buttons (≥44pt) and the current value between them, plus Cancel / Save |
| 3 | Tap + on the hour stepper | Hour value increments (wraps 23 → 00); minute steppers adjust in steps of 5 |
| 4 | Tap Save | Editor collapses; the time pill reflects the new time |
| 5 | Reopen the editor | The steppers show the saved value (persisted). Notifications are silently rescheduled to the new time |
| 6 | Tap Cancel after changing steppers | Editor collapses with no change to the saved time |
