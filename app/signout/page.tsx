'use client'
import React, { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const LogoutPage: React.FC = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleSignOut = async (): Promise<void> => {
      await supabase.auth.signOut()
      router.push('/')
    }
    handleSignOut().catch(console.error)
  }, [])

  return (
    <div>
      <h1>Signing out</h1>
      <ClipLoader color="#000000" loading={true} size={150} />
    </div>
  );
};

export default LogoutPage;