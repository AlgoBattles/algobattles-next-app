"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  email: string;
  username: string;
  preferredLanguage: string;
  avatar: string;
  UID: string;
}

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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};