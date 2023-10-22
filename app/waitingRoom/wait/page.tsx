"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Button from '@mui/material/Button';
import { useUser } from '../../_contexts/UserContext';
import Stopwatch from '@/app/_components/Stopwatch';


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

  async function checkAuthStatus() {
    const user = await supabase.auth.getUser();
    if (user.data.user) {
      console.log('User is signed in:', user);
      return user
    } else {
      router.push('/')
    }
  }
  async function retrieveUserInfo() {
    const { data, error } = await supabase
        .from('users')
        .select()
    if (data) {
        setUser(({ ...user, email: data[0].email, avatar: data[0].avatar, username: data[0].username, preferredLanguage: data[0].preferredLanguage, UID: data[0].user_id }));
    }
    else if (error) {
    console.log(error)
    return
    }
  }

  const retrieveInviteDetails = async () => {
    const { data, error } = await supabase
        .from('battle_invites')
        .select()
        .eq('user_id', user.UID)
    if (data) {
        console.log('invite data is: ', data)
        setOpponentUsername(data[0].invitee_username)
        setOpponentAvatar(data[0].invitee_avatar)
        return data
    }
    else if (error) {
    console.log(error)
    return
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  const handleStartBattle = async () => {
    console.log('starting battle')
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      await checkAuthStatus();
      await retrieveUserInfo();
      await retrieveInviteDetails();
    };
    fetchUserInfo();
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    // Clean up function
    return () => clearInterval(intervalId);
  }, []);


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


  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
      <div className="bg-gray-800 w-[400px] h-[400px] p-6 rounded-lg border-[1px] border-gray-700">
            <div className="mb-6 mt-6">
                <div className="text-2xl font-semibold mb-6 mt-6">Waiting for opponent...</div>
            </div>
            <div>
                {opponentAvatar && opponentAvatar}
                {opponentUsername && opponentUsername}
            </div>
            <div>
                <Stopwatch seconds={seconds} />
            </div>
            { ready && <Button onClick={handleStartBattle} variant='outlined' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
                Ready
            </Button>
            }
      </div>
      </div>
    </div>
  );
}
