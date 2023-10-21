'use client'
import React, { useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

// import type { Database } from '@/lib/database.types'

// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  async function getUserInfo() {
    const user = await supabase.auth.getUser();
    if (user) {
      console.log('User is signed in:', user);
      return user

    } else {
      console.log('No user is signed in');
    }
  }
  useEffect(() => {
    const fetchUserInfo = async () => {
      await getUserInfo();
    };
    fetchUserInfo();
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh()
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
        <Link href="/battle">
          <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play Random</Button>
        </Link>
        <Link href="/battle">
        <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play A Friend</Button>
        </Link>
      </div>
      <Button variant="outlined" onClick={handleSignOut} className="mr-3 border border-gray-300 px-4 py-2 text-white">Sign Out</Button> 
      {/* <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gold-gradient"></div> */}
    </div>
  );
}
