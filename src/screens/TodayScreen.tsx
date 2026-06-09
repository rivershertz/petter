import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography } from '../theme';
import { AppState, DayRecord, Mood, Reflection, SlotId, Task } from '../types';
import {
  getTodayRecord, getSlotCompletionCount,
  recordTaskCompletion, recordReflectionResponse,
} from '../store';
import { SlotSection } from '../components/SlotSection';
import { CelebrationOverlay } from '../components/CelebrationOverlay';

const SLOT_ORDER: SlotId[] = ['morning', 'afternoon', 'evening'];

// Afternoon slot has a reflection after play
const REFLECTIONS: Reflection[] = [
  {
    id: 'reflection-afternoon',
    slotId: 'afternoon',
    prompt: 'reflection.afternoonPrompt',
  },
];

function getCurrentSlotId(): SlotId {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

interface Props {
  appState: AppState;
  onStateChange: (state: AppState) => void;
}

export function TodayScreen({ appState, onStateChange }: Props) {
  const { t } = useTranslation();
  const [celebration, setCelebration] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  const [dayRecord, setDayRecord] = useState<DayRecord>(() => getTodayRecord(appState));

  const petName = appState.pet?.name ?? '';
  const activeSlot = getCurrentSlotId();

  const slotStateFor = (slotId: SlotId): 'active' | 'past' | 'future' => {
    const order = SLOT_ORDER.indexOf(slotId);
    const activeOrder = SLOT_ORDER.indexOf(activeSlot);
    if (order === activeOrder) return 'active';
    if (order < activeOrder) return 'past';
    return 'future';
  };

  const handleTaskComplete = async (taskId: string, slotId: SlotId) => {
    const next = await recordTaskCompletion(appState, taskId, slotId);
    onStateChange(next);
    const nextRecord = getTodayRecord(next);
    setDayRecord(nextRecord);

    // Check if entire slot is done
    const slotTasks = appState.tasks.filter(t => t.slotId === slotId);
    const completedAfter = slotTasks.filter(t =>
      nextRecord.completions.some(c => c.taskId === t.id)
    ).length;

    if (completedAfter === slotTasks.length) {
      setCelebration({
        visible: true,
        message: t('celebration.slotDone', { slot: t(`slots.${slotId}`), name: petName }),
      });
    } else {
      setCelebration({ visible: true, message: t('celebration.taskDone') });
    }
  };

  const handleReflectionSelect = async (reflectionId: string, slotId: SlotId, mood: Mood) => {
    const next = await recordReflectionResponse(appState, reflectionId, slotId, mood);
    onStateChange(next);
    setDayRecord(getTodayRecord(next));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {petName ? `${petName} 🐾` : '🐾'}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        {SLOT_ORDER.map((slotId) => {
          const slotTasks = appState.tasks.filter(t => t.slotId === slotId);
          const reflection = REFLECTIONS.find(r => r.slotId === slotId);
          return (
            <SlotSection
              key={slotId}
              slotId={slotId}
              slotState={slotStateFor(slotId)}
              tasks={slotTasks}
              reflection={reflection}
              dayRecord={dayRecord}
              petName={petName}
              onTaskComplete={(taskId) => handleTaskComplete(taskId, slotId)}
              onReflectionSelect={(reflectionId, mood) =>
                handleReflectionSelect(reflectionId, slotId, mood)
              }
            />
          );
        })}
      </ScrollView>

      <CelebrationOverlay
        visible={celebration.visible}
        message={celebration.message}
        onDone={() => setCelebration(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1, width: '100%' },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
    width: '100%',
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  greeting: {
    ...typography.display,
    color: colors.ink,
  },
  date: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});
