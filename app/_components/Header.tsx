"use client"
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useUser } from '../_contexts/UserContext';
import { useInvites } from '../_contexts/InvitesContext';
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@mui/material';
import Link from 'next/link'

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
    const [mailData, setMailData] = useState<{ id: number, sender: UserData }[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          const data = await Promise.all(
            invites.map(async (invite) => {
              const sender = await getUserInfo(invite.sender);
              return {
                id: invite.id,
                sender: sender
              };
            })
          );
          setMailData(data);
        };
        if (invites && invites.length >= 1) {
          fetchData();
        }
      }, [invites]);

      const [showJoinButton, setShowJoinButton] = useState(false);

      return (
        <div
          onMouseEnter={() => setShowMailComponent(true)}
          onMouseLeave={() => setShowMailComponent(false)}
        >
          <div className="absolute top-2/3 right-10 w-64 h-96 bg-gray-800 border border-gray-700 rounded-lg p-4">
            {mailData.map((item) => (
            <div
            className="flex flex-row items-center"
            style={{ position: 'relative' }}
            onMouseEnter={(e) => {
                if ((e.target as HTMLElement).clientWidth / 2 < e.nativeEvent.offsetX) {
                  setShowJoinButton(true);
                }
              }}
              onMouseLeave={(e) => {
                if ((e.target as HTMLElement).clientWidth / 2 > e.nativeEvent.offsetX) {
                  setShowJoinButton(false);
                }
              }
            }
          >
              <img src={item.sender && `/${item.sender.avatar}`} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
              <div className="flex flex-col">
                <div className="font-bold">{item.sender && item.sender.username}</div>
                <div className="text-sm text-gray-500">invited you to a battle</div>
              </div>
              {showJoinButton && (
                <Link href={`/home/waitingRoom/lobby?id=${item.id}`}>
                <button
                  style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
                >
                  Join Lobby
                </button>
                </Link>
              )}
            </div>
            ))}
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
      <Link href="/home">
      <h1 style={{ fontFamily: 'LuckiestGuy', fontSize: '40px', textAlign: 'left', width: '25%', marginTop: '20px', marginLeft: '20px' }}>
        AlgoBattles
      </h1>
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