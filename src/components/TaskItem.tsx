import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors, radii, spacing, typography } from '../theme';

interface Props {
  label: string;
  completed: boolean;
  disabled?: boolean;
  onComplete: () => void;
}

export function TaskItem({ label, completed, disabled, onComplete }: Props) {
  const colors = useThemeColors();
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

    Animated.sequence([
      Animated.timing(scale, { toValue: 1.04, duration: 120, useNativeDriver: false }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: false }),
    ]).start();

    onComplete();
  };

  const bgColor = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, colors.completedTaskBg],
  });

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: completed, disabled }}
      style={({ pressed }) => [styles.pressable, pressed && !completed && styles.pressed]}
    >
      <Animated.View style={[styles.container, { backgroundColor: bgColor, transform: [{ scale }] }]}>
        <View style={[styles.check, { borderColor: colors.primary, backgroundColor: colors.bg }, completed && { backgroundColor: colors.primary }]}>
          {completed && <Text style={[styles.checkmark, { color: colors.white }]}>✓</Text>}
        </View>
        <Text style={[styles.label, { color: colors.ink }, completed && { color: colors.primary, opacity: 0.55 }]} numberOfLines={1}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    ...typography.body,
    flex: 1,
  },
});
