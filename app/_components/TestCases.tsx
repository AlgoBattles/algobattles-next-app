'use client'
import React, { useState } from 'react';
import TestCaseDetails from './TestCaseDetails';
import { useBattle } from '../_contexts/BattleContext';

function TabComponent (): React.ReactElement {
  const [activeTab, setActiveTab] = useState('Task');
  const { battle } = useBattle();
  const { algoPrompt }: { algoPrompt: string } = battle

  return (
    <div className="bg-gray-900 p-4 rounded-lg w-full overflow-y-auto overflow-x-auto">
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => { setActiveTab('Task') }} 
          className={`py-2 px-6 ${activeTab === 'Task' ? 'border-b-2 border-orange-500' : ''} text-white`}
        >
          Prompt
        </button>
        <button
          onClick={() => { setActiveTab('Test-cases') }}
          className={`py-2 px-6 ${activeTab === 'Test-cases' ? 'border-b-2 border-orange-500' : ''} text-white`}
        >
          Test-cases
        </button>
      </div>
      {activeTab === 'Task' && (
        <div className="text-gray-300">
          <p>{algoPrompt}</p>
        </div>
      )}
      {activeTab === 'Test-cases' && (
        <TestCaseDetails/>
      )}
    </div>
  );
}

export default TabComponent;