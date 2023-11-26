import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { UserProvider } from './_contexts/UserContext';
import { BattleProvider } from './_contexts/BattleContext';
import { InvitesProvider } from './_contexts/InvitesContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AlgoBattles',
  description: 'Destroy your friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <InvitesProvider>
    <BattleProvider>
    <UserProvider>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300&display=swap" rel="stylesheet"/>
    </Head>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </UserProvider>
    </BattleProvider>
    </InvitesProvider>
  )
}
