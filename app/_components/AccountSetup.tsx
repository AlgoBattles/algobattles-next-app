"use client"
import React, { useState } from 'react';
import Link from 'next/link'
import { useUser } from '../_contexts/UserContext';

function SignupComponent() {
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [lang, setLang] = useState('');

  const { user, setUser } = useUser();
    

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
          <div className="mr-2">
            🥜
          </div>
          <input type="text" placeholder="A nut" className="bg-transparent text-white flex-grow focus:outline-none" />
        </div>
      </div>
      
      <div className="mt-6 mb-6">
        <label className="text-white mb-2 block font-semibold">Choose language</label>
        <div className="flex gap-2">
        <button onClick={() => setLang('javascript')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${lang === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
        <button onClick={() => setLang('python')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${lang === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
      </div>
      <Link href="/home">
      <button className="bg-orange-500 text-white w-full py-2 rounded mt-10">CONTINUE</button>
      </Link>
      </div>
    </div>
  );
}

export default SignupComponent;
