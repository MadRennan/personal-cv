import React, { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e, buttonRef.current);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="relative p-2 w-10 h-10 flex justify-center items-center rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
      aria-label="Toggle theme"
    >
        <SunIcon className={`absolute w-6 h-6 transition-all duration-300 ease-in-out ${theme === 'dark' ? 'transform rotate-90 scale-0 opacity-0' : 'transform rotate-0 scale-100 opacity-100'}`} />
        <MoonIcon className={`absolute w-6 h-6 transition-all duration-300 ease-in-out ${theme === 'light' ? 'transform -rotate-90 scale-0 opacity-0' : 'transform rotate-0 scale-100 opacity-100'}`} />
    </button>
  );
};

export default ThemeToggle;
