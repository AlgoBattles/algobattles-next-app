"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useUser } from '../_contexts/UserContext';
import { useInvites } from '../_contexts/InvitesContext';
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@mui/material';
import { Invite } from '../_types/inviteTypes'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import Collapse from '@mui/material/Collapse';
import Slide from '@mui/material/Slide';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  transitions: {
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    },
  },
});

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const supabase = createClientComponentClient<Database>()

type UserData = {
    id: number;
    username: string;
    avatar: string;
    // Add any other properties of the user data here
  };

const Header = () => {
  const [showMailComponent, setShowMailComponent] = useState(false);
  const [showProfileComponent, setShowProfileComponent] = useState(false);
  const { user } = useUser();
  const { invites } = useInvites();
  const router = useRouter()

const MailComponent = () => {
      return (
        <ThemeProvider theme={theme}>
        <div
          key={uuidv4()}
          onMouseEnter={() => setShowMailComponent(true)}
          onMouseLeave={() => setShowMailComponent(false)}
          className='absolute top-12 right-10 w-64 h-96' 
        >
          <div style={{
            width: 0,
            height: 0,
            marginLeft: '81%',
            marginTop: '5px',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid #2d3748' // color equivalent to gray-800 in Tailwind
          }} />
          <div className="w-64 h-90 bg-gray-800 border border-gray-700 rounded-lg p-4">
            {invites.length > 0 ? invites.map((item) => (
              <InviteComponent key={uuidv4()} item={item} />
            )) : <div className="text-white">No invites yet...</div>}
          </div>
        </div>
        </ThemeProvider>
      );
    };

const InviteComponent = ({item}: {item: Invite}) => {
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [showDeclineButton, setShowDeclineButton] = useState(false);

  const joinButtonRef = useRef(null);
  const declineButtonRef = useRef(null);

  const { invites, removeInvite } = useInvites();

  const declineInviteHandler = async (id: number) => {
    const { data, error } = await supabase
      .from('battle_invites')
      .delete()
      .eq('id', id)
      .select()
    if (data) {
      removeInvite(id)
      console.log('invite declined')
    }
    else if (error) {
      console.log(error)
      return
    }
  }

  return (
    <div
            key={uuidv4()}
            className="flex flex-row items-center"
            style={{ position: 'relative', marginBottom: '10px'}}
          >
              <img src={item.sender && `/${item.senderAvatar}`} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
              <div className="flex flex-col">
                <div className="font-bold">{item.sender && item.senderUsername}</div>
                <div className="text-sm text-gray-500">invited you to a battle</div>
              </div>
              <div 
                onMouseEnter={() => setShowDeclineButton(true)}
                onMouseLeave={() => setShowDeclineButton(false)}
                className="absolute left-0 h-full w-1/2"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                ref={declineButtonRef}
                >
                {showDeclineButton && (
                  <Collapse in={showDeclineButton}>
                    <button onClick={() => declineInviteHandler(item.id)} className="bg-red-500 right-0 hover:bg-red-700 text-white font-bold font-md py-2.5 px-4 w-[100%] rounded-3xl">
                  Decline
                  </button>
                </Collapse>
              )}
              </div>
              <div 
                onMouseEnter={() => setShowJoinButton(true)}
                onMouseLeave={() => setShowJoinButton(false)}
                className="absolute right-0 h-full w-1/2"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                ref={joinButtonRef}
                >
                {showJoinButton && (
                <Link href={`/home/waitingRoom/lobby?id=${item.id}`}>  
                <Collapse in={showJoinButton}>
                <button className="bg-blue-500 right-0 hover:bg-blue-700 text-white font-bold font-md py-2.5 px-4 w-[100%] rounded-3xl"
                >
                  Join
                </button>
                </Collapse>
                </Link>
              )}
              </div>
            </div>
  )

}

const ProfileComponent = () => {
  const { user, setUser } = useUser();
  const setLang = async (newLanguage: string) => {
   

    const { data, error } = await supabase
      .from('users')
      .update(
        { 
        preferredLanguage: newLanguage
        }
      )
      .eq('email', user.email)
      .select()

    if (data && data.length > 0) {
      
      setUser({ ...user, preferredLanguage: data[0].preferredLanguage })
    }
    else if (error) {
      console.log(error)
      return
    }
  }

  return (
    <div
      onMouseEnter={() => setShowProfileComponent(true)}
      onMouseLeave={() => setShowProfileComponent(false)}
      className='absolute top-12 right-0 w-64 h-96'
    >
      <div style={{
            width: 0,
            height: 0,
            marginLeft: '80%',
            marginTop: '5px',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid #2d3748' // color equivalent to gray-800 in Tailwind
          }} />
      <div className="w-64 h-90 bg-gray-800 border border-gray-700 rounded-lg p-4">
        
        <div className="flex flex-col items-center">
          <img src={'/' + user.avatar} className="h-[100px] rounded-3xl"/>
          <div className="text-2xl font-semibold mt-2">{user.username}</div>
        </div>
        <div className="mt-5 ml-3 flex gap-2">
        <button onClick={async () => setLang('javascript')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${user.preferredLanguage === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
        <button onClick={async () => setLang('python')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${user.preferredLanguage === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
        </div>
        <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 w-[100%] rounded-3xl mt-10">
          Sign Out </button>
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
      <Link href="/home">
      <div className='max-w-20' style={{ display: 'inline-block' }}>
      <h1 style={{ fontFamily: 'LuckiestGuy', fontSize: '40px', textAlign: 'left', width: '25%', marginTop: '20px', marginLeft: '20px' }}>
        AlgoBattles
      </h1>
      </div>
      </Link>
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', height: '100%' }}>
        <div 
        onMouseEnter={() => setShowMailComponent(true)}
        onMouseLeave={() => setShowMailComponent(false)}
        className="mr-4 cursor-pointer flex">
        <FaEnvelope size={20}
        />
        </div>
        <div className="mr-4 cursor-pointer flex flex-row items-center"
          onMouseEnter={() => setShowProfileComponent(true)}
          onMouseLeave={() => setShowProfileComponent(false)}>
        <div className='mr-2'>{user.avatar ? <img src={'/' + user.avatar} className="h-[25px] rounded-3xl"/>: <Skeleton baseColor="#202020" highlightColor='#808080' circle={true} height={25} width={25} />}</div>
        {/* <div style={{ width: '100px', height: '20px', marginBottom: '7px', marginLeft: '2px', fontSize: 18, fontWeight: 'semibold'}}>{user.username.length > 1 && user.username || <Skeleton baseColor="#202020" highlightColor='#808080' borderRadius={0}/>}</div> */}
        </div>
      </div>
      {showMailComponent && <MailComponent />}
      {showProfileComponent && <ProfileComponent />}
    </div>
  );
};




export default Header;