import React from "react";
import Link from "next/link";

interface GameOverProps {
  show: boolean;
  userWon: boolean | null;
}

const GameOverModal: React.FC<GameOverProps> = ({ show, userWon }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${show ? "" : "hidden"}`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative h-[300px] w-[500px] bg-gray-900 border-gray-700 border-[1px] p-4 rounded-lg text-center z-200 flex flex-col justify-between items-center py-8">
        <h2 className="text-2xl text-white">Game Over</h2>
        <h3 className="text-3xl text-white font-medium">
          {userWon !== null && userWon ? "You won!" : "You lost!"}
        </h3>
        <Link href="/home">
          <button className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GameOverModal;
