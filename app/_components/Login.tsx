"use client"
import React, { useState } from 'react';
import Link from 'next/link'

function SignupComponent() {
    const [selected, setSelected] = useState('signup');
    const [lang, setLang] = useState('');

  return (
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
    <div>
      <div className="mb-6">
        <label className="text-white mb-2 block font-semibold">Username</label>
        <div className="flex items-center bg-gray-900 p-2 rounded">
          <div className="mr-2">
            🥜
          </div>
          <input type="text" placeholder="A nut" className="bg-transparent text-white flex-grow focus:outline-none" />
        </div>
      </div>
      <div className="mb-6">
        <label className="text-white mb-2 block font-semibold">Choose language</label>
        <div className="flex gap-2">
        <button onClick={() => setLang('javascript')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${lang === 'javascript' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>JavaScript</button>
        <button onClick={() => setLang('python')} className={`px-4 py-2 text-[10pt] font-semibold rounded-3xl ${lang === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-500'}`}>Python</button>
      </div>
      <div className="mb-6 mt-6">
        <label className="text-white mb-2 block font-semibold">Email</label>
        <input type="email" placeholder="your-email@domain.com" className="w-full p-2 bg-gray-900 text-white rounded focus:outline-none" />
      </div>
      <Link href="/home">
      <button className="bg-orange-500 text-white w-full py-2 rounded">CONTINUE</button>
      </Link>
      </div>
      </div>
      )}
        {selected === 'login' && (
            <div>

            </div>
        )}
    </div>
  );
}

export default SignupComponent;
