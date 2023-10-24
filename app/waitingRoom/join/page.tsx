"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Button from '@mui/material/Button';
import { useUser } from '../../_contexts/UserContext';
import Stopwatch from '@/app/_components/Stopwatch';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { checkAuthStatus, retrieveUserInfo } from '../../_helpers/authHelpers';

// import type { Database } from '@/lib/database.types'

export default function Home() {
  const { user, setUser } = useUser();
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);

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
        .eq('invitee_username', user.username)
    if (data && data.length >= 1) {
        // console.log('invite data is: ', data)
        // console.log('the invitee username is' , data[0].invitee_username)
        // console.log('my username is', user.username)
        setOpponentUsername(data[0].inviter_username)
        setOpponentAvatar(data[0].inviter_avatar)
        return data
    }
    else if (error) {
    console.log(error)
    return
    }
  }

  useEffect(() => {
    const checkEverything = async () => {
      if (!user.UID) {
        await checkAuthStatus(user, setUser);
      }
      else if (user.UID && !user.username) {
        await retrieveUserInfo(user, setUser);
      }
      else if (user.UID && user.username) {
        await retrieveInviteDetails();
      }
      console.log('use effect has updated user to: ', user)
    };
    checkEverything();
  }, [user])

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

    socket.on('message', ({message, action}) => {
        if (action === 'confirmation 2') {
            setReady(true)
        }
        else if (action === 'start battle') {
            router.push('/battle')
        }
      console.log('Received message:', message);
      console.log('Received action:', action);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
    
  }, []);

  const confirmBattle = () => {
    if (socketRef.current) {
      socketRef.current.emit('message', {room: `${currRoomId}`, action: 'confirm battle', message: 'bring it on'});
    }
  }


  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
      <div className="bg-gray-800 w-[400px] h-[400px] p-6 rounded-lg border-[1px] border-gray-700">
            <div className="mb-6 mt-6">
                <div className="text-2xl font-semibold mb-6 mt-6">{ready ? 'Starting battle...' : 'Ready to rumble?'}</div>
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
            <div className="mt-10">
            <Button onClick={confirmBattle} variant='outlined' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
                Ready
            </Button>
            </div>
            
      </div>
      </div>
    </div>
  );
}
