import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radii, spacing, typography } from '../theme';
import { Mood } from '../types';

const MOODS: Mood[] = ['happy', 'calm', 'anxious', 'tired', 'connected'];

interface Props {
  prompt: string;
  selectedMood?: Mood;
  onSelect: (mood: Mood) => void;
}

export function ReflectionCard({ prompt, selectedMood, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => (
          <MoodChip
            key={mood}
            mood={mood}
            emoji={t(`moodEmoji.${mood}`)}
            label={t(`moods.${mood}`)}
            selected={selectedMood === mood}
            onPress={() => onSelect(mood)}
          />
        ))}
      </View>
    </View>
  );
}

function MoodChip({
  mood, emoji, label, selected, onPress,
}: {
  mood: Mood; emoji: string; label: string; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEF0EB',
    borderRadius: radii.card,
    padding: spacing.base,
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  prompt: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.white,
    gap: 2,
    minWidth: 56,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  emoji: {
    fontSize: 20,
  },
  chipLabel: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    textAlign: 'center',
  },
  chipLabelSelected: {
    color: colors.white,
  },
});
