import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFonts, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

import './src/i18n';
import { loadState, reconcileMisses } from './src/store';
import { rescheduleSlotNotifications } from './src/notifications';
import { AppState, SlotId } from './src/types';
import { colors, spacing } from './src/theme';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ManageScreen } from './src/screens/ManageScreen';

const Tab = createBottomTabNavigator();
const TAB_BAR_HEIGHT = 60;

function AppTabs({ appState, onStateChange }: { appState: AppState; onStateChange: (s: AppState) => void }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarAccessibilityLabel: t(`tabs.${route.name.toLowerCase()}`),
          tabBarIcon: ({ focused }) => (
            <Text
              style={styles.tabIconEmoji}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {TAB_ICONS[route.name] ?? ''}
            </Text>
          ),
          tabBarLabel: ({ focused }) => (
            <View style={styles.tabLabelWrap}>
              <Text style={[
                styles.tabLabel,
                { color: focused ? colors.primary : colors.muted },
              ]}>
                {t(`tabs.${route.name.toLowerCase()}`)}
              </Text>
              <View style={[
                styles.tabDot,
                focused && styles.tabDotActive,
              ]} />
            </View>
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.border,
            paddingTop: spacing.xs,
            height: TAB_BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
          },
        })}
      >
        <Tab.Screen name="Today">
          {() => <TodayScreen appState={appState} onStateChange={onStateChange} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <HistoryScreen appState={appState} />}
        </Tab.Screen>
        <Tab.Screen name="Manage">
          {() => <ManageScreen appState={appState} onStateChange={onStateChange} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const TAB_ICONS: Record<string, string> = {
  Today: '🐾',
  History: '📖',
  Manage: '⚙️',
};

const styles = StyleSheet.create({
  tabIconEmoji: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  tabLabelWrap: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 3,
    backgroundColor: 'transparent',
  },
  tabDotActive: {
    backgroundColor: colors.primary,
  },
});

export default function App() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({ Nunito_700Bold, Nunito_800ExtraBold });

  useEffect(() => {
    loadState()
      .then(reconcileMisses) // ADR 0001 — capture slots that closed while away
      .then(setAppState);
  }, []);

  // Keep the daily slot reminders in sync with the data model: schedule on
  // launch and reschedule whenever a slot's time (or the pet name) changes.
  useEffect(() => {
    if (!appState?.onboardingComplete || !appState.pet) return;
    const petName = appState.pet.name;
    rescheduleSlotNotifications(appState.slots, (slotId: SlotId) => ({
      title: t(`notifications.${slotId}.title`),
      body: t(`notifications.${slotId}.body`, { name: petName }),
    }));
  }, [appState?.slots, appState?.pet?.name, appState?.onboardingComplete]);

  if (!appState || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!appState.onboardingComplete) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onComplete={setAppState} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppTabs appState={appState} onStateChange={setAppState} />
    </SafeAreaProvider>
  );
}
