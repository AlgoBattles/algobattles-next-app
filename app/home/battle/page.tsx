"use client"
import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Editor from '../../_components/Editor';
import OpponentEditor from '../../_components/OpponentEditor';
import TestCases from '../../_components/TestCases';
import GameOver from '../../_components/GameOverModal';
import { createClient } from '@supabase/supabase-js'
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation'
import { useUser } from '../../_contexts/UserContext';
import { useBattle } from '../../_contexts/BattleContext';
import { pullBattleStateFromDB, pushBattleStateToDB } from '../../_helpers/battleStateHelpers';
import { truncate } from 'fs/promises';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient<Database>()

const Battle = () => {
  const router = useRouter()
  const { user, setUser } = useUser()
  const { battle, setBattle } = useBattle();
  const [battleWinner, setWinner] = useState<boolean>(false);

  useEffect(() => {
    const setBattleState = async () => {
      if (user.UID && !battle.algoPrompt) {
        const result = await pullBattleStateFromDB(user, battle, setBattle);
        if (!result) {
          router.push('/home')
        }
      } 
    };
    setBattleState();
  }, [user])


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
      if (action === 'opponent code') {
        setBattle(prevBattle => ({...prevBattle, opponentCode: message}));
      }
      if (action === 'opponent progress') {
        setBattle(prevBattle => ({...prevBattle, opponentProgress: message}));
        if (message === 100) {
          setBattle(prevBattle => ({...prevBattle, gameOver: true}));
        }
      }
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

  const sendProgress = (message: number) => {
    if (socketRef.current) {
      socketRef.current.emit('message', {room: `${currRoomId}`, action: 'opponent progress', message: message});
    }
    if (message === 100) {
      // display game over modal
      setWinner(true);
      // set game over
      setBattle(prevBattle => ({...prevBattle, gameOver: true}));
      // delete battle from db
      deleteBattle()
    }
  }

  const deleteBattle = async () => {
    console.log('deleting battle') 
    console.log('battle id is ', battle.battleId)
    const { data, error } = await supabase
        .from('battle_state')
        .delete()
        .eq('id', battle.battleId)
    if (error) {
      console.log('error deleting battle')
      console.log(error)
      return false
    }
    else if (data) {
      console.log('battle deleted')
      console.log(data)
      return true
    }
  }

  useEffect(() => {
    // emit to socket server
    battle.userCode && sendCode(battle.userCode);
  }, [battle.userCode]); 

  useEffect(() => {
    sendProgress(battle.userProgress);
  }, [battle.userProgress])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
    <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 w-full">
      <GameOver show={battle.gameOver} winner={battleWinner}></GameOver> 
      <Editor></Editor>
      <OpponentEditor></OpponentEditor>
      <TestCases></TestCases>
      <Button onClick={printBattleState}>TEST</Button>
    </div>
    </div>
    );
};

export default Battle;