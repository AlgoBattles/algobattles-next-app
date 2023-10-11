"use client"
import React, { useEffect, useRef, useState } from 'react';
import Editor from '../../components/Editor';
import OpponentEditor from '../../components/OpponentEditor';
import TestCases from '../../components/TestCases';

const Battle = () => {

  const [prompt, setPrompt] = useState('Write your code here');
  const [opponentCode, setOpponentCode] = useState('Write your code here');
  const [progress, setProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [testCases, setTestCases] = useState([]);


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
    <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
    <div className="grid grid-cols-2 grid-rows-2 flex flex-col min-h-screen gap-4 p-4 w-full">
      <Editor></Editor>
      <OpponentEditor></OpponentEditor>
      <TestCases></TestCases>
    </div>
    </div>
    );
};

export default Battle;