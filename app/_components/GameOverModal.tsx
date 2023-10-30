import React from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Link from 'next/link';

interface GameOverProps {
    show: boolean;
    winner: boolean;
  }

  const GameOverModal: React.FC<GameOverProps> = ({ show, winner }) => {

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${show ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative h-[300px] w-[500px] bg-gray-700 p-4 rounded-lg text-center z-200 flex flex-col justify-between items-center py-8">
          <h2 className="text-2xl text-white">Game Over</h2>
            <h3 className="text-xl text-white">{winner ? 'You win!' : 'You lost!'}</h3>
          <Link href="/home">
            <Button variant="contained" color="primary">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  };

export default GameOverModal;