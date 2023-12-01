"use client"
import React, { useEffect, useRef, createContext, useContext, useState, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from './UserContext';

interface Invite {
  id: string;
  sender: string;
  recipient: string;
}

interface InvitesContextProps {
  invites: Invite[];
  addInvite: (id: string, sender:string, recipient: string) => void;
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
          data.forEach((invite) => {
            addInvite(invite.id, invite.sender_id, invite.recipient_id)
          })
          return data
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
      // pull invites from server / redis
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
  
  
      // const ws = new WebSocket(`ws://localhost:9001?uuid=1234`);
  
      // ws.onopen = () => {
      //   console.log('connected to ws server');
      // };
    
    
  }, [user]);

  const addInvite = (id: string, sender:string, recipient: string) => {
    setInvites([...invites, { id, sender, recipient }]);
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