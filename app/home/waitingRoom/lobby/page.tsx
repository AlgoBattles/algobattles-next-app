"use client"
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { useUser } from '../../../_contexts/UserContext';
import Stopwatch from '@/app/_components/Stopwatch';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Skeleton from 'react-loading-skeleton';

export default function Home() {
  const { user, setUser } = useUser();
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null); 
  const [opponentJoined, setOpponentJoined] = useState<boolean>(false);
  const [opponentReady, setOpponentReady] = useState<boolean>(false);
  const [opponentLanguage, setOpponentLanguage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams && searchParams.get('id')

  const retrieveInviteDetails = async () => {
    const { data, error } = await supabase
        .from('battle_invites')
        .select()
        .eq('id', id)
    if (data && data.length >= 1) {
        console.log('data is', data)
        const tempOpponentId = data[0].recipient_id === user.UID ? data[0].sender_id : data[0].recipient_id
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select()
            .eq('user_id', tempOpponentId)
        if (userData && userData.length >= 1) {
            setOpponentId(tempOpponentId)
            setOpponentUsername(userData[0].username)
            setOpponentAvatar(userData[0].avatar)
            setOpponentLanguage(userData[0].preferredLanguage)
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
      console.log('lobby room id is', lobbyRoomId)
      socket.emit('message', {action: 'player joined lobby', message: 'joined', room: lobbyRoomId});
    });

    socket.on('message', async ({message, action}) => {
        console.log('Received message:', message);
        console.log('Received action:', action);
        if (action === 'player joined lobby') {
          setOpponentJoined(true)
        }
        else if (action === 'player left lobby') {
          setOpponentJoined(false)
        }
        else if (action === 'player ready') {
          setOpponentJoined(true)
          setOpponentReady(true)
        }
        // console.log('opponent id in socket receiver is', opponentId)
        else if (action === 'start battle'){
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
    // console.log('readying up')
    socketRef.current && socketRef.current.emit('message', {room: `${lobbyRoomId}`, action: 'player ready', message: 'ready'});
    setReady(true)
  }




  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center items-center flex-grow">
      <div className={`flex flex-col bg-gray-800 w-[400px] h-[400px] rounded-lg border-[1px] border-gray-700 ${opponentReady ? 'bg-green-gradient' : 'bg-gold-gradient'}`}>
        <div className='px-6 py-4'>
            <div className="mb-6">
                {opponentReady ? 
                <div className={`text-2xl font-semibold mb-6 mt-6 text-green-400`}>Opponent is ready...</div> :
                <div className={`text-2xl font-semibold mb-6 mt-6 text-white`}>Waiting for opponent...</div>
                }
                
            </div>
            <div className="flex flex-col">
              <div className={`flex flex-row p-2 items-center bg-gray-900 border-[1.5px] ${opponentReady ? 'border-green-600' : 'border-gray-700'} rounded-xl`}>
                {opponentAvatar && <img className="h-[50px] rounded-xl" src={`/${opponentAvatar}`}></img>}
                <div className="flex flex-col ml-6">
                {opponentUsername ?  <div className='text-xl font-semibold'>{opponentUsername}</div> : <Skeleton baseColor="#202020" highlightColor='#808080'></Skeleton>}
                {opponentLanguage ? <div className='text-xs font-light'>{opponentLanguage.toUpperCase()}</div> : <Skeleton baseColor="#202020" highlightColor='#808080'></Skeleton>}
                </div>
              </div>
            </div>
            </div>
            <div className='flex flex-col bg-gray-900 w-full mt-8 items-center flex-grow overflow-y-clip rounded-bl-lg rounded-br-lg'>
            {
              !ready ? <button onClick={handleReadyUp} className="bg-orange-500 mt-12 py-2 px-32 hover:bg-orange-600 text-white font-bold text-lg rounded-lg">
                I'm Ready
            </button> :
            <button onClick={() => console.log('nothing')} className="bg-gray-700 border-[1px] border-gray-600 mt-12 py-2 px-32 font-bold text-lg text-green-400 rounded-lg">
              I'm Ready
            </button> 
            }  
          </div>
      </div>
      </div>
    </div>
  );
}
