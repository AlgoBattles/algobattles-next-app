"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useUser } from '../_contexts/UserContext';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import type { Database } from '@/lib/database.types'


function SignupComponent() {
  const { user, setUser } = useUser();
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [preferredLanguage, setLang] = useState('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.refresh()
  }

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleContinue = () => {
    setUser(({ ...user, avatar, username, preferredLanguage }));
  }

  useEffect(() => {
    console.log('context state is: ')
    console.log(user);
  }, [])


  return (
    <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">  
       <div className="mb-6">
        <label className="text-white mb-2 block font-semibold">Avatar</label>
        <div className="flex items-center bg-gray-900 p-2 rounded">
          <div className="mr-2">
            🥜
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-white mb-2 block font-semibold">Username</label>
        <div className="flex items-center bg-gray-900 p-2 rounded">
          <input type="text" onChange={handleEmailInput} placeholder="NerdRinser" className="bg-transparent text-white flex-grow focus:outline-none" />
        </div>
      </div>  
      <div className="mt-6 mb-6">
        <label className="text-white mb-2 block font-semibold">Choose language</label>
        <div className="flex gap-2">
        <button onClick={() => setLang('javascript')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${preferredLanguage === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
        <button onClick={() => setLang('python')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${preferredLanguage === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
      </div>
      <Link href="/home">
      <button onClick={handleSignUp} className="bg-orange-500 text-white w-full py-2 rounded mt-10">FINISH</button>
      </Link>
      </div>
    </div>
  );
}

export default SignupComponent;