"use client";
import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "./UserContext";

interface Invite {
  id: number;
  sender: string;
  senderUsername: string;
  senderAvatar: string;
  recipient: string;
}

interface InvitesContextProps {
  invites: Invite[];
  addInvite: (
    id: number,
    sender: string,
    recipient: string,
    senderUsername: string,
    senderAvatar: string,
  ) => void;
  removeInvite: (id: number) => void;
}

interface InvitesProviderProps {
  children: ReactNode;
}

export const InvitesContext = createContext<InvitesContextProps>({
  invites: [],
  addInvite: () => {},
  removeInvite: () => {},
});

export const InvitesProvider: React.FC<InvitesProviderProps> = ({
  children,
}) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const supabase = createClientComponentClient();
  const { user } = useUser();

  const retrieveInviteDetails = async (): Promise<void> => {
    const userId = (await supabase.auth.getUser())?.data?.user?.id ?? null;
    if (userId !== null) {
      const { data } = await supabase
        .from("battle_invites")
        .select()
        .eq("recipient_id", userId);
      if (data !== null && data.length >= 1) {
        for (const invite of data) {
          const { data: userData } = await supabase
            .from("users")
            .select()
            .eq("user_id", invite.sender_id);
          if (userData !== null && userData.length >= 1) {
            addInvite(
              invite.id,
              invite.sender_id,
              invite.recipient_id,
              userData[0].username,
              userData[0].avatar,
            );
          }
        }
      }
    }
  };
  useEffect(() => {
    // pull invites from postgres
    const checkForInvite = async (): Promise<void> => {
      await retrieveInviteDetails();
    };
    checkForInvite().catch(console.error);
    // connect to socket server to listen for real time invites
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "battle_invites" },
        (payload) => {
          console.log("Change received!", payload);
          retrieveInviteDetails().catch(console.error);
        },
      )
      .subscribe();
  }, [user]);

  const addInvite = (
    id: number,
    sender: string,
    recipient: string,
    senderUsername: string,
    senderAvatar: string,
  ) => {
    setInvites((prevInvites) => {
      if (!prevInvites.some((invite) => invite.id === id)) {
        return [
          ...prevInvites,
          { id, sender, recipient, senderUsername, senderAvatar },
        ];
      }
      return prevInvites;
    });
  };

  const removeInvite = (inviteId: number) => {
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
