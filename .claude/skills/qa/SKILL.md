---
name: qa
description: Run the manual QA test suite for the Petter app. Boots the iOS simulator, starts Expo, walks through every flow defined in QA.md using simulator tap/screenshot interactions, and writes a timestamped results file (qa-results-<datetime>.md) in the project root. Use when the user asks to run QA, test the app, verify features before a release, or check for regressions.
---

# QA — Petter

Runs all flows from [QA.md](QA.md) against the live app in the iOS simulator and writes a results file.

## Steps

### 1. Boot the simulator

```bash
# Boot iPhone 17 Pro (or whichever is available) if not already booted
xcrun simctl boot E3A60C81-FE1E-4A8A-9429-AE74C044A014 2>/dev/null || true
open -a Simulator
```

### 2. Start the app

> Use the local binary — the npm proxy intercepts `npx expo`.

```bash
./node_modules/.bin/expo start --ios 2>&1 | tee /tmp/expo_qa.log &
```

Wait until the log contains `iOS Bundled` before proceeding.

```bash
until grep -q "iOS Bundled" /tmp/expo_qa.log 2>/dev/null; do sleep 2; done
```

### 3. Reset app state (fresh run)

Clear AsyncStorage so onboarding flows start from scratch.

```bash
# Terminate Expo Go
xcrun simctl terminate booted host.exp.Exponent 2>/dev/null || true

# Locate Expo Go's data container and wipe AsyncStorage
DEVICE=$(xcrun simctl list devices | grep Booted | grep -oE '[A-F0-9-]{36}' | head -1)
EXPO_DATA=$(find ~/Library/Developer/CoreSimulator/Devices/$DEVICE/data/Containers/Data/Application \
  -maxdepth 2 -name "*.plist" 2>/dev/null \
  | xargs grep -l "host.exp.Exponent" 2>/dev/null \
  | head -1 | xargs -I{} dirname {})

if [ -n "$EXPO_DATA" ]; then
  rm -rf "$EXPO_DATA/Documents/RCTAsyncLocalStorage_V1/"
  rm -rf "$EXPO_DATA/Documents/RCTAsyncLocalStorage/"
  echo "AsyncStorage cleared at $EXPO_DATA"
fi

# Reopen the app via its exp:// URL
xcrun simctl openurl booted "$(grep -oE 'exp://[^ ]+' /tmp/expo_qa.log | tail -1)"
```

Wait ~3 s for the app to render before the first screenshot.

### 4. Interaction primitives

**Screenshot** (call after every action, save to `/tmp/qa-step-<N>.png`):

```bash
xcrun simctl io booted screenshot /tmp/qa-step-N.png
```

Always read the screenshot image with the Read tool to observe the current UI.

**Tap** (logical-point coordinates on a 393 × 852 iPhone 17 Pro screen):

```bash
xcrun simctl io booted tap <x> <y>
```

**Type text** (requires the keyboard to be visible and an input focused):

```bash
osascript -e 'tell application "Simulator" to activate'
osascript -e 'tell application "System Events" to type text "Luna"'
```

**Dismiss keyboard** (tap outside the input or use Return):

```bash
xcrun simctl io booted tap 196 500   # neutral area
```

**Scroll / swipe**:

```bash
xcrun simctl io booted swipe <startX> <startY> <endX> <endY> <durationMs>
# e.g. scroll down: xcrun simctl io booted swipe 196 600 196 200 300
```

### 5. Execute each flow

Open [QA.md](QA.md) and go through every flow in order. For each step:

1. Perform the described action using the primitives above.
2. Take a screenshot and read it with the Read tool.
3. Compare what you see against the **Expected Visual** column.
4. Record the outcome as `✅ PASS`, `❌ FAIL`.

**Ordering matters**: flows that depend on prior state (History flows) assume earlier flows ran first.

**Time-sensitive flows**: Flow 6 (Slot State Differentiation) depends on the current hour. Note the time in the results.

### 6. Write results

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

Repeat the flow table for each flow. Under a `❌ FAIL` row add a **Note** line describing what went wrong.

### 7. Report back

After writing the file, summarise the results in one sentence: how many flows passed, how many failed, and the filename.
