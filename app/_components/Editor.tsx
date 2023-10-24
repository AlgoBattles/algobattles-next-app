"use client"
import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import ProgressBar from './ProgressBar';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { useUser } from '../_contexts/UserContext'
import { useBattle } from '../_contexts/BattleContext'


const supabaseClient = createClient(
  'https://jdrrftsbeohpznqghpxr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcnJmdHNiZW9ocHpucWdocHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0OTQ5NzIsImV4cCI6MjAwOTA3MDk3Mn0.3ZXOev203HqvH3X7UWE_B9X7NGYu0Z6tlmFyAi0ii4k'
);

type EditorProps = {
    templateCode: string | null;
    userCode: string | null;
    setUserCode: (code: string) => void | Dispatch<SetStateAction<null>>;
    setResults: (code: string) => void;
    testCases: {
        [key: string]: any;
    } | null;
  };

const AceEditor = () => {

  const { battle, setBattle } = useBattle();
  
  // {templateCode, userCode, setUserCode, testCases, setResults}: EditorProps
  
  const { 
    algoId, 
    algoPrompt, 
    funcName, 
    templateCode, 
    testCasesObj, 
    userRole, 
    userId, 
    opponentId, 
    userCode, 
    opponentCode, 
    userProgress, 
    opponentProgress, 
    gameStatus 
  } = battle;


  const editor1Ref = useRef();
  // const [userId , setUserId] = useState("oliver");
  const [testCasesArray, setTestCasesArray] = useState<any[][] | null>(null)

  const formatTestCases = (data) => { 
    const result = Object.values(data).map(key => {
    const inputValues = [key.input.nums, key.input.target];
    const expectedOutput = key.output.expected;
    return [inputValues, expectedOutput];
    })
    return result;
    };

  const checkIfActiveSession = async () => {
    const { data, error } = await supabaseClient
          .from('battle_sessions')
          .select('*')
          .eq('user_id', userId)
    // console.log('data', data)
    if (data && data.length > 0) {
        // console.log('hit active session')
        return
    }
    else {
        // console.log('creating session')
        await createUserContainer()
    }
  } 
  
  const createUserContainer = async () => {
    fetch('http://localhost:8080/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "lang": "js"
    })
    })
  }

  const runCode = async (code: string) => {
    const result = await fetch('http://localhost:8080/runCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            code: userCode,
            testCases: JSON.stringify(testCasesArray),
            userId: userId,
            funcName: "twoSum"
        })
    })
    // console.log('result is' + result)
    const data = await result.json()
    // console.log(data)
    setResults(data)
  }

  useEffect(() => {
    try {
    checkIfActiveSession()
    }
    catch (error){
      console.log(error)
    }
  }, []);

  useEffect(() => {
    const ace = require('ace-builds/src-noconflict/ace');
    require('ace-builds/src-noconflict/theme-chaos');
    require('ace-builds/src-noconflict/mode-javascript');
    const editor1 = ace.edit(editor1Ref.current);
    editor1.setTheme("ace/theme/chaos");
    editor1.session.setMode("ace/mode/javascript");
    userCode ? editor1.setValue(`${userCode}`) : editor1.setValue(`${templateCode}`);
    editor1.setOptions({
        fontSize: "10pt" 
      });
    // Add an event listener for the change event
    editor1.on('change', function() {
        const code = editor1.getValue();

        // setUserCode(`${code}`);
    });
  }, [templateCode]);


  useEffect(() => {
    if (testCasesObj) {
        setTestCasesArray(formatTestCases(testCasesObj))
    } 
    // console.log('testCasesArray', testCasesArray)
  }, [testCasesObj])


  return (
    <div className="w-full h-[50vh] border border-blue-700 rounded-[3px]">
    <div onClick={() => runCode(userCode)} className="flex flex-row w-full h-[13%] rounded-[3px] bg-black justify-between">
        <Button variant="contained" startIcon={<PlayArrowIcon />} className="h-8 w-30 bg-blue-500 hover:bg-blue-700 m-2 text-white" sx={{
            fontSize: '12px',
            fontFamily: 'arial',
            }}>Run code</Button>
        <ProgressBar percentage={70} />
    </div>
    <div id="editor1" ref={editor1Ref} className="w-full h-[87%] rounded-[3px]" />
    </div>
    );
};

export default AceEditor;