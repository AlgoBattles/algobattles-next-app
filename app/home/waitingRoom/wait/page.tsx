"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Button from '@mui/material/Button';
import { useUser } from '../../../_contexts/UserContext';
import Stopwatch from '@/app/_components/Stopwatch';
import { Socket } from 'socket.io-client';

export default function Home() {
  const { user, setUser } = useUser();
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null); 

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);


  const supabase = createClientComponentClient<Database>()
  const router = useRouter()


  const retrieveInviteDetails = async () => {
    const { data, error } = await supabase
        .from('battle_invites')
        .select()
        .eq('inviter_username', user.username)
    if (data && data.length >= 1) {
        setOpponentUsername(data[0].invitee_username)
        setOpponentAvatar(data[0].invitee_avatar)
        setOpponentId(data[0].invitee)
        return data
    }
    else if (error) {
    console.log(error)
    return
    }
  }

  useEffect(() => {
    const checkEverything = async () => {
      if (user.UID && user.username && !opponentUsername) {
        await retrieveInviteDetails();
      }
      console.log('use effect has updated user to: ', user)
    };
    checkEverything();
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    // Clean up function
    return () => clearInterval(intervalId);
  }, []);


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

    socket.on('message', async ({message, action}) => {
        console.log('Received message:', message);
        console.log('Received action:', action);
        console.log('opponent id in socket receiver is', opponentId)
        if (action === 'confirm battle'){
            setReady(true)
            socket.emit('message', {room: `${currRoomId}`, action: 'confirmation 2', message: `${'confirmed'}`});  
            await handleStartBattle()
        }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
    
  }, [opponentId]);

  const handleStartBattle = async () => {
    console.log('starting battle')

    // first determine algo and fetch template code
    const algoNum = 1
    const { data: algoData, error: algoError } = await supabase
            .from('algos')
            .select('*')
            .eq('id', 1)
    if (algoData && algoData.length >= 1) {
        // then add battle to db
        console.log('adding battle to db')
        console.log('algo data is', algoData)
        const { data, error } = await supabase
            .from('battle_state')
            .insert([
                {
                    algo_id: algoNum,
                    algo_prompt: algoData[0].prompt,
                    func_name: algoData[0].func_name,
                    template_code: algoData[0].template_code,
                    test_cases_json: algoData[0].test_cases_json,
                    user1_id: user.UID,
                    user2_id: opponentId,
                    user1_code: algoData[0].template_code,
                    user2_code: algoData[0].template_code,
                    user1_progress: 0,
                    user2_progress: 0,
                    game_over: false
                }
            ])
            .select()
        if (data && data.length >= 1) {
            console.log('battle added to db')
            deleteInvite()
            socketRef.current && socketRef.current.emit('message', {room: `${currRoomId}`, action: 'start battle', message: `${'start'}`});
            router.push('/battle')
        }
    }
  }

  const deleteInvite = async () => {
    const { data, error } = await supabase
      .from ('battle_invites')
      .delete()
      .eq('inviter_username', user.username)
  }

  const handleTestButton = async () => {
    console.log('opponent id is', opponentId)
  }

  return (
    <div className="flex flex-col h-screen bg-black">

      <div className="flex justify-center items-center flex-grow">
      <div className="bg-gray-800 w-[400px] h-[400px] p-6 rounded-lg border-[1px] border-gray-700">
            <div className="mb-6 mt-6">
                <div className="text-2xl font-semibold mb-6 mt-6">{ready ? 'Starting battle...' : 'Waiting for opponent...'}</div>
            </div>
            <div className="flex flex-col">
                <div>
                {opponentAvatar && opponentAvatar}
                </div>
                <div>
                {opponentUsername && opponentUsername}
                </div>
            </div>
            <div>
                <Stopwatch seconds={seconds} />
            </div>
            {/* <Button onClick={handleTestButton} variant='outlined' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
                Test
            </Button> */}
            
      </div>
      </div>
    </div>
  );
}
