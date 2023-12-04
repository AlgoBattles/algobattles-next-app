"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useUser } from '../../../_contexts/UserContext';

// import type { Database } from '@/lib/database.types'

export default function Home() {
  const { user, setUser } = useUser();
  const [opponent, setOpponent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  
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
    else if (userData[0].username === user.username) {
      setError('You cannot invite yourself')
      setSuccess(null)
      return
    }
    else if (userData.length === 0) {
      console.log('hit user data length 0')
      setError('User not found')
      setSuccess(null)
      return
    }
    else if (userData.length >= 1) {
        console.log('user data is: ')
        console.log(userData)

        const { data: inviteData, error: inviteError } = await supabase
            .from('battle_invites')
            .insert([
                {
                    sender_id: user.UID,
                    recipient_id: userData[0].user_id,
                    sender_ready: false,
                    recipient_ready: false,
                }
            ])
            .select()
        if (inviteError) {
            setError(inviteError.message)
            console.log(error)
            return
        }
        else if (inviteData[0] && inviteData[0].id){
            setSuccess('Invite sent!')
            router.push(`/home/waitingRoom/lobby?id=${inviteData[0].id}`);
        }
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen">
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
