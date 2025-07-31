


import React, { useState, useCallback, useEffect, useRef } from 'react';
import Section from './Section';
import { PROJECTS_BASE_DATA } from '../constants';
import { Project, FeaturedProject, Skill } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useProjectDrawer } from '../hooks/useProjectDrawer';
import { useSkillSelection } from '../hooks/useSkillSelection';
import { useFeaturedProjectModal } from '../hooks/useFeaturedProjectModal';
import GenerativeImage from './GenerativeImage';

// Icons
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
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

const ProjectCard: React.FC<{
  project: Project;
  selectedSkill: Skill | null;
  onSelect: (project: Project) => void;
}> = ({ project, selectedSkill, onSelect }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const isHighlighted = selectedSkill && project.tags.includes(selectedSkill.name);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;

    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    // Let CSS handle the transition back to 0
    card.style.removeProperty('--rotate-x');
    card.style.removeProperty('--rotate-y');
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  };

  const imagePrompt = `Abstract digital art for a project card, style: futuristic, elegant, minimalist. The project is called '${project.title}'. Description: ${project.description}. Technologies used: ${project.tags.join(', ')}.`;

  return (
    <button
      ref={cardRef}
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`project-card bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg shadow-md hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-400/20 flex flex-col overflow-hidden group text-left ${
        isHighlighted ? 'highlighted' : ''
      } ${
        selectedSkill && !isHighlighted ? 'opacity-40 hover:opacity-100' : ''
      }`}
      style={{
        '--scale': isHighlighted
          ? '1.02'
          : selectedSkill && !isHighlighted
          ? '0.95'
          : '1',
      } as React.CSSProperties}
      aria-label={`View details for ${project.title}`}
    >
      <div className="relative h-48">
        <GenerativeImage
          imageId={`project-${project.id}`}
          prompt={imagePrompt}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-lg font-bold font-heading text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h4>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300 flex-grow text-sm">{project.description}</p>
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs font-medium text-neutral-600 bg-neutral-200 rounded-full dark:bg-neutral-800 dark:text-neutral-300">{tag}</span>
          ))}
        </div>
      </div>
    </button>
  );
};

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const { selectProject } = useProjectDrawer();
  const { selectFeaturedProject } = useFeaturedProjectModal();
  const { selectedSkill, selectSkill } = useSkillSelection();
  const featuredProjects: FeaturedProject[] = t('projects.featuredProjects');
  const otherProjectsRaw: Omit<Project, 'imageUrl' | 'liveUrl' | 'repoUrl'>[] = t('projects.items');
  const [current, setCurrent] = useState(0);
  
  // State for dragging/swiping
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    if (!featuredProjects) return;
    setCurrent(current => (current === featuredProjects.length - 1 ? 0 : current + 1));
  }, [featuredProjects]);

  const prev = () => {
    if (!featuredProjects) return;
    setCurrent(current => (current === 0 ? featuredProjects.length - 1 : current - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrent(index);
  }
  
  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    if (!featuredProjects || featuredProjects.length <= 1) return;
    autoScrollInterval.current = setInterval(next, 5000);
  }, [next, featuredProjects]);

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
  };
  
  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    stopAutoScroll();
    setDragStart('touches' in e ? e.touches[0].clientX : e.clientX);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(currentX - dragStart);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    startAutoScroll();

    if (dragOffset < -50) {
      next();
    } else if (dragOffset > 50) {
      prev();
    }
    
    setDragOffset(0);
  };
  
  const handleSlideClick = (project: FeaturedProject) => {
    if (Math.abs(dragOffset) < 10) {
      selectFeaturedProject(project);
    }
  };


  if (!featuredProjects || !otherProjectsRaw) return null;
  
  const otherProjects: Project[] = PROJECTS_BASE_DATA.map(baseProj => {
    const translated = otherProjectsRaw.find(p => p.id === baseProj.id);
    return { ...baseProj, ...translated } as Project;
  });

  const TitleWithFilter: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex justify-center items-center mb-12 gap-4">
      <h3 className="text-2xl sm:text-3xl font-bold font-heading text-center text-neutral-800 dark:text-neutral-100">
        {title}
      </h3>
      {selectedSkill && (
        <button 
          onClick={() => selectSkill(null)}
          className="px-3 py-1 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900 transition-all transform hover:scale-105"
        >
          &times; {t('projects.clearFilter')}: {selectedSkill.name}
        </button>
      )}
    </div>
  );

  return (
    <Section id="projects" title={t('projects.title')}>
      <div className="space-y-24">
        {/* Featured Projects Carousel */}
        <div>
          <TitleWithFilter title={t('projects.featuredTitle')} />
          <div
            ref={carouselRef}
            className="relative group cursor-grab active:cursor-grabbing"
            onMouseEnter={stopAutoScroll}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => {
              // End drag if mouse leaves container, and always restart autoscroll on leave.
              handleDragEnd();
              startAutoScroll();
            }}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            role="region"
            aria-roledescription="carousel"
          >
            <div className="overflow-hidden rounded-lg shadow-2xl shadow-primary-500/10 dark:shadow-primary-400/10">
              <div 
                className={`flex ${!isDragging ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{ transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))` }}
              >
                {featuredProjects.map((project, index) => {
                  const imagePrompt = `Cinematic, wide-aspect abstract digital art. Project title: '${project.title}'. Description: ${project.description}. Technologies: ${project.tech.join(', ')}. Style: epic, professional, moody lighting, dark fantasy.`;
                  const isHighlighted = selectedSkill && project.tech.includes(selectedSkill.name);
                  return (
                    <div 
                      key={index} 
                      className={`featured-project-slide min-w-full select-none ${isHighlighted ? 'highlighted' : ''} ${selectedSkill && !isHighlighted ? 'opacity-40' : ''}`} 
                      role="group" 
                      aria-roledescription="slide" 
                      aria-label={`${index + 1} of ${featuredProjects.length}`}
                      onClick={() => handleSlideClick(project)}
                    >
                      <div className="grid lg:grid-cols-2 bg-neutral-100/50 dark:bg-neutral-900/50">
                        <div className="w-full h-64 lg:h-full pointer-events-none">
                           <GenerativeImage
                              imageId={`featured-${project.title.replace(/\s/g, '-')}`}
                              prompt={imagePrompt}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              aspectRatio="16:9"
                           />
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <span className={`inline-block mb-2 px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                            project.isWIP
                              ? 'text-rose-800 bg-rose-100 dark:text-amber-400 dark:bg-amber-900/50'
                              : 'text-primary-700 bg-primary-100 dark:text-primary-300 dark:bg-primary-900/50'
                          }`}>{project.status}</span>
                          <h4 className="text-2xl font-bold font-heading text-neutral-800 dark:text-neutral-100 mb-3">{project.title}</h4>
                          <p className="text-neutral-600 dark:text-neutral-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map(t => <span key={t} className="px-2 py-1 text-xs font-medium text-neutral-600 bg-neutral-200 rounded-full dark:bg-neutral-800 dark:text-neutral-300">{t}</span>)}
                          </div>
                          <div className="flex items-center space-x-4">
                            {project.repoUrl && (
                              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={t('projects.repoAriaLabel', { title: project.title })} className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors pointer-events-auto">
                                <GithubIcon />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={t('projects.liveAriaLabel', { title: project.title })} className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors pointer-events-auto">
                                <ExternalLinkIcon />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Carousel Controls */}
            {featuredProjects.length > 1 && (
              <>
                <button onClick={prev} className="absolute top-1/2 left-3 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto z-10" aria-label="Previous project">
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button onClick={next} className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto z-10" aria-label="Next project">
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 pointer-events-auto">
                  {featuredProjects.map((_, i) => (
                    <button key={i} onClick={() => goToSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${current === i ? 'bg-primary-500' : 'bg-neutral-400/50 hover:bg-neutral-400'}`} aria-label={`Go to slide ${i + 1}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Other Noteworthy Projects */}
        <div>
          <TitleWithFilter title={t('projects.otherTitle')} />
          <div className="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                selectedSkill={selectedSkill}
                onSelect={selectProject}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Projects;
