"use client"
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useUser } from '../_contexts/UserContext';
import { useInvites } from '../_contexts/InvitesContext';
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@mui/material';
import { Invite } from '../_types/inviteTypes'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';

import { getUserInfo } from '../_helpers/userHelpers';

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
        <div
          key={uuidv4()}
          onMouseEnter={() => setShowMailComponent(true)}
          onMouseLeave={() => setShowMailComponent(false)}
          className='absolute top-12 right-10 w-64 h-96' 
        >
          <div style={{
            width: 0,
            height: 0,
            marginLeft: '46%',
            marginTop: '5px',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid #2d3748' // color equivalent to gray-800 in Tailwind
          }} />
          <div className="w-64 h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-y-scroll">
            {invites && invites.map((item) => (
              <InviteComponent key={uuidv4()} item={item} />
            ))}
          </div>
        </div>
      );
    };

const InviteComponent = ({item}: {item: Invite}) => {
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [showDeclineButton, setShowDeclineButton] = useState(false);

  return (
    <div
            key={uuidv4()}
            className="flex flex-row items-center"
            style={{ position: 'relative' }}
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
                >
                {showDeclineButton && (
                <Link href={`/home/waitingRoom/lobby?id=${item.id}`}>
                <button
                >
                  Decline
                </button>
                </Link>
              )}
              </div>
              <div 
                onMouseEnter={() => setShowJoinButton(true)}
                onMouseLeave={() => setShowJoinButton(false)}
                className="absolute right-0 h-full w-1/2"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                {showJoinButton && (
                <Link href={`/home/waitingRoom/lobby?id=${item.id}`}>
                <button
                >
                  Join Lobby
                </button>
                </Link>
              )}
              </div>
            </div>
  )

}

const ProfileComponent = () => {
  return (
    <div
      onMouseEnter={() => setShowProfileComponent(true)}
      onMouseLeave={() => setShowProfileComponent(false)}
      className='absolute top-12 right-0 w-64 h-96'
    >
      <div style={{
            width: 0,
            height: 0,
            marginLeft: '60%',
            marginTop: '5px',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid #2d3748' // color equivalent to gray-800 in Tailwind
          }} />
      <div className="w-64 h-96 bg-gray-800 border border-gray-700 rounded-lg p-4">
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
        <FaEnvelope 
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