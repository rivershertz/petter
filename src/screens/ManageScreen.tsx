import React, { useState } from 'react';
import {
  Alert, Pressable, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors, radii, spacing, typography } from '../theme';
import { AppState, SlotId } from '../types';
import { addCustomTask, removeTask, renameTask, setSlotNotificationTime } from '../store';

const SLOT_ORDER: SlotId[] = ['morning', 'afternoon', 'evening'];

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

interface Props {
  appState: AppState;
  onStateChange: (state: AppState) => void;
  onNavigateSettings: () => void;
}

export function ManageScreen({ appState, onStateChange, onNavigateSettings }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('manage.title')}</Text>

        {SLOT_ORDER.map((slotId) => {
          const slotTasks = appState.tasks.filter(t => t.slotId === slotId);
          const slot = appState.slots.find(s => s.id === slotId);
          const isEditingTime = editingTimeSlot === slotId;
          return (
            <View key={slotId} style={styles.slotSection}>
              <View style={styles.slotHeaderRow}>
                <Text style={[styles.slotLabel, { color: colors.primary }]}>{t(`slots.${slotId}`)}</Text>
                {slot && !isEditingTime && (
                  <Pressable
                    style={[styles.timePill, { backgroundColor: colors.surface }]}
                    onPress={() => handleStartTimeEdit(slotId, slot.notificationHour, slot.notificationMinute)}
                    accessibilityLabel={t('manage.notificationTimeLabel', {
                      time: formatTime(slot.notificationHour, slot.notificationMinute),
                    })}
                  >
                    <Text style={styles.timePillIcon}>🔔</Text>
                    <Text style={[styles.timePillText, { color: colors.muted }]}>
                      {formatTime(slot.notificationHour, slot.notificationMinute)}
                    </Text>
                  </Pressable>
                )}
              </View>

              {isEditingTime && (
                <View style={[styles.timeEditor, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.timeEditorLabel, { color: colors.ink }]}>{t('manage.notificationTime')}</Text>
                  <View style={styles.steppers}>
                    <Stepper
                      value={tempHour}
                      onDecrement={() => adjustHour(-1)}
                      onIncrement={() => adjustHour(1)}
                      label={t('manage.hour')}
                      colors={colors}
                    />
                    <Text style={[styles.timeColon, { color: colors.ink }]}>:</Text>
                    <Stepper
                      value={tempMinute}
                      onDecrement={() => adjustMinute(-5)}
                      onIncrement={() => adjustMinute(5)}
                      label={t('manage.minute')}
                      colors={colors}
                    />
                  </View>
                  <View style={styles.addFormButtons}>
                    <Pressable style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setEditingTimeSlot(null)}>
                      <Text style={[styles.cancelBtnText, { color: colors.muted }]}>{t('manage.cancel')}</Text>
                    </Pressable>
                    <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSaveTime}>
                      <Text style={[styles.saveBtnText, { color: colors.white }]}>{t('manage.save')}</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {slotTasks.map(task => {
                const label = labelFor(task);
                if (editingTaskId === task.id) {
                  return (
                    <View key={task.id} style={[styles.addForm, { backgroundColor: colors.surface }]}>
                      <TextInput
                        style={[styles.input, { borderColor: colors.primary, color: colors.ink }]}
                        value={editName}
                        onChangeText={setEditName}
                        onSubmitEditing={handleSaveEdit}
                        returnKeyType="done"
                        autoFocus
                      />
                      <View style={styles.addFormButtons}>
                        <Pressable
                          style={[styles.cancelBtn, { borderColor: colors.border }]}
                          onPress={() => { setEditingTaskId(null); setEditName(''); }}
                        >
                          <Text style={[styles.cancelBtnText, { color: colors.muted }]}>{t('manage.cancel')}</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.saveBtn, !editName.trim() && styles.saveBtnDisabled, { backgroundColor: colors.primary }]}
                          onPress={handleSaveEdit}
                          disabled={!editName.trim()}
                        >
                          <Text style={[styles.saveBtnText, { color: colors.white }]}>{t('manage.save')}</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                }
                return (
                  <View key={task.id} style={[styles.taskRow, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.taskLabel, { color: colors.ink }]} numberOfLines={1}>{label}</Text>
                    <Pressable
                      onPress={() => handleStartEdit(task.id, label)}
                      style={styles.iconBtn}
                      accessibilityLabel={t('manage.renameTask', { task: label })}
                    >
                      <Text style={[styles.editBtnText, { color: colors.primary }]}>✎</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemoveTask(task.id, label)}
                      style={styles.iconBtn}
                      accessibilityLabel={t('manage.removeTaskLabel', { task: label })}
                    >
                      <Text style={[styles.removeBtnText, { color: colors.muted }]}>✕</Text>
                    </Pressable>
                  </View>
                );
              })}

              {addingToSlot === slotId ? (
                <View style={[styles.addForm, { backgroundColor: colors.surface }]}>
                  <TextInput
                    style={[styles.input, { borderColor: colors.primary, color: colors.ink }]}
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
                      style={[styles.cancelBtn, { borderColor: colors.border }]}
                      onPress={() => { setAddingToSlot(null); setNewTaskName(''); }}
                    >
                      <Text style={[styles.cancelBtnText, { color: colors.muted }]}>{t('manage.cancel')}</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.saveBtn, !newTaskName.trim() && styles.saveBtnDisabled, { backgroundColor: colors.primary }]}
                      onPress={handleAddTask}
                      disabled={!newTaskName.trim()}
                    >
                      <Text style={[styles.saveBtnText, { color: colors.white }]}>{t('manage.save')}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={[styles.addBtn, { borderColor: colors.primary }]}
                  onPress={() => { setAddingToSlot(slotId); setEditingTaskId(null); }}
                >
                  <Text style={[styles.addBtnText, { color: colors.primary }]}>+ {t('manage.addTask')}</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        <Pressable
          style={[styles.settingsRow, { backgroundColor: colors.surface }]}
          onPress={onNavigateSettings}
          accessibilityRole="button"
          accessibilityLabel={t('manage.settingsRow')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
          <Text style={[styles.settingsLabel, { color: colors.ink }]}>{t('manage.settingsRow')}</Text>
          <Text style={[styles.settingsChevron, { color: colors.muted }]}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stepper({
  value, onDecrement, onIncrement, label, colors,
}: {
  value: number; onDecrement: () => void; onIncrement: () => void; label: string;
  colors: { primary: string; ink: string };
}) {
  return (
    <View style={styles.stepper}>
      <Pressable style={[styles.stepperBtn, { borderColor: colors.primary }]} onPress={onDecrement} accessibilityLabel={`${label} −`}>
        <Text style={[styles.stepperBtnText, { color: colors.primary }]}>−</Text>
      </Pressable>
      <Text style={[styles.stepperValue, { color: colors.ink }]}>{String(value).padStart(2, '0')}</Text>
      <Pressable style={[styles.stepperBtn, { borderColor: colors.primary }]} onPress={onIncrement} accessibilityLabel={`${label} +`}>
        <Text style={[styles.stepperBtnText, { color: colors.primary }]}>+</Text>
      </Pressable>
    </View>
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
    textTransform: 'capitalize',
    fontSize: 15,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  timePillIcon: { fontSize: 13 },
  timePillText: {
    ...typography.label,
  },
  timeEditor: {
    borderRadius: radii.card,
    padding: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  timeEditorLabel: {
    ...typography.label,
  },
  steppers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  timeColon: {
    ...typography.heading,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26,
  },
  stepperValue: {
    ...typography.heading,
    minWidth: 36,
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
  },
  removeBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    borderWidth: 1.5,
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
  },
  addForm: {
    borderRadius: radii.card,
    padding: spacing.base,
    gap: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    ...typography.body,
    minHeight: 44,
  },
  addFormButtons: { flexDirection: 'row', gap: spacing.sm },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelBtnText: { ...typography.label },
  saveBtn: {
    flex: 1,
    borderRadius: radii.button,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...typography.label },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.card,
    padding: spacing.base,
    marginTop: spacing.lg,
    minHeight: 52,
    gap: spacing.md,
  },
  settingsIcon: {
    fontSize: 20,
  },
  settingsLabel: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  settingsChevron: {
    fontSize: 24,
    fontWeight: '300',
  },
});
