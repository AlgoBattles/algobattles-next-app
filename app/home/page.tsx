'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useUser } from '../_contexts/UserContext';

// import type { Database } from '@/lib/database.types'

export default function Home() {

  const { user, setUser } = useUser();

  const [inviteUsername, setInviteUsername] = useState<string | null>(null);
  const [inviteAvatar, setInviteAvatar] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  async function checkAuthStatus() {
    const userAuthInfo = await supabase.auth.getUser();
    if (userAuthInfo.data.user) {
      console.log('User is signed in:', userAuthInfo.data.user);
      if (userAuthInfo.data.user.id) {
        setUser(({ ...user, UID: userAuthInfo.data.user.id }));
        return userAuthInfo.data.user.id 
      }
    } else {
      router.push('/')
    }
  }
  async function retrieveUserInfo() {
    console.log('hitting retrieve user info')
    console.log('user is', user)
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.UID)
    console.log(data)
    if (data && data.length >= 1) {
        console.log('setting user state')
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
        .eq('invitee_username', user.username)
    if (data && data.length >= 1) {
        console.log('invite data is: ', data)
        console.log('the invitee username is' , data[0].invitee_username)
        console.log('my username is', user.username)
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
    const checkEverything = async () => {
      if (!user.UID) {
        await checkAuthStatus();
      }
      else if (user.UID && !user.username) {
        await retrieveUserInfo();
      }
      else if (user.UID && user.username) {
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
