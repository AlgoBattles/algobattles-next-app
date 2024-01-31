"use client";
import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";
import type { Battle } from "../_types/battleTypes";

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
    algoPrompt: "",
    funcName: "",
    templateCodeJS: "",
    templateCodePython: "",
    testCasesObj: null,
    userRole: "",
    userId: "",
    opponentId: "",
    userCode: "",
    opponentCode: "",
    userResults: null,
    opponentResults: null,
    testOutput: null,
    userProgress: 0,
    opponentProgress: 0,
    gameOver: false,
    userWon: null,
  },
  setBattle: () => {},
};

export const BattleContext =
  createContext<BattleContextType>(defaultBattleContext);

export const BattleProvider: React.FC<BattleProviderProps> = ({ children }) => {
  const [battle, setBattle] = useState<Battle>(defaultBattleContext.battle);
  return (
    <BattleContext.Provider value={{ battle, setBattle }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = (): BattleContextType => {
  return useContext(BattleContext);
};
