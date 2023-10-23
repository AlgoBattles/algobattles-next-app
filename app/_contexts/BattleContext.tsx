"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Battle {
  algo_id: number;
  algo_prompt: string;
  func_name: string;
  template_code: string;
  test_cases_obj: string;
  user1_id: string;
  user2_id: string;
  user1_code: string;
  user2_code: string;
  user1_progress: number;
  user2_progress: number;
  game_status: string;
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
      algo_id: 0,
      algo_prompt: '',
      func_name: '',
      template_code: '',
      test_cases_obj: '',
      user1_id: '',
      user2_id: '',
      user1_code: '',
      user2_code: '',
      user1_progress: 0,
      user2_progress: 0,
      game_status: '',
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