"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Battle {
  email: string;
  battlename: string;
  preferredLanguage: string;
  avatar: string;
  password: string;
}

interface BattleContextType {
  battle: Battle;
  setBattle: React.Dispatch<React.SetStateAction<Battle>>;
}

interface BattleProviderProps {
  children: ReactNode;
}

const defaultBattleContext: BattleContextType = {
  battle: {
    email: '',
    battlename: '',
    preferredLanguage: '',
    avatar: '',
    password: '',
  },
  setBattle: () => {},
};

export const BattleContext = createContext<BattleContextType>(defaultBattleContext);

export const BattleProvider: React.FC<BattleProviderProps> = ({ children }) => {
  const [battle, setBattle] = useState<Battle>(defaultBattleContext.battle);

  return (
    <BattleContext.Provider value={{ battle, setBattle }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = () => {
  return useContext(BattleContext);
};