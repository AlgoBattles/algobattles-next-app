'use client'
import React from 'react';
import ProgressBar from './OpponentProgress';
import { useBattle } from '../_contexts/BattleContext';

const OpponentEditor = (): React.ReactElement => {
  const { battle } = useBattle();
  return (
    <div className="w-full h-[50vh] border border-red-700 rounded-[3px]">
      <div className="flex flex-row w-full h-[13%] rounded-[3px] bg-black justify-between">
      <ProgressBar percentage={battle.opponentProgress} />
      </div>
      <div className="w-full h-[87%] rounded-[3px]">
      <SkeletonEditor text={battle.opponentCode}/>
      </div>
    </div>
  );
};
const SkeletonEditor = ({ text }: { text: string }) => {
  const lines = text.split('\n'); // Split the text into lines
  return (
    <div className="w-full h-full bg-gray-950 p-4 box-border overflow-auto">
      {lines.map((line, index) => (
        <div
          key={index}
          className="h-4 mb-1 bg-gray-800"
          style={{ width: `${Math.min(line.length, 100)}%` }} // Set width based on line length, max 100%
        ></div>
      ))}
    </div>
  );
};

export default OpponentEditor;