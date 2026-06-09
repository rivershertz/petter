# Petter

A daily pet care companion for people living with PTSD. Helps owners maintain consistent, gentle routines with their pets by framing care tasks as bonding rituals rather than obligations.

## Language

**Pet**:
An animal companion belonging to an Owner. MVP supports exactly one Pet per installation. Each Pet has a type (dog only in MVP) that determines its Default Routine.
_Avoid_: Animal, companion animal

**Owner**:
The person with PTSD who uses the app to care for their Pet. A single app installation serves one Owner with one Pet in MVP.
_Avoid_: User, caretaker, patient

**Task**:
A single care action belonging to a Slot — e.g. "Feed Bella", "Morning walk". Not time-bound to a clock; it belongs to a Slot. Can be part of the Default Routine or created by the Owner. Requires only a name and a Slot to create.
_Avoid_: Reminder, alarm, chore, to-do

**Slot**:
A named time-of-day grouping that organizes Tasks. An entity with a configurable notification time. Default slots ship pre-configured (Morning, Afternoon, Evening) — the Owner can adjust times but is never required to. Notifications fire when a Slot opens, not at a hard clock time.
_Avoid_: Period, time-block, session

**Completion**:
The act of marking a Task as done within its Slot. Triggers a celebratory visual moment. Never penalized if missed — no streaks, no overdue state.
_Avoid_: Check-off, done, finished

**Reflection**:
A Slot-bound prompt that invites the Owner to check in with their own emotional state after a bonding activity. Not a Task — no action is performed for the Pet. Completed by selecting a mood (emoji/mood selector, one tap). Appears after play or walk activities in the Default Routine.
_Avoid_: Journal entry, check-in, survey, question

**Journal**:
The local, on-device store of all Owner data — Pets, Tasks, Slots, Completion history, and Reflection responses. Never leaves the device in MVP. Designed to be sync-ready without structural changes.
_Avoid_: Database, storage, account, cloud

**Care History**:
A backward-looking view of the Owner's completed Tasks and Reflection moods over time. Every Task outcome (completed or missed) is silently recorded in the Journal for pattern analysis. The view surfaces accumulated care positively ("18 tasks completed this week with Bella") — missed Tasks are never shown in today's view but are available in Care History for identifying behavioral patterns.
_Avoid_: Log, report, streak history, activity feed

**Default Routine**:
The pre-populated set of Tasks, Reflections, and Slots generated for an Owner during onboarding, based on Pet type. MVP supports dogs only. Dog default: Morning (Feed, Water, Walk), Afternoon (Water, Play + Reflection "How did play time make you feel?"), Evening (Feed, Water, Walk). Represents a usable starting state requiring zero manual configuration.
_Avoid_: Template, preset, starter kit

**Today Screen**:
The primary daily view. Displays all three Slots stacked. The currently active Slot is visually prominent. Past Slots show completion state (muted, with checkmarks). Future Slots are visible but quiet. No hidden content — the full day is always in view.
_Avoid_: Dashboard, home screen, feed

## Example dialogue

> Dev: "So when the user taps 'Feed Bella', that fires a reminder?"
> Domain expert: "No — the Slot fires the notification when it opens. The Task is just something the Owner works through inside the Slot."
> Dev: "And if they miss a Task?"
> Domain expert: "Nothing happens. The app moves on. The next Slot opens fresh."
