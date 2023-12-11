import React from 'react';
import { useBattle } from '../_contexts/BattleContext';

const OutputConsole = () => {
    const { battle } = useBattle();
    const output = battle.testOutput
    const lines = output && output.split('\n')
    return (
        <div className="bg-gray-900 p-4 rounded-lg w-full">
            <h1 className='pl-4 pb-2 pt-2 border-b border-gray-700'>Output</h1>
            <div className="bg-black text-white font-mono text-sm rounded-lg h-80 overflow-y-scroll p-4 mt-4">
            {lines && lines.map((line, index) => (
                <div key={index}>{line}</div>
            ))}
            </div>
        </div>
    );
};

export default OutputConsole;