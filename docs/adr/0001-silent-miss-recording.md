# Silent miss recording — clean present, rich past

The app targets Owners with PTSD, for whom confronting a list of missed tasks can be a harmful trigger. Today's view always starts clean — missed Tasks are never shown in the current day. However, every Task outcome (completed or missed) is silently recorded in the Journal so that Care History can surface behavioral patterns over time (e.g. "evening walks are frequently missed on weekdays"). The UX hides misses; the data model captures them.

## Considered Options

- **Carry-over**: Missed Tasks roll into today's view. Rejected — waking up to yesterday's failures is exactly the kind of trigger this app must avoid.
- **Clean slate with no recording**: Missed Tasks are discarded entirely. Rejected — the data has therapeutic value for identifying patterns that the Owner (or a therapist) can act on.
