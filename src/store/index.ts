import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DayRecord, MissRecord, SlotId, Task, Slot, Mood, Pet, ThemePreference } from '../types';

const STORAGE_KEY = 'petter_state';

const DEFAULT_SLOTS: Slot[] = [
  { id: 'morning', notificationHour: 8, notificationMinute: 0 },
  { id: 'afternoon', notificationHour: 13, notificationMinute: 0 },
  { id: 'evening', notificationHour: 18, notificationMinute: 0 },
];

function buildDefaultTasks(petId: string, petName: string): Task[] {
  return [
    { id: 'default-feed-morning', petId, slotId: 'morning', label: 'tasks.feed', isCustom: false, isDefault: true },
    { id: 'default-water-morning', petId, slotId: 'morning', label: 'tasks.water', isCustom: false, isDefault: true },
    { id: 'default-walk-morning', petId, slotId: 'morning', label: 'tasks.morningWalk', isCustom: false, isDefault: true },
    { id: 'default-water-afternoon', petId, slotId: 'afternoon', label: 'tasks.water', isCustom: false, isDefault: true },
    { id: 'default-play', petId, slotId: 'afternoon', label: 'tasks.play', isCustom: false, isDefault: true },
    { id: 'default-feed-evening', petId, slotId: 'evening', label: 'tasks.feed', isCustom: false, isDefault: true },
    { id: 'default-water-evening', petId, slotId: 'evening', label: 'tasks.water', isCustom: false, isDefault: true },
    { id: 'default-walk-evening', petId, slotId: 'evening', label: 'tasks.eveningWalk', isCustom: false, isDefault: true },
  ];
}

const EMPTY_STATE: AppState = {
  pet: null,
  tasks: [],
  slots: DEFAULT_SLOTS,
  dayRecords: [],
  onboardingComplete: false,
  themePreference: 'system',
};

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as AppState;
    // Migrate records persisted before the misses field existed (ADR 0001).
    const dayRecords = (parsed.dayRecords ?? []).map(r => ({ ...r, misses: r.misses ?? [] }));
    return { ...EMPTY_STATE, ...parsed, dayRecords };
  } catch {
    return EMPTY_STATE;
  }
}

export async function saveState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function completePetOnboarding(name: string): Promise<AppState> {
  const pet: Pet = { id: 'pet-1', name, type: 'dog' };
  const tasks = buildDefaultTasks(pet.id, name);
  const state: AppState = {
    ...EMPTY_STATE,
    pet,
    tasks,
    slots: DEFAULT_SLOTS,
    onboardingComplete: true,
  };
  await saveState(state);
  return state;
}

export function getTodayKey(now: Date = new Date()): string {
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
}

export function getTodayRecord(state: AppState): DayRecord {
  const date = getTodayKey();
  return state.dayRecords.find(r => r.date === date) ?? {
    date,
    completions: [],
    reflectionResponses: [],
    misses: [],
  };
}

// Hour (24h) at which each slot's window has fully passed. Evening never
// closes within its own day — it is reconciled the next time the app opens.
const SLOT_CLOSE_HOUR: Record<SlotId, number> = {
  morning: 12,
  afternoon: 17,
  evening: 24,
};

function isSlotClosed(date: string, slotId: SlotId, now: Date): boolean {
  const todayKey = getTodayKey(now);
  if (date < todayKey) return true;
  if (date > todayKey) return false;
  return now.getHours() >= SLOT_CLOSE_HOUR[slotId];
}

export function isTaskCompleted(record: DayRecord, taskId: string): boolean {
  return record.completions.some(c => c.taskId === taskId);
}

export function isReflectionResponded(record: DayRecord, reflectionId: string): boolean {
  return record.reflectionResponses.some(r => r.reflectionId === reflectionId);
}

export function getSlotCompletionCount(record: DayRecord, slotId: SlotId, tasks: Task[]): number {
  const slotTasks = tasks.filter(t => t.slotId === slotId);
  return slotTasks.filter(t => isTaskCompleted(record, t.id)).length;
}

export async function recordTaskCompletion(
  state: AppState,
  taskId: string,
  slotId: SlotId,
): Promise<AppState> {
  const date = getTodayKey();
  const existingIndex = state.dayRecords.findIndex(r => r.date === date);
  const existingRecord = existingIndex >= 0 ? state.dayRecords[existingIndex] : { date, completions: [], reflectionResponses: [], misses: [] };

  if (existingRecord.completions.some(c => c.taskId === taskId)) return state;

  const updatedRecord: DayRecord = {
    ...existingRecord,
    completions: [
      ...existingRecord.completions,
      { taskId, slotId, completedAt: new Date().toISOString() },
    ],
    // A completed task is never also a miss.
    misses: existingRecord.misses.filter(m => m.taskId !== taskId),
  };

  const dayRecords = existingIndex >= 0
    ? state.dayRecords.map((r, i) => i === existingIndex ? updatedRecord : r)
    : [...state.dayRecords, updatedRecord];

  const next = { ...state, dayRecords };
  await saveState(next);
  return next;
}

export async function recordReflectionResponse(
  state: AppState,
  reflectionId: string,
  slotId: SlotId,
  mood: Mood,
): Promise<AppState> {
  const date = getTodayKey();
  const existingIndex = state.dayRecords.findIndex(r => r.date === date);
  const existingRecord = existingIndex >= 0 ? state.dayRecords[existingIndex] : { date, completions: [], reflectionResponses: [], misses: [] };

  const updatedRecord: DayRecord = {
    ...existingRecord,
    reflectionResponses: [
      ...existingRecord.reflectionResponses.filter(r => r.reflectionId !== reflectionId),
      { reflectionId, slotId, mood, respondedAt: new Date().toISOString() },
    ],
  };

  const dayRecords = existingIndex >= 0
    ? state.dayRecords.map((r, i) => i === existingIndex ? updatedRecord : r)
    : [...state.dayRecords, updatedRecord];

  const next = { ...state, dayRecords };
  await saveState(next);
  return next;
}

export async function addCustomTask(state: AppState, label: string, slotId: SlotId): Promise<AppState> {
  if (!state.pet) return state;
  const task: Task = {
    id: `custom-${Date.now()}`,
    petId: state.pet.id,
    slotId,
    label,
    isCustom: true,
    isDefault: false,
  };
  const next = { ...state, tasks: [...state.tasks, task] };
  await saveState(next);
  return next;
}

export async function removeTask(state: AppState, taskId: string): Promise<AppState> {
  const next = { ...state, tasks: state.tasks.filter(t => t.id !== taskId) };
  await saveState(next);
  return next;
}

export async function renameTask(state: AppState, taskId: string, label: string): Promise<AppState> {
  const trimmed = label.trim();
  if (!trimmed) return state;
  const next = {
    ...state,
    // Renaming pins a literal label, so the task renders as custom text rather
    // than re-translating its original i18n key.
    tasks: state.tasks.map(t =>
      t.id === taskId ? { ...t, label: trimmed, isCustom: true } : t
    ),
  };
  await saveState(next);
  return next;
}

export async function setSlotNotificationTime(
  state: AppState,
  slotId: SlotId,
  hour: number,
  minute: number,
): Promise<AppState> {
  const next = {
    ...state,
    slots: state.slots.map(s =>
      s.id === slotId ? { ...s, notificationHour: hour, notificationMinute: minute } : s
    ),
  };
  await saveState(next);
  return next;
}

export async function setThemePreference(state: AppState, preference: ThemePreference): Promise<AppState> {
  const next = { ...state, themePreference: preference };
  await saveState(next);
  return next;
}

// ADR 0001 — silently record every Task missed in a slot that has closed.
// Runs on app open so the previous day's evening (and any slot that closed
// while the app was shut) is captured. Idempotent: a task already completed or
// already recorded as missed is never duplicated. The current day's view never
// surfaces these — they exist only for Care History pattern detection.
export async function reconcileMisses(state: AppState, now: Date = new Date()): Promise<AppState> {
  if (!state.onboardingComplete || state.tasks.length === 0) return state;

  const todayKey = getTodayKey(now);
  const dates = new Set(state.dayRecords.map(r => r.date));
  dates.add(todayKey);

  const records = [...state.dayRecords];
  let changed = false;

  for (const date of dates) {
    const idx = records.findIndex(r => r.date === date);
    const base: DayRecord = idx >= 0
      ? records[idx]
      : { date, completions: [], reflectionResponses: [], misses: [] };
    const newMisses: MissRecord[] = [];

    for (const task of state.tasks) {
      if (!isSlotClosed(date, task.slotId, now)) continue;
      const done = base.completions.some(c => c.taskId === task.id);
      const missed = base.misses.some(m => m.taskId === task.id);
      if (!done && !missed) {
        newMisses.push({ taskId: task.id, slotId: task.slotId, recordedAt: now.toISOString() });
      }
    }

    if (newMisses.length === 0) continue;
    changed = true;
    const updated: DayRecord = { ...base, misses: [...base.misses, ...newMisses] };
    if (idx >= 0) records[idx] = updated;
    else records.push(updated);
  }

  if (!changed) return state;
  const next = { ...state, dayRecords: records };
  await saveState(next);
  return next;
}
