"use client"
import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Result, TestCase } from '../_types/battleTypes';
import { useUser } from '../_contexts/UserContext';
import { pullBattleStateFromDB } from '../_helpers/battleStateHelpers';

interface Battle {
  algoId: number;
  algoPrompt: string;
  funcName: string;
  templateCode: string;
  testCasesObj: { [key: string]: TestCase } | null;
  userRole: string;
  userId: string;
  opponentId: string;
  userCode: string;
  opponentCode: string;
  userResults: Result[] | null;
  opponentResults: Result[] | null;
  userProgress: number;
  opponentProgress: number;
  gameOver: boolean;
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
  const { user } = useUser();

  return (
    <BattleContext.Provider value={{ battle, setBattle }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = () => {
  return useContext(BattleContext);
};