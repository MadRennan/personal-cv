
import React, { useState, useMemo } from 'react';
import Section from './Section';
import { useLanguage } from '../hooks/useLanguage';
import SkillConstellation from './SkillConstellation';

const Skills: React.FC = () => {
  const { t } = useLanguage();
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const categories: Record<string, string> = t('skills.categories');
  
  const definedOrder = ['Frontend', 'Backend', 'Tools', 'Design', 'Soft Skills', 'Sciences'];
  const categoryOrder = useMemo(() => definedOrder.filter(key => categories[key]), [categories]);
  
  const categoryColors = useMemo(() => ({
    light: {
      Frontend: 'bg-primary-600',
      Backend: 'bg-emerald-600',
      Tools: 'bg-slate-600',
      Design: 'bg-rose-600',
      'Soft Skills': 'bg-amber-600',
      'Sciences': 'bg-teal-600',
    },
    dark: {
      Frontend: 'bg-primary-400',
      Backend: 'bg-emerald-400',
      Tools: 'bg-slate-400',
      Design: 'bg-rose-400',
      'Soft Skills': 'bg-amber-400',
      'Sciences': 'bg-teal-400',
    }
  }), []);

  const handleLegendClick = (key: string) => {
    setFocusedCategory(prevCategory => (prevCategory === key ? null : key));
  };
  
  return (
    <Section id="skills" title={t('skills.title')}>
      <div className="relative w-full max-w-5xl mx-auto aspect-[1/1] sm:aspect-[2/1] bg-transparent rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <SkillConstellation focusedCategory={focusedCategory} setFocusedCategory={setFocusedCategory} />
      </div>
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4 italic max-w-xl mx-auto">
        {t('skills.interactionHintMain')}
        <span className="hidden md:inline">{' '}{t('skills.interactionHintDesktop')}</span>
      </p>
      
      {/* Interactive Legend */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mt-8">
        {categoryOrder.map(key => categories[key] && (
          <button
            key={key}
            onClick={() => handleLegendClick(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border-2 ${
              focusedCategory === key
                ? 'bg-opacity-100 text-neutral-800 dark:text-neutral-100 border-current shadow-md'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:border-neutral-400/50'
            }`}
          >
            <span className={`w-3 h-3 rounded-full ${categoryColors['light'][key as keyof typeof categoryColors.light]} dark:${categoryColors['dark'][key as keyof typeof categoryColors.dark]}`}></span>
            <span>{categories[key]}</span>
          </button>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
