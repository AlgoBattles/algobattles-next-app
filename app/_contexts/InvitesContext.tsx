"use client"
import React, { useEffect, useRef, createContext, useContext, useState, ReactNode } from 'react';
import io from 'socket.io-client';

interface Invite {
  inviteId: string;
  sender: string;
  recipient: string;
}

interface InvitesContextProps {
  invites: Invite[];
  addInvite: (inviteId: string, sender:string, recipient: string) => void;
  removeInvite: (inviteId: string) => void;
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

  useEffect(() => {

    // pull invites from server / redis

    // connect to socket server to listen for real time invites
    const serverURL = 'http://localhost:8081';
    const socket = io(serverURL, {
      query: {
        roomId: 'hello',
    }
    });
    socket.on('connect', () => {
      console.log('connected to socket in invites context');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the socket in invites context');
    });

    socket.on('message', ({message, action}) => {
      console.log('Received message in invites:', message);
      console.log('Received action in invites:', action);
    });

    return () => {
      socket.disconnect();
    };
    
  }, []);


  const addInvite = (inviteId: string, sender:string, recipient: string) => {
    setInvites([...invites, { inviteId, sender, recipient }]);
  };

  const removeInvite = (inviteId: string) => {
    setInvites(invites.filter((invite) => invite.inviteId !== inviteId));
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