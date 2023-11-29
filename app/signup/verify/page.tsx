import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
      <div className="bg-gray-800 w-[400px] h-[500px] p-6 rounded-lg border-[1px] border-gray-700">
        Please check your email to verify your account.
      </div>
      </div>
    </div>
  );
}