import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { CommandPaletteAction } from '../types';
import { languageOptions } from './LanguageSwitcher';

// Icons
const NavigateIcon = ({ className = 'w-5 h-5' }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>;
const ThemeIcon = ({ className = 'w-5 h-5' }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.402-6.402a3.75 3.75 0 0 0-5.304-5.304L4.098 14.6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m15.902 4.098 6 6" /></svg>;
const SocialIcon = ({ className = 'w-5 h-5' }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>;
const SearchIcon = ({ className = 'w-5 h-5' }: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;

const CommandPalette: React.FC = () => {
  const { isOpen, close } = useCommandPalette();
  const { t, changeLanguage } = useLanguage();
  const { toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const onActionSelect = useCallback((action: CommandPaletteAction, event?: React.MouseEvent) => {
    action.perform(event);
    close();
  }, [close]);

  const allActions: CommandPaletteAction[] = useMemo(() => {
    const navActions: CommandPaletteAction[] = [
      { id: 'about', label: t('nav.about') },
      { id: 'skills', label: t('nav.skills') },
      { id: 'experience', label: t('nav.experience') },
      { id: 'blog', label: t('nav.blog') },
      { id: 'projects', label: t('nav.projects') },
      { id: 'contact', label: t('nav.contact') },
    ].map(link => ({
      id: `nav-${link.id}`,
      type: 'navigation',
      label: `${t('commandPalette.actions.navigateTo')} ${link.label}`,
      icon: <NavigateIcon />,
      perform: () => {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
      },
      keywords: ['go to', 'navigate', 'jump', 'section', link.label.toLowerCase()],
    }));

    const themeAction: CommandPaletteAction = {
      id: 'theme-toggle',
      type: 'theme',
      label: t('commandPalette.actions.toggleTheme'),
      icon: <ThemeIcon />,
      perform: (e) => toggleTheme(e),
      keywords: ['dark', 'light', 'mode', 'theme', 'change', 'switch', 'toggle', 'interface', 'appearance'],
    };

    const langActions: CommandPaletteAction[] = languageOptions.map(lang => ({
        id: `lang-${lang.code}`,
        type: 'language',
        label: `${t('commandPalette.actions.changeLanguageTo')} ${lang.name}`,
        icon: <span className="text-xl">{lang.flag}</span>,
        perform: (e) => {
            const origin = (e) ? { x: e.clientX, y: e.clientY } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            changeLanguage(lang.code, origin);
        },
        keywords: [lang.name, lang.code, 'language', 'translate', 'idioma', '言語', 'lenguaje'],
    }));

    const socialActions: CommandPaletteAction[] = [
      { id: 'social-github', type: 'social', label: t('commandPalette.actions.visitGithub'), icon: <SocialIcon />, perform: () => window.open(t('site.social.github'), '_blank', 'noopener,noreferrer'), keywords: ['github', 'code', 'repository', 'social'] },
      { id: 'social-linkedin', type: 'social', label: t('commandPalette.actions.visitLinkedin'), icon: <SocialIcon />, perform: () => window.open(t('site.social.linkedin'), '_blank', 'noopener,noreferrer'), keywords: ['linkedin', 'profile', 'professional', 'social'] },
    ];

    return [...navActions, themeAction, ...langActions, ...socialActions];
  }, [t, toggleTheme, changeLanguage]);

  const filteredActions = useMemo(() => {
    if (!query) return allActions;
    const lowerQuery = query.toLowerCase();
    return allActions.filter(action =>
      action.label.toLowerCase().includes(lowerQuery) ||
      (action.keywords || []).some(k => k.toLowerCase().includes(lowerQuery))
    );
  }, [query, allActions]);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setActiveIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(prev => (prev + 1) % filteredActions.length); } 
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length); } 
    else if (e.key === 'Enter') { e.preventDefault(); const action = filteredActions[activeIndex]; if (action) onActionSelect(action); } 
    else if (e.key === 'Escape') { close(); }
  }, [activeIndex, filteredActions, close, onActionSelect]);

  useEffect(() => {
    const resultsEl = resultsRef.current;
    if (resultsEl) {
      const activeEl = resultsEl.querySelector(`[data-index="${activeIndex}"]`);
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={t('commandPalette.title')} className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]" onClick={close}>
      <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-xl bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-in-up-fast" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="flex items-center p-4 border-b border-neutral-200 dark:border-neutral-800">
          <SearchIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }} placeholder={t('commandPalette.placeholder')} className="w-full bg-transparent ml-3 focus:outline-none text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500" aria-label="Search commands" aria-controls="command-palette-results" aria-expanded="true" />
          <kbd className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-2 py-1 rounded-md border border-neutral-300 dark:border-neutral-600">ESC</kbd>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[40vh]">
          {filteredActions.length > 0 ? (
            <ul ref={resultsRef} id="command-palette-results" role="listbox">
              {filteredActions.map((action, index) => (
                <li key={action.id} id={`action-${index}`} role="option" aria-selected={index === activeIndex} data-active={index === activeIndex} data-index={index} onMouseMove={() => setActiveIndex(index)} onClick={(e) => onActionSelect(action, e)} className="flex items-center gap-4 px-4 py-3 cursor-pointer text-neutral-700 dark:text-neutral-300 data-[active=true]:bg-primary-100/50 dark:data-[active=true]:bg-primary-900/50 data-[active=true]:text-primary-600 dark:data-[active=true]:text-primary-400">
                  <span className="flex-shrink-0 w-5 h-5">{action.icon}</span>
                  <span className="flex-grow">{action.label}</span>
                </li>
              ))}
            </ul>
          ) : (<p className="p-8 text-center text-neutral-500">{t('commandPalette.noResults')}</p>)}
        </div>
        <div className="px-4 py-2 text-xs text-center border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
          {t('commandPalette.footer')}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;