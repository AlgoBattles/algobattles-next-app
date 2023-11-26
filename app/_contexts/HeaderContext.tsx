"use client"
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Header } from '../_components/Header';

interface HeaderContextProps {
  headerHeight: number;
}

export const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider = ({ children }: HeaderProviderProps) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <HeaderContext.Provider value={{ headerHeight }}>
      <div ref={headerRef}>
        <Header />
      </div>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderHeight = (): number => {
  const { headerHeight } = useContext(HeaderContext) || {};
  return headerHeight || 0;
};