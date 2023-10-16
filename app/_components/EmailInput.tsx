"use client"
import React, { useState } from 'react';
import Link from 'next/link'
import { useUser } from '../_contexts/UserContext';

function SignupComponent() {

  return (
    <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">
      {/* // some funny animation or illustration here */}
      <div className="mb-6 mt-6">
        <label className="text-white mb-2 block font-semibold">Email</label>
        <input type="email" placeholder="your-email@domain.com" className="w-full p-2 bg-gray-900 text-white rounded focus:outline-none" />
      </div>
      <Link href="/signup/final">
      <button className="bg-orange-500 text-white w-full py-2 rounded">CONTINUE</button>
      </Link>
    </div>
    )
}

export default SignupComponent;
