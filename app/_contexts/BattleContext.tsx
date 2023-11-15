"use client"
import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Result, TestCase } from '../_types/battleTypes';
import { useUser } from '../_contexts/UserContext';
import { Battle } from '../_types/battleTypes';

interface BattleContextType {
  battle: Battle;
  setBattle: React.Dispatch<React.SetStateAction<Battle>>;
}

interface BattleProviderProps {
  children: ReactNode;
}

const defaultBattleContext: BattleContextType = {
    battle: {
      battleId: 0,
      algoId: 0,
      algoPrompt: '',
      funcName: '',
      templateCode: '',
      testCasesObj: null,
      userRole: '',
      userId: '',
      opponentId: '',
      userCode: '',
      opponentCode: '',
      userResults: null,
      opponentResults: null,
      userProgress: 0,
      opponentProgress: 0,
      gameOver: false,
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