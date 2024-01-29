'use client'
import React from 'react';
import ProgressBar from './OpponentProgress';
import { useBattle } from '../_contexts/BattleContext';

const OpponentEditor = (): React.ReactElement => {
  const { battle } = useBattle();
  return (
    <div className="w-full h-full flex flex-col border border-red-700 rounded-[3px]">
      <div className="flex flex-row w-full rounded-[3px] bg-black">
      <ProgressBar percentage={battle.opponentProgress} />
      </div>
      <div className="w-full flex-grow rounded-[3px] overflow-y-auto">
      <SkeletonEditor text={battle.opponentCode}/>
      </div>
    </div>
  );
};
const SkeletonEditor = ({ text }: { text: string }): React.JSX.Element => {
  const lines = text === null
    ? null
    : text.split('\n'); // Split the text into lines
  return (
    <div className="h-full w-full bg-gray-950 p-4 box-border overflow-auto">
      {lines === null
        ? null
        : lines.map((line, index) => (
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