"use client"
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import { Email } from '@mui/icons-material';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/database.types'

export default function Home() {
  const [selected, setSelected] = useState('signup');
  const [lang, setLang] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
      console.log(error)
      return
    }
    else if (data) {
      router.push('/home')
    }
    // router.refresh()
  }

  async function checkAuthStatus() {
    const user = await supabase.auth.getUser();
    if (user.data.user) {
      router.push('/home')
      return user
    } else {
      return
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
    };
    checkAuth();
  }, [])
  return (
    <>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300&display=swap" rel="stylesheet"/>
    </Head>
    <div className="flex flex-col h-screen">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px', color: 'white'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
      <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">
      <div className="bg-gray-900 p-1 w-auto inline-block rounded-md mb-4">
      <button 
        onClick={() => setSelected('signup')}
        className={`px-6 py-2 rounded-md focus:outline-none transition-colors duration-200 font-bold text-lg
          ${selected === 'signup' ? 'bg-blue-600 text-white' : 'text-blue-300 bg-transparent'}`}
      >
        Sign up
      </button>
      <button 
        onClick={() => setSelected('login')}
        className={`px-6 py-2 ml-2 rounded-md focus:outline-none transition-colors duration-200 font-bold text-lg 
          ${selected === 'login' ? 'bg-blue-600 text-white' : 'text-blue-300 bg-transparent'}`}
      >
        Log in
      </button>
    </div>
    {selected === 'signup' && (
    <div className="flex flex-col items-center space-y-4 mt-[75px]">
        <button className=" bg-white hover:bg-white-100 text-black font-bold py-2 px-4 w-[100%] rounded-3xl">
        Sign up with Google
        </button>
        <button className=" bg-white hover:bg-white-100 text-black font-bold py-2 px-4 w-[100%] rounded-3xl">
        Sign up with Apple
        </button>
        <Link className='w-[100%]' href={`/signup/email`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[100%] rounded-3xl">
        Sign up with Email
        </button>
        </Link>
    </div>
      )}
        {selected === 'login' && (
            <div>
              <div className="mb-6 mt-6">
                <label className="text-white mb-2 block font-semibold">Email</label>
                <div className="flex items-center bg-gray-900 p-2 rounded">
                  <input type="text" onChange={handleEmailInput} placeholder="admiralsnackbar@algobattles.xyz" className="bg-transparent text-white flex-grow focus:outline-none" />
                </div>    
              </div>
              <div className="mb-6 mt-6">
                <label className="text-white mb-2 block font-semibold">Password</label>
                {/* <input type="password" onChange={handlePasswordInput} placeholder="Password" className="w-full p-2 bg-gray-900 text-white rounded focus:outline-none" /> */}
                <div className="flex items-center bg-gray-900 p-2 rounded">
                  <input type="password" onChange={handlePasswordInput} placeholder="Password" className="bg-transparent text-white flex-grow focus:outline-none" />
                </div>  
                <label className="text-red-500 text-sm mt-2 mb-2 block">{error}</label>
              </div> 
                <button onClick={handleSignIn} className="bg-orange-500 text-white w-full py-2 font-bold rounded-3xl">CONTINUE</button>
            </div>
        )}
    </div>
      </div> 
    </div>
    </>
  );
}
