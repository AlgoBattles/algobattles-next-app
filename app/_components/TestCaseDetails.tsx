import React, { useState } from 'react';
import { useBattle } from '../_contexts/BattleContext';
import { TestCase, Result } from '../_types/battleTypes';


const TabComponent = () => {
  const [selectedTab, setSelectedTab] = useState('Case 1');
  const { battle, setBattle } = useBattle();
  const { testCasesObj, userResults }: { testCasesObj: { [key: string]: TestCase } | null, userResults: Result[] | null } = battle;

  return (
    <div>
    {testCasesObj && 
    <div className="bg-black p-6 rounded-md w-[100%] h-[350px] overflow-x-auto">
      <div className="flex flex-row space-x-4">
        {['Case 1', 'Case 2', 'Case 3'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`py-2 px-4 rounded-md text-sm font-medium ${selectedTab === tab ? 'bg-gray-800' : 'bg-gray-700'}`}
          >
            {tab}
          </button>
        ))}
        <button className="ml-4 text-white">+</button>
      </div>
      <div>
        <div className="mt-4">
            <label className="text-grey text-med font-bold">Input</label>
        </div>
        {Object.keys(testCasesObj[selectedTab.toLowerCase().replace(/\s/g, '')].input).map((key, index) => (
            <div key={index}>
                <div className="">
                    <label className="text-white text-sm">{`${key} =`}</label>
                </div> 
                <div className="p-2 w-full rounded-md bg-gray-800 text-white">{JSON.stringify(testCasesObj[selectedTab.toLowerCase().replace(/\s/g, '')].input[key])}</div>
            </div>
        ))}
        <div className="mt-4">
            <label className="text-grey text-med font-bold">Output</label>
        </div>
        <div className="">
            <label className="text-white text-sm">expected =</label>
        </div>
        <div className="p-2 w-full rounded-md bg-gray-800 text-white">{JSON.stringify(testCasesObj[selectedTab.toLowerCase().replace(/\s/g, '')].output.expected)}</div>
        <div className="">
            <label className="text-white text-sm">received =</label>
        </div>
        <div className="p-2 w-full rounded-md bg-gray-800 text-white">{userResults && JSON.stringify(userResults[Number(selectedTab.slice(-1)) - 1])}</div>
      </div>
    </div>
    }
    </div>
  );
};

export default TabComponent;
