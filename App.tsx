
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { CommandPaletteProvider, useCommandPalette } from './hooks/useCommandPalette';
import { ProjectDrawerProvider, useProjectDrawer } from './hooks/useProjectDrawer';
import { BlogDrawerProvider, useBlogDrawer } from './hooks/useBlogDrawer';
import { FeaturedProjectModalProvider, useFeaturedProjectModal } from './hooks/useFeaturedProjectModal';
import { SkillProvider } from './hooks/useSkillSelection';
import GalaxyBackground from './components/GalaxyBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Blog from './components/Blog';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CommandPalette from './components/CommandPalette';
import WaveEffect from './components/WaveEffect';
import ProjectDetailDrawer from './components/ProjectDetailDrawer';
import BlogDetailDrawer from './components/BlogDetailDrawer';
import FeaturedProjectModal from './components/FeaturedProjectModal';
import { Skill } from './types';

const FullScreenLoader: React.FC = () => (
    <div className="fixed inset-0 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-primary-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <p className="sr-only">Loading content...</p>
    </div>
);

const AppContent: React.FC = () => {
  const { t, language, isLoading, isInitialLoad } = useLanguage();
  const { open } = useCommandPalette();
  const { selectedProject } = useProjectDrawer();
  const { selectedBlogPost } = useBlogDrawer();
  const { selectedFeaturedProject } = useFeaturedProjectModal();

  useEffect(() => {
    if (t && !isLoading) {
      document.title = t('site.title');
      document.documentElement.lang = language;
      const description = t('site.description');
      const url = t('site.url');
      const ogImage = t('site.ogImage');
      const title = t('site.title');

      const updateMeta = (selector: string, content: string) => {
        const element = document.querySelector(selector) as HTMLMetaElement | null;
        if (element) element.content = content;
      };
      
      updateMeta('meta[name="description"]', description);
      updateMeta('meta[property="og:title"]', title);
      updateMeta('meta[property="og:description"]', description);
      updateMeta('meta[property="og:url"]', url);
      updateMeta('meta[property="og:image"]', ogImage);
      updateMeta('meta[property="twitter:title"]', title);
      updateMeta('meta[property="twitter:description"]', description);
      updateMeta('meta[property="twitter:image"]', ogImage);
      updateMeta('meta[property="twitter:url"]', url);
      
      const structuredDataElement = document.getElementById('structured-data');
      if (structuredDataElement) {
        const personSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": t('hero.name'),
          "jobTitle": t('hero.subtitle'),
          "url": url,
          "image": ogImage,
          "sameAs": [
            t('site.social.github'),
            t('site.social.linkedin'),
            t('site.social.twitter')
          ],
          "description": t('site.description'),
          "knowsAbout": t('skills.items').map((s: Skill) => s.name)
        };
        structuredDataElement.innerHTML = JSON.stringify(personSchema, null, 2);
      }
    }
  }, [t, language, isLoading]);
  
  // Command Palette Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Lock body scroll when a drawer or modal is open
  useEffect(() => {
    const isModalOpen = !!selectedProject || !!selectedBlogPost || !!selectedFeaturedProject;
    if (isModalOpen) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }
  }, [selectedProject, selectedBlogPost, selectedFeaturedProject]);


  if (isInitialLoad) {
    return <FullScreenLoader />;
  }
  
  return (
    <>
      <div className="relative antialiased text-neutral-800 dark:text-neutral-200">
        <GalaxyBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Blog />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
        <Chatbot />
        <WaveEffect />
      </div>
      <CommandPalette />
      <ProjectDetailDrawer />
      <BlogDetailDrawer />
      <FeaturedProjectModal />
    </>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CommandPaletteProvider>
        <ProjectDrawerProvider>
          <BlogDrawerProvider>
            <FeaturedProjectModalProvider>
              <SkillProvider>
                <AppContent />
              </SkillProvider>
            </FeaturedProjectModalProvider>
          </BlogDrawerProvider>
        </ProjectDrawerProvider>
      </CommandPaletteProvider>
    </ThemeProvider>
  );
};

export default App;
