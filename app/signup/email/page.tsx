import React from 'react';
import EmailInput from '../../_components/EmailInput'
import Head from 'next/head';


export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
        <EmailInput></EmailInput>
      </div>
    </div>
  );
}
