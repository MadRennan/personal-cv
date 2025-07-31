import React from 'react';
import Section from './Section';
import { useLanguage } from '../hooks/useLanguage';
import { WhyHireMeItem, Testimonial } from '../types';

// Helper to generate responsive image attributes from a picsum.photos URL.
const generateResponsiveImageProps = (imageUrl: string) => {
  if (!imageUrl.includes('picsum.photos/seed')) {
    const urlMatch = imageUrl.match(/\/(\d+)\/(\d+)$/);
    if (urlMatch) {
       return { src: imageUrl, srcSet: '', width: parseInt(urlMatch[1], 10), height: parseInt(urlMatch[2], 10) };
    }
    return { src: imageUrl, srcSet: '', width: 400, height: 400 };
  }

  const match = imageUrl.match(/\/seed\/([^/]+)\/(\d+)\/(\d+)/);
  if (!match) {
    const fallbackMatch = imageUrl.match(/\/(\d+)\/(\d+)$/);
    if (fallbackMatch) {
        return { src: imageUrl, srcSet: '', width: parseInt(fallbackMatch[1], 10), height: parseInt(fallbackMatch[2], 10) };
    }
    return { src: imageUrl, srcSet: '', width: 400, height: 400 };
  }

  const [, seed, baseWidthStr, baseHeightStr] = match;
  const baseWidth = parseInt(baseWidthStr, 10);
  const baseHeight = parseInt(baseHeightStr, 10);
  const aspectRatio = baseHeight / baseWidth;

  // Provide various widths for the browser to choose from
  const widths = [200, 400, 600, 800]; 
  const srcSet = widths
    .filter(w => w <= baseWidth)
    .map(w => {
      const h = Math.round(w * aspectRatio);
      return `https://picsum.photos/seed/${seed}/${w}/${h} ${w}w`;
    })
    .join(', ');

  return {
    src: imageUrl,
    srcSet,
    width: baseWidth,
    height: baseHeight,
  };
};

const PuzzleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-1.719-.668-3.303-1.76-4.492a4.484 4.484 0 00-6.082-1.513c-1.794.958-3.088 2.89-3.415 5.087a4.483 4.483 0 00.163 3.86.503.503 0 01-.334.634l-1.939.817a.503.503 0 00-.334.634 4.484 4.484 0 001.513 6.082c2.19.986 4.635.174 5.82-1.595l.186-.279a.502.502 0 01.695-.19l2.02.866a4.483 4.483 0 005.087-3.415.503.503 0 01.634-.334l.817-1.939a.503.503 0 00.634-.334 4.484 4.484 0 00-1.513-6.082c-.958-1.794-2.89-3.088-5.087-3.415a4.483 4.483 0 00-3.86.163.503.503 0 01-.634-.334l-.817-1.939a.503.503 0 00-.634-.334 4.484 4.484 0 00-6.082 1.513c-.986 2.19-.174 4.635 1.595 5.82l.279.186a.502.502 0 01.19.695l-.866 2.02a.503.503 0 01-.334.634 4.484 4.484 0 00-6.082-1.513c-2.19-.986-4.635-.174-5.82 1.595l-.186.279a.502.502 0 01-.695.19l-2.02-.866a4.483 4.483 0 00-5.087 3.415.503.503 0 01-.634.334l-1.939-.817a.503.503 0 00-.334-.634 4.484 4.484 0 001.513-6.082c.958-1.794 2.89-3.088 5.087-3.415a4.483 4.483 0 003.86-.163.503.503 0 01.634.334l1.939.817a.503.503 0 00.334.634 4.484 4.484 0 006.082-1.513c1.794-.958 3.088-2.89 3.415-5.087a4.483 4.483 0 00-.163-3.86.503.503 0 01.334-.634l1.939-.817a.503.503 0 00.334-.634 4.484 4.484 0 00-1.513-6.082c-2.19-.986-4.635-.174-5.82 1.595l-.279-.186a.502.502 0 01-.19-.695l.866-2.02a.503.503 0 01.334-.634 4.484 4.484 0 006.082 1.513z" />
  </svg>
);
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const TeamIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.034 1.243-1.95 2.062-2.72M12 10.5H12m-2.25-4.5H12m6.75 4.5H18m-3.75 2.25H18m-3.75 2.25H12m0-10.5h.008v.008H12V10.5zm-3.75 0h.008v.008H8.25V10.5zM12 3.75h.008v.008H12V3.75zm-3.75 0h.008v.008H8.25V3.75zM12 16.5h.008v.008H12V16.5zm-3.75 0h.008v.008H8.25V16.5zM12 12h.008v.008H12V12zm-3.75 0h.008v.008H8.25V12z" />
  </svg>
);

const iconMap = {
  puzzle: PuzzleIcon,
  user: UserIcon,
  team: TeamIcon,
};

const WhyHireMeCard: React.FC<{ item: WhyHireMeItem }> = ({ item }) => {
  const Icon = iconMap[item.icon];
  return (
    <div className="bg-neutral-100/50 dark:bg-neutral-900/50 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:border-primary-500/30">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 rounded-full">
        {Icon && <Icon className="w-8 h-8" />}
      </div>
      <h4 className="text-xl font-bold font-heading mb-2 text-neutral-800 dark:text-neutral-100">{item.title}</h4>
      <p className="text-neutral-600 dark:text-neutral-300">{item.description}</p>
    </div>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <figure className="bg-neutral-100/50 dark:bg-neutral-900/50 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-transform duration-300 transform hover:-translate-y-1">
    <blockquote className="text-lg italic text-neutral-700 dark:text-neutral-200">
      <p>"{testimonial.quote}"</p>
    </blockquote>
    <figcaption className="mt-4 text-right font-semibold text-neutral-600 dark:text-neutral-400">
      - {testimonial.author}
    </figcaption>
  </figure>
);

const About: React.FC = () => {
  const { t } = useLanguage();
  const whyHireMeItems: WhyHireMeItem[] = t('about.whyHireMe.items');
  const testimonials: Testimonial[] = t('about.testimonials.items');

  if (!t || !whyHireMeItems || !testimonials) return null;

  const profileImageProps = generateResponsiveImageProps('https://picsum.photos/seed/rennan-lira/400/400');

  return (
    <Section id="about" title={t('about.title')}>
      <div className="space-y-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-1 flex justify-center items-center">
             {/* New 3D Profile Picture structure */}
            <div className="profile-image-container w-48 h-48 sm:w-64 sm:h-64">
              {/* Layer 1: The background image, clipped inside the circle */}
              <img
                {...profileImageProps}
                alt="" // Decorative, as the main alt text is on the foreground image
                aria-hidden="true"
                className="profile-image-background"
                loading="lazy"
                decoding="async"
              />
              {/* Layer 2: The animated border */}
              <div className="profile-image-border" />
              {/* Layer 3: The foreground "spill" part of the image, with the primary alt text */}
              <img
                {...profileImageProps}
                alt={t('about.profileImageAlt')}
                className="profile-image-foreground"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="md:col-span-2 text-lg space-y-4 text-neutral-600 dark:text-neutral-300">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-center text-neutral-800 dark:text-neutral-100 mb-12">
            {t('about.whyHireMe.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyHireMeItems.map((item) => (
              <WhyHireMeCard key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-center text-neutral-800 dark:text-neutral-100 mb-12">
            {t('about.testimonials.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((item) => (
              <TestimonialCard key={item.author} testimonial={item} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;