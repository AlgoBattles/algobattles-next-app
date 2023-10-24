"use client"
import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Editor from '../_components/Editor';
import OpponentEditor from '../_components/OpponentEditor';
import TestCases from '../_components/TestCases';
import { createClient } from '@supabase/supabase-js'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation'
import { useUser } from '../_contexts/UserContext';
import { useBattle } from '../_contexts/BattleContext';
import { checkAuthStatus, retrieveUserInfo } from '../_helpers/authHelpers';
import { pullBattleStateFromDB, pushBattleStateToDB } from '../_helpers/battleStateHelpers';




const supabaseClient = createClient(
  'https://jdrrftsbeohpznqghpxr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcnJmdHNiZW9ocHpucWdocHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0OTQ5NzIsImV4cCI6MjAwOTA3MDk3Mn0.3ZXOev203HqvH3X7UWE_B9X7NGYu0Z6tlmFyAi0ii4k'
);

const Battle = () => {
  const router = useRouter()
  const { user, setUser } = useUser()
  const { battle, setBattle } = useBattle();
  const [funcName, setFuncName] = useState('foo');
  const [templateCode, setTemplateCode] = useState('')
  const [prompt, setPrompt] = useState('Loading...');
  const [testCases, setTestCases] = useState(null);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [userCode, setUserCode] = useState(null);
  const [opponentCode, setOpponentCode] = useState('Loading...');
  const [opponentProgress, setOpponentProgress] = useState(0);


  const getAlgoDetails = async () => {
    const { data, error } = await supabaseClient
          .from('algos')
          .select('*')
          .eq('id', 1)
    if (data) {
      setFuncName(data[0].func_name)
      setTemplateCode(data[0].template_code)
      setPrompt(data[0].prompt)
      setTestCases(data[0].test_cases_json) 
    }
  } 

  useEffect(() => {
    
  }, [user, battle]);

  useEffect(() => {
    const checkEverything = async () => {
      if (!user.UID) {
        const loggedIn = await checkAuthStatus(user, setUser);
        if (!loggedIn) {
          router.push('/')
          return
        }
      }
      else if (user.UID && !user.username) {
        await retrieveUserInfo(user, setUser);
      }
      else if (!battle.algoPrompt) {
        await pullBattleStateFromDB(user, battle, setBattle);
        // console.log('result from pullBattleStateFromDB', result)
        // console.log('use effect has updated battle state to' , battle)
      }
      // console.log('use effect has updated user to: ', user)
    };
    checkEverything();
  }, [user])




  useEffect(() => {
    try {
      getAlgoDetails()
    }
    catch (error){
      console.log(error)
    }
  }, []);

  const printBattleState = () => {
    console.log(battle)
  }


  const socketRef = useRef<Socket | null>(null);
  const currRoomId = 'room1';

  useEffect(() => {
    // connect to socket server
    const serverURL = 'http://localhost:8081';
    const socket = io(serverURL, {
      query: {
        roomId: currRoomId,
    }
    });
    socket.on('connect', () => {
      console.log('connected to socket server');
    });

    socket.on('message', ({message, action}) => {
      console.log('Received message:', message);
      console.log('Received action:', action);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
    
  }, []);

  const sendCode = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('message', {room: `${currRoomId}`, action: 'opponent code', message: `${message}`});
    }
  }

  useEffect(() => {
    // emit to socket server
    console.log('userCode', userCode)
    userCode && sendCode(userCode);
  }, [userCode]); 

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
    <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 w-full">
      <Editor templateCode={templateCode} userCode={userCode} setUserCode={setUserCode} testCases={testCases} setResults={setResults}></Editor>
      <OpponentEditor opponentCode={opponentCode} opponentProgress={opponentProgress}></OpponentEditor>
      <TestCases prompt={prompt} testCases={testCases} results={results}></TestCases>
      <Button onClick={printBattleState}>TEST</Button>
    </div>
    </div>
    );
};

export default Battle;