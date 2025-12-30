
'use client';

import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import type { ServiceCategory } from '@/lib/data';

export type Language = 'en' | 'hi';

type Translations = typeof en;

export type TranslationFunc = (key: keyof Translations, options?: { [key: string]: string | number | undefined }) => string;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationFunc
  getTranslatedCategory: (category: ServiceCategory) => ServiceCategory;
};

const translations = { en, hi };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const getTranslations = (lang: string): TranslationFunc => {
  const langKey = lang === 'hi' ? 'hi' : 'en';
  return (key: keyof Translations, options?: { [key: string]: string | number | undefined }): string => {
    let text = translations[langKey][key] || translations['en'][key] || key;
    if (options && 'defaultValue' in options && text === key) {
        text = String(options.defaultValue);
    }
    if (options) {
      Object.keys(options).forEach(k => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
      });
    }
    return text;
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = localStorage.getItem('userLanguage') as Language;
      const initialLang = urlLang || storedLanguage;
      if (initialLang && ['en', 'hi'].includes(initialLang)) {
        setLanguageState(initialLang as Language);
      }
    } catch (error) {
      console.error("Failed to parse language from localStorage or URL", error);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('userLanguage', newLanguage);
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('lang', newLanguage);
      window.location.search = currentParams.toString();
    } catch (error) {
      console.error("Failed to save language to localStorage", error);
    }
  };
  
  const t = useCallback((key: keyof Translations, options?: { [key: string]: string | number | undefined }): string => {
    let text = translations[language][key] || translations['en'][key] || key;
     if (options && 'defaultValue' in options && text === key) {
        text = String(options.defaultValue);
    }
    if (options) {
      Object.keys(options).forEach(k => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
      });
    }
    return text;
  }, [language]);

  const translatedCategoryGetter = useCallback((category: ServiceCategory): ServiceCategory => {
     const tFunc = getTranslations(language);
     const translatedName = tFunc(`category_${category.slug}_name` as any, { defaultValue: category.name });
      const translatedProblems = category.problems.map(problem => ({
        ...problem,
        name: tFunc(`problem_${category.slug}_${problem.id}_name` as any, { defaultValue: problem.name }),
      }));
      return { ...category, name: translatedName, problems: translatedProblems };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTranslatedCategory: translatedCategoryGetter }}>
      {children}
    </LanguageContext.Provider>
  );
}
