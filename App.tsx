import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import './src/i18n';
import { loadState } from './src/store';
import { AppState } from './src/types';
import { colors, spacing } from './src/theme';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ManageScreen } from './src/screens/ManageScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Today: '🐾',
  History: '📖',
  Manage: '⚙️',
};

export default function App() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadState().then(setAppState);
  }, []);

  if (!appState) {
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
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 18, lineHeight: 22 }}>{TAB_ICONS[route.name] ?? ''}</Text>
            ),
            tabBarLabel: ({ color }) => (
              <Text style={{ fontSize: 11, fontWeight: '600', color, marginBottom: spacing.xs }}>
                {t(`tabs.${route.name.toLowerCase()}`)}
              </Text>
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
            tabBarStyle: {
              backgroundColor: colors.white,
              borderTopColor: colors.border,
              paddingTop: spacing.xs,
              height: 60,
            },
          })}
        >
          <Tab.Screen name="Today">
            {() => <TodayScreen appState={appState} onStateChange={setAppState} />}
          </Tab.Screen>
          <Tab.Screen name="History">
            {() => <HistoryScreen appState={appState} />}
          </Tab.Screen>
          <Tab.Screen name="Manage">
            {() => <ManageScreen appState={appState} onStateChange={setAppState} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
