import React, { createContext, useContext, useMemo } from 'react';
import { I18nManager, TextStyle, useColorScheme } from 'react-native';
import { isRTL } from '../i18n';
import { ThemePreference } from '../types';

export interface ColorPalette {
  primary: string;
  accent: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  slotPast: string;
  slotFuture: string;
  celebrationPeach: string;
  celebrationSage: string;
  celebrationSky: string;
  celebrationYellow: string;
  white: string;
  border: string;
  completedTaskBg: string;
  pastSlotHeaderBg: string;
  reflectionCardBg: string;
  summaryCardBg: string;
  taskChipBg: string;
  celebrationOverlayBg: string;
  activeSlotCountColor: string;
  scrim: string;
}

const lightColors: ColorPalette = {
  primary: '#5B6BC8',
  accent: '#E07050',
  bg: '#FFFFFF',
  surface: '#F2F4FD',
  ink: '#1E1F30',
  muted: '#6B6D82',
  slotPast: '#B8BAD0',
  slotFuture: '#D4D6E8',
  celebrationPeach: '#F5C4A8',
  celebrationSage: '#B8D9B0',
  celebrationSky: '#BEC7F0',
  celebrationYellow: '#F5E5A0',
  white: '#FFFFFF',
  border: '#E8EAF4',
  completedTaskBg: '#D4DBF2',
  pastSlotHeaderBg: '#EFF1FA',
  reflectionCardBg: '#FEF0EB',
  summaryCardBg: '#EEF1FC',
  taskChipBg: '#EEF1FC',
  celebrationOverlayBg: 'rgba(255,255,255,0.7)',
  activeSlotCountColor: 'rgba(255,255,255,0.75)',
  scrim: 'rgba(0,0,0,0.4)',
};

const darkColors: ColorPalette = {
  primary: '#7B8CE0',
  accent: '#E8805E',
  bg: '#181A2A',
  surface: '#232540',
  ink: '#E8E9F0',
  muted: '#9496AE',
  slotPast: '#4A4C68',
  slotFuture: '#3A3C58',
  celebrationPeach: '#F5C4A8',
  celebrationSage: '#B8D9B0',
  celebrationSky: '#BEC7F0',
  celebrationYellow: '#F5E5A0',
  white: '#FFFFFF',
  border: '#2E3050',
  completedTaskBg: '#2E3460',
  pastSlotHeaderBg: '#232540',
  reflectionCardBg: '#3A2520',
  summaryCardBg: '#232540',
  taskChipBg: '#2E3050',
  celebrationOverlayBg: 'rgba(24,26,42,0.85)',
  activeSlotCountColor: 'rgba(255,255,255,0.75)',
  scrim: 'rgba(0,0,0,0.6)',
};

export function resolveColors(preference: ThemePreference, systemScheme: 'light' | 'dark' | null | undefined): ColorPalette {
  if (preference === 'system') {
    return systemScheme === 'dark' ? darkColors : lightColors;
  }
  return preference === 'dark' ? darkColors : lightColors;
}

const ThemeContext = createContext<ColorPalette>(lightColors);

export function useThemeColors(): ColorPalette {
  return useContext(ThemeContext);
}

export function ThemeProvider({ preference, children }: { preference: ThemePreference; children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const colors = useMemo(
    () => resolveColors(preference, systemScheme),
    [preference, systemScheme],
  );
  return React.createElement(ThemeContext.Provider, { value: colors }, children);
}

export const radii = {
  button: 16,
  card: 20,
  task: 14,
  bottomSheet: 24,
  pill: 50,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const useNunito = !isRTL;
export const fonts = {
  display: useNunito ? 'Nunito_800ExtraBold' : undefined,
  heading: useNunito ? 'Nunito_700Bold' : undefined,
} as const;

const rtlText: TextStyle = isRTL ? { writingDirection: 'rtl', textAlign: 'left' } : {};

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38, fontFamily: fonts.display, ...rtlText },
  heading: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, fontFamily: fonts.heading, ...rtlText },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, ...rtlText },
  label: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18, ...rtlText },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16, ...rtlText },
};

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  modal: 200,
  toast: 300,
} as const;
