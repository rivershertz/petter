import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Slot, SlotId } from '../types';

// Notifications fire when a Slot opens (PRODUCT.md — Slot). Reminders are gentle
// invitations to a ritual, never demands — sound off, no badge, no failure cue.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const ANDROID_CHANNEL = 'slot-reminders';

export async function ensureNotificationSetup(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let granted =
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  if (!granted && current.canAskAgain) {
    const requested = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    });
    granted =
      requested.granted ||
      requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  }

  if (granted && Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL, {
      name: 'Slot reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return granted;
}

type SlotContent = { title: string; body: string };

// Cancel and re-create the per-slot daily reminders. Called on launch and
// whenever a Slot's notification time changes, so scheduling stays in sync with
// the data model.
export async function rescheduleSlotNotifications(
  slots: Slot[],
  contentFor: (slotId: SlotId) => SlotContent,
): Promise<void> {
  const granted = await ensureNotificationSetup();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const slot of slots) {
    const { title, body } = contentFor(slot.id);
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: slot.notificationHour,
        minute: slot.notificationMinute,
        ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL } : {}),
      },
    });
  }
}
