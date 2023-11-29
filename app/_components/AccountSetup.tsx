"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useUser } from '../_contexts/UserContext';
import Image from 'next/image'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/database.types'


function SignupComponent() {
  const { user, setUser } = useUser();
  const [avatar, setAvatar] = useState<string | null>();
  const [username, setUsername] = useState<string | null>(null);
  const [preferredLanguage, setLang] = useState<string | null>(null);
  const [error, setError] = useState('')
  
  const { UID, email} = user

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handleFinish = async () => {
    console.log('user is', user)
    if (email && avatar && username && preferredLanguage && UID) {
      setUser(({ ...user, email, avatar, username, preferredLanguage, UID }));
      console.log('user is: ', user)
      const { data, error } = await supabase
          .from('users')
          .insert([
            { user_id: UID, username, email, preferredLanguage, avatar },
          ])
          .select()
      if (data) {
          console.log('data is: ', data)
          router.push('/home')
      }
      else if (error) {
      setError(error.message)
      console.log(error)
      return
      }
    }
    else {
      setError('Please fill out all fields')
      console.log()
    }
  }


  useEffect(() => {
    console.log('context state is: ')
    console.log(user);
  }, [user])


  return (
    <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">  
       <div className="mb-6">
        <label className="text-white mb-2 block font-semibold">Avatar</label>
        <div className="flex gap-2">
        <button onClick={() => setAvatar('dog.jpg')} className={`px-2 py-2 text-[10pt] font-semibold rounded-xl ${avatar === 'dog.jpg' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>
          <Image src="/dog.jpg" width={40} height={40} alt="dog" />
        </button>
        <button onClick={() => setAvatar('cat.jpg')} className={`px-2 py-2 text-[10pt] font-semibold rounded-xl ${avatar === 'cat.jpg' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>
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
        <button onClick={() => setLang('javascript')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${preferredLanguage === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
        <button onClick={() => setLang('python')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${preferredLanguage === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
        </div>
        <label className="text-red-500 text-sm mt-2 mb-2 block">{error}</label>
        <button onClick={handleFinish} className="bg-orange-500 text-white w-full py-2 rounded mt-10">FINISH</button>
      </div>
    </div>
  );
}

export default SignupComponent;
