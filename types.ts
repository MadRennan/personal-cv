
import React from 'react';

export type Language = 'en' | 'pt' | 'ja' | 'es';

export interface Point {
  x: number;
  y: number;
}

export interface Skill {
  name: string;
  icon: string;
  category: 'Frontend' | 'Backend' | 'Tools' | 'Design' | 'Soft Skills' | 'Sciences';
  description: string;
  usedIn: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  challenges: string;
  outcome: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface FeaturedProject {
  title: string;
  description: string;
  detailedDescription: string;
  challenges: string;
  outcome: string;
  status: string;
  isWIP?: boolean;
  tech: string[];
  imageUrl: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  postUrl: string;
  views: number;
  likes: number;
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface WhyHireMeItem {
  icon: 'puzzle' | 'user' | 'team';
  title: string;
  description: string;
}

export interface CommandPaletteAction {
  id: string;
  type: 'navigation' | 'theme' | 'language' | 'social';
  label: string;
  icon: React.ReactNode;
  perform: (event?: React.MouseEvent) => void;
  keywords?: string[];
}
