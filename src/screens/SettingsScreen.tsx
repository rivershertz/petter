import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors, radii, spacing, typography } from '../theme';
import { AppState, ThemePreference } from '../types';
import { setThemePreference } from '../store';

const THEME_OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];

const THEME_I18N_KEY: Record<ThemePreference, string> = {
  light: 'settings.themeLight',
  dark: 'settings.themeDark',
  system: 'settings.themeSystem',
};

interface Props {
  appState: AppState;
  onStateChange: (state: AppState) => void;
}

export function SettingsScreen({ appState, onStateChange }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const current = appState.themePreference;

  const handleThemeChange = async (preference: ThemePreference) => {
    if (preference === current) return;
    const next = await setThemePreference(appState, preference);
    onStateChange(next);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('settings.title')}</Text>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.muted }]}>{t('settings.appearance')}</Text>

          <Text style={[styles.fieldLabel, { color: colors.ink }]}>{t('settings.theme')}</Text>
          <View style={[styles.segmentedControl, { backgroundColor: colors.border }]}>
            {THEME_OPTIONS.map((option) => {
              const isActive = option === current;
              return (
                <Pressable
                  key={option}
                  style={[
                    styles.segment,
                    isActive && { backgroundColor: colors.primary },
                    !isActive && { backgroundColor: 'transparent' },
                  ]}
                  onPress={() => handleThemeChange(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={t(THEME_I18N_KEY[option])}
                >
                  <Text style={[
                    styles.segmentText,
                    { color: isActive ? colors.white : colors.ink },
                  ]}>
                    {t(THEME_I18N_KEY[option])}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1, width: '100%' },
  content: { padding: spacing.base, paddingBottom: spacing.xxl, width: '100%' },
  title: {
    ...typography.display,
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  section: {
    borderRadius: radii.card,
    padding: spacing.base,
    gap: spacing.md,
  },
  sectionHeader: {
    ...typography.label,
    textTransform: 'uppercase',
  },
  fieldLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: radii.button,
    padding: 3,
  },
  segment: {
    flex: 1,
    borderRadius: radii.button - 2,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentText: {
    ...typography.label,
    fontSize: 14,
  },
});
