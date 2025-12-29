import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

const translations = { en, hi };

export const getTranslations = (lang: string) => {
  const langKey = lang === 'hi' ? 'hi' : 'en';
  const t = (key: keyof typeof en, options?: { [key: string]: string | number }): string => {
    let text = translations[langKey][key] || translations['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(k => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
      });
    }
    return text;
  }
  return t;
};
