'use client';

import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import type { ServiceCategory } from '@/lib/data';

export type Language = 'en' | 'hi';

type Translations = typeof en;

type TranslationFunc = (key: keyof Translations, options?: { [key: string]: string | number }) => string;

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
  return (key: keyof Translations, options?: { [key: string]: string | number }): string => {
    let text = translations[langKey][key] || translations['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(k => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
      });
    }
    return text;
  }
};

export const getTranslatedCategory = (category: ServiceCategory, t: TranslationFunc): ServiceCategory => {
  const translatedName = t(`category_${category.id}_name` as keyof Translations);
  const translatedProblems = category.problems.map(problem => ({
    ...problem,
    name: t(`problem_${category.id}_${problem.id}_name` as keyof Translations),
  }));
  return { ...category, name: translatedName, problems: translatedProblems };
};


export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem('userLanguage') as Language;
      if (storedLanguage && ['en', 'hi'].includes(storedLanguage)) {
        setLanguageState(storedLanguage);
      }
    } catch (error) {
      console.error("Failed to parse language from localStorage", error);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('userLanguage', newLanguage);
      // reload page to apply new language to server components
      window.location.search = `?lang=${newLanguage}`;
    } catch (error) {
      console.error("Failed to save language to localStorage", error);
    }
  };

  const t = useCallback((key: keyof Translations, options?: { [key: string]: string | number }): string => {
    let text = translations[language][key] || translations['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(k => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
      });
    }
    return text;
  }, [language]);

  const translatedCategoryGetter = useCallback((category: ServiceCategory): ServiceCategory => {
    return getTranslatedCategory(category, t);
  }, [t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTranslatedCategory: translatedCategoryGetter }}>
      {children}
    </LanguageContext.Provider>
  );
}
