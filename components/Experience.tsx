import React, { useRef, useState, useEffect, forwardRef } from 'react';
import Section from './Section';
import { useLanguage } from '../hooks/useLanguage';
import { Experience as ExperienceType } from '../types';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useTheme } from '../hooks/useTheme';

const ExperienceTimelineIcon = () => (
    <svg className="w-3 h-3 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const SparkleIcon: React.FC = () => (
    <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.434-.772 1.755 0l1.922 4.613a1 1 0 00.95.69h4.848c.832 0 1.17.994.534 1.545l-3.92 2.852a1 1 0 00-.364 1.118l1.488 4.303c.28.812-.654 1.52-1.393 1.02l-3.95-2.88a1 1 0 00-1.175 0l-3.95 2.88c-.739.5-1.673-.208-1.393-1.02l1.488-4.303a1 1 0 00-.364-1.118L2.05 9.728c-.636-.55-.298-1.545.534-1.545h4.848a1 1 0 00.95-.69L10.868 2.884z" clipRule="evenodd" />
    </svg>
);

const ExperienceItem: React.FC<{ job: ExperienceType }> = ({ job }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const isIntersecting = useIntersectionObserver(itemRef, { threshold: 0.4 });

    return (
        <div ref={itemRef} className="mb-12 ml-6 md:ml-10">
            <span className={`absolute flex items-center justify-center w-6 h-6 bg-primary-200 dark:bg-primary-800 rounded-full -left-3 ring-8 ring-neutral-50 dark:ring-neutral-950 transition-all duration-500 ease-out ${isIntersecting ? 'scale-100' : 'scale-50 opacity-0'}`}>
                <ExperienceTimelineIcon />
            </span>
            <div className={`p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 shadow-sm hover:shadow-lg hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10 transition-all duration-500 ease-out transform hover:-translate-y-1 hover:border-primary-500/30 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h3 className="text-xl font-semibold font-heading text-neutral-900 dark:text-white">{`${job.role} @ ${job.company}`}</h3>
                    <time className="sm:ml-4 text-sm font-normal leading-none text-neutral-500 dark:text-neutral-400">{job.period}</time>
                </div>
                <ul className="mt-4 space-y-2 list-disc list-inside text-neutral-600 dark:text-neutral-300">
                    {job.description.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const NextChapterItem = forwardRef<HTMLDivElement>((props, ref) => {
    const { t } = useLanguage();
    const isIntersecting = useIntersectionObserver(ref as React.RefObject<HTMLDivElement>, { threshold: 0.5 });
    const nextChapterData = t('experience.nextChapter');

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!nextChapterData) return null;

    return (
        <div ref={ref} className="ml-6 md:ml-10">
            <span 
              className={`absolute flex items-center justify-center w-8 h-8 bg-amber-200 dark:bg-amber-900/50 rounded-full -left-4 ring-[12px] ring-neutral-50 dark:ring-neutral-950 transition-all duration-700 ease-out ${
                isIntersecting 
                  ? 'scale-100 opacity-100' 
                  : 'scale-50 opacity-0'
              }`}
            >
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <SparkleIcon />
            </span>
            <div 
              className={`transition-all duration-500 ease-out ${
                isIntersecting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isIntersecting ? '150ms' : '0ms' }}
            >
                <h3 className="text-xl font-semibold font-heading text-neutral-900 dark:text-white mb-2">{nextChapterData.title}</h3>
                <p className="mb-4 text-neutral-600 dark:text-neutral-300 max-w-2xl">{nextChapterData.description}</p>
                <button
                    onClick={scrollToContact}
                    className="btn-primary-gradient inline-block px-6 py-2 text-base font-semibold text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                    {nextChapterData.buttonText}
                </button>
            </div>
        </div>
    );
});

const Experience: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const experienceData: ExperienceType[] = t('experience.items');
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nextChapterItemRef = useRef<HTMLDivElement>(null);

  const [sparkles, setSparkles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const [sparklePosition, setSparklePosition] = useState<{ top: number; left: number } | null>(null);
  const [sparklesTriggered, setSparklesTriggered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!container || !svg || !path) return;

    let pathLength = 0;
    let starTriggerDrawLength = 0;

    const ro = new ResizeObserver(() => {
        const pathHeight = container.scrollHeight - 60;
        if (pathHeight > 0) {
            svg.setAttribute('height', pathHeight.toString());
            path.setAttribute('d', `M 1 0 V ${pathHeight}`);
            pathLength = path.getTotalLength();
            path.style.strokeDasharray = `${pathLength} ${pathLength}`;
            
            if (nextChapterItemRef.current) {
                const starY = nextChapterItemRef.current.offsetTop + 16; // Center of 2rem icon
                const starProgress = starY / pathHeight;
                starTriggerDrawLength = pathLength * starProgress;
            }

            handleScroll();
        }
    });
    ro.observe(container);

    const handleScroll = () => {
        if (pathLength === 0) return;
        const { top, height } = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Shift the animation trigger point down to make it feel more centered.
        // The animation now happens as the section scrolls past the 75% viewport height mark.
        const progress = Math.max(0, Math.min(1, (viewportHeight * 0.75 - top) / height));
        
        const drawLength = pathLength * progress;
        path.style.strokeDashoffset = `${pathLength - drawLength}`;

        if (drawLength >= starTriggerDrawLength && !sparklesTriggered && starTriggerDrawLength > 0) {
            setSparklesTriggered(true);
            
            if (!nextChapterItemRef.current) return;
            const svgRect = svg.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const starY = nextChapterItemRef.current.offsetTop + 16;
            const top = (svgRect.top - containerRect.top) + starY;
            const left = (svgRect.left - containerRect.left) + 1;
            setSparklePosition({ top, left });

            const numSparkles = 20;
            const newSparkles = Array.from({ length: numSparkles }).map((_, i) => {
                const angle = (i / numSparkles) * 2 * Math.PI;
                const radius = 20 + Math.random() * 80;
                return {
                    id: Date.now() + i,
                    style: {
                        '--x': `${Math.cos(angle) * radius}px`,
                        '--y': `${Math.sin(angle) * radius}px`,
                        background: theme === 'dark' ? '#fbbf24' : '#fb7185', // amber-400 or rose-400
                        animationDelay: `${Math.random() * 0.2}s`,
                    } as React.CSSProperties,
                };
            });
            setSparkles(newSparkles);

            setTimeout(() => setSparkles([]), 1000); // Cleanup
        } else if (drawLength < starTriggerDrawLength * 0.95 && sparklesTriggered) {
            setSparklesTriggered(false); // Reset if scrolled up
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
        ro.disconnect();
        window.removeEventListener('scroll', handleScroll);
    }
  }, [experienceData, sparklesTriggered, theme]);

  return (
    <Section id="experience" title={t('experience.title')}>
      <div ref={containerRef} className="relative">
        <div className="absolute top-0 w-6 -left-3 h-full flex justify-center pointer-events-none">
            <svg ref={svgRef} width="2" className="overflow-visible">
                {/* Background Track */}
                <path
                    d="M 1 0 V 0"
                    fill="none"
                    strokeWidth="2"
                    className="stroke-primary-200/50 dark:stroke-primary-800/50"
                />
                {/* Progress Track */}
                <path
                    ref={pathRef}
                    d="M 1 0 V 0"
                    fill="none"
                    strokeWidth="2"
                    className="stroke-primary-600 dark:stroke-primary-400"
                />
            </svg>
        </div>
        {experienceData.map((job, index) => (
          <ExperienceItem key={index} job={job} />
        ))}
        <NextChapterItem ref={nextChapterItemRef} />
        {sparklePosition && (
            <div
                className="absolute pointer-events-none"
                style={{ top: sparklePosition.top, left: sparklePosition.left }}
                aria-hidden="true"
            >
                {sparkles.map(s => (
                    <div
                        key={s.id}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                            ...s.style,
                            animation: 'sparkle-fly-out 0.8s ease-out forwards',
                        }}
                    />
                ))}
            </div>
        )}
      </div>
    </Section>
  );
};

export default Experience;