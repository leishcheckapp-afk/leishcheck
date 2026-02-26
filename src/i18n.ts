import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from './locales/pt-BR/translation.json';
import enUS from './locales/en-US/translation.json';
import es419 from './locales/es-419/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
      'es-419': { translation: es419 },
    },
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR', 'en-US', 'es-419'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'leishcheck-language',
      caches: ['localStorage'],
    },
  });

export default i18n;
