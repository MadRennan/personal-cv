
import React from 'react';
import Section from './Section';
import { BLOG_POSTS_BASE_DATA } from '../constants';
import { BlogPost } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useBlogDrawer } from '../hooks/useBlogDrawer';
import GenerativeImage from './GenerativeImage';

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const formatCount = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const { t } = useLanguage();
  const { selectBlogPost } = useBlogDrawer();
  const imagePrompt = `Abstract art for a blog post titled '${post.title}'. The content is about: ${post.excerpt}. Style: elegant, thoughtful, digital illustration, vibrant colors.`;
  return (
    <button onClick={() => selectBlogPost(post)} className="text-left bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg shadow-md hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-400/20 transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1 outline outline-2 outline-transparent hover:outline-primary-500/30 focus-within:outline-primary-500/30"
       aria-label={t('blog.cardAriaLabel', { title: post.title })}>
      <div className="h-48">
          <GenerativeImage
            imageId={`blog-${post.id}`}
            prompt={imagePrompt}
            alt={post.title}
            className="w-full h-full object-cover"
          />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{post.title}</h3>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300 flex-grow text-sm">{post.excerpt}</p>
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1" aria-label={t('blog.viewsAriaLabel', { count: String(post.views) })}>
                  <EyeIcon className="w-4 h-4" aria-hidden="true" />
                  <span aria-hidden="true">{formatCount(post.views)}</span>
              </span>
              <span className="flex items-center space-x-1" aria-label={t('blog.likesAriaLabel', { count: String(post.likes) })}>
                  <HeartIcon className="w-4 h-4" aria-hidden="true" />
                  <span aria-hidden="true">{formatCount(post.likes)}</span>
              </span>
          </div>
          <span className="font-medium text-primary-600 dark:text-primary-400" aria-hidden="true">{t('blog.readMore')}</span>
        </div>
      </div>
    </button>
  );
};

const Blog: React.FC = () => {
  const { t } = useLanguage();
  const translatedPosts: Omit<BlogPost, 'imageUrl' | 'postUrl' | 'views' | 'likes'>[] = t('blog.items');
  const blogTitle = t('blog.title');
  const blogSubtitle = t('blog.subtitle');

  if (!translatedPosts || !blogTitle) {
    return null;
  }
  
  const blogPosts: BlogPost[] = BLOG_POSTS_BASE_DATA.map(basePost => {
    const translated = translatedPosts.find(p => p.id === basePost.id);
    return { ...basePost, ...translated } as BlogPost;
  }).slice(0, 3); // Show only the first 3 posts

  return (
    <Section id="blog" title={blogTitle}>
        <p className="text-center text-lg text-neutral-600 dark:text-neutral-300 -mt-8 mb-12 max-w-2xl mx-auto">{blogSubtitle}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </Section>
  );
};

export default Blog;