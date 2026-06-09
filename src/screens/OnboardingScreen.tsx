import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radii, spacing, typography } from '../theme';
import { completePetOnboarding } from '../store';
import { AppState } from '../types';

interface Props {
  onComplete: (state: AppState) => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const { t } = useTranslation();
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.readyContainer}>
          <Text style={styles.paw}>🐾</Text>
          <Text style={styles.readyTitle}>{t('ready.title', { name: name.trim() })}</Text>
          <Text style={styles.readySubtitle}>{t('ready.subtitle')}</Text>
          <Pressable style={styles.ctaButton} onPress={() => onComplete(state)}>
            <Text style={styles.ctaText}>{t('ready.cta')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.paw}>🐕</Text>
          <Text style={styles.title}>{t('onboarding.title')}</Text>
          <TextInput
            style={styles.input}
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
            style={[styles.ctaButton, !name.trim() && styles.ctaDisabled]}
            onPress={handleNameSubmit}
            disabled={!name.trim()}
          >
            <Text style={styles.ctaText}>
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
  safe: { flex: 1, backgroundColor: colors.bg },
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
    color: colors.ink,
    textAlign: 'center',
  },
  readyTitle: {
    ...typography.display,
    color: colors.ink,
    textAlign: 'center',
  },
  readySubtitle: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colors.ink,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: colors.primary,
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
    color: colors.white,
  },
});
