import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import en from './en';
import he from './he';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const isRTL = true;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'he',
  fallbackLng: 'en',
  resources: { en: { translation: en }, he: { translation: he } },
  interpolation: { escapeValue: false },
});

export default i18n;
