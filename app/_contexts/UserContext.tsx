"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "../_types/userTypes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  getUserInfo: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const defaultUserContext: UserContextType = {
  user: {
    email: "",
    username: "",
    preferredLanguage: "",
    avatar: "",
    UID: "",
  },
  setUser: () => {},
  getUserInfo: async (): Promise<void> => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUserContext.user);
  const router = useRouter();

  const getUserInfo = async (): Promise<void> => {
    const userAuthInfo = await supabase.auth.getUser();
    if (userAuthInfo?.data?.user !== null) {
      const { id, email } = userAuthInfo.data.user;
      const { data } = await supabase.from("users").select().eq("user_id", id);
      if (data !== null && data.length > 0) {
        const { email, username, preferredLanguage, avatar } = data[0];
        setUser({
          UID: id,
          email,
          username,
          preferredLanguage,
          avatar,
        });
      } else {
        if (email !== null && email !== "" && email !== undefined) {
          setUser({
            ...user,
            UID: id,
            email,
          });
        }
      }
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    getUserInfo().catch(console.error);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, getUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};
