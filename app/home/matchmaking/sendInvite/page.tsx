"use client";
import React, { useState, useEffect, useRef } from "react";
import Typed from "typed.js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useUser } from "../../../_contexts/UserContext";

export default function SendInvite(): React.ReactElement {
  const { user } = useUser();
  const [opponent, setOpponent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();
  const handleOpponentInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setOpponent(event.target.value);
  };

  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Choose your next victim 😈"],
      typeSpeed: 50,
      showCursor: false,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  const handleSendInvite = async (): Promise<void> => {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .eq("username", opponent);
    if (userError !== null) {
      setError(userError.message);
    } else if (userData.length === 0) {
      setError("User not found");
    } else if (userData[0].username === user.username) {
      setError("You cannot invite yourself");
    } else if (userData.length >= 1) {
      const { data: inviteData, error: inviteError } = await supabase
        .from("battle_invites")
        .insert([
          {
            sender_id: user.UID,
            recipient_id: userData[0].user_id,
            sender_ready: false,
            recipient_ready: false,
          },
        ])
        .select();
      if (inviteError !== null) {
        setError(inviteError.message);
      } else if (inviteData[0] !== null && inviteData[0].id !== null) {
        router.push(`/home/matchmaking/lobby?id=${inviteData[0].id}`);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-gray-900 w-[400px] h-[320px] p-6 rounded-lg border-[1px] border-gray-700">
          <div className="mt-6">
            <div
              ref={el}
              className="text-2xl font-semibold mb-6 mt-6 min-h-[50px]"
            />
            <label className="text-white mb-2 block font-semibold">
              Username
            </label>
            <div className="flex items-center bg-black p-2 rounded">
              <input
                type="text"
                onChange={handleOpponentInput}
                placeholder="futureLoser"
                className="bg-transparent text-white flex-grow focus:outline-none"
              />
            </div>
          </div>
          <div className="h-8 mt-1">
            {error !== null && (
              <div className="text-red-500 text-sm block">{error}</div>
            )}
          </div>
          <button
            onClick={() => {
              handleSendInvite().catch(console.error);
            }}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 w-[100%] rounded-lg"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
