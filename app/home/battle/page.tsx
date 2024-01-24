'use client'
import React, { useEffect, useRef } from 'react';
import Editor from '../../_components/Editor';
import OpponentEditor from '../../_components/OpponentEditor';
import TestCases from '../../_components/TestCases';
import OutputConsole from '@/app/_components/Output';
import GameOver from '../../_components/GameOverModal';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '../../_contexts/UserContext';
import { useBattle } from '../../_contexts/BattleContext';
import { pullBattleStateFromDB } from '../../_helpers/battleStateHelpers';

const Battle = () => {
  const router = useRouter()
  const { user } = useUser()
  const { battle, setBattle } = useBattle();

  const searchParams = useSearchParams()
  const battleId = searchParams.get('id')

  useEffect(() => {
    const setBattleState = async (): Promise<void> => {
      if (user.UID !== '' && battle.algoPrompt === '') {
        const result = await pullBattleStateFromDB(user, battle, setBattle, Number(battleId));
        if (result === null) {
          router.push('/home')
        }
      }
    };
    setBattleState().catch(console.error);
  }, [user])

  const socketRef = useRef<Socket | null>(null);
  const battleRoomId: string = 'b' + battleId;

  useEffect(() => {
    if (user.UID !== '') {
      // connect to socket server
      const serverURL = 'http://localhost:8081';
      const socket = io(serverURL, {
        query: {
          roomId: battleRoomId,
          userId: user.UID
        }
      });
      socket.on('connect', () => {
      });
      socket.on('message', ({ message, action }) => {
        if (action === 'player code') {
          console.log('new code')
          setBattle(prevBattle => ({ ...prevBattle, opponentCode: message }));
        }
        if (action === 'opponent progress') {
          setBattle(prevBattle => ({ ...prevBattle, opponentProgress: message }));
          if (message === 100) {
            setBattle(prevBattle => ({ ...prevBattle, gameOver: true, userWon: false }));
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
    battle.userCode !== '' && sendCode(battle.userCode);
  }, [battle.userCode]); 

  const sendCode = (message: string): void => {
    if (socketRef.current !== null) {
      socketRef.current.emit('message', { room: `${battleRoomId}`, action: 'player code', message: `${message}` });
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 w-full">
      <GameOver show={battle.gameOver} userWon={battle.userWon}></GameOver>
      <Editor sendCode={sendCode}></Editor>
      <OpponentEditor></OpponentEditor>
      <TestCases></TestCases>
      <OutputConsole></OutputConsole>
    </div>
    </div>
  );
};

export default Battle;