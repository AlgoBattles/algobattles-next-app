"use client"
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Button from '@mui/material/Button';
import { useUser } from '../../../_contexts/UserContext';
import Stopwatch from '@/app/_components/Stopwatch';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const id = searchParams && searchParams.get('id')

  console.log('lobby id is', id)

  const retrieveInviteDetails = async () => {
    const { data, error } = await supabase
        .from('battle_invites')
        .select()
        .eq('id', id)
    if (data && data.length >= 1) {
        setOpponentId(data[0].recipient)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select()
            .eq('user_id', data[0].recipient)
        if (userData && userData.length >= 1) {
            setOpponentUsername(userData[0].username)
            setOpponentAvatar(userData[0].avatar)
        }
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
      // console.log('use effect has updated user to: ', user)
    };
    checkEverything();
  }, [user])


  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setSeconds(seconds => seconds + 1);
  //   }, 1000);
  //   // Clean up function
  //   return () => clearInterval(intervalId);
  // }, []);


  const socketRef = useRef<Socket | null>(null);
  const lobbyRoomId: string = 'l' + id;

  useEffect(() => {
    // connect to socket server
    const serverURL = 'http://localhost:8081';
    const socket = io(serverURL, {
      query: {
        roomId: lobbyRoomId,
        userId: user.UID
    }
    });
    socket.on('connect', () => {
      console.log('connected to socket server');
    });

    socket.on('message', async ({message, action}) => {
        console.log('Received message:', message);
        console.log('Received action:', action);
        // console.log('opponent id in socket receiver is', opponentId)
        if (action === 'start battle'){
          const { battle_id, algo_id } = message;
          localStorage.clear();
          router.push(`/home/battle?id=${battle_id}`)
        }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
    
  }, [opponentId]);


  const handleReadyUp = async () => {
    console.log('readying up')
    socketRef.current && socketRef.current.emit('message', {room: `${lobbyRoomId}`, action: 'player ready', message: 'ready'});
    setReady(true)
  }

  return (
    <div className="flex flex-col h-screen">
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
            <Button onClick={handleReadyUp} variant='outlined' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
                Ready Up
            </Button>
            
      </div>
      </div>
    </div>
  );
}
