import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

interface Props {
  label: string;
  completed: boolean;
  disabled?: boolean;
  onComplete: () => void;
}

export function TaskItem({ label, completed, disabled, onComplete }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const fill = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: completed ? 1 : 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [completed]);

  const handlePress = () => {
    if (completed || disabled) return;

    // Scale pulse then complete
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();

    onComplete();
  };

  const bgColor = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, '#D4DBF2'],
  });

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed, disabled }}
      style={({ pressed }) => [styles.pressable, pressed && !completed && styles.pressed]}
    >
      <Animated.View style={[styles.container, { backgroundColor: bgColor, transform: [{ scale }] }]}>
        <View style={[styles.check, completed && styles.checkDone]}>
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.label, completed && styles.labelDone]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { marginVertical: spacing.xs },
  pressed: { opacity: 0.85 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.task,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    minHeight: 52,
    gap: spacing.md,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    ...typography.body,
    color: colors.ink,
    flex: 1,
  },
  labelDone: {
    color: colors.primary,
    opacity: 0.55,
  },
});
