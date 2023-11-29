import React from 'react';
import Link from 'next/link'
import Button from '@mui/material/Button';
import AccountSetup from '../../_components/AccountSetup'
import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex flex-col h-screen ">
      <h1 style={{fontFamily: 'LuckiestGuy', fontSize: '50px', textAlign: 'left', width: '100%', marginTop: '20px', marginLeft: '20px'}} >AlgoBattles</h1>
      <div className="flex justify-center items-center flex-grow">
        <AccountSetup></AccountSetup>
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gold-gradient"></div> */}
    </div>
  );
}
