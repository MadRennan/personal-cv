import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent, element?: HTMLElement | null) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(isDarkMode ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (event?: React.MouseEvent, element?: HTMLElement | null) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }
    
    let x, y;

    if (element) {
      const rect = element.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (event) {
      x = event.clientX;
      y = event.clientY;
    } else {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
    
    document.documentElement.style.setProperty('--reveal-x', `${x}px`);
    document.documentElement.style.setProperty('--reveal-y', `${y}px`);
    
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => setIsTransitioning(true));
    transition.finished.then(() => {
      setIsTransitioning(false);
      document.documentElement.style.removeProperty('--reveal-x');
      document.documentElement.style.removeProperty('--reveal-y');
    });
  };

  return React.createElement(ThemeContext.Provider, { value: { theme, toggleTheme, isTransitioning } }, children);
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
