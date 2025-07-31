
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import ScrambleText from './ScrambleText';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const handleGetInTouchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="flex items-center min-h-[calc(100vh-4rem)] text-center sm:text-left">
      <div className="w-full">
        <ScrambleText
          as="p"
          text={t('hero.greeting')}
          className="text-lg text-primary-600 dark:text-primary-400 font-mono"
          animationDelay={0}
          scrambleMultiplier={4.5}
        />
        <ScrambleText
          as="h1"
          text={t('hero.name')}
          className="mt-2 text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-neutral-900 dark:text-neutral-50 tracking-tighter"
          animationDelay={150}
          scrambleMultiplier={5.25}
        />
        <ScrambleText
          as="h2"
          text={t('hero.subtitle')}
          className="mt-2 text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-neutral-500 dark:text-neutral-400 tracking-tighter"
          animationDelay={600}
          scrambleMultiplier={1.125}
        />
        <p className="mt-6 max-w-2xl mx-auto sm:mx-0 text-lg text-neutral-600 dark:text-neutral-300 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
          {t('hero.description')}
        </p>
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '1300ms' }}>
          <a
            href="#contact"
            onClick={handleGetInTouchClick}
            className="btn-primary-gradient inline-block px-8 py-3 text-lg font-semibold text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary-600/30 dark:hover:shadow-primary-400/30"
          >
            {t('hero.button')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
