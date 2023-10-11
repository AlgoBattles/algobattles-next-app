import React, { useState } from 'react';

type TabComponentProps = {
  testCases: any[][][];
};

const TabComponent = ({testCases}: TabComponentProps) => {
  const [selectedTab, setSelectedTab] = useState('Case 1');

  return (
    <div className="bg-black p-6 rounded-md w-[100%]">
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
      {selectedTab === 'Case 1' && (
      <div className="space-y-4 mt-4">
        <div>
            <label className="text-grey text-med font-bold">Input</label>
        </div>
        <div className="-mb-4">
            <label className="text-white text-sm">nums =</label>
        </div> 
        <input type="text" className="p-2 w-full rounded-md bg-gray-800 text-white" value="[2,7,11,15]" />
        <div className="-mb-4">
            <label className="text-white text-sm">target =</label>
        </div> 
        <input type="text" className="p-2 w-full rounded-md bg-gray-800 text-white" value="9" />
        <div>
            <label className="text-grey text-med font-bold">Output</label>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default TabComponent;
