import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  t: (key: string, replacements?: Record<string, string>) => any;
  changeLanguage: (lang: Language, origin: { x: number, y: number }) => void;
  translations: any;
  isLoading: boolean;
  isInitialLoad: boolean;
  languageChangeOrigin: { x: number; y: number } | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [languageChangeOrigin, setLanguageChangeOrigin] = useState<{ x: number; y: number } | null>(null);

  const fetchTranslationsForLang = useCallback(async (lang: Language) => {
    setIsLoading(true);
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load content file for language: ${lang}`);
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(error);
      if (lang !== 'en') {
        await fetchTranslationsForLang('en');
      } else {
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad && !isLoading) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    const browserLang = navigator.language.split('-')[0] as Language;
    let initialLang: Language = 'en';

    if (storedLang && ['en', 'pt', 'ja', 'es'].includes(storedLang)) {
      initialLang = storedLang;
    } else if (['en', 'pt', 'ja', 'es'].includes(browserLang)) {
      initialLang = browserLang;
    }
    
    setLanguage(initialLang);
    fetchTranslationsForLang(initialLang);
  }, [fetchTranslationsForLang]);

  useEffect(() => {
    if (languageChangeOrigin) {
      const timer = setTimeout(() => {
        setLanguageChangeOrigin(null);
      }, 1000); // Reset after 1 second
      return () => clearTimeout(timer);
    }
  }, [languageChangeOrigin]);


  const changeLanguage = (lang: Language, origin: { x: number, y: number }) => {
    if (lang === language || isLoading) {
        return;
    }
    
    const updateLogic = async () => {
      setLanguage(lang);
      await fetchTranslationsForLang(lang);
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    };

    // @ts-ignore
    if (!document.startViewTransition) {
        setLanguageChangeOrigin(origin);
        updateLogic();
        return;
    }
    
    document.documentElement.style.setProperty('--reveal-x', `${origin.x}px`);
    document.documentElement.style.setProperty('--reveal-y', `${origin.y}px`);
    setLanguageChangeOrigin(origin);

    // @ts-ignore
    const transition = document.startViewTransition(async () => {
      document.documentElement.classList.add('lang-transition');
      await updateLogic();
    });

    transition.finished.finally(() => {
        document.documentElement.classList.remove('lang-transition');
        document.documentElement.style.removeProperty('--reveal-x');
        document.documentElement.style.removeProperty('--reveal-y');
    });
  };

  const t = useCallback((key: string, replacements?: Record<string, string>): any => {
    let value = key.split('.').reduce((acc, k) => acc?.[k], translations);

    if (value === undefined) {
      if (!isLoading) console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    if (typeof value === 'string' && replacements) {
      Object.entries(replacements).forEach(([rKey, rValue]) => {
        const regex = new RegExp(`{${rKey}}`, 'g');
        value = value.replace(regex, rValue);
      });
    }

    return value;
  }, [translations, isLoading]);

  const value = { language, t, changeLanguage, translations, isLoading, isInitialLoad, languageChangeOrigin };

  return React.createElement(
    LanguageContext.Provider,
    { value },
    children
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};