
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeaturedProject } from '../types';

interface FeaturedProjectModalContextType {
  selectedFeaturedProject: FeaturedProject | null;
  selectFeaturedProject: (project: FeaturedProject) => void;
  closeModal: () => void;
}

const FeaturedProjectModalContext = createContext<FeaturedProjectModalContextType | undefined>(undefined);

export const FeaturedProjectModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFeaturedProject, setSelectedFeaturedProject] = useState<FeaturedProject | null>(null);

  const selectFeaturedProject = (project: FeaturedProject) => {
    setSelectedFeaturedProject(project);
  };

  const closeModal = () => {
    setSelectedFeaturedProject(null);
  };

  return React.createElement(
    FeaturedProjectModalContext.Provider,
    { value: { selectedFeaturedProject, selectFeaturedProject, closeModal } },
    children
  );
};

export const useFeaturedProjectModal = (): FeaturedProjectModalContextType => {
  const context = useContext(FeaturedProjectModalContext);
  if (context === undefined) {
    throw new Error('useFeaturedProjectModal must be used within a FeaturedProjectModalProvider');
  }
  return context;
};
