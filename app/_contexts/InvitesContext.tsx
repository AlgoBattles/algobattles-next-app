"use client"
import React, { useEffect, useRef, createContext, useContext, useState, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from './UserContext';

interface Invite {
  id: string;
  sender: string;
  senderUsername: string;
  senderAvatar: string;
  recipient: string;
}

interface InvitesContextProps {
  invites: Invite[];
  addInvite: (id: string, sender:string, recipient: string, senderUsername: string, senderAvatar: string) => void;
  removeInvite: (id: string) => void;
}

interface InvitesProviderProps {
    children: ReactNode;
}

export const InvitesContext = createContext<InvitesContextProps>({
  invites: [],
  addInvite: () => {},
  removeInvite: () => {},
});

export const InvitesProvider: React.FC<InvitesProviderProps> = ({ children }) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const supabase = createClientComponentClient<Database>()
  const { user } = useUser();

  const retrieveInviteDetails = async () => {
    const userAuthInfo = await supabase.auth.getUser();
    if (userAuthInfo.data.user && userAuthInfo.data.user.id) {
      const { data, error } = await supabase
          .from('battle_invites')
          .select()
          .eq('recipient_id', userAuthInfo.data.user.id)
      if (data && data.length >= 1) {
          data.forEach(async (invite, index) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select()
              .eq('user_id', invite.sender_id)
            if (userError) {
              return
            }
            else if (userData && userData.length >= 1) {
              addInvite(invite.id, invite.sender_id, invite.recipient_id, userData[0].username, userData[0].avatar)
            }
          })
      }
      else if (error) {
      console.log(error)
      return
      }

    } 
  }

  useEffect(() => {
    console.log('user is' + user)
      console.log('user is inside' + user)
      // pull invites from postgres
      const checkForInvite = async () => {
          await retrieveInviteDetails();
      };
      checkForInvite();
      // connect to socket server to listen for real time invites
      const channels = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'battle_invites' },
        (payload) => {
          console.log('Change received!', payload)
          retrieveInviteDetails();
        }
      )
      .subscribe()
  }, [user]);

  const addInvite = (id: string, sender:string, recipient: string, senderUsername: string, senderAvatar: string) => {
    setInvites((prevInvites) => {
      if (!prevInvites.some((invite) => invite.id === id)) {
        return [...prevInvites, { id, sender, recipient, senderUsername, senderAvatar }];
      }
      return prevInvites;
    });
  };

  const removeInvite = (inviteId: string) => {
    setInvites(invites.filter((invite) => invite.id !== inviteId));
  };

  return (
    <InvitesContext.Provider value={{ invites, addInvite, removeInvite }}>
      {children}
    </InvitesContext.Provider>
  );
};

export const useInvites = () => {
  return useContext(InvitesContext);
};