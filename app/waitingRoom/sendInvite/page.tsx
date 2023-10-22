"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useUser } from '../../_contexts/UserContext';

// import type { Database } from '@/lib/database.types'

export default function Home() {
  const { user, setUser } = useUser();
  const [opponent, setOpponent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
  useEffect(() => {
    const fetchUserInfo = async () => {
      await checkAuthStatus();
      await retrieveUserInfo();
    };
    fetchUserInfo();
  }, [])

  const handleOpponentInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpponent(event.target.value);
  }

  const handleSendInvite = async () => {
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('username', opponent) 

    if (userError) {
        setError(userError.message)
        console.log(error)
        return
    }
    else if (userData.length == 0) {
      console.log('hit user data length 0')
      setError('User not found')
      setSuccess(null)
    }
    else if (userData.length >= 1) {
        console.log('user data is: ')
        console.log(userData)

        const { data: inviteData, error: inviteError } = await supabase
            .from('battle_invites')
            .insert([
                {
                    user_id: user.UID,
                    invitee: userData[0].user_id,
                    invitee_username: userData[0].username,
                    invitee_avatar: userData[0].avatar,
                    socket_room: 'room1'
                }
            ])
            .select()
        if (inviteError) {
            setError(inviteError.message)
            console.log(error)
            return
        }
        else if (inviteData){
            console.log(inviteData)
            setSuccess('Invite sent!')
            router.push('/waitingRoom/wait')
        }
    }
  }

  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
      <div className="bg-gray-800 w-[400px] h-[400px] p-6 rounded-lg border-[1px] border-gray-700">
            <div className="mb-6 mt-6">
                <div className="text-2xl font-semibold mb-6 mt-6">Choose your next victim 😈</div>
                <label className="text-white mb-2 block font-semibold">Username</label>
                <div className="flex items-center bg-gray-900 p-2 rounded">
                  <input type="text" onChange={handleOpponentInput} placeholder="futureLoser" className="bg-transparent text-white flex-grow focus:outline-none" />
                </div>  
            </div>
              {error && !success && <div className="text-red-500 text-sm mt-2 mb-2 block">{error}</div>}
              {success && <div className="text-green-500 text-sm mt-2 mb-2 block">{success}</div>}
              <Button onClick={handleSendInvite} variant='outlined' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
                  Send Invite
              </Button>
      </div>
      </div>
    </div>
  );
}
