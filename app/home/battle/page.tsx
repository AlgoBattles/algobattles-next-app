"use client"
import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Editor from '../../_components/Editor';
import OpponentEditor from '../../_components/OpponentEditor';
import TestCases from '../../_components/TestCases';
import OutputConsole from '@/app/_components/Output';
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
import { useSearchParams } from 'next/navigation'

const supabase = createClientComponentClient<Database>()

const Battle = () => {
  const router = useRouter()
  const { user, setUser } = useUser()
  const { battle, setBattle } = useBattle();
  const [battleWinner, setWinner] = useState<boolean>(false);

  const searchParams = useSearchParams()
  const battleId = searchParams && searchParams.get('id')

  useEffect(() => {
    const setBattleState = async () => {
      if (user.UID && !battle.algoPrompt) {
        const result = await pullBattleStateFromDB(user, battle, setBattle, Number(battleId));
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
  const battleRoomId: string = 'b' + battleId;

  
  useEffect(() => {
    if (user.UID) {
      // connect to socket server
      const serverURL = 'http://localhost:8081';
      const socket = io(serverURL, {
        query: {
          roomId: battleRoomId,
          userId: user.UID
      }
      });
      socket.on('connect', () => {
        console.log('connected to socket server');
      });
  
      socket.on('message', ({message, action}) => {
        console.log('Received message:', message);
        console.log('Received action:', action);
        if (action === 'player code') {
          setBattle(prevBattle => ({...prevBattle, opponentCode: message}));
        }
        if (action === 'opponent progress') {
          setBattle(prevBattle => ({...prevBattle, opponentProgress: message}));
          if (message === 100) {
            setBattle(prevBattle => ({...prevBattle, gameOver: true, userWon: false}));
          }
        }
      });
  
      socketRef.current = socket;
      return () => {
        socket.disconnect();
      };
    }
    
  }, [user]);

  useEffect(() => {
    // emit code changes to socket server
    battle.userCode && sendCode(battle.userCode);
  }, [battle.userCode]); 

  const sendCode = (message: string) => {
    if (socketRef.current) {
      console.log('sending code')
      socketRef.current.emit('message', {room: `${battleRoomId}`, action: 'player code', message: `${message}`});
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center"> 
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 w-full">
      <GameOver show={battle.gameOver} userWon={battle.userWon}></GameOver> 
      <Editor></Editor>
      <OpponentEditor></OpponentEditor>
      <TestCases></TestCases>
      <OutputConsole></OutputConsole>
      {/* <Button onClick={printBattleState}>TEST</Button> */}
    </div>
    </div>
    );
};

export default Battle;