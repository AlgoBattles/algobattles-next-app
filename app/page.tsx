import React from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
        <Link href="/battle">
          <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play Random</Button>
        </Link>
        <Link href="/battle">
        <Button variant="outlined" className="mr-3 border border-gray-300 px-4 py-2 text-white">Play A Friend</Button>
        </Link>
      </div>
    </div>
  );
}
