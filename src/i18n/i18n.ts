import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ── Original languages ────────────────────────────────────────────────────────
import enCommon from './locales/en/common.json';
import hiCommon from './locales/hi/common.json';
import deCommon from './locales/de/common.json';
import frCommon from './locales/fr/common.json';
import esCommon from './locales/es/common.json';

// ── New languages ─────────────────────────────────────────────────────────────
import zhCommon from './locales/zh/common.json';
import jaCommon from './locales/ja/common.json';
import neCommon from './locales/ne/common.json';
import dzCommon from './locales/dz/common.json';
import ruCommon from './locales/ru/common.json';
import siCommon from './locales/si/common.json';
import koCommon from './locales/ko/common.json';
import thCommon from './locales/th/common.json';
import uzCommon from './locales/uz/common.json';
import arCommon from './locales/ar/common.json';
import heCommon from './locales/he/common.json';

const resources = {
  en: { translation: enCommon },
  hi: { translation: hiCommon },
  de: { translation: deCommon },
  fr: { translation: frCommon },
  es: { translation: esCommon },
  zh: { translation: zhCommon },
  ja: { translation: jaCommon },
  ne: { translation: neCommon },
  dz: { translation: dzCommon },
  ru: { translation: ruCommon },
  si: { translation: siCommon },
  ko: { translation: koCommon },
  th: { translation: thCommon },
  uz: { translation: uzCommon },
  ar: { translation: arCommon },
  he: { translation: heCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
