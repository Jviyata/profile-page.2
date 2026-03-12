import React, { createContext, useState, useCallback } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleMode = useCallback(() => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prevMode => !prevMode);
  }, []);

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isEditMode, setIsEditMode, toggleEditMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContext;
