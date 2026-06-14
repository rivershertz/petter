import React, { useState } from 'react';
import {
  Alert, Pressable, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radii, spacing, typography } from '../theme';
import { AppState, SlotId } from '../types';
import { addCustomTask, removeTask, renameTask, setSlotNotificationTime } from '../store';

const SLOT_ORDER: SlotId[] = ['morning', 'afternoon', 'evening'];

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

interface Props {
  appState: AppState;
  onStateChange: (state: AppState) => void;
}

export function ManageScreen({ appState, onStateChange }: Props) {
  const { t } = useTranslation();
  const [addingToSlot, setAddingToSlot] = useState<SlotId | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingTimeSlot, setEditingTimeSlot] = useState<SlotId | null>(null);
  const [tempHour, setTempHour] = useState(0);
  const [tempMinute, setTempMinute] = useState(0);
  const petName = appState.pet?.name ?? '';

  const labelFor = (task: AppState['tasks'][number]) =>
    task.isCustom ? task.label : t(task.label, { name: petName });

  const handleAddTask = async () => {
    if (!newTaskName.trim() || !addingToSlot) return;
    const next = await addCustomTask(appState, newTaskName.trim(), addingToSlot);
    onStateChange(next);
    setNewTaskName('');
    setAddingToSlot(null);
  };

  const handleStartEdit = (taskId: string, currentLabel: string) => {
    setEditingTaskId(taskId);
    setEditName(currentLabel);
    setAddingToSlot(null);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editingTaskId) return;
    const next = await renameTask(appState, editingTaskId, editName.trim());
    onStateChange(next);
    setEditingTaskId(null);
    setEditName('');
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

  const handleStartTimeEdit = (slotId: SlotId, hour: number, minute: number) => {
    setEditingTimeSlot(slotId);
    setTempHour(hour);
    setTempMinute(minute);
  };

  const handleSaveTime = async () => {
    if (!editingTimeSlot) return;
    const next = await setSlotNotificationTime(appState, editingTimeSlot, tempHour, tempMinute);
    onStateChange(next);
    setEditingTimeSlot(null);
  };

  const adjustHour = (delta: number) => setTempHour(h => (h + delta + 24) % 24);
  const adjustMinute = (delta: number) => setTempMinute(m => (m + delta + 60) % 60);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('manage.title')}</Text>

        {SLOT_ORDER.map((slotId) => {
          const slotTasks = appState.tasks.filter(t => t.slotId === slotId);
          const slot = appState.slots.find(s => s.id === slotId);
          const isEditingTime = editingTimeSlot === slotId;
          return (
            <View key={slotId} style={styles.slotSection}>
              <View style={styles.slotHeaderRow}>
                <Text style={styles.slotLabel}>{t(`slots.${slotId}`)}</Text>
                {slot && !isEditingTime && (
                  <Pressable
                    style={styles.timePill}
                    onPress={() => handleStartTimeEdit(slotId, slot.notificationHour, slot.notificationMinute)}
                    accessibilityLabel={t('manage.notificationTimeLabel', {
                      time: formatTime(slot.notificationHour, slot.notificationMinute),
                    })}
                  >
                    <Text style={styles.timePillIcon}>🔔</Text>
                    <Text style={styles.timePillText}>
                      {formatTime(slot.notificationHour, slot.notificationMinute)}
                    </Text>
                  </Pressable>
                )}
              </View>

              {isEditingTime && (
                <View style={styles.timeEditor}>
                  <Text style={styles.timeEditorLabel}>{t('manage.notificationTime')}</Text>
                  <View style={styles.steppers}>
                    <Stepper
                      value={tempHour}
                      onDecrement={() => adjustHour(-1)}
                      onIncrement={() => adjustHour(1)}
                      label={t('manage.hour')}
                    />
                    <Text style={styles.timeColon}>:</Text>
                    <Stepper
                      value={tempMinute}
                      onDecrement={() => adjustMinute(-5)}
                      onIncrement={() => adjustMinute(5)}
                      label={t('manage.minute')}
                    />
                  </View>
                  <View style={styles.addFormButtons}>
                    <Pressable style={styles.cancelBtn} onPress={() => setEditingTimeSlot(null)}>
                      <Text style={styles.cancelBtnText}>{t('manage.cancel')}</Text>
                    </Pressable>
                    <Pressable style={styles.saveBtn} onPress={handleSaveTime}>
                      <Text style={styles.saveBtnText}>{t('manage.save')}</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {slotTasks.map(task => {
                const label = labelFor(task);
                if (editingTaskId === task.id) {
                  return (
                    <View key={task.id} style={styles.addForm}>
                      <TextInput
                        style={styles.input}
                        value={editName}
                        onChangeText={setEditName}
                        onSubmitEditing={handleSaveEdit}
                        returnKeyType="done"
                        autoFocus
                      />
                      <View style={styles.addFormButtons}>
                        <Pressable
                          style={styles.cancelBtn}
                          onPress={() => { setEditingTaskId(null); setEditName(''); }}
                        >
                          <Text style={styles.cancelBtnText}>{t('manage.cancel')}</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.saveBtn, !editName.trim() && styles.saveBtnDisabled]}
                          onPress={handleSaveEdit}
                          disabled={!editName.trim()}
                        >
                          <Text style={styles.saveBtnText}>{t('manage.save')}</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                }
                return (
                  <View key={task.id} style={styles.taskRow}>
                    <Text style={styles.taskLabel} numberOfLines={1}>{label}</Text>
                    <Pressable
                      onPress={() => handleStartEdit(task.id, label)}
                      style={styles.iconBtn}
                      accessibilityLabel={t('manage.renameTask', { task: label })}
                    >
                      <Text style={styles.editBtnText}>✎</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemoveTask(task.id, label)}
                      style={styles.iconBtn}
                      accessibilityLabel={t('manage.removeTaskLabel', { task: label })}
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
                  onPress={() => { setAddingToSlot(slotId); setEditingTaskId(null); }}
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

function Stepper({
  value, onDecrement, onIncrement, label,
}: {
  value: number; onDecrement: () => void; onIncrement: () => void; label: string;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepperBtn} onPress={onDecrement} accessibilityLabel={`${label} −`}>
        <Text style={styles.stepperBtnText}>−</Text>
      </Pressable>
      <Text style={styles.stepperValue}>{String(value).padStart(2, '0')}</Text>
      <Pressable style={styles.stepperBtn} onPress={onIncrement} accessibilityLabel={`${label} +`}>
        <Text style={styles.stepperBtnText}>+</Text>
      </Pressable>
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
  slotSection: {
    marginBottom: spacing.lg,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  slotLabel: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'capitalize',
    fontSize: 15,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  timePillIcon: { fontSize: 13 },
  timePillText: {
    ...typography.label,
    color: colors.muted,
  },
  timeEditor: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  timeEditorLabel: {
    ...typography.label,
    color: colors.ink,
  },
  steppers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  timeColon: {
    ...typography.heading,
    color: colors.ink,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26,
  },
  stepperValue: {
    ...typography.heading,
    color: colors.ink,
    minWidth: 36,
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.task,
    paddingVertical: spacing.xs,
    paddingStart: spacing.base,
    paddingEnd: spacing.xs,
    marginBottom: spacing.xs,
    gap: spacing.xs,
    minHeight: 52,
  },
  taskLabel: {
    ...typography.body,
    color: colors.ink,
    flex: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  removeBtnText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: radii.task,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    marginTop: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
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
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colors.ink,
    minHeight: 44,
  },
  addFormButtons: { flexDirection: 'row', gap: spacing.sm },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelBtnText: { ...typography.label, color: colors.muted },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...typography.label, color: colors.white },
});
