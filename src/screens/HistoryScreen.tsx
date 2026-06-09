import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radii, spacing, typography } from '../theme';
import { AppState, DayRecord, Mood } from '../types';

const MOOD_EMOJI: Record<Mood, string> = {
  happy: '😊',
  calm: '😌',
  anxious: '😟',
  tired: '😴',
  connected: '🐾',
};

function getWeekStart(): Date {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

interface Props {
  appState: AppState;
}

export function HistoryScreen({ appState }: Props) {
  const { t } = useTranslation();
  const petName = appState.pet?.name ?? '';

  const weekStart = getWeekStart();
  const weekRecords = appState.dayRecords.filter(r => new Date(r.date) >= weekStart);
  const weekCompletions = weekRecords.reduce((sum, r) => sum + r.completions.length, 0);

  const sortedRecords = [...appState.dayRecords]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('history.title')}</Text>

        {weekCompletions > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>🌟</Text>
            <Text style={styles.summaryText}>
              {t('history.weekSummary', { count: weekCompletions, name: petName })}
            </Text>
          </View>
        )}

        {sortedRecords.length === 0 && (
          <Text style={styles.empty}>{t('history.empty')}</Text>
        )}

        {sortedRecords.map(record => (
          <DayCard key={record.date} record={record} tasks={appState.tasks} petName={petName} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function DayCard({ record, tasks, petName }: { record: DayRecord; tasks: AppState['tasks']; petName: string }) {
  const date = new Date(record.date);
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const completedTasks = record.completions.map(c => {
    const task = tasks.find(t => t.id === c.taskId);
    return task?.label ?? c.taskId;
  });

  const moods = record.reflectionResponses.map(r => r.mood);

  return (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayDate}>{dateLabel}</Text>
        <Text style={styles.dayCount}>{record.completions.length} tasks</Text>
      </View>

      {moods.length > 0 && (
        <View style={styles.moodRow}>
          {moods.map((mood, i) => (
            <Text key={i} style={styles.moodEmoji}>{MOOD_EMOJI[mood]}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1, width: '100%' },
  content: { padding: spacing.base, paddingBottom: spacing.xxl, width: '100%' },
  title: {
    ...typography.display,
    color: colors.ink,
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  summaryCard: {
    backgroundColor: '#EEF1FC',
    borderRadius: radii.card,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryEmoji: { fontSize: 28 },
  summaryText: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
    flex: 1,
  },
  empty: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.base,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    overflow: 'visible',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayDate: {
    ...typography.label,
    color: colors.ink,
    fontSize: 14,
  },
  dayCount: {
    ...typography.caption,
    color: colors.muted,
  },
  moodRow: { flexDirection: 'row', gap: spacing.sm },
  moodEmoji: { fontSize: 20 },
});
