// Design token system derived from DESIGN.md
// All color values in OKLCH (rendered as CSS/RN-compatible via hex approximations)
// We store as hex strings for React Native compatibility

import { I18nManager } from 'react-native';

export const colors = {
  primary: '#5B6BC8',       // oklch(0.52 0.17 252) — periwinkle indigo
  accent: '#E07050',        // oklch(0.68 0.19 32) — warm coral-peach
  bg: '#FFFFFF',            // pure white
  surface: '#F2F4FD',       // oklch(0.965 0.007 255) — barely blue-tinted
  ink: '#1E1F30',           // oklch(0.20 0.015 258) — near-black brand-hued
  muted: '#6B6D82',         // oklch(0.45 0.008 258) — secondary text
  // Slot states
  slotPast: '#B8BAD0',      // muted ink at 40%
  slotFuture: '#D4D6E8',    // muted ink at 25%
  // Celebration particles
  celebrationPeach: '#F5C4A8',
  celebrationSage: '#B8D9B0',
  celebrationSky: '#BEC7F0',
  celebrationYellow: '#F5E5A0',
  // Semantic
  white: '#FFFFFF',
  border: '#E8EAF4',
} as const;

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

// Nunito (800/700) carries the Display and Heading roles per DESIGN.md.
// Hebrew text always inherits the system font for correct RTL glyph rendering,
// so Nunito is only applied on LTR (Latin) locales.
const useNunito = !I18nManager.isRTL;
export const fonts = {
  display: useNunito ? 'Nunito_800ExtraBold' : undefined,
  heading: useNunito ? 'Nunito_700Bold' : undefined,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38, fontFamily: fonts.display },
  heading: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, fontFamily: fonts.heading },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  label: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  modal: 200,
  toast: 300,
} as const;
