import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors, radii, spacing, typography } from "../theme";
import { DayRecord, Reflection, SlotId, Task } from "../types";
import { isReflectionResponded, isTaskCompleted } from "../store";
import { TaskItem } from "./TaskItem";
import { ReflectionCard } from "./ReflectionCard";

type SlotState = "active" | "past" | "future";

interface Props {
  slotId: SlotId;
  slotState: SlotState;
  tasks: Task[];
  reflection?: Reflection;
  dayRecord: DayRecord;
  petName: string;
  onTaskComplete: (taskId: string) => void;
  onReflectionSelect: (
    reflectionId: string,
    mood: import("../types").Mood,
  ) => void;
}

const SLOT_ICONS: Record<SlotId, string> = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌙",
};

export function SlotSection({
  slotId,
  slotState,
  tasks,
  reflection,
  dayRecord,
  petName,
  onTaskComplete,
  onReflectionSelect,
}: Props) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const isActive = slotState === "active";
  const isPast = slotState === "past";
  const isFuture = slotState === "future";

  const completedCount = tasks.filter((t) =>
    isTaskCompleted(dayRecord, t.id),
  ).length;
  const allDone = completedCount === tasks.length && tasks.length > 0;

  const headerBg = isActive
    ? colors.primary
    : isPast
      ? colors.pastSlotHeaderBg
      : colors.surface;
  const headerTextColor = isActive
    ? colors.white
    : isPast
      ? colors.ink
      : colors.muted;
  const containerOpacity = isFuture ? 0.45 : 1;

  return (
    <View style={[styles.container, { opacity: containerOpacity, backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <Text style={styles.icon}>{SLOT_ICONS[slotId]}</Text>
        <Text style={[styles.slotName, { color: headerTextColor }]}>
          {t(`slots.${slotId}`)}
        </Text>
        {allDone && (
          <Text
            style={[
              styles.allDoneBadge,
              { backgroundColor: colors.white, color: colors.primary },
              !isActive && { backgroundColor: colors.primary, color: colors.white },
            ]}
          >
            ✓
          </Text>
        )}
        {!isFuture && (
          <Text
            style={[
              styles.count,
              { color: isActive ? colors.activeSlotCountColor : colors.muted },
            ]}
          >
            {completedCount}/{tasks.length}
          </Text>
        )}
      </View>

      <View style={styles.body}>
        {tasks.map((task) => {
          const taskLabel = task.isCustom
            ? task.label
            : t(task.label, { name: petName });
          return (
            <TaskItem
              key={task.id}
              label={taskLabel}
              completed={isTaskCompleted(dayRecord, task.id)}
              disabled={isFuture}
              onComplete={() => onTaskComplete(task.id)}
            />
          );
        })}

        {reflection && !isFuture && (
          <ReflectionCard
            prompt={t(reflection.prompt)}
            selectedMood={
              dayRecord.reflectionResponses.find(
                (r) => r.reflectionId === reflection.id,
              )?.mood
            }
            onSelect={(mood) => onReflectionSelect(reflection.id, mood)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.card,
    overflow: "hidden",
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  icon: { fontSize: 18 },
  slotName: {
    ...typography.label,
    fontSize: 15,
    flex: 1,
    textTransform: "capitalize",
  },
  count: {
    ...typography.caption,
    fontWeight: "600",
  },
  allDoneBadge: {
    fontWeight: "700",
    fontSize: 12,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    overflow: "hidden",
  },
  body: {
    padding: spacing.base,
    paddingTop: spacing.sm,
  },
});
