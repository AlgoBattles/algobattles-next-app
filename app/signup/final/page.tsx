'use client'
import Head from 'next/head';
import React, { useState } from 'react';
import { useUser } from '../../_contexts/UserContext';
import Image from 'next/image'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/database.types'

export default function Page (): JSX.Element {
  const { user, setUser } = useUser();
  const [avatar, setAvatar] = useState<string | null>();
  const [username, setUsername] = useState<string | null>(null);
  const [preferredLanguage, setLang] = useState<string | null>(null);
  const [error, setError] = useState('')
  const { UID, email } = user

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handleFinish = async (): Promise<void> => {
    if (username !== null && username.length > 16) {
      setError('Username must be less than 16 characters')
    } else if (email !== '' && avatar !== '' && username !== '' && preferredLanguage !== '' && UID !== '') {
      setUser(({ ...user, email, avatar, username, preferredLanguage, UID }));
      console.log('user is: ', user)
      const { data, error } = await supabase
        .from('users')
        .insert([
          { user_id: UID, username, email, preferredLanguage, avatar },
        ])
        .select()
      if (data !== null) {
        console.log('data is: ', data)
        router.push('/home')
      } else if (error !== null) {
        setError(error.message)
        console.log(error)
      }
    } else {
      setError('Please fill out all fields')
      console.log()
    }
  }

  return (
    <div className="flex flex-col h-screen ">
      <h1 style={{ fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px' }} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">
        <div className="mb-6">
          <label className="text-white mb-2 block font-semibold">Avatar</label>
          <div className="flex gap-2">
          <button onClick={() => { setAvatar('dog.jpg') }} className={`px-2 py-2 text-[10pt] font-semibold rounded-xl ${avatar === 'dog.jpg' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>
            <Image src="/dog.jpg" width={40} height={40} alt="dog" />
          </button>
          <button onClick={() => { setAvatar('cat.jpg') }} className={`px-2 py-2 text-[10pt] font-semibold rounded-xl ${avatar === 'cat.jpg' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>
            <Image src="/cat.jpg" width={40} height={40} alt="dog" />
          </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="text-white mb-2 block font-semibold">Username</label>
          <div className="flex items-center bg-gray-900 p-2 rounded">
            <input type="text" onChange={handleUsernameInput} placeholder="NerdRinser" className="bg-transparent text-white flex-grow focus:outline-none" />
          </div>
        </div>
        <div className="mt-6 mb-6">
          <label className="text-white mb-2 block font-semibold">Choose language</label>
          <div className="flex gap-2">
          <button onClick={() => { setLang('javascript') }} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${preferredLanguage === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
          <button onClick={() => { setLang('python') }} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${preferredLanguage === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
          </div>
          <div className="h-10">
          <label className="text-red-500 text-sm mt-2 mb-2 block">{error}</label>
          </div>
          <button onClick={handleFinish} className="bg-orange-500 text-white w-full py-2 rounded-3xl font-bold mt-10">FINISH</button>
        </div>
      </div>
      </div>
    </div>
  );
}
