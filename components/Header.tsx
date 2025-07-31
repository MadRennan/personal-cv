import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../hooks/useLanguage';
import { useCommandPalette } from '../hooks/useCommandPalette';

// Icons
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


const Header: React.FC = () => {
  const { t } = useLanguage();
  const { open: openCommandPalette } = useCommandPalette();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { id: 'about', label: t('nav.about') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'blog', label: t('nav.blog') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // Close menu on navigation
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);


  return (
    <>
      <header 
        className="sticky top-0 z-30 w-full bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-2xl font-bold font-heading text-primary-600 dark:text-primary-400"
                aria-label="Back to top"
              >
                Rennan Lira
              </a>
            </div>
            <nav className="hidden md:flex md:space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="relative group font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                  <span className="nav-link-glow-span"></span>
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-1">
              <button onClick={openCommandPalette} className="hidden md:flex items-center gap-2 p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors" aria-label="Open command palette">
                <SearchIcon className="w-5 h-5" />
              </button>
              <ThemeToggle />
              <LanguageSwitcher />
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  aria-label="Open menu"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-neutral-50 dark:bg-neutral-950 shadow-xl md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 id="mobile-menu-title" className="text-lg font-semibold font-heading text-primary-600 dark:text-primary-400">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
            aria-label="Close menu"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4" aria-labelledby="mobile-menu-title">
          <ul className="space-y-2">
            <li>
                <button
                  onClick={() => { setIsMenuOpen(false); openCommandPalette(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-lg font-medium text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-primary-100/50 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-neutral-950"
                  style={{ animation: isMenuOpen ? `fadeInUp 0.3s ease-out 0.1s both` : undefined }}
                >
                  <SearchIcon className="w-5 h-5"/> Search...
                </button>
            </li>
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToSection(link.id)}
                  className="w-full text-left px-4 py-3 text-lg font-medium text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-primary-100/50 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-neutral-950"
                  style={{ animation: isMenuOpen ? `fadeInUp 0.3s ease-out ${index * 0.05 + 0.15}s both` : undefined }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Header;