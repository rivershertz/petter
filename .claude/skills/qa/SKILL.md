---
name: qa
description: Run the manual QA test suite for the Petter app. Boots the iOS simulator, starts Expo, walks through every flow defined in QA.md using simulator tap/screenshot interactions, and writes a timestamped results file (qa-results-<datetime>.md) in the project root. Use when the user asks to run QA, test the app, verify features before a release, or check for regressions.
---

# QA — Petter

Runs all flows from [QA.md](QA.md) against the live app in the iOS simulator and writes a results file.

## HARD RULE — Observe Only

This is a **read-only testing session**. You MUST NOT:

- Edit, write, or modify any source code files (no Edit, no Write to src/)
- Debug, diagnose root causes, or propose fixes
- Read source code to investigate errors
- Suggest or apply patches

When you encounter a bug, error overlay, or unexpected behavior: **record it as a ❌ FAIL in the results file with a description of what you observed, then move on to the next step/flow.** If the app is in an unrecoverable state for a flow, skip remaining steps in that flow, note it, and proceed to the next flow (resetting app state if needed).

## Prerequisites

`agent-device` must be installed:

```bash
npm install -g agent-device
agent-device --version   # verify
```

No Accessibility permissions required — agent-device uses XCTest under the hood.

## Steps

### 1. Boot the simulator

```bash
DEVICE_UDID="E3A60C81-FE1E-4A8A-9429-AE74C044A014"
xcrun simctl boot "$DEVICE_UDID" 2>/dev/null || true
open -a Simulator
xcrun simctl bootstatus "$DEVICE_UDID" -b   # blocks until fully ready
```

### 2. Start the app

```bash
./node_modules/.bin/expo start --ios 2>&1 | tee /tmp/expo_qa.log &
until grep -q "iOS Bundled" /tmp/expo_qa.log 2>/dev/null; do sleep 2; done
```

### 3. Reset app state (fresh run)

Wipe AsyncStorage so onboarding flows start from scratch.

```bash
DEVICE_UDID="E3A60C81-FE1E-4A8A-9429-AE74C044A014"
xcrun simctl terminate "$DEVICE_UDID" host.exp.Exponent 2>/dev/null || true

EXPO_DATA=$(find ~/Library/Developer/CoreSimulator/Devices/$DEVICE_UDID/data/Containers/Data/Application \
  -maxdepth 2 -name "*.plist" 2>/dev/null \
  | xargs grep -l "host.exp.Exponent" 2>/dev/null \
  | head -1 | xargs -I{} dirname {})

if [ -n "$EXPO_DATA" ]; then
  rm -rf "$EXPO_DATA/Documents/RCTAsyncLocalStorage_V1/"
  rm -rf "$EXPO_DATA/Documents/RCTAsyncLocalStorage/"
fi

xcrun simctl openurl "$DEVICE_UDID" "$(grep -oE 'exp://[^ ]+' /tmp/expo_qa.log | tail -1)"
sleep 3   # wait for app to render
```

### 4. Open an agent-device session

```bash
agent-device open host.exp.Exponent --platform ios --device "iPhone 17 Pro"
```

Keep this session open for the entire QA run. Close it at the end with `agent-device close`.

### 5. Interaction primitives

**Snapshot** — always re-snapshot after any action that changes the screen:

```bash
agent-device snapshot -i          # interactive refs only (fast path before acting)
agent-device snapshot             # full readable state (use for assertions)
```

Refs look like `@e7`. They are valid until the next press/fill/scroll/navigation.

**Tap / press**:

```bash
agent-device press @e7
agent-device press 'label="Meet Luna'\''s routine"'
```

**Fill a text field** — always press first to focus, then fill:

```bash
agent-device press @e7
agent-device fill @e7 "Luna"
```

**Type into the focused field** (appends, does not replace):

```bash
agent-device type "Luna"
```

**Dismiss keyboard**:

```bash
agent-device keyboard dismiss
```

**Scroll**:

```bash
agent-device scroll down
agent-device scroll up
```

**Wait**:

```bash
agent-device wait 1500            # ms
agent-device wait 'label="Good job!"'   # wait for element to appear
```

**Screenshot** — save then read with the Read tool to observe the UI:

```bash
agent-device screenshot /tmp/qa-step-N.png
```

**Dismiss React Native overlays** (LogBox / RedBox) if they appear:

```bash
agent-device react-native dismiss-overlay
```

### 6. Execute each flow

Open [QA.md](QA.md) and go through every flow in order. For each step:

1. Perform the described action using the primitives above.
2. Run `agent-device snapshot -i` (or `snapshot`) to read current state.
3. Take a screenshot with `agent-device screenshot /tmp/qa-step-N.png` and read it with the Read tool.
4. Compare against the **Expected Visual** column.
5. Record the outcome as `✅ PASS` or `❌ FAIL`.

**Ordering matters**: History flows assume earlier flows ran first.

**Time-sensitive flows**: Flow 6 (Slot State Differentiation) depends on the current hour — note the time in the results.

**Between flows that require fresh state**: terminate and relaunch via simctl openurl (step 3), then call `agent-device open host.exp.Exponent --platform ios --device "iPhone 17 Pro"` again to re-attach.

### 7. Close the session

```bash
agent-device close
```

### 8. Write results

Create `qa-results-<YYYY-MM-DD-HH-mm>.md` in the project root:

```md
# QA Results — <YYYY-MM-DD HH:mm>

**Platform**: iOS Simulator (Expo Go, iPhone 17 Pro)
**Time of run**: <current time and active slot>
**Tester**: Claude

## Summary

| Metric       | Count |
| ------------ | ----- |
| Flows run    | N     |
| Steps passed | N     |
| Steps failed | N     |

## Flow Results

### 1. <Flow Name>

| #   | Step     | Expected          | Actual              | Status  |
| --- | -------- | ----------------- | ------------------- | ------- |
| 1   | <action> | <expected visual> | <what was observed> | ✅ / ❌ |

---
```

Under any `❌ FAIL` row, add a **Note** line describing what went wrong.

### 9. Report back

Summarise in one sentence: how many flows passed, how many failed, and the filename.
