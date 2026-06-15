import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors, radii, spacing, typography } from '../theme';
import { completePetOnboarding } from '../store';
import { AppState } from '../types';

interface Props {
  onComplete: (state: AppState) => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const [step, setStep] = useState<'name' | 'ready'>('name');
  const [state, setState] = useState<AppState | null>(null);

  const handleNameSubmit = async () => {
    if (!name.trim()) return;
    const next = await completePetOnboarding(name.trim());
    setState(next);
    setStep('ready');
  };

  if (step === 'ready' && state) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={styles.readyContainer}>
          <Text style={styles.paw}>🐾</Text>
          <Text style={[styles.readyTitle, { color: colors.ink }]}>{t('ready.title', { name: name.trim() })}</Text>
          <Text style={[styles.readySubtitle, { color: colors.muted }]}>{t('ready.subtitle')}</Text>
          <Pressable style={[styles.ctaButton, { backgroundColor: colors.primary }]} onPress={() => onComplete(state)}>
            <Text style={[styles.ctaText, { color: colors.white }]}>{t('ready.cta')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.safe, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.paw}>🐕</Text>
          <Text style={[styles.title, { color: colors.ink }]}>{t('onboarding.title')}</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.primary, color: colors.ink }]}
            placeholder={t('onboarding.placeholder')}
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleNameSubmit}
            returnKeyType="done"
            autoFocus
            autoCorrect={false}
          />
          <Pressable
            style={[styles.ctaButton, { backgroundColor: colors.primary }, !name.trim() && styles.ctaDisabled]}
            onPress={handleNameSubmit}
            disabled={!name.trim()}
          >
            <Text style={[styles.ctaText, { color: colors.white }]}>
              {name.trim()
                ? t('onboarding.cta', { name: name.trim() })
                : t('onboarding.ctaDefault')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  readyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  paw: { fontSize: 56 },
  title: {
    ...typography.display,
    textAlign: 'center',
  },
  readyTitle: {
    ...typography.display,
    textAlign: 'center',
  },
  readySubtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    ...typography.body,
    textAlign: 'center',
  },
  ctaButton: {
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: {
    ...typography.body,
    fontWeight: '700',
  },
});
