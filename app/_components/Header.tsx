"use client"
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useUser } from '../_contexts/UserContext';
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@mui/material';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Header = () => {
  const [showMailComponent, setShowMailComponent] = useState(false);
  const [showProfileComponent, setShowProfileComponent] = useState(false);
  const { user } = useUser();
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()


//   const retrieveInviteDetails = async () => {
//     const { data, error } = await supabase
//         .from('battle_invites')
//         .select()
//         .eq('invitee_username', user.username)
//     if (data && data.length >= 1) {
//         setInviteUsername(data[0].inviter_username)
//         setInviteAvatar(data[0].inviter_avatar)
//         return data
//     }
//     else if (error) {
//     console.log(error)
//     return
//     }
//   }

// const channels = supabase.channel('custom-all-channel')
// .on(
//   'postgres_changes',
//   { event: '*', schema: 'public', table: 'battle_invites' },
//   (payload) => {
//     console.log('Change received!', payload)
//     retrieveInviteDetails();
//   }
// )
// .subscribe()

//   useEffect(() => {
//     const checkForInvite = async () => {
//       if (user.UID && user.username) {
//         await retrieveInviteDetails();
//       } 
//     };
//     checkForInvite();
//   }, [user])

const MailComponent = () => {
  return (
    <div
      onMouseEnter={() => setShowMailComponent(true)}
      onMouseLeave={() => setShowMailComponent(false)}
    >
      <div className="absolute top-2/3 right-10 w-64 h-96 bg-white border border-red-300 rounded-lg p-4">
        Mail Component
      </div>
    
    </div>
  );
};

const ProfileComponent = () => {
  return (
    <div
      onMouseEnter={() => setShowProfileComponent(true)}
      onMouseLeave={() => setShowProfileComponent(false)}
    >
      <div className="absolute top-2/3 right-0 w-64 h-96 bg-gray-800 border border-gray-700 rounded-lg p-4">
        {/* <div className="w-5 h-5 border-solid border-t-4 border-l-4 border-r-4 bg-red"></div> */}
        <Button onClick={handleSignOut} variant='outlined' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
          Sign Out </Button>
      </div>
    </div>
  );
};

const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }


  return (
    <div style={{ borderBottom: '1px solid #ccc', position: 'relative' }}>
      <h1 style={{ fontFamily: 'LuckiestGuy', fontSize: '40px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px' }}>
        AlgoBattles
      </h1>
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', height: '100%' }}>
        <div className="mr-4 cursor-pointer flex">
        <FaEnvelope 
          onMouseEnter={() => setShowMailComponent(true)}
          onMouseLeave={() => setShowMailComponent(false)}
        />
        </div>
        <div className="mr-4 cursor-pointer flex flex-row items-center"
          onMouseEnter={() => setShowProfileComponent(true)}
          onMouseLeave={() => setShowProfileComponent(false)}>
        <FaUser className="mr-2"/>
        <div style={{ width: '100px', height: '20px', marginBottom: '4px'}}>{user.username.length > 1 && user.username || <Skeleton baseColor="#202020" highlightColor='#808080' borderRadius={0}/>}</div>
        </div>
      </div>
      {showMailComponent && <MailComponent />}
      {showProfileComponent && <ProfileComponent />}
    </div>
  );
};



export default Header;