"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useUser } from "../_contexts/UserContext";

export default function Home(): React.ReactElement {
  const { user, getUserInfo } = useUser();

  useEffect(() => {
    if (user.username === "") {
      getUserInfo().catch(console.error);
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center flex-grow">
        <Link href="/home/matchmaking/sendInvite">
          <div className="bg-gray-900 w-[600px] h-[420px] p-20 rounded-lg border-[1px] border-gray-700 flex flex-col items-center justify-between">
            <div className="text-3xl font-medium">{`Welcome, ${user.username}`}</div>
            <button className="px-8 py-4 text-lg font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-full">
              Join Lobby
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
