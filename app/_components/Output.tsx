import React from 'react';
import { useBattle } from '../_contexts/BattleContext';

const OutputConsole = (): React.ReactElement => {
  const { battle } = useBattle();
  const lines = battle?.testOutput === null ? null : battle?.testOutput?.split('\n');
  return (
    <div className="flex flex-col bg-gray-900 p-4 rounded-lg w-full">
        <h1 className='pl-4 pb-2 pt-2 border-b border-gray-700'>Output</h1>
        <div className="bg-black flex-grow text-white font-mono text-sm rounded-lg overflow-y-scroll p-4 mt-4">
        {lines === null
          ? null
          : lines?.map((line, index) => (
            index > 0 && <div key={index}>{line}</div>
          ))}
        </div>
    </div>
  );
};

export default OutputConsole;