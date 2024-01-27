'use client'
import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation'
import type { User } from '../_types/userTypes';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

interface UserProviderProps {
  children: ReactNode;
}

const defaultUserContext: UserContextType = {
  user: {
    email: '',
    username: '',
    preferredLanguage: '',
    avatar: '',
    UID: ''
  },
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUserContext.user);
  const router = useRouter()

  // useEffect(() => {
  //   console.log('pulling user')
  //   const getUserInfo = async (): Promise<void> => {
  //     if (user.UID === '') {
  //       const loggedIn = await checkAuthStatus(user, setUser);
  //       if (!loggedIn || loggedIn === null) {
  //         router.push('/')
  //       }
  //     } else if (user.UID !== null && user.username !== null) {
  //       await retrieveUserInfo(user, setUser);
  //     }
  //   };
  //   getUserInfo().catch(console.error );
  // }, [user])

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      // await supabase.auth.signOut()
      const userAuthInfo = await supabase.auth.getUser();
      console.log(userAuthInfo)
      if (userAuthInfo?.data?.user !== null) {
        const id = userAuthInfo.data.user.id
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('user_id', id)
        if (data !== null) {
          const { email, username, preferredLanguage, avatar } = data[0]
          setUser(({
            UID: id,
            email,
            username,
            preferredLanguage,
            avatar
          }))
        }
      } else {
        router.push('/')
      }
    }
    getUser().catch(console.error)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};