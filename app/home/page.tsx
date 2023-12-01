'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useUser } from '../_contexts/UserContext';
import { useHeaderHeight } from '../_contexts/HeaderContext';

// import type { Database } from '@/lib/database.types'

export default function Home() {
  const { user, setUser } = useUser();
  const [inviteUsername, setInviteUsername] = useState<string | null>(null);
  const [inviteAvatar, setInviteAvatar] = useState<string | null>(null);
  const [divHeight, setDivHeight] = useState(0);

  const headerHeight = useHeaderHeight();

  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const ws = new WebSocket(`ws://localhost:9001?uuid=1234`);
  
      ws.onopen = () => {
        console.log('connected to ws server in homepage');
      };


  useEffect(() => {
    const calculateDivHeight = () => {
      const screenHeight = window.innerHeight;
      const calculatedHeight = screenHeight - headerHeight;
      setDivHeight(calculatedHeight);
    };

    calculateDivHeight();
    window.addEventListener('resize', calculateDivHeight);

    return () => {
      window.removeEventListener('resize', calculateDivHeight);
    };
  }, [headerHeight]);

  return (
    <div className="flex flex-col" style={{ height: `${divHeight}px`}}>
      <div className="absolute top-0 right-0 flex justify-center items-center">
        {inviteUsername && inviteAvatar && <div className="flex flex-row bg-gray-800 w-[400px] h-[100px] p-6 rounded-lg border-[1px] border-gray-700">
            <div>{inviteAvatar}</div>
            <div>{inviteUsername}</div>
            <Link href={'home/waitingRoom/join'}>
              <Button variant="outlined" className="ml-3 border border-gray-300 px-4 py-2 text-white">Review Challenge</Button>
            </Link>
        </div>
        }
      </div>
      <div className="flex justify-center items-center flex-grow">
        <Link href="home/battle">
          <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play Random</Button>
        </Link>
        <Link href="home/waitingRoom/sendInvite">
        <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play A Friend</Button>
        </Link>
      </div>

    </div>
  );
}
