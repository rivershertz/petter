import React, { useState } from 'react';
import {
  Alert, Pressable, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radii, spacing, typography } from '../theme';
import { AppState, SlotId } from '../types';
import { addCustomTask, removeTask } from '../store';

const SLOT_ORDER: SlotId[] = ['morning', 'afternoon', 'evening'];

interface Props {
  appState: AppState;
  onStateChange: (state: AppState) => void;
}

export function ManageScreen({ appState, onStateChange }: Props) {
  const { t } = useTranslation();
  const [addingToSlot, setAddingToSlot] = useState<SlotId | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const petName = appState.pet?.name ?? '';

  const handleAddTask = async () => {
    if (!newTaskName.trim() || !addingToSlot) return;
    const next = await addCustomTask(appState, newTaskName.trim(), addingToSlot);
    onStateChange(next);
    setNewTaskName('');
    setAddingToSlot(null);
  };

  const handleRemoveTask = (taskId: string, label: string) => {
    Alert.alert(
      t('manage.deleteTask'),
      label,
      [
        { text: t('manage.cancel'), style: 'cancel' },
        {
          text: t('manage.deleteTask'),
          style: 'destructive',
          onPress: async () => {
            const next = await removeTask(appState, taskId);
            onStateChange(next);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('manage.title')}</Text>

        {SLOT_ORDER.map((slotId) => {
          const slotTasks = appState.tasks.filter(t => t.slotId === slotId);
          return (
            <View key={slotId} style={styles.slotSection}>
              <Text style={styles.slotLabel}>{t(`slots.${slotId}`)}</Text>

              {slotTasks.map(task => {
                const label = task.isCustom
                  ? task.label
                  : t(task.label, { name: petName });
                return (
                  <View key={task.id} style={styles.taskRow}>
                    <Text style={styles.taskLabel} numberOfLines={1}>{label}</Text>
                    <Pressable
                      onPress={() => handleRemoveTask(task.id, label)}
                      style={styles.removeBtn}
                      accessibilityLabel={t('manage.deleteTask')}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </Pressable>
                  </View>
                );
              })}

              {addingToSlot === slotId ? (
                <View style={styles.addForm}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('manage.taskNamePlaceholder')}
                    placeholderTextColor={colors.muted}
                    value={newTaskName}
                    onChangeText={setNewTaskName}
                    onSubmitEditing={handleAddTask}
                    returnKeyType="done"
                    autoFocus
                  />
                  <View style={styles.addFormButtons}>
                    <Pressable
                      style={styles.cancelBtn}
                      onPress={() => { setAddingToSlot(null); setNewTaskName(''); }}
                    >
                      <Text style={styles.cancelBtnText}>{t('manage.cancel')}</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.saveBtn, !newTaskName.trim() && styles.saveBtnDisabled]}
                      onPress={handleAddTask}
                      disabled={!newTaskName.trim()}
                    >
                      <Text style={styles.saveBtnText}>{t('manage.save')}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={styles.addBtn}
                  onPress={() => setAddingToSlot(slotId)}
                >
                  <Text style={styles.addBtnText}>+ {t('manage.addTask')}</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
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
  slotSection: {
    marginBottom: spacing.lg,
  },
  slotLabel: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.task,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  taskLabel: {
    ...typography.body,
    color: colors.ink,
    flex: 1,
  },
  removeBtn: {
    padding: spacing.xs,
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  removeBtnText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: radii.task,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addBtnText: {
    ...typography.label,
    color: colors.primary,
  },
  addForm: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.base,
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colors.ink,
  },
  addFormButtons: { flexDirection: 'row', gap: spacing.sm },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  cancelBtnText: { ...typography.label, color: colors.muted },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...typography.label, color: colors.white },
});
