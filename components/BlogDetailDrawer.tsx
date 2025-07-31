
import React, { useEffect, useState, useRef } from 'react';
import { useBlogDrawer } from '../hooks/useBlogDrawer';
import { useLanguage } from '../hooks/useLanguage';
import GenerativeImage from './GenerativeImage';
import { generateSummary } from '../utils/gemini';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const renderInlineMarkdown = (text: string) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
      <>
        {parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )}
      </>
    );
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    if (!content) return null;
    const blocks = content.split('\n\n');
    
    return (
      <>
        {blocks.map((block, i) => {
          if (block.startsWith('## ')) {
            return (
              <h3 key={i} className="text-xl sm:text-2xl font-bold font-heading !mb-4 !mt-8 first:!mt-0">
                {block.substring(3)}
              </h3>
            );
          }
          if (block.startsWith('* ')) {
            const items = block.split('\n').map(item => item.substring(2));
            return (
              <ul key={i} className="list-disc list-inside space-y-2 !mb-6">
                {items.map((item, j) => <li key={j}>{renderInlineMarkdown(item)}</li>)}
              </ul>
            );
          }
          return <p key={i}>{renderInlineMarkdown(block)}</p>;
        })}
      </>
    );
};


const BlogDetailDrawer: React.FC = () => {
  const { selectedBlogPost, closeDrawer } = useBlogDrawer();
  const { t } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);
  const [summary, setSummary] = useState<string[] | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeDrawer();
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (selectedBlogPost) {
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
  }, [selectedBlogPost]);
  
  useEffect(() => {
    if (!selectedBlogPost) return;

    let isCancelled = false;
    const getSummary = async () => {
        setIsLoadingSummary(true);
        setSummary(null);
        try {
            const points = await generateSummary(selectedBlogPost.id, selectedBlogPost.content);
            if (!isCancelled) setSummary(points);
        } catch (e) {
            console.error("Failed to generate summary:", e);
        } finally {
            if (!isCancelled) setIsLoadingSummary(false);
        }
    };
    getSummary();

    return () => { isCancelled = true; };
  }, [selectedBlogPost]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight <= clientHeight) {
            setScrollProgress(100);
            return;
        }
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set position
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedBlogPost]);


  if (!selectedBlogPost) {
    return null;
  }
  
  const drawerAnimation = isClosing ? 'animate-fade-out' : 'animate-fade-in';
  const panelAnimation = isClosing ? 'animate-slide-out-down' : 'animate-slide-in-up';
  
  const imagePrompt = `Detailed cinematic digital art representing the blog post '${selectedBlogPost.title}'. Keywords: ${selectedBlogPost.excerpt}. Style: professional, high-resolution, portfolio showcase.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-drawer-title"
      className={`fixed inset-0 z-40 flex items-end ${drawerAnimation}`}
    >
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        ref={drawerRef}
        className={`relative w-full max-w-4xl mx-auto bg-neutral-50 dark:bg-neutral-900 h-[85vh] sm:h-[90vh] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden ${panelAnimation}`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 z-30" style={{ width: `${scrollProgress}%` }} />
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-end p-2 sm:p-4">
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="p-3 rounded-full text-neutral-800 bg-neutral-50/70 hover:bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-900/70 dark:hover:bg-neutral-800 transition-colors backdrop-blur-sm"
            aria-label={t('blog.drawer.closeAriaLabel')}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="relative w-full h-56 sm:h-80 bg-neutral-200 dark:bg-neutral-800" style={{ transform: `translateY(${scrollProgress * -0.3}px)`}}>
             <GenerativeImage
                imageId={`blog-detail-${selectedBlogPost.id}`}
                prompt={imagePrompt}
                alt={selectedBlogPost.title}
                className="w-full h-full object-cover"
                aspectRatio="16:9"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent" />
          </div>

          <div className="p-4 sm:p-8 md:p-10 -mt-12 relative z-10">
            <h2 id="blog-drawer-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-neutral-900 dark:text-neutral-50 mb-3">
              {selectedBlogPost.title}
            </h2>
            
            <p className="text-lg italic text-neutral-600 dark:text-neutral-400 mb-8 border-l-4 border-primary-500 pl-4">
                {selectedBlogPost.excerpt}
            </p>

            { (isLoadingSummary || summary) && (
              <div className="mb-8 p-6 bg-primary-50/50 dark:bg-primary-900/20 rounded-lg border border-primary-200/50 dark:border-primary-500/20">
                <h3 className="text-lg font-bold font-heading text-primary-800 dark:text-primary-200 mb-4">{t('blog.drawer.keyTakeaways')}</h3>
                {isLoadingSummary ? (
                   <div className="space-y-3">
                    <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded shimmer-bg"></div>
                    <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded shimmer-bg"></div>
                    <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded shimmer-bg"></div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {summary?.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 mt-0.5 text-primary-500 flex-shrink-0" />
                        <span className="text-neutral-700 dark:text-neutral-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            

            <div className="prose prose-lg dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 prose-headings:font-heading prose-headings:text-neutral-800 dark:prose-headings:text-neutral-200 prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300">
                <MarkdownRenderer content={selectedBlogPost.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailDrawer;
