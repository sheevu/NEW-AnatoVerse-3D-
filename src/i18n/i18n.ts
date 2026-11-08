import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

const savedLang = localStorage.getItem('vedashield_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export function changeLanguage(lang: 'en' | 'hi') {
  i18n.changeLanguage(lang);
  localStorage.setItem('vedashield_lang', lang);
}

export default i18n;
