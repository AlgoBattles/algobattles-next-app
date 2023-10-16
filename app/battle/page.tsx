"use client"
import React, { useEffect, useRef, useState } from 'react';
import Editor from '../_components/Editor';
import OpponentEditor from '../_components/OpponentEditor';
import TestCases from '../_components/TestCases';
import { createClient } from '@supabase/supabase-js'
import io from 'socket.io-client';

const supabaseClient = createClient(
  'https://jdrrftsbeohpznqghpxr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcnJmdHNiZW9ocHpucWdocHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0OTQ5NzIsImV4cCI6MjAwOTA3MDk3Mn0.3ZXOev203HqvH3X7UWE_B9X7NGYu0Z6tlmFyAi0ii4k'
);

const Battle = () => {

  const [funcName, setFuncName] = useState('foo');
  const [templateCode, setTemplateCode] = useState('')
  const [prompt, setPrompt] = useState('Loading...');
  const [testCases, setTestCases] = useState(null);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [userCode, setUserCode] = useState(null);
  const [opponentCode, setOpponentCode] = useState('Loading...');
  const [opponentProgress, setOpponentProgress] = useState(0);

  useEffect(() => {
    
    // check redis for active battle 

    // if active battle, load battle state from redis

    // else create new battle state and add to redis

    try {
      const algoNum = Math.floor(Math.random() * 2)
      const setAlgo = async () => {
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
    setAlgo()
    }
    catch (error){
      console.log(error)
    }
  }, []);


  // battle in redis

  // key = user_id, value = battle id

  // key = battle_id, value = {
  // algo_id: ,
  // user1_id: , 
  // user2_id: , 
  // user1_code: , 
  // user2_code: 
  // user1_progress: , 
  // user2_progress: , 
  // game_status: "active", "complete"
  // }


  const socketRef = useRef(null);
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

  const sendCode = (message) => {
    if (socketRef.current) {
      socketRef.current.emit('message', {room: `${currRoomId}`, action: 'opponent code', message: `${message}`});
    }
  }


  useEffect(() => {
    // emit to socket server
    console.log('userCode', userCode)
    sendCode(userCode);
  }, [userCode]);

  



  


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
    <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 w-full">
      <Editor templateCode={templateCode} userCode={userCode} setUserCode={setUserCode} testCases={testCases} setResults={setResults}></Editor>
      <OpponentEditor opponentCode={opponentCode} opponentProgress={opponentProgress}></OpponentEditor>
      <TestCases prompt={prompt} testCases={testCases} results={results}></TestCases>
    </div>
    </div>
    );
};

export default Battle;