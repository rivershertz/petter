export type SlotId = 'morning' | 'afternoon' | 'evening';

export interface Pet {
  id: string;
  name: string;
  type: 'dog';
}

export interface Task {
  id: string;
  petId: string;
  slotId: SlotId;
  label: string; // key into i18n OR custom text
  isCustom: boolean;
  isDefault: boolean;
}

export interface Reflection {
  id: string;
  slotId: SlotId;
  prompt: string; // i18n key
}

export type Mood = 'happy' | 'calm' | 'anxious' | 'tired' | 'connected';

export interface DayRecord {
  date: string; // YYYY-MM-DD
  completions: CompletionRecord[];
  reflectionResponses: ReflectionResponse[];
}

export interface CompletionRecord {
  taskId: string;
  slotId: SlotId;
  completedAt: string; // ISO timestamp
}

export interface ReflectionResponse {
  reflectionId: string;
  slotId: SlotId;
  mood: Mood;
  respondedAt: string;
}

export interface Slot {
  id: SlotId;
  notificationHour: number;
  notificationMinute: number;
}

export interface AppState {
  pet: Pet | null;
  tasks: Task[];
  slots: Slot[];
  dayRecords: DayRecord[];
  onboardingComplete: boolean;
}
