'use client'
import React, { useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useUser } from '../_contexts/UserContext';

// import type { Database } from '@/lib/database.types'

export default function Home() {
  const { user, setUser } = useUser();

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

  useEffect(() => {
    console.log('user is: ', user)
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
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
