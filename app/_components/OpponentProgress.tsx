import React from 'react';

interface ProgressBarProps {
  percentage: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="flex flex-col items-center text-white p-2 rounded-lg z-0 w-[20vw] min-w-30 max-w-60">
      <div className="flex w-full items-center">
        <div className="mr-2.5 ml-2">
          <div className="text-right">
            <span className="block font-bold text-[16px]">{percentage}%</span>
            <span className="block mt-[-0.25rem] text-[10px] text-gray-400 font-light">TEST-CASES</span>
          </div>
        </div>
        <div className="flex-1 h-3.5 bg-gray-800 rounded-xl relative overflow-hidden z-0">
          <div
            className="absolute inset-y-0 left-0 bg-red-500 rounded-xl z-0"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
