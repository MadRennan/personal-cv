
import React, { useEffect, useState, useRef } from 'react';
import { useProjectDrawer } from '../hooks/useProjectDrawer';
import { useLanguage } from '../hooks/useLanguage';
import { useSkillSelection } from '../hooks/useSkillSelection';
import GenerativeImage from './GenerativeImage';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
);

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.75a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75-.75H13.5m-4.5 0L19.5 6" />
  </svg>
);

const ProjectDetailDrawer: React.FC = () => {
  const { selectedProject, closeDrawer } = useProjectDrawer();
  const { selectSkill } = useSkillSelection();
  const { t } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      selectSkill(null); // Clear skill selection on close
      closeDrawer();
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (selectedProject) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      // Focus management
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return null;
  }
  
  const drawerAnimation = isClosing ? 'animate-fade-out' : 'animate-fade-in';
  const panelAnimation = isClosing ? 'animate-slide-out-down' : 'animate-slide-in-up';
  
  const imagePrompt = `Detailed cinematic digital art representing the project '${selectedProject.title}'. Keywords: ${selectedProject.tags.join(', ')}. Style: professional, high-resolution, portfolio showcase.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-drawer-title"
      className={`fixed inset-0 z-40 flex items-end ${drawerAnimation}`}
    >
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        ref={drawerRef}
        className={`relative w-full max-w-4xl mx-auto bg-neutral-50 dark:bg-neutral-900 h-[85vh] sm:h-[90vh] rounded-t-2xl shadow-2xl flex flex-col ${panelAnimation}`}
      >
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-end p-2 sm:p-4">
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="p-3 rounded-full text-neutral-800 bg-neutral-50/70 hover:bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-900/70 dark:hover:bg-neutral-800 transition-colors backdrop-blur-sm"
            aria-label={t('projects.drawer.closeAriaLabel')}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="relative w-full h-56 sm:h-80 bg-neutral-200 dark:bg-neutral-800">
             <GenerativeImage
                imageId={`project-detail-${selectedProject.id}`}
                prompt={imagePrompt}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                aspectRatio="16:9"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent" />
          </div>

          <div className="p-4 sm:p-8 md:p-10 -mt-12 relative z-10">
            <h2 id="project-drawer-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-neutral-900 dark:text-neutral-50 mb-3">
              {selectedProject.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 rounded-full dark:bg-primary-900/50 dark:text-primary-300">{tag}</span>
                ))}
              </div>
              <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700 hidden sm:block" />
              <div className="flex items-center space-x-4">
                {selectedProject.repoUrl && (
                  <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={t('projects.repoAriaLabel', { title: selectedProject.title })} className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <GithubIcon className="w-7 h-7" />
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={t('projects.liveAriaLabel', { title: selectedProject.title })} className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <ExternalLinkIcon className="w-7 h-7" />
                  </a>
                )}
              </div>
            </div>

            <div className="prose sm:prose-lg dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 space-y-8">
              <p>{selectedProject.detailedDescription}</p>
              
              <div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 dark:text-neutral-100">{t('projects.drawer.challengesTitle')}</h3>
                <p>{selectedProject.challenges}</p>
              </div>

              <div>
                 <h3 className="text-xl font-bold font-heading text-neutral-800 dark:text-neutral-100">{t('projects.drawer.outcomeTitle')}</h3>
                <p>{selectedProject.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailDrawer;
