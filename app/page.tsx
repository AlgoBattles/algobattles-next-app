import React from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import InitialPage from './_components/InitialPage'
import Head from 'next/head';

export default function Home() {
  return (
    <>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300&display=swap" rel="stylesheet"/>
    </Head>
    <div className="flex flex-col h-screen">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px', color: 'white'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
        <InitialPage></InitialPage>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gold-gradient"></div> */}
    </div>
    </>
  );
}
