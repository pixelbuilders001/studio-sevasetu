'use client';

import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import type { ServiceCategory } from '@/lib/data';

export type Language = 'en' | 'hi';

type Translations = typeof en;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations, options?: { [key: string]: string | number }) => string;
  getTranslatedCategory: (category: ServiceCategory) => ServiceCategory;
};

const translations = { en, hi };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

  const getTranslatedCategory = useCallback((category: ServiceCategory): ServiceCategory => {
    const translatedName = t(`category_${category.id}_name`);
    const translatedProblems = category.problems.map(problem => ({
      ...problem,
      name: t(`problem_${category.id}_${problem.id}_name`),
    }));
    return { ...category, name: translatedName, problems: translatedProblems };
  }, [t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTranslatedCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}
