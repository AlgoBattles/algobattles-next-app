'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '../_contexts/UserContext'

export default function Home (): React.ReactElement {
  const { user, getUserInfo } = useUser()

  useEffect(() => {
    if (user.username === '') {
      getUserInfo().catch(console.error)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center flex-grow">
        <div className="flex flex-col relative bg-gray-800 w-[275px] h-[400px] items-center p-6 rounded-3xl border-[1px] border-gray-800 hover:border-gray-500 hover:border-2 m-3">
          <div className="ribbon font-semibold bg-gray-500 text-white py-1 px-4 transform -rotate-45 absolute top-12 left-0">
            Coming Soon...
          </div>
          <img src="/dice.png" className='h-[220px] w-[220px]'/>
          <p className='font-bold text-xl'>Play Random</p>
        </div>
        <Link href="/home/matchmaking/sendInvite">
        <div className="flex flex-col items-center bg-gray-800 w-[275px] h-[400px] p-6 rounded-3xl border-[1px] border-gray-800 hover:border-blue-500 hover:border-2 m-3">
          <img src="/group.png" className='mt-3 h-[190px] w-[190px]'/>
          <p className='mt-4 font-bold text-xl'>Play a Friend</p>
        </div>
        </Link>
      </div>
    </div>
  )
}
