import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DayRecord, SlotId, Task, Slot, Mood, Pet } from '../types';

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
};

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
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

export function getTodayKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function getTodayRecord(state: AppState): DayRecord {
  const date = getTodayKey();
  return state.dayRecords.find(r => r.date === date) ?? {
    date,
    completions: [],
    reflectionResponses: [],
  };
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
  const existingRecord = existingIndex >= 0 ? state.dayRecords[existingIndex] : { date, completions: [], reflectionResponses: [] };

  if (existingRecord.completions.some(c => c.taskId === taskId)) return state;

  const updatedRecord: DayRecord = {
    ...existingRecord,
    completions: [
      ...existingRecord.completions,
      { taskId, slotId, completedAt: new Date().toISOString() },
    ],
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
  const existingRecord = existingIndex >= 0 ? state.dayRecords[existingIndex] : { date, completions: [], reflectionResponses: [] };

  const updatedRecord: DayRecord = {
    ...existingRecord,
    reflectionResponses: [
      ...existingRecord.reflectionResponses,
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
