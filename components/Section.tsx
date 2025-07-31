import React, { ReactNode, useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import WaveRevealText from './WaveRevealText';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const isIntersecting = useIntersectionObserver(sectionRef, {
    threshold: 0.1
  });

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`
        py-16 sm:py-24 transition-all duration-500 ease-out
        ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      <div className="flex items-center mb-12">
        <WaveRevealText text={title} className="text-3xl sm:text-4xl font-bold font-heading text-neutral-800 dark:text-neutral-100" />
        <div className="flex-grow h-px ml-6 bg-neutral-300 dark:bg-neutral-700"></div>
      </div>
      {children}
    </section>
  );
};

export default Section;