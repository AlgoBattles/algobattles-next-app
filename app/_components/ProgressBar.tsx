import React from 'react';

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex flex-col items-center bg-black text-white p-2 rounded-lg w-60">
      <div className="flex w-full items-center">
        <div className="mr-2.5 ml-6">
        <div className="text-right">
          <span className="block font-bold text-[16px]">{percentage}%</span>
          <span className="block mt-[-0.25rem] text-[10px] text-gray-400 font-light">TEST-CASES</span>
        </div>
        </div>
        <div className="flex-1 h-3.5 bg-gray-800 rounded-xl relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-blue-500 rounded-xl" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
