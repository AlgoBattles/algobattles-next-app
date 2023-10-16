"use client";
import React, { useState } from 'react';
import TestCaseDetails from './TestCaseDetails';

type TestCase = {
    input: {
      [key: string]: any;
    };
    output: {
      [key: string]: any;
    };
  };

type TabComponentProps = {
    prompt: string;
    testCases: {
        [key: string]: TestCase;
    } | null;
    results: {
        [key: string]: any;
    } | null;
}

function TabComponent({ prompt, testCases, results }: TabComponentProps) {
  const [activeTab, setActiveTab] = useState('Task');
  const [activeTestCase, setActiveTestCase] = useState(0);

  return (
    <div className="bg-gray-900 p-4 rounded-lg w-full">
      <div className="flex border-b border-gray-700 mb-4">
        <button 
          onClick={() => setActiveTab('Task')} 
          className={`py-2 px-6 ${activeTab === 'Task' ? 'border-b-2 border-orange-500' : ''} text-white`}
        >
          Prompt
        </button>
        <button 
          onClick={() => setActiveTab('Test-cases')} 
          className={`py-2 px-6 ${activeTab === 'Test-cases' ? 'border-b-2 border-orange-500' : ''} text-white`}
        >
          Test-cases
        </button>
      </div>
      
      {activeTab === 'Task' && (
        <div className="text-gray-300">
          {/* Task content here... */}
          <p>{prompt}</p>
          {/* ... */}
        </div>
      )}

      {activeTab === 'Test-cases' && (
        <div className="text-gray-300">
          <TestCaseDetails testCases={testCases} results={results}/>
        </div>
      )}
    </div>
  );
}

export default TabComponent;