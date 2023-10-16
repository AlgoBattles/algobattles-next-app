import React, { useState } from 'react';

type TestCase = {
    input: {
      [key: string]: any;
    };
    output: {
      [key: string]: any;
    };
  };

type Result = {
      [key: string]: any;
};

  type TabComponentProps = {
    testCases: {
      [key: string]: TestCase;
    } | null;
    results: Result[] | null; 
  };

const TabComponent = ({testCases, results}: TabComponentProps) => {
  const [selectedTab, setSelectedTab] = useState('Case 1');
  return (
    <div>
    {testCases && 
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
        {Object.keys(testCases[selectedTab.toLowerCase().replace(/\s/g, '')].input).map((key, index) => (
            <div key={index}>
                <div className="">
                    <label className="text-white text-sm">{`${key} =`}</label>
                </div> 
                <div className="p-2 w-full rounded-md bg-gray-800 text-white">{JSON.stringify(testCases[selectedTab.toLowerCase().replace(/\s/g, '')].input[key])}</div>
            </div>
        ))}
        <div className="mt-4">
            <label className="text-grey text-med font-bold">Output</label>
        </div>
        <div className="">
            <label className="text-white text-sm">expected =</label>
        </div>
        <div className="p-2 w-full rounded-md bg-gray-800 text-white">{JSON.stringify(testCases[selectedTab.toLowerCase().replace(/\s/g, '')].output.expected)}</div>
        <div className="">
            <label className="text-white text-sm">received =</label>
        </div>
        <div className="p-2 w-full rounded-md bg-gray-800 text-white">{results && JSON.stringify(results[Number(selectedTab.slice(-1)) - 1].received)}</div>
      </div>
    </div>
    }
    </div>
  );
};

export default TabComponent;
