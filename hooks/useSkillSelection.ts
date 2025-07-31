import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Skill } from '../types';

interface SkillSelectionContextType {
  selectedSkill: Skill | null;
  selectSkill: (skill: Skill | null) => void;
}

const SkillSelectionContext = createContext<SkillSelectionContextType | undefined>(undefined);

export const SkillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const selectSkill = (skill: Skill | null) => {
    setSelectedSkill(skill);
  };

  return React.createElement(
    SkillSelectionContext.Provider,
    { value: { selectedSkill, selectSkill } },
    children
  );
};

export const useSkillSelection = (): SkillSelectionContextType => {
  const context = useContext(SkillSelectionContext);
  if (context === undefined) {
    throw new Error('useSkillSelection must be used within a SkillProvider');
  }
  return context;
};
