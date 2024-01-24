'use client'
import React, { useState, useContext, createContext } from 'react';

interface WarningContextInfo {
  buttonTitle: string;
  warningMessage: string;
  link: string;
  isOpen: boolean;
};

interface WarningContextType {
  info: WarningContextInfo;
  setInfo: React.Dispatch<React.SetStateAction<WarningContextInfo>>;
}

interface WarningProviderProps {
  children: ReactNode;
}

// Create the context with default values
const defaultWarningContext: WarningContextType = ({
  info: {
    buttonTitle: '',
    warningMessage: '',
    link: '',
    isOpen: false
  }, 
  setInfo: () => {}
});

export const WarningContext = createContext<WarningContextType>(defaultWarningContext);

export const WarningProvider: React.FC<WarningProviderProps> = ({ children }) => {
  const [info, setInfo] = useState<WarningContextInfo>(defaultWarningContext.info);

  return (
    <WarningContext.Provider value={{ info, setInfo }}>
    {children}
    </WarningContext.Provider>
  );
};

export const useWarning = (): WarningContextType => {
  return useContext(WarningContext);
};

export default WarningContext;