import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CommandPaletteContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export const CommandPaletteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return React.createElement(
    CommandPaletteContext.Provider,
    { value: { isOpen, toggle, open, close } },
    children
  );
};

export const useCommandPalette = (): CommandPaletteContextType => {
  const context = useContext(CommandPaletteContext);
  if (context === undefined) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
  }
  return context;
};