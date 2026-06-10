import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import en from './en';
import he from './he';

// Hebrew (RTL) is a first-class requirement (PRODUCT.md). Detect the device
// locale via the platform RTL flag, then enforce mirrored layout so flex-row
// rows (task rows, slot headers, tab bar) flip regardless of the OS default
// direction. forceRTL takes full effect after the next app reload.
const isHebrew = I18nManager.isRTL;

I18nManager.allowRTL(isHebrew);
I18nManager.forceRTL(isHebrew);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: isHebrew ? 'he' : 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en }, he: { translation: he } },
  interpolation: { escapeValue: false },
});

export default i18n;
