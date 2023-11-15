'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useUser } from '../_contexts/UserContext';
import { checkAuthStatus, retrieveUserInfo } from '../_helpers/authHelpers';

// import type { Database } from '@/lib/database.types'

export default function Home() {
  const { user, setUser } = useUser();
  const [inviteUsername, setInviteUsername] = useState<string | null>(null);
  const [inviteAvatar, setInviteAvatar] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const retrieveInviteDetails = async () => {
    const { data, error } = await supabase
        .from('battle_invites')
        .select()
        .eq('invitee_username', user.username)
    if (data && data.length >= 1) {
        setInviteUsername(data[0].inviter_username)
        setInviteAvatar(data[0].inviter_avatar)
        return data
    }
    else if (error) {
    console.log(error)
    return
    }
  }

  useEffect(() => {
    const checkForInvite = async () => {
      if (user.UID && user.username) {
        await retrieveInviteDetails();
      }
      // console.log('use effect has updated user to: ', user)
    };
    checkForInvite();
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="absolute top-0 right-0 flex justify-center items-center">
        {inviteUsername && inviteAvatar && <div className="flex flex-row bg-gray-800 w-[400px] h-[100px] p-6 rounded-lg border-[1px] border-gray-700">
            <div>{inviteAvatar}</div>
            <div>{inviteUsername}</div>
            <Link href={'/waitingRoom/join'}>
              <Button variant="outlined" className="ml-3 border border-gray-300 px-4 py-2 text-white">Review Challenge</Button>
            </Link>
        </div>
        }
      </div>
      <div className="flex justify-center items-center flex-grow">
        <Link href="/battle">
          <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play Random</Button>
        </Link>
        <Link href="/waitingRoom/sendInvite">
        <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play A Friend</Button>
        </Link>
      </div>
      <Button variant="outlined" onClick={handleSignOut} className="mr-3 border border-gray-300 px-4 py-2 text-white">Sign Out</Button> 
      {/* <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gold-gradient"></div> */}
    </div>
  );
}
