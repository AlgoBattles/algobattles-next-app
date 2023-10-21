"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { useUser } from '../_contexts/UserContext';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import type { Database } from '@/lib/database.types'

function SignupComponent() {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('')
  
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()


  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }
  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const setStateObj = () => {
    setUser(({ ...user, email}));
  }

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      console.log(error)
      return
    }
    else if (data) {
      router.push('/signup/verify')
    }
    router.refresh()
  }

  useEffect(() => {
    console.log('context state is: ')
    console.log(user);
  }, [user])

  return (
    <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">
      {/* // some funny animation or illustration here */}
      <div className="mb-6 mt-6">
        <label className="text-white mb-2 block font-semibold">Email</label>
        <input type="email" onChange={handleEmailInput} placeholder="admiralsnackbar@algobattles.xyz" className="w-full p-2 bg-gray-900 text-white rounded focus:outline-none" />
      </div>
      <div className="mb-6 mt-6">
          <label className="text-white mb-2 block font-semibold">Password</label>
          <input type="password" onChange={handlePasswordInput} placeholder="Password" className="w-full p-2 bg-gray-900 text-white rounded focus:outline-none" />
          <label className="text-red-500 text-sm mt-2 mb-2 block">{error}</label>
      </div>
      <button onClick={setStateObj} className="bg-orange-500 text-white w-full py-2 rounded">test state</button>
      <button onClick={handleSignUp} className="bg-orange-500 text-white w-full py-2 rounded">CONTINUE</button>
    </div>
    )
}

export default SignupComponent;
