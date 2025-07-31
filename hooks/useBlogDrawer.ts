import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlogPost } from '../types';

interface BlogDrawerContextType {
  selectedBlogPost: BlogPost | null;
  selectBlogPost: (post: BlogPost) => void;
  closeDrawer: () => void;
}

const BlogDrawerContext = createContext<BlogDrawerContextType | undefined>(undefined);

export const BlogDrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  const selectBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
  };

  const closeDrawer = () => {
    setSelectedBlogPost(null);
  };

  return React.createElement(
    BlogDrawerContext.Provider,
    { value: { selectedBlogPost, selectBlogPost, closeDrawer } },
    children
  );
};

export const useBlogDrawer = (): BlogDrawerContextType => {
  const context = useContext(BlogDrawerContext);
  if (context === undefined) {
    throw new Error('useBlogDrawer must be used within a BlogDrawerProvider');
  }
  return context;
};
