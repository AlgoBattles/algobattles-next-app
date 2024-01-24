'use client'
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// contexts and types
import { useUser } from '../_contexts/UserContext';
import { useInvites } from '../_contexts/InvitesContext';
import { useWarning } from '../_contexts/WarningContext';
import type { Invite } from '../_types/inviteTypes'

const theme = createTheme({
  transitions: {
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    }
  }
})

const supabase = createClientComponentClient()

const Header = (): React.ReactElement => {
  const [showMailComponent, setShowMailComponent] = useState(false);
  const [showProfileComponent, setShowProfileComponent] = useState(false);
  const { user } = useUser()
  const { invites } = useInvites()
  const { info, setInfo } = useWarning()
  const router = useRouter()
  const pathname = usePathname()

  const InboxComponent = (): React.ReactElement => {
    return (
      <ThemeProvider theme={theme}>
        <div
          key={uuidv4()}
          onMouseEnter={() => { setShowMailComponent(true) }}
          onMouseLeave={() => { setShowMailComponent(false) }}
          className='absolute top-11 right-10 w-64 h-96 z-50'>
          <div style={{
            width: 0,
            height: 0,
            marginLeft: '81%',
            marginTop: '5px',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid #2d3748' // color equivalent to gray-800 in Tailwind
          }} />
          <div
            className="w-64 h-90 bg-gray-800 border border-gray-700 rounded-lg p-4"
          >
            {invites.length > 0
              ? invites.map((item) => (
              <InviteComponent key={uuidv4()} item={item} />
              ))
              : <div className="text-white">No invites yet...</div>}
          </div>
        </div>
      </ThemeProvider>
    )
  }

  const InviteComponent = ({ item }: { item: Invite }): React.ReactElement => {
    const { removeInvite } = useInvites();

    const declineInviteHandler = async (id: number): Promise<void> => {
      // delete from db
      const { data } = await supabase
        .from('battle_invites')
        .delete()
        .eq('id', id)
        .select()
      if (data != null) {
        // delete from state
        removeInvite(id)
      }
    }
    return (
    <div key={uuidv4()} style={{ zIndex: 9999 }} className="flex flex-row items-center relative mb-2 z-50">
      <img src={item.sender !== '' ? `/${item.senderAvatar}` : undefined } alt="avatar" className="w-10 h-10 rounded-full mr-2" />
      <div className="flex flex-col">
        <div className="font-bold">{item.sender !== '' && item.senderUsername}</div>
        <div className="text-sm text-gray-500">invited you to a battle</div>
      </div>

      <div
        className="absolute left-0 h-full w-1/2"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <button
          onClick={() => { declineInviteHandler(item.id).catch(console.error) }}
          className={'bg-red-500 right-0 hover:bg-red-700 text-white font-bold font-md py-2.5 px-4 w-[100%] rounded-3xl opacity-0 hover:opacity-100'}
          style={{ width: '100%', height: '100%' }}
        >
          Decline
        </button>
      </div>
      <div
        className="absolute right-0 h-full w-1/2"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
        <Link href={`/home/matchmaking/lobby?id=${item.id}`}>
        <button className="bg-blue-500 right-0 hover:bg-blue-700 text-white font-bold font-md py-2.5 px-4 w-[100%] rounded-3xl opacity-0 hover:opacity-100"
        >
          Join
        </button>
        </Link>
      </div>
    </div>
    )
  }

  const ProfileComponent = (): React.ReactElement => {
    const { user, setUser } = useUser();
    const setLang = async (newLanguage: string): Promise<void> => {
      // update db
      const { data } = await supabase
        .from('users')
        .update(
          {
            preferredLanguage: newLanguage
          }
        )
        .eq('email', user.email)
        .select()
      // update state
      if (data !== null && data.length > 0) {
        setUser({ ...user, preferredLanguage: data[0].preferredLanguage })
      }
    }

    return (
    <div
      onMouseEnter={() => { setShowProfileComponent(true) }}
      onMouseLeave={() => { setShowProfileComponent(false) }}
      className='absolute top-11 right-0 w-64 h-96 z-50'
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
          <button onClick={() => { setLang('javascript').catch(console.error) }} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${user.preferredLanguage === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
          <button onClick={() => { setLang('python').catch(console.error) }} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${user.preferredLanguage === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
        </div>
          <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 w-[100%] rounded-3xl mt-10">
          Sign Out</button>
      </div>
    </div>
    )
  }

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const showWarningModal = (linkToRedirect: string): void => {
    if (pathname === '/home/battle') {
      setInfo({ ...info, isOpen: true, buttonTitle: 'Forfeit Battle', warningMessage: 'Are you sure you want to leave?', link: linkToRedirect })
    } else if (pathname === '/home/matchmaking/lobby') {
      setInfo({ ...info, isOpen: true, buttonTitle: 'Leave Lobby', warningMessage: 'Are you sure you want to leave?', link: linkToRedirect })
    } else {
      router.push('/home')
    }
  }

  return (
    <div className="border-b border-gray-300 relative">
        <div
          className="max-w-20 inline-block"
          onClick={() => { showWarningModal('/home') }}
        >
          <h1 className="font-luckiest-guy text-4xl text-left w-1/4 mt-5 ml-5 mb-2 cursor-pointer" style={{ fontFamily: 'LuckiestGuy' }}>
            AlgoBattles
          </h1>
        </div>
      <div className="absolute top-0 right-0 flex items-center h-full">
        <div
        onMouseEnter={() => { setShowMailComponent(true) }}
        onMouseLeave={() => { setShowMailComponent(false) }}
        className="mr-4 cursor-pointer flex">
        <FaEnvelope size={20}
        />
        </div>
        <div className="mr-4 cursor-pointer flex flex-row items-center"
          onMouseEnter={() => { setShowProfileComponent(true) }}
          onMouseLeave={() => { setShowProfileComponent(false) }}>
        <div className='mr-2'>{user.avatar !== '' ? <img src={'/' + user.avatar} className="h-[25px] rounded-3xl"/> : <Skeleton baseColor="#202020" highlightColor='#808080' circle={true} height={25} width={25} />}</div>
        </div>
      </div>
      {showMailComponent && <InboxComponent />}
      {showProfileComponent && <ProfileComponent />}
    </div>
  );
};

export default Header;