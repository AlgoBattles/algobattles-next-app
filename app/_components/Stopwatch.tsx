import React, { useState, useEffect } from 'react';
type StopwatchProps = {
    seconds: number;
  };

const Stopwatch: React.FC<StopwatchProps> = ({seconds}) => {
  return (
    <div className='text-4xl font-bold'>
      :{String(seconds).padStart(2, '0')}
    </div>
  );
}

export default Stopwatch;