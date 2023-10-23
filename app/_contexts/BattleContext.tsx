"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Battle {
  algoId: number;
  algoPrompt: string;
  funcName: string;
  templateCode: string;
  testCasesObj: string;
  userRole: string;
  userId: string;
  opponentId: string;
  userCode: string;
  opponentCode: string;
  userProgress: number;
  opponentProgress: number;
  gameStatus: string;
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
      algoId: 0,
      algoPrompt: '',
      funcName: '',
      templateCode: '',
      testCasesObj: '',
      userRole: '',
      userId: '',
      opponentId: '',
      userCode: '',
      opponentCode: '',
      userProgress: 0,
      opponentProgress: 0,
      gameStatus: '',
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