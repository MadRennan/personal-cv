import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '../types';

interface ProjectDrawerContextType {
  selectedProject: Project | null;
  selectProject: (project: Project) => void;
  closeDrawer: () => void;
}

const ProjectDrawerContext = createContext<ProjectDrawerContextType | undefined>(undefined);

export const ProjectDrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const closeDrawer = () => {
    setSelectedProject(null);
  };

  return React.createElement(
    ProjectDrawerContext.Provider,
    { value: { selectedProject, selectProject, closeDrawer } },
    children
  );
};

export const useProjectDrawer = (): ProjectDrawerContextType => {
  const context = useContext(ProjectDrawerContext);
  if (context === undefined) {
    throw new Error('useProjectDrawer must be used within a ProjectDrawerProvider');
  }
  return context;
};
