import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors, radii, spacing, typography } from '../theme';
import { Mood } from '../types';

const MOODS: Mood[] = ['happy', 'calm', 'anxious', 'tired', 'connected'];

interface Props {
  prompt: string;
  selectedMood?: Mood;
  onSelect: (mood: Mood) => void;
}

export function ReflectionCard({ prompt, selectedMood, onSelect }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.reflectionCardBg }]}>
      <Text style={[styles.prompt, { color: colors.ink }]}>{prompt}</Text>
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
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        { borderColor: colors.accent, backgroundColor: colors.bg },
        selected && { backgroundColor: colors.accent },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[
        styles.chipLabel,
        { color: colors.accent },
        selected && { color: colors.white },
      ]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: spacing.base,
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  prompt: {
    ...typography.body,
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
    gap: 2,
    minWidth: 56,
    minHeight: 44,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  chipLabel: {
    ...typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
});
