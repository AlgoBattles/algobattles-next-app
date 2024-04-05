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
          <div className="flex flex-col bg-black items-center w-[275px] h-[400px] p-6 rounded-3xl border-[1px] border-gray-800 hover:border-blue-500 hover:border-2 m-3">
            <img
              src="/group.png"
              alt="friends"
              className="mt-3 h-[190px] w-[190px]"
            />
            <p className="mt-4 font-bold text-xl">Play a Friend</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
