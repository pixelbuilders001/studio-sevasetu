import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

export type TranslationFunc = (key: keyof typeof en, options?: { [key: string]: string | number } | undefined) => string;

const translations = { en, hi };

export const getTranslations = (lang: string): TranslationFunc => {
  const langKey = lang === 'hi' ? 'hi' : 'en';
  return (key: keyof typeof en, options?: { [key: string]: string | number | undefined }): string => {
    let text = translations[langKey][key] || translations['en'][key] || key;

    if (options && 'defaultValue' in options && (!translations[langKey][key] && !translations['en'][key])) {
        text = String(options.defaultValue);
    }
    
    if (options) {
      Object.keys(options).forEach(k => {
        if (k !== 'defaultValue') {
          text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
        }
      });
    }
    return text;
  }
};
