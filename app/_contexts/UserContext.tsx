"use client"
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'
import { checkAuthStatus, retrieveUserInfo } from '../_helpers/authHelpers';
import { User } from '../_types/userTypes';

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
    UID: '',
  },
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUserContext.user);
  const router = useRouter()

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user.UID) {
        const loggedIn = await checkAuthStatus(user, setUser);
        if (!loggedIn) {
          router.push('/')
          return
        }
      }
      else if (user.UID && !user.username) {
        await retrieveUserInfo(user, setUser);
      }
    };
    getUserInfo();
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};